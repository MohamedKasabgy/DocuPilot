# DocuPilot — AI Context

This file is for AI coding assistants (Claude, ChatGPT, Gemini, Cursor). Read this **and** `README.md` and `CLAUDE.md` before changing code.

---

## Project Summary

DocuPilot is a B2B AI operations platform for software companies and service businesses. It turns documents and client inputs into structured workflows, approvals, risks, alerts, and decisions.

> **Tagline:** From Documents to Decisions.

**Core MVP flow:**

```
Client Request → SRS Generator → Contract-to-Actions → Invoice-to-Approval → Scope Guard → Risk Radar → Dashboard → Ask DocuPilot
```

---

## Current State (Source-Verified)

The product is a Next.js 16 App Router application with React 19, TypeScript, Tailwind 4, Gemini, Qwen fallback, Supabase, and Zod 4. UI is approximately complete and polished. **Core AI modules are wired end-to-end** (SRS, Contracts, Invoices, Scope Guard, Project Intelligence, Ask DocuPilot RAG). A few pages remain interactive UI only. Authentication is mocked.

### What's Live (real AI + real persistence)

| Module | Route handler | Notes |
|---|---|---|
| SRS Generator | `src/app/api/ai/srs/route.ts` | Generation + refinement, structured `responseSchema`, persists to `srs_documents` + `ai_outputs` |
| Contract Analysis | `src/app/api/contracts/analyze/route.ts` | Persists to `contract_analyses`, `alerts`, `ai_outputs` |
| Contract PDF Extraction | `src/app/api/contracts/extract/route.ts` | Server-side via `unpdf`, accepts PDF/TXT/MD up to 15 MB |
| Invoice Analysis | `src/app/api/ai/invoice/route.ts` | Contract-context aware, persists to `ai_outputs` |
| Scope Guard | `src/app/api/ai/scope/route.ts` | Persists to `scope_analyses`, `ai_outputs`, and writes high-risk `alerts` |
| Project Intelligence | `src/app/api/ai/project-intelligence/route.ts` | Persists output |
| Ask DocuPilot (RAG) | `src/app/api/ask/route.ts` | Embeds query, calls Supabase RPC `match_document_chunks`, augments with latest SRS + contract |
| RAG Ingest | `src/app/api/rag/ingest/route.ts` | Chunks + embeds + writes to `documents` + `document_chunks` (pgvector) |
| Dashboard | `src/lib/dashboard/load.ts` | Reads Supabase, returns `source: "live" \| "fallback" \| "mixed"` |

### What's UI-Only / Mock

- `/approvals` — interactive UI; no write-back endpoint.
- `/risks` — interactive UI; reads alerts indirectly through dashboard data.
- `/api/ai/contract` — **legacy stub returning mock JSON**. The real contract endpoint is `/api/contracts/analyze`. Do not call the legacy stub from new code.
- `verifyAuth` / `checkRateLimit` helpers in `/api/ask` and `/api/rag/ingest` are explicit mocks.
- Contract Vault button — toast only.

### What's Partially Live

- Projects pages and `/api/projects/[id]` — read paths exist; data is mostly seeded/static.
- Ask DocuPilot — backend is real but only useful after documents have been ingested via `/api/rag/ingest`.

---

## AI Architecture (must follow)

```
prompt = build<Module>Prompt(...)            // src/lib/ai/prompts/<module>.ts
result = generateWithGeminiReliability(      // src/lib/ai/geminiReliability.ts
            prompt,
            { responseMimeType, responseSchema },
            { schemaHint }                   // forwarded to Qwen
         )
// providers tried in order: Gemini primary → Gemini fallback model → Qwen → caller falls back to local
parsed = extractJsonObject(result.text)      // src/lib/ai/jsonUtils.ts
norm   = normalize<Module>Output(parsed)     // src/lib/ai/normalized-output.ts (where applicable)
output = <Module>Schema.parse(norm)          // Zod 4
// On any parse/validate failure, return local fallback object (src/lib/ai/fallbacks/...) — never throw to the client
// Persist with isSupabaseConfigured() guard, wrapped in try/catch (non-blocking)
return NextResponse.json({ success, providerUsed, source, usedFallback, fallbackReason, errorCode, modelUsed, attempts, retried, data })
```

### Hard Constraints

1. **Zod 4** is in use. Do **not** use `zod-to-json-schema` for response schemas — write JSON schemas by hand using either plain objects or `@google/genai` `Type` enums.
2. **Persistence is non-blocking.** Wrap all Supabase calls in try/catch. Never let a DB error crash an AI route.
3. **Always go through `generateWithGeminiReliability`.** Do not call `gemini.models.generateContent` directly in route handlers (the Ask route is the existing exception because it is RAG, not structured-output extraction).
4. **Every prompt module exports a `SYSTEM_CONTEXT`** describing DocuPilot platform behavior. Use it.
5. **Add a fallback object** for every new AI module so the UI never breaks when providers fail.

---

## Data Models (live tables)

- `projects`
- `srs_documents`
- `contract_analyses`
- `scope_analyses`
- `ai_outputs` (generic JSON sink, typed by `type` column)
- `alerts`
- `documents`, `document_chunks` (pgvector)

Demo project ID used across modules: `clinic-booking-platform`.

Migrations under `supabase/migrations/`. Seed via `npm run db:seed`.

---

## Demo Scenario

| | |
|---|---|
| Software house | NexaSoft |
| Client | Al Waha Clinics |
| Project | Clinic Booking Platform |

Used as the canonical demo across all live modules and as the fallback persona when AI providers are unavailable.

---

## Things Not To Build Without Explicit Ask

- A new authentication system.
- Role-based access control.
- Payment processing.
- Email/WhatsApp/Calendar integrations.
- Production OCR.
- A custom-trained AI model.
- New UI design language — preserve current SaaS dashboard identity.

---

## Product Direction (Do Not Drift)

DocuPilot is **not a chatbot** and **not a document summarizer**. Every change should reinforce the operations layer: turning documents into decisions, risks, approvals, tasks, alerts, and dashboard insights. If a proposed feature only shows summaries without producing operational outputs, push back on it.
