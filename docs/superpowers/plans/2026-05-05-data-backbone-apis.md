# Data Backbone + APIs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a unified data backbone (shared types, demo store, query helpers, normalized AI output) and expose it through new REST APIs without touching the UI, so future pages (Dashboard, Projects, Risk Radar, Approvals, Workspace) can read connected project data from a single layer.

**Architecture:** Create a new `src/lib/data/**` module with strongly-typed domain models, a seeded in-memory demo store keyed off the existing NexaSoft / Al Waha Clinics scenario, and pure query helpers. Add `src/lib/ai/normalized-output.ts` to wrap the existing four AI route outputs (project-intelligence, contract, invoice, scope) into a shared `NormalizedAIOutput` shape, and surface that shape on each existing route via a non-breaking `normalized` field. Add new App Router endpoints under `src/app/api/documents/analyze` and `src/app/api/projects/[id]/{overview,documents,risks,approvals}` that read from the queries module. Leave Supabase's runtime usage untouched — only add a draft migration for the future schema.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript strict · Zod 4 (already in repo) · `@supabase/supabase-js` (already in repo, lazy proxy) · `@google/genai` (existing AI calls). No new runtime dependencies.

---

## Pre-flight: Repository Inspection Summary

Performed during planning, recorded here so the executor doesn't repeat it:

- **Existing AI routes:** `src/app/api/ai/project-intelligence/route.ts`, `src/app/api/ai/scope/route.ts`, `src/app/api/ai/invoice/route.ts`, `src/app/api/ai/contract/route.ts`, `src/app/api/ai/srs/route.ts`, `src/app/api/contracts/analyze/route.ts`, `src/app/api/contracts/list/route.ts`, `src/app/api/ask/...`, `src/app/api/rag/...`.
- **Existing AI library:** `src/lib/ai/{gemini.ts, geminiReliability.ts, qwen.ts, jsonUtils.ts}`, `src/lib/ai/schemas/{contract,invoice,projectIntelligence,scope,srs}.ts`, `src/lib/ai/prompts/{...}.ts`, `src/lib/ai/fallbacks/{projectIntelligence,scope}.ts`.
- **Existing data/db:** `src/lib/db/supabaseAdmin.ts` (lazy proxy + `isSupabaseConfigured()`), `src/lib/dashboard/load.ts` (server-only loader with rich `FALLBACK` constant — useful reference for demo content tone).
- **Supabase migrations:** `0001_domain_tables.sql`, `0002_project_intelligence.sql`, `0003_scope_analyses.sql`, `20260503000000_rag_setup.sql`.
- **Scripts in package.json:** `dev`, `build`, `start`, `lint`, `db:seed`. **No `typecheck` script** — executor must use `npx tsc --noEmit` instead.
- **Known pre-existing build/type issues:** `npm run lint` is broken on this repo (ESLint 8 + flat-config `eslint/config` `ERR_PACKAGE_PATH_NOT_EXPORTED`). Use `npx tsc --noEmit` and `npx next build` as quality gates. Windows + OneDrive sometimes EPERMs `.next` — clean it via PowerShell `Remove-Item .next -Recurse -Force` before each build.
- **`.env.example`** exists at repo root.
- **Zod 4 caveat (CLAUDE.md rule 8):** Do NOT use `zod-to-json-schema` even though it appears in package.json — write JSON schemas manually.
- **Non-blocking persistence rule (CLAUDE.md rule 9):** every Supabase call wrapped in try/catch.

---

## File Structure

**New files (allowed areas only):**

- `src/lib/data/types.ts` — domain types (Project, DocumentRecord, AnalysisOutput, ActionItem, RiskItem, ApprovalItem, BusinessCaseOutput + union helpers).
- `src/lib/data/demo-store.ts` — seeded in-memory arrays (NexaSoft / Al Waha Clinics).
- `src/lib/data/queries.ts` — pure read helpers (`getProjects`, `getProjectOverview`, etc.).
- `src/lib/data/index.ts` — barrel re-export of types + queries (the **one** allowed barrel; CLAUDE.md says "no barrel files" but `src/lib/data/index.ts` was explicitly suggested in the spec — re-export only types + queries, not the demo store).
- `src/lib/ai/normalized-output.ts` — `NormalizedAIOutput` interface + 4 normalizer functions.
- `src/app/api/documents/analyze/route.ts` — unified POST analyze endpoint.
- `src/app/api/projects/[id]/overview/route.ts` — GET project overview.
- `src/app/api/projects/[id]/documents/route.ts` — GET project documents.
- `src/app/api/projects/[id]/risks/route.ts` — GET project risks.
- `src/app/api/projects/[id]/approvals/route.ts` — GET project approvals.
- `supabase/migrations/0004_data_backbone_draft.sql` — draft (idempotent) future schema, prefixed with a comment marking it as a future-state design.

**Modified files (minimal, non-UI):**

- `src/app/api/ai/project-intelligence/route.ts` — add `normalized` field to success response (additive only).
- `src/app/api/ai/scope/route.ts` — add `normalized` field.
- `src/app/api/ai/invoice/route.ts` — add `normalized` field.
- `src/app/api/contracts/analyze/route.ts` — add `normalized` field.
- `.env.example` — only if any of `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY` are missing.

