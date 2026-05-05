import { NextResponse } from "next/server";
import { DEMO_PROJECT_ID } from "@/lib/data/demo-store";
import type {
  ActionItem,
  AnalysisOutput,
  ApprovalItem,
  DocumentRecord,
  DocumentType,
  RiskItem,
} from "@/lib/data/types";

const VALID_TYPES: DocumentType[] = [
  "project_evaluator",
  "srs",
  "contract",
  "invoice",
  "scope_change",
  "meeting_notes",
  "quote",
  "scope_request",
  "client_request",
  "other",
];

interface AnalyzeBody {
  projectId?: string;
  documentId?: string;
  documentType?: DocumentType;
  title?: string;
  text?: string;
}

interface AnalyzeResponseData {
  document: DocumentRecord;
  analysisOutput: AnalysisOutput;
  actions: ActionItem[];
  risks: RiskItem[];
  approvals: ApprovalItem[];
}

function nowIso(): string {
  return new Date().toISOString();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 48);
}

function createBaseDocument(input: {
  projectId: string;
  documentId?: string;
  documentType: DocumentType;
  title: string;
  text: string;
}): DocumentRecord {
  const createdAt = nowIso();
  const generatedId =
    input.documentId ??
    `doc-${input.documentType}-${slugify(input.title || "untitled")}-${Date.now()}`;

  const statusByType: Partial<Record<DocumentType, DocumentRecord["status"]>> = {
    contract: "analyzed",
    invoice: "needs_approval",
    scope_change: "out_of_scope",
    scope_request: "out_of_scope",
    meeting_notes: "action_items_extracted",
    project_evaluator: "analyzed",
    srs: "analyzed",
  };

  return {
    id: generatedId,
    projectId: input.projectId,
    title: input.title,
    type: input.documentType,
    status: statusByType[input.documentType] ?? "analyzed",
    source: "paste",
    contentPreview:
      input.text.length > 240 ? `${input.text.slice(0, 237)}...` : input.text,
    createdAt,
    updatedAt: createdAt,
  };
}

function buildContractAnalysis(document: DocumentRecord): AnalyzeResponseData {
  const createdAt = nowIso();

  const analysisOutput: AnalysisOutput = {
    id: `analysis-${document.id}`,
    projectId: document.projectId,
    documentId: document.id,
    linkedDocumentId: document.id,
    type: "contract",
    summary:
      "The service agreement covers the web platform and admin dashboard. It includes delivery milestones, payment terms, obligations, and a written change request process for additional scope.",
    actions: [
      "Track beta delivery deadline.",
      "Create payment milestone reminders.",
      "Require written approval for additional scope.",
    ],
    risks: [
      "Medium-risk delivery clause may create penalty exposure if beta delivery is delayed.",
    ],
    approvals: [],
    rawOutput: {
      obligations: [
        "Deliver web booking platform.",
        "Deliver admin dashboard.",
        "Support appointment management and online payments.",
      ],
      paymentMilestones: [
        "40% upfront payment.",
        "40% after beta delivery.",
        "20% at final handoff.",
      ],
      riskyClauses: [
        "Beta delivery delay may trigger client escalation or penalty discussion.",
      ],
      contractScope:
        "The contract covers the web platform and admin dashboard only. Mobile applications require a separate written change request.",
    },
    createdAt,
  };

  const actions: ActionItem[] = [
    {
      id: `action-${document.id}-beta-deadline`,
      projectId: document.projectId,
      documentId: document.id,
      linkedDocumentId: document.id,
      analysisOutputId: analysisOutput.id,
      title: "Track beta delivery deadline",
      description:
        "Add a delivery reminder for the contract beta milestone to reduce delay and penalty risk.",
      status: "todo",
      priority: "high",
      owner: "Project Manager",
      dueDate: "2026-05-20",
      sourceType: "contract",
      source: "Contract Analysis",
      createdAt,
    },
  ];

  const risks: RiskItem[] = [
    {
      id: `risk-${document.id}-delivery-clause`,
      projectId: document.projectId,
      documentId: document.id,
      linkedDocumentId: document.id,
      analysisOutputId: analysisOutput.id,
      title: "Medium-risk delivery clause",
      description:
        "The contract includes delivery timing expectations that may create escalation risk if beta delivery is delayed.",
      severity: "medium",
      source: "Contract Analysis",
      impact: "Possible penalty or client escalation if beta delivery slips.",
      suggestedAction: "Add delivery reminder and assign owner.",
      status: "monitoring",
      createdAt,
    },
  ];

  return {
    document,
    analysisOutput,
    actions,
    risks,
    approvals: [],
  };
}

function buildInvoiceAnalysis(document: DocumentRecord): AnalyzeResponseData {
  const createdAt = nowIso();

  const analysisOutput: AnalysisOutput = {
    id: `analysis-${document.id}`,
    projectId: document.projectId,
    documentId: document.id,
    linkedDocumentId: document.id,
    type: "invoice",
    summary:
      "The invoice requires finance review before payment. It should be checked against the approved milestone and duplicate risk before processing.",
    actions: [
      "Send invoice to Finance Manager for approval.",
      "Check invoice against approved payment milestone.",
      "Schedule payment reminder before due date.",
    ],
    risks: [
      "Payment may be delayed if approval is not completed this week.",
      "Duplicate risk should be checked before processing.",
    ],
    approvals: ["Finance approval required before payment."],
    rawOutput: {
      vendor: "Apex Industrial Solutions",
      amount: 18500,
      currency: "SAR",
      dueDate: "2026-05-28",
      duplicateRisk: "low",
      approvalRecommendation: "needs_approval",
    },
    createdAt,
  };

  const actions: ActionItem[] = [
    {
      id: `action-${document.id}-finance-approval`,
      projectId: document.projectId,
      documentId: document.id,
      linkedDocumentId: document.id,
      analysisOutputId: analysisOutput.id,
      title: "Send invoice to finance approval",
      description:
        "Route the invoice to the Finance Manager and verify it against the approved payment milestone before payment.",
      status: "todo",
      priority: "high",
      owner: "Operations Team",
      dueDate: "2026-05-10",
      sourceType: "invoice",
      source: "Invoice Analysis",
      createdAt,
    },
  ];

  const risks: RiskItem[] = [
    {
      id: `risk-${document.id}-approval-delay`,
      projectId: document.projectId,
      documentId: document.id,
      linkedDocumentId: document.id,
      analysisOutputId: analysisOutput.id,
      title: "Invoice requires finance approval",
      description:
        "The invoice has not been approved by finance yet and may delay payment processing.",
      severity: "medium",
      source: "Invoice Analysis",
      impact: "Payment may be delayed without approval.",
      suggestedAction: "Send to Approval Center.",
      status: "open",
      createdAt,
    },
  ];

  const approvals: ApprovalItem[] = [
    {
      id: `approval-${document.id}-finance`,
      projectId: document.projectId,
      documentId: document.id,
      linkedDocumentId: document.id,
      analysisOutputId: analysisOutput.id,
      title: "Finance approval for invoice",
      description:
        "Invoice requires finance approval before payment processing.",
      type: "invoice",
      status: "pending",
      approver: "Finance Manager",
      amount: 18500,
      currency: "SAR",
      reason:
        "Invoice must be reviewed against approved milestone and duplicate risk before payment.",
      createdAt,
    },
  ];

  return {
    document,
    analysisOutput,
    actions,
    risks,
    approvals,
  };
}

function buildScopeChangeAnalysis(document: DocumentRecord): AnalyzeResponseData {
  const createdAt = nowIso();

  const analysisOutput: AnalysisOutput = {
    id: `analysis-${document.id}`,
    projectId: document.projectId,
    documentId: document.id,
    linkedDocumentId: document.id,
    type: "scope_change",
    summary:
      "The mobile app request is outside the approved project scope and contract scope. Recommended action is to create a formal change request with estimated timeline and cost.",
    actions: [
      "Create Change Request for mobile app scope.",
      "Estimate additional mobile development, QA, deployment, and maintenance effort.",
      "Send suggested client reply for approval.",
    ],
    risks: [
      "Mobile app request may add 2 to 4 weeks and additional cost if accepted without formal approval.",
    ],
    approvals: ["Client approval required for change request."],
    rawOutput: {
      classification: "out_of_scope",
      reason:
        "The requested mobile app is not included in the approved project scope or contract scope.",
      timelineImpact: "Estimated +2 to +4 weeks.",
      costImpact:
        "High — additional mobile development, QA, deployment, and maintenance effort required.",
      recommendedAction: "Create Change Request",
      suggestedClientReply:
        "Thank you for the request. Based on the current approved scope, the project includes the web platform and admin dashboard only. A mobile app would be considered an additional scope item. We can prepare a change request with the estimated timeline and cost for your approval.",
    },
    createdAt,
  };

  const actions: ActionItem[] = [
    {
      id: `action-${document.id}-change-request`,
      projectId: document.projectId,
      documentId: document.id,
      linkedDocumentId: document.id,
      analysisOutputId: analysisOutput.id,
      title: "Create Change Request",
      description:
        "Prepare a formal change request with estimated timeline, cost, and approval requirements for the mobile app request.",
      status: "todo",
      priority: "critical",
      owner: "Account Director",
      dueDate: "2026-05-08",
      sourceType: "scope_change",
      source: "Scope Guard",
      createdAt,
    },
  ];

  const risks: RiskItem[] = [
    {
      id: `risk-${document.id}-out-of-scope`,
      projectId: document.projectId,
      documentId: document.id,
      linkedDocumentId: document.id,
      analysisOutputId: analysisOutput.id,
      title: "Request outside approved scope",
      description:
        "The client request is not included in the approved project scope or contract scope.",
      severity: "high",
      source: "Scope Guard",
      impact:
        "Timeline may increase by 2 to 4 weeks and additional mobile development cost is likely.",
      suggestedAction: "Create Change Request",
      status: "open",
      createdAt,
    },
  ];

  const approvals: ApprovalItem[] = [
    {
      id: `approval-${document.id}-client`,
      projectId: document.projectId,
      documentId: document.id,
      linkedDocumentId: document.id,
      analysisOutputId: analysisOutput.id,
      title: "Client approval for change request",
      description:
        "The scope change is outside current scope and requires written client approval.",
      type: "scope_change",
      status: "pending",
      approver: "Al Waha Clinics",
      reason:
        "Mobile applications are not covered by the current service agreement.",
      createdAt,
    },
  ];

  return {
    document,
    analysisOutput,
    actions,
    risks,
    approvals,
  };
}

function buildMeetingNotesAnalysis(document: DocumentRecord): AnalyzeResponseData {
  const createdAt = nowIso();

  const analysisOutput: AnalysisOutput = {
    id: `analysis-${document.id}`,
    projectId: document.projectId,
    documentId: document.id,
    linkedDocumentId: document.id,
    type: "meeting_notes",
    summary:
      "Meeting notes produced action items around API documentation, notification preferences, payment gateway validation, and owner follow-ups.",
    actions: [
      "Assign owner for API documentation follow-up.",
      "Confirm payment gateway test credentials.",
      "Review notification preferences with clinic operations team.",
    ],
    risks: ["Meeting action has no assigned owner and may be missed."],
    approvals: [],
    rawOutput: {
      decisions: [
        "Proceed with web MVP first.",
        "Payment gateway validation is required before invoice approval.",
      ],
      missingOwners: ["API documentation follow-up owner is missing."],
    },
    createdAt,
  };

  const actions: ActionItem[] = [
    {
      id: `action-${document.id}-assign-owner`,
      projectId: document.projectId,
      documentId: document.id,
      linkedDocumentId: document.id,
      analysisOutputId: analysisOutput.id,
      title: "Assign owner for API documentation follow-up",
      description:
        "Meeting notes flagged API documentation follow-up with no owner. Assign a responsible team member.",
      status: "todo",
      priority: "medium",
      sourceType: "meeting_notes",
      source: "Meeting Notes",
      createdAt,
    },
  ];

  const risks: RiskItem[] = [
    {
      id: `risk-${document.id}-missing-owner`,
      projectId: document.projectId,
      documentId: document.id,
      linkedDocumentId: document.id,
      analysisOutputId: analysisOutput.id,
      title: "Meeting action has no owner",
      description:
        "API documentation follow-up was captured in meeting notes but does not have a clear owner.",
      severity: "low",
      source: "Meeting Notes",
      impact: "Follow-up may be missed.",
      suggestedAction: "Assign owner.",
      status: "open",
      createdAt,
    },
  ];

  return {
    document,
    analysisOutput,
    actions,
    risks,
    approvals: [],
  };
}

