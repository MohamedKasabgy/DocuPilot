import { NextResponse } from "next/server";
import { Type } from "@google/genai";

import { generateWithGeminiReliability } from "@/lib/ai/geminiReliability";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/db/supabaseAdmin";
import { extractJsonObject } from "@/lib/ai/jsonUtils";
import { InvoiceAnalysisSchema } from "@/lib/ai/schemas/invoice";
import { buildInvoicePrompt } from "@/lib/ai/prompts/invoice";
import type { InvoiceAnalysisOutput } from "@/lib/ai/schemas/invoice";
import type { ContractContext, InvoiceHints } from "@/lib/ai/prompts/invoice";

const INVOICE_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    vendor: { type: Type.STRING },
    invoiceNumber: { type: Type.STRING, nullable: true },
    amount: { type: Type.NUMBER, nullable: true },
    currency: { type: Type.STRING, nullable: true },
    dueDate: { type: Type.STRING, nullable: true },
    contractAlignment: {
      type: Type.OBJECT,
      properties: {
        aligned: { type: Type.BOOLEAN },
        score: { type: Type.NUMBER },
        summary: { type: Type.STRING },
        discrepancies: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["aligned", "score", "summary", "discrepancies"],
    },
    duplicateRisk: {
      type: Type.OBJECT,
      properties: {
        level: { type: Type.STRING, enum: ["none", "low", "medium", "high"] },
        reason: { type: Type.STRING, nullable: true },
      },
      required: ["level", "reason"],
    },
    flags: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: ["amount_mismatch", "vendor_mismatch", "duplicate", "out_of_scope", "missing_info", "other"],
          },
          severity: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
          message: { type: Type.STRING },
        },
        required: ["type", "severity", "message"],
      },
    },
    approvalRecommendation: {
      type: Type.OBJECT,
      properties: {
        action: { type: Type.STRING, enum: ["approve", "review", "reject", "escalate"] },
        reason: { type: Type.STRING },
        suggestedApprovers: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["action", "reason", "suggestedApprovers"],
    },
    analysisNotes: { type: Type.STRING },
    confidenceScore: { type: Type.NUMBER },
  },
  required: [
    "vendor",
    "invoiceNumber",
    "amount",
    "currency",
    "dueDate",
    "contractAlignment",
    "duplicateRisk",
    "flags",
    "approvalRecommendation",
    "analysisNotes",
    "confidenceScore",
  ],
};

const FALLBACK_DATA: InvoiceAnalysisOutput = {
  vendor: "DesignPro Studio",
  invoiceNumber: "#65442",
  amount: 6500,
  currency: "SAR",
  dueDate: "2026-05-15",
  contractAlignment: {
    aligned: true,
    score: 82,
    summary:
      "Invoice aligns with the Mobile App UI Design Services contract. The described work (UI Design Milestone 2) matches the second milestone in the payment schedule.",
    discrepancies: [],
  },
  duplicateRisk: {
    level: "medium",
    reason:
      "Invoice #65441 from the same vendor was submitted 3 days ago for the same amount (6,500 SAR). Verify this is a separate milestone payment.",
  },
  flags: [
    {
      type: "duplicate",
      severity: "high",
      message:
        "Possible duplicate: Invoice #65441 from DesignPro Studio was submitted 3 days ago for an identical amount.",
    },
  ],
  approvalRecommendation: {
    action: "review",
    reason:
      "Potential duplicate invoice detected. Manual verification of milestone completion is required before approval.",
    suggestedApprovers: ["Finance Manager", "Project Manager"],
  },
  analysisNotes:
    "This invoice from DesignPro Studio for UI Design Milestone 2 is flagged due to a potential duplicate with invoice #65441. The amount and vendor match a recent submission. Manual verification of milestone completion is recommended before approval.",
  confidenceScore: 75,
};

interface InvoiceRequestBody {
  projectId?: string;
  invoiceText?: string;
  invoiceNumber?: string;
  vendor?: string;
  amount?: number;
  currency?: string;
  dueDate?: string;
  description?: string;
  projectName?: string;
  contractId?: string;
  linkedContract?: ContractContext;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as InvoiceRequestBody;
    const {
      projectId,
      invoiceText,
      invoiceNumber,
      vendor,
      amount,
      currency,
      dueDate,
      description,
      projectName,
      contractId,
      linkedContract,
    } = body;