**Untouched:** `src/app/*.tsx`, `src/components/**`, `src/styles/**`, `src/lib/dashboard/**`, `src/lib/rag/**`.

---

## Task 0: Branch + Pre-flight Build Baseline

**Files:** none (repo state).

- [ ] **Step 1: Create branch from current HEAD**

```bash
cd "c:/Users/abdul/OneDrive - University of Jeddah/VsCode/Portfolio/DocuPilot"
git status
git checkout -b feature/data-backbone-apis
```

- [ ] **Step 2: Confirm dependencies installed**

```bash
npm install
```

Expected: completes without adding/removing packages (no missing deps).

- [ ] **Step 3: Capture baseline typecheck**

```bash
npx tsc --noEmit
```

Expected: clean (or, if pre-existing errors exist, save the output to compare against later — do not fix unrelated errors).

- [ ] **Step 4: Capture baseline build**

```bash
powershell -NoProfile -Command "Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue"
npx next build
```

Expected: succeeds (warnings okay). Record any pre-existing errors.

- [ ] **Step 5: Commit baseline note (no code changes)**

Skip — no changes yet. Move to Task 1.

---

## Task 1: Domain Types

**Files:**
- Create: `src/lib/data/types.ts`

- [ ] **Step 1: Write `src/lib/data/types.ts`**

```ts
// Shared domain types for the DocuPilot data backbone.
// All persistence layers (demo store today, Supabase tomorrow) must conform.

export type ProjectStatus =
  | "discovery"
  | "active"
  | "at_risk"
  | "on_hold"
  | "completed"
  | "archived";

export type DocumentType =
  | "srs"
  | "contract"
  | "invoice"
  | "scope_request"
  | "client_request"
  | "other";

export type DocumentSource = "upload" | "paste" | "demo" | "ai_generated";

export type AnalysisType =
  | "project_intelligence"
  | "contract"
  | "invoice"
  | "scope"
  | "srs"
  | "business_case"
  | "general";

export type Priority = "low" | "medium" | "high" | "critical";
export type Severity = "low" | "medium" | "high" | "critical";
export type ActionStatus = "todo" | "in_progress" | "done" | "blocked";
export type RiskStatus = "open" | "monitoring" | "resolved";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type ApprovalType =
  | "invoice"
  | "scope_change"
  | "contract"
  | "payment"
  | "delivery"
  | "other";

export type BusinessCaseRecommendation = "build" | "reconsider" | "needs_validation";

export interface Project {
  id: string;
  name: string;
  clientName: string;
  description: string;
  status: ProjectStatus;
  healthScore: number; // 0-100
  startDate: string; // ISO date
  dueDate: string;   // ISO date
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRecord {
  id: string;
  projectId: string;
  title: string;
  type: DocumentType;
  source: DocumentSource;
  contentPreview: string;
  fileName?: string;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisOutput {
  id: string;
  projectId: string;
  documentId?: string;
  type: AnalysisType;
  summary: string;
  actions: string[];   // action ids
  risks: string[];     // risk ids
  approvals: string[]; // approval ids
  rawOutput?: unknown;
  createdAt: string;
}

export interface ActionItem {
  id: string;
  projectId: string;
  documentId?: string;
  analysisOutputId?: string;
  title: string;
  description: string;
  status: ActionStatus;
  priority: Priority;
  owner?: string;
  dueDate?: string;
  sourceType: AnalysisType;
  createdAt: string;
}

export interface RiskItem {
  id: string;
  projectId: string;
  documentId?: string;
  analysisOutputId?: string;
  title: string;
  description: string;
  severity: Severity;
  source: AnalysisType;
  impact: string;
  suggestedAction: string;
  status: RiskStatus;
  createdAt: string;
}

export interface ApprovalItem {
  id: string;
  projectId: string;
  documentId?: string;
  analysisOutputId?: string;
  title: string;
  description: string;
  type: ApprovalType;
  status: ApprovalStatus;
  approver?: string;
  amount?: number;
  currency?: string;
  reason?: string;
  createdAt: string;
}

export interface BusinessCaseOutput {
  id: string;
  projectId: string;
  summary: string;
  potentialRevenueRange: string;
  estimatedCostRange: string;
  qualitativeROI: string;
  risks: string[]; // risk ids OR free-text bullets
  marketMaturity: string;
  recommendation: BusinessCaseRecommendation;
  createdAt: string;
}

export interface ProjectStats {
  totalDocuments: number;
  openRisks: number;
  highRisks: number;
  pendingApprovals: number;
  openActions: number;
  completedActions: number;
}

export interface LatestActivityEntry {
  kind: "document" | "analysis" | "action" | "risk" | "approval";
  id: string;
  title: string;
  createdAt: string;
}

export interface ProjectOverview {
  project: Project;
  documents: DocumentRecord[];
  risks: RiskItem[];
  approvals: ApprovalItem[];
  actions: ActionItem[];
  stats: ProjectStats;
  latestActivity: LatestActivityEntry[];
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: PASS (no new errors).

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/types.ts
git commit -m "feat(data): add unified domain types for projects, documents, analyses"
```

---

## Task 2: Demo Store (Seeded NexaSoft / Al Waha Clinics)

