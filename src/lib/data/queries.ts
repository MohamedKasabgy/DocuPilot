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
  ProjectCounts,
  LatestActivityEntry,
} from "./types";

export function getProjects(): Project[] {
  return [...projects];
}

export function getProjectById(projectId: string): Project | undefined {
  return projects.find((project) => project.id === projectId);
}

export function getProjectDocuments(projectId: string): DocumentRecord[] {
  return documents.filter((document) => document.projectId === projectId);
}

export function getProjectAnalysisOutputs(projectId: string): AnalysisOutput[] {
  return analysisOutputs.filter((analysisOutput) => analysisOutput.projectId === projectId);
}

// Backward compatibility alias.
export const getAnalysisOutputs = getProjectAnalysisOutputs;

export function getProjectRisks(projectId: string): RiskItem[] {
  return risks.filter((risk) => risk.projectId === projectId);
}

export function getProjectApprovals(projectId: string): ApprovalItem[] {
  return approvals.filter((approval) => approval.projectId === projectId);
}

export function getProjectActions(projectId: string): ActionItem[] {
  return actions.filter((action) => action.projectId === projectId);
}

export function getDocumentById(documentId: string): DocumentRecord | undefined {
  return documents.find((document) => document.id === documentId);
}

export function getActionsByDocument(documentId: string): ActionItem[] {
  return actions.filter(
    (action) => action.documentId === documentId || action.linkedDocumentId === documentId,
  );
}

export function getRisksByDocument(documentId: string): RiskItem[] {
  return risks.filter(
    (risk) => risk.documentId === documentId || risk.linkedDocumentId === documentId,
  );
}

export function getApprovalsByDocument(documentId: string): ApprovalItem[] {
  return approvals.filter(
    (approval) => approval.documentId === documentId || approval.linkedDocumentId === documentId,
  );
}

function computeStats(
  docs: DocumentRecord[],
  projectRisks: RiskItem[],
  projectApprovals: ApprovalItem[],
  projectActions: ActionItem[],
): ProjectStats {
  return {
    totalDocuments: docs.length,
    openRisks: projectRisks.filter((risk) => risk.status !== "resolved").length,
    highRisks: projectRisks.filter(
      (risk) =>
        (risk.severity === "high" || risk.severity === "critical") &&
        risk.status !== "resolved",
    ).length,
    pendingApprovals: projectApprovals.filter((approval) => approval.status === "pending").length,
    openActions: projectActions.filter((action) => action.status !== "done").length,
    completedActions: projectActions.filter((action) => action.status === "done").length,
  };
}

function computeCounts(
  docs: DocumentRecord[],
  projectRisks: RiskItem[],
  projectApprovals: ApprovalItem[],
  projectActions: ActionItem[],
): ProjectCounts {
  return {
    documents: docs.length,
    risks: projectRisks.length,
    approvals: projectApprovals.length,
    actions: projectActions.length,
    pendingApprovals: projectApprovals.filter((approval) => approval.status === "pending").length,
    highRisks: projectRisks.filter(
      (risk) => risk.severity === "high" || risk.severity === "critical",
    ).length,
    outOfScopeRequests: docs.filter((document) => document.status === "out_of_scope").length,
  };
}

function buildLatestActivity(
  docs: DocumentRecord[],
  projectAnalysisOutputs: AnalysisOutput[],
  projectActions: ActionItem[],
  projectRisks: RiskItem[],
  projectApprovals: ApprovalItem[],
): LatestActivityEntry[] {
  const entries: LatestActivityEntry[] = [
    ...docs.map<LatestActivityEntry>((document) => ({
      kind: "document",
      id: document.id,
      title: document.title,
      createdAt: document.createdAt,
    })),
    ...projectAnalysisOutputs.map<LatestActivityEntry>((analysisOutput) => ({
      kind: "analysis",
      id: analysisOutput.id,
      title: analysisOutput.summary.slice(0, 80),
      createdAt: analysisOutput.createdAt,
    })),
    ...projectActions.map<LatestActivityEntry>((action) => ({
      kind: "action",
      id: action.id,
      title: action.title,
      createdAt: action.createdAt,
    })),
    ...projectRisks.map<LatestActivityEntry>((risk) => ({
      kind: "risk",
      id: risk.id,
      title: risk.title,
      createdAt: risk.createdAt,
    })),
    ...projectApprovals.map<LatestActivityEntry>((approval) => ({
      kind: "approval",
      id: approval.id,
      title: approval.title,
      createdAt: approval.createdAt,
    })),
  ];

  return entries
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 10);
}

export function getProjectOverview(projectId: string): ProjectOverview | undefined {
  const project = getProjectById(projectId);

  if (!project) {
    return undefined;
  }

  const projectDocuments = getProjectDocuments(projectId);
  const projectAnalysisOutputs = getProjectAnalysisOutputs(projectId);
  const projectRisks = getProjectRisks(projectId);
  const projectApprovals = getProjectApprovals(projectId);
  const projectActions = getProjectActions(projectId);

  return {
    project,
    documents: projectDocuments,
    analysisOutputs: projectAnalysisOutputs,
    risks: projectRisks,
    approvals: projectApprovals,
    actions: projectActions,
    counts: computeCounts(projectDocuments, projectRisks, projectApprovals, projectActions),
    stats: computeStats(projectDocuments, projectRisks, projectApprovals, projectActions),
    latestActivity: buildLatestActivity(
      projectDocuments,
      projectAnalysisOutputs,
      projectActions,
      projectRisks,
      projectApprovals,
    ),
  };
}