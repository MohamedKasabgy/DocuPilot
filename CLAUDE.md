# DocuPilot — AI Operations Platform

## Project Overview

DocuPilot is a portfolio-grade SaaS dashboard for software companies to manage projects, contracts, invoices, and requirements. It uses AI (Google Gemini) to transform client requests (including Arabic) into structured SRS documents, detect scope creep, and generate smart alerts. Data is persisted to Supabase.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Google Gemini AI (`@google/genai`) · Qwen (OpenAI-compatible fallback) · Supabase (`@supabase/supabase-js`) · Zod 4 · pgvector + Gemini embeddings for RAG · `unpdf` for server-side PDF text extraction · Font Awesome 6 · Inter + Outfit

**Target audience:** Software house operations teams (project managers, admins).

## Architecture

```
src/
├── app/                        # Next.js App Router pages
│   ├── api/ai/
│   │   ├── srs/route.ts                  # ✅ LIVE — Gemini SRS generation + refinement (with Qwen + local fallback)
│   │   ├── invoice/route.ts              # ✅ LIVE — Gemini invoice analysis (contract-context aware)
│   │   ├── scope/route.ts                # ✅ LIVE — Gemini scope guard (writes high-risk alerts)
│   │   ├── project-intelligence/route.ts # ✅ LIVE — Gemini project intelligence
│   │   ├── contract/route.ts             # ⚠ Legacy stub — superseded by /api/contracts/analyze
│   │   └── template.ts                   # Shared route template
│   ├── api/contracts/
│   │   ├── analyze/route.ts              # ✅ LIVE — Gemini contract extraction → contract_analyses, alerts, ai_outputs
│   │   ├── extract/route.ts              # ✅ LIVE — server-side PDF/TXT/MD text extraction via unpdf
│   │   └── list/route.ts                 # Contract listing
│   ├── api/ask/route.ts                  # ✅ LIVE — RAG via pgvector + Gemini chat (mock auth)
│   ├── api/rag/ingest/route.ts           # ✅ LIVE — chunk + embed + write document_chunks (mock auth)
│   ├── api/projects/[id]/route.ts        # Project read endpoint
│   ├── api/documents/analyze/route.ts    # Document analysis endpoint
│   ├── page.tsx               # Dashboard (operational overview)
│   ├── srs-generator/
│   │   ├── page.tsx           # SRS page (Client Component, calls /api/ai/srs)
│   │   └── SRSChat.tsx        # Standalone chat component (unused, available for future)
│   ├── ask-docupilot/         # AI assistant page
│   ├── scope-guard/           # Contract deviation detection
│   ├── contracts/             # Contract management
│   ├── invoices/              # Invoice tracking
│   ├── approvals/             # Approval workflows
│   ├── projects/              # Project portfolio
│   └── risks/                 # Risk register
├── lib/
│   ├── ai/
│   │   ├── gemini.ts                  # Gemini client + model constants (FAST, FALLBACK, EMBEDDING)
│   │   ├── qwen.ts                    # Qwen OpenAI-compatible client (tertiary fallback)
│   │   ├── geminiReliability.ts       # Wrapper: Gemini primary → Gemini fallback → Qwen
│   │   ├── jsonUtils.ts               # extractJsonObject helper
│   │   ├── normalized-output.ts       # Defensive output normalizers
│   │   ├── schemas/                   # Zod + JSON schemas (srs, contract, invoice, scope, projectIntelligence)
│   │   ├── prompts/                   # SYSTEM_CONTEXT + buildPrompt() per module
│   │   └── fallbacks/                 # Local fallback objects (scope, projectIntelligence)
│   ├── dashboard/load.ts              # Server-side dashboard loader (live | fallback | mixed)
│   ├── data/                          # Demo store, queries, types
│   ├── rag/
│   │   ├── chunkText.ts               # Text chunker (~900 chars, 150 overlap)
│   │   └── embeddings.ts              # Gemini text-embedding-004 wrapper
│   └── db/
│       ├── supabaseAdmin.ts           # Lazy server-side client + isSupabaseConfigured() guard
│       └── supabaseClient.ts          # Browser client
├── components/
│   ├── common/                # Reusable UI (Card, MetricCard)
│   └── layout/                # Sidebar, Header
└── styles/
    ├── index.css              # Design tokens (CSS custom properties)
    ├── layout.css             # App shell, sidebar, grid layouts
    └── components.css         # Card, button, badge, form styles
```

## AI Integration (Gemini → Qwen → local fallback)

SRS, Contracts, Invoices, Scope Guard, and Project Intelligence are all wired live to Gemini with structured JSON output. Ask DocuPilot uses RAG (pgvector + embeddings).

- **Primary model:** `GEMINI_FAST_MODEL` (default `gemini-2.5-flash-lite`)
- **Reliability fallback:** `GEMINI_FALLBACK_MODEL` (default `gemini-2.0-flash`)
- **Tertiary fallback:** Qwen via `QWEN_API_KEY` (OpenAI-compatible)
- **Final safety net:** Hand-crafted fallback objects in `src/lib/ai/fallbacks/` and per-route constants
- **Structured output:** `responseMimeType: "application/json"` + `responseSchema` (using `@google/genai` `Type` enums or plain JSON schema)
- **Validation:** Zod 4 parse before persist/return
- **Prompts:** Each module exports a `SYSTEM_CONTEXT` plus a `buildPrompt()` builder under `src/lib/ai/prompts/`
- **Persistence:** All Supabase writes are non-blocking and wrapped in `isSupabaseConfigured()` guards
- **Telemetry:** Every response carries `providerUsed`, `source`, `usedFallback`, `fallbackReason`, `errorCode`, `modelUsed`, `attempts`, `retried`

### Adding new AI modules

Follow the SRS pattern:
1. Create schema in `src/lib/ai/schemas/<module>.ts` (Zod + hand-written JSON schema)
2. Create prompts in `src/lib/ai/prompts/<module>.ts` (include `SYSTEM_CONTEXT`)
3. Create route in `src/app/api/ai/<module>/route.ts`
4. Zod 4 is NOT compatible with `zod-to-json-schema` — write JSON schemas manually

## Database (Supabase)

- **Client:** `src/lib/db/supabaseAdmin.ts` — lazy proxy, uses `SUPABASE_SERVICE_ROLE_KEY` (with fallback to publishable/anon keys for read-only flows). Always guard with `isSupabaseConfigured()`.
- **Tables in use:** `projects`, `srs_documents`, `contract_analyses`, `scope_analyses`, `ai_outputs`, `alerts`, `documents`, `document_chunks`.
- **Migrations:** `supabase/migrations/0001_domain_tables.sql` … `20260503000000_rag_setup.sql` (run in order). pgvector RPC `match_document_chunks` powers Ask DocuPilot.
- **Seed:** `npm run db:seed` (`scripts/seed.ts`).
- **Pattern:** Non-blocking persistence — wrap DB calls in try/catch, log errors, never fail the API response because of a DB issue.

## Environment Variables

Stored in `.env.local` (gitignored). See `.env.local.example` for required vars:

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes (live AI) | Google AI Studio API key |
| `GEMINI_FAST_MODEL` | No | Primary model (default `gemini-2.5-flash-lite`) |
| `GEMINI_FALLBACK_MODEL` | No | Reliability fallback model (default `gemini-2.0-flash`) |
| `GEMINI_EMBEDDING_MODEL` | No | Embeddings model (default `text-embedding-004`) |
| `QWEN_API_KEY` | No | Tertiary AI fallback (OpenAI-compatible Qwen) |
| `QWEN_BASE_URL`, `QWEN_MODEL` | No | Override Qwen endpoint and model |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (persistence) | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (persistence, server-only) | Service role key — never expose to client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | For future client-side Supabase use |

## Critical Rules

