import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY — add it to .env.local");
}

export const gemini = new GoogleGenAI({ apiKey });

export const GEMINI_PRO_MODEL = "gemini-2.5-flash";
export const GEMINI_FAST_MODEL =
  process.env.GEMINI_FAST_MODEL || "gemini-2.5-flash";
export const GEMINI_EMBEDDING_MODEL =
  process.env.GEMINI_EMBEDDING_MODEL || "text-embedding-004";
