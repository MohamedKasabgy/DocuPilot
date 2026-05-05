# DocuPilot — Presentation Guide

A slide-by-slide deck plan for Canva, with speaker notes, demo flow, what to emphasize, what **not** to claim, a backup plan, and a Q&A appendix.

> Tagline used throughout: **From Documents to Decisions.**

---

## Deck Structure (20 slides)

Each slide block contains: **Goal · On-screen · Speaker notes · Avoid claiming**.

### Slide 1 — Title

- **Goal:** Set the tone in five seconds.
- **On-screen:** "DocuPilot" wordmark · "From Documents to Decisions." · subtitle: "AI operations layer for software companies and service businesses." · presenter names.
- **Speaker notes:** "DocuPilot is an AI operations layer. It turns the documents your team already produces — client requests, contracts, invoices, scope changes — into decisions, approvals, risks, and alerts."
- **Avoid:** Calling it a chatbot, calling it a document chat tool, claiming it is production-ready.

### Slide 2 — The Problem

- **Goal:** Anchor the pain.
- **On-screen:** Four bullets — "Requirements unclear at project start" · "Contracts signed, obligations untracked" · "Invoices approved without context" · "Silent scope creep."
- **Speaker notes:** "Software houses don't lose control because they lack documents. They lose control because documents don't automatically become actions."
- **Avoid:** Specific customer names you cannot back up.

### Slide 3 — Target Users

- **Goal:** Who pays for this.
- **On-screen:** Software houses, agencies, service businesses · Project managers, ops leads, founders.
- **Speaker notes:** "Companies between 10 and 200 people running multiple client engagements at once."
- **Avoid:** Saying "enterprises" — DocuPilot is not enterprise-ready.

### Slide 4 — Product Today

- **Goal:** Reposition the product correctly.
- **On-screen:** "DocuPilot is an AI operations hub — not generic document chat." Side-by-side comparison: ChatGPT (one-off answers) vs DocuPilot (structured, persistent, connected).
- **Speaker notes:** "ChatGPT can summarize one document in one chat. DocuPilot extracts obligations, payments, deadlines, and risks, validates them, persists them, and connects them to a project. The output is operational state, not prose."
- **Avoid:** Claiming a Jira/Notion replacement.

### Slide 5 — Main Workflow

- **Goal:** One-line mental model of the product.
- **On-screen:** Single horizontal arrow: **Client Request → SRS → Contract → Invoice → Scope Guard → Risks → Dashboard → Ask DocuPilot.**
- **Speaker notes:** "This is the loop. Every demo, every screen, every API route maps onto this loop."
- **Avoid:** Adding modules that don't exist (no HR, no accounting, no payments).

### Slide 6 — Demo Scenario: NexaSoft × Al Waha Clinics

- **Goal:** Pin the story.
- **On-screen:** Software house: NexaSoft · Client: Al Waha Clinics · Project: Clinic Booking Platform · Goal: web booking + admin dashboard + appointments + payments + notifications.
- **Speaker notes:** "Throughout the demo we'll watch NexaSoft run this project through DocuPilot end-to-end."
- **Avoid:** Inventing extra clients in the same demo.

### Slide 7 — Walkthrough: Dashboard

- **Goal:** Show the operational hub.
- **On-screen:** Dashboard screenshot (`qa-dashboard.png` if available).
- **Speaker notes:** "This is the operations cockpit — decisions, project health, financials, scope impact, next actions. Data is loaded server-side and falls back gracefully when the database is empty, so the demo never goes blank."
- **Demo line during click:** "We'll come back here at the end so you can see how the alerts and decisions update."
- **Status to call out:** Live data loader (`source: "live" | "fallback" | "mixed"`).

### Slide 8 — Walkthrough: Projects / Workspace

- **Goal:** Show the connecting tissue.
- **On-screen:** Projects page screenshot.
- **Speaker notes:** "Every AI output across DocuPilot is tied to a project. The workspace is where contracts, SRS, invoices, scope analyses, and alerts live together."
- **Status to call out:** Live UI; data is mostly seeded today (clearly label as "demo data").

### Slide 9 — Walkthrough: SRS Generator (LIVE)

