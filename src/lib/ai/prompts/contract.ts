export function buildContractPrompt(contractText: string) {
  return `
You are DocuPilot Contract-to-Actions AI.

Analyze the contract below and return ONE JSON object with EXACTLY the structure shown.

STRICT RULES:
- Return a single JSON object. NEVER wrap it in an array.
- Do not provide legal advice.
- Use null for any field where the information is not present in the contract.
- Every item in risks, deadlines, payments, obligations, and deliverables MUST include a sourceQuote copied verbatim from the contract.
- All array fields must contain objects with the exact fields listed — never plain strings.
- "changeRequestTerms" must always be a single object, never an array.
- "confidenceScore" is a number 0–100 reflecting how completely the contract covers the required fields.

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