    const hasRawText = invoiceText && invoiceText.trim().length > 10;
    const hasStructuredData = (vendor && vendor.trim()) || amount != null;

    if (!hasRawText && !hasStructuredData) {
      return NextResponse.json(
        { success: false, error: "Provide either invoiceText or structured invoice fields (vendor/amount)." },
        { status: 400 }
      );
    }

    const hints: InvoiceHints = {
      invoiceNumber: invoiceNumber ?? undefined,
      vendor: vendor ?? undefined,
      amount: amount ?? undefined,
      currency: currency ?? undefined,
      dueDate: dueDate ?? undefined,
      description: description ?? undefined,
      projectName: projectName ?? undefined,
    };

    const contractCtx: ContractContext | null = linkedContract
      ? {
          id: linkedContract.id,
          title: linkedContract.title,
          client: linkedContract.client ?? null,
          vendor: linkedContract.vendor ?? null,
          totalValue: linkedContract.totalValue ?? null,
          currency: linkedContract.currency ?? null,
          status: linkedContract.status ?? null,
          scopeSummary: linkedContract.scopeSummary ?? null,
          scopeExcluded: linkedContract.scopeExcluded ?? null,
          paymentMilestones: linkedContract.paymentMilestones ?? null,
          changeRequestTerms: linkedContract.changeRequestTerms ?? null,
        }
      : null;

    let validated: InvoiceAnalysisOutput;
    let modelUsed: string | null = null;
    let attempts = 0;
    let retried = false;
    let usedFallback = false;
    let fallbackReason: string | null = null;
    let errorCode: number | null = null;
    let providerUsed: "gemini" | "qwen" | "local_fallback" = "local_fallback";

    const aiResult = await generateWithGeminiReliability(
      buildInvoicePrompt(invoiceText ?? null, hints, contractCtx),
      {
        responseMimeType: "application/json",
        responseSchema: INVOICE_RESPONSE_SCHEMA,
      }
    );

    if (aiResult.ok) {
      providerUsed = aiResult.providerUsed;
      modelUsed = aiResult.modelUsed;
      attempts = aiResult.attempts;
      retried = aiResult.retried;
      if (aiResult.providerUsed === "qwen") usedFallback = true;
      try {
        const parsed = extractJsonObject(aiResult.text) as Record<string, unknown>;
        validated = InvoiceAnalysisSchema.parse(parsed);
      } catch (parseError) {
        console.warn(`[Invoice] Failed to parse/validate ${aiResult.providerUsed} response:`, parseError);
        validated = FALLBACK_DATA;
        usedFallback = true;
        fallbackReason = "parse_error";
        providerUsed = "local_fallback";
      }
    } else {
      console.warn("[Invoice] All AI providers failed — using local fallback data.", {
        attempts: aiResult.attempts,
        fallbackReason: aiResult.fallbackReason,
        errorCode: aiResult.errorCode,
      });
      validated = FALLBACK_DATA;
      usedFallback = true;
      fallbackReason = aiResult.fallbackReason;
      errorCode = aiResult.errorCode;
      attempts = aiResult.attempts;
      retried = aiResult.retried;
      providerUsed = "local_fallback";
    }

    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from("ai_outputs").insert({
          project_id: projectId ?? "clinic-booking-platform",
          type: "invoice_analysis",
          json: {
            invoiceNumber: invoiceNumber ?? null,
            contractId: contractId ?? null,
            analysis: validated,
          },
        });
      } catch (dbError) {
        console.error("[Invoice] Supabase persistence failed (non-blocking):", dbError);
      }
    } else {
      console.warn("[Invoice] Supabase not configured — skipping persistence.");
    }

    return NextResponse.json({
      success: true,
      providerUsed,
      // Fix: source reflects the actual provider, not usedFallback flag
      source: providerUsed === "local_fallback" ? "fallback" : providerUsed,
      usedFallback,
      fallbackReason: fallbackReason ?? null,
      errorCode: errorCode ?? null,
      modelUsed,
      attempts,
      retried,
      contractId: contractId ?? null,
      data: validated,
    });
  } catch (error) {
    console.error("[Invoice] Analysis failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze invoice." },
      { status: 500 }
    );
  }
}
