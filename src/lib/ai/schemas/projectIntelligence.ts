import { z } from "zod";

// ─── Stage 1: Business Understanding ─────────────────────────────────────────

export const BusinessUnderstandingSchema = z.object({
  problem: z.string(),
  targetUsers: z.array(z.string()),
  businessGoal: z.string(),
  valueProposition: z.string(),
  coreUseCases: z.array(z.string()),
  assumptions: z.array(z.string()),
  missingInformation: z.array(z.string()),
  confidenceScore: z.number().min(0).max(100),
});

export type BusinessUnderstandingOutput = z.infer<typeof BusinessUnderstandingSchema>;

export const businessUnderstandingJsonSchema = {
  type: "object",
  properties: {
    problem: { type: "string" },
    targetUsers: { type: "array", items: { type: "string" } },
    businessGoal: { type: "string" },
    valueProposition: { type: "string" },
    coreUseCases: { type: "array", items: { type: "string" } },
    assumptions: { type: "array", items: { type: "string" } },
    missingInformation: { type: "array", items: { type: "string" } },
    confidenceScore: { type: "integer", minimum: 0, maximum: 100 },
  },
  required: [
    "problem",
    "targetUsers",
    "businessGoal",
    "valueProposition",
    "coreUseCases",
    "assumptions",
    "missingInformation",
    "confidenceScore",
  ],
};

// ─── Stage 2: Business Analysis ──────────────────────────────────────────────

export const BusinessAnalysisSchema = z.object({
  revenuePotential: z.enum(["low", "medium", "high"]),
  estimatedRevenueRange: z.string(),
  costLevel: z.enum(["low", "medium", "high"]),
  costBreakdown: z.array(
    z.object({
      category: z.string(),
      estimate: z.string(),
      notes: z.string().nullable(),
    })
  ),
  roiAssessment: z.enum(["low", "medium", "high"]),
  marketMaturity: z.enum(["emerging", "growing", "saturated"]),
  keyRisks: z.array(z.string()),
  opportunities: z.array(z.string()),
  recommendation: z.enum(["build", "reconsider", "needs_validation"]),
  reasoning: z.string(),
  confidenceScore: z.number().min(0).max(100),
});

export type BusinessAnalysisOutput = z.infer<typeof BusinessAnalysisSchema>;

export const businessAnalysisJsonSchema = {
  type: "object",
  properties: {
    revenuePotential: { type: "string", enum: ["low", "medium", "high"] },
    estimatedRevenueRange: { type: "string" },
    costLevel: { type: "string", enum: ["low", "medium", "high"] },
    costBreakdown: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          estimate: { type: "string" },
          notes: { type: "string", nullable: true },
        },
        required: ["category", "estimate"],
      },
    },
    roiAssessment: { type: "string", enum: ["low", "medium", "high"] },
    marketMaturity: { type: "string", enum: ["emerging", "growing", "saturated"] },
    keyRisks: { type: "array", items: { type: "string" } },
    opportunities: { type: "array", items: { type: "string" } },
    recommendation: { type: "string", enum: ["build", "reconsider", "needs_validation"] },
    reasoning: { type: "string" },
    confidenceScore: { type: "integer", minimum: 0, maximum: 100 },
  },
  required: [
    "revenuePotential",
    "estimatedRevenueRange",
    "costLevel",
    "costBreakdown",
    "roiAssessment",
    "marketMaturity",
    "keyRisks",
    "opportunities",
    "recommendation",
    "reasoning",
    "confidenceScore",
  ],
};

// ─── Stage 3: Business Rules ─────────────────────────────────────────────────

export const BusinessRulesSchema = z.object({
  businessRules: z.array(
    z.object({
      id: z.string(),
      rule: z.string(),
      rationale: z.string(),
      priority: z.enum(["low", "medium", "high", "critical"]),
    })
  ),
  constraints: z.array(z.string()),
  workflows: z.array(
    z.object({
      name: z.string(),
      steps: z.array(z.string()),
    })
  ),
  rolesInteractions: z.array(
    z.object({
      role: z.string(),
      interactsWith: z.array(z.string()),
      description: z.string(),
    })
  ),
  policyDecisions: z.array(z.string()),
  confidenceScore: z.number().min(0).max(100),
});

