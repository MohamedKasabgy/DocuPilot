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
  | "project_evaluator"
  | "srs"
  | "contract"
  | "invoice"
  | "scope_change"
  | "meeting_notes"
  | "quote"
  | "scope_request"
  | "client_request"
  | "other";

export type DocumentStatus =
  | "uploaded"
  | "analyzing"
  | "analyzed"
  | "needs_review"
  | "needs_approval"
  | "out_of_scope"
  | "action_items_extracted"
  | "failed";

export type DocumentSource =
  | "upload"
  | "paste"
  | "demo"
  | "ai_generated";

export type AnalysisType =
  | "project_intelligence"
  | "project_evaluator"
  | "contract"
  | "invoice"
  | "scope"
  | "scope_change"
  | "srs"
  | "business_case"
  | "meeting_notes"
  | "general";

// Alias kept for the Task 1 naming convention.
export type AnalysisOutputType = AnalysisType;

export type Priority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type Severity =
  | "low"
  | "medium"
  | "high"
  | "critical";

// Alias kept for the Task 1 naming convention.
export type RiskSeverity = Severity;

export type ActionStatus =
  | "todo"
  | "in_progress"
  | "done"
  | "blocked";

export type RiskStatus =
  | "open"
  | "monitoring"
  | "resolved";

export type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected";

export type ApprovalType =
  | "invoice"
  | "scope_change"
  | "contract"
  | "payment"
  | "delivery"
  | "other";

export type BusinessCaseRecommendation =
  | "build"
  | "reconsider"
  | "needs_validation";

export interface Project {
  id: string;
  name: string;
  clientName: string;
  description: string;
  status: ProjectStatus;
  healthScore: number;
  startDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRecord {
  id: string;
  projectId: string;
  title: string;
  type: DocumentType;
  status?: DocumentStatus;
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
  linkedDocumentId?: string;
  type: AnalysisType;
  summary: string;
  actions: string[];
  risks: string[];
  approvals: string[];
  rawOutput?: unknown;
  createdAt: string;
}

export interface ActionItem {
  id: string;
  projectId: string;
  documentId?: string;
  linkedDocumentId?: string;
  analysisOutputId?: string;
  title: string;
  description: string;
  status: ActionStatus;
  priority: Priority;
  owner?: string;
  dueDate?: string;
  sourceType: AnalysisType;
  source?: AnalysisType | string;
  createdAt: string;
}

export interface RiskItem {
  id: string;
  projectId: string;
  documentId?: string;
  linkedDocumentId?: string;
  analysisOutputId?: string;
  title: string;
  description: string;
  severity: Severity;
  source: AnalysisType | string;
  impact: string;
  suggestedAction: string;
  status: RiskStatus;
  createdAt: string;
}

export interface ApprovalItem {
  id: string;
  projectId: string;
  documentId?: string;
  linkedDocumentId?: string;
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
  risks: string[];
  marketMaturity: string;
  recommendation: BusinessCaseRecommendation;
  suggestedMVP?: string[];
  requirements?: string[];
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

export interface ProjectCounts {
  documents: number;
  risks: number;
  approvals: number;
  actions: number;
  pendingApprovals: number;
  highRisks: number;
  outOfScopeRequests: number;
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
  analysisOutputs: AnalysisOutput[];
  risks: RiskItem[];
  approvals: ApprovalItem[];
  actions: ActionItem[];
  counts: ProjectCounts;
  stats: ProjectStats;
  latestActivity: LatestActivityEntry[];
}