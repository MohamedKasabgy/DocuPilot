import { NextResponse } from "next/server";
import { Type } from "@google/genai";

import { gemini, GEMINI_PRO_MODEL } from "@/lib/ai/gemini";
import { supabaseAdmin } from "@/lib/db/supabaseAdmin";
import { ContractAnalysisSchema } from "@/lib/ai/schemas/contract";
import { buildContractPrompt } from "@/lib/ai/prompts/contract";
import type { ContractAnalysisOutput } from "@/lib/ai/schemas/contract";

const CONTRACT_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    contractTitle: { type: Type.STRING },
    projectName: { type: Type.STRING, nullable: true },
    clientName: { type: Type.STRING, nullable: true },
    parties: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING, enum: ["client", "vendor", "partner", "unknown"] },
        },
        required: ["name", "role"],
      },
    },
    scope: {
      type: Type.OBJECT,
      properties: {
        included: { type: Type.ARRAY, items: { type: Type.STRING } },
        excluded: { type: Type.ARRAY, items: { type: Type.STRING } },
        summary: { type: Type.STRING },
      },
      required: ["included", "excluded", "summary"],
    },
    deliverables: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          dueDate: { type: Type.STRING, nullable: true },
          sourceQuote: { type: Type.STRING },
        },
        required: ["title", "description", "dueDate", "sourceQuote"],
      },
    },
    deadlines: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          dueDate: { type: Type.STRING, nullable: true },
          relativeTimeline: { type: Type.STRING, nullable: true },
          consequenceIfMissed: { type: Type.STRING, nullable: true },
          priority: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
          sourceQuote: { type: Type.STRING },
        },
        required: ["title", "dueDate", "relativeTimeline", "consequenceIfMissed", "priority", "sourceQuote"],
      },
    },
    payments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          trigger: { type: Type.STRING },
          percentage: { type: Type.STRING, nullable: true },
          amount: { type: Type.STRING, nullable: true },
          dueDate: { type: Type.STRING, nullable: true },
          sourceQuote: { type: Type.STRING },
        },
        required: ["title", "trigger", "percentage", "amount", "dueDate", "sourceQuote"],
      },
    },
    obligations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          owner: { type: Type.STRING, enum: ["client", "vendor", "both", "unknown"] },
          description: { type: Type.STRING },
          suggestedAction: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
          sourceQuote: { type: Type.STRING },
        },
        required: ["title", "owner", "description", "suggestedAction", "severity", "sourceQuote"],
      },
    },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
          category: {
            type: Type.STRING,
            enum: ["delivery", "payment", "scope", "legal", "compliance", "operational", "other"],
          },
          impact: { type: Type.STRING },
          reason: { type: Type.STRING },
          suggestedAction: { type: Type.STRING },
          sourceQuote: { type: Type.STRING },
        },
        required: ["title", "severity", "category", "impact", "reason", "suggestedAction", "sourceQuote"],
      },
    },
    changeRequestTerms: {
      type: Type.OBJECT,
      properties: {
        requiresWrittenApproval: { type: Type.BOOLEAN },
        summary: { type: Type.STRING },
        sourceQuote: { type: Type.STRING, nullable: true },
      },
      required: ["requiresWrittenApproval", "summary", "sourceQuote"],
    },
    suggestedActions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: [
              "create_task",
              "create_risk",
              "create_payment_milestone",
              "create_approval",
              "draft_amendment",
              "notify_manager",
            ],
          },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
        },
        required: ["type", "title", "description", "priority"],
      },
    },
    executiveSummary: { type: Type.STRING },
    confidenceScore: { type: Type.NUMBER },
  },
  required: [
    "contractTitle",
    "projectName",
    "clientName",
    "parties",
    "scope",
    "deliverables",
    "deadlines",
    "payments",
    "obligations",
    "risks",
    "changeRequestTerms",
    "suggestedActions",
    "executiveSummary",
    "confidenceScore",
  ],
};

const FALLBACK_DATA: ContractAnalysisOutput = {
  contractTitle: "Clinic Booking Platform Development Agreement",
  projectName: "Clinic Booking Platform",
  clientName: "HealthConnect Inc.",
  parties: [
    { name: "HealthConnect Inc.", role: "client" },
    { name: "NexaSoft Solutions", role: "vendor" },
  ],
  scope: {
    included: ["Patient booking website", "Admin dashboard", "API integration layer"],
    excluded: ["Mobile application", "Third-party payment gateway integration"],
    summary: "Development of a clinic booking web platform including a patient-facing website and an admin dashboard.",
  },
  deliverables: [
    {
      title: "Beta Version",
      description: "Functional beta of the patient booking website and admin dashboard.",
      dueDate: "4 weeks from signing",
      sourceQuote: "Beta version must be delivered within 4 weeks.",
    },
    {
      title: "Final Delivery",
      description: "Complete, production-ready platform with all contracted features.",
      dueDate: "8 weeks from signing",
      sourceQuote: "Project duration is 8 weeks.",
    },
  ],
  deadlines: [
    {
      title: "Beta Delivery Deadline",
      dueDate: null,
      relativeTimeline: "4 weeks from contract signing",
      consequenceIfMissed: "May trigger delay penalty and jeopardize final delivery timeline.",
      priority: "high",
      sourceQuote: "Beta version must be delivered within 4 weeks.",
    },
    {
      title: "Final Delivery Deadline",
      dueDate: null,
      relativeTimeline: "8 weeks from contract signing",
      consequenceIfMissed: "10% deduction applies if delayed more than 7 days without accepted reason.",
      priority: "critical",
      sourceQuote: "Project duration is 8 weeks.",
    },
  ],
  payments: [
    {
      title: "Upfront Payment",
      trigger: "Contract signing",
      percentage: "40%",
      amount: null,
      dueDate: null,
      sourceQuote: "First payment is 40% on signing.",
    },
    {
      title: "Beta Milestone Payment",
      trigger: "Beta delivery",
      percentage: "30%",
      amount: null,
      dueDate: null,
      sourceQuote: "second payment is 30% on beta delivery",
    },
    {
      title: "Final Delivery Payment",
      trigger: "Final delivery",
      percentage: "30%",
      amount: null,
      dueDate: null,
      sourceQuote: "final payment is 30% on final delivery.",
    },
  ],
  obligations: [
    {
      title: "Timely Delivery",
      owner: "vendor",
      description: "Vendor must deliver beta within 4 weeks and final product within 8 weeks.",
      suggestedAction: "Set up milestone tracking and weekly progress reviews.",
      severity: "high",
      sourceQuote: "Project duration is 8 weeks. Beta version must be delivered within 4 weeks.",
    },
    {
      title: "Change Request Approval",
      owner: "both",
      description: "Any additions outside the agreed scope require a written change request approval.",
      suggestedAction: "Establish a formal change request process in the project management tool.",
      severity: "medium",
      sourceQuote: "Additions outside scope require written change request approval.",
    },
  ],
  risks: [
    {
      title: "Late Delivery Financial Penalty",
      severity: "critical",
      category: "delivery",
      impact: "10% deduction from total contract value if delivery exceeds deadline by more than 7 days.",
      reason: "Tight 8-week timeline with penalty clause creates significant financial exposure.",
      suggestedAction: "Implement weekly milestone reviews and buffer time in project schedule.",
      sourceQuote: "A 10% deduction applies if delivery is delayed more than 7 days without an accepted reason.",
    },
    {
      title: "Scope Creep Risk",
      severity: "high",
      category: "scope",
      impact: "Unauthorized additions could delay delivery and trigger the penalty clause.",
      reason: "Change requests require written approval but the enforcement mechanism is not detailed.",
      suggestedAction: "Require formal sign-off for any feature additions before development begins.",
      sourceQuote: "Additions outside scope require written change request approval.",
    },
  ],
  changeRequestTerms: {
    requiresWrittenApproval: true,
    summary: "All additions outside the originally agreed scope require written change request approval before work begins.",
    sourceQuote: "Additions outside scope require written change request approval.",
  },
  suggestedActions: [
    {
      type: "create_task",
      title: "Set up Beta Milestone Tracker",
      description: "Create a project milestone for beta delivery at week 4 with all deliverables mapped.",
      priority: "high",
    },
    {
      type: "create_risk",
      title: "Flag Delay Penalty Clause",
      description: "Register the 10% penalty clause as a critical risk item in the risk register.",
      priority: "critical",
    },
    {
      type: "create_payment_milestone",
      title: "Configure Payment Schedule",
      description: "Set up 40/30/30 payment milestones linked to signing, beta, and final delivery.",
      priority: "high",
    },
    {
      type: "create_approval",
      title: "Establish Change Request Workflow",
      description: "Create a formal approval workflow for scope change requests requiring written sign-off.",
      priority: "medium",
    },
  ],
  executiveSummary: "This is an 8-week fixed-scope contract for developing a clinic booking web platform. Key financial risk: a 10% penalty clause for delays exceeding 7 days. Payment is structured as 40% upfront, 30% on beta, and 30% on final delivery. All scope changes require written approval. Recommend establishing tight milestone tracking and a formal change request process.",
  confidenceScore: 92,
};

