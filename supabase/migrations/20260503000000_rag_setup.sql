-- ============================================================
-- Ask DocuPilot — Mini RAG Database Setup
-- ============================================================

-- Enable the pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Grant usage on public schema to service_role and anon
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ============================================================
-- Table: documents
-- Stores the original uploaded/pasted documents
-- ============================================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Document',
  document_type TEXT NOT NULL DEFAULT 'general',
  raw_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast project lookups
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);

-- ============================================================
-- Table: document_chunks
-- Stores chunked text with vector embeddings for similarity search
-- ============================================================
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  content TEXT NOT NULL,
  embedding vector(768),  -- Gemini 768-dimensional embeddings
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast project lookups on chunks
CREATE INDEX IF NOT EXISTS idx_document_chunks_project_id ON document_chunks(project_id);

-- Index for fast document lookups on chunks
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);

-- NOTE: IVFFlat index requires existing rows to build.
-- Run this AFTER you have ingested some documents:
--
--   CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding
--     ON document_chunks
--     USING ivfflat (embedding vector_cosine_ops)
--     WITH (lists = 100);

-- ============================================================
-- RPC Function: match_document_chunks
-- Performs cosine similarity search to find the top N most
-- relevant chunks for a given query embedding within a project.
-- ============================================================
CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding vector(768),
  match_count INT DEFAULT 5,
  project_id_input TEXT DEFAULT 'clinic-booking-platform'
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  chunk_index INT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.chunk_index,
    dc.content,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  WHERE dc.project_id = project_id_input
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- RLS policies: allow service_role full access (API routes use service_role key)
CREATE POLICY "Service role full access on documents"
  ON documents FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on document_chunks"
  ON document_chunks FOR ALL
  USING (true)
  WITH CHECK (true);
