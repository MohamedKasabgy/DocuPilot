const QWEN_API_KEY = (process.env.QWEN_API_KEY || "").trim();
const QWEN_BASE_URL = (
  process.env.QWEN_BASE_URL ||
  "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
).replace(/\/$/, "");
export const QWEN_MODEL = (process.env.QWEN_MODEL || "qwen-plus").trim();

export function isQwenConfigured(): boolean {
  return QWEN_API_KEY.length > 0;
}

interface QwenSuccess {
  ok: true;
  text: string;
  model: string;
}

interface QwenFailure {
  ok: false;
  code: number | null;
  message: string;
}

export type QwenResult = QwenSuccess | QwenFailure;

/**
 * Call Qwen via its OpenAI-compatible chat completions endpoint.
 *
 * @param prompt     Full prompt string (same prompt sent to Gemini).
 * @param wantJson   When true, adds strict JSON-only instruction + response_format.
 * @param schemaHint Optional compact schema description appended to the system
 *                   message so Qwen knows the exact top-level keys and types.
 */
export async function callQwen(
  prompt: string,
  wantJson = false,
  schemaHint?: string
): Promise<QwenResult> {
  if (!isQwenConfigured()) {
    return { ok: false, code: null, message: "QWEN_API_KEY not configured — skipping Qwen." };
  }

  let systemContent: string;
  if (wantJson) {
    systemContent = [
      "You are a JSON data extraction assistant.",
      "CRITICAL RULES:",
      "1. Respond ONLY with a valid JSON object. Nothing else.",
      "2. Do NOT use markdown code fences (no ```json, no ```).",
      "3. Do NOT add any explanation, preamble, or trailing text.",
      "4. Your entire response must start with { and end with }.",
      "5. All required keys must be present with the correct types.",
      ...(schemaHint ? ["", "Required output schema:", schemaHint] : []),
    ].join("\n");
  } else {
    systemContent = "You are a helpful assistant.";
  }

  let res: Response;
  try {
    res = await fetch(`${QWEN_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${QWEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: QWEN_MODEL,
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: prompt },
        ],
        ...(wantJson ? { response_format: { type: "json_object" } } : {}),
      }),
    });
  } catch (networkErr) {
    const message = networkErr instanceof Error ? networkErr.message : String(networkErr);
    console.warn("[Qwen] Network error:", message);
    return { ok: false, code: null, message };
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let message = body;
    try {
      message =
        (JSON.parse(body) as { error?: { message?: string } })?.error?.message || body;
    } catch {
      // keep raw body as message
    }
    console.warn("[Qwen] API error:", { code: res.status, message });
    return { ok: false, code: res.status, message };
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return { ok: false, code: null, message: "Failed to parse Qwen response body as JSON" };
  }

  const text = (
    data as { choices?: Array<{ message?: { content?: string } }> }
  )?.choices?.[0]?.message?.content;

  if (!text) {
    return { ok: false, code: null, message: "Empty content in Qwen response" };
  }

  return { ok: true, text, model: QWEN_MODEL };
}
