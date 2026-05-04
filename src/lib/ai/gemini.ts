import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  console.error(
    "[gemini] GEMINI_API_KEY is not set — AI features will use demo fallback data. " +
      "Add GEMINI_API_KEY to .env.local to enable real AI generation."
  );
}

// GoogleGenAI construction does not validate the key; errors surface on the first API call.
// When apiKey is missing, generateContent throws (caught in route handlers → local fallback).
export const gemini = new GoogleGenAI({ apiKey: apiKey || "missing-key" });

/** Primary model. Set GEMINI_FAST_MODEL in .env.local to override. */
export const GEMINI_FAST_MODEL =
  process.env.GEMINI_FAST_MODEL || "gemini-2.5-flash-lite";

/** Kept for legacy imports — resolves to the same value as GEMINI_FAST_MODEL. */
export const GEMINI_PRO_MODEL = GEMINI_FAST_MODEL;

/** Model used as a reliability fallback when the primary model is unavailable. */
export const GEMINI_FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL || "gemini-2.0-flash";

export const GEMINI_EMBEDDING_MODEL =
  process.env.GEMINI_EMBEDDING_MODEL || "text-embedding-004";
