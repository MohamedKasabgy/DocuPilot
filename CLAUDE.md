# DocuPilot — AI Operations Platform

## Project Overview

DocuPilot is a portfolio-grade SaaS dashboard for software companies to manage projects, contracts, invoices, and requirements. It uses AI (Google Gemini) to transform client requests (including Arabic) into structured SRS documents, detect scope creep, and generate smart alerts. Data is persisted to Supabase.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Google Gemini AI (`@google/genai`) · Supabase · Zod 4 · Font Awesome 6 · Google Fonts (Inter + Outfit)

**Target audience:** Software house operations teams (project managers, admins).

## Architecture

```
src/
├── app/                        # Next.js App Router pages
│   ├── api/ai/
│   │   ├── srs/route.ts       # ✅ LIVE — Gemini SRS generation + refinement
│   │   ├── contract/route.ts  # Mock — planned Gemini integration
│   │   ├── invoice/route.ts   # Mock — planned Gemini integration
│   │   ├── scope/route.ts     # Mock — planned Gemini integration
│   │   └── template.ts        # Shared route template
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
│   │   ├── gemini.ts          # Gemini client singleton + model config
│   │   ├── schemas/srs.ts     # Zod schema + JSON schema for structured output
│   │   └── prompts/srs.ts     # System context + prompt builders (generation & refinement)
│   └── db/
│       └── supabaseAdmin.ts   # Supabase server client
├── components/
│   ├── common/                # Reusable UI (Card, MetricCard)
│   └── layout/                # Sidebar, Header
└── styles/
    ├── index.css              # Design tokens (CSS custom properties)
    ├── layout.css             # App shell, sidebar, grid layouts
    └── components.css         # Card, button, badge, form styles
```

## AI Integration (Gemini)

The SRS Generator is fully wired to Google Gemini with structured JSON output:

- **Model:** Configured via `GEMINI_FAST_MODEL` env var (default: `gemini-2.5-flash`)
- **Structured output:** Uses `responseMimeType: "application/json"` + `responseSchema` for reliable parsing
- **Validation:** Zod 4 schema validates every response before rendering
- **Prompt system:** Rich system context in `src/lib/ai/prompts/srs.ts` — includes DocuPilot platform knowledge, downstream dependencies, technical stack context, and Middle Eastern client patterns
- **Refinement flow:** Same API route handles both initial generation (`clientRequest`) and iterative refinement (`currentSrs` + `refinementMessage`)
- **Persistence:** Non-blocking Supabase writes to `srs_documents` and `ai_outputs` tables — DB failures don't break the AI response

### Adding new AI modules

Follow the SRS pattern:
1. Create schema in `src/lib/ai/schemas/<module>.ts` (Zod + hand-written JSON schema)
2. Create prompts in `src/lib/ai/prompts/<module>.ts` (include `SYSTEM_CONTEXT`)
3. Create route in `src/app/api/ai/<module>/route.ts`
4. Zod 4 is NOT compatible with `zod-to-json-schema` — write JSON schemas manually

## Database (Supabase)

- **Client:** `src/lib/db/supabaseAdmin.ts` — uses `SUPABASE_SERVICE_ROLE_KEY` with fallback to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **Tables in use:** `srs_documents`, `ai_outputs`
- **Pattern:** Non-blocking persistence — wrap DB calls in try/catch, log errors, never fail the API response because of a DB issue

## Environment Variables

Stored in `.env.local` (gitignored). See `.env.local.example` for required vars:

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google AI Studio API key |
| `GEMINI_FAST_MODEL` | No | Model ID (default: `gemini-2.5-flash`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role key (recommended for server-side) |

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

## Planned Integrations (not yet implemented)

- **Scope Guard AI** — Contract deviation detection via Gemini (route stub exists)
- **Contract Extraction** — AI-powered contract parsing (route stub exists)
- **Invoice AI** — Smart invoice generation (route stub exists)
- **PDF export** — SRS and invoice document generation
- **Authentication** — User roles (Admin, PM, Viewer)
- **Ask DocuPilot** — General AI assistant page (page exists, no AI backend yet)

## Style Guide for Code

- TypeScript strict mode. Explicit types for component props (interfaces, not `type`).
- Path alias: `@/*` maps to `./src/*`.
- No barrel files. Import directly from the component file.
- Inline styles are acceptable for one-off layout tweaks in page components. Extract to CSS classes if reused 3+ times.
- Keep page components self-contained — each page file should be readable top-to-bottom without jumping between files.

@AGENTS.md
