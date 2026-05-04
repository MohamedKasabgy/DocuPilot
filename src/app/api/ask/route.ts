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

    // Get latest SRS (gracefully handle if table doesn't exist)
    let latestSrs = null;
    try {
      const { data } = await supabaseAdmin
        .from("srs_documents")
        .select("output_json")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      latestSrs = data;
    } catch {
      // srs_documents table may not exist yet
    }

    // Get latest Contract (gracefully handle if table doesn't exist)
    let latestContract = null;
    try {
      const { data } = await supabaseAdmin
        .from("contract_analyses")
        .select("output_json")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      latestContract = data;
    } catch {
      // contract_analyses table may not exist yet
    }

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
    console.error("Ask DocuPilot failed:", JSON.stringify(error, null, 2));

    return NextResponse.json(
      {
        success: false,
        error: "Failed to answer question. An internal error occurred.",
      },
      { status: 500 }
    );
  }
}
