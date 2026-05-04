import { NextResponse } from "next/server";

import { gemini, GEMINI_FAST_MODEL } from "@/lib/ai/gemini";
import { supabaseAdmin } from "@/lib/db/supabaseAdmin";
import { SrsSchema, srsJsonSchema, type SrsOutput } from "@/lib/ai/schemas/srs";
import { buildSrsPrompt, buildRefinementPrompt } from "@/lib/ai/prompts/srs";

interface SrsRequest {
  clientRequest: string;
  projectId?: string;
  currentSrs?: SrsOutput;
  refinementMessage?: string;
}

export async function POST(req: Request) {
  try {
    const body: SrsRequest = await req.json();
    const { clientRequest, projectId, currentSrs, refinementMessage } = body;

    if (!clientRequest || clientRequest.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Client request is too short (min 10 characters)." },
        { status: 400 }
      );
    }

    const isRefinement = !!(refinementMessage && currentSrs);
    const prompt = isRefinement
      ? buildRefinementPrompt(currentSrs, refinementMessage)
      : buildSrsPrompt(clientRequest);

    const response = await gemini.models.generateContent({
      model: GEMINI_FAST_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: srsJsonSchema,
      },
    });

    const raw = response.text;
    if (!raw) throw new Error("Empty Gemini response");

    const parsed = JSON.parse(raw);
    const validated = SrsSchema.parse(parsed);

    try {
      await supabaseAdmin.from("srs_documents").insert({
        project_id: projectId || "default-project",
        client_request: clientRequest,
        output_json: validated,
        confidence_score: validated.confidenceScore,
      });

      await supabaseAdmin.from("ai_outputs").insert({
        project_id: projectId || "default-project",
        type: "srs",
        json: validated,
      });
    } catch (dbError) {
      console.error("Supabase persistence failed (non-blocking):", dbError);
    }

    return NextResponse.json({ success: true, data: validated });
  } catch (error) {
    console.error("SRS generation failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate SRS. Please try again." },
      { status: 500 }
    );
  }
}
