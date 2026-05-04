# DocuPilot AI Context

This file is written for AI coding assistants such as Claude, ChatGPT, Gemini, and Cursor.

Before making changes to this project, always read this file and README.md.

---

## Project Summary

DocuPilot is a B2B AI-powered document operations platform.

It helps software companies and service businesses turn documents and client inputs into structured workflows, approvals, risks, and decisions.

Tagline:

> From Documents to Decisions.

Main MVP flow:

Client Request → SRS Generator → Contract-to-Actions → Invoice-to-Approval → Scope Guard → Risk Radar → Dashboard

---

## Current Status

The frontend/UI is approximately 80% complete.

The project currently behaves like a high-fidelity interactive SaaS prototype.

Most pages, cards, layouts, and navigation are already implemented.

The current data is mostly static/mock data.

The next major phase is backend, database, and AI integration.

---

## Important Instruction for AI Assistants

Do not redesign the whole UI unless explicitly asked.

Do not remove existing pages, routes, components, or styling.

Preserve the current DocuPilot identity, layout, and SaaS dashboard feel.

Focus on incremental improvements and backend integration.

When modifying code:
- Inspect the existing structure first.
- Reuse existing components where possible.
- Keep TypeScript clean.
- Avoid unnecessary architecture changes.
- Do not invent features outside the MVP.
- Explain what files were changed after every task.

---

## Current Frontend Routes

The project includes these main routes:

- `/` — Dashboard
- `/projects` — Project Workspace
- `/srs-generator` — Smart SRS Generator
- `/contracts` — Contract-to-Actions
- `/invoices` — Invoice Review
- `/approvals` — Approval Workflow
- `/scope-guard` — Scope Guard
- `/risks` — Risk Radar
- `/ask-docupilot` — AI Assistant / future RAG chat

---

## Current Backend Status

Backend is not fully implemented yet.

Existing API routes may currently be stubs or mock endpoints.

The next backend work should focus on:

1. Database setup
2. Data models
3. Demo seed data
4. Gemini API integration
5. Zod validation
6. Saving AI outputs
7. Connecting dashboard metrics to real stored data

---

## Planned Data Models

Use these as the core backend models:

- `companies`
- `projects`
- `srs_outputs`
- `contracts`
- `invoices`
- `approvals`
- `risks`
- `client_requests`
- `ai_outputs`

Every AI-generated output should be linked to a `projectId`.

---

## AI Workflows

### 1. SRS Generator

Input:
- Client request text

Output:
- Project brief
- User roles
- Main features
- Functional requirements
- Non-functional requirements
- Missing questions
- MVP scope
- Assumptions

---

### 2. Contract-to-Actions

Input:
- Contract text

Output:
- Scope
- Deliverables
- Deadlines
- Payments
- Obligations
- Risks
- Change request terms
- Suggested actions

Important:
Do not provide legal advice. Extract operational information only.

---

### 3. Invoice-to-Approval

Input:
- Invoice text

Output:
- Vendor
- Service
- Amount
- Currency
- Due date
- Related project
- Approval status
- Reason
- Recommended action

Rule:
If amount is greater than 5000 SAR, approval is required.

---

### 4. Scope Guard

Input:
- New client request
- Existing SRS
- Contract scope

Output:
- `in_scope`
- `out_of_scope`
- `needs_clarification`

Also return:
- Reason
- Timeline impact
- Cost impact
- Suggested action
- Client reply

---

## Demo Scenario

Use this scenario for demo data:

Company:
NexaSoft

Client:
Al Waha Clinics

Project:
Clinic Booking Platform

Scenario:
NexaSoft is building a clinic booking platform for Al Waha Clinics.

DocuPilot should:
1. Generate an SRS from the initial client request.
2. Analyze the contract and extract risks, payments, obligations, and deadlines.
3. Analyze an invoice from DesignPro Studio.
4. Detect that a mobile app request is out of scope.
5. Show all risks, approvals, invoices, and actions in the dashboard.

---

## Backend Priority Order

Do backend work in this order:

1. Create database connection.
2. Create project schema/models.
3. Add demo seed data.
4. Implement SRS Generator API.
5. Save SRS output to database.
6. Display saved SRS in Project Workspace.
7. Implement Contract-to-Actions API.
8. Implement Invoice-to-Approval API.
9. Implement Scope Guard API.
10. Connect dashboard metrics to stored data.
11. Add fallback demo data for pitch safety.
12. Add Ask DocuPilot only if the core MVP works.

---

## Recommended AI Integration

Use Gemini Flash for:
- Fast extraction
- SRS generation
- Invoice parsing

Use Gemini Pro for:
- Contract reasoning
- Scope comparison
- Complex risk analysis

All AI outputs must return structured JSON.

Validate every AI response with Zod before saving it.

If AI fails, return a clean fallback response instead of breaking the UI.

---

## Things Not To Build Yet

Do not prioritize these before the core MVP works:

- Full RAG system
- Full authentication system
- Full role-based access control
- Payment integration
- Gmail/WhatsApp/Calendar integrations
- Full OCR system
- Full accounting system
- Enterprise audit logs

---

## Current Development Rule

The main value of DocuPilot is not chatting with documents.

The main value is turning documents into:

- Decisions
- Risks
- Approvals
- Tasks
- Alerts
- Dashboard insights

Always preserve this product direction.

---

## Latest Integration Update — Contract-to-Actions

**Branch:** `integration/mvp-merge`
**Date:** May 2026
**Status:** Demo-ready. Real AI + database behavior requires `.env.local` with valid keys.

### What Is Now Connected

The `/contracts` page is connected to a real backend endpoint. Submitting contract text triggers a live Gemini call, Zod validation, Supabase persistence, and returns structured data rendered in the UI.

### Endpoint

```
POST /api/contracts/analyze
```

Source: `src/app/api/contracts/analyze/route.ts`

**Request body:**
```json
{
  "projectId": "clinic-booking-platform",
  "contractText": "...",
  "depth": "quick | standard | deep"
}
```

> The frontend also sends `riskSensitivity` and `language`, but the current backend only reads `projectId`, `contractText`, and `depth`. Risk sensitivity filtering is applied client-side. Language selection shows an info banner only.

**Success response:**
```json
{ "success": true, "data": { ...ContractAnalysisOutput } }
```

**Error response:**
```json
{ "success": false, "error": "Failed to analyze contract." }
```

### AI Layer

- **Model:** `gemini-2.5-flash` (constant `GEMINI_PRO_MODEL` in `src/lib/ai/gemini.ts`)
- **Structured output:** `responseSchema` using `@google/genai` Type enums — enforces JSON shape at the model level before Zod runs
- **Prompt:** `buildContractPrompt()` in `src/lib/ai/prompts/contract.ts` — depth parameter controls extraction verbosity
- **Zod schema:** `ContractAnalysisSchema` in `src/lib/ai/schemas/contract.ts` — validates the parsed Gemini response
- **Fallback:** If Gemini fails or Zod rejects the output, `FALLBACK_DATA` (a hardcoded demo analysis) is used so Supabase writes and the UI still succeed

### Supabase Writes Per Analysis

1. `contract_analyses` — full contract text, structured JSON output, confidence score
2. `alerts` — one row per extracted risk + one row per high/critical deadline
3. `ai_outputs` — raw structured output, typed as `contract_analysis`

All rows reference `project_id`. The `project_id` must exist in the `projects` table. Demo ID: `clinic-booking-platform`.

### Required Tables

`projects`, `contract_analyses`, `alerts`, `ai_outputs`

If the API returns a 500 with a foreign key violation, confirm that `clinic-booking-platform` exists in the `projects` table.

### UI States

| State | Behavior |
|---|---|
| Before analysis | Mock/static data shown |
| Loading | Button shows spinner + "Analyzing…", disabled |
| Success | "AI Analyzed" badge, real extracted data rendered |
| Error | Red error banner + toast notification |
| Re-run | Button changes to "Re-analyze Contract" |

### Environment Variables Required

Copy `.env.example` to `.env.local` and fill in your own keys:

```powershell
# PowerShell
Copy-Item .env.example .env.local
```

```bash
# macOS / Linux
cp .env.example .env.local
```

Required keys:

```env
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are server-side only — never prefix them with `NEXT_PUBLIC_`. `.env.local` is gitignored; `.env.example` is the committed template.

### What Remains Placeholder

- PDF upload (toast message only — no file parsing)
- Contract Vault (toast message only)
- `language` and `riskSensitivity` not used server-side
- `projectId` is hardcoded; no project selector UI yet
- Results not persisted in browser after page refresh

See `CONTRACTS_FLOW_HANDOFF.md` for the full test scenario, browser checklist, and recommended next tasks.