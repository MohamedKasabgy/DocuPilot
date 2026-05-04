import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db/supabaseAdmin";
import { chunkText } from "@/lib/rag/chunkText";
import { embedText } from "@/lib/rag/embeddings";

// Security helper mocks
async function verifyAuth(req: Request) {
  // Mock authentication check
  const authHeader = req.headers.get("authorization");
  // In a real implementation, verify token and user access to project here
  return { userId: "mock-user-id", isAuthorized: true };
}

async function checkRateLimit(userId: string) {
  // Mock rate limiting (e.g., max 10 requests per minute)
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

    const { projectId, title, documentType, text } = await req.json();

    // Validation
    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: "Document text is too short. Minimum 50 characters required." },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!projectId || !title) {
        return NextResponse.json(
            { success: false, error: "Missing required fields: projectId or title." },
            { status: 400 }
        );
    }

    // Insert document record
    const { data: document, error: docError } = await supabaseAdmin
      .from("documents")
      .insert({
        project_id: projectId,
        title: title,
        document_type: documentType || "general",
        raw_text: text, // Do not log sensitive data in server logs
      })
      .select()
      .single();

    if (docError) throw docError;

    // Chunk the text
    const chunks = chunkText(text);

    // Create embeddings and save chunks
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await embedText(chunks[i]);

      await supabaseAdmin.from("document_chunks").insert({
        document_id: document.id,
        project_id: projectId,
        chunk_index: i,
        content: chunks[i],
        embedding,
      });
    }

    return NextResponse.json({
      success: true,
      documentId: document.id,
      chunksCreated: chunks.length,
    });
  } catch (error) {
    // Log errors server-side only without exposing stack traces to client
    console.error("RAG ingest failed:", error instanceof Error ? error.message : "Unknown error");

    return NextResponse.json(
      { success: false, error: "Failed to ingest document. An internal error occurred." },
      { status: 500 }
    );
  }
}
