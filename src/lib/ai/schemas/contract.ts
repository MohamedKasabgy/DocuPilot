import { z } from "zod";

export const ContractAnalysisSchema = z.object({
  contractTitle: z.string(),
  projectName: z.string().nullable(),
  clientName: z.string().nullable(),

  parties: z.array(
    z.object({
      name: z.string(),
      role: z.enum(["client", "vendor", "partner", "unknown"]),
    })
  ),

  scope: z.object({
    included: z.array(z.string()),
    excluded: z.array(z.string()),
    summary: z.string(),
  }),

  deliverables: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      dueDate: z.string().nullable(),
      sourceQuote: z.string(),
    })
  ),

  deadlines: z.array(
    z.object({
      title: z.string(),
      dueDate: z.string().nullable(),
      relativeTimeline: z.string().nullable(),
      consequenceIfMissed: z.string().nullable(),
      priority: z.enum(["low", "medium", "high", "critical"]),
      sourceQuote: z.string(),
    })
  ),

  payments: z.array(
    z.object({
      title: z.string(),
      trigger: z.string(),
      percentage: z.string().nullable(),
      amount: z.string().nullable(),
      dueDate: z.string().nullable(),
      sourceQuote: z.string(),
    })
  ),

  obligations: z.array(
    z.object({
      title: z.string(),
      owner: z.enum(["client", "vendor", "both", "unknown"]),
      description: z.string(),
      suggestedAction: z.string(),
      severity: z.enum(["low", "medium", "high", "critical"]),
      sourceQuote: z.string(),
    })
  ),

  risks: z.array(
    z.object({
      title: z.string(),
      severity: z.enum(["low", "medium", "high", "critical"]),
      category: z.enum([
        "delivery",
        "payment",
        "scope",
        "legal",
        "compliance",
        "operational",
        "other",
      ]),
      impact: z.string(),
      reason: z.string(),
      suggestedAction: z.string(),
      sourceQuote: z.string(),
    })
  ),

  changeRequestTerms: z.object({
    requiresWrittenApproval: z.boolean(),
    summary: z.string(),
    sourceQuote: z.string().nullable(),
  }),

  suggestedActions: z.array(
    z.object({
      type: z.enum([
        "create_task",
        "create_risk",
        "create_payment_milestone",
        "create_approval",
        "draft_amendment",
        "notify_manager",
      ]),
      title: z.string(),
      description: z.string(),
      priority: z.enum(["low", "medium", "high", "critical"]),
    })
  ),

  executiveSummary: z.string(),
  confidenceScore: z.number().min(0).max(100),
});

export type ContractAnalysisOutput = z.infer<typeof ContractAnalysisSchema>;
