export type DocumentType =
  | 'project_evaluator'
  | 'srs'
  | 'contract'
  | 'invoice'
  | 'scope_change'
  | 'meeting_notes'
  | 'quote';

export type DocumentStatus =
  | 'uploaded'
  | 'analyzing'
  | 'analyzed'
  | 'needs_review'
  | 'needs_approval'
  | 'out_of_scope'
  | 'action_items_extracted'
  | 'failed';

export type AnalysisOutputType =
  | 'business_case'
  | 'srs'
  | 'contract_analysis'
  | 'invoice_analysis'
  | 'scope_analysis'
  | 'meeting_summary';

export type ActionStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold' | 'at_risk';
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  projectId: string;
  type: DocumentType;
  title: string;
  status: DocumentStatus;
  createdAt: string;
  url?: string;
}

export interface BusinessCaseOutput {
  potentialRevenue: string;
  estimatedCost: string;
  roi: 'low' | 'medium' | 'high';
  marketMaturity: string;
  recommendation: 'build' | 'conditional' | 'reconsider';
  suggestedMVP: string[];
  requirements: string[];
}

export interface AnalysisOutput {
  id: string;
  projectId: string;
  linkedDocumentId?: string;
  type: AnalysisOutputType;
  data: any; // Can be more strictly typed per AnalysisOutputType if needed
  createdAt: string;
}

export interface ActionItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: ActionStatus;
  source: string; // e.g., 'contract', 'meeting_notes', 'scope_guard'
  owner?: string;
  dueDate?: string;
  createdAt: string;
}

export interface RiskItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  status: 'open' | 'mitigated' | 'accepted';
  source: string; // e.g., 'Project Evaluator', 'Contract Analysis'
  createdAt: string;
}

export interface ApprovalItem {
  id: string;
  projectId: string;
  linkedDocumentId?: string;
  title: string;
  description: string;
  status: ApprovalStatus;
  approvers: string[];
  createdAt: string;
}

export interface ProjectOverview {
  project: Project;
  documents: DocumentRecord[];
  analysisOutputs: AnalysisOutput[];
  risks: RiskItem[];
  approvals: ApprovalItem[];
  actions: ActionItem[];
  counts: {
    documents: number;
    risks: number;
    approvals: number;
    actions: number;
    pendingApprovals: number;
    highRisks: number;
    outOfScopeRequests: number;
  };
}
