import { NextResponse } from "next/server";
import { gemini, GEMINI_FAST_MODEL } from "@/lib/ai/gemini";
import { supabaseAdmin } from "@/lib/db/supabaseAdmin";
import { embedText } from "@/lib/rag/embeddings";

// Security helper mocks
async function verifyAuth(req: Request) {
  // Mock authentication check
  return { userId: "mock-user-id", isAuthorized: true };
}

async function checkRateLimit(userId: string) {
  // Mock rate limiting
  return { allowed: true };
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.isAuthorized) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await checkRateLimit(auth.userId);
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 });
    }

    const { projectId, question } = await req.json();

    // Validation
    if (!question || question.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Question is too short." },
        { status: 400 }
      );
    }
    
    if (!projectId) {
        return NextResponse.json(
            { success: false, error: "Project ID is required." },
            { status: 400 }
        );
    }

    // Create query embedding
    const queryEmbedding = await embedText(question);

    // Retrieve similar chunks using RPC
    const { data: chunks, error: chunksError } = await supabaseAdmin.rpc(
      "match_document_chunks",
      {
        query_embedding: queryEmbedding,
        match_count: 5,
        project_id_input: projectId,
      }
    );

    if (chunksError) throw chunksError;

    // Get latest SRS
    const { data: latestSrs } = await supabaseAdmin
      .from("srs_documents")
      .select("output_json")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get latest Contract
    const { data: latestContract } = await supabaseAdmin
      .from("contract_analyses")
      .select("output_json")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Build context
    const context = `
Retrieved file chunks:
${(chunks || [])
  .map(
    (chunk: any, index: number) =>
      `[Source ${index + 1}] ${chunk.content}`
  )
  .join("\n\n")}

Latest SRS JSON:
${latestSrs ? JSON.stringify(latestSrs.output_json) : "No SRS found."}

Latest Contract JSON:
${latestContract ? JSON.stringify(latestContract.output_json) : "No contract analysis found."}
`;

    // Build prompt
    const prompt = `
You are Ask DocuPilot, an internal AI operations assistant.

Answer the user's question using only the provided context.
If the answer is not in the context, say that you do not have enough information.
Be concise, business-focused, and action-oriented.
Mention which source numbers support your answer when possible.

Context:
"""
${context}
"""

Question:
${question}
`;

    // Generate response
    const response = await gemini.models.generateContent({
      model: GEMINI_FAST_MODEL,
      contents: prompt,
    });

    return NextResponse.json({
      success: true,
      answer: response.text,
      sources: chunks || [],
    });
  } catch (error) {
    // Log errors server-side only without exposing stack traces to client
    console.error("Ask DocuPilot failed:", error instanceof Error ? error.message : "Unknown error");

    return NextResponse.json(
      {
        success: false,
        error: "Failed to answer question. An internal error occurred.",
      },
      { status: 500 }
    );
  }
}
