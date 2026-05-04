/**
 * Extract the first complete JSON object from a string that may contain
 * markdown code fences, preamble text, or trailing explanations.
 *
 * Algorithm:
 *   1. Trim and strip ```json / ``` fences.
 *   2. Try JSON.parse on the cleaned string.
 *   3. If that fails, scan for the first balanced { … } block using
 *      proper string-aware bracket matching, then parse that slice.
 *
 * Throws a descriptive error (with a preview) when no valid object is found.
 */
export function extractJsonObject(text: string): unknown {
  let s = text.trim();

  // Strip leading ```json or ``` fence
  s = s.replace(/^```(?:json|JSON)?\s*\n?/, "");
  // Strip trailing ``` fence
  s = s.replace(/\n?```\s*$/, "").trim();

  // Fast path: the whole string is already valid JSON
  try {
    return JSON.parse(s);
  } catch { /* fall through to bracket scan */ }

  // Locate the first '{' and extract the balanced object
  const start = s.indexOf("{");
  if (start === -1) {
    throw new Error(
      `extractJsonObject: no JSON object found. Preview: ${s.slice(0, 300)}`
    );
  }

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < s.length; i++) {
    const ch = s[i];

    if (escape) { escape = false; continue; }
    if (ch === "\\" && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;

    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return JSON.parse(s.slice(start, i + 1));
      }
    }
  }

  throw new Error(
    `extractJsonObject: no complete JSON object found. Preview: ${s.slice(0, 300)}`
  );
}
