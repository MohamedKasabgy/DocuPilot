/** Structured invoice fields — all optional when raw text is provided. */
export interface InvoiceHints {
  invoiceNumber?: string;
  vendor?: string;
  amount?: number;
  currency?: string;
  dueDate?: string;
  description?: string;
  projectName?: string;
}

export interface ContractContext {
  id: string;
  title: string;
  client?: string | null;
  vendor?: string | null;
  totalValue?: number | null;
  currency?: string | null;
  status?: string | null;
  /** One-paragraph scope summary from contract analysis. */
  scopeSummary?: string | null;
  /** Items explicitly excluded from scope. */
  scopeExcluded?: string[] | null;
  /** Human-readable payment milestone labels. */
  paymentMilestones?: string[] | null;
  /** Change request / amendment policy. */
  changeRequestTerms?: string | null;
}

export function buildInvoicePrompt(
  invoiceText: string | null,
  hints: InvoiceHints,
  contract?: ContractContext | null
): string {
  const hasHints = Object.values(hints).some(v => v != null && v !== '');

  const invoiceSection = invoiceText
    ? `RAW INVOICE TEXT (primary source — extract all fields from this):
"""
${invoiceText}
"""
${hasHints ? `\nSTRUCTURED HINTS (supplement only — raw text takes precedence):
${hints.invoiceNumber ? `- Invoice Number hint: ${hints.invoiceNumber}` : ''}
${hints.vendor ? `- Vendor hint: ${hints.vendor}` : ''}
${hints.amount != null ? `- Amount hint: ${hints.amount} ${hints.currency ?? ''}` : ''}
${hints.dueDate ? `- Due Date hint: ${hints.dueDate}` : ''}
${hints.description ? `- Description hint: ${hints.description}` : ''}
${hints.projectName ? `- Project hint: ${hints.projectName}` : ''}`.replace(/\n-\s*\n/g, '\n').trim() : ''}`
    : `STRUCTURED INVOICE DATA:
- Invoice Number: ${hints.invoiceNumber ?? 'Unknown'}
- Vendor: ${hints.vendor ?? 'Unknown'}
- Amount: ${hints.amount != null ? `${hints.amount} ${hints.currency ?? 'SAR'}` : 'Unknown'}
- Due Date: ${hints.dueDate ?? 'Unknown'}
- Description: ${hints.description ?? '(none provided)'}
- Project: ${hints.projectName ?? 'Unknown'}`;

  let contractSection: string;
  if (contract) {
    const scopePart = contract.scopeSummary
      ? `\n- Scope Summary: ${contract.scopeSummary}`
      : '';
    const excludedPart = contract.scopeExcluded?.length
      ? `\n- Excluded from scope: ${contract.scopeExcluded.join('; ')}`
      : '';
    const milestonesPart = contract.paymentMilestones?.length
      ? `\n- Payment Milestones: ${contract.paymentMilestones.join(' | ')}`
      : '';
    const crTermsPart = contract.changeRequestTerms
      ? `\n- Change Request Terms: ${contract.changeRequestTerms}`
      : '';

    contractSection = `LINKED CONTRACT:
- Contract ID: ${contract.id}
- Title: ${contract.title}
- Client: ${contract.client ?? 'Unknown'}
- Vendor: ${contract.vendor ?? 'Unknown'}
- Total Contract Value: ${contract.totalValue != null ? `${contract.totalValue} ${contract.currency ?? 'USD'}` : 'Unknown'}
- Status: ${contract.status ?? 'Unknown'}${scopePart}${excludedPart}${milestonesPart}${crTermsPart}

Evaluate alignment with this contract:
1. Vendor match — does the invoice vendor match the contract vendor?
2. Amount reasonableness — is the invoice amount proportional to the contract value and milestone schedule?
3. Scope match — does the work described fall within included scope and not in excluded items?
4. If change request terms exist, flag if the work appears to be an unapproved addition.
Flag vendor_mismatch if vendors do not match.`;
  } else {
    contractSection = `No contract is linked. Set contractAlignment.aligned to false, contractAlignment.score to 0, and note in the summary that no contract context was provided.`;
  }

  return `You are DocuPilot Invoice Review AI.

Analyze the invoice data below and return ONE JSON object. Extract all fields from the provided data.

${invoiceSection}

${contractSection}

STRICT RULES:
- Return a single JSON object. NEVER wrap in an array.
- Extract vendor, invoiceNumber, amount, currency, dueDate from the provided data.
- duplicateRisk.level: "none" (no concern), "low" (minor), "medium" (same vendor billed recently for similar amount), "high" (likely exact duplicate).
- approvalRecommendation.action: "approve" (clean), "review" (needs verification), "reject" (clear issues), "escalate" (high value or policy breach).
- flags array may be empty [] if no issues found.
- suggestedApprovers: role titles such as "Finance Manager", "Project Manager", "CFO".
- confidenceScore: 0–100 — higher when raw invoice text is provided, lower when only structured hints exist.

Required JSON structure:
{
  "vendor": "string",
  "invoiceNumber": "string or null",
  "amount": number or null,
  "currency": "string or null",
  "dueDate": "string or null",
  "contractAlignment": {
    "aligned": true or false,
    "score": 0-100,
    "summary": "string",
    "discrepancies": ["string"]
  },
  "duplicateRisk": {
    "level": "none | low | medium | high",
    "reason": "string or null"
  },
  "flags": [
    {
      "type": "amount_mismatch | vendor_mismatch | duplicate | out_of_scope | missing_info | other",
      "severity": "low | medium | high | critical",
      "message": "string"
    }
  ],
  "approvalRecommendation": {
    "action": "approve | review | reject | escalate",
    "reason": "string",
    "suggestedApprovers": ["string"]
  },
  "analysisNotes": "string — 2–3 sentence summary of key findings",
  "confidenceScore": 85
}
`;
}
