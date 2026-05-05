import type {
  BusinessUnderstandingOutput,
  BusinessAnalysisOutput,
  BusinessRulesOutput,
  TechnicalBlueprintOutput,
  ExecutionPlanOutput,
  PipelineLanguage,
} from "@/lib/ai/schemas/projectIntelligence";

// ─── Shared system context ───────────────────────────────────────────────────

const SYSTEM_CONTEXT = `You are DocuPilot Project Intelligence — a senior business + software analyst inside the DocuPilot operations platform.

DocuPilot helps software companies and service businesses turn raw client requests into structured decisions: Business Understanding, Business Analysis, Business Rules, Technical Blueprint (SRS), Execution Plan, and a Final Go/No-Go Decision.

Your audience:
- Project managers, account managers, founders, and tech leads at software houses serving Middle Eastern clients (Saudi Arabia, UAE, Egypt, Jordan).
- Demo audiences for portfolio and bootcamp settings (the NexaSoft / Al Waha Clinics scenario is a representative example).

Tone and discipline:
- Professional, concise, and decision-oriented. Do not use marketing fluff.
- You are NOT a finance source of truth. Any monetary number is an estimate with stated assumptions — never present figures as exact.
- Revenue, cost, and ROI must always be qualified ranges based on the request and reasonable industry analogues.
- Market comparisons must remain qualitative unless the user supplied explicit market data.
- Identify what is missing instead of inventing facts. Prefer "missing information" over silent assumption.
- Output JSON only, strictly matching the requested schema. No commentary, no markdown fences.`;

// ─── Language rules ──────────────────────────────────────────────────────────

const LANGUAGE_RULES: Record<PipelineLanguage, string> = {
  english:
    "Write all narrative fields in English. Keep enum values and IDs in their canonical English form (e.g., 'low', 'medium', 'high', 'BR-01').",
  arabic:
    "Write all narrative fields in Modern Standard Arabic (فصحى). Universally English technical acronyms (API, UI, MVP, SRS, ROI, SaaS, HTTP, SQL) may stay in English. Enum values and IDs MUST stay in their canonical English form.",
  bilingual:
    "Write all narrative fields in BOTH English and Arabic. For each string field, write the English text first, then ' / ', then the Arabic translation. Keep each language block coherent. Enum values and IDs MUST stay in their canonical English form.",
};

function languageHeader(language: PipelineLanguage): string {
  return `## Output language\n${LANGUAGE_RULES[language]}`;
}

function fence(label: string, content: string): string {
  return `### ${label}\n"""\n${content}\n"""`;
}

