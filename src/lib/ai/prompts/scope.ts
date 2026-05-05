export type ScopeLanguage = "english" | "arabic" | "bilingual" | "auto";

const SYSTEM_CONTEXT = `You are DocuPilot Scope Impact Engine — a senior software-house operations analyst inside the DocuPilot platform.

Your role: compare a new client request against the project's existing SRS and contract scope, then classify it and assess its full operational impact.

Hard rules:
- Do NOT provide legal advice. Operational reasoning only — no contract law interpretations, no liability claims, no warranty language. If a request appears to involve legal questions, escalate by recommending the team consult counsel; do not draft legal text yourself.
- Output JSON only, strictly matching the requested schema. No markdown, no commentary, no code fences.
- Stay grounded in the inputs. Never invent contract clauses or SRS items that the user didn't supply.
- The clientReply must be polished, professional, and customer-friendly — never internal jargon or harsh language.
- Whenever you classify a request as out_of_scope, recommend converting it to a formal change request and provide a changeRequestSummary.

Tone:
- Professional, decision-oriented, suitable for a software house serving Middle Eastern clients (Saudi Arabia, UAE, Egypt, Jordan).`;

const LANGUAGE_RULES: Record<ScopeLanguage, string> = {
  auto: "Detect the language of the new request. Write 'reason', 'strategicImpact', 'suggestedAction', 'clientReply', and 'changeRequestSummary' in the same language as the request. Enum values stay in canonical English.",
  english: "Write all narrative fields in English. Enum values stay in canonical English.",
  arabic:
    "Write all narrative fields in Modern Standard Arabic (فصحى). Universally English technical acronyms (API, UI, MVP, SRS, iOS, Android) may stay in English. Enum values stay in canonical English.",
  bilingual:
    "Write all narrative fields in BOTH English and Arabic. For each string field, write the English text first, then ' / ', then the Arabic translation. Enum values stay in canonical English.",
};

export interface ScopePromptInput {
  newRequest: string;
  existingSrs?: string;
  contractScope?: string;
  language: ScopeLanguage;
}

export function buildScopePrompt(input: ScopePromptInput): string {
  const { newRequest, existingSrs, contractScope, language } = input;

  const srsBlock = existingSrs && existingSrs.trim().length > 0
    ? `### Existing SRS\n"""\n${existingSrs}\n"""`
    : `### Existing SRS\n(Not supplied. Treat the contract scope as the single source of truth, and lower confidenceScore accordingly.)`;

  const contractBlock = contractScope && contractScope.trim().length > 0
    ? `### Contract scope\n"""\n${contractScope}\n"""`
    : `### Contract scope\n(Not supplied. Treat the SRS as the single source of truth, and lower confidenceScore accordingly.)`;

  return `${SYSTEM_CONTEXT}

## Output language
${LANGUAGE_RULES[language]}

## Task — Scope Impact Analysis

Compare the new client request against the existing SRS and contract scope, then return a single JSON object with:

- **scopeStatus**: 'in_scope' (fully covered by SRS/contract) | 'out_of_scope' (clearly outside both) | 'needs_clarification' (overlapping but ambiguous wording, missing context, or partially covered).
- **reason**: One paragraph explaining the classification, citing the SRS or contract scope wording where possible.
- **timelineImpact**: 'low' | 'medium' | 'high' — how much the request would shift delivery dates if accepted.
- **costImpact**: 'low' | 'medium' | 'high' — how much it would shift the project budget.
- **businessImpact**: 'low' | 'medium' | 'high' — effect on the client's business outcomes (positive or negative).
- **riskImpact**: 'low' | 'medium' | 'high' — engineering, operational, security, or compliance risk introduced.
- **strategicImpact**: One sentence on how this fits the broader product/business strategy (upsell potential, distraction, brand fit).
- **recommendation**: 'approve' (accept inside current contract — only when in_scope), 'reject' (decline politely — only when scope is impossible or strategically wrong), or 'convert_to_change_request' (formal scope change, the default for out_of_scope).
- **suggestedAction**: Concrete next operational step the team should take (who does what, by when in qualified terms).
- **clientReply**: A polished, customer-ready reply matching the requested language. Open with thanks, state the classification with reasoning, propose the path forward (CR / clarification / acceptance). No legal language. No internal jargon.
- **changeRequestSummary**: REQUIRED whenever recommendation is 'convert_to_change_request' — a 2–4 sentence summary suitable for a CR document body. Otherwise null.
- **confidenceScore**: Integer 0–100. Lower this when SRS or contract scope was not supplied or is ambiguous.

Decision guidelines:
- in_scope ⇒ recommendation usually 'approve'.
- out_of_scope ⇒ recommendation 'convert_to_change_request' unless the request is impossible or strategically harmful, in which case 'reject'.
- needs_clarification ⇒ recommendation typically 'convert_to_change_request' once clarified, or temporarily defer with 'reject' only if clarification reveals the request is impossible.

${srsBlock}

${contractBlock}

### New client request
"""
${newRequest}
"""`;
}
