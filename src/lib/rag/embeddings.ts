// Note: @/lib/ai/gemini is not present in the current workspace.
// This is added as requested by the instructions.
import { gemini, GEMINI_EMBEDDING_MODEL } from "@/lib/ai/gemini";

export async function embedText(text: string) {
  const response = await gemini.models.embedContent({
    model: GEMINI_EMBEDDING_MODEL,
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });

  const values = response.embeddings?.[0]?.values;

  if (!values) {
    throw new Error("Failed to create embedding.");
  }

  return values;
}
