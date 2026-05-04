# DocuPilot — Complete Project Documentation

**From Documents to Decisions.**

DocuPilot is an AI-powered business document operations platform for software companies. It converts client requests, contracts, invoices, and scope changes into structured workflows, risks, approvals, and actionable decisions — all from one operational hub.

**Built for the MENA market. Arabic-first. AI-native.**

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Live AI Modules](#live-ai-modules)
5. [All Pages & Routes](#all-pages--routes)
6. [API Routes](#api-routes)
7. [Database (Supabase)](#database-supabase)
8. [AI Integration Details](#ai-integration-details)
9. [Design System](#design-system)
10. [Environment Variables](#environment-variables)
11. [Setup & Commands](#setup--commands)
12. [Folder Structure](#folder-structure)
13. [Demo Scenario](#demo-scenario)
14. [Product Vision & Roadmap](#product-vision--roadmap)

---

## Project Overview

DocuPilot is a portfolio-grade SaaS platform that helps software houses manage the full lifecycle of client engagements. Unlike task-tracking tools (Jira, Monday, Notion), DocuPilot **thinks** — it uses AI to generate documents, detect risks, and protect against scope creep.

### What Makes It Different

| Capability | Jira | Juro | Jama Connect | ScopeShield | DocuPilot |
|-----------|------|------|-------------|-------------|-----------|
| AI SRS Generation | No | No | No | No | Full structured output |
| Arabic NLP | No | No | No | No | Native understanding |
| Scope Creep Detection | No | No | No | Email-only | SRS/contract comparison |
| Contract AI Analysis | No | Yes | No | Partial | Yes |
| Invoice AI | No | No | No | No | Yes |
| RAG Document Q&A | No | No | No | No | Source-cited answers |
| Software House Focus | Partial | No | No | Agencies | Yes |
| **Pricing** | $8-16/user/mo | $15K-120K/yr | Enterprise | $20/mo | $49-149/team/mo |

No single competitor covers SRS generation + scope detection + contract analysis + invoice AI + Arabic NLP. The alternative is stitching together Jira + Juro + ScopeShield — costing 10x more with no integration and no Arabic support.

### Target Users

- Project Managers at software houses
- Operations Managers at digital agencies
- CTOs and team leads managing client deliveries
- Software companies in Saudi Arabia, UAE, Egypt, and the broader MENA region

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.4 |
| UI Library | React | 19.2.5 |
| Language | TypeScript (strict mode) | 5.x |
| Styling | Tailwind CSS | 4.0.0 |
| AI Engine | Google Gemini (`@google/genai`) | 1.51.0 |
| AI Models | Gemini 2.5 Flash (generation) + Embedding-001 (RAG) | — |
| Database | Supabase (PostgreSQL + pgvector) | 2.105.1 |
| Validation | Zod | 4.4.3 |
| Icons | Font Awesome 6 + Lucide React | — |
| Fonts | Inter (body) + Outfit (headings) | Google Fonts |

---

## Architecture

```
src/
├── app/                           # Next.js App Router
│   ├── api/
│   │   ├── ai/
│   │   │   ├── srs/route.ts      # LIVE — Gemini SRS generation + refinement
│   │   │   ├── contract/route.ts  # Stub — planned Gemini integration
│   │   │   ├── invoice/route.ts   # Stub — planned Gemini integration
│   │   │   ├── scope/route.ts     # Stub — planned Gemini integration
│   │   │   └── template.ts       # Shared route template
│   │   ├── ask/route.ts           # LIVE — RAG Q&A with Gemini
│   │   └── rag/
│   │       └── ingest/route.ts    # LIVE — Document chunking + embeddings
│   ├── page.tsx                   # Dashboard
│   ├── srs-generator/
│   │   ├── page.tsx               # SRS page (live AI)
│   │   └── SRSChat.tsx            # Standalone chat component
│   ├── ask-docupilot/page.tsx     # RAG chat (live AI)
│   ├── scope-guard/page.tsx       # Scope analysis (mock UI)
│   ├── contracts/page.tsx         # Contract extraction (mock UI)
│   ├── invoices/page.tsx          # Invoice review (mock UI)
│   ├── approvals/page.tsx         # Approval workflow (mock UI)
│   ├── projects/page.tsx          # Project workspace (mock UI)
│   └── risks/page.tsx             # Risk radar (mock UI)
├── lib/
│   ├── ai/
│   │   ├── gemini.ts              # Gemini client singleton + model config
│   │   ├── schemas/srs.ts        # Zod schema + JSON schema for structured output
│   │   └── prompts/srs.ts        # Rich system context + prompt builders
│   ├── db/
│   │   └── supabaseAdmin.ts      # Supabase server client (service key + publishable fallback)
│   └── rag/
│       ├── chunkText.ts           # Text chunking (900 chars, 150 overlap)
│       └── embeddings.ts          # Gemini embedding-001 vector generation
├── components/
│   ├── common/
│   │   ├── Card.tsx               # Reusable card wrapper
│   │   └── MetricCard.tsx         # Stat card with value, icon, badge, trend
│   └── layout/
│       ├── Header.tsx             # Top bar with search, notifications, user profile
│       └── Sidebar.tsx            # Navigation with 8 routes + AI assistant section
└── styles/
    ├── index.css                  # Design tokens (CSS custom properties)
    ├── layout.css                 # App shell, sidebar, grid layouts
    └── components.css             # Card, button, badge, form styles
```

### AI Module Pattern

Every AI module follows the same architecture:

1. **Schema** (`src/lib/ai/schemas/<module>.ts`) — Zod validation schema + hand-written JSON schema for Gemini's structured output mode
2. **Prompt** (`src/lib/ai/prompts/<module>.ts`) — Rich system context explaining DocuPilot + task-specific prompt builder
3. **Route** (`src/app/api/ai/<module>/route.ts`) — POST handler: validate input → call Gemini → validate output with Zod → persist to Supabase (non-blocking) → return JSON
4. **Page** (`src/app/<module>/page.tsx`) — Client component that calls the API and renders results

**Important:** Zod 4 is NOT compatible with `zod-to-json-schema`. All JSON schemas are written manually as plain objects.

---

## Live AI Modules

### 1. SRS Generator (`/srs-generator`)

The flagship module. Transforms raw client requests into structured Software Requirements Specifications.

**How it works:**
- User pastes a client request (Arabic, English, or mixed)
- Gemini AI analyzes the request and generates a complete SRS
- Output is validated against a Zod schema before rendering
- Users can refine the SRS through follow-up messages (chat refinement)
- Results are persisted to Supabase

**AI Output Structure:**
- Project Brief (name, client, industry, complexity, summary)
- User Roles (role, description, permissions)
- Main Features (title, description, priority)
- Functional Requirements (ID, title, description, priority)
- Non-Functional Requirements (category, requirement)
- Missing Questions (what the client should have specified)
- MVP Scope (achievable in 4-8 weeks)
- Assumptions
- Confidence Score (0-100)

**Key files:**
- `src/app/srs-generator/page.tsx` — Full page with options panel, textarea, AI output rendering
- `src/app/api/ai/srs/route.ts` — Gemini API call with structured JSON output
- `src/lib/ai/schemas/srs.ts` — Zod + JSON schema
- `src/lib/ai/prompts/srs.ts` — System context + prompt builders

**Supabase tables:** `srs_documents`, `ai_outputs`

### 2. Ask DocuPilot (`/ask-docupilot`)

RAG-based (Retrieval Augmented Generation) Q&A interface. Users upload documents, then ask questions answered from their actual content.

**How it works:**
- User uploads document text (paste or file upload, 5MB limit)
- Text is chunked (900 chars, 150 overlap) and embedded using Gemini embedding-001
- Chunks are stored in Supabase with vector embeddings
- User asks a question → query is embedded → vector similarity search finds relevant chunks
- Gemini answers the question using retrieved context + any stored SRS/contract data
- Answers include source attribution

**Key files:**
- `src/app/ask-docupilot/page.tsx` — Chat interface with document upload
- `src/app/api/ask/route.ts` — RAG retrieval + Gemini Q&A
- `src/app/api/rag/ingest/route.ts` — Document chunking + embedding pipeline
- `src/lib/rag/chunkText.ts` — Text chunking utility
- `src/lib/rag/embeddings.ts` — Gemini embedding generation

**Supabase tables:** `documents`, `document_chunks` (with pgvector)

### 3. Document Ingest (`/api/rag/ingest`)

Backend pipeline that processes uploaded documents for the RAG system.

**Process:**
1. Validate text (minimum 50 characters)
2. Insert document record to Supabase
3. Chunk text into segments (900 chars, 150 char overlap)
4. Generate embedding for each chunk via Gemini embedding-001
5. Store chunks with embeddings in `document_chunks` table

---

## All Pages & Routes

| Route | Status | Type | Description |
|-------|--------|------|-------------|
| `/` | Mock (polished) | Client Component | Dashboard — metrics, AI-powered smart alerts, priorities, deadlines, next best actions |
| `/projects` | Mock | Client Component | Project workspace — health score, timeline, task stream, document vault |
| `/srs-generator` | **LIVE AI** | Client Component | SRS generation from Arabic/English input with Gemini |
| `/ask-docupilot` | **LIVE AI** | Client Component | RAG chat — upload docs, ask questions, get sourced answers |
| `/contracts` | Mock | Client Component | Contract extraction UI — depth/sensitivity controls, risk scoring |
| `/invoices` | Mock | Client Component | Invoice review — currency conversion, approval chain, duplicate detection |
| `/approvals` | Mock | Client Component | Simplified approval workflow (subset of invoices page) |
| `/scope-guard` | Mock | Client Component | Scope deviation analysis — Arabic input, change request generation |
| `/risks` | Mock | Client Component | Risk radar — severity/source/status filters, mitigation tracking |

**Mock pages** have fully interactive UIs (filters, toggles, state management) but display hardcoded data. The UI is production-quality and ready to be wired to real AI backends.

---

## API Routes

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/api/ai/srs` | POST | **LIVE** | Generate or refine SRS via Gemini |
| `/api/ask` | POST | **LIVE** | RAG Q&A — retrieve context + answer with Gemini |
| `/api/rag/ingest` | POST | **LIVE** | Chunk + embed document text, store in Supabase |
| `/api/ai/contract` | POST | Stub | Returns mock response (Gemini integration planned) |
| `/api/ai/invoice` | POST | Stub | Returns mock response (Gemini integration planned) |
| `/api/ai/scope` | POST | Stub | Returns mock response (Gemini integration planned) |

### SRS Route Details

**Input (Generation mode):**
```json
{ "clientRequest": "string (min 10 chars)", "projectId": "optional string" }
```

**Input (Refinement mode):**
```json
{
  "clientRequest": "string",
  "projectId": "optional string",
  "currentSrs": "SrsOutput object",
  "refinementMessage": "string"
}
```

**Output:**
```json
{ "success": true, "data": { "projectBrief": {...}, "userRoles": [...], ... } }
```

---

## Database (Supabase)

**Project URL:** `https://tnncbegfzkflbvvmbnqn.supabase.co`

### Tables in Use

| Table | Purpose |
|-------|---------|
| `srs_documents` | Generated SRS documents (project_id, client_request, output_json, confidence_score) |
| `ai_outputs` | All AI-generated outputs (project_id, type, json) |
| `documents` | Uploaded documents for RAG (project_id, title, document_type) |
| `document_chunks` | Chunked text with vector embeddings for semantic search |

### Persistence Pattern

All database writes are **non-blocking**:
```typescript
try {
  await supabaseAdmin.from("table").insert({...});
} catch (dbError) {
  console.error("Supabase persistence failed (non-blocking):", dbError);
}
```

If the database is down, the AI response still returns successfully. The user sees their result; persistence is best-effort.

---

## AI Integration Details

### Gemini Client (`src/lib/ai/gemini.ts`)

```typescript
import { GoogleGenAI } from "@google/genai";
export const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
export const GEMINI_FAST_MODEL = process.env.GEMINI_FAST_MODEL || "gemini-2.5-flash";
export const GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";
```

### Structured Output

Gemini is called with `responseMimeType: "application/json"` and a `responseSchema` to ensure consistent, parseable output:

```typescript
const response = await gemini.models.generateContent({
  model: GEMINI_FAST_MODEL,
  contents: prompt,
  config: {
    responseMimeType: "application/json",
    responseSchema: srsJsonSchema,
  },
});
```

### Prompt Engineering

The SRS prompt includes rich system context:
- What DocuPilot is and how its modules interconnect
- How SRS output feeds downstream (Scope Guard, contracts, invoices, project planning)
- Typical tech stacks software houses build with
- Middle Eastern client patterns (Arabic input, ZATCA compliance, mobile-first assumptions)
- Rules for precision, completeness, and honest confidence scoring

### RAG Pipeline

1. **Ingest:** Text → chunks (900 chars, 150 overlap) → Gemini embedding-001 → 768-dimensional vectors → Supabase
2. **Query:** Question → embed → `match_document_chunks` RPC (vector similarity) → top chunks + SRS/contract context → Gemini answers with citations

---

## Design System

### CSS Custom Properties (`src/styles/index.css`)

| Token | Value | Usage |
|-------|-------|-------|
| `--accent-primary` | `#4F46E5` (indigo) | Primary actions, links |
| `--bg-main` | `#F9F9FB` | Page background |
| `--bg-surface-glass` | `rgba(255,255,255,0.95)` | Card backgrounds |
| `--bg-sidebar` | `#0F172A` (dark slate) | Sidebar background |
| `--font-sans` | Inter | Body text |
| `--font-display` | Outfit | Headings, brand |
| `--radius-lg` | `0.75rem` | Card corners |
| `--spacing-lg` | `1.5rem` | Card padding, section gaps |
| `--status-success` | Green | Positive states |
| `--status-warning` | Amber | Attention states |
| `--status-danger` | Red | Critical states |
| `--status-info` | Blue | Informational states |

### Component Patterns

- **Pages:** Client Components with `'use client'`. Import `Header` at top, wrap in `<div className="page-container animate-fade-in">`.
- **Cards:** Use `<Card>` from `@/components/common/Card` or the `.card` CSS class directly.
- **Metrics:** Use `<MetricCard>` with title, value, icon, badge, trend props.
- **Layouts:** CSS grid with `.grid`, `.grid-cols-2`, `.grid-cols-4`, `.layout-sidebar-right`.

---

## Environment Variables

Stored in `.env.local` (gitignored). See `.env.local.example` for the template.

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google AI Studio API key |
| `GEMINI_FAST_MODEL` | No | Model ID (default: `gemini-2.5-flash`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role key (recommended for server-side) |

---

## Setup & Commands

**Prerequisites:** Node.js 18+

```bash
# Clone the repository
git clone https://github.com/Abmisar/DocuPilot.git
cd DocuPilot

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev          # http://localhost:3000

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Folder Structure

```
DocuPilot/
├── documentation/                 # Project docs and presentation guide
│   ├── PRESENTATION-GUIDE.md     # Demo script, talking points, Q&A prep
│   └── PROJECT-DOCUMENTATION.md  # This file
├── public/                        # Static assets
├── src/
│   ├── app/                       # Pages + API routes (see Architecture section)
│   ├── components/                # Shared UI components
│   ├── lib/                       # AI, database, and RAG utilities
│   └── styles/                    # CSS design tokens and layouts
├── supabase/                      # Supabase configuration
├── .env.local.example             # Environment variable template
├── CLAUDE.md                      # AI assistant instructions
├── AGENTS.md                      # Subagent guidelines
├── AI_Context.md                  # Legacy AI context (see this file instead)
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Demo Scenario

**Company:** A software house operating in Saudi Arabia
**Client:** Al Waha Clinics
**Project:** Clinic Booking Platform (NEX-2024-082)

**Demo flow:**

1. **SRS Generator** — Paste the Arabic client request describing a clinic booking system. AI generates a complete SRS with project brief, 5 user roles, 12 features, 18 functional requirements, MVP phases, and flags 4 missing questions. Confidence: 78%.

2. **Scope Guard** — A week later, the client asks for a mobile app (iOS + Android). DocuPilot detects this is out of scope, shows timeline/cost impact, and auto-generates Change Request CR-2026-014 with signature fields.

3. **Ask DocuPilot** — The PM's manager asks "What are the payment milestones?" DocuPilot retrieves the relevant contract clauses and answers with source citations.

4. **Dashboard** — All AI activity surfaces: SRS generated, scope deviation detected, contract risks flagged. Smart alerts recommend next actions.

---

## Product Vision & Roadmap

### Completed

- [x] Full UI prototype (9 pages, all interactive)
- [x] SRS Generator with live Gemini AI
- [x] Ask DocuPilot with RAG (document upload, embedding, Q&A)
- [x] Document ingestion pipeline
- [x] Supabase persistence (non-blocking)
- [x] Arabic/English bilingual support
- [x] Design system with CSS custom properties

### Planned (Priority Order)

1. **Wire remaining mock pages** — Contract extraction, Scope Guard, Invoice analysis, Risk assessment with real Gemini AI
2. **Cross-module intelligence** — SRS feeds Scope Guard, contracts cross-reference invoices, risks aggregate from all sources
3. **Project CRUD** — Real project creation, listing, and management
4. **PDF export** — Generate downloadable SRS, contract reports, change requests
5. **Authentication** — Supabase Auth with team roles (Owner, Admin, PM, Viewer)
6. **Executive reports** — AI-generated project status summaries for stakeholders

### Business Model

- **Starter:** $49/team/month — Core AI modules (SRS, Scope Guard)
- **Pro:** $149/team/month — Cross-module intelligence, PDF export, analytics
- **Enterprise:** Custom — SSO, audit trail, dedicated support

### Market

- **TAM:** 50,000+ software companies in MENA region
- **Key differentiator:** Arabic-first AI that understands software house workflows
- **Comparable companies:** Monday.com ($11B), Notion ($10B) — neither serves Arabic markets or specializes in software delivery operations

---

## License

Private project. All rights reserved.