export type BusinessRulesOutput = z.infer<typeof BusinessRulesSchema>;

export const businessRulesJsonSchema = {
  type: "object",
  properties: {
    businessRules: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          rule: { type: "string" },
          rationale: { type: "string" },
          priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
        },
        required: ["id", "rule", "rationale", "priority"],
      },
    },
    constraints: { type: "array", items: { type: "string" } },
    workflows: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          steps: { type: "array", items: { type: "string" } },
        },
        required: ["name", "steps"],
      },
    },
    rolesInteractions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          role: { type: "string" },
          interactsWith: { type: "array", items: { type: "string" } },
          description: { type: "string" },
        },
        required: ["role", "interactsWith", "description"],
      },
    },
    policyDecisions: { type: "array", items: { type: "string" } },
    confidenceScore: { type: "integer", minimum: 0, maximum: 100 },
  },
  required: [
    "businessRules",
    "constraints",
    "workflows",
    "rolesInteractions",
    "policyDecisions",
    "confidenceScore",
  ],
};

// ─── Stage 4: Technical Blueprint ────────────────────────────────────────────
// Mirrors the existing SrsSchema shape so the SRS UI can render this directly.

export const TechnicalBlueprintSchema = z.object({
  projectBrief: z.object({
    projectName: z.string(),
    clientName: z.string().nullable(),
    industry: z.string(),
    complexity: z.enum(["low", "medium", "high"]),
    summary: z.string(),
  }),
  userRoles: z.array(
    z.object({
      role: z.string(),
      description: z.string(),
      permissions: z.array(z.string()),
    })
  ),
  mainFeatures: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(["low", "medium", "high", "critical"]),
    })
  ),
  functionalRequirements: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      priority: z.enum(["low", "medium", "high", "critical"]),
    })
  ),
  nonFunctionalRequirements: z.array(
    z.object({
      category: z.string(),
      requirement: z.string(),
    })
  ),
  assumptions: z.array(z.string()),
  mvpScope: z.array(z.string()),
  missingQuestions: z.array(z.string()),
  confidenceScore: z.number().min(0).max(100),
});

export type TechnicalBlueprintOutput = z.infer<typeof TechnicalBlueprintSchema>;

export const technicalBlueprintJsonSchema = {
  type: "object",
  properties: {
    projectBrief: {
      type: "object",
      properties: {
        projectName: { type: "string" },
        clientName: { type: "string", nullable: true },
        industry: { type: "string" },
        complexity: { type: "string", enum: ["low", "medium", "high"] },
        summary: { type: "string" },
      },
      required: ["projectName", "industry", "complexity", "summary"],
    },
    userRoles: {
      type: "array",
      items: {
        type: "object",
        properties: {
          role: { type: "string" },
          description: { type: "string" },
          permissions: { type: "array", items: { type: "string" } },
        },
        required: ["role", "description", "permissions"],
      },
    },
    mainFeatures: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
        },
        required: ["title", "description", "priority"],
      },
    },
    functionalRequirements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
        },
        required: ["id", "title", "description", "priority"],
      },
    },
    nonFunctionalRequirements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          requirement: { type: "string" },
        },
        required: ["category", "requirement"],
      },
    },
    assumptions: { type: "array", items: { type: "string" } },
    mvpScope: { type: "array", items: { type: "string" } },
    missingQuestions: { type: "array", items: { type: "string" } },
    confidenceScore: { type: "integer", minimum: 0, maximum: 100 },
  },
  required: [
    "projectBrief",
    "userRoles",
    "mainFeatures",
    "functionalRequirements",
    "nonFunctionalRequirements",
    "assumptions",
    "mvpScope",
    "missingQuestions",
    "confidenceScore",
  ],
};

// ─── Stage 5: Execution Plan ─────────────────────────────────────────────────

export const ExecutionPlanSchema = z.object({
  estimatedTimeline: z.string(),
  complexity: z.enum(["low", "medium", "high"]),
  teamRolesNeeded: z.array(
    z.object({
      role: z.string(),
      count: z.number().int().min(0),
      responsibilities: z.string(),
    })
  ),
  keyTasks: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      effort: z.string(),
    })
  ),
  milestones: z.array(
    z.object({
      name: z.string(),
      timeline: z.string(),
      deliverables: z.array(z.string()),
    })
  ),
  risksInExecution: z.array(z.string()),
  confidenceScore: z.number().min(0).max(100),
});

export type ExecutionPlanOutput = z.infer<typeof ExecutionPlanSchema>;

export const executionPlanJsonSchema = {
  type: "object",
  properties: {
    estimatedTimeline: { type: "string" },
    complexity: { type: "string", enum: ["low", "medium", "high"] },
    teamRolesNeeded: {
      type: "array",
      items: {
        type: "object",
        properties: {
          role: { type: "string" },
          count: { type: "integer", minimum: 0 },
          responsibilities: { type: "string" },
        },
        required: ["role", "count", "responsibilities"],
      },
    },
    keyTasks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          effort: { type: "string" },
        },
        required: ["title", "description", "effort"],
      },
    },
    milestones: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          timeline: { type: "string" },
          deliverables: { type: "array", items: { type: "string" } },
        },
        required: ["name", "timeline", "deliverables"],
      },
    },
    risksInExecution: { type: "array", items: { type: "string" } },
    confidenceScore: { type: "integer", minimum: 0, maximum: 100 },
  },
  required: [
    "estimatedTimeline",
    "complexity",
    "teamRolesNeeded",
    "keyTasks",
    "milestones",
    "risksInExecution",
    "confidenceScore",
  ],
};

// ─── Stage 6: Final Decision ─────────────────────────────────────────────────

export const FinalDecisionSchema = z.object({
  finalDecision: z.enum(["yes", "no", "conditional"]),
  confidenceScore: z.number().min(0).max(100),
  mainReason: z.string(),
  keyRisk: z.string(),
  suggestedNextStep: z.string(),
});

export type FinalDecisionOutput = z.infer<typeof FinalDecisionSchema>;

export const finalDecisionJsonSchema = {
  type: "object",
  properties: {
    finalDecision: { type: "string", enum: ["yes", "no", "conditional"] },
    confidenceScore: { type: "integer", minimum: 0, maximum: 100 },
    mainReason: { type: "string" },
    keyRisk: { type: "string" },
    suggestedNextStep: { type: "string" },
  },
  required: [
    "finalDecision",
    "confidenceScore",
    "mainReason",
    "keyRisk",
    "suggestedNextStep",
  ],
};

// ─── Combined pipeline output ────────────────────────────────────────────────

export const ProjectIntelligenceSchema = z.object({
  businessUnderstanding: BusinessUnderstandingSchema,
  businessAnalysis: BusinessAnalysisSchema,
  businessRules: BusinessRulesSchema,
  technicalBlueprint: TechnicalBlueprintSchema,
  executionPlan: ExecutionPlanSchema,
  finalDecision: FinalDecisionSchema,
});

export type ProjectIntelligenceOutput = z.infer<typeof ProjectIntelligenceSchema>;

export const projectIntelligenceJsonSchema = {
  type: "object",
  properties: {
    businessUnderstanding: businessUnderstandingJsonSchema,
    businessAnalysis: businessAnalysisJsonSchema,
    businessRules: businessRulesJsonSchema,
    technicalBlueprint: technicalBlueprintJsonSchema,
    executionPlan: executionPlanJsonSchema,
    finalDecision: finalDecisionJsonSchema,
  },
  required: [
    "businessUnderstanding",
    "businessAnalysis",
    "businessRules",
    "technicalBlueprint",
    "executionPlan",
    "finalDecision",
  ],
};

export type PipelineStage =
  | "businessUnderstanding"
  | "businessAnalysis"
  | "businessRules"
  | "technicalBlueprint"
  | "executionPlan"
  | "finalDecision";

export type PipelineLanguage = "english" | "arabic" | "bilingual";
