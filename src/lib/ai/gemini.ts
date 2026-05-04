import { GoogleGenAI } from "@google/genai";

export const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy_key" });

export const GEMINI_PRO_MODEL = "gemini-2.5-flash";