- **Goal:** First "wow" moment.
- **On-screen:** SRS Generator screenshot (`qa-srs.png`).
- **Speaker notes:** "Paste an Arabic or English client request, get a structured SRS — project brief, user roles, features, functional and non-functional requirements, missing questions, MVP scope, assumptions, confidence score. Then refine it via chat."
- **What it really does:** Calls Gemini with a strict response schema, validates with Zod, persists to Supabase. Falls back to Qwen, then a hand-crafted local SRS if everything fails.
- **Status to call out:** ✅ Live AI.

### Slide 10 — Walkthrough: Contracts (LIVE)

- **Goal:** Show document → operations conversion.
- **On-screen:** Contracts page screenshot with extraction results.
- **Speaker notes:** "Drop a contract PDF, click *Run AI Extraction*, and DocuPilot pulls scope, deliverables, payment milestones, deadlines, obligations, risks, and suggested actions — each with the source quote from the contract. High-priority risks become alerts in the database."
- **What it really does:** PDF text extracted server-side via `unpdf`, sent to Gemini with a structured response schema, validated with Zod, persisted to `contract_analyses` + `alerts` + `ai_outputs`.
- **Status to call out:** ✅ Live AI; PDF upload now wired.

### Slide 11 — Walkthrough: Invoices & Approvals

- **Goal:** Show financial operations.
- **On-screen:** Invoices page screenshot.
- **Speaker notes:** "Invoice analysis checks alignment with the linked contract, flags duplicates, and recommends an approval action — approve, review, escalate, or reject. The Approvals page is the surface where humans act on those recommendations."
- **Status to call out:** Invoices ✅ live AI. Approvals page is UI-only today — say so. "We persist invoice analyses; the approval click-through is the next thing we'll wire up."

### Slide 12 — Walkthrough: Scope Guard (LIVE)

- **Goal:** Best demo moment.
- **On-screen:** Scope Guard screenshot (`qa-scope.png`) with the question "Can you also add a mobile app?"
- **Speaker notes:** "A client asks for a mobile app. DocuPilot compares it against the stored SRS and contract scope, classifies it as in-scope, out-of-scope, or needs clarification, estimates timeline, cost, business, and risk impact, and writes a high-risk alert if the impact is severe."
- **Status to call out:** ✅ Live AI; auto-creates alerts.

### Slide 13 — Walkthrough: Risk Radar

- **Goal:** Show the aggregation layer.
- **On-screen:** Risks page screenshot.
- **Speaker notes:** "Every risk extracted by SRS, contract analysis, invoice analysis, or scope guard lands here as an alert. Risk Radar is the page; the alerts table is the data."
- **Status to call out:** Page is UI-driven today; alerts are populated by the live modules. Be honest: "The risk page is read-only in this build — the next iteration adds inline triage."

### Slide 14 — Walkthrough: Ask DocuPilot

- **Goal:** Show the future of project memory — honestly.
- **On-screen:** Ask DocuPilot screenshot.
- **Speaker notes:** "Ask DocuPilot is a Retrieval-Augmented chat over the project's documents. We chunk and embed every uploaded contract or brief into pgvector, then ground answers in the actual sources, augmented with the project's latest SRS and contract analysis."
- **Status to call out:** ✅ Backend live (RAG over pgvector + Gemini + `text-embedding-004`). Auth is mocked. The assistant only answers from documents that have been ingested — without ingestion it correctly responds *"not enough information"*. **Only demo this slide live if you have pre-ingested documents in your Supabase instance.**

### Slide 15 — Technical Architecture

- **Goal:** Convince the technically literate judge.
- **On-screen:** Stack diagram — Next.js 16 App Router + React 19 + TypeScript on top; Server Components and route handlers in the middle; Gemini + Qwen + Zod + Supabase + pgvector + `unpdf` underneath.
- **Speaker notes:** "Server Components for read paths, route handlers for AI calls. Every AI response goes through a reliability wrapper, a JSON extractor, an output normalizer, and a Zod schema before it ever reaches the UI or the database."

### Slide 16 — AI Architecture & Fallback

- **Goal:** Show the demo-safety design.
- **On-screen:** Pipeline — `prompt → Gemini primary → Gemini fallback model → Qwen → local fallback object → Zod validate → non-blocking persistence → response with provider telemetry`.
- **Speaker notes:** "We assume providers fail. Every module has a hand-crafted fallback that matches the demo persona, so the UI never breaks. Every response carries `providerUsed`, `usedFallback`, `attempts`, and `errorCode` so we can debug live."

