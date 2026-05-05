import { DEMO_PROJECT_ID } from "@/lib/data/demo-store";
import type {
  ActionItem,
  RiskItem,
  ApprovalItem,
  Priority,
  Severity,
  ApprovalType,
  ApprovalStatus,
} from "@/lib/data/types";

export type ActionInput = Partial<Omit<ActionItem, "id" | "createdAt">> & {
  title: string;
};
export type RiskInput = Partial<Omit<RiskItem, "id" | "createdAt">> & {
  title: string;
};
export type ApprovalInput = Partial<Omit<ApprovalItem, "id" | "createdAt">> & {
  title: string;
};

export interface NormalizedAIOutput {
  summary: string;
  actions: ActionInput[];
  risks: RiskInput[];
  approvals: ApprovalInput[];
  linkedDocumentId?: string;
  linkedProjectId?: string;
  metadata?: Record<string, unknown>;
}

interface LinkContext {
  projectId?: string;
  documentId?: string;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (value == null) return fallback;
  try {
    return String(value);
  } catch {
    return fallback;
  }
}

function asPriority(value: unknown, fallback: Priority = "medium"): Priority {
  return value === "low" || value === "medium" || value === "high" || value === "critical"
    ? value
    : fallback;
}

function asSeverity(value: unknown, fallback: Severity = "medium"): Severity {
  return value === "low" || value === "medium" || value === "high" || value === "critical"
    ? value
    : fallback;
}

function applyLinks<T extends { projectId?: string; documentId?: string }>(
  item: T,
  ctx: LinkContext
): T {
  return {
    ...item,
    projectId: item.projectId ?? ctx.projectId ?? DEMO_PROJECT_ID,
    documentId: item.documentId ?? ctx.documentId,
  };
}

function finalize(
  summary: string,
  actions: ActionInput[],
  risks: RiskInput[],
  approvals: ApprovalInput[],
  ctx: LinkContext,
  metadata?: Record<string, unknown>
): NormalizedAIOutput {
  return {
    summary: asString(summary, "AI analysis completed."),
    actions: actions.map((a) => applyLinks(a, ctx)),
    risks: risks.map((r) => applyLinks(r, ctx)),
    approvals: approvals.map((a) => applyLinks(a, ctx)),
    linkedProjectId: ctx.projectId ?? DEMO_PROJECT_ID,
    linkedDocumentId: ctx.documentId,
    metadata,
  };
}

export function normalizeProjectIntelligenceOutput(
  output: unknown,
  ctx: LinkContext = {}
): NormalizedAIOutput {
  const o = (output ?? {}) as Record<string, unknown>;
  const finalDecision = (o.finalDecision ?? {}) as Record<string, unknown>;
  const executionPlan = (o.executionPlan ?? {}) as Record<string, unknown>;
  const businessUnderstanding = (o.businessUnderstanding ?? {}) as Record<string, unknown>;

  const summary = asString(
    finalDecision.summary ?? finalDecision.recommendation ?? businessUnderstanding.summary,
    "Project intelligence pipeline completed."
  );

  const planActions = Array.isArray(executionPlan.actions) ? executionPlan.actions : [];
  const actions: ActionInput[] = planActions.map((raw): ActionInput => {
    const a = (raw ?? {}) as Record<string, unknown>;
    return {
      title: asString(a.title ?? a.name, "Untitled action"),
      description: asString(a.description ?? a.detail, ""),
      status: "todo",
      priority: asPriority(a.priority),
      owner: typeof a.owner === "string" ? a.owner : undefined,
      dueDate: typeof a.dueDate === "string" ? a.dueDate : undefined,
      sourceType: "project_intelligence",
    };
  });

  const piRisks = Array.isArray(o.risks)
    ? o.risks
    : Array.isArray((finalDecision.risks as unknown[] | undefined))
      ? (finalDecision.risks as unknown[])
      : [];
  const risks: RiskInput[] = piRisks.map((raw): RiskInput => {
    const r = (raw ?? {}) as Record<string, unknown>;
    return {
      title: asString(r.title ?? r.name, "Identified risk"),
      description: asString(r.description, ""),
      severity: asSeverity(r.severity ?? r.level),
      source: "project_intelligence",
      impact: asString(r.impact, ""),
      suggestedAction: asString(r.suggestedAction ?? r.mitigation, ""),
      status: "open",
    };
  });

  return finalize(summary, actions, risks, [], ctx, { rawType: "project_intelligence" });
}

