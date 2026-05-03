# Agent Instructions

## Next.js 15 — Breaking Changes Warning

This project uses Next.js 15 with React 19. APIs, conventions, and file structure may differ from training data. After `npm install`, read `node_modules/next/dist/docs/` before writing any Next.js code. Heed deprecation notices.

Key differences from older Next.js:
- App Router only (no `pages/` directory)
- Server Components are the default (no `"use client"` unless you need hooks/interactivity)
- `metadata` export for SEO (not `<Head>`)
- Route handlers use `export async function POST/GET` in `route.ts` files
- Dynamic params, layouts, and loading states follow App Router conventions

## Subagent Guidelines

When dispatched as a subagent:
- Skip brainstorming skills — execute the task directly.
- Use existing CSS variables from `src/styles/index.css` — never invent new color values.
- Follow the component patterns in CLAUDE.md (Card, MetricCard, Header, page structure).
- All API routes currently return mock data — maintain this pattern unless told to integrate a real API.
- Test that pages render without errors before reporting completion.
