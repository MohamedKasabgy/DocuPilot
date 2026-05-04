import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing environment variable: GEMINI_API_KEY");
}

export const gemini = new GoogleGenAI({ apiKey });

// Fast model for chat / Q&A responses
export const GEMINI_FAST_MODEL = "gemini-2.5-flash";

// Embedding model for vector search
export const GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";