**Files:**
- Create: `src/lib/data/demo-store.ts`

- [ ] **Step 1: Write `src/lib/data/demo-store.ts` with full demo seed**

```ts
import type {
  Project,
  DocumentRecord,
  AnalysisOutput,
  ActionItem,
  RiskItem,
  ApprovalItem,
} from "./types";

// Demo project id is exported so normalizers / API routes can default to it
// when no projectId is supplied.
export const DEMO_PROJECT_ID = "proj-alwaha-clinic-booking";

const NOW = "2026-04-15T09:00:00.000Z";
const EARLIER = "2026-03-20T09:00:00.000Z";

export const projects: Project[] = [
  {
    id: DEMO_PROJECT_ID,
    name: "Clinic Booking Platform",
    clientName: "Al Waha Clinics",
    description:
      "Patient self-service appointment booking, clinician schedule management, and SMS reminders for Al Waha Clinics' four Riyadh branches.",
    status: "active",
    healthScore: 72,
    startDate: "2026-02-01",
    dueDate: "2026-08-30",
    createdAt: "2026-02-01T08:00:00.000Z",
    updatedAt: NOW,
  },
];

export const documents: DocumentRecord[] = [
  {
    id: "doc-srs-001",
    projectId: DEMO_PROJECT_ID,
    title: "Initial client request — Al Waha booking",
    type: "client_request",
    source: "demo",
    contentPreview:
      "نرغب في منصة لحجز المواعيد عبر الإنترنت تربط مرضانا بأطبائنا في الفروع الأربعة، مع إرسال تذكيرات SMS قبل الموعد بـ 24 ساعة.",
    createdAt: EARLIER,
    updatedAt: EARLIER,
  },
  {
    id: "doc-contract-001",
    projectId: DEMO_PROJECT_ID,
    title: "Master Services Agreement — NexaSoft × Al Waha v1.2",
    type: "contract",
    source: "demo",
    contentPreview:
      "Fixed-fee engagement of SAR 480,000 covering web booking portal, admin console, and SMS integration. Mobile native apps explicitly excluded.",
    fileName: "MSA-AlWaha-v1.2.pdf",
    mimeType: "application/pdf",
    createdAt: "2026-02-05T10:00:00.000Z",
    updatedAt: "2026-02-05T10:00:00.000Z",
  },
  {
    id: "doc-invoice-001",
    projectId: DEMO_PROJECT_ID,
    title: "Invoice INV-2026-0042 — Milestone 2",
    type: "invoice",
    source: "demo",
    contentPreview:
      "Milestone 2 (Admin console + clinician scheduling) — SAR 144,000 due 2026-05-01.",
    fileName: "INV-2026-0042.pdf",
    mimeType: "application/pdf",
    createdAt: "2026-04-10T11:00:00.000Z",
    updatedAt: "2026-04-10T11:00:00.000Z",
  },
  {
    id: "doc-scope-001",
    projectId: DEMO_PROJECT_ID,
    title: "Scope request — native mobile app",
    type: "scope_request",
    source: "demo",
    contentPreview:
      "نريد إضافة تطبيق جوال أصلي لنظامي iOS و Android بنفس مزايا البوابة قبل إطلاق المرحلة الثانية.",
    createdAt: "2026-04-12T08:30:00.000Z",
    updatedAt: "2026-04-12T08:30:00.000Z",
  },
];

export const analysisOutputs: AnalysisOutput[] = [
  {
    id: "ana-pi-001",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-srs-001",
    type: "project_intelligence",
    summary:
      "Booking platform for 4-branch clinic network. High value (recurring patient touchpoints), medium technical risk (HL7/SMS integrations), tight 7-month delivery window.",
    actions: ["act-001", "act-002"],
    risks: ["risk-001"],
    approvals: [],
    createdAt: EARLIER,
  },
  {
    id: "ana-contract-001",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-contract-001",
    type: "contract",
    summary:
      "Fixed-fee MSA at SAR 480,000. Mobile apps excluded. Penalty clause: 2%/week late delivery beyond 2026-08-30.",
    actions: ["act-003"],
    risks: ["risk-002"],
    approvals: ["app-001"],
    createdAt: "2026-02-05T10:30:00.000Z",
  },
  {
    id: "ana-invoice-001",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-invoice-001",
    type: "invoice",
    summary:
      "Milestone 2 invoice aligned with contract payment schedule. No duplicate detected. Awaiting PM approval.",
    actions: [],
    risks: [],
    approvals: ["app-002"],
    createdAt: "2026-04-10T11:30:00.000Z",
  },
  {
    id: "ana-scope-001",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-scope-001",
    type: "scope",
    summary:
      "Native mobile apps fall outside contracted scope (web portal only). Estimated +SAR 220,000 and +10 weeks. Recommend formal change request.",
    actions: ["act-004"],
    risks: ["risk-003"],
    approvals: ["app-003"],
    createdAt: "2026-04-12T09:00:00.000Z",
  },
];

export const actions: ActionItem[] = [
  {
    id: "act-001",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-srs-001",
    analysisOutputId: "ana-pi-001",
    title: "Confirm SMS provider (Unifonic vs MSG91)",
    description:
      "Pricing and Saudi number-portability differ between providers; lock in before integration sprint.",
    status: "in_progress",
    priority: "high",
    owner: "Reem Al-Otaibi",
    dueDate: "2026-04-25",
    sourceType: "project_intelligence",
    createdAt: EARLIER,
  },
  {
    id: "act-002",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-srs-001",
    analysisOutputId: "ana-pi-001",
    title: "Schedule clarification call on HL7 export",
    description: "Client mentioned HL7 only verbally; pin down required segments and version.",
    status: "todo",
    priority: "medium",
    owner: "Khalid Naseer",
    dueDate: "2026-04-22",
    sourceType: "project_intelligence",
    createdAt: EARLIER,
  },
  {
    id: "act-003",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-contract-001",
    analysisOutputId: "ana-contract-001",
    title: "Add late-delivery penalty to risk register",
    description: "2%/week penalty starting 2026-08-31 must be reflected in margin calculations.",
    status: "done",
    priority: "medium",
    sourceType: "contract",
    createdAt: "2026-02-06T08:00:00.000Z",
  },
  {
    id: "act-004",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-scope-001",
    analysisOutputId: "ana-scope-001",
    title: "Draft formal Change Request for native mobile apps",
    description:
      "Quote +SAR 220,000 and +10 weeks. Reference contract clause 4.2 (out-of-scope items).",
    status: "todo",
    priority: "high",
    owner: "Project Manager",
    dueDate: "2026-04-20",
    sourceType: "scope",
    createdAt: "2026-04-12T09:30:00.000Z",
  },
];

export const risks: RiskItem[] = [
  {
    id: "risk-001",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-srs-001",
    analysisOutputId: "ana-pi-001",
    title: "HL7 export requirement is under-specified",
    description: "Client expects integration with hospital EMR but did not specify HL7 version or segments.",
    severity: "high",
    source: "project_intelligence",
    impact: "Up to 3 weeks of rework if EMR vendor demands HL7 v2.5 ADT/SIU segments not yet scoped.",
    suggestedAction: "Hold a 30-min discovery with Al Waha IT to lock the spec before sprint 4.",
    status: "open",
    createdAt: EARLIER,
  },
  {
    id: "risk-002",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-contract-001",
    analysisOutputId: "ana-contract-001",
    title: "Late-delivery penalty exposure",
    description: "Contract imposes 2%/week penalty on SAR 480,000 if delivery slips past 2026-08-30.",
    severity: "medium",
    source: "contract",
    impact: "Each week of slippage costs SAR 9,600 against margin.",
    suggestedAction: "Track milestone burn-down weekly; escalate any 2-day slip immediately.",
    status: "monitoring",
    createdAt: "2026-02-06T08:00:00.000Z",
  },
  {
    id: "risk-003",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-scope-001",
    analysisOutputId: "ana-scope-001",
    title: "Out-of-scope mobile request threatens timeline",
    description: "Client expects native iOS/Android before phase-2 launch — not in MSA.",
    severity: "critical",
    source: "scope",
    impact: "If absorbed silently, will push delivery 10 weeks past contracted date and trigger penalty clause.",
    suggestedAction: "Block work until signed Change Request lands.",
    status: "open",
    createdAt: "2026-04-12T09:00:00.000Z",
  },
];

export const approvals: ApprovalItem[] = [
  {
    id: "app-001",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-contract-001",
    analysisOutputId: "ana-contract-001",
    title: "MSA v1.2 sign-off",
    description: "Final sign-off on master services agreement with Al Waha Clinics.",
    type: "contract",
    status: "approved",
    approver: "Faisal Al-Harthi",
    amount: 480000,
    currency: "SAR",
    reason: "Standard fixed-fee engagement, terms reviewed by legal.",
    createdAt: "2026-02-05T14:00:00.000Z",
  },
  {
    id: "app-002",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-invoice-001",
    analysisOutputId: "ana-invoice-001",
    title: "Approve Milestone 2 invoice",
    description: "INV-2026-0042 for SAR 144,000, milestone 2 deliverables verified.",
    type: "invoice",
    status: "pending",
    amount: 144000,
    currency: "SAR",
    createdAt: "2026-04-10T11:30:00.000Z",
  },
  {
    id: "app-003",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-scope-001",
    analysisOutputId: "ana-scope-001",
    title: "Approve native mobile Change Request",
    description: "Adds iOS + Android apps. +SAR 220,000, +10 weeks. Awaiting client + PM joint approval.",
    type: "scope_change",
    status: "pending",
    amount: 220000,
    currency: "SAR",
    reason: "Out-of-scope per MSA clause 4.2.",
    createdAt: "2026-04-12T09:30:00.000Z",
  },
];
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/demo-store.ts
git commit -m "feat(data): seed demo store with NexaSoft / Al Waha Clinics scenario"
```