export function normalizeContractAnalysisOutput(
  output: unknown,
  ctx: LinkContext = {}
): NormalizedAIOutput {
  const o = (output ?? {}) as Record<string, unknown>;
  const scope = (o.scope ?? {}) as Record<string, unknown>;
  const summary = asString(
    scope.summary ?? o.summary ?? o.contractTitle,
    "Contract analysis completed."
  );

  const flagged = Array.isArray(o.flags) ? o.flags : [];
  const risks: RiskInput[] = flagged.map((raw): RiskInput => {
    const f = (raw ?? {}) as Record<string, unknown>;
    return {
      title: asString(f.title ?? f.label, "Contract concern"),
      description: asString(f.description ?? f.detail, ""),
      severity: asSeverity(f.severity ?? f.level),
      source: "contract",
      impact: asString(f.impact, ""),
      suggestedAction: asString(f.suggestedAction, "Review with legal."),
      status: "open",
    };
  });

  const approvals: ApprovalInput[] = [
    {
      title: asString(o.contractTitle, "Contract sign-off"),
      description: summary,
      type: "contract" as ApprovalType,
      status: "pending" as ApprovalStatus,
    },
  ];

  return finalize(summary, [], risks, approvals, ctx, { rawType: "contract" });
}

export function normalizeInvoiceAnalysisOutput(
  output: unknown,
  ctx: LinkContext = {}
): NormalizedAIOutput {
  const o = (output ?? {}) as Record<string, unknown>;
  const alignment = (o.contractAlignment ?? {}) as Record<string, unknown>;
  const dup = (o.duplicateRisk ?? {}) as Record<string, unknown>;

  const summary = asString(
    alignment.summary ?? o.summary,
    "Invoice analysis completed."
  );

  const risks: RiskInput[] = [];
  if (typeof dup.level === "string" && dup.level !== "none") {
    risks.push({
      title: "Possible duplicate invoice",
      description: asString(dup.reason, "Duplicate risk flagged by AI."),
      severity: asSeverity(dup.level),
      source: "invoice",
      impact: "Could cause double payment.",
      suggestedAction: "Cross-check against prior invoices before approval.",
      status: "open",
    });
  }
  const discrepancies = Array.isArray(alignment.discrepancies) ? alignment.discrepancies : [];
  for (const d of discrepancies) {
    risks.push({
      title: "Contract / invoice discrepancy",
      description: asString(d, ""),
      severity: "medium",
      source: "invoice",
      impact: "May indicate over-billing or scope mismatch.",
      suggestedAction: "Reconcile with contract milestone schedule.",
      status: "open",
    });
  }

  const amount = typeof o.amount === "number" ? o.amount : undefined;
  const currency = typeof o.currency === "string" ? o.currency : undefined;
  const approvals: ApprovalInput[] = [
    {
      title: `Approve invoice ${asString(o.invoiceNumber, "")}`.trim(),
      description: summary,
      type: "invoice" as ApprovalType,
      status: "pending" as ApprovalStatus,
      amount,
      currency,
    },
  ];

  return finalize(summary, [], risks, approvals, ctx, { rawType: "invoice" });
}

export function normalizeScopeAnalysisOutput(
  output: unknown,
  ctx: LinkContext = {}
): NormalizedAIOutput {
  const o = (output ?? {}) as Record<string, unknown>;
  const summary = asString(
    o.reason ?? o.recommendation,
    "Scope analysis completed."
  );

  const risks: RiskInput[] = [];
  if (o.riskImpact === "high" || o.riskImpact === "critical") {
    risks.push({
      title: "High-impact scope change",
      description: asString(o.reason, ""),
      severity: asSeverity(o.riskImpact),
      source: "scope",
      impact: asString(o.businessImpact ?? o.timelineImpact, ""),
      suggestedAction: asString(o.suggestedAction, "Convert to formal change request."),
      status: "open",
    });
  }

  const actions: ActionInput[] = [];
  const cr = (o.changeRequestSummary ?? {}) as Record<string, unknown>;
  if (cr && Object.keys(cr).length > 0) {
    actions.push({
      title: "Draft change request",
      description: asString(cr.summary ?? cr.description, "Convert scope request into a formal CR."),
      status: "todo",
      priority: "high",
      sourceType: "scope",
    });
  }

  const approvals: ApprovalInput[] = [];
  if (o.scopeStatus === "out_of_scope" || o.suggestedAction === "convert_to_cr") {
    approvals.push({
      title: "Approve scope change request",
      description: summary,
      type: "scope_change" as ApprovalType,
      status: "pending" as ApprovalStatus,
      reason: asString(o.reason, ""),
    });
  }

  return finalize(summary, actions, risks, approvals, ctx, { rawType: "scope" });
}
