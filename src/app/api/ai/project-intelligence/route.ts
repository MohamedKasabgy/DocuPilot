import { NextResponse } from "next/server";

import { supabaseAdmin, isSupabaseConfigured } from "@/lib/db/supabaseAdmin";
import {
  ProjectIntelligenceSchema,
  projectIntelligenceJsonSchema,
  type ProjectIntelligenceOutput,
  type PipelineLanguage,
} from "@/lib/ai/schemas/projectIntelligence";
import {
  buildProjectIntelligencePrompt,
  PROJECT_INTELLIGENCE_SCHEMA_HINT,
  type AnalysisDepth,
} from "@/lib/ai/prompts/projectIntelligence";
import { fallbackProjectIntelligence } from "@/lib/ai/fallbacks/projectIntelligence";
import { generateWithGeminiReliability } from "@/lib/ai/geminiReliability";
import { extractJsonObject } from "@/lib/ai/jsonUtils";

interface ProjectIntelligenceRequest {
  clientRequest: string;
  projectId?: string;
  language?: PipelineLanguage;
  analysisDepth?: AnalysisDepth;
  includeTechnicalBlueprint?: boolean;
}

const VALID_LANGUAGES: PipelineLanguage[] = ["english", "arabic", "bilingual"];
const VALID_DEPTHS: AnalysisDepth[] = ["quick", "standard", "deep"];

// ─── Output normalization ─────────────────────────────────────────────────────
// Recursively coerces 0–1 fractional confidenceScore values to 0–100 integers.
// Mirrors the SRS route's defensive parse — Gemini occasionally returns
// fractions despite the schema saying integer.
function normalizeConfidenceScores(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeConfidenceScores);
  }
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
      if (
        key === "confidenceScore" &&
        typeof raw === "number" &&
        raw >= 0 &&
        raw <= 1
      ) {
        result[key] = Math.round(raw * 100);
      } else {
        result[key] = normalizeConfidenceScores(raw);
      }
    }
    return result;
  }
  return value;
}

function aggregateConfidence(output: ProjectIntelligenceOutput): number {
  const scores = [
    output.businessUnderstanding.confidenceScore,
    output.businessAnalysis.confidenceScore,
    output.businessRules.confidenceScore,
    output.technicalBlueprint.confidenceScore,
    output.executionPlan.confidenceScore,
    output.finalDecision.confidenceScore,
  ];
  const total = scores.reduce((sum, s) => sum + s, 0);
  return Math.round(total / scores.length);
}

export async function POST(req: Request) {
  try {
    const body: ProjectIntelligenceRequest = await req.json();
    const {
      clientRequest,
      projectId,
      language: rawLanguage = "english",
      analysisDepth: rawDepth = "standard",
      includeTechnicalBlueprint = true,
    } = body;

    if (!clientRequest || clientRequest.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Client request is too short (min 10 characters).",
        },
        { status: 400 }
      );
    }

    const language: PipelineLanguage = VALID_LANGUAGES.includes(rawLanguage)
      ? rawLanguage
      : "english";
    const analysisDepth: AnalysisDepth = VALID_DEPTHS.includes(rawDepth)
      ? rawDepth
      : "standard";

    const prompt = buildProjectIntelligencePrompt(
      clientRequest,
      language,
      analysisDepth,
      includeTechnicalBlueprint
    );

    let validated: ProjectIntelligenceOutput;
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
        responseSchema: projectIntelligenceJsonSchema,
      },
      { schemaHint: PROJECT_INTELLIGENCE_SCHEMA_HINT }
    );

    if (aiResult.ok) {
      providerUsed = aiResult.providerUsed;
      modelUsed = aiResult.modelUsed;
      attempts = aiResult.attempts;
      retried = aiResult.retried;
      if (aiResult.providerUsed === "qwen") usedFallback = true;

      try {
        const extracted = extractJsonObject(aiResult.text);
        const normalized = normalizeConfidenceScores(extracted);
        validated = ProjectIntelligenceSchema.parse(normalized);
      } catch (parseError) {
        if (aiResult.providerUsed === "qwen") {
          console.warn(
            "[ProjectIntelligence] Qwen raw response preview:",
            aiResult.text.slice(0, 800)
          );
        }
        console.warn(
          `[ProjectIntelligence] Failed to parse/validate ${aiResult.providerUsed} response:`,
          parseError
        );
        validated = fallbackProjectIntelligence(language);
        usedFallback = true;
        fallbackReason = "parse_error";
        providerUsed = "local_fallback";
      }
    } else {
      console.warn(
        "[ProjectIntelligence] All AI providers failed — using local fallback.",
        {
          attempts: aiResult.attempts,
          fallbackReason: aiResult.fallbackReason,
          errorCode: aiResult.errorCode,
        }
      );
      validated = fallbackProjectIntelligence(language);
      usedFallback = true;
      fallbackReason = aiResult.fallbackReason;
      errorCode = aiResult.errorCode;
      attempts = aiResult.attempts;
      retried = aiResult.retried;
      providerUsed = "local_fallback";
    }

    const aggregateConfidenceScore = aggregateConfidence(validated);

    // Non-blocking persistence — never fail the response on a DB error.
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from("project_intelligence_reports").insert({
          project_id: projectId ?? null,
          client_request: clientRequest,
          language,
          analysis_depth: analysisDepth,
          output_json: validated,
          confidence_score: aggregateConfidenceScore,
          provider_used: providerUsed,
          used_fallback: usedFallback,
          fallback_reason: fallbackReason,
        });

        await supabaseAdmin.from("ai_outputs").insert({
          project_id: projectId ?? null,
          type: "project_intelligence",
          json: validated,
        });
      } catch (dbError) {
        console.error(
          "[ProjectIntelligence] Supabase persistence failed (non-blocking):",
          dbError
        );
      }
    } else {
      console.warn(
        "[ProjectIntelligence] Supabase not configured — skipping persistence."
      );
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
          ? "All AI providers unavailable — local fallback Project Intelligence loaded."
          : `Gemini unavailable — Project Intelligence generated by ${providerUsed}.`
        : undefined,
      data: validated,
    });
  } catch (error) {
    console.error("Project Intelligence generation failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate project intelligence. Please try again.",
      },
      { status: 500 }
    );
  }
}