### Slide 17 — Market Opportunity (Saudi → GCC)

- **Goal:** Position the wedge.
- **On-screen:** Saudi Arabia Vision 2030 IT spend · estimated count of SMB software houses in KSA · GCC expansion arrows.
- **Speaker notes:** "Saudi software houses already operate bilingually. Our SRS generator and scope guard handle Arabic input natively. Once we win in KSA, the same product unlocks the wider GCC — UAE, Qatar, Bahrain, Oman, Kuwait — without rebuilding the AI layer."
- **Avoid:** Quoting market sizes you cannot cite.

### Slide 18 — Business Model / SaaS Positioning

- **Goal:** Make it sound like a real B2B SaaS.
- **On-screen:** Per-team monthly pricing tiers (e.g. Starter / Growth / Studio), per-workspace seat count, optional add-ons (storage, RAG ingestion volume).
- **Speaker notes:** "Per-team SaaS, billed monthly. Onboarding is free for the demo period. The wedge is software houses; the expansion play is service businesses with similar contract + invoice + scope dynamics."
- **Avoid:** Naming specific dollar figures unless the team agreed on them.

### Slide 19 — Roadmap

- **Goal:** Show direction without overpromising.
- **On-screen:** Three columns — Now (demo) / Next (post-demo) / Later (12+ months).
  - Now: SRS, Contracts (with PDF), Invoices, Scope Guard, Project Intelligence, Dashboard, Ask DocuPilot RAG.
  - Next: Auth + workspaces, Approvals/Risk write paths, multi-project selectors, refresh-safe rehydration, production OCR.
  - Later: Calendar/email/WhatsApp, accounting export, audit logs, broader GCC localization.

### Slide 20 — Closing / Ask

- **Goal:** End on a memorable line and a clear ask.
- **On-screen:** "From Documents to Decisions." · the demo URL · contact info · the ask (pilot customers, mentor intros, follow-on funding — pick one).
- **Closing line (memorize this):** *"Documents don't run companies. Decisions do. DocuPilot makes the jump."*

---

## Live Demo Flow (5–7 minutes)

Hit these in order. Skip anything that breaks.

1. **Dashboard** (15s) — point at decisions and project health.
2. **SRS Generator** (60s) — paste a short client request, generate, then send one refinement message.
3. **Contracts** (90s) — drop the sample PDF or click *Use sample*, run extraction, point at risks and suggested actions.
4. **Invoices** (45s) — open the seeded invoice, run analysis, call out duplicate risk + approval recommendation.
5. **Scope Guard** (60s) — submit *"Can you also add a mobile app for the booking platform?"*; point at the in/out classification and the auto-created alert.
6. **Risk Radar** (15s) — show aggregated risks.
7. **Dashboard** (15s) — return to show updated decisions and alerts.
8. **Ask DocuPilot** (45s) — only if you have pre-ingested documents. Otherwise skip and point to the slide.

---

## What to Say During the Walkthrough

- "Notice this is real AI output, not a hardcoded card." (When the SRS or contract analysis renders.)
- "The badge in the corner tells us whether this came from Gemini, Qwen, or a local fallback. We'd rather show you a coherent fallback than a broken demo."
- "Every output you see is also writing to Supabase — `contract_analyses`, `alerts`, `ai_outputs` — so the dashboard updates in the next refresh."
- "This page is UI-only today. The data flow behind it is live, and writing the UI hooks is the next sprint."

---

## What Features to Emphasize

- The **end-to-end loop** (Slide 5) over any single feature.
- **Live, validated, structured AI output** — not chat.
- **Reliability layer** (Gemini → Qwen → local) — judges love this.
- **Arabic and bilingual handling** in SRS and Scope Guard.
- **Source quotes** in contract extraction — show the panel.
- **Auto-created high-risk alerts** in Scope Guard.

---

## What NOT to Claim