function buildProjectEvaluatorAnalysis(
  document: DocumentRecord,
): AnalyzeResponseData {
  const createdAt = nowIso();

  const analysisOutput: AnalysisOutput = {
    id: `analysis-${document.id}`,
    projectId: document.projectId,
    documentId: document.id,
    linkedDocumentId: document.id,
    type: "project_evaluator",
    summary:
      "The Clinic Booking Platform is a strong MVP opportunity. The first version should focus on web booking, admin dashboard, appointment management, online payments, patient profiles, and notification settings.",
    actions: [
      "Confirm payment gateway requirements.",
      "Validate notification channels with the client.",
      "Prioritize web MVP before mobile expansion.",
    ],
    risks: [
      "Project feasibility depends on third-party integrations.",
      "Scope may expand if mobile apps are requested too early.",
    ],
    approvals: [],
    rawOutput: {
      potentialRevenue:
        "SAR 120,000–250,000 annually depending on clinic adoption and add-on modules",
      estimatedCost: "SAR 35,000–65,000 for the MVP scope",
      roi:
        "Positive if clinics reduce manual booking effort and improve appointment attendance",
      marketMaturity:
        "Moderate to high; clinic booking tools are established but local workflow customization creates opportunity",
      recommendation: "build",
      suggestedMVP: [
        "Web booking portal",
        "Admin dashboard",
        "Appointment management",
        "Online payments",
        "Patient profiles",
        "Notification settings",
      ],
      requirements: [
        "Patients can book appointments online.",
        "Admins can manage appointments and availability.",
        "Users can pay online for eligible appointments.",
        "Patients have basic profile records.",
        "Admins can configure notification preferences.",
      ],
    },
    createdAt,
  };

  const actions: ActionItem[] = [
    {
      id: `action-${document.id}-validate-integrations`,
      projectId: document.projectId,
      documentId: document.id,
      linkedDocumentId: document.id,
      analysisOutputId: analysisOutput.id,
      title: "Validate integration requirements early",
      description:
        "Confirm payment gateway and notification integration requirements before implementation expands.",
      status: "todo",
      priority: "high",
      owner: "Technical Lead",
      dueDate: "2026-05-12",
      sourceType: "project_evaluator",
      source: "Project Evaluator",
      createdAt,
    },
  ];

  const risks: RiskItem[] = [
    {
      id: `risk-${document.id}-integration-feasibility`,
      projectId: document.projectId,
      documentId: document.id,
      linkedDocumentId: document.id,
      analysisOutputId: analysisOutput.id,
      title: "Project feasibility depends on integrations",
      description:
        "The MVP depends on payment gateway and notification integrations that must be validated early.",
      severity: "medium",
      source: "Project Evaluator",
      impact:
        "Cost and timeline may increase if integrations are more complex than expected.",
      suggestedAction: "Validate integration requirements early.",
      status: "monitoring",
      createdAt,
    },
  ];

  return {
    document,
    analysisOutput,
    actions,
    risks,
    approvals: [],
  };
}

function buildGeneralAnalysis(document: DocumentRecord): AnalyzeResponseData {
  const createdAt = nowIso();

  const analysisOutput: AnalysisOutput = {
    id: `analysis-${document.id}`,
    projectId: document.projectId,
    documentId: document.id,
    linkedDocumentId: document.id,
    type: "general",
    summary:
      "Demo document analysis completed. This fallback output keeps the document connected to the project memory until live AI analysis is configured.",
    actions: ["Review document and link it to the appropriate project workflow."],
    risks: [],
    approvals: [],
    rawOutput: {
      note:
        "Live document AI provider is not configured. Returning structured fallback output.",
    },
    createdAt,
  };

  const actions: ActionItem[] = [
    {
      id: `action-${document.id}-review`,
      projectId: document.projectId,
      documentId: document.id,
      linkedDocumentId: document.id,
      analysisOutputId: analysisOutput.id,
      title: "Review analyzed document",
      description:
        "Review the uploaded document and decide whether it should create actions, risks, or approvals.",
      status: "todo",
      priority: "medium",
      sourceType: "general",
      source: "Document Analysis",
      createdAt,
    },
  ];

  return {
    document,
    analysisOutput,
    actions,
    risks: [],
    approvals: [],
  };
}

function analyzeByType(document: DocumentRecord): AnalyzeResponseData {
  switch (document.type) {
    case "contract":
      return buildContractAnalysis(document);

    case "invoice":
      return buildInvoiceAnalysis(document);

    case "scope_change":
    case "scope_request":
    case "client_request":
      return buildScopeChangeAnalysis(document);

    case "meeting_notes":
      return buildMeetingNotesAnalysis(document);

    case "project_evaluator":
    case "srs":
      return buildProjectEvaluatorAnalysis(document);

    case "quote":
    case "other":
    default:
      return buildGeneralAnalysis(document);
  }
}

export async function POST(req: Request) {
  let body: AnalyzeBody;

  try {
    body = (await req.json()) as AnalyzeBody;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON body.",
      },
      { status: 400 },
    );
  }

  const {
    projectId = DEMO_PROJECT_ID,
    documentId,
    documentType,
    title,
    text,
  } = body;

  if (!projectId || typeof projectId !== "string") {
    return NextResponse.json(
      {
        success: false,
        error: "projectId is required.",
      },
      { status: 400 },
    );
  }

  if (!documentType || !VALID_TYPES.includes(documentType)) {
    return NextResponse.json(
      {
        success: false,
        error: `documentType must be one of ${VALID_TYPES.join(", ")}.`,
      },
      { status: 400 },
    );
  }

  if (!text || typeof text !== "string" || text.trim().length < 5) {
    return NextResponse.json(
      {
        success: false,
        error: "text is required (min 5 chars).",
      },
      { status: 400 },
    );
  }

  const document = createBaseDocument({
    projectId,
    documentId,
    documentType,
    title: title?.trim() || "Untitled Document",
    text: text.trim(),
  });

  const data = analyzeByType(document);

  return NextResponse.json({
    success: true,
    data,
    usedFallback: true,
  });
}