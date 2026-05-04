/**
 * Detect whether a contract is primarily Arabic by comparing Arabic Unicode
 * character count against Latin character count.
 * Threshold: Arabic makes up ≥ 30 % of (Arabic + Latin) chars → "arabic".
 */
export function detectContractLanguage(text: string): 'arabic' | 'english' {
  const arabicChars = (text.match(/[؀-ۿ]/g) ?? []).length;
  const latinChars  = (text.match(/[a-zA-Z]/g) ?? []).length;
  const total = arabicChars + latinChars;
  return total > 0 && arabicChars / total >= 0.3 ? 'arabic' : 'english';
}

const LANGUAGE_RULE_EN = `LANGUAGE: The contract text is in English. Write ALL narrative content (summaries, descriptions, titles, impacts, reasons, suggested actions) in English.`;

const LANGUAGE_RULE_AR = `LANGUAGE: The contract text is primarily in Arabic. Apply these rules:
- Write ALL narrative fields in Arabic: executiveSummary, scope.summary, scope.included items, scope.excluded items, deliverables.title, deliverables.description, obligations.title, obligations.description, obligations.suggestedAction, risks.title, risks.impact, risks.reason, risks.suggestedAction, deadlines.title, deadlines.consequenceIfMissed, deadlines.relativeTimeline, payments.title, payments.trigger, changeRequestTerms.summary, suggestedActions.title, suggestedActions.description.
- Keep ALL of these in English exactly as they appear in the contract: proper nouns (company names, product names), technical terms (GPS, API, WhatsApp, MVP, Beta, SaaS, UI, UX, Native, iOS, Android), enum values (client, vendor, critical, high, medium, low, delivery, scope, legal, compliance, operational, other), and JSON field names.
- Do NOT translate company names or party names — copy them verbatim from the contract.
- sourceQuote fields must always be verbatim copies from the contract (Arabic or English as they appear).`;

const DEADLINE_PRIORITY_RULE = `DEADLINE PRIORITY — apply these rules strictly:
- "critical": Only when a concrete absolute date exists (e.g. "by 1 March 2026") AND the obligation is a primary project milestone (delivery, go-live, payment due).
- "high": Project delivery milestones with a relative timeline AND an explicit penalty or consequence if missed.
- "medium": Post-delivery or warranty obligations (e.g. "fix critical bugs within 14 days after handoff") — these are conditional on a future handoff date, not immediately urgent.
- "low": Soft obligations, best-effort commitments, or items with no stated consequence if missed.
- NEVER mark a post-handoff warranty clause as "critical" unless the handoff date is already known and the deadline is near.`;

export function buildContractPrompt(
  contractText: string,
  depth: 'quick' | 'standard' | 'deep' = 'standard'
): string {
  const depthInstruction = {
    quick:    'Focus on the most critical items only. Return 1–2 items per array. Prioritise speed over completeness.',
    standard: 'Provide a balanced analysis. Return 2–4 items per array.',
    deep:     'Perform a thorough, exhaustive analysis. Extract every item you find. Return as many items as the contract contains.',
  }[depth];

  const detectedLang = detectContractLanguage(contractText);
  const languageRule = detectedLang === 'arabic' ? LANGUAGE_RULE_AR : LANGUAGE_RULE_EN;

  return `You are DocuPilot Contract-to-Actions AI.

Extraction depth: ${depth.toUpperCase()} — ${depthInstruction}

${languageRule}

${DEADLINE_PRIORITY_RULE}

Analyze the contract below and return ONE JSON object with EXACTLY the structure shown.

STRICT RULES:
- Return a single JSON object. NEVER wrap it in an array.
- Do not provide legal advice.
- Use null for any field where the information is not present in the contract.
- Every item in risks, deadlines, payments, obligations, and deliverables MUST include a sourceQuote copied verbatim from the contract.
- All array fields must contain objects with the exact fields listed — never plain strings.
- "changeRequestTerms" must always be a single object, never an array.
- "confidenceScore" is an integer 0–100 reflecting how completely the contract covers the required fields.

Required JSON structure (follow field names and types exactly):
{
  "contractTitle": "string — full title or subject of the contract",
  "projectName": "string or null — name of the project being contracted",
  "clientName": "string or null — name of the client party",
  "parties": [
    { "name": "string", "role": "client | vendor | partner | unknown" }
  ],
  "scope": {
    "included": ["string — each included feature or deliverable"],
    "excluded": ["string — each explicitly excluded item"],
    "summary": "string — one-paragraph scope summary"
  },
  "deliverables": [
    {
      "title": "string",
      "description": "string",
      "dueDate": "string or null",
      "sourceQuote": "string — verbatim quote from contract"
    }
  ],
  "deadlines": [
    {
      "title": "string",
      "dueDate": "string or null — absolute date if stated",
      "relativeTimeline": "string or null — e.g. '4 weeks from signing'",
      "consequenceIfMissed": "string or null",
      "priority": "low | medium | high | critical",
      "sourceQuote": "string — verbatim quote from contract"
    }
  ],
  "payments": [
    {
      "title": "string",
      "trigger": "string — what triggers this payment",
      "percentage": "string or null — e.g. '40%'",
      "amount": "string or null — e.g. '$10,000'",
      "dueDate": "string or null",
      "sourceQuote": "string — verbatim quote from contract"
    }
  ],
  "obligations": [
    {
      "title": "string",
      "owner": "client | vendor | both | unknown",
      "description": "string",
      "suggestedAction": "string — recommended operational action",
      "severity": "low | medium | high | critical",
      "sourceQuote": "string — verbatim quote from contract"
    }
  ],
  "risks": [
    {
      "title": "string",
      "severity": "low | medium | high | critical",
      "category": "delivery | payment | scope | legal | compliance | operational | other",
      "impact": "string — what happens if this risk materializes",
      "reason": "string — why this is a risk",
      "suggestedAction": "string",
      "sourceQuote": "string — verbatim quote from contract"
    }
  ],
  "changeRequestTerms": {
    "requiresWrittenApproval": true,
    "summary": "string — describe the change request process",
    "sourceQuote": "string or null"
  },
  "suggestedActions": [
    {
      "type": "create_task | create_risk | create_payment_milestone | create_approval | draft_amendment | notify_manager",
      "title": "string",
      "description": "string",
      "priority": "low | medium | high | critical"
    }
  ],
  "executiveSummary": "string — 2–4 sentence operational summary highlighting key risks, payment structure, and timeline",
  "confidenceScore": 85
}

Contract text:
"""
${contractText}
"""
`;
}