---

## Task 3: Query Helpers

**Files:**
- Create: `src/lib/data/queries.ts`

- [ ] **Step 1: Write `src/lib/data/queries.ts`**

```ts
import {
  projects,
  documents,
  analysisOutputs,
  actions,
  risks,
  approvals,
} from "./demo-store";
import type {
  Project,
  DocumentRecord,
  AnalysisOutput,
  ActionItem,
  RiskItem,
  ApprovalItem,
  ProjectOverview,
  ProjectStats,
  LatestActivityEntry,
} from "./types";

export function getProjects(): Project[] {
  return [...projects];
}

export function getProjectById(projectId: string): Project | undefined {
  return projects.find((p) => p.id === projectId);
}

export function getProjectDocuments(projectId: string): DocumentRecord[] {
  return documents.filter((d) => d.projectId === projectId);
}

export function getProjectRisks(projectId: string): RiskItem[] {
  return risks.filter((r) => r.projectId === projectId);
}

export function getProjectApprovals(projectId: string): ApprovalItem[] {
  return approvals.filter((a) => a.projectId === projectId);
}

export function getProjectActions(projectId: string): ActionItem[] {
  return actions.filter((a) => a.projectId === projectId);
}

export function getAnalysisOutputs(projectId: string): AnalysisOutput[] {
  return analysisOutputs.filter((a) => a.projectId === projectId);
}

export function getDocumentById(documentId: string): DocumentRecord | undefined {
  return documents.find((d) => d.id === documentId);
}

export function getActionsByDocument(documentId: string): ActionItem[] {
  return actions.filter((a) => a.documentId === documentId);
}

export function getRisksByDocument(documentId: string): RiskItem[] {
  return risks.filter((r) => r.documentId === documentId);
}

export function getApprovalsByDocument(documentId: string): ApprovalItem[] {
  return approvals.filter((a) => a.documentId === documentId);
}

function computeStats(
  docs: DocumentRecord[],
  rks: RiskItem[],
  apps: ApprovalItem[],
  acts: ActionItem[]
): ProjectStats {
  return {
    totalDocuments: docs.length,
    openRisks: rks.filter((r) => r.status !== "resolved").length,
    highRisks: rks.filter(
      (r) => (r.severity === "high" || r.severity === "critical") && r.status !== "resolved"
    ).length,
    pendingApprovals: apps.filter((a) => a.status === "pending").length,
    openActions: acts.filter((a) => a.status !== "done").length,
    completedActions: acts.filter((a) => a.status === "done").length,
  };
}

function buildLatestActivity(
  docs: DocumentRecord[],
  ans: AnalysisOutput[],
  acts: ActionItem[],
  rks: RiskItem[],
  apps: ApprovalItem[]
): LatestActivityEntry[] {
  const entries: LatestActivityEntry[] = [
    ...docs.map<LatestActivityEntry>((d) => ({
      kind: "document",
      id: d.id,
      title: d.title,
      createdAt: d.createdAt,
    })),
    ...ans.map<LatestActivityEntry>((a) => ({
      kind: "analysis",
      id: a.id,
      title: a.summary.slice(0, 80),
      createdAt: a.createdAt,
    })),
    ...acts.map<LatestActivityEntry>((a) => ({
      kind: "action",
      id: a.id,
      title: a.title,
      createdAt: a.createdAt,
    })),
    ...rks.map<LatestActivityEntry>((r) => ({
      kind: "risk",
      id: r.id,
      title: r.title,
      createdAt: r.createdAt,
    })),
    ...apps.map<LatestActivityEntry>((a) => ({
      kind: "approval",
      id: a.id,
      title: a.title,
      createdAt: a.createdAt,
    })),
  ];
  return entries
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 10);
}

export function getProjectOverview(projectId: string): ProjectOverview | undefined {
  const project = getProjectById(projectId);
  if (!project) return undefined;
  const docs = getProjectDocuments(projectId);
  const rks = getProjectRisks(projectId);
  const apps = getProjectApprovals(projectId);
  const acts = getProjectActions(projectId);
  const ans = getAnalysisOutputs(projectId);

  return {
    project,
    documents: docs,
    risks: rks,
    approvals: apps,
    actions: acts,
    stats: computeStats(docs, rks, apps, acts),
    latestActivity: buildLatestActivity(docs, ans, acts, rks, apps),
  };
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/queries.ts
git commit -m "feat(data): add pure query helpers over demo store"
```

