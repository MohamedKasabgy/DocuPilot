# DocuPilot — AI Operations Platform

## Project Overview

DocuPilot is a portfolio-grade SaaS dashboard for software companies to manage projects, contracts, invoices, and requirements. It uses AI to transform client requests (including Arabic) into structured SRS documents, detect scope creep, and generate smart alerts.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Font Awesome 6 · Google Fonts (Inter + Outfit)

**Target audience:** Software house operations teams (project managers, admins).

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/ai/            # AI route handlers (mock — Gemini integration planned)
│   ├── page.tsx           # Dashboard (operational overview)
│   ├── srs-generator/     # AI SRS document generation
│   ├── scope-guard/       # Contract deviation detection
│   ├── contracts/         # Contract management
│   ├── invoices/          # Invoice tracking
│   ├── approvals/         # Approval workflows
│   ├── projects/          # Project portfolio
│   └── risks/             # Risk register
├── components/
│   ├── common/            # Reusable UI (Card, MetricCard)
│   └── layout/            # Sidebar, Header
└── styles/
    ├── index.css          # Design tokens (CSS custom properties)
    ├── layout.css         # App shell, sidebar, grid layouts
    └── components.css     # Card, button, badge, form styles
```

## Critical Rules

1. **Read Next.js 15 docs first.** This is Next.js 15 with App Router — `node_modules/next/dist/docs/` has the authoritative guide. Do NOT rely on training data for Next.js APIs.
2. **No database yet.** All data is currently static/mock. API routes return placeholder responses for future Gemini API integration.
3. **CSS architecture is custom properties + utility classes.** Design tokens live in `src/styles/index.css`. Use existing CSS variables (`--accent-primary`, `--spacing-md`, `--radius-lg`, etc.) — do NOT hardcode colors or spacing.
4. **Dark sidebar, light content area.** The sidebar uses `--bg-sidebar` (dark slate). Main content uses `--bg-main` (off-white). Maintain this contrast.
5. **Arabic/RTL support matters.** Client input examples are in Arabic. Use `dir="rtl"` on Arabic text blocks. The app detects language and displays bilingual content.
6. **Font Awesome for icons.** Use `fa-solid fa-*` / `fa-regular fa-*` classes. Do NOT add lucide-react icons or SVGs unless explicitly asked.
7. **No env secrets in code.** `GEMINI_API_KEY` will come from `.env.local` — never commit it.

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
- **Client Components:** Only when needed (`'use client'` — e.g., Sidebar uses `usePathname`).
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

- **Gemini API** — AI document generation, scope analysis, contract extraction
- **PDF export** — SRS and invoice document generation
- **Authentication** — User roles (Admin, PM, Viewer)
- **Database** — Project/contract/invoice persistence

## Style Guide for Code

- TypeScript strict mode. Explicit types for component props (interfaces, not `type`).
- Path alias: `@/*` maps to `./src/*`.
- No barrel files. Import directly from the component file.
- Inline styles are acceptable for one-off layout tweaks in page components. Extract to CSS classes if reused 3+ times.
- Keep page components self-contained — each page file should be readable top-to-bottom without jumping between files.

@AGENTS.md
