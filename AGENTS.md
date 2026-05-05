# Agent Instructions

## Next.js 16 — Breaking Changes Warning

This project uses Next.js 16 with React 19. APIs, conventions, and file structure may differ from training data. After `npm install`, read `node_modules/next/dist/docs/` before writing any Next.js code. Heed deprecation notices.

Key differences from older Next.js:
- App Router only (no `pages/` directory)
- Server Components are the default (no `"use client"` unless you need hooks/interactivity)
- `metadata` export for SEO (not `<Head>`)
- Route handlers use `export async function POST/GET` in `route.ts` files
- Dynamic params, layouts, and loading states follow App Router conventions

## Git & Attribution Rules

- **Never add Claude/AI as a co-author or contributor.** No `Co-Authored-By` lines, no contributor mentions. Commits credit human developers only.
- Do not modify `.gitignore` to track secret files or build artifacts.

## AI Integration Guidelines

- SRS (`/api/ai/srs`), Contracts (`/api/contracts/analyze`), Invoices (`/api/ai/invoice`), Scope Guard (`/api/ai/scope`), and Project Intelligence (`/api/ai/project-intelligence`) are wired live to Gemini through `generateWithGeminiReliability` (Gemini → Qwen → local fallback). Ask DocuPilot (`/api/ask`) + RAG ingest (`/api/rag/ingest`) are also live but use mock auth helpers.
- `/api/ai/contract` is a legacy stub returning mock JSON — do not call it from new code; the real contract endpoint is `/api/contracts/analyze`.
- When adding new AI modules, follow the SRS pattern: schema (`lib/ai/schemas/`) → prompts (`lib/ai/prompts/`) → route (`app/api/ai/`) → reliability wrapper → Zod validate → non-blocking persistence + local fallback.
- Zod 4 is NOT compatible with `zod-to-json-schema`. Write JSON schemas manually.
- All AI prompts must include the shared `SYSTEM_CONTEXT` from the relevant prompts file so Gemini understands the DocuPilot platform.
- Database persistence is non-blocking — never let a Supabase error crash an AI route.

## Subagent Guidelines

When dispatched as a subagent:
- Skip brainstorming skills — execute the task directly.
- Use existing CSS variables from `src/styles/index.css` — never invent new color values.
- Follow the component patterns in CLAUDE.md (Card, MetricCard, Header, page structure).
- Mock API routes should stay mock unless explicitly told to integrate a real API.
- Test that pages render without errors before reporting completion.