---

## Task 4: Barrel `index.ts`

**Files:**
- Create: `src/lib/data/index.ts`

- [ ] **Step 1: Write `src/lib/data/index.ts`**

```ts
// Public surface for the data backbone. Demo-store internals are intentionally
// not re-exported — consumers should call query helpers, not poke arrays.
export * from "./types";
export * from "./queries";
export { DEMO_PROJECT_ID } from "./demo-store";
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/index.ts
git commit -m "feat(data): expose data module via index barrel"
```

---

## Task 5: Normalized AI Output Contract + Normalizers

**Files:**
- Create: `src/lib/ai/normalized-output.ts`

- [ ] **Step 1: Write `src/lib/ai/normalized-output.ts`**

```ts
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

// Inputs are partials — callers supply what they have, the normalizer fills
// the rest with safe defaults. ids are optional because routes don't always
// have a stable identifier yet.
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

// ─── Project Intelligence ─────────────────────────────────────────────────────
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

// ─── Contract ─────────────────────────────────────────────────────────────────
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

// ─── Invoice ──────────────────────────────────────────────────────────────────
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

// ─── Scope ────────────────────────────────────────────────────────────────────
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
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/ai/normalized-output.ts
git commit -m "feat(ai): add NormalizedAIOutput contract and per-route normalizers"
```

