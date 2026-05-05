import { z } from "zod";

export const ScopeAnalysisSchema = z.object({
  scopeStatus: z.enum(["in_scope", "out_of_scope", "needs_clarification"]),
  reason: z.string(),
  timelineImpact: z.enum(["low", "medium", "high"]),
  costImpact: z.enum(["low", "medium", "high"]),
  businessImpact: z.enum(["low", "medium", "high"]),
  riskImpact: z.enum(["low", "medium", "high"]),
  strategicImpact: z.string(),
  recommendation: z.enum(["approve", "reject", "convert_to_change_request"]),
  suggestedAction: z.string(),
  clientReply: z.string(),
  changeRequestSummary: z.string().nullable(),
  confidenceScore: z.number().min(0).max(100),
});

export type ScopeAnalysisOutput = z.infer<typeof ScopeAnalysisSchema>;

export const scopeAnalysisJsonSchema = {
  type: "object",
  properties: {
    scopeStatus: { type: "string", enum: ["in_scope", "out_of_scope", "needs_clarification"] },
    reason: { type: "string" },
    timelineImpact: { type: "string", enum: ["low", "medium", "high"] },
    costImpact: { type: "string", enum: ["low", "medium", "high"] },
    businessImpact: { type: "string", enum: ["low", "medium", "high"] },
    riskImpact: { type: "string", enum: ["low", "medium", "high"] },
    strategicImpact: { type: "string" },
    recommendation: { type: "string", enum: ["approve", "reject", "convert_to_change_request"] },
    suggestedAction: { type: "string" },
    clientReply: { type: "string" },
    changeRequestSummary: { type: "string", nullable: true },
    confidenceScore: { type: "integer", minimum: 0, maximum: 100 },
  },
  required: [
    "scopeStatus",
    "reason",
    "timelineImpact",
    "costImpact",
    "businessImpact",
    "riskImpact",
    "strategicImpact",
    "recommendation",
    "suggestedAction",
    "clientReply",
    "confidenceScore",
  ],
};

export const SCOPE_SCHEMA_HINT = `{
  "scopeStatus": "in_scope|out_of_scope|needs_clarification",
  "reason": "string",
  "timelineImpact": "low|medium|high",
  "costImpact": "low|medium|high",
  "businessImpact": "low|medium|high",
  "riskImpact": "low|medium|high",
  "strategicImpact": "string",
  "recommendation": "approve|reject|convert_to_change_request",
  "suggestedAction": "string",
  "clientReply": "string",
  "changeRequestSummary": "string|null",
  "confidenceScore": 0
}`;
