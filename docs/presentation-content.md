# DocuPilot — Presentation Content Package
> Generated from live codebase scan · 2026-05-05
> All features described are verified against the repository. Planned features are explicitly marked.

---

## Slide 00 — Cover

### Slide Text
**DocuPilot**
*From Documents to Decisions*

AI-powered operations platform that turns contracts, invoices, and client requests into structured decisions — instantly.

### Speaker Notes
Start with confidence. "This is DocuPilot. Every software company drowns in documents — contracts, invoices, scope changes, client requests. DocuPilot turns all of that into clear, structured decisions using AI. Let me show you how."

### Visual Suggestion
Full-screen dark background (#0F172A) with the DocuPilot logo centered. Tagline in Outfit font. Subtle animated gradient or flowing document-to-dashboard visual underneath.

### Demo Moment
N/A — title slide.

---

## Slide 01 — The Problem

### Slide Text
**Software companies are buried in documents.**

- A PM receives a contract. Key deadlines are buried in legal language.
- A client sends a vague request. No one knows if it's in scope.
- An invoice arrives. No one checks if it matches the contract.
- Decisions pile up. Nothing moves.

**The result:** Delayed projects. Missed obligations. Budget overruns. Scope creep.

### Speaker Notes
"Here's the real problem. A project manager at a software house receives dozens of documents every week — contracts, invoices, client emails, scope requests. Reading them carefully takes hours. Missing something costs thousands. And nobody has a system for this — they're using email threads, shared drives, and memory. That's a broken workflow."

### Visual Suggestion
Split visual: left side shows a chaotic inbox with documents (PDF icons, email, Word files). Right side shows a red warning: "Deadline Missed · Scope Creep Detected · Invoice Mismatch." Clean contrast between chaos and consequence.

### Demo Moment
N/A — problem setup slide.

---

## Slide 02 — The Solution

### Slide Text
**DocuPilot helps software operations teams eliminate document chaos by transforming every contract, invoice, and client request into structured decisions — through AI-powered analysis with zero manual effort.**

- Upload a contract → get risks, deadlines, obligations in seconds.
- Receive a client request → know instantly if it's in scope.
- Review an invoice → AI checks it against your contract automatically.
- Everything feeds a live operations dashboard.

### Speaker Notes
"DocuPilot sits between your documents and your decisions. You upload or paste a document, and our AI — powered by Google Gemini — returns a structured analysis: what are the risks, what's the scope, what needs approval. No more reading legal documents line by line. The system does it, and it tells you what to do next."

### Visual Suggestion
Single clean diagram: three document icons (Contract, Invoice, Client Request) → DocuPilot AI Engine → three output cards (Risk Alert, Approval Needed, Scope Change). Use brand blue (#2563EB) and violet (#7C3AED) for the AI engine node.

### Demo Moment
N/A — concept slide. Transition to demo next.

---

## Slide 03 — Product Idea

### Slide Text
**What is DocuPilot?**

DocuPilot is an AI operations platform built for software houses and digital agencies. It reads your contracts, analyzes your invoices, detects scope creep in client requests, and generates SRS documents from raw ideas — all powered by Google Gemini with built-in fallbacks. The result is a live dashboard that tells your team exactly what needs attention, what needs approval, and what to do next.

### Speaker Notes
"Think of DocuPilot as an AI-powered operations co-pilot for your project managers. It doesn't replace them — it reads everything they don't have time to read, and surfaces the decisions that matter. It understands contracts, it detects risk, it generates professional software requirements — and it works with Arabic too, because we built it for the Middle Eastern market from day one."

### Visual Suggestion
Clean product screenshot of the Dashboard page (top section) showing the operations overview with project health cards and priority decision alerts. Add a caption: "Live AI · Google Gemini · Built for MENA."

### Demo Moment
Show the dashboard briefly.

---

## Slide 04 — Demo Story

### Slide Text
**Meet NexaSoft.**

NexaSoft is a software house managing the Clinic Booking Platform project for their client, Al Waha Clinics.

Today they received:
- A new service agreement (contract)
- An invoice from their UI vendor
- A client message: *"Can you add a mobile app too?"*

**Let's see how DocuPilot handles all three — in under 5 minutes.**

### Speaker Notes
"Our demo uses a real scenario we built into the product. NexaSoft — a software house — is managing a clinic booking platform. They've just received a contract, an invoice, and a client asking for something new. Instead of spending an afternoon on these, their PM opens DocuPilot. I'll walk you through what happens."

### Visual Suggestion
Illustrated timeline: NexaSoft logo → three document cards (Contract, Invoice, Client Request) → DocuPilot logo → three outcome cards (Risk Report, Approved, Scope Denied). Clean, horizontal flow.

### Demo Moment
Begin live demo sequence — start at Dashboard, then walk through each module.

---

## Slide 05 — AI Usage

### Slide Text
**How AI works inside DocuPilot:**

| What you give it | What AI does | What you get |
|---|---|---|
| Contract PDF | Extracts scope, deadlines, obligations, risks | Structured risk report + auto-alerts |
| Client request (text/Arabic) | Classifies scope, assesses impact | In-scope / Out-of-scope + client reply |
| Invoice text | Checks against contract, detects duplicates | Approval recommendation + escalation chain |
| Project brief | Generates structured SRS document | 18+ requirements, user roles, MVP scope |
| Any document | Chunks + embeds into RAG index | Answer any question about your documents |

**AI Provider:** Google Gemini (primary) → Gemini fallback → Qwen → local fallback
**Never crashes. Always responds.**

### Speaker Notes
"Every AI feature in DocuPilot uses Google Gemini with structured JSON output — not summaries, not prose, but machine-readable data that drives the UI and backend. If Gemini is unavailable, we fall back to a secondary Gemini model, then to Alibaba's Qwen, then to a hardcoded safe response. The system never crashes. It always returns something useful."

### Visual Suggestion
Vertical pipeline diagram: User Input → Gemini API → Zod Schema Validation → Structured Output → Dashboard/Database. Show the fallback chain as a dotted branching path on the right. Use violet (#7C3AED) for the AI layer.

### Demo Moment
Highlight the "AI powered by Gemini" badge visible on analysis results (source indicator shown in routes).

---

## Slide 06A — Feature: Contract Analyzer

### Slide Text
**Contract Analyzer**
*Read a 20-page contract in 3 seconds.*

- Upload PDF or paste contract text
- AI extracts: scope, deadlines, payment terms, obligations, risks
- Automatically flags high-severity risks as alerts
- Suggests actions: create task, draft amendment, notify manager
- Works with English and Arabic contracts

**Status: Live**

### Speaker Notes
"The Contract Analyzer is fully live. You drop in a PDF or paste contract text. In seconds, you get every deadline on a countdown card, every obligation categorized, every risk flagged with severity. High-severity risks automatically create alerts in the dashboard. No more reading legal language — the system does it."

### Visual Suggestion
Screenshot of the Contracts page showing the analysis result: deadline countdown cards, risk list with severity badges, obligation matrix. Highlight a red "HIGH RISK" badge.

### Demo Moment
**Live demo:** Go to `/contracts` → upload `sample_service_agreement.pdf` or use the pre-loaded sample → click Analyze → show extracted deadlines, obligations, and auto-generated risk alerts.

---

## Slide 06B — Feature: Scope Guard

### Slide Text
**Scope Guard**
*Know in seconds if a client request is in scope.*

- Paste any client request — even in Arabic
- AI classifies: In Scope / Out of Scope / Needs Clarification
- Assesses: timeline impact, cost impact, business risk
- Generates a professional client-facing reply automatically
- Creates a change request summary if out of scope

**Status: Live**

### Speaker Notes
"Scope creep is the silent killer of software projects. A client sends a message — 'Can you add a mobile app?' — and nobody knows if that's covered. Scope Guard classifies it instantly, tells you the impact on timeline and cost, and even writes a professional reply you can send directly to the client. One click. No back-and-forth."

### Visual Suggestion
Screenshot of Scope Guard showing input: "Can you also add a mobile app for the same booking platform?" and the output: OUT OF SCOPE badge, impact cards (Timeline: High, Cost: High), client reply text, and the change request summary. 

### Demo Moment
**Live demo:** Go to `/scope-guard` → use the default request ("Can you also add a mobile app?") → click Analyze → show classification, impact badges, and client reply.

---

## Slide 06C — Feature: Invoice Analyzer

### Slide Text
**Invoice Analyzer**
*Approve invoices with confidence.*

- Paste invoice details or text
- Link to an existing contract for cross-reference
- AI checks: contract alignment, duplicate risk, amount accuracy
- Recommends approval chain (PM → Finance → Director if escalated)
- Flags mismatches before anyone pays

**Status: Live**

### Speaker Notes
"Finance teams approve invoices based on gut feel and memory. DocuPilot changes that. You paste in an invoice, link it to the contract, and the AI checks every line — is this amount in the contract? Have we paid this before? Who needs to approve this? The approval chain is automatically built based on amount and risk level."

### Visual Suggestion
Screenshot of the Invoice page showing the analysis card: contract alignment score (e.g., 92%), duplicate risk badge (None), recommended approval chain with steps highlighted, and a green "Recommend: Approve" decision.

### Demo Moment
**Live demo:** Go to `/invoices` → use the pre-loaded DesignPro Studio invoice (INV-2026-042, 6,500 SAR) → click Analyze → show alignment score, approval chain, and recommendation.

---

## Slide 06D — Feature: SRS Generator

### Slide Text
**SRS Generator**
*From client idea to structured requirements in 30 seconds.*

- Paste any client request — even informal, even in Arabic
- AI generates a full Software Requirements Specification:
  - Functional requirements
  - Non-functional requirements
  - User roles, MVP scope, assumptions, missing questions
- Supports refinement via chat ("make it more technical")
- Confidence score included

**Status: Live**

### Speaker Notes
"Writing an SRS used to take a senior BA two days. DocuPilot does it in 30 seconds. You paste the client's idea — even if it's just a few sentences in Arabic — and get a complete, structured SRS with user roles, functional requirements, MVP scope, and the questions you still need to ask the client. You can refine it by chatting with the AI."

### Visual Suggestion
Two-panel screenshot: left side shows a simple Arabic/English client request input. Right side shows the structured SRS output with sections (Functional Requirements: 18 items, User Roles: 5, MVP Scope, Missing Questions).

### Demo Moment
**Live demo:** Go to `/srs-generator` → use the Arabic sample request or type a new one → click Generate → show the structured output with confidence score.

---

## Slide 06E — Feature: Ask DocuPilot (RAG)

### Slide Text
**Ask DocuPilot**
*Your AI assistant that actually knows your project.*

- Upload any document: contract, meeting notes, proposal
- Ask questions in plain language
- AI retrieves relevant context using vector search and answers accurately
- Cites sources
- "What are the payment milestones in the Al Waha contract?"

**Status: Live (auth is demo-mode)**

### Speaker Notes
"Ask DocuPilot is a Retrieval-Augmented Generation system. You upload your project documents — contracts, meeting notes, SRS files — and then ask questions. The AI searches through your documents using vector embeddings, finds the relevant sections, and gives you a precise answer with source citations. It's like having a PM who has read every document and remembers everything."

### Visual Suggestion
Screenshot of the Ask DocuPilot chat interface showing a question ("What are the payment milestones?") and a structured answer with source reference to the contract. Clean chat UI.

### Demo Moment
**Live demo:** Go to `/ask-docupilot` → upload a short document or use pre-indexed content → ask "What are the payment milestones?" → show AI answer with source.

---

## Slide 06F — Feature: Operations Dashboard

### Slide Text
**Operations Dashboard**
*One view. Every decision.*

- Live aggregation from all AI modules
- Project health scorecards (health score, risk level, ROI)
- Priority decisions queue (build, approve, escalate, scope change)
- Financial insights (pending approvals, budget status)
- Scope impact summary
- Next best actions — what to do right now

**Status: Live (reads from Supabase or demo fallback)**

### Speaker Notes
"The dashboard is the command center. Every analysis from every module feeds into it — contracts, invoices, scope decisions, risks. A PM opens DocuPilot in the morning and immediately sees: what needs my attention, what's at risk, what approvals are waiting. It's not a report — it's a decision engine."

### Visual Suggestion
Full-width dashboard screenshot showing health scorecards, priority decisions column, financial metrics, and next actions panel. Annotate with arrows pointing to each section.

### Demo Moment
**Live demo:** Open the Dashboard → point to Al Waha Clinics project health card → show the decision queue → highlight a "Scope Change Required" alert.

---

## Slide 06G — Features: Planned (Future)

### Slide Text
**Coming Next**

| Feature | Status |
|---|---|
| Real authentication & user roles | Planned |
| Multi-tenant workspace (multiple projects) | Planned |
| Approvals write-back to database | Planned |
| Risk register persistence | Planned |
| PDF export (SRS, contracts, reports) | Planned |
| Mobile companion app | Future |

*Current auth is demo-mode. Approval and risk write paths are UI-only.*

### Speaker Notes
"I want to be transparent about what's next. Authentication is currently in demo mode — users are mocked. The approvals interface is polished but doesn't write back to the database yet. These are the next sprint priorities. The AI and analysis layer is fully production-ready."

### Visual Suggestion
Clean two-column table or checklist: green checkmarks for live features, blue clock icons for planned. Honest and professional.

### Demo Moment
N/A — honesty/roadmap slide.

---

## Slide 07 — Competitive Advantage

### Slide Text
**Why not just use ChatGPT?**

| | ChatGPT / Claude | DocuPilot |
|---|---|---|
| Output format | Prose text | Structured JSON → dashboard |
| Context awareness | No memory | Knows your contracts + SRS |
| Workflow integration | None | Auto-alerts, approval chains, risk register |
| Arabic support | Generic | Prompt-native Arabic + bilingual |
| Fallback system | Single provider | Gemini → Qwen → local |
| Audience | General | Software operations teams |
| Deployment | Cloud only | Cloud or private (roadmap) |

**DocuPilot is not a chatbot. It is a workflow engine with AI inside.**

### Speaker Notes
"This is the question every judge will ask: why not just use ChatGPT? Here's the answer. ChatGPT gives you text. DocuPilot gives you structured data that drives your dashboard, creates alerts, builds approval chains, and persists to a database. It's not a prompt box — it's a system. And it's built specifically for software operations teams in the MENA region."

### Visual Suggestion
Clean comparison table with checkmarks/crosses. Highlight the "DocuPilot" column in brand blue. Add a bold footer: "Not a chatbot. A workflow engine."

### Demo Moment
N/A — competitive positioning slide.

---

## Slide 08 — Market Size

### Slide Text
**Market Opportunity**

**TAM — Global Project Management Software Market**
$[Add from Gartner/Statista — ~$10B+ globally]
All software companies that manage projects, contracts, and client workflows.

**SAM — MENA Software & IT Services Market**
$[Add from IDC MENA or CITC report — Saudi Arabia IT services market]
Saudi Arabia: Vision 2030 digital transformation driving rapid software sector growth.

**SOM — Realistic First Target**
Saudi software houses and digital agencies (est. 500–2,000 active firms)
Priced at SaaS tiers → 100 paying teams in Year 1 is a realistic milestone.

### Speaker Notes
"We're starting in Saudi Arabia, where Vision 2030 is creating an explosion of software projects. Every government ministry, healthcare provider, and fintech startup needs a software partner. Those software partners — the NexaSofts of the region — are our first customers. From there, GCC expansion is natural. Global is the long-term horizon."

### Visual Suggestion
Three nested circle diagram (TAM/SAM/SOM) with Saudi Arabia flag or Vision 2030 branding in the center. Add a footnote: "Market numbers to be confirmed from Gartner, IDC MENA, or CITC 2024/2025 reports."

### Demo Moment
N/A — market slide.

---

## Slide 09 — Business Model

### Slide Text
**How DocuPilot generates revenue**

**SaaS Subscriptions (Primary)**

| Tier | Target | Includes |
|---|---|---|
| Starter | Freelancers / small teams | SRS Generator + Scope Guard |
| Professional | Software houses (5–20 PMs) | All modules + dashboard + RAG |
| Enterprise | Large agencies / corporations | Private deployment + custom models + SLA |

**Additional Revenue Streams**
- Per-analysis API usage (pay-as-you-go for high-volume teams)
- Private cloud deployment (enterprise, regulated industries)
- White-label licensing for consulting firms

*Exact pricing to be validated with early customers.*

### Speaker Notes
"The model is SaaS. Small teams on a starter plan, growing agencies on professional, large enterprises on a custom contract. The unit economics are strong — once a team is using DocuPilot for contract analysis and scope guard, the switching cost is high because their documents and history live inside it. We also see a path to API-based pricing for teams that want to embed this into their own tools."

### Visual Suggestion
Three clean pricing cards (Starter / Professional / Enterprise) with feature lists. Add a bar showing revenue mix: subscriptions (large), API usage (medium), enterprise (smaller but high-value).

### Demo Moment
N/A — business model slide.

---

## Slide 10 — Technical Architecture

### Slide Text
**Built to scale. Built to be reliable.**

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS 4 + Custom Design System |
| AI Provider | Google Gemini 2.5 Flash (primary) |
| AI Fallback Chain | Gemini → Gemini 2.0 → Qwen → Local |
| Validation | Zod 4 — all AI outputs schema-validated |
| Database | Supabase (PostgreSQL + pgvector) |
| Document RAG | Gemini text-embedding-004 · 768-dim vectors |
| PDF Extraction | unpdf (serverless-compatible) |
| Authentication | Planned (currently demo-mode) |
| Deployment | Vercel (edge-ready) |

**AI responses always include:** provider used · model · attempts · fallback reason

### Speaker Notes
"We chose Next.js 16 with App Router because it gives us server-side AI calls, edge deployment, and React 19's performance — all in one framework. Every AI response is validated with Zod before it touches the UI. The fallback chain means we have three providers before we ever touch static data. Supabase gives us SQL, real-time, and vector search in one platform."

### Visual Suggestion
Clean architecture diagram: Browser → Next.js App Router → API Routes → AI Layer (Gemini/Qwen/fallback) + Supabase (SQL + pgvector). Stack icons for each technology. Keep it visual, not text-heavy.

### Demo Moment
N/A — technical slide. Could show the source indicator badge ("AI · Gemini · 1 attempt") visible in the SRS result.

---

## Slide 11 — Roadmap

### Slide Text
**What's built. What's next. Where we're going.**

**Now — MVP (Current)**
✅ SRS Generator (live Gemini AI)
✅ Contract Analyzer (live Gemini AI + PDF upload)
✅ Scope Guard (live Gemini AI, Arabic support)
✅ Invoice Analyzer (live Gemini AI, contract-aware)
✅ Ask DocuPilot (RAG — live Gemini embeddings)
✅ Operations Dashboard (live data aggregation)
✅ AI Reliability Chain (Gemini → Qwen → local)

**Next — Post-Bootcamp**
🔵 Real authentication + user roles (PM, Admin, Viewer)
🔵 Approvals write-back + audit log
🔵 Risk register persistence + tracking
🔵 Multi-project workspace selector
🔵 PDF export (SRS, reports, contracts)

**Future — Growth Phase**
⬜ Native Arabic UI
⬜ Mobile companion app
⬜ ERP / Jira / Slack integrations
⬜ Private cloud / on-premise deployment
⬜ Custom AI model fine-tuning on client data

### Speaker Notes
"In the current sprint we focused on making every AI module production-quality — reliable fallbacks, schema validation, graceful degradation. The next sprint is about closing the workflow loops: real auth, approvals that actually save, risk tracking that persists. Then we expand — Arabic UI, integrations, private deployment for regulated industries."

### Visual Suggestion
Three-column timeline (Now / Next / Future) with color-coded icons. Green checks for Now, blue for Next, gray for Future. Clean, professional, not overpromised.

### Demo Moment
N/A — roadmap slide.

---

## Slide 12 — Closing

### Slide Text
**DocuPilot**

Every document is a decision waiting to happen.
We built the AI that makes it happen in seconds.

**The ask:**
We're looking for early adopters, mentors, and feedback from the software industry.

*Built with Google Gemini · Deployed on Vercel · Backed by Supabase*
*docupilot.site*

### Speaker Notes
"Every software company is sitting on a pile of documents that should be informing decisions but aren't. DocuPilot is the system that connects them. We built it in [bootcamp duration], it's live, it works, and it handles Arabic. We're ready to take it to the first paying customers. If you're running a software house or know someone who is — we'd love to talk. Thank you."

### Visual Suggestion
Full-screen dark background (matching cover slide). DocuPilot logo centered. Tagline below: "From Documents to Decisions." Website URL: docupilot.site. Bottom strip: Gemini · Vercel · Supabase logos.

### Demo Moment
Return to the Dashboard for a final look — full screen, no talking. Let the product speak.

---

## Appendix: Missing Items Checklist

The following items must be sourced or created before final presentation:

### Market Numbers (Slide 08)
- [ ] **TAM:** Global project management software market size (2024/2025) — Source: Gartner or Statista
- [ ] **SAM:** MENA/Saudi Arabia IT services and software development market — Source: IDC MENA, CITC Annual Report, or MCIT
- [ ] **SOM:** Estimate of active Saudi software houses and digital agencies — Source: ZATCA business registry, LinkedIn company search, or industry association data

### Screenshots / Visuals (Slides 06A–06F)
- [ ] High-res screenshot of Dashboard (priority decisions section)
- [ ] High-res screenshot of Contract Analyzer result (deadlines + risk badges)
- [ ] High-res screenshot of Scope Guard with OUT OF SCOPE result
- [ ] High-res screenshot of Invoice Analyzer with approval chain
- [ ] High-res screenshot of SRS Generator output
- [ ] High-res screenshot of Ask DocuPilot chat
- [ ] Screen recording of full demo flow (2–3 minutes, no audio needed for background loop)

### Branding
- [ ] Final DocuPilot logo (SVG format)
- [ ] Canva template with brand colors (#2563EB, #7C3AED, #0F172A)
