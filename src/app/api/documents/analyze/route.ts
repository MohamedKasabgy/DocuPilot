import { NextResponse } from "next/server";
import {
  normalizeContractAnalysisOutput,
  normalizeInvoiceAnalysisOutput,
  normalizeScopeAnalysisOutput,
  normalizeProjectIntelligenceOutput,
  type NormalizedAIOutput,
} from "@/lib/ai/normalized-output";
import { DEMO_PROJECT_ID } from "@/lib/data/demo-store";
import type { DocumentType } from "@/lib/data/types";

const VALID_TYPES: DocumentType[] = [
  "srs",
  "contract",
  "invoice",
  "scope_request",
  "client_request",
  "other",
];

interface AnalyzeBody {
  projectId?: string;
  documentId?: string;
  documentType?: DocumentType;
  text?: string;
}

function fallbackForType(
  type: DocumentType,
  ctx: { projectId: string; documentId?: string }
): NormalizedAIOutput {
  const baseSummary = `Demo analysis: received ${type} document. Live AI provider not configured — returning structured placeholder.`;
  switch (type) {
    case "contract":
      return normalizeContractAnalysisOutput(
        { contractTitle: "Demo contract", scope: { summary: baseSummary } },
        ctx
      );
    case "invoice":
      return normalizeInvoiceAnalysisOutput(
        { contractAlignment: { summary: baseSummary }, duplicateRisk: { level: "none" } },
        ctx
      );
    case "scope_request":
      return normalizeScopeAnalysisOutput(
        { reason: baseSummary, scopeStatus: "needs_clarification" },
        ctx
      );
    case "srs":
    case "client_request":
    case "other":
    default:
      return normalizeProjectIntelligenceOutput(
        { finalDecision: { summary: baseSummary } },
        ctx
      );
  }
}

export async function POST(req: Request) {
  let body: AnalyzeBody;
  try {
    body = (await req.json()) as AnalyzeBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { projectId, documentId, documentType, text } = body;

  if (!projectId || typeof projectId !== "string") {
    return NextResponse.json(
      { success: false, error: "projectId is required." },
      { status: 400 }
    );
  }
  if (!documentType || !VALID_TYPES.includes(documentType)) {
    return NextResponse.json(
      { success: false, error: `documentType must be one of ${VALID_TYPES.join(", ")}.` },
      { status: 400 }
    );
  }
  if (!text || typeof text !== "string" || text.trim().length < 5) {
    return NextResponse.json(
      { success: false, error: "text is required (min 5 chars)." },
      { status: 400 }
    );
  }

  const ctx = {
    projectId: projectId || DEMO_PROJECT_ID,
    documentId,
  };

  const normalized = fallbackForType(documentType, ctx);

  return NextResponse.json({
    success: true,
    data: { normalized },
  });
}
