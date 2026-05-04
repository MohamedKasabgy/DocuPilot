import type { SrsOutput } from "@/lib/ai/schemas/srs";

export function buildSrsPrompt(clientRequest: string): string {
  return `You are DocuPilot SRS Generator — a senior software analyst at a software house.

Analyze the client request below and generate a comprehensive Software Requirements Specification.

Rules:
- Return valid JSON only matching the provided schema.
- If the input is Arabic, understand it fully and produce English output.
- Be realistic — identify what's missing, not just what's stated.
- Assign priorities based on business value and technical dependency.
- Generate meaningful functional requirement IDs (FR-01, FR-02, etc.).
- Keep the confidence score honest: 90+ only if the request is very detailed.

Client request:
"""
${clientRequest}
"""`;
}

export function buildRefinementPrompt(
  currentSrs: SrsOutput,
  refinementMessage: string
): string {
  return `You are DocuPilot SRS Generator. The user has an existing SRS and wants to refine it.

Current SRS:
${JSON.stringify(currentSrs, null, 2)}

User's refinement request:
"""
${refinementMessage}
"""

Rules:
- Return the COMPLETE updated SRS as valid JSON matching the schema.
- Apply the user's requested changes while preserving the rest.
- If the refinement adds scope, update features, requirements, and MVP accordingly.
- If the refinement removes scope, clean up related items.
- Adjust the confidence score if the refinement adds clarity.
- If the refinement is in Arabic, understand it and produce English output.`;
}
