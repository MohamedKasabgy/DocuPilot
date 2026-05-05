import {
  Project,
  DocumentRecord,
  AnalysisOutput,
  ActionItem,
  RiskItem,
  ApprovalItem,
  BusinessCaseOutput,
} from './types';

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Clinic Booking Platform',
    client: 'Al Waha Clinics',
    description: 'Web booking system with an admin dashboard, appointment management, online payments, patient profiles, and notification settings.',
    status: 'active',
    createdAt: '2026-04-10T08:00:00Z',
  },
];

export const documents: DocumentRecord[] = [
  {
    id: 'doc-1',
    projectId: 'proj-1',
    type: 'project_evaluator',
    title: 'Project Evaluator Output',
    status: 'analyzed',
    createdAt: '2026-04-12T09:30:00Z',
  },
  {
    id: 'doc-2',
    projectId: 'proj-1',
    type: 'contract',
    title: 'Al Waha Clinics Service Agreement',
    status: 'analyzed',
    createdAt: '2026-04-15T10:00:00Z',
  },
  {
    id: 'doc-3',
    projectId: 'proj-1',
    type: 'invoice',
    title: 'Supplier Invoice - DesignPro Studio',
    status: 'needs_approval',
    createdAt: '2026-04-20T11:15:00Z',
  },
  {
    id: 'doc-4',
    projectId: 'proj-1',
    type: 'scope_change',
    title: 'Client Change Request - Mobile App',
    status: 'out_of_scope',
    createdAt: '2026-05-01T14:00:00Z',
  },
  {
    id: 'doc-5',
    projectId: 'proj-1',
    type: 'meeting_notes',
    title: 'Weekly Sync Meeting Notes',
    status: 'action_items_extracted',
    createdAt: '2026-05-04T16:00:00Z',
  },
];

export const analysisOutputs: AnalysisOutput[] = [
  {
    id: 'ao-1',
    projectId: 'proj-1',
    linkedDocumentId: 'doc-1',
    type: 'business_case',
    data: {
      potentialRevenue: 'USD 30k–80k ARR',
      estimatedCost: '$75,000',
      roi: 'high',
      marketMaturity: 'Growing demand in local healthcare sector',
      recommendation: 'build',
      suggestedMVP: ['Web booking', 'Admin dashboard', 'Basic notifications'],
      requirements: ['Patient profiles', 'Online payments'],
    } as BusinessCaseOutput,
    createdAt: '2026-04-12T09:35:00Z',
  },
  {
    id: 'ao-2',
    projectId: 'proj-1',
    linkedDocumentId: 'doc-2',
    type: 'contract_analysis',
    data: {
      obligations: ['Deliver web platform in 3 months', 'Provide 30 days of warranty support'],
      paymentMilestones: ['Kickoff 30%', 'Mid-build 40%', 'Delivery 30%'],
    },
    createdAt: '2026-04-15T10:05:00Z',
  },
  {
    id: 'ao-3',
    projectId: 'proj-1',
    linkedDocumentId: 'doc-4',
    type: 'scope_analysis',
    data: {
      scopeStatus: 'out_of_scope',
      reason: 'Mobile applications are not included in the contract.',
      timelineImpact: 'high',
      costImpact: 'high',
    },
    createdAt: '2026-05-01T14:05:00Z',
  },
];

export const actions: ActionItem[] = [
  {
    id: 'act-1',
    projectId: 'proj-1',
    title: 'Draft Formal Change Request for Mobile App',
    description: 'Prepare CR document for client sign-off based on out-of-scope mobile app request.',
    status: 'open',
    source: 'Scope Guard',
    owner: 'PM',
    dueDate: '2026-05-08T17:00:00Z',
    createdAt: '2026-05-01T14:10:00Z',
  },
  {
    id: 'act-2',
    projectId: 'proj-1',
    title: 'Setup API Integration Keys',
    description: 'Ensure API keys for payment gateway are ready for development.',
    status: 'open',
    source: 'Meeting Notes',
    // Deliberately no owner
    dueDate: '2026-05-10T17:00:00Z',
    createdAt: '2026-05-04T16:05:00Z',
  },
  {
    id: 'act-3',
    projectId: 'proj-1',
    title: 'Pay DesignPro Invoice',
    description: 'Process payment for design assets once approved by Finance.',
    status: 'open',
    source: 'Invoice Analysis',
    owner: 'Finance',
    dueDate: '2026-05-15T17:00:00Z',
    createdAt: '2026-04-20T11:20:00Z',
  },
];

export const risks: RiskItem[] = [
  {
    id: 'risk-1',
    projectId: 'proj-1',
    title: 'Mobile app request outside approved scope',
    description: 'Client expects mobile apps which are not in the contract, risking scope creep.',
    severity: 'high',
    status: 'open',
    source: 'Scope Guard',
    createdAt: '2026-05-01T14:05:00Z',
  },
  {
    id: 'risk-2',
    projectId: 'proj-1',
    title: 'Tight delivery timeline clause',
    description: 'Contract mandates 3 month delivery with penalties for delay.',
    severity: 'medium',
    status: 'open',
    source: 'Contract Analysis',
    createdAt: '2026-04-15T10:05:00Z',
  },
  {
    id: 'risk-3',
    projectId: 'proj-1',
    title: 'Missing owner for API keys',
    description: 'Payment integration cannot proceed without API keys, but no owner is assigned.',
    severity: 'medium',
    status: 'open',
    source: 'Meeting Notes',
    createdAt: '2026-05-04T16:05:00Z',
  },
  {
    id: 'risk-4',
    projectId: 'proj-1',
    title: 'Pending supplier invoice approval',
    description: 'DesignPro invoice is pending approval, could delay design asset delivery.',
    severity: 'low',
    status: 'open',
    source: 'Invoice Analysis',
    createdAt: '2026-04-20T11:20:00Z',
  },
];

export const approvals: ApprovalItem[] = [
  {
    id: 'app-1',
    projectId: 'proj-1',
    linkedDocumentId: 'doc-3',
    title: 'DesignPro Studio Invoice $12,450',
    description: 'Invoice for UI/UX design deliverables for the booking platform.',
    status: 'pending',
    approvers: ['Finance', 'Director'],
    createdAt: '2026-04-20T11:15:00Z',
  },
];