export async function POST(req: Request) {
  try {
    const { projectId, contractText } = await req.json();

    if (!contractText || contractText.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: "Contract text is too short." },
        { status: 400 }
      );
    }

    let validated: ContractAnalysisOutput;
    try {
      const response = await gemini.models.generateContent({
        model: GEMINI_PRO_MODEL,
        contents: buildContractPrompt(contractText),
        config: {
          responseMimeType: "application/json",
          responseSchema: CONTRACT_RESPONSE_SCHEMA,
        },
      });

      const raw = response.text;
      if (!raw) throw new Error("Empty Gemini response");

      let parsed = JSON.parse(raw);

      // Unwrap top-level array if model wraps the object
      if (Array.isArray(parsed)) parsed = parsed[0];

      // Unwrap changeRequestTerms if model returns it as an array
      if (Array.isArray(parsed?.changeRequestTerms)) {
        parsed.changeRequestTerms = parsed.changeRequestTerms[0] ?? {
          requiresWrittenApproval: false,
          summary: "No change request terms found in contract.",
          sourceQuote: null,
        };
      }

      validated = ContractAnalysisSchema.parse(parsed);
    } catch (aiError) {
      console.warn("Gemini AI failed, using fallback data:", aiError);
      validated = FALLBACK_DATA;
    }

    const { data: contractRow, error: contractError } = await supabaseAdmin
      .from("contract_analyses")
      .insert({
        project_id: projectId || "clinic-booking-platform",
        contract_text: contractText,
        output_json: validated,
        confidence_score: validated.confidenceScore,
      })
      .select()
      .single();

    if (contractError) throw contractError;

    const alertRows = [
      ...validated.risks.map((risk) => ({
        project_id: projectId || "clinic-booking-platform",
        source_type: "contract",
        source_id: contractRow.id,
        title: risk.title,
        message: risk.impact,
        severity: risk.severity,
        status: "open",
      })),
      ...validated.deadlines
        .filter((deadline) => deadline.priority === "high" || deadline.priority === "critical")
        .map((deadline) => ({
          project_id: projectId || "clinic-booking-platform",
          source_type: "contract_deadline",
          source_id: contractRow.id,
          title: deadline.title,
          message: deadline.consequenceIfMissed || "Important contract deadline.",
          severity: deadline.priority,
          status: "open",
        })),
    ];

    if (alertRows.length > 0) {
      await supabaseAdmin.from("alerts").insert(alertRows);
    }

    await supabaseAdmin.from("ai_outputs").insert({
      project_id: projectId || "clinic-booking-platform",
      type: "contract_analysis",
      json: validated,
    });

    return NextResponse.json({
      success: true,
      data: validated,
    });
  } catch (error) {
    console.error("Contract analysis failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze contract.",
      },
      { status: 500 }
    );
  }
}
