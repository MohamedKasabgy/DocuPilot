# DocuPilot — Project Document

**From Documents to Decisions.**

DocuPilot is an AI operations platform for software companies and service businesses. It turns client requests, contracts, invoices, SRS documents, and scope changes into structured workflows, approvals, risks, alerts, and dashboard decisions.

This document is the single source of truth for the product as it exists today (Next.js 16 / React 19 codebase, polished SaaS-style UI, multiple live AI modules, Supabase persistence). Outdated marketing claims have been removed in favor of what the source code actually does.

---

## Table of Contents

1. [Product Positioning](#1-product-positioning)
2. [Problem Statement](#2-problem-statement)
3. [Why This Is Not ChatGPT or Claude](#3-why-this-is-not-chatgpt-or-claude)
4. [Current Product Scope](#4-current-product-scope)
5. [Implemented Pages and Routes](#5-implemented-pages-and-routes)
6. [Feature Status Table](#6-feature-status-table)
7. [AI Architecture](#7-ai-architecture)
8. [Backend & Database Architecture](#8-backend--database-architecture)
9. [Data Model](#9-data-model)
10. [Demo Scenario](#10-demo-scenario)
11. [Technical Stack](#11-technical-stack)
12. [Environment Variables](#12-environment-variables)
13. [Setup Instructions](#13-setup-instructions)
14. [Demo Instructions](#14-demo-instructions)
15. [Known Limitations](#15-known-limitations)
16. [Live vs Mock vs Planned](#16-live-vs-mock-vs-planned)
17. [Roadmap](#17-roadmap)
18. [Team Handoff Notes](#18-team-handoff-notes)

---

## 1. Product Positioning

| | |
|---|---|
| Name | DocuPilot |
| Tagline | From Documents to Decisions. |
| Category | B2B AI operations layer for software companies and service businesses |
| Pitch | DocuPilot reads your client requests, contracts, invoices, and scope changes and turns them into a single operational workflow — SRS, approvals, payment milestones, risks, alerts, and dashboard decisions. |
| Stage | Demo-ready MVP. Frontend complete. Core AI modules wired end-to-end. Authentication and multi-tenant workspaces are not yet implemented. |

---

## 2. Problem Statement

Small and mid-sized software houses and service businesses run their operations across disconnected tools — WhatsApp for client requests, Google Drive for contracts, email for invoices, Notion for requirements, and meetings for decisions. The documents exist, but they do not become **actions**.

This creates predictable failures:

- Requirements are unclear at project start.
- Contracts are signed, but obligations and deadlines are not actively tracked.
- Invoices are approved without contract context, and duplicates slip through.
- Client change requests cause silent scope creep.
- Project managers have no daily view of what is urgent, who needs to approve what, or which risks are escalating.

The bottleneck is not document storage. It is the absence of an AI layer that turns documents into operational state.

---

## 3. Why This Is Not ChatGPT or Claude

| Generic AI Chat | DocuPilot |
|---|---|
| Answers a one-off question in a chat session. | Stores structured project memory across SRS, contracts, invoices, and scope analyses. |
| Can summarize a single document if you paste it. | Extracts obligations, payments, deadlines, risks, and suggested actions with source quotes — and persists them. |
| Loses context when the chat ends. | Connects every output to a `project_id` and surfaces it in the dashboard. |
| Returns prose. | Returns Zod-validated JSON used to drive UI cards, alerts, approvals, and risks. |
| One model, one provider. | Gemini → Qwen → local fallback chain so the demo never goes dark. |

DocuPilot is built around an opinionated B2B workflow, not around a chat interface.

---

## 4. Current Product Scope

DocuPilot is shipped today as a Next.js 16 App Router web application with a polished, multi-module SaaS UI. The MVP focuses on a single connected workflow:

```
Client Request → SRS → Contract → Invoice → Scope Guard → Risk Radar → Dashboard → Ask DocuPilot
```

**In scope (today):**

- Operational dashboard with decisions, project health, financials, scope impact, and next-best actions.
- AI-powered SRS generator with refinement chat, Arabic/English handling, and Supabase persistence.
- AI-powered contract extraction with PDF upload (server-side text extraction via `unpdf`), structured output, alerts, and suggested actions.
- AI-powered invoice analysis with contract-context awareness, duplicate detection, and approval recommendations.
- AI-powered scope guard with timeline, cost, business, and risk impact assessment plus high-risk alert generation.
- AI-powered project intelligence pipeline.
- Ask DocuPilot RAG chat over uploaded documents (pgvector + Gemini embeddings).
- Reliability layer with Gemini → Qwen → local fallback and rich telemetry per response.

**Out of scope (today):**

- Authentication / user accounts / RBAC (mocked at the helper level).
- Multi-tenant workspaces (demo project ID is mostly hardcoded to `clinic-booking-platform`).
- Approvals + Risk Radar write paths.
- Production OCR for scanned PDFs.
- Email / WhatsApp / Calendar integrations.
- Accounting export, payment processing, enterprise audit logs.

---

## 5. Implemented Pages and Routes

### App pages

| Route | Purpose | Status |
|---|---|---|
| `/` | Operational dashboard (decisions, project health, financials, scope impact, next actions) | Live UI; data via `loadDashboardData()` (live / fallback / mixed) |
| `/projects` | Project workspace overview | Live UI; mostly seeded data |
| `/srs-generator` | AI SRS generator + refinement chat | Live, calls `/api/ai/srs` |
| `/contracts` | Contract-to-Actions module with PDF upload | Live, calls `/api/contracts/extract` then `/api/contracts/analyze` |
| `/invoices` | Invoice review + AI analysis | Live, calls `/api/ai/invoice` |
| `/approvals` | Approval center | UI only (mock data) |
| `/scope-guard` | Scope deviation analysis | Live, calls `/api/ai/scope` |
| `/risks` | Risk radar | UI only (reads alerts via dashboard data) |
| `/ask-docupilot` | Internal RAG assistant | Live, calls `/api/ask` (requires ingested documents) |

### API routes

| Route | What it does | Status |
|---|---|---|
| `POST /api/ai/srs` | Generate or refine a structured SRS | **Live** Gemini → Qwen → local fallback; persists `srs_documents`, `ai_outputs` |
| `POST /api/contracts/analyze` | Analyze contract text into structured operational data | **Live** Gemini structured output; persists `contract_analyses`, `alerts`, `ai_outputs` |
| `POST /api/contracts/extract` | Extract text from uploaded PDF/TXT/MD (≤15 MB) | **Live** server-side via `unpdf` |
| `GET /api/contracts/list` | List contracts | Live |
| `POST /api/ai/invoice` | Analyze an invoice in context of a linked contract | **Live** Gemini → Qwen → fallback; persists `ai_outputs` |
| `POST /api/ai/scope` | Classify a scope-change request | **Live** Gemini → Qwen → fallback; persists `scope_analyses`, `ai_outputs`, writes high-risk `alerts` |
| `POST /api/ai/project-intelligence` | Project intelligence pipeline | **Live** Gemini → fallback |
| `POST /api/ask` | RAG chat over project documents + latest SRS + latest contract | **Live** Gemini chat + pgvector RPC; mock auth |
| `POST /api/rag/ingest` | Chunk + embed a document | **Live**; mock auth |
| `POST /api/documents/analyze` | Document analysis utility | Live |
| `GET /api/projects/[id]` | Project read | Live |
| `POST /api/ai/contract` | Legacy stub returning mock JSON | **Mock** — superseded by `/api/contracts/analyze` |

---

## 6. Feature Status Table

| Feature | UI | Backend | Data Source | AI | Persistence | Demo Readiness | Notes |
|---|---|---|---|---|---|---|---|
| Dashboard | Full | `loadDashboardData()` Server Component | Supabase live, fallback when empty/unconfigured | n/a | Read-only | ✅ Ready | Returns `source: "live" \| "fallback" \| "mixed"` |
| SRS Generator | Full + chat | `/api/ai/srs` | AI-generated | Gemini → Qwen → local | `srs_documents`, `ai_outputs` | ✅ Ready | Arabic + bilingual aware |
| Contracts | Full + PDF upload | `/api/contracts/analyze`, `/extract`, `/list` | AI-generated; PDF text via `unpdf` | Gemini structured output | `contract_analyses`, `alerts`, `ai_outputs` | ✅ Ready | Risk sensitivity filter is client-side; language banner only |
| Invoices | Full | `/api/ai/invoice` | AI-generated | Gemini → Qwen → fallback | `ai_outputs` | ✅ Ready | Contract-context aware |
| Scope Guard | Full | `/api/ai/scope` | AI-generated | Gemini → Qwen → fallback | `scope_analyses`, `ai_outputs`, `alerts` | ✅ Ready | Auto-creates high-risk alerts |
| Project Intelligence | Embedded | `/api/ai/project-intelligence` | AI-generated | Gemini → fallback | yes | ✅ Ready | Used by SRS / project flows |
| Ask DocuPilot | Full | `/api/ask` + `/api/rag/ingest` | Ingested docs + latest SRS/contract | Gemini chat + `text-embedding-004` | `documents`, `document_chunks` (pgvector) | ⚠ Conditional | Returns "not enough information" until docs are ingested; auth is mocked |
| Projects | Full | `/api/projects/[id]` | Mostly seeded/static | n/a | partial | ✅ UI demo-ready | |
| Approvals | Full | — | Mock | — | — | UI demo only | |
| Risk Radar | Full | — | Reads `alerts` via dashboard | — | — | UI demo only | |
| Legacy stub | n/a | `/api/ai/contract` | — | Mock JSON | — | Do not use | Replaced by `/api/contracts/analyze` |

---

## 7. AI Architecture

```
Route handler
    ↓
buildPrompt(input, options)         // src/lib/ai/prompts/<module>.ts
    ↓
generateWithGeminiReliability(      // src/lib/ai/geminiReliability.ts
    prompt,
    { responseMimeType: "application/json", responseSchema },
    { schemaHint }                  // forwarded as Qwen system message
)
    ├── Gemini primary model        (GEMINI_FAST_MODEL)
    ├── Gemini fallback model       (GEMINI_FALLBACK_MODEL) on 5xx/429/auth
    └── Qwen OpenAI-compatible call (when QWEN_API_KEY is set)
    ↓
extractJsonObject(text)             // src/lib/ai/jsonUtils.ts
    ↓
normalize<Module>Output(parsed)     // defensive (snake_case → camelCase, fraction → percent, missing nullables)
    ↓
<Module>Schema.parse(normalized)    // Zod 4
    ↓
On any parse/validate failure → local fallback object (src/lib/ai/fallbacks/...)
    ↓
isSupabaseConfigured() guard → non-blocking try/catch persistence
    ↓
Response JSON: { success, providerUsed, source, usedFallback, fallbackReason, errorCode, modelUsed, attempts, retried, data }
```

**Models (all overridable via env):**

- Primary: `gemini-2.5-flash-lite`
- Reliability fallback: `gemini-2.0-flash`
- Embeddings: `text-embedding-004`
- Tertiary fallback provider: Qwen `qwen-plus` (configurable)

**Why the fallback chain:** live demos cannot afford Gemini outages or rate-limits. Each module has a hand-crafted fallback object so the UI always renders a coherent, on-brand response even when every provider fails.

---

## 8. Backend & Database Architecture

- Server-side Supabase client (`src/lib/db/supabaseAdmin.ts`) is a lazy proxy. `isSupabaseConfigured()` must return true before any DB call. AI routes degrade gracefully when Supabase is missing (warning log, response unaffected).
- All AI persistence is non-blocking: try/catch around inserts, errors logged, never thrown to client.
- Migrations live under `supabase/migrations/`:
  - `0001_domain_tables.sql` — core tables
  - `0002_project_intelligence.sql` — project intelligence outputs
  - `0003_scope_analyses.sql` — scope analyses
  - `0004_data_backbone_draft.sql` — expanded data backbone (draft)
  - `20260503000000_rag_setup.sql` — pgvector extension, `documents`, `document_chunks`, RPC `match_document_chunks`
- Seed: `npm run db:seed` (`scripts/seed.ts`).

---

## 9. Data Model

Tables in active use:

- `projects`
- `srs_documents`
- `contract_analyses`
- `scope_analyses`
- `ai_outputs` (generic JSON sink, typed by `type` column: `srs`, `contract_analysis`, `invoice_analysis`, `scope_analysis`, …)
- `alerts`
- `documents`, `document_chunks` (pgvector)

Demo project ID: `clinic-booking-platform`. Every AI output references a `project_id`.

---

## 10. Demo Scenario

| | |
|---|---|
| Software house | NexaSoft |
| Client | Al Waha Clinics |
| Project | Clinic Booking Platform |
| Goal | Web booking system with admin dashboard, appointment management, online payments, patient profiles, and notifications |

The demo persona is also used as the canonical fallback content when AI providers are unavailable, so the demo story stays consistent under stress.

---

## 11. Technical Stack

Verified from `package.json`:

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **AI:** `@google/genai` (Gemini), Qwen via OpenAI-compatible HTTP, `text-embedding-004`
- **Database:** `@supabase/supabase-js`, Postgres + pgvector
- **Validation:** Zod 4
- **PDF:** `unpdf` (server-side, serverless-friendly)
- **Styling:** Tailwind CSS 4, custom CSS tokens, Font Awesome 6, Inter + Outfit
- **Tooling:** ESLint, Playwright (e2e seeded), tsx, dotenv

---

## 12. Environment Variables

Copy `.env.example` to `.env.local`.

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Yes (live AI) | Google AI Studio key |
| `GEMINI_FAST_MODEL` | No | Primary model (default `gemini-2.5-flash-lite`) |
| `GEMINI_FALLBACK_MODEL` | No | Fallback model (default `gemini-2.0-flash`) |
| `GEMINI_EMBEDDING_MODEL` | No | Embeddings model (default `text-embedding-004`) |
| `QWEN_API_KEY` | No | Tertiary AI fallback |
| `QWEN_BASE_URL`, `QWEN_MODEL` | No | Override Qwen endpoint / model |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (persistence) | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (persistence, server-only) | Service role key — never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Future client-side Supabase use |

Without any keys set, the app still runs as a high-fidelity demo — local fallback objects feed the UI.

---

## 13. Setup Instructions

```bash
npm install
# PowerShell:
Copy-Item .env.example .env.local
# macOS/Linux:
cp .env.example .env.local
# Edit .env.local with your keys
npm run dev
```

Optional database setup:

1. Create a Supabase project.
2. In the SQL editor, run the migration files in `supabase/migrations/` in order.
3. `npm run db:seed` to insert demo project + sample rows.

---

## 14. Demo Instructions

1. **Dashboard (`/`)** — open and walk through decisions, project health, financials, and next actions. Mention the live/fallback indicator.
2. **SRS Generator (`/srs-generator`)** — paste a short Arabic or English client request, generate, then refine via chat.
3. **Contracts (`/contracts`)** — drop a PDF on the upload zone (or use *Use sample*), run AI extraction, walk through scope, deliverables, payments, obligations, risks, deadline tracker, and suggested actions.
4. **Invoices (`/invoices`)** — pick the seeded invoice, run analysis, and call out duplicate risk + approval recommendation.
5. **Scope Guard (`/scope-guard`)** — submit *"Can you also add a mobile app for the booking platform?"* and read out the in/out classification, timeline/cost/risk impact, and the auto-generated alert.
6. **Risk Radar (`/risks`)** — show aggregated risks (note: page is UI for now; alerts are persisted by other modules).
7. **Dashboard** — return to show updated decisions and alerts.
8. **Ask DocuPilot (`/ask-docupilot`)** — only show this if you have ingested documents (otherwise the assistant correctly says it does not have enough information).

---

## 15. Known Limitations

- Authentication is mocked. Do not present DocuPilot as a multi-tenant system today.
- `projectId` is mostly hardcoded to `clinic-booking-platform`.
- Approvals and Risk Radar pages are UI-only.
- Ask DocuPilot only returns useful answers after documents have been ingested via `/api/rag/ingest`.
- Some pages do not rehydrate analyses after a hard refresh.
- The Contract Vault button is a placeholder.
- The legacy `/api/ai/contract` returns mock JSON; use `/api/contracts/analyze`.
- Risk sensitivity and language toggles in the contracts module are client-side filters, not server parameters.

---

## 16. Live vs Mock vs Planned

**Currently implemented (live):** SRS, Contracts (analyze + PDF extract + list), Invoices, Scope Guard, Project Intelligence, Ask DocuPilot RAG (with mock auth), Dashboard data loader, Supabase persistence.

**Demo-ready (live + tuned for presentation):** SRS, Contracts, Invoices, Scope Guard, Dashboard.

**Mock / fallback (intentionally):** Local fallback objects in every AI route for offline/rate-limited demos. Approvals and Risk Radar pages.

**Planned:** Auth + RBAC, Approvals + Risk write paths, multi-project selectors, client-side rehydration, production OCR, calendar/email/WhatsApp, accounting export, audit logs.

---

## 17. Roadmap

| Horizon | Items |
|---|---|
| Now (demo) | Polish copy across modules, ensure fallback objects match the NexaSoft × Al Waha demo, validate end-to-end on a fresh Supabase project. |
| Next (post-demo) | Real auth (Supabase Auth), workspace model, project selector, Approvals + Risk write paths, rehydration of analyses on refresh. |
| Later | Production OCR, integrations (calendar, email, WhatsApp), accounting export, billing, audit logs, multilingual coverage beyond Arabic for GCC. |

---

## 18. Team Handoff Notes

- Treat the code under `src/app/api/**` and `src/lib/ai/**` as the source of truth — older docs, screenshots, and pitch text often lag.
- Every new AI module follows the same skeleton: schema → prompts → route → reliability wrapper → Zod validate → non-blocking persistence → local fallback.
- All AI prompts share a `SYSTEM_CONTEXT` constant. Update it in the prompt file rather than inlining context in route handlers.
- Zod 4 is in use — do not introduce `zod-to-json-schema` (incompatible). Write JSON schemas by hand.
- Keep the product positioned as an operations layer, not a chatbot. New features should turn documents into operational state, not into more chat.