---

## Task 6: Wire `normalized` field into existing AI routes

For each route below: locate the success `NextResponse.json(...)` payload and add a `normalized` field built from the corresponding normalizer, **without changing any other key**.

### Task 6a: project-intelligence route

**Files:**
- Modify: `src/app/api/ai/project-intelligence/route.ts`

- [ ] **Step 1: Read the file**

```bash
cat src/app/api/ai/project-intelligence/route.ts
```

Locate every `NextResponse.json({ success: true, ... })` (and any fallback success response).

- [ ] **Step 2: Add normalizer import at top of file**

```ts
import { normalizeProjectIntelligenceOutput } from "@/lib/ai/normalized-output";
```

- [ ] **Step 3: For each success response, build normalized and inject**

Before the `NextResponse.json(...)` success call, insert:

```ts
const normalized = normalizeProjectIntelligenceOutput(parsedOutput, {
  projectId: projectId,
});
```

Replace the response body so it includes `normalized` alongside (not replacing) existing keys:

```ts
return NextResponse.json({
  success: true,
  /* ...all existing fields preserved... */,
  normalized,
});
```

(The variable name for the parsed Gemini output may differ — use whatever the route already named it, e.g. `data`, `parsed`, `output`.)

- [ ] **Step 4: Typecheck**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 5: Smoke test the route**

```bash
powershell -NoProfile -Command "Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue"
npx next build
```

Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/ai/project-intelligence/route.ts
git commit -m "feat(api): expose normalized output on project-intelligence route"
```

### Task 6b: scope route

**Files:**
- Modify: `src/app/api/ai/scope/route.ts`

- [ ] **Step 1: Add import**

```ts
import { normalizeScopeAnalysisOutput } from "@/lib/ai/normalized-output";
```

- [ ] **Step 2: Build normalized and inject into every success response**

Same pattern as 6a:

```ts
const normalized = normalizeScopeAnalysisOutput(scopeData, {
  projectId: projectId,
});
return NextResponse.json({
  success: true,
  /* ...existing fields... */,
  normalized,
});
```

- [ ] **Step 3: Typecheck + commit**

```bash
npx tsc --noEmit
git add src/app/api/ai/scope/route.ts
git commit -m "feat(api): expose normalized output on scope route"
```

### Task 6c: invoice route

**Files:**
- Modify: `src/app/api/ai/invoice/route.ts`

- [ ] **Step 1: Add import**

```ts
import { normalizeInvoiceAnalysisOutput } from "@/lib/ai/normalized-output";
```

- [ ] **Step 2: Inject normalized into success response**

```ts
const normalized = normalizeInvoiceAnalysisOutput(invoiceData, {
  projectId: undefined, // route does not currently take projectId; defaults to demo
});
return NextResponse.json({
  success: true,
  /* ...existing fields... */,
  normalized,
});
```

- [ ] **Step 3: Typecheck + commit**

```bash
npx tsc --noEmit
git add src/app/api/ai/invoice/route.ts
git commit -m "feat(api): expose normalized output on invoice route"
```

### Task 6d: contracts/analyze route

**Files:**
- Modify: `src/app/api/contracts/analyze/route.ts`

- [ ] **Step 1: Add import**

```ts
import { normalizeContractAnalysisOutput } from "@/lib/ai/normalized-output";
```

- [ ] **Step 2: Inject normalized into success response**

```ts
const normalized = normalizeContractAnalysisOutput(contractData, {
  projectId: undefined,
});
return NextResponse.json({
  success: true,
  /* ...existing fields... */,
  normalized,
});
```

- [ ] **Step 3: Typecheck + commit**

```bash
npx tsc --noEmit
git add src/app/api/contracts/analyze/route.ts
git commit -m "feat(api): expose normalized output on contracts/analyze route"
```

---

## Task 7: New unified `POST /api/documents/analyze` endpoint

**Files:**
- Create: `src/app/api/documents/analyze/route.ts`

- [ ] **Step 1: Write the route**

```ts
import { NextResponse } from "next/server";
import {
  normalizeContractAnalysisOutput,
  normalizeInvoiceAnalysisOutput,
  normalizeScopeAnalysisOutput,
  normalizeProjectIntelligenceOutput,
  type NormalizedAIOutput,
} from "@/lib/ai/normalized-output";
import { DEMO_PROJECT_ID } from "@/lib/data/demo-store";
import type { DocumentType } from "@/lib/data/types";

const VALID_TYPES: DocumentType[] = [
  "srs",
  "contract",
  "invoice",
  "scope_request",
  "client_request",
  "other",
];

interface AnalyzeBody {
  projectId?: string;
  documentId?: string;
  documentType?: DocumentType;
  text?: string;
}

function fallbackForType(
  type: DocumentType,
  ctx: { projectId: string; documentId?: string }
): NormalizedAIOutput {
  const baseSummary = `Demo analysis: received ${type} document. Live AI provider not configured — returning structured placeholder.`;
  switch (type) {
    case "contract":
      return normalizeContractAnalysisOutput({ contractTitle: "Demo contract", scope: { summary: baseSummary } }, ctx);
    case "invoice":
      return normalizeInvoiceAnalysisOutput({ contractAlignment: { summary: baseSummary }, duplicateRisk: { level: "none" } }, ctx);
    case "scope_request":
      return normalizeScopeAnalysisOutput({ reason: baseSummary, scopeStatus: "needs_clarification" }, ctx);
    case "srs":
    case "client_request":
    case "other":
    default:
      return normalizeProjectIntelligenceOutput({ finalDecision: { summary: baseSummary } }, ctx);
  }
}

