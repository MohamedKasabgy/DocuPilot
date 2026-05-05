import { NextResponse } from "next/server";

import { supabaseAdmin, isSupabaseConfigured } from "@/lib/db/supabaseAdmin";
import {
  ScopeAnalysisSchema,
  scopeAnalysisJsonSchema,
  SCOPE_SCHEMA_HINT,
  type ScopeAnalysisOutput,
} from "@/lib/ai/schemas/scope";
import {
  buildScopePrompt,
  type ScopeLanguage,
} from "@/lib/ai/prompts/scope";
import { fallbackScopeAnalysis } from "@/lib/ai/fallbacks/scope";
import { generateWithGeminiReliability } from "@/lib/ai/geminiReliability";
import { extractJsonObject } from "@/lib/ai/jsonUtils";

interface ScopeRequest {
  projectId?: string;
  newRequest: string;
  existingSrs?: string;
  contractScope?: string;
  language?: ScopeLanguage;
}

const VALID_LANGUAGES: ScopeLanguage[] = ["english", "arabic", "bilingual", "auto"];

function normalizeConfidence(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const obj = { ...(raw as Record<string, unknown>) };
  const cs = obj.confidenceScore;
  if (typeof cs === "number" && cs >= 0 && cs <= 1) {
    obj.confidenceScore = Math.round(cs * 100);
  }
  return obj;
}

export async function POST(req: Request) {
  try {
    const body: ScopeRequest = await req.json();
    const {
      projectId,
      newRequest,
      existingSrs,
      contractScope,
      language: rawLanguage = "auto",
    } = body;

    if (!newRequest || newRequest.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "New request is too short (min 5 characters)." },
        { status: 400 }
      );
    }

    const language: ScopeLanguage = VALID_LANGUAGES.includes(rawLanguage)
      ? rawLanguage
      : "auto";

    const prompt = buildScopePrompt({
      newRequest,
      existingSrs,
      contractScope,
      language,
    });

    let validated: ScopeAnalysisOutput;
    let usedFallback = false;
    let fallbackReason: string | null = null;
    let errorCode: number | null = null;
    let modelUsed: string | null = null;
    let attempts = 0;
    let retried = false;
    let providerUsed: "gemini" | "qwen" | "local_fallback" = "local_fallback";

    const aiResult = await generateWithGeminiReliability(
      prompt,
      {
        responseMimeType: "application/json",
        responseSchema: scopeAnalysisJsonSchema,
      },
      { schemaHint: SCOPE_SCHEMA_HINT }
    );

    if (aiResult.ok) {
      providerUsed = aiResult.providerUsed;
      modelUsed = aiResult.modelUsed;
      attempts = aiResult.attempts;
      retried = aiResult.retried;
      if (aiResult.providerUsed === "qwen") usedFallback = true;

      try {
        const extracted = extractJsonObject(aiResult.text);
        const normalized = normalizeConfidence(extracted);
        validated = ScopeAnalysisSchema.parse(normalized);
      } catch (parseError) {
        if (aiResult.providerUsed === "qwen") {
          console.warn("[Scope] Qwen raw response preview:", aiResult.text.slice(0, 800));
        }
        console.warn(
          `[Scope] Failed to parse/validate ${aiResult.providerUsed} response:`,
          parseError
        );
        validated = fallbackScopeAnalysis(newRequest, language);
        usedFallback = true;
        fallbackReason = "parse_error";
        providerUsed = "local_fallback";
      }
    } else {
      console.warn("[Scope] All AI providers failed — using local fallback.", {
        attempts: aiResult.attempts,
        fallbackReason: aiResult.fallbackReason,
        errorCode: aiResult.errorCode,
      });
      validated = fallbackScopeAnalysis(newRequest, language);
      usedFallback = true;
      fallbackReason = aiResult.fallbackReason;
      errorCode = aiResult.errorCode;
      attempts = aiResult.attempts;
      retried = aiResult.retried;
      providerUsed = "local_fallback";
    }

    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from("scope_analyses").insert({
          project_id: projectId ?? null,
          new_request: newRequest,
          existing_srs: existingSrs ?? null,
          contract_scope: contractScope ?? null,
          language,
          scope_status: validated.scopeStatus,
          recommendation: validated.recommendation,
          timeline_impact: validated.timelineImpact,
          cost_impact: validated.costImpact,
          business_impact: validated.businessImpact,
          risk_impact: validated.riskImpact,
          output_json: validated,
          confidence_score: validated.confidenceScore,
          provider_used: providerUsed,
          used_fallback: usedFallback,
          fallback_reason: fallbackReason,
        });

        await supabaseAdmin.from("ai_outputs").insert({
          project_id: projectId ?? null,
          type: "scope_analysis",
          json: validated,
        });

        if (validated.riskImpact === "high") {
          await supabaseAdmin.from("alerts").insert({
            project_id: projectId ?? null,
            source: "scope_guard",
            severity: "high",
            title: "High-risk scope change detected",
            description: validated.reason,
            metadata: {
              scopeStatus: validated.scopeStatus,
              recommendation: validated.recommendation,
              newRequest,
            },
          });
        }
      } catch (dbError) {
        console.error("[Scope] Supabase persistence failed (non-blocking):", dbError);
      }
    } else {
      console.warn("[Scope] Supabase not configured — skipping persistence.");
    }

    const isLocalFallback = providerUsed === "local_fallback";
    const source = isLocalFallback ? "fallback" : providerUsed;

    return NextResponse.json({
      success: true,
      providerUsed,
      source,
      usedFallback,
      fallbackReason,
      errorCode,
      modelUsed,
      attempts,
      retried,
      warning: usedFallback
        ? isLocalFallback
          ? "All AI providers unavailable — local fallback scope analysis loaded."
          : `Gemini unavailable — scope analysis generated by ${providerUsed}.`
        : undefined,
      data: validated,
    });
  } catch (error) {
    console.error("Scope analysis failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze scope. Please try again." },
      { status: 500 }
    );
  }
}