1. **Read Next.js docs first.** This is Next.js 16 with App Router — `node_modules/next/dist/docs/` has the authoritative guide. Do NOT rely on training data for Next.js APIs.
2. **CSS architecture is custom properties + utility classes.** Design tokens live in `src/styles/index.css`. Use existing CSS variables (`--accent-primary`, `--spacing-md`, `--radius-lg`, etc.) — do NOT hardcode colors or spacing.
3. **Dark sidebar, light content area.** The sidebar uses `--bg-sidebar` (dark slate). Main content uses `--bg-main` (off-white). Maintain this contrast.
4. **Arabic/RTL support matters.** Client input examples are in Arabic. Use `dir="rtl"` on Arabic text blocks. The app detects language and displays bilingual content.
5. **Font Awesome for icons.** Use `fa-solid fa-*` / `fa-regular fa-*` classes. Do NOT add lucide-react icons or SVGs unless explicitly asked.
6. **No env secrets in code.** API keys come from `.env.local` — never commit them. The `.env.local` file is gitignored.
7. **Never add yourself as a contributor.** When committing or pushing code, do NOT add Claude/AI as a co-author, contributor, or in any attribution. Commits should only credit the human developers.
8. **Zod 4 constraints.** This project uses Zod 4 (`zod@^4.4.3`). Do NOT use `zod-to-json-schema` — it's incompatible. Write JSON schemas manually as plain objects.
9. **Non-blocking persistence.** Database writes must never cause an API route to fail. Always wrap Supabase calls in try/catch.

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--accent-primary` | `#4F46E5` (indigo) | Primary actions, links, highlights |
| `--bg-main` | `#F9F9FB` | Page background |
| `--bg-surface-glass` | `rgba(255,255,255,0.95)` | Card backgrounds |
| `--font-sans` | Inter | Body text |
| `--font-display` | Outfit | Headings, brand |
| `--radius-lg` | `0.75rem` | Card corners |
| `--spacing-lg` | `1.5rem` | Card padding, section gaps |

## Component Patterns

- **Pages:** Server Components by default. Import `Header` at top, wrap content in `<div className="page-container animate-fade-in">`.
- **Client Components:** Only when needed (`'use client'` — e.g., Sidebar uses `usePathname`, SRS page uses state/effects).
- **Cards:** Use the `<Card>` component from `@/components/common/Card`. Style via `className` and `style` props.
- **Metrics:** Use `<MetricCard>` with `title`, `value`, `icon`, `badgeText`, `badgeType` props.
- **Layouts:** Use CSS grid with existing utility classes (`grid grid-cols-2`, `layout-sidebar-right`).

## Commands

```bash
npm install          # Install dependencies (run first after clone)
npm run dev          # Dev server at localhost:3000
npm run build        # Production build
npm run lint         # ESLint check
```

## Live vs UI-Only vs Planned

**Live (real AI + persistence):** SRS, Contract Analysis, Contract PDF Extract, Invoice Analysis, Scope Guard, Project Intelligence, Ask DocuPilot RAG, Dashboard data loader.

**UI-only / mock today:** Approvals page, Risk Radar page, `/api/ai/contract` legacy stub, Contract Vault button, mock `verifyAuth` / `checkRateLimit` in Ask + Ingest.

**Planned:**
- Real authentication and role-based access (Admin / PM / Viewer)
- Approvals + Risk Radar write paths
- PDF export of generated SRS / analyses
- Multi-project workspace selector across modules
- Production OCR for scanned contract PDFs
- Calendar / email / WhatsApp integrations

## Style Guide for Code

- TypeScript strict mode. Explicit types for component props (interfaces, not `type`).
- Path alias: `@/*` maps to `./src/*`.
- No barrel files. Import directly from the component file.
- Inline styles are acceptable for one-off layout tweaks in page components. Extract to CSS classes if reused 3+ times.
- Keep page components self-contained — each page file should be readable top-to-bottom without jumping between files.

@AGENTS.md
