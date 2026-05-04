# DocuPilot

**From Documents to Decisions.**

DocuPilot is an AI-powered business document operations platform for software companies and service businesses. It converts contracts, invoices, client requests, SRS documents, and scope changes into structured workflows, risks, approvals, and actionable decisions — all from one operational hub.

---

## Current Project Status

> **Frontend/UI: ~80% complete.**
> The project is now transitioning from frontend implementation into backend, database, and AI integration.

All pages, navigation, and UI components are built as a high-fidelity interactive prototype. Data is currently static/mock. The next phase connects real data through API routes, a database, and Gemini AI.

> For AI coding assistants and team handoff context, read [`AI_CONTEXT.md`](./AI_CONTEXT.md) before making changes.

---

## What Has Been Built

### Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Operational overview — metrics, priorities, project health, alerts, AI-suggested next actions |
| `/projects` | Project Workspace | Per-project view with roadmap, task stream, document vault, and AI insights |
| `/srs-generator` | Smart SRS Generator | Converts client requests into structured SRS documents with bilingual (EN/AR) support |
| `/contracts` | Contract-to-Actions | Contract extraction, risk scoring, deadline tracking, and suggested actions |
| `/invoices` | Invoice Review | Invoice parsing, duplicate detection, extracted data, finance controls |
| `/approvals` | Invoice Approvals | Multi-step approval chain workflow (PM → Finance → Director → CFO) |
| `/scope-guard` | Scope Guard | Detects out-of-scope requests, generates change request documents (CR-XXXX) |
| `/risks` | Risk Radar | Risk management with severity filtering, owner assignment, and mitigation tasks |
| `/ask-docupilot` | AI Assistant | Chat interface with suggested queries, morning briefing, and data source visibility |

### Components

- **Sidebar** — Full navigation with 8 routes, New Project shortcut, and AI assistant section
- **Header** — Top bar with search, notifications, and user profile (NexaSoft Admin)
- **Card** — Reusable wrapper card component
- **MetricCard** — Stat card with value, icon, badge, and trend indicator

### Design System

- Custom CSS design tokens (`src/styles/index.css`) — colors, spacing, typography, shadows, animations
- Layout system (`src/styles/layout.css`) — sidebar, topbar, grid
- Component styles (`src/styles/components.css`) — cards, buttons, forms, badges

### API Route Stubs

Four POST endpoints exist as integration placeholders (currently return mock responses):

- `POST /api/ai/srs`
- `POST /api/ai/contract`
- `POST /api/ai/invoice`
- `POST /api/ai/scope`

---

## Current Phase

**Phase 2 — Backend & Database Setup**

The frontend prototype is mostly complete. Backend priorities for the next phase:

1. Database setup (Firestore or Supabase/PostgreSQL — TBD)
2. Core data models and schema design
3. Demo seed data for the NexaSoft / Al Waha Clinics scenario
4. Next.js API routes or server actions
5. Gemini Flash/Pro integration (replacing mock API stubs)
6. Zod validation for structured AI JSON outputs
7. Persisting AI outputs to the database
8. Connecting dashboard cards and metrics to real stored data

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Icons | lucide-react, Font Awesome 6 |
| AI (planned) | Gemini Flash / Pro |
| Database (planned) | Firebase Firestore or Supabase/PostgreSQL |
| Validation (planned) | Zod |

---

## Planned Backend Architecture

- **API layer:** Next.js API routes or server actions
- **Database:** Firebase Firestore or Supabase/PostgreSQL (decision pending)
- **AI engine:** Gemini Flash for fast extraction, Gemini Pro for complex analysis
- **Validation:** Zod schemas to enforce structured JSON output from AI
- **Storage:** Structured records per document type linked to projects and companies

---

## Data Models

Planned collections / tables:

| Model | Description |
|---|---|
| `companies` | Tenant companies using DocuPilot (e.g., NexaSoft) |
| `projects` | Client projects under each company (e.g., Al Waha Clinics) |
| `srs_outputs` | AI-generated SRS documents from client requests |
| `contracts` | Uploaded contracts with extracted obligations, risks, and deadlines |
| `invoices` | Invoices with extracted amounts, vendors, due dates, and duplicate flags |
| `approvals` | Approval chains and status per invoice |
| `risks` | Project risks with severity, owner, and mitigation tasks |
| `client_requests` | Raw client messages or change requests submitted for analysis |
| `ai_outputs` | Raw and structured AI responses linked to any document |

