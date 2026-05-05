import "server-only";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/db/supabaseAdmin";

// ─── Types ───────────────────────────────────────────────────────────────────

export type DecisionKind =
  | "build"
  | "conditional"
  | "needs_validation"
  | "scope_change"
  | "invoice_approval";

export interface DecisionItem {
  id: string;
  kind: DecisionKind;
  title: string;
  context: string;
  badge: string;
  badgeColor: string;
  href: string;
}

export interface ProjectHealthItem {
  id: string;
  name: string;
  healthScore: number;
  roi: "low" | "medium" | "high";
  riskLevel: "low" | "medium" | "high";
  timelineStatus: "on_track" | "at_risk" | "delayed";
}

export interface FinancialInsight {
  estimatedRevenueRange: string;
  costLevel: "low" | "medium" | "high";
  paymentMilestones: { label: string; status: "paid" | "due" | "upcoming"; amount: string }[];
  pendingInvoices: number;
  approvedInvoices: number;
}

export interface ScopeImpactSummary {
  outOfScopeCount: number;
  needsClarificationCount: number;
  costImpactLabel: "low" | "medium" | "high";
  timelineImpactLabel: "low" | "medium" | "high";
  recommendedAction: string;
}

export interface NextActionItem {
  title: string;
  source: "project_intelligence" | "contract" | "invoice" | "scope_guard" | "risk";
  meta: string;
  badge: string;
  badgeColor: string;
  href: string;
}

export interface DashboardData {
  source: "live" | "fallback" | "mixed";
  decisions: DecisionItem[];
  projects: ProjectHealthItem[];
  financial: FinancialInsight;
  scopeImpact: ScopeImpactSummary;
  nextActions: NextActionItem[];
}

// ─── Fallback demo data (NexaSoft / Al Waha Clinics) ─────────────────────────

const FALLBACK: DashboardData = {
  source: "fallback",
  decisions: [
    {
      id: "fb-pi-1",
      kind: "conditional",
      title: "Clinic Booking Platform — pilot decision",
      context: "Project Intelligence recommends a 4-week paid pilot before full build commitment.",
      badge: "Conditional",
      badgeColor: "var(--status-warning)",
      href: "/srs-generator",
    },
    {
      id: "fb-scope-1",
      kind: "scope_change",
      title: "Mobile app request — out of scope",
      context: "Scope Impact Engine flagged iOS/Android request. CR-2026-014 awaiting approval.",
      badge: "Out of Scope",
      badgeColor: "var(--status-danger)",
      href: "/scope-guard",
    },
    {
      id: "fb-inv-1",
      kind: "invoice_approval",
      title: "DesignPro Studio invoice $12,450 awaiting approval",
      context: "PM signoff complete. Pending Finance + Director.",
      badge: "Awaiting",
      badgeColor: "var(--accent-primary)",
      href: "/approvals",
    },
    {
      id: "fb-pi-2",
      kind: "needs_validation",
      title: "OMNIMOBILE retail platform — needs validation",
      context: "Pricing assumptions and compliance constraints not yet confirmed by client.",
      badge: "Needs Validation",
      badgeColor: "var(--accent-ai)",
      href: "/srs-generator",
    },
  ],
  projects: [
    {
      id: "clinic-booking-platform",
      name: "Clinic Booking Platform",
      healthScore: 78,
      roi: "medium",
      riskLevel: "medium",
      timelineStatus: "at_risk",
    },
    {
      id: "alpha-platform",
      name: "Alpha Platform v2.0",
      healthScore: 65,
      roi: "high",
      riskLevel: "high",
      timelineStatus: "delayed",
    },
    {
      id: "omnimobile-retail",
      name: "OMNIMOBILE Retail",
      healthScore: 88,
      roi: "high",
      riskLevel: "low",
      timelineStatus: "on_track",
    },
  ],
  financial: {
    estimatedRevenueRange: "USD 30k–80k ARR within 12 months (assumes 100–250 paying clinics)",
    costLevel: "medium",
    paymentMilestones: [
      { label: "Kickoff (30%)", status: "paid", amount: "$73,500" },
      { label: "Mid-build (40%)", status: "due", amount: "$98,000" },
      { label: "Delivery (30%)", status: "upcoming", amount: "$73,500" },
    ],
    pendingInvoices: 8,
    approvedInvoices: 17,
  },
  scopeImpact: {
    outOfScopeCount: 1,
    needsClarificationCount: 2,
    costImpactLabel: "high",
    timelineImpactLabel: "high",
    recommendedAction: "Convert mobile app request to formal Change Request. Estimate due Thursday.",
  },
  nextActions: [
    {
      title: "Approve Invoice INV-2026-042 before deadline",
      source: "invoice",
      meta: "Saves $1,245 in late fees · Due in 4h",
      badge: "Urgent",
      badgeColor: "var(--status-danger)",
      href: "/approvals",
    },
    {
      title: "Run paid pilot for Clinic Booking Platform",
      source: "project_intelligence",
      meta: "Validates pricing + uptake before full build · Confidence 70%",
      badge: "Decision",
      badgeColor: "var(--accent-ai)",
      href: "/srs-generator",
    },
    {
      title: "Issue change request for mobile app scope",
      source: "scope_guard",
      meta: "Protects ~$18k in unbilled work · CR-2026-014",
      badge: "Revenue",
      badgeColor: "var(--status-success)",
      href: "/scope-guard",
    },
    {
      title: "Assign owner for API integration risk on Clinic Booking",
      source: "risk",
      meta: "Reduces probability 68% → 30%",
      badge: "High Impact",
      badgeColor: "var(--status-warning)",
      href: "/risks",
    },
    {
      title: "Review extracted obligations from Contract #CON-2024-089",
      source: "contract",
      meta: "3 risks flagged · 2 deadlines in 14 days",
      badge: "Contract",
      badgeColor: "var(--accent-primary)",
      href: "/contracts",
    },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function levelFromImpact(label: string | null | undefined): "low" | "medium" | "high" {
  if (label === "high" || label === "medium" || label === "low") return label;
  return "medium";
}

function decisionFromPI(row: { id: string; output_json: unknown; project_id: string | null }): DecisionItem | null {
  const output = row.output_json as { finalDecision?: { finalDecision?: string; mainReason?: string }; technicalBlueprint?: { projectBrief?: { projectName?: string } } } | null;
  const decision = output?.finalDecision?.finalDecision;
  const projectName = output?.technicalBlueprint?.projectBrief?.projectName ?? row.project_id ?? "Project";
  if (decision === "yes") {
    return {
      id: `pi-${row.id}`,
      kind: "build",
      title: `${projectName} — recommended to build`,
      context: output?.finalDecision?.mainReason ?? "Project Intelligence recommends proceeding.",
      badge: "Build",
      badgeColor: "var(--status-success)",
      href: "/srs-generator",
    };
  }
  if (decision === "conditional") {
    return {
      id: `pi-${row.id}`,
      kind: "conditional",
      title: `${projectName} — conditional decision`,
      context: output?.finalDecision?.mainReason ?? "Project Intelligence recommends proceeding under specific conditions.",
      badge: "Conditional",
      badgeColor: "var(--status-warning)",
      href: "/srs-generator",
    };
  }
  if (decision === "no") {
    return {
      id: `pi-${row.id}`,
      kind: "needs_validation",
      title: `${projectName} — recommended to reconsider`,
      context: output?.finalDecision?.mainReason ?? "Project Intelligence flagged commercial or technical concerns.",
      badge: "Reconsider",
      badgeColor: "var(--status-danger)",
      href: "/srs-generator",
    };
  }
  return null;
}

// ─── Public loader ───────────────────────────────────────────────────────────

export async function loadDashboardData(): Promise<DashboardData> {
  if (!isSupabaseConfigured()) return FALLBACK;

  try {
    const [piRes, scopeRes, invoiceRes, riskRes] = await Promise.all([
      supabaseAdmin
        .from("project_intelligence_reports")
        .select("id, project_id, output_json, confidence_score, created_at")
        .order("created_at", { ascending: false })
        .limit(8),
      supabaseAdmin
        .from("scope_analyses")
        .select("id, project_id, scope_status, recommendation, timeline_impact, cost_impact, business_impact, risk_impact, output_json, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      supabaseAdmin
        .from("invoices")
        .select("id, vendor, amount, currency, status, due_date")
        .limit(20),
      supabaseAdmin
        .from("risks")
        .select("id, project_id, title, severity, status")
        .in("severity", ["high", "critical"])
        .limit(10),
    ]);

    const piRows = (piRes.data ?? []) as { id: string; project_id: string | null; output_json: unknown }[];
    const scopeRows = (scopeRes.data ?? []) as {
      id: string;
      project_id: string | null;
      scope_status: string;
      recommendation: string;
      timeline_impact: string | null;
      cost_impact: string | null;
      business_impact: string | null;
      risk_impact: string | null;
      output_json: { reason?: string; suggestedAction?: string } | null;
    }[];
    const invoiceRows = (invoiceRes.data ?? []) as { id: string; vendor: string | null; amount: number; status: string }[];
    const riskRows = (riskRes.data ?? []) as { id: string; project_id: string | null; title: string; severity: string }[];

    // ── Decisions ──
    const decisions: DecisionItem[] = [];
    for (const row of piRows.slice(0, 4)) {
      const d = decisionFromPI(row);
      if (d) decisions.push(d);
    }
    const pendingScope = scopeRows.filter(
      (s) => s.scope_status === "out_of_scope" || s.recommendation === "convert_to_change_request"
    );
    for (const s of pendingScope.slice(0, 2)) {
      decisions.push({
        id: `scope-${s.id}`,
        kind: "scope_change",
        title: s.scope_status === "out_of_scope" ? "Scope change awaiting approval" : "Scope clarification awaiting decision",
        context: s.output_json?.reason ?? "Scope Impact Engine flagged this request.",
        badge: s.scope_status === "out_of_scope" ? "Out of Scope" : "Needs Clarification",
        badgeColor: s.scope_status === "out_of_scope" ? "var(--status-danger)" : "var(--status-warning)",
        href: "/scope-guard",
      });
    }
    const pendingInvoices = invoiceRows.filter((i) => i.status?.toLowerCase() === "pending");
    if (pendingInvoices.length > 0) {
      const top = pendingInvoices[0];
      decisions.push({
        id: `inv-${top.id}`,
        kind: "invoice_approval",
        title: `${top.vendor ?? "Vendor"} invoice $${top.amount.toLocaleString()} awaiting approval`,
        context: `${pendingInvoices.length} invoice${pendingInvoices.length === 1 ? "" : "s"} pending across the queue.`,
        badge: "Awaiting",
        badgeColor: "var(--accent-primary)",
        href: "/approvals",
      });
    }

    // ── Projects (derived from PI rows) ──
    const projects: ProjectHealthItem[] = piRows.slice(0, 3).map((row, i) => {
      const out = row.output_json as {
        technicalBlueprint?: { projectBrief?: { projectName?: string } };
        businessAnalysis?: { roiAssessment?: string; keyRisks?: string[] };
        executionPlan?: { complexity?: string };
        finalDecision?: { finalDecision?: string };
      } | null;
      const name = out?.technicalBlueprint?.projectBrief?.projectName ?? row.project_id ?? `Project ${i + 1}`;
      const roi = (out?.businessAnalysis?.roiAssessment as "low" | "medium" | "high" | undefined) ?? "medium";
      const complexity = out?.executionPlan?.complexity ?? "medium";
      const riskLevel: "low" | "medium" | "high" = complexity === "high" ? "high" : complexity === "low" ? "low" : "medium";
      const decision = out?.finalDecision?.finalDecision;
      const timelineStatus: ProjectHealthItem["timelineStatus"] =
        decision === "yes" ? "on_track" : decision === "no" ? "delayed" : "at_risk";
      const healthScore = decision === "yes" ? 85 : decision === "no" ? 50 : 70;
      return { id: row.id, name, healthScore, roi, riskLevel, timelineStatus };
    });

    // ── Financial ──
    const pending = invoiceRows.filter((i) => i.status?.toLowerCase() === "pending").length;
    const approved = invoiceRows.filter((i) => i.status?.toLowerCase() === "approved").length;
    const latestPI = piRows[0]?.output_json as { businessAnalysis?: { estimatedRevenueRange?: string; costLevel?: string } } | null;
    const financial: FinancialInsight = {
      estimatedRevenueRange: latestPI?.businessAnalysis?.estimatedRevenueRange ?? FALLBACK.financial.estimatedRevenueRange,
      costLevel: levelFromImpact(latestPI?.businessAnalysis?.costLevel),
      paymentMilestones: FALLBACK.financial.paymentMilestones,
      pendingInvoices: pending || FALLBACK.financial.pendingInvoices,
      approvedInvoices: approved || FALLBACK.financial.approvedInvoices,
    };

    // ── Scope Impact ──
    const outOfScopeCount = scopeRows.filter((s) => s.scope_status === "out_of_scope").length;
    const needsClarificationCount = scopeRows.filter((s) => s.scope_status === "needs_clarification").length;
    const highestCost = scopeRows.find((s) => s.cost_impact === "high")?.cost_impact
      ?? scopeRows.find((s) => s.cost_impact === "medium")?.cost_impact
      ?? "low";
    const highestTimeline = scopeRows.find((s) => s.timeline_impact === "high")?.timeline_impact
      ?? scopeRows.find((s) => s.timeline_impact === "medium")?.timeline_impact
      ?? "low";
    const topAction = scopeRows[0]?.output_json?.suggestedAction ?? FALLBACK.scopeImpact.recommendedAction;
    const scopeImpact: ScopeImpactSummary = {
      outOfScopeCount: outOfScopeCount || (scopeRows.length === 0 ? FALLBACK.scopeImpact.outOfScopeCount : 0),
      needsClarificationCount,
      costImpactLabel: levelFromImpact(highestCost),
      timelineImpactLabel: levelFromImpact(highestTimeline),
      recommendedAction: topAction,
    };

    // ── Next actions (drawn from real signals when available, padded with fallbacks) ──
    const nextActions: NextActionItem[] = [];
    if (pendingInvoices.length > 0) {
      nextActions.push({
        title: `Approve invoice from ${pendingInvoices[0].vendor ?? "vendor"}`,
        source: "invoice",
        meta: `${pendingInvoices.length} pending · $${pendingInvoices[0].amount.toLocaleString()}`,
        badge: "Urgent",
        badgeColor: "var(--status-danger)",
        href: "/approvals",
      });
    }
    if (pendingScope.length > 0) {
      const s = pendingScope[0];
      nextActions.push({
        title: "Issue change request for out-of-scope item",
        source: "scope_guard",
        meta: s.output_json?.suggestedAction ?? "Convert to formal CR",
        badge: "Revenue",
        badgeColor: "var(--status-success)",
        href: "/scope-guard",
      });
    }
    if (riskRows.length > 0) {
      nextActions.push({
        title: `Mitigate: ${riskRows[0].title}`,
        source: "risk",
        meta: `${riskRows.length} high/critical risks open`,
        badge: "High Impact",
        badgeColor: "var(--status-warning)",
        href: "/risks",
      });
    }
    if (piRows.length > 0) {
      const top = piRows[0].output_json as { finalDecision?: { suggestedNextStep?: string } } | null;
      const step = top?.finalDecision?.suggestedNextStep;
      if (step) {
        nextActions.push({
          title: step,
          source: "project_intelligence",
          meta: "From latest Project Intelligence run",
          badge: "Decision",
          badgeColor: "var(--accent-ai)",
          href: "/srs-generator",
        });
      }
    }
    while (nextActions.length < 4) {
      const padded = FALLBACK.nextActions[nextActions.length];
      if (!padded) break;
      nextActions.push(padded);
    }

    const hasAnyLive = piRows.length > 0 || scopeRows.length > 0 || invoiceRows.length > 0 || riskRows.length > 0;

    return {
      source: hasAnyLive ? (decisions.length === FALLBACK.decisions.length ? "mixed" : "live") : "fallback",
      decisions: decisions.length > 0 ? decisions : FALLBACK.decisions,
      projects: projects.length > 0 ? projects : FALLBACK.projects,
      financial,
      scopeImpact,
      nextActions: nextActions.length > 0 ? nextActions : FALLBACK.nextActions,
    };
  } catch (err) {
    console.warn("[Dashboard] Supabase fetch failed, returning fallback:", err);
    return FALLBACK;
  }
}
