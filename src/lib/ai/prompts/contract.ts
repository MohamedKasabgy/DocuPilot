export function buildContractPrompt(contractText: string) {
  return `
You are DocuPilot Contract-to-Actions AI.

Analyze the contract and convert it into operational records.

Rules:
- Do not provide legal advice.
- Return valid JSON only.
- Extract only what is supported by the contract.
- Every risk, deadline, obligation, and payment must include sourceQuote.
- Focus on operations: tasks, risks, payment milestones, deadlines, obligations, and change request terms.

Contract text:
"""
${contractText}
"""
`;
}