function jsonBlock(label: string, value: unknown): string {
  return `### ${label}\n\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;
}

// ─── Stage 1: Business Understanding ─────────────────────────────────────────

export function buildBusinessUnderstandingPrompt(
  clientRequest: string,
  language: PipelineLanguage
): string {
  return `${SYSTEM_CONTEXT}

${languageHeader(language)}

## Task — Stage 1: Business Understanding

Read the client request and extract a clean, decision-ready understanding of the business intent.

Required fields:
- problem: The core business problem the client is trying to solve.
- targetUsers: The primary user/customer groups who will use the product.
- businessGoal: The measurable business outcome the client wants.
- valueProposition: Why this matters — what changes for the user/business if it works.
- coreUseCases: 3–6 concrete use cases describing how users will use the product.
- assumptions: Reasonable assumptions you must make to interpret the request.
- missingInformation: Specific facts the client did NOT provide that should be clarified before commitment.
- confidenceScore: Integer 0–100. Use ≥80 only when the request is detailed and unambiguous.

Rules:
- Do not invent stakeholders or numbers. If the client did not state them, list them under missingInformation.
- coreUseCases must be user-perspective sentences ("As a … I can …" style is fine but not required).
- Output JSON only, matching the schema exactly.

${fence("Client request", clientRequest)}`;
}

// ─── Stage 2: Business Analysis ──────────────────────────────────────────────

export function buildBusinessAnalysisPrompt(
  clientRequest: string,
  understanding: BusinessUnderstandingOutput,
  language: PipelineLanguage
): string {
  return `${SYSTEM_CONTEXT}

${languageHeader(language)}

## Task — Stage 2: Business Analysis

Using the client request and the prior Business Understanding output, assess the commercial viability.

Required fields:
- revenuePotential: 'low' | 'medium' | 'high'.
- estimatedRevenueRange: A qualified range string (e.g., "USD 30k–80k annual recurring within first 12 months, assuming 100–250 paying clinics"). Always include the assumption that drives the range.
- costLevel: 'low' | 'medium' | 'high'.
- costBreakdown: 3–6 cost categories (e.g., development, infrastructure, integrations, support, compliance) with an estimate string and optional notes. Estimates are qualified ranges, never exact figures.
- roiAssessment: 'low' | 'medium' | 'high'.
- marketMaturity: 'emerging' | 'growing' | 'saturated'.
- keyRisks: Commercial/market risks (not engineering risks).
- opportunities: Upsell, expansion, partnership, or differentiation angles.
- recommendation: 'build' | 'reconsider' | 'needs_validation'.
- reasoning: One paragraph explaining the recommendation, anchored in the inputs.
- confidenceScore: Integer 0–100. Lower this when the request lacks pricing, scale, or competition data.

Rules:
- Never present financial numbers as exact. Always show them as ranges with assumptions.
- Market comparisons must stay qualitative unless the client supplied explicit market data.
- If the input is too thin to recommend 'build', prefer 'needs_validation' and surface gaps in keyRisks.
- Output JSON only.

${fence("Client request", clientRequest)}

${jsonBlock("Stage 1 — Business Understanding", understanding)}`;
}

// ─── Stage 3: Business Rules ─────────────────────────────────────────────────

export function buildBusinessRulesPrompt(
  clientRequest: string,
  understanding: BusinessUnderstandingOutput,
  analysis: BusinessAnalysisOutput,
  language: PipelineLanguage
): string {
  return `${SYSTEM_CONTEXT}

${languageHeader(language)}

## Task — Stage 3: Business Rules

Using the client request, Business Understanding, and Business Analysis, derive the operational rules and constraints that must govern the product's behaviour.

Required fields:
- businessRules: Each rule has { id (BR-01, BR-02, …), rule, rationale, priority: 'low'|'medium'|'high'|'critical' }.
- constraints: Hard constraints on the system (regulatory, data residency, language, accessibility, performance commitments).
- workflows: Each workflow has { name, steps (ordered) } describing how a real user task flows end to end.
- rolesInteractions: For each role, list { role, interactsWith (other roles or systems), description }.
- policyDecisions: Open policy questions the business must resolve before launch (pricing model, refund policy, escalation chains, audit retention).
- confidenceScore: Integer 0–100.

Rules:
- Business rules must be testable and unambiguous (e.g., "Patients cannot book a slot already held by another patient within the last 5 minutes.").
- Do not duplicate items between businessRules and constraints — rules are behavioural, constraints are external limits.
- IDs must use the BR-XX format with zero-padded numbers.
- Output JSON only.

${fence("Client request", clientRequest)}

${jsonBlock("Stage 1 — Business Understanding", understanding)}

${jsonBlock("Stage 2 — Business Analysis", analysis)}`;
}

// ─── Stage 4: Technical Blueprint ────────────────────────────────────────────

export function buildTechnicalBlueprintPrompt(
  clientRequest: string,
  understanding: BusinessUnderstandingOutput,
  analysis: BusinessAnalysisOutput,
  rules: BusinessRulesOutput,
  language: PipelineLanguage
): string {
  return `${SYSTEM_CONTEXT}

${languageHeader(language)}

## Task — Stage 4: Technical Blueprint (SRS)

Produce a structured Software Requirements Specification for the project. The shape mirrors DocuPilot's existing SRS schema so this output renders directly in the SRS UI.

Required fields:
- projectBrief: { projectName, clientName (nullable), industry, complexity: 'low'|'medium'|'high', summary }.
- userRoles: Each { role, description, permissions[] }.
- mainFeatures: Each { title, description, priority: 'low'|'medium'|'high'|'critical' }.
- functionalRequirements: Each { id (FR-01, FR-02, …), title, description, priority }.
- nonFunctionalRequirements: Each { category, requirement }. Cover performance, availability, security, usability, scalability where applicable.
- assumptions: Engineering assumptions made to scope the build.
- mvpScope: 3–5 phases or scope items achievable in 4–8 weeks by a 2–4 person team.
- missingQuestions: Specific clarifications the engineering team needs before sign-off.
- confidenceScore: Integer 0–100.

Rules:
- Functional requirement IDs must use FR-XX format with zero-padded numbers.
- The blueprint must be consistent with the prior stages' rules and constraints.
- Do NOT include cost or revenue figures — that belongs in the Business Analysis stage.
- Output JSON only.

${fence("Client request", clientRequest)}

${jsonBlock("Stage 1 — Business Understanding", understanding)}

${jsonBlock("Stage 2 — Business Analysis", analysis)}

${jsonBlock("Stage 3 — Business Rules", rules)}`;
}

// ─── Stage 5: Execution Plan ─────────────────────────────────────────────────

export function buildExecutionPlanPrompt(
  clientRequest: string,
  understanding: BusinessUnderstandingOutput,
  analysis: BusinessAnalysisOutput,
  rules: BusinessRulesOutput,
  blueprint: TechnicalBlueprintOutput,
  language: PipelineLanguage
): string {
  return `${SYSTEM_CONTEXT}

${languageHeader(language)}

## Task — Stage 5: Execution Plan

Using all prior stages, produce a realistic delivery plan a software house can act on.

Required fields:
- estimatedTimeline: Qualified range string (e.g., "10–14 weeks end-to-end for MVP, with 4-week stabilization buffer").
- complexity: 'low' | 'medium' | 'high'.
- teamRolesNeeded: Each { role, count (integer), responsibilities }. Cover engineering, design, PM, QA, and any specialists driven by the rules/constraints.
- keyTasks: Each { title, description, effort } where effort is a qualified range (e.g., "1–2 weeks").
- milestones: Each { name, timeline, deliverables[] } in delivery order.
- risksInExecution: Engineering and delivery risks (not commercial — those live in Business Analysis).
- confidenceScore: Integer 0–100.

Rules:
- Effort estimates are ranges, never single numbers presented as fact.
- Milestones must reference deliverables that map to the blueprint's mainFeatures or functional requirements.
- Output JSON only.

${fence("Client request", clientRequest)}

${jsonBlock("Stage 1 — Business Understanding", understanding)}

${jsonBlock("Stage 2 — Business Analysis", analysis)}

${jsonBlock("Stage 3 — Business Rules", rules)}

${jsonBlock("Stage 4 — Technical Blueprint", blueprint)}`;
}

// ─── Stage 6: Final Decision ─────────────────────────────────────────────────

export function buildFinalDecisionPrompt(
  understanding: BusinessUnderstandingOutput,
  analysis: BusinessAnalysisOutput,
  rules: BusinessRulesOutput,
  blueprint: TechnicalBlueprintOutput,
  plan: ExecutionPlanOutput,
  language: PipelineLanguage
): string {
  return `${SYSTEM_CONTEXT}

${languageHeader(language)}

## Task — Stage 6: Final Decision

Synthesize all five prior stages into a single Go/No-Go recommendation for the software house.

Required fields:
- finalDecision: 'yes' | 'no' | 'conditional'.
- confidenceScore: Integer 0–100. Reflect your honest confidence given the quality of the inputs.
- mainReason: One sentence explaining why this is the recommendation.
- keyRisk: The single biggest risk that could invalidate the recommendation.
- suggestedNextStep: One concrete action the team should take next (validate X with the client, run a paid pilot, draft contract, etc.).

Rules:
- 'conditional' is the right answer when the recommendation depends on a clarification or validation step — say what condition must be met in mainReason and suggestedNextStep.
- Do not introduce new facts. Synthesize only.
- Output JSON only.

${jsonBlock("Stage 1 — Business Understanding", understanding)}

${jsonBlock("Stage 2 — Business Analysis", analysis)}

${jsonBlock("Stage 3 — Business Rules", rules)}

${jsonBlock("Stage 4 — Technical Blueprint", blueprint)}

${jsonBlock("Stage 5 — Execution Plan", plan)}`;
}

// ─── Single-call combined prompt ─────────────────────────────────────────────
// Produces all six pipeline stages in one Gemini request. The route validates
// the result against ProjectIntelligenceSchema.

export type AnalysisDepth = "quick" | "standard" | "deep";

const DEPTH_RULES: Record<AnalysisDepth, string> = {
  quick:
    "Be brief and executive-level. Cap arrays at 3 items each. Limit functionalRequirements to 4, businessRules to 4, milestones to 3. Suitable for a 5-minute scan.",
  standard:
    "Provide a balanced, professional report. 4–6 items per array. functionalRequirements 5–8. businessRules 5–8. milestones 4–5.",
  deep:
    "Be thorough. 6–10 items per array. functionalRequirements 8–12. businessRules 8–12. milestones 5–7. Cover edge cases, validation, and integration concerns.",
};

export function buildProjectIntelligencePrompt(
  clientRequest: string,
  language: PipelineLanguage,
  analysisDepth: AnalysisDepth,
  includeTechnicalBlueprint: boolean
): string {
  const blueprintRule = includeTechnicalBlueprint
    ? "Produce a full technicalBlueprint section with realistic detail."
    : "Technical blueprint is NOT requested. Still return the technicalBlueprint object to satisfy the schema, but keep every array minimal (1–2 items each) and set confidenceScore to 0. The downstream UI will hide it.";

  return `${SYSTEM_CONTEXT}

${languageHeader(language)}

## Analysis depth — ${analysisDepth.toUpperCase()}
${DEPTH_RULES[analysisDepth]}

## Technical Blueprint inclusion
${blueprintRule}

## Task — Run the full Project Intelligence pipeline in one response

Read the client request and produce all six pipeline stages, internally consistent with each other (later stages must reference and align with earlier stages). Return a single JSON object with EXACTLY these top-level keys:

1. **businessUnderstanding** — { problem, targetUsers[], businessGoal, valueProposition, coreUseCases[], assumptions[], missingInformation[], confidenceScore (0–100 integer) }
2. **businessAnalysis** — { revenuePotential ('low'|'medium'|'high'), estimatedRevenueRange (qualified range string with assumption), costLevel, costBreakdown[{category,estimate,notes|null}], roiAssessment, marketMaturity ('emerging'|'growing'|'saturated'), keyRisks[], opportunities[], recommendation ('build'|'reconsider'|'needs_validation'), reasoning, confidenceScore }
3. **businessRules** — { businessRules[{id (BR-01…),rule,rationale,priority}], constraints[], workflows[{name,steps[]}], rolesInteractions[{role,interactsWith[],description}], policyDecisions[], confidenceScore }
4. **technicalBlueprint** — { projectBrief{projectName,clientName|null,industry,complexity,summary}, userRoles[{role,description,permissions[]}], mainFeatures[{title,description,priority}], functionalRequirements[{id (FR-01…),title,description,priority}], nonFunctionalRequirements[{category,requirement}], assumptions[], mvpScope[], missingQuestions[], confidenceScore }
5. **executionPlan** — { estimatedTimeline (qualified range), complexity, teamRolesNeeded[{role,count,responsibilities}], keyTasks[{title,description,effort (qualified range)}], milestones[{name,timeline,deliverables[]}], risksInExecution[], confidenceScore }
6. **finalDecision** — { finalDecision ('yes'|'no'|'conditional'), confidenceScore, mainReason, keyRisk, suggestedNextStep }

Hard rules (will cause the response to be rejected if violated):
- Output JSON only. No markdown, no commentary, no code fences.
- Every confidenceScore must be an integer 0–100 (not a 0–1 fraction).
- Financial figures (revenue, costs, ROI) must be qualified ranges with the assumption stated inline. Never present numbers as exact.
- Market comparisons must remain qualitative unless the client supplied explicit market data.
- IDs use BR-01, BR-02, … (zero-padded) for businessRules and FR-01, FR-02, … for functionalRequirements.
- If finalDecision is 'conditional', mainReason and suggestedNextStep must state the condition that must be met.
- Sections must be internally consistent: finalDecision must be supported by the other five stages; executionPlan.milestones must reference deliverables that exist in technicalBlueprint.mainFeatures or functionalRequirements (when blueprint is requested).

${fence("Client request", clientRequest)}`;
}

// ─── Compact schema hints for Qwen fallback ──────────────────────────────────
// Gemini receives the full responseSchema separately; Qwen needs an inline hint.

export const SCHEMA_HINTS = {
  businessUnderstanding: `{
  "problem": "string",
  "targetUsers": ["string"],
  "businessGoal": "string",
  "valueProposition": "string",
  "coreUseCases": ["string"],
  "assumptions": ["string"],
  "missingInformation": ["string"],
  "confidenceScore": 0
}`,
  businessAnalysis: `{
  "revenuePotential": "low|medium|high",
  "estimatedRevenueRange": "string",
  "costLevel": "low|medium|high",
  "costBreakdown": [{ "category": "string", "estimate": "string", "notes": "string|null" }],
  "roiAssessment": "low|medium|high",
  "marketMaturity": "emerging|growing|saturated",
  "keyRisks": ["string"],
  "opportunities": ["string"],
  "recommendation": "build|reconsider|needs_validation",
  "reasoning": "string",
  "confidenceScore": 0
}`,
  businessRules: `{
  "businessRules": [{ "id": "BR-01", "rule": "string", "rationale": "string", "priority": "low|medium|high|critical" }],
  "constraints": ["string"],
  "workflows": [{ "name": "string", "steps": ["string"] }],
  "rolesInteractions": [{ "role": "string", "interactsWith": ["string"], "description": "string" }],
  "policyDecisions": ["string"],
  "confidenceScore": 0
}`,
  technicalBlueprint: `{
  "projectBrief": { "projectName": "string", "clientName": "string|null", "industry": "string", "complexity": "low|medium|high", "summary": "string" },
  "userRoles": [{ "role": "string", "description": "string", "permissions": ["string"] }],
  "mainFeatures": [{ "title": "string", "description": "string", "priority": "low|medium|high|critical" }],
  "functionalRequirements": [{ "id": "FR-01", "title": "string", "description": "string", "priority": "low|medium|high|critical" }],
  "nonFunctionalRequirements": [{ "category": "string", "requirement": "string" }],
  "assumptions": ["string"],
  "mvpScope": ["string"],
  "missingQuestions": ["string"],
  "confidenceScore": 0
}`,
  executionPlan: `{
  "estimatedTimeline": "string",
  "complexity": "low|medium|high",
  "teamRolesNeeded": [{ "role": "string", "count": 0, "responsibilities": "string" }],
  "keyTasks": [{ "title": "string", "description": "string", "effort": "string" }],
  "milestones": [{ "name": "string", "timeline": "string", "deliverables": ["string"] }],
  "risksInExecution": ["string"],
  "confidenceScore": 0
}`,
  finalDecision: `{
  "finalDecision": "yes|no|conditional",
  "confidenceScore": 0,
  "mainReason": "string",
  "keyRisk": "string",
  "suggestedNextStep": "string"
}`,
} as const;

export const PROJECT_INTELLIGENCE_SCHEMA_HINT = `{
  "businessUnderstanding": ${SCHEMA_HINTS.businessUnderstanding},
  "businessAnalysis": ${SCHEMA_HINTS.businessAnalysis},
  "businessRules": ${SCHEMA_HINTS.businessRules},
  "technicalBlueprint": ${SCHEMA_HINTS.technicalBlueprint},
  "executionPlan": ${SCHEMA_HINTS.executionPlan},
  "finalDecision": ${SCHEMA_HINTS.finalDecision}
}`;
