import type { GenerateContentConfig } from "@google/genai";
import { gemini } from "@/lib/ai/gemini";
import { callQwen, isQwenConfigured } from "@/lib/ai/qwen";

/** Primary model — overridable via env; defaults to lite for lower demand contention. */
const PRIMARY_MODEL =
  process.env.GEMINI_FAST_MODEL || "gemini-2.5-flash-lite";

/** Fallback model used when the primary model is unavailable. */
const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL || "gemini-2.0-flash";

/** HTTP codes that are transient and worth retrying / escalating to Qwen. */
const TRANSIENT_CODES = new Set([429, 502, 503, 504]);

/** Delays (ms) before retry attempt 2 and 3 on the primary model. */
const PRIMARY_RETRY_DELAYS_MS = [800, 1600] as const;

/** Pause before trying the fallback Gemini model (skipped on quota exhaustion). */
const FALLBACK_WAIT_MS = 3000;

// ─── Internal helpers ─────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

interface ParsedError {
  code: number | null;
  status: string | null;
  detail: string;
}

function parseGeminiError(err: unknown): ParsedError {
  const raw = err instanceof Error ? err.message : String(err);
  try {
    const p = JSON.parse(raw);
    return {
      code: p?.error?.code ?? null,
      status: p?.error?.status ?? null,
      detail: p?.error?.message ?? raw,
    };
  } catch {
    return { code: null, status: null, detail: raw };
  }
}

function classifyReason(code: number | null, status: string | null): string {
  if (code === 503 || status === "UNAVAILABLE") return "gemini_unavailable";
  if (code === 429 && status === "RESOURCE_EXHAUSTED") return "gemini_quota_exhausted";
  if (code === 429) return "gemini_rate_limit";
  if (code === 401 || code === 403) return "gemini_auth_error";
  if (code === 502 || code === 504) return "gemini_gateway_error";
  return "gemini_error";
}

// ─── Public types ─────────────────────────────────────────────────────────────

export interface GeminiSuccess {
  ok: true;
  text: string;
  /** Which AI provider generated this text. */
  providerUsed: "gemini" | "qwen";
  modelUsed: string;
  attempts: number;
  retried: boolean;
}

export interface GeminiFailure {
  ok: false;
  /** All providers exhausted — caller should use local fallback data. */
  providerUsed: "local_fallback";
  errorCode: number | null;
  errorStatus: string | null;
  fallbackReason: string;
  attempts: number;
  retried: boolean;
}

export type GeminiResult = GeminiSuccess | GeminiFailure;

export interface AIReliabilityOptions {
  /**
   * Compact schema description appended to Qwen's system message.
   * Gemini ignores this — it receives the structured responseSchema instead.
   */
  schemaHint?: string;
}

// ─── Core helper ─────────────────────────────────────────────────────────────

/**
 * Generate content with automatic retry, Gemini model fallback, and Qwen fallback.
 *
 * Strategy:
 *   1. Try PRIMARY Gemini model up to 3 times (800ms / 1600ms delays).
 *      - RESOURCE_EXHAUSTED (quota) short-circuits immediately — no point retrying.
 *      - Auth errors (401/403) short-circuit immediately.
 *   2. If primary exhausted with non-quota transient errors, wait 3000ms then try
 *      FALLBACK Gemini model once. Skipped entirely when quota is exhausted.
 *   3. If Gemini fails AND error was transient/auth/quota AND QWEN_API_KEY is set,
 *      try Qwen once. schemaHint (if provided) is injected into Qwen's system message.
 *   4. If everything fails, return GeminiFailure — caller uses local demo data.
 */
