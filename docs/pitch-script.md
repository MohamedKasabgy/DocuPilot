# DocuPilot — Full Pitch Script
> Bootcamp presentation · English · Live demo included
> Estimated delivery time: 8–12 minutes with demo

---

## Before You Begin

**Setup checklist:**
- Open `docupilot.site` (or localhost:3000) in a browser, pre-loaded on the Dashboard
- Have the Contracts page ready with the sample contract loaded
- Have the Scope Guard page ready with the default mobile app request
- Have the Invoice page ready with the DesignPro Studio invoice
- Have the SRS Generator ready — clear any previous output

**Presentation tip:** Speak slowly. The AI responses take 3–5 seconds. Let the silence build anticipation. Don't fill it with nervous talk.

---

## Slide 00 — Cover

"Good [morning / afternoon / evening] everyone.

My name is [Name], and this is DocuPilot.

Here's one sentence to describe it:

*DocuPilot turns your contracts, invoices, and client requests into structured decisions — using AI — in seconds.*

Let me show you why that matters."

*[Advance slide]*

---

## Slide 01 — The Problem

"Picture a typical day at a software house.

A project manager gets a 30-page service agreement from a client. They need to know the deadlines, the payment terms, the risks. But they have three other meetings and two invoices to approve.

Then a client sends a message: 'Hey, can you also add a mobile app?' Nobody knows if that's in the contract. Nobody wants to say yes without checking, and nobody wants to say no without a reason.

Meanwhile, an invoice arrives. Finance needs to approve it. But does anyone verify if the amount matches what was agreed? Usually — no.

This happens every day, in every software company. Documents pile up. Decisions get delayed. Projects slip. Budgets overrun.

The root cause? There's no system that connects your documents to your decisions."

*[Advance slide]*

---

## Slide 02 — The Solution

"DocuPilot is that system.

You give it a document — any document — and it returns a structured decision.

Upload a contract, get every deadline on a countdown clock and every risk flagged automatically.

Receive a client request, know in two seconds if it's in scope, what it will cost, and how to reply professionally.

Submit an invoice, let AI check it against your contract before anyone signs off.

And everything — every analysis, every risk, every approval — feeds into a live operations dashboard that tells your team exactly what needs attention right now.

Let me show you."

*[Advance slide — transition into Demo Story]*

---

## Slide 03 & 04 — Product Idea + Demo Story

"The product is an AI operations platform built specifically for software houses and digital agencies. Not a generic AI chat tool — a system purpose-built for the workflows that software companies actually run every day.

For this demo, I'll use a scenario we built directly into the product.

NexaSoft is a software house. Their client is Al Waha Clinics. The project is a Clinic Booking Platform.

Today, NexaSoft received three things: a service agreement, an invoice, and a client message asking for something new.

Let me show you how DocuPilot handles all three — starting right now."

*[Open browser — go to Dashboard]*

"This is the operations dashboard. Everything you need to see is right here — project health, priority decisions, financial status, and the next best actions for your team. It reads from live data, and it's updated every time an analysis runs.

You can see Al Waha Clinics here, with a health score and a risk level — and you can see there's a decision waiting. Let's go generate it."

*[Advance to Contracts demo]*

---

## Slide 06A — Contract Analyzer (Live Demo)

*[Navigate to /contracts]*

"NexaSoft just received their service agreement. Let's analyze it.

The contract is already loaded — this is a real service agreement with scope, deliverables, deadlines, and payment milestones.

I click Analyze."

*[Click Analyze — wait for response]*

"In about three seconds, Gemini reads the entire contract and returns a structured analysis.

Look at the deadline cards — Phase 1 Delivery, UAT period, weekly reports. They're on a countdown. No more surprises.

Scroll down — here's the obligations matrix. Every commitment NexaSoft made to the client, categorized and tagged with suggested actions.

And here — the risk section. See this one marked HIGH? The contract has a penalty clause for late delivery. DocuPilot flagged it and automatically created an alert that now shows up on the dashboard.

This is what used to take a PM two hours of reading. DocuPilot does it in three seconds."

*[Advance slide]*

---

## Slide 06B — Scope Guard (Live Demo)

*[Navigate to /scope-guard]*

"Now the client message. They've asked: 'Can you add a mobile app for the same booking platform?'

That request is already typed in. I click Analyze."

