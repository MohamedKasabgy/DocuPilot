import { z } from "zod";

export const InvoiceAnalysisSchema = z.object({
  vendor: z.string(),
  invoiceNumber: z.string().nullable(),
  amount: z.number().nullable(),
  currency: z.string().nullable(),
  dueDate: z.string().nullable(),

  contractAlignment: z.object({
    aligned: z.boolean(),
    score: z.number().min(0).max(100),
    summary: z.string(),
    discrepancies: z.array(z.string()),
  }),

  duplicateRisk: z.object({
    level: z.enum(["none", "low", "medium", "high"]),
    reason: z.string().nullable(),
  }),

  flags: z.array(
    z.object({
      type: z.enum([
        "amount_mismatch",
        "vendor_mismatch",
        "duplicate",
        "out_of_scope",
        "missing_info",
        "other",
      ]),
      severity: z.enum(["low", "medium", "high", "critical"]),
      message: z.string(),
    })
  ),

  approvalRecommendation: z.object({
    action: z.enum(["approve", "review", "reject", "escalate"]),
    reason: z.string(),
    suggestedApprovers: z.array(z.string()),
  }),

  analysisNotes: z.string(),
  confidenceScore: z.number().min(0).max(100),
});

export type InvoiceAnalysisOutput = z.infer<typeof InvoiceAnalysisSchema>;
