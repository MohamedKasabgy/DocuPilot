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