---

## MVP AI Features

1. **Smart SRS Generator** — Takes a client request (text or voice) and generates a structured Software Requirements Specification with functional requirements, acceptance criteria, and effort estimates
2. **Contract-to-Actions** — Analyzes a contract and extracts obligations, payment schedules, risk scores, and deadline alerts
3. **Invoice-to-Approval** — Parses invoices, detects duplicates, extracts key data, and routes through an approval chain
4. **Scope Guard** — Identifies out-of-scope requests from client messages and auto-generates a formal change request document
5. **Risk Radar** — Aggregates risks across a project with severity levels, owners, and suggested mitigations
6. **Dashboard Insights** — Surfaces key metrics, upcoming deadlines, and AI-recommended next actions across all active projects
7. **Ask DocuPilot** *(optional/future)* — Conversational AI assistant that answers questions grounded in stored project data

---

## Development Roadmap

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Frontend / UI foundation | Mostly complete (~80%) |
| Phase 2 | Backend setup, database, seed data | **Current step** |
| Phase 3 | SRS Generator AI integration | Planned |
| Phase 4 | Contract, invoice, and scope AI analysis | Planned |
| Phase 5 | Dashboard data connection | Planned |
| Phase 6 | Testing, fallback demo data, and pitch polish | Planned |

---

## Setup Instructions

**Prerequisites:** Node.js 18+

```bash
# Clone the repository
git clone <your-fork-or-repository-url>
cd DocuPilot

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Environment Variables

Create a `.env.local` file in the project root. The following variables are planned for backend/AI integration and are not yet active:

```env
# AI (Gemini)
GEMINI_API_KEY=

# Database — choose one depending on final decision
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
DATABASE_URL=
```

No environment variables are required to run the current frontend prototype.

---

## Folder Structure

```
DocuPilot/
├── public/                        # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ai/
│   │   │       ├── contract/route.ts   # POST stub — Gemini integration pending
│   │   │       ├── invoice/route.ts
│   │   │       ├── scope/route.ts
│   │   │       └── srs/route.ts
│   │   ├── approvals/page.tsx
│   │   ├── ask-docupilot/page.tsx
│   │   ├── contracts/page.tsx
│   │   ├── invoices/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── risks/page.tsx
│   │   ├── scope-guard/page.tsx
│   │   ├── srs-generator/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx              # Root layout — Sidebar, Header, metadata
│   │   └── page.tsx                # Dashboard
│   ├── components/
│   │   ├── common/
│   │   │   ├── Card.tsx
│   │   │   └── MetricCard.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   └── styles/
│       ├── index.css               # Design tokens
│       ├── layout.css              # Sidebar, topbar, grid
│       └── components.css          # Cards, buttons, forms, badges
├── AGENTS.md
├── CLAUDE.md
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Demo Scenario

**NexaSoft** is building a **Clinic Booking Platform** for **Al Waha Clinics** (Project NEX-2024-082).

DocuPilot is used to:

1. Generate a full SRS from the client's initial Arabic-language request
2. Analyze the project contract — extract payment obligations, risk scores, and deadline alerts
3. Review and route an invoice from DesignPro Studio through a 4-step approval chain, catching a duplicate
4. Flag an out-of-scope client request asking to add iOS/Android apps, and generate Change Request CR-2026-014
5. Surface 4 active risks in the Risk Radar with severity levels and mitigation tasks
6. Display all of this in the Dashboard as upcoming deadlines, health scores, and AI-recommended actions

---

## Important Notes

- All data in the current prototype is static/mock — hardcoded directly in page components.
- No authentication, database, or AI calls are active yet.
- The API routes under `/api/ai/` are stubs that return placeholder responses.
- **Ask DocuPilot** (RAG-style AI chat) should be treated as an optional feature, to be built only after the core MVP AI workflows are functional.
- Backend and AI integration are the next major step.

---

## License

Private project. All rights reserved.