export async function POST(req: Request) {
  let body: AnalyzeBody;
  try {
    body = (await req.json()) as AnalyzeBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { projectId, documentId, documentType, text } = body;

  if (!projectId || typeof projectId !== "string") {
    return NextResponse.json(
      { success: false, error: "projectId is required." },
      { status: 400 }
    );
  }
  if (!documentType || !VALID_TYPES.includes(documentType)) {
    return NextResponse.json(
      { success: false, error: `documentType must be one of ${VALID_TYPES.join(", ")}.` },
      { status: 400 }
    );
  }
  if (!text || typeof text !== "string" || text.trim().length < 5) {
    return NextResponse.json(
      { success: false, error: "text is required (min 5 chars)." },
      { status: 400 }
    );
  }

  const ctx = {
    projectId: projectId || DEMO_PROJECT_ID,
    documentId,
  };

  // For now: always return a normalized fallback. Future iterations can route
  // to the per-type AI providers via the existing /api/ai/* routes.
  const normalized = fallbackForType(documentType, ctx);

  return NextResponse.json({
    success: true,
    data: { normalized },
  });
}
```

- [ ] **Step 2: Typecheck + build smoke**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/documents/analyze/route.ts
git commit -m "feat(api): add unified documents/analyze endpoint with fallback"
```

---

## Task 8: New project read endpoints

**Files:**
- Create: `src/app/api/projects/[id]/overview/route.ts`
- Create: `src/app/api/projects/[id]/documents/route.ts`
- Create: `src/app/api/projects/[id]/risks/route.ts`
- Create: `src/app/api/projects/[id]/approvals/route.ts`

> Next.js 16 note: route handler `params` is async — `params: Promise<{ id: string }>`. Always `await params` first.

- [ ] **Step 1: Write `overview/route.ts`**

```ts
import { NextResponse } from "next/server";
import { getProjectOverview } from "@/lib/data/queries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const overview = getProjectOverview(id);
  if (!overview) {
    return NextResponse.json(
      { success: false, error: `Project ${id} not found.` },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: overview });
}
```

- [ ] **Step 2: Write `documents/route.ts`**

```ts
import { NextResponse } from "next/server";
import { getProjectById, getProjectDocuments } from "@/lib/data/queries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getProjectById(id)) {
    return NextResponse.json(
      { success: false, error: `Project ${id} not found.` },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: getProjectDocuments(id) });
}
```

- [ ] **Step 3: Write `risks/route.ts`**

```ts
import { NextResponse } from "next/server";
import { getProjectById, getProjectRisks } from "@/lib/data/queries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getProjectById(id)) {
    return NextResponse.json(
      { success: false, error: `Project ${id} not found.` },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: getProjectRisks(id) });
}
```

- [ ] **Step 4: Write `approvals/route.ts`**

```ts
import { NextResponse } from "next/server";
import { getProjectById, getProjectApprovals } from "@/lib/data/queries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getProjectById(id)) {
    return NextResponse.json(
      { success: false, error: `Project ${id} not found.` },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: getProjectApprovals(id) });
}
```

- [ ] **Step 5: Typecheck + build**

```bash
npx tsc --noEmit
powershell -NoProfile -Command "Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue"
npx next build
```

Expected: PASS.

- [ ] **Step 6: Smoke test live**

```bash
npm run dev &
# in a separate shell:
curl -s http://localhost:3000/api/projects/proj-alwaha-clinic-booking/overview | head -c 400
curl -s http://localhost:3000/api/projects/does-not-exist/overview -o - -w "\nHTTP %{http_code}\n"
```

Expected: first returns JSON with `success:true`, second returns 404 with `success:false`.

- [ ] **Step 7: Commit**

```bash
git add src/app/api/projects
git commit -m "feat(api): add project overview/documents/risks/approvals endpoints"
```

---

## Task 9: Supabase Draft Migration

**Files:**
- Create: `supabase/migrations/0004_data_backbone_draft.sql`

> The four existing migrations are real and active. This file is **draft / future schema** for the unified backbone — wrapped in `IF NOT EXISTS` and commented as future-state so it can be applied later without conflicting with current tables.

- [ ] **Step 1: Write the migration**

```sql
-- 0004_data_backbone_draft.sql
-- Future-state schema for the unified data backbone (Person 1 — Data Backbone + APIs).
-- Safe to apply alongside existing tables (all CREATE statements are IF NOT EXISTS).
-- Mirrors src/lib/data/types.ts.

create table if not exists projects (
  id text primary key,
  name text not null,
  client_name text not null,
  description text not null default '',
  status text not null default 'active'
    check (status in ('discovery','active','at_risk','on_hold','completed','archived')),
  health_score int not null default 50 check (health_score between 0 and 100),
  start_date date,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists documents (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  title text not null,
  type text not null check (type in
    ('srs','contract','invoice','scope_request','client_request','other')),
  source text not null check (source in ('upload','paste','demo','ai_generated')),
  content_preview text not null default '',
  file_name text,
  mime_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists documents_project_idx on documents(project_id);

create table if not exists analysis_outputs (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  document_id text references documents(id) on delete set null,
  type text not null check (type in
    ('project_intelligence','contract','invoice','scope','srs','business_case','general')),
  summary text not null,
  raw_output jsonb,
  created_at timestamptz not null default now()
);
create index if not exists analysis_project_idx on analysis_outputs(project_id);

create table if not exists actions (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  document_id text references documents(id) on delete set null,
  analysis_output_id text references analysis_outputs(id) on delete set null,
  title text not null,
  description text not null default '',
  status text not null default 'todo' check (status in ('todo','in_progress','done','blocked')),
  priority text not null default 'medium' check (priority in ('low','medium','high','critical')),
  owner text,
  due_date date,
  source_type text not null,
  created_at timestamptz not null default now()
);
create index if not exists actions_project_idx on actions(project_id);

create table if not exists risks (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  document_id text references documents(id) on delete set null,
  analysis_output_id text references analysis_outputs(id) on delete set null,
  title text not null,
  description text not null default '',
  severity text not null check (severity in ('low','medium','high','critical')),
  source text not null,
  impact text not null default '',
  suggested_action text not null default '',
  status text not null default 'open' check (status in ('open','monitoring','resolved')),
  created_at timestamptz not null default now()
);
create index if not exists risks_project_idx on risks(project_id);

create table if not exists approvals (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  document_id text references documents(id) on delete set null,
  analysis_output_id text references analysis_outputs(id) on delete set null,
  title text not null,
  description text not null default '',
  type text not null check (type in
    ('invoice','scope_change','contract','payment','delivery','other')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  approver text,
  amount numeric,
  currency text,
  reason text,
  created_at timestamptz not null default now()
);
create index if not exists approvals_project_idx on approvals(project_id);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/0004_data_backbone_draft.sql
git commit -m "feat(db): draft migration for data-backbone tables"
```

---

## Task 10: `.env.example` placeholders

**Files:**
- Modify: `.env.example` (only if any of the four keys are missing)

- [ ] **Step 1: Read current file**

```bash
cat .env.example
```

- [ ] **Step 2: Append any missing placeholders**

For each of the following keys NOT present, append (do not overwrite or replace existing entries):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
```

If all four are already present, skip Step 3.

- [ ] **Step 3: Commit (only if file changed)**

```bash
git add .env.example
git commit -m "chore: ensure data backbone env placeholders are documented"
```

---

## Task 11: Final Quality Gate

**Files:** none.

- [ ] **Step 1: Typecheck**

```bash
npx tsc --noEmit
```

Expected: PASS (no new errors vs. baseline).

- [ ] **Step 2: Build**

```bash
powershell -NoProfile -Command "Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue"
npx next build
```

Expected: PASS.

- [ ] **Step 3: Lint (best-effort, may be pre-broken)**

```bash
npm run lint
```

Expected: same status as baseline (pre-existing ESLint flat-config breakage is acceptable; do not fix unrelated config).

- [ ] **Step 4: `git status` clean**

```bash
git status
```

Expected: working tree clean, branch `feature/data-backbone-apis` ahead of `main`.

---

## Task 12: Final Report

**Files:** none.

- [ ] **Step 1: Print the report to the user**

Include:
1. Files created (Tasks 1–4, 5, 7, 8, 9; possibly 10).
2. Files modified (Task 6 a–d; possibly 10).
3. New types added (full list from Task 1).
4. New helper functions added (Task 3 list).
5. Existing API routes normalized (4 routes from Task 6).
6. New API routes added (5 routes from Tasks 7–8).
7. Supabase preparation added (Task 9 migration).
8. Commands run + results: `npx tsc --noEmit` (PASS/FAIL), `npx next build` (PASS/FAIL), `npm run lint` (note pre-existing breakage).
9. Known limitations / TODOs:
   - Demo store is in-memory only; replace with Supabase reads when migration 0004 is applied.
   - `documents/analyze` returns a fallback shape; future work routes to live AI per `documentType`.
   - Other AI routes (srs, contract under `/api/ai/contract`) not normalized in this pass — only the four spec-named routes.
10. UI integration ready-but-not-connected:
    - Dashboard, Projects, Risk Radar, Approvals, Project Workspace can read from `/api/projects/[id]/...` and call `/api/documents/analyze`.

---

## Self-Review Notes

- **Spec coverage:** Phases 0–9 each map to Tasks 0, 1–4, 5, 6, 7–8, 9, 11, 11, 0+12 respectively. ✅
- **Placeholder scan:** No "TBD" / "implement later" — all code blocks are concrete. ✅
- **Type consistency:** `ActionInput`/`RiskInput`/`ApprovalInput` defined once in Task 5 and reused; `DEMO_PROJECT_ID` defined in Task 2 and re-exported in Task 4 + imported in Tasks 5 + 7. ✅
- **CLAUDE.md compliance:** No `zod-to-json-schema`, no AI co-author, additive-only edits to existing routes, non-blocking persistence preserved (untouched). ✅