- ❌ "Production-ready SaaS." (It is a demo-ready MVP.)
- ❌ "Multi-tenant." (No real auth; `projectId` is mostly hardcoded.)
- ❌ "Full RAG over your entire company." (RAG works; coverage depends on what's been ingested.)
- ❌ "Replaces Jira/Notion/Juro." (It complements, with one connected workflow.)
- ❌ "Enterprise audit logs / RBAC / SSO." (Not implemented.)
- ❌ "Approvals are wired." (Page is UI-only today.)
- ❌ "Risk Radar lets you triage inline." (Read-only today.)
- ❌ Specific market-size or revenue numbers you can't cite live.

---

## Backup Plan If AI / API Fails

1. **Don't apologize. Don't troubleshoot live.** Move on.
2. The product is designed for this — every module has a local fallback. Refresh and the UI will render demo-quality fallback content.
3. If even the fallback doesn't render, switch to the **screenshots** (`qa-dashboard.png`, `qa-srs.png`, `qa-scope.png`) and narrate over them. Tell the audience: "We've intentionally cached this view for the demo."
4. If the dev server itself dies, present the **deck** straight through and walk through the architecture and AI fallback story instead. The reliability story actually lands harder when the network has just failed.

Pre-demo checklist:

- `.env.local` populated with at least `GEMINI_API_KEY`. Optional: `SUPABASE_*`, `QWEN_API_KEY`.
- `npm run dev` warm and a tab already open at `localhost:3000`.
- Sample contract PDF saved on the desktop.
- Screenshots downloaded locally as a fallback.
- Scope Guard prompt typed into a sticky note: *"Can you also add a mobile app for the booking platform?"*

---

## Judge Q&A Prep

**Q: How is this different from ChatGPT?**
A: ChatGPT is a chat surface. DocuPilot is an operations layer. Every AI output is structured, validated, persisted, and tied to a project — and it drives a dashboard, alerts, and approvals. Try generating an SRS in ChatGPT and watch the formatting drift between projects.

**Q: What if Gemini goes down during a customer demo?**
A: We assume providers fail. Each module falls back to Gemini's secondary model, then to Qwen, then to a hand-crafted local fallback that matches the demo persona. The reliability metadata is in every API response.

**Q: Is this multi-tenant?**
A: Not yet. Auth is the next item on the roadmap. Today the demo project is `clinic-booking-platform`. The data model already references projects everywhere, so the workspace cut is a small change.

**Q: How accurate is the AI extraction?**
A: We use Gemini's structured-output mode with a strict response schema, then validate every response with Zod before it touches the UI or DB. Confidence scores come back with each output. Anything that fails parsing falls back to a known-good shape rather than rendering garbage.

**Q: How do you handle Arabic?**
A: SRS and Scope Guard accept Arabic input natively, and prompts include bilingual instructions. The contract module handles Arabic input through Gemini directly. We surface results in English in this MVP and will add Arabic UI in the next iteration.

**Q: What about scanned contracts?**
A: Today we extract text from text-based PDFs via `unpdf`. Scanned PDFs return a clear "could not extract readable text" error. Production OCR is on the roadmap.

**Q: Is the data persisted?**
A: SRS, contract analyses, scope analyses, invoice analyses, and alerts are all persisted to Supabase when configured. Persistence is non-blocking — DB failures never break the AI response.

**Q: What's the business model?**
A: Per-team SaaS subscription with usage-based add-ons (RAG ingestion volume, storage). Pricing tiers tuned for SMB software houses in the GCC.

**Q: Why the GCC first?**
A: The Arabic-first AI handling, the contractual norms in the region, and the density of SMB software houses servicing public-sector and healthcare clients in Saudi Arabia. The product compounds across the GCC without rebuilding the AI layer.

---

## Saudi Market & GCC Expansion Angle

- **Saudi Arabia first:** Vision 2030 driving an explosion of SMB software houses servicing healthcare, fintech, government, and retail. They run client engagements bilingually. Our SRS, Scope Guard, and contract handling are designed for that operating environment from day one.
- **GCC next:** UAE, Qatar, Bahrain, Oman, Kuwait — same operating patterns, same bilingual contract reality, same scope-creep problem. Once the wedge is proven in KSA, the same product unlocks the rest of the GCC with localized templates rather than a re-architecture.
- **Why now:** Generic AI tools cannot anchor accountability. Operations leaders in the region are actively looking for an AI layer that produces structured, auditable, *bilingual* operational state — not another English-first chatbot.

---

## Closing Line

> Documents don't run companies. Decisions do. DocuPilot makes the jump.
