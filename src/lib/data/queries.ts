import {
  Project,
  DocumentRecord,
  AnalysisOutput,
  RiskItem,
  ApprovalItem,
  ActionItem,
  ProjectOverview,
} from './types';
import {
  projects,
  documents,
  analysisOutputs,
  risks,
  approvals,
  actions,
} from './demo-store';

export function getProjects(): Project[] {
  return projects;
}

export function getProjectById(projectId: string): Project | undefined {
  return projects.find((p) => p.id === projectId);
}

export function getProjectDocuments(projectId: string): DocumentRecord[] {
  return documents.filter((d) => d.projectId === projectId);
}

export function getProjectAnalysisOutputs(projectId: string): AnalysisOutput[] {
  return analysisOutputs.filter((ao) => ao.projectId === projectId);
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

export function getProjectOverview(projectId: string): ProjectOverview | undefined {
  const project = getProjectById(projectId);
  if (!project) return undefined;

  const projectDocs = getProjectDocuments(projectId);
  const projectAnalysis = getProjectAnalysisOutputs(projectId);
  const projectRisks = getProjectRisks(projectId);
  const projectApprovals = getProjectApprovals(projectId);
  const projectActions = getProjectActions(projectId);

  return {
    project,
    documents: projectDocs,
    analysisOutputs: projectAnalysis,
    risks: projectRisks,
    approvals: projectApprovals,
    actions: projectActions,
    counts: {
      documents: projectDocs.length,
      risks: projectRisks.length,
      approvals: projectApprovals.length,
      actions: projectActions.length,
      pendingApprovals: projectApprovals.filter((a) => a.status === 'pending').length,
      highRisks: projectRisks.filter((r) => r.severity === 'high' || r.severity === 'critical').length,
      outOfScopeRequests: projectDocs.filter((d) => d.status === 'out_of_scope').length,
    },
  };
}