*[Click Analyze — wait for response]*

"Out of scope. Immediately.

And look at what it gives us: Timeline impact — high. Cost impact — high. Business risk — medium. A strategic impact statement. A professional client reply, ready to send.

And at the bottom — a change request summary that NexaSoft can send to the client to open a formal negotiation.

No awkward conversation. No vague 'we'll think about it.' A clear, professional answer, in seconds.

If you're building software for Middle Eastern clients — this also works in Arabic. The system understands Arabic requests and can respond in Arabic, English, or both."

*[Advance slide]*

---

## Slide 06C — Invoice Analyzer (Live Demo)

*[Navigate to /invoices]*

"The invoice. DesignPro Studio sent an invoice for 6,500 SAR for UI implementation.

Before approving it, DocuPilot checks: Does this amount match the contract? Have we paid this vendor before? Who needs to sign off?

I click Analyze."

*[Click Analyze — wait for response]*

"Contract alignment: 92%. The amount is consistent with the contract terms.

Duplicate risk: None. This is the first time this invoice has appeared.

Recommendation: Approve. And here's the approval chain — Project Manager, then Finance. If it had been flagged as high risk, it would escalate to the Director automatically.

Finance doesn't need to re-read the contract. The AI already did it."

*[Advance slide]*

---

## Slide 06D — SRS Generator

*[Navigate to /srs-generator — optional if time allows]*

"One more. A client sends a rough idea: 'We want a clinic booking platform that lets patients book appointments online.'

DocuPilot turns that into a full Software Requirements Specification.

18 functional requirements. 5 user roles. MVP scope definition. Assumptions. And a list of questions the team still needs to ask the client.

In 30 seconds. In English, Arabic, or bilingual.

What used to take a senior business analyst two days — automated."

*[Advance slide]*

---

## Slide 05 — AI Usage (Brief, after demo)

"Let me be clear about how this AI works — because it's not magic, it's engineering.

Every module sends your document to Google Gemini with a strict JSON schema. Gemini doesn't return prose — it returns structured data that our system validates, stores, and displays.

If Gemini is unavailable, we automatically fall back to a second Gemini model. Then to Alibaba's Qwen. Then to a hardcoded safe response.

This system has never returned a blank screen during our testing.

Every response tells you which AI provider was used, how many attempts it took, and whether a fallback was needed. Full transparency, full reliability."

*[Advance slide]*

---

## Slide 07 — Competitive Advantage

"I know what you're thinking: why not just use ChatGPT?

Here's the difference.

ChatGPT gives you a paragraph. DocuPilot gives you structured data — a JSON object with severity levels, deadlines, obligations, approval chains — that drives a dashboard, creates database records, and generates alerts.

ChatGPT doesn't know your contracts. DocuPilot does — because it stored them. When you ask 'What are the payment milestones in the Al Waha contract?' it searches your documents and gives you a precise answer with source citations.

ChatGPT is a general-purpose tool. DocuPilot is a workflow engine built for one specific problem: software operations.

And we built it for the Middle Eastern market from day one. Arabic prompts, bilingual output, Saudi business context."

*[Advance slide]*

---

## Slide 08 — Market Size

"The market we're addressing starts with software houses in Saudi Arabia — and there are thousands of them. Every one of them manages contracts, invoices, and client requests the same way: manually, inconsistently, and at risk.

Vision 2030 is accelerating the entire software sector. Every government digital transformation project, every fintech, every healthtech — they all need software partners. Those partners need DocuPilot.

From Saudi Arabia, the natural expansion is GCC. From GCC, global.

The exact market numbers — I'll point you to the appendix where I've flagged the specific reports we need for final validation. We want to cite real data, not guesses."

*[Advance slide]*

---

## Slide 09 — Business Model

"The business model is SaaS.

Small teams on a Starter plan — access to SRS and Scope Guard.

Growing agencies on Professional — all modules, full dashboard, the RAG assistant.

Enterprise clients get private deployment, custom models, and an SLA.

We also see a path for API-based pricing for teams that want to embed DocuPilot's analysis into their own tools.

Unit economics are strong. Once a team's contracts and documents are inside DocuPilot, switching cost is high. That's intentional."

*[Advance slide]*

---

## Slide 10 — Technical Architecture

"Quick technical note for those who want it.

Next.js 16 with App Router — server-side AI calls, edge deployment, React 19 performance.