export async function generateWithGeminiReliability(
  prompt: string,
  callConfig: GenerateContentConfig,
  options: AIReliabilityOptions = {}
): Promise<GeminiResult> {
  let totalAttempts = 0;
  let lastCode: number | null = null;
  let lastStatus: string | null = null;
  let quotaExhausted = false;
  const wantJson = callConfig.responseMimeType === "application/json";

  // ── 1. Primary Gemini model — up to 3 attempts ───────────────────────────
  for (let i = 0; i < 3; i++) {
    if (i > 0) await sleep(PRIMARY_RETRY_DELAYS_MS[i - 1]);
    totalAttempts++;

    try {
      const response = await gemini.models.generateContent({
        model: PRIMARY_MODEL,
        contents: prompt,
        config: callConfig,
      });
      const text = response.text;
      if (!text) throw new Error("Empty response from Gemini");
      return {
        ok: true,
        text,
        providerUsed: "gemini",
        modelUsed: PRIMARY_MODEL,
        attempts: totalAttempts,
        retried: i > 0,
      };
    } catch (err) {
      const g = parseGeminiError(err);
      lastCode = g.code;
      lastStatus = g.status;
      console.warn(`[Gemini] Primary model attempt ${i + 1}/3 failed.`, {
        model: PRIMARY_MODEL,
        code: g.code,
        status: g.status,
        detail: g.detail,
      });

      // Auth errors will not self-heal — stop immediately
      if (g.code === 401 || g.code === 403) break;

      // Quota exhaustion: retrying the same model will keep failing — skip to Qwen
      if (g.code === 429 && g.status === "RESOURCE_EXHAUSTED") {
        console.warn(
          "[Gemini] Quota exhausted (RESOURCE_EXHAUSTED) — skipping all Gemini retries."
        );
        quotaExhausted = true;
        break;
      }

      // Non-transient errors (bad request, schema errors, etc.) — don't retry
      if (g.code !== null && !TRANSIENT_CODES.has(g.code)) break;
    }
  }

  // ── 2. Fallback Gemini model — skipped when quota is exhausted ───────────
  if (!quotaExhausted) {
    console.info(
      `[Gemini] All primary attempts exhausted. Waiting ${FALLBACK_WAIT_MS}ms then trying fallback model: ${FALLBACK_MODEL}`
    );
    await sleep(FALLBACK_WAIT_MS);
    totalAttempts++;

    try {
      const response = await gemini.models.generateContent({
        model: FALLBACK_MODEL,
        contents: prompt,
        config: callConfig,
      });
      const text = response.text;
      if (!text) throw new Error("Empty response from Gemini fallback model");
      console.info(`[Gemini] Fallback model succeeded: ${FALLBACK_MODEL}`);
      return {
        ok: true,
        text,
        providerUsed: "gemini",
        modelUsed: FALLBACK_MODEL,
        attempts: totalAttempts,
        retried: true,
      };
    } catch (err) {
      const g = parseGeminiError(err);
      if (g.code !== null) { lastCode = g.code; lastStatus = g.status; }
      // Update quota flag in case the fallback model also hits quota
      if (g.code === 429 && g.status === "RESOURCE_EXHAUSTED") quotaExhausted = true;
      console.warn(`[Gemini] Fallback model also failed.`, {
        model: FALLBACK_MODEL,
        code: g.code,
        status: g.status,
        detail: g.detail,
      });
    }
  } else {
    console.info("[Gemini] Quota exhausted — skipping fallback Gemini model, trying Qwen next.");
  }

  // ── 3. Qwen fallback — transient, quota, or auth Gemini errors only ───────
  const shouldTryQwen =
    lastCode === null ||
    TRANSIENT_CODES.has(lastCode) ||
    lastCode === 401 ||
    lastCode === 403;

  if (isQwenConfigured() && shouldTryQwen) {
    if (lastCode === 401 || lastCode === 403) {
      console.warn(
        "[AI] Gemini auth failure (401/403) — attempting Qwen with independent credentials."
      );
    } else {
      console.info("[AI] Gemini unavailable — attempting Qwen as tertiary fallback.");
    }
    totalAttempts++;

    const qwenResult = await callQwen(prompt, wantJson, options.schemaHint);
    if (qwenResult.ok) {
      console.info(`[AI] Qwen fallback succeeded: ${qwenResult.model}`);
      return {
        ok: true,
        text: qwenResult.text,
        providerUsed: "qwen",
        modelUsed: qwenResult.model,
        attempts: totalAttempts,
        retried: true,
      };
    }
    console.warn("[AI] Qwen fallback also failed:", qwenResult.message);
  } else if (!isQwenConfigured()) {
    console.info("[AI] QWEN_API_KEY not set — skipping Qwen fallback.");
  }

  // ── 4. Everything failed ──────────────────────────────────────────────────
  return {
    ok: false,
    providerUsed: "local_fallback",
    errorCode: lastCode,
    errorStatus: lastStatus,
    fallbackReason: classifyReason(lastCode, lastStatus),
    attempts: totalAttempts,
    retried: true,
  };
}
