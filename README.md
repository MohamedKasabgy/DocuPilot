# DocuPilot

**From Documents to Decisions.**

DocuPilot is an AI operations layer for software companies and service businesses. It turns client requests, contracts, invoices, SRS documents, and scope changes into structured workflows, approvals, risks, tasks, alerts, and dashboard decisions — instead of leaving them as static files in inboxes and shared drives.

DocuPilot is not a chatbot. It is not a generic document summarizer. It is an internal operations system built around the AI workflow:

> Client request → SRS → Contract → Invoice → Scope Guard → Risk Radar → Dashboard → Ask DocuPilot

---

## What DocuPilot Does Today

DocuPilot is a Next.js 16 SaaS-style web application with a polished, multi-page product UI and a working AI backend for the core operational modules. Several modules call Google Gemini through a reliability layer with Qwen and local fallbacks; outputs are validated with Zod 4 and persisted to Supabase when configured.

The product is positioned as a **demo-ready B2B SaaS MVP** — not a finished production platform. Some modules are fully wired end-to-end, some are interactive UI only, and authentication / multi-tenant workspaces are not yet implemented.

---

## Feature Status (Source of Truth)

| Module | Route(s) | UI | Backend | AI | Persistence |
|---|---|---|---|---|---|
| Dashboard | `/` | Full | `loadDashboardData()` (Server Component) | n/a | Reads Supabase tables, falls back to static when DB empty/unconfigured (`source: "live" \| "fallback" \| "mixed"`) |
| SRS Generator | `/srs-generator` | Full + refinement chat | `/api/ai/srs` | **Live** — Gemini → Qwen → local fallback | `srs_documents`, `ai_outputs` |
| Contracts | `/contracts` | Full + PDF upload | `/api/contracts/analyze`, `/api/contracts/extract`, `/api/contracts/list` | **Live** — Gemini with structured output schema | `contract_analyses`, `alerts`, `ai_outputs` |
| Invoices | `/invoices` | Full | `/api/ai/invoice` | **Live** — Gemini → Qwen → fallback, contract context aware | `ai_outputs` |
| Scope Guard | `/scope-guard` | Full | `/api/ai/scope` | **Live** — Gemini → Qwen → fallback | `scope_analyses`, `ai_outputs`, `alerts` |
| Project Intelligence | embedded in SRS / Projects flows | n/a | `/api/ai/project-intelligence` | **Live** — Gemini → fallback | yes |
| Ask DocuPilot | `/ask-docupilot` | Full | `/api/ask` (RAG) + `/api/rag/ingest` | **Live** — Gemini chat + `text-embedding-004` over pgvector | `documents`, `document_chunks` (pgvector RPC `match_document_chunks`). Requires ingested documents to answer; falls back to "not enough information" otherwise |
| Projects | `/projects`, `/api/projects/[id]` | Full | Lightweight | n/a | Mostly seeded/static |
| Approvals | `/approvals` | Interactive UI only | — | — | — (mock) |
| Risk Radar | `/risks` | Interactive UI | — | — | Reads `alerts` indirectly via dashboard data; page itself is UI-driven |
| Legacy stub | `/api/ai/contract` | — | Mock JSON | — | — (superseded by `/api/contracts/analyze`) |

> All AI routes use a non-blocking persistence pattern: Supabase failures are logged but never break the AI response.

---

## Demo Scenario

| | |
|---|---|
| Software house | NexaSoft |
| Client | Al Waha Clinics |
| Project | Clinic Booking Platform |
| Goal | Web booking system with admin dashboard, appointment management, online payments, patient profiles, and notifications |

**Demo flow:**

1. Open the **Dashboard** to see operational priorities, decisions, and project health.
2. Open **SRS Generator**, paste an Arabic or English client request, and generate a structured SRS. Use the chat to refine.
3. Open **Contracts**, upload a PDF (or paste contract text, or click *Use sample*) and run AI extraction — see scope, payments, deadlines, obligations, risks, and suggested actions.
4. Open **Invoices** to review a vendor invoice with contract alignment, duplicate detection, and an approval recommendation.
5. Open **Scope Guard** and submit *"Can you also add a mobile app for the booking platform?"* — see it classified as out-of-scope with timeline, cost, and risk impact.
6. Open **Risk Radar** to view aggregated risks, then return to the **Dashboard** to see updated decisions.
7. Open **Ask DocuPilot** to query ingested project documents (RAG; requires pre-ingested docs).

---

## Tech Stack (verified from `package.json`)

- **Framework:** Next.js 16 (App Router) · React 19 · TypeScript 5
- **Styling:** Tailwind CSS 4, custom CSS design tokens, Font Awesome 6, Inter + Outfit
- **AI providers:** Google Gemini via `@google/genai` (primary, structured `responseSchema` output) — Qwen via OpenAI-compatible API (secondary fallback) — local hand-crafted fallbacks (final safety net)
- **Validation:** Zod 4
- **Database:** Supabase (`@supabase/supabase-js`) — server-side service-role client only, with `isSupabaseConfigured()` guard
- **RAG:** pgvector + Gemini `text-embedding-004` + custom chunker (`src/lib/rag/`)
- **PDF text extraction:** `unpdf` (server-side, serverless-friendly)
- **Tooling:** ESLint, Playwright (e2e folder seeded), tsx for the seed script

---

## AI Architecture

```
Request → Route handler
        → buildPrompt(...) (lib/ai/prompts/<module>.ts)
        → generateWithGeminiReliability(prompt, { responseSchema })
              ├── Gemini primary model         (GEMINI_FAST_MODEL)
              ├── Gemini fallback model        (GEMINI_FALLBACK_MODEL) on 5xx/429/auth
              └── Qwen OpenAI-compatible call  (when QWEN_API_KEY is set)
        → extractJsonObject(text)
        → normalize<Module>Output(...)         (defensive shape fixups, fraction → percent, snake_case → camelCase)
        → ZodSchema.parse(...)
        → On parse/validate failure → local fallback object
        → Non-blocking Supabase insert(s)
        → JSON response with provider/source/usedFallback/attempts metadata
```

Every AI response includes telemetry: `providerUsed`, `source`, `usedFallback`, `fallbackReason`, `errorCode`, `modelUsed`, `attempts`, `retried`.

---

## Database

Migrations live under `supabase/migrations/`:

| File | Purpose |
|---|---|
| `0001_domain_tables.sql` | Core domain tables (`projects`, `srs_documents`, `ai_outputs`, etc.) |
| `0002_project_intelligence.sql` | Project Intelligence outputs |
| `0003_scope_analyses.sql` | Scope Guard analyses |
| `0004_data_backbone_draft.sql` | Draft/expanded data backbone |
| `20260503000000_rag_setup.sql` | pgvector extension, `documents`, `document_chunks`, RPC `match_document_chunks` |

Seed data: `npm run db:seed` (`scripts/seed.ts`).

The Supabase client is lazy-loaded — `isSupabaseConfigured()` must return true before any DB call. AI routes degrade gracefully when Supabase is not configured (warning log, response unaffected).

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Yes (for live AI) | Google AI Studio key |
| `GEMINI_FAST_MODEL` | No | Primary model (default `gemini-2.5-flash-lite`) |
| `GEMINI_FALLBACK_MODEL` | No | Fallback model (default `gemini-2.0-flash`) |
| `GEMINI_EMBEDDING_MODEL` | No | Embeddings model (default `text-embedding-004`) |
| `QWEN_API_KEY` | No | Tertiary AI fallback when Gemini fails |
| `QWEN_BASE_URL`, `QWEN_MODEL` | No | Override Qwen endpoint / model |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (for persistence) | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (for persistence, server-only) | Supabase service role key — never expose to client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Future client-side SDK use |

Without any of these set, the app still runs: AI modules return clean local-fallback data, dashboard renders fallback values, and the UI behaves as a high-fidelity demo.

---

## Setup

```bash
npm install
cp .env.example .env.local   # then edit values (PowerShell: Copy-Item .env.example .env.local)
npm run dev
```

Optional database setup:

1. Create a Supabase project.
2. Run the SQL files in `supabase/migrations/` in order via the Supabase SQL editor.
3. Run `npm run db:seed` to insert demo project + sample rows.

---

## Commands

```bash
npm run dev      # Next.js dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npm run db:seed  # Seed Supabase with demo data (requires .env.local)
```

---

## Known Limitations

- **No authentication.** `verifyAuth` and `checkRateLimit` in `/api/ask` and `/api/rag/ingest` are explicit mocks.
- **No multi-tenant workspace model.** Demo `projectId` is mostly hardcoded to `clinic-booking-platform`.
- **Approvals and Risk Radar pages are UI-only.** They render polished mock data and do not yet write back.
- **Ask DocuPilot needs ingested documents.** Without uploads via `/api/rag/ingest`, queries return "not enough information".
- **Contract Vault button is a placeholder.**
- **Some flows persist server-side but are not yet rehydrated client-side after refresh** (e.g. contract analyze view).
- **Static demo data is intentionally retained** as a safety net for live presentations when AI providers are slow or rate-limited.
- **Legacy stub** at `/api/ai/contract` returns mock JSON; the real contract endpoint is `/api/contracts/analyze`.

---

## Roadmap

**Now (demo-ready):** SRS, Contracts, Invoices, Scope Guard, Project Intelligence, Dashboard, Ask DocuPilot (RAG), Supabase persistence.

**Next:** Authentication + role-based workspaces · live Approvals + Risk Radar write-paths · multi-project selectors across modules · client-side rehydration of analyses · production OCR for scanned PDFs · in-app document vault tied to RAG.

**Later:** Calendar/email/WhatsApp integrations · invoice → accounting export · enterprise audit logs · GCC localization beyond Arabic.

---

## Team Handoff Notes

- Source of truth for current behavior is the code under `src/app/api/**` and `src/lib/ai/**`. Old marketing/pitch claims should be checked against this folder before being repeated.
- AI prompts live in `src/lib/ai/prompts/` and all share a `SYSTEM_CONTEXT` pattern. Update the relevant prompt file rather than inlining context in route handlers.
- New AI modules should follow the SRS pattern: schema → prompt → route → reliability wrapper → Zod validate → non-blocking persistence.
- See `documentation/PROJECT-DOCUMENTATION.md` for the full project document and `documentation/PRESENTATION-GUIDE.md` for the slide deck.