Google Gemini with structured JSON output — not prose, not summaries. Every response is schema-validated with Zod before it touches the UI.

Supabase for the database — PostgreSQL plus pgvector for the RAG embeddings.

Deployed on Vercel. Live at docupilot.site.

The reliability chain means we have three AI providers before we ever fall back to static data. This system is built to stay up."

*[Advance slide]*

---

## Slide 11 — Roadmap

"Here's where we are and where we're going.

Everything you just saw in the demo — live today. Contract analysis, scope guard, invoice analysis, SRS generation, the RAG assistant, the dashboard. All live, all wired to real AI.

What's missing? Authentication is still in demo mode. The approvals interface is polished but doesn't write back to the database yet. Risk tracking is visual-only.

That's the next sprint. Real auth, real approval workflows, real risk persistence.

After that: native Arabic UI, ERP integrations, Jira and Slack connectivity, and private deployment for regulated industries that can't use cloud AI.

The foundation is solid. The roadmap is clear."

*[Advance slide]*

---

## Slide 12 — Closing

"Every software company is sitting on a pile of documents that should be driving decisions — but aren't.

DocuPilot is the system that changes that.

We built it during this bootcamp. It's live. It works in Arabic. It handles the workflows that Saudi software houses deal with every day.

We're looking for early adopters — software houses who want to be the first to run their operations on DocuPilot.

We're looking for mentors and feedback from people who've built or sold software to enterprise clients in the GCC.

And if you're a judge — we built this to be real, not just to demo well. Every AI call you saw was live.

Thank you."

*[Return to Dashboard — full screen — let it sit for a moment]*

---

## Q&A Preparation

**"What happens if the AI is wrong?"**
> "Every AI response is validated with Zod schema before it reaches the UI. The system never returns malformed data. If confidence is low, it tells you — there's a confidence score on every analysis. The goal is to surface information faster, not to replace human judgment."

**"What about data privacy? Contracts are sensitive."**
> "Great question — and that's exactly why our roadmap includes private cloud deployment. For regulated industries and large enterprises, we can deploy the entire stack on-premise or in a private cloud. No data leaves their infrastructure. The AI models can be local or accessed via private endpoints."

**"Why not just use Notion AI or Microsoft Copilot?"**
> "Those are general-purpose tools. They don't understand scope creep, contract obligations, or invoice alignment in the context of a software project. DocuPilot is purpose-built — the prompts, schemas, and workflows are all designed specifically for software operations. It's the difference between a general doctor and a specialist."

**"Who is your first customer?"**
> "Our first target is Saudi software houses — 10 to 100 person teams managing multiple client projects. They have the pain, they have the budget, and they're actively looking for tools that work in Arabic. We're reaching out to our network in the Saudi tech community to start pilot conversations immediately."

**"How much does it cost?"**
> "We're still validating pricing with early customers. Our model is SaaS subscription — likely in the range of what a mid-tier project management tool costs per seat. The goal is to price it clearly below the value of one prevented scope creep incident or one missed contract deadline — which can easily cost tens of thousands of riyals."

---

## Timing Guide

| Section | Target Time |
|---|---|
| Cover + Problem + Solution (Slides 00–02) | 2 minutes |
| Demo Story intro (Slides 03–04) | 1 minute |
| Contract Analyzer demo | 2 minutes |
| Scope Guard demo | 1.5 minutes |
| Invoice Analyzer demo | 1.5 minutes |
| SRS Generator (optional, if time allows) | 1 minute |
| AI Usage + Competitive Advantage (Slides 05, 07) | 1.5 minutes |
| Market + Business Model (Slides 08–09) | 1 minute |
| Roadmap + Closing (Slides 11–12) | 1.5 minutes |
| **Total** | **~13 minutes** |

*Trim to 8 minutes by skipping SRS Generator demo and combining Market + Business Model into one 45-second beat.*

---

## Key Phrases to Memorize

These lines land well. Practice them until they feel natural:

- *"Not a chatbot. A workflow engine."*
- *"What used to take a senior BA two days — 30 seconds."*
- *"Every AI call you saw was live."*
- *"The system has never returned a blank screen."*
- *"Arabic prompts, bilingual output, Saudi business context."*
- *"Documents pile up. Decisions get delayed. DocuPilot closes that gap."*
