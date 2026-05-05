import type {
  ActionItem,
  AnalysisOutput,
  ApprovalItem,
  DocumentRecord,
  Project,
  RiskItem,
} from "./types";

export const DEMO_PROJECT_ID = "project-clinic-booking-platform";

export const projects: Project[] = [
  {
    id: DEMO_PROJECT_ID,
    name: "Clinic Booking Platform",
    clientName: "Al Waha Clinics",
    description:
      "A web booking system for Al Waha Clinics with an admin dashboard, appointment management, online payments, patient profiles, and notification settings.",
    status: "active",
    healthScore: 78,
    startDate: "2026-04-01",
    dueDate: "2026-06-30",
    createdAt: "2026-04-01T09:00:00.000Z",
    updatedAt: "2026-05-05T12:00:00.000Z",
  },
];

export const documents: DocumentRecord[] = [
  {
    id: "doc-project-evaluator-output",
    projectId: DEMO_PROJECT_ID,
    title: "Project Evaluator Output",
    type: "project_evaluator",
    status: "analyzed",
    source: "ai_generated",
    contentPreview:
      "Business case and requirements for the Clinic Booking Platform, including revenue potential, estimated cost, ROI, risks, market maturity, recommendation, MVP scope, and functional requirements.",
    fileName: "clinic-booking-project-evaluator.json",
    mimeType: "application/json",
    createdAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-04-01T10:20:00.000Z",
  },
  {
    id: "doc-service-agreement",
    projectId: DEMO_PROJECT_ID,
    title: "Al Waha Clinics Service Agreement",
    type: "contract",
    status: "analyzed",
    source: "upload",
    contentPreview:
      "Service agreement covering the web booking platform, admin dashboard, delivery milestones, payment terms, client responsibilities, and change request process.",
    fileName: "al-waha-clinics-service-agreement.pdf",
    mimeType: "application/pdf",
    createdAt: "2026-04-03T11:30:00.000Z",
    updatedAt: "2026-04-03T12:00:00.000Z",
  },
  {
    id: "doc-supplier-invoice",
    projectId: DEMO_PROJECT_ID,
    title: "Supplier Invoice",
    type: "invoice",
    status: "needs_approval",
    source: "upload",
    contentPreview:
      "Supplier invoice for UI implementation and frontend integration work. Requires finance approval before payment.",
    fileName: "supplier-invoice-apex-ui.pdf",
    mimeType: "application/pdf",
    createdAt: "2026-04-18T14:10:00.000Z",
    updatedAt: "2026-04-18T14:30:00.000Z",
  },
  {
    id: "doc-client-change-request-mobile-app",
    projectId: DEMO_PROJECT_ID,
    title: "Client Change Request — Mobile App",
    type: "scope_change",
    status: "out_of_scope",
    source: "paste",
    contentPreview:
      "Client requested adding a mobile app for the same booking platform. Scope Guard classified the request as out of scope because mobile applications are not included in the approved project scope or contract scope.",
    createdAt: "2026-05-05T09:15:00.000Z",
    updatedAt: "2026-05-05T09:25:00.000Z",
  },
  {
    id: "doc-meeting-notes",
    projectId: DEMO_PROJECT_ID,
    title: "Implementation Meeting Notes",
    type: "meeting_notes",
    status: "action_items_extracted",
    source: "paste",
    contentPreview:
      "Meeting notes covering API documentation, payment gateway validation, notification preferences, owner follow-ups, and unresolved integration questions.",
    createdAt: "2026-05-04T16:00:00.000Z",
    updatedAt: "2026-05-04T16:20:00.000Z",
  },
];

export const analysisOutputs: AnalysisOutput[] = [
  {
    id: "analysis-project-evaluator-output",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-project-evaluator-output",
    linkedDocumentId: "doc-project-evaluator-output",
    type: "project_evaluator",
    summary:
      "The Clinic Booking Platform is a strong MVP opportunity for Al Waha Clinics. The project should focus first on web booking, admin dashboard, appointment management, online payments, patient profiles, and notification settings.",
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
      potentialRevenue: "SAR 120,000–250,000 annually depending on clinic adoption and add-on modules",
      estimatedCost: "SAR 35,000–65,000 for the MVP scope",
      roi: "Positive if clinics reduce manual booking effort and improve appointment attendance",
      marketMaturity: "Moderate to high; clinic booking tools are established but local workflow customization creates opportunity",
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
    createdAt: "2026-04-01T10:20:00.000Z",
  },
  {
    id: "analysis-service-agreement",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-service-agreement",
    linkedDocumentId: "doc-service-agreement",
    type: "contract",
    summary:
      "The service agreement covers the web platform and admin dashboard only. It defines delivery milestones, payment terms, and a written change request process for additional scope.",
    actions: [
      "Track beta delivery deadline.",
      "Create payment milestone reminders.",
      "Require written approval for mobile app scope.",
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
    createdAt: "2026-04-03T12:00:00.000Z",
  },
  {
    id: "analysis-supplier-invoice",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-supplier-invoice",
    linkedDocumentId: "doc-supplier-invoice",
    type: "invoice",
    summary:
      "Supplier invoice requires finance review before payment. The invoice appears linked to frontend implementation work and should be checked against approved milestones.",
    actions: [
      "Send invoice to Finance Manager for approval.",
      "Check invoice against service agreement payment milestone.",
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
    createdAt: "2026-04-18T14:30:00.000Z",
  },
  {
    id: "analysis-client-change-request-mobile-app",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-client-change-request-mobile-app",
    linkedDocumentId: "doc-client-change-request-mobile-app",
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
    createdAt: "2026-05-05T09:25:00.000Z",
  },
  {
    id: "analysis-meeting-notes",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-meeting-notes",
    linkedDocumentId: "doc-meeting-notes",
    type: "meeting_notes",
    summary:
      "Meeting notes produced action items around API documentation, notification preferences, payment gateway validation, and owner follow-ups.",
    actions: [
      "Assign owner for API documentation follow-up.",
      "Confirm payment gateway test credentials.",
      "Review notification preferences with clinic operations team.",
    ],
    risks: [
      "Meeting action has no assigned owner and may be missed.",
    ],
    approvals: [],
    rawOutput: {
      decisions: [
        "Proceed with web MVP first.",
        "Payment gateway validation is required before invoice approval.",
      ],
      missingOwners: [
        "API documentation follow-up owner is missing.",
      ],
    },
    createdAt: "2026-05-04T16:20:00.000Z",
  },
];

export const actions: ActionItem[] = [
  {
    id: "action-track-beta-deadline",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-service-agreement",
    linkedDocumentId: "doc-service-agreement",
    analysisOutputId: "analysis-service-agreement",
    title: "Track beta delivery deadline",
    description:
      "Add a delivery reminder for the contract beta milestone to reduce delay and penalty risk.",
    status: "todo",
    priority: "high",
    owner: "Project Manager",
    dueDate: "2026-05-20",
    sourceType: "contract",
    source: "Contract Analysis",
    createdAt: "2026-04-03T12:05:00.000Z",
  },
  {
    id: "action-create-mobile-change-request",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-client-change-request-mobile-app",
    linkedDocumentId: "doc-client-change-request-mobile-app",
    analysisOutputId: "analysis-client-change-request-mobile-app",
    title: "Create Change Request for mobile app",
    description:
      "Prepare a formal change request with estimated timeline, cost, and approval requirements for the mobile app request.",
    status: "todo",
    priority: "critical",
    owner: "Account Director",
    dueDate: "2026-05-08",
    sourceType: "scope_change",
    source: "Scope Guard",
    createdAt: "2026-05-05T09:30:00.000Z",
  },
  {
    id: "action-send-invoice-to-finance",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-supplier-invoice",
    linkedDocumentId: "doc-supplier-invoice",
    analysisOutputId: "analysis-supplier-invoice",
    title: "Send supplier invoice to finance approval",
    description:
      "Route the supplier invoice to the Finance Manager and verify it against the approved payment milestone before payment.",
    status: "in_progress",
    priority: "high",
    owner: "Operations Team",
    dueDate: "2026-05-10",
    sourceType: "invoice",
    source: "Invoice Analysis",
    createdAt: "2026-04-18T14:35:00.000Z",
  },
  {
    id: "action-assign-api-doc-owner",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-meeting-notes",
    linkedDocumentId: "doc-meeting-notes",
    analysisOutputId: "analysis-meeting-notes",
    title: "Assign owner for API documentation follow-up",
    description:
      "Meeting notes flagged API documentation follow-up with no owner. Assign a responsible team member.",
    status: "todo",
    priority: "medium",
    sourceType: "meeting_notes",
    source: "Meeting Notes",
    createdAt: "2026-05-04T16:25:00.000Z",
  },
];

export const risks: RiskItem[] = [
  {
    id: "risk-mobile-app-out-of-scope",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-client-change-request-mobile-app",
    linkedDocumentId: "doc-client-change-request-mobile-app",
    analysisOutputId: "analysis-client-change-request-mobile-app",
    title: "Mobile app request outside approved scope",
    description:
      "The client requested a mobile app that is not included in the approved project scope or contract scope.",
    severity: "high",
    source: "Scope Guard",
    impact: "Timeline may increase by 2 to 4 weeks and additional mobile development cost is likely.",
    suggestedAction: "Create Change Request",
    status: "open",
    createdAt: "2026-05-05T09:35:00.000Z",
  },
  {
    id: "risk-medium-delivery-clause",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-service-agreement",
    linkedDocumentId: "doc-service-agreement",
    analysisOutputId: "analysis-service-agreement",
    title: "Medium-risk delivery clause",
    description:
      "The service agreement includes delivery timing expectations that may create escalation risk if beta delivery is delayed.",
    severity: "medium",
    source: "Contract Analysis",
    impact: "Possible penalty or client escalation if beta delivery slips.",
    suggestedAction: "Add delivery reminder and assign owner.",
    status: "monitoring",
    createdAt: "2026-04-03T12:10:00.000Z",
  },
  {
    id: "risk-invoice-approval-delay",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-supplier-invoice",
    linkedDocumentId: "doc-supplier-invoice",
    analysisOutputId: "analysis-supplier-invoice",
    title: "Invoice requires finance approval",
    description:
      "The supplier invoice has not been approved by finance yet.",
    severity: "medium",
    source: "Invoice Analysis",
    impact: "Payment may be delayed without approval.",
    suggestedAction: "Send to Approval Center.",
    status: "open",
    createdAt: "2026-04-18T14:40:00.000Z",
  },
  {
    id: "risk-integration-feasibility",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-project-evaluator-output",
    linkedDocumentId: "doc-project-evaluator-output",
    analysisOutputId: "analysis-project-evaluator-output",
    title: "Project feasibility depends on integrations",
    description:
      "The MVP depends on payment gateway and notification integrations that must be validated early.",
    severity: "medium",
    source: "Project Evaluator",
    impact: "Cost and timeline may increase if integrations are more complex than expected.",
    suggestedAction: "Validate integration requirements early.",
    status: "monitoring",
    createdAt: "2026-04-01T10:30:00.000Z",
  },
  {
    id: "risk-meeting-action-no-owner",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-meeting-notes",
    linkedDocumentId: "doc-meeting-notes",
    analysisOutputId: "analysis-meeting-notes",
    title: "Meeting action has no owner",
    description:
      "API documentation follow-up was captured in meeting notes but does not have a clear owner.",
    severity: "low",
    source: "Meeting Notes",
    impact: "Follow-up may be missed.",
    suggestedAction: "Assign owner.",
    status: "open",
    createdAt: "2026-05-04T16:30:00.000Z",
  },
];

export const approvals: ApprovalItem[] = [
  {
    id: "approval-supplier-invoice-finance",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-supplier-invoice",
    linkedDocumentId: "doc-supplier-invoice",
    analysisOutputId: "analysis-supplier-invoice",
    title: "Finance approval for supplier invoice",
    description:
      "Supplier invoice requires finance approval before payment processing.",
    type: "invoice",
    status: "pending",
    approver: "Finance Manager",
    amount: 18500,
    currency: "SAR",
    reason:
      "Invoice must be reviewed against approved milestone and duplicate risk before payment.",
    createdAt: "2026-04-18T14:45:00.000Z",
  },
  {
    id: "approval-mobile-change-request",
    projectId: DEMO_PROJECT_ID,
    documentId: "doc-client-change-request-mobile-app",
    linkedDocumentId: "doc-client-change-request-mobile-app",
    analysisOutputId: "analysis-client-change-request-mobile-app",
    title: "Client approval for mobile app change request",
    description:
      "Mobile app request is outside current scope and requires written client approval.",
    type: "scope_change",
    status: "pending",
    approver: "Al Waha Clinics",
    reason:
      "Mobile applications are not covered by the current service agreement.",
    createdAt: "2026-05-05T09:40:00.000Z",
  },
];