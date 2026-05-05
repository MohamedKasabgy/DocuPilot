
# DocuPilot

**From Documents to Decisions**

DocuPilot is an AI-powered business document operations platform for software companies and service businesses.

It helps teams turn client requests, contracts, invoices, SRS documents, scope changes, approvals, and operational risks into structured workflows, actions, reminders, and business decisions.

---

## What DocuPilot Does

DocuPilot is not just a document storage tool and not just a chatbot.

It acts as an internal AI operations layer that reads business documents, extracts important information, connects it to projects, and turns it into:

- Requirements
- Tasks
- Approvals
- Payment milestones
- Risk alerts
- Scope decisions
- Executive insights
- Daily operational priorities

The product promise is simple:

> From Documents to Decisions.

---

## Problem

Small and medium software companies often work across disconnected tools.

Client requests may arrive in WhatsApp, email, or meetings. Contracts sit in Google Drive. Invoices arrive as PDF files. Requirements are written manually. Decisions happen in meetings. Tasks are tracked separately.

This creates operational blind spots:

- Requirements are unclear at project start.
- Contracts are signed but obligations are not actively tracked.
- Invoices may be delayed, duplicated, or approved without context.
- Client change requests can cause scope creep.
- Managers lack daily visibility into risks, approvals, payments, and urgent decisions.

Companies do not lose control because they lack documents. They lose control because documents do not automatically become actions, reminders, approvals, risks, and decisions.

---

## Why Not Just ChatGPT?

ChatGPT and Claude can answer questions in a temporary chat, but DocuPilot is designed as a connected business operations system.

| AI Chat Tool | DocuPilot |
|---|---|
| Answers a question in a chat. | Stores structured project memory. |
| Can summarize a document manually. | Extracts obligations, payments, deadlines, risks, and actions. |
| Requires repeated context. | Connects documents to projects, clients, invoices, approvals, and risks. |
| Does not manage workflow state. | Creates tasks, approvals, payment milestones, risk alerts, and dashboard insights. |
| Gives text output. | Turns business inputs into operational decisions. |

DocuPilot does not only respond. It helps teams execute.

---

## MVP Scope

The MVP focuses on one clear workflow for software companies and service businesses:

Client request → Project Evaluator / SRS → Contract Analysis → Invoice Approval → Scope Guard → Risk Radar → Dashboard → Ask DocuPilot

Included in the MVP:

- Project Workspace
- AI Project Evaluator / Smart SRS
- Contract-to-Actions
- Invoice-to-Approval
- Scope Guard
- Risk Radar
- Dashboard
- Ask DocuPilot

Out of scope for the MVP:

- Full HR system
- Full accounting system
- Full ERP replacement
- Complex external integrations
- Production-grade OCR for all scanned files
- Full enterprise permissions and audit logs
- Training a custom AI model from scratch

---

## Core Demo Scenario

The prototype uses one connected demo story.

| Item | Details |
|---|---|
| Company | NexaSoft |
| Client | Al Waha Clinics |
| Project | Clinic Booking Platform |
| Goal | Build a web booking system with an admin dashboard, appointment management, online payments, patient profiles, and notification settings. |

### Demo Flow

1. A client request is entered.
2. DocuPilot generates project requirements and a business/project evaluation.
3. A service agreement is analyzed.
4. Contract obligations, payment milestones, deadlines, and risks are extracted.
5. A supplier invoice is reviewed and sent to approval.
6. A new client request for a mobile app is checked by Scope Guard.
7. Risk Radar aggregates risks from the project, contract, invoice, meeting notes, and scope check.
8. The Dashboard shows priorities and decisions.
9. Ask DocuPilot answers questions from the connected project memory.

---

## Connected DocuPilot Workflow

DocuPilot connects business documents into one AI Manager workflow.

- Client requests become project evaluation and requirements.
- Contracts become obligations, payments, deadlines, and risks.
- Invoices become approvals and payment reminders.
- Scope changes are checked against stored project scope and contract scope.
- Risks are aggregated from Project Evaluator, Contract Analysis, Invoice Analysis, Scope Guard, and Meeting Notes.
- Ask DocuPilot answers from connected project memory instead of acting like a generic chatbot.

The goal is to make every document useful beyond storage. Each input should become something the company can track, approve, review, or act on.

---

## Core Services

### 1. Project Workspace

A dedicated space for each client project.

It connects:

- Project brief
- SRS / requirements
- Contracts
- Invoices
- Client requests
- Meeting notes
- Risks
- Approvals
- Actions

### 2. AI Project Evaluator / Smart SRS

Turns vague client requests into structured project understanding.

Outputs may include:

- Project brief
- Functional requirements
- Non-functional requirements
- User roles
- Missing questions
- MVP scope
- Potential revenue
- Estimated cost
- ROI
- Risks
- Market maturity
- Build / Reconsider recommendation

### 3. Contract-to-Actions

Turns a contract into operational records.

Outputs may include:

- Scope
- Deliverables
- Deadlines
- Payment milestones
- Obligations
- Risk clauses
- Change request terms
- Suggested actions

### 4. Invoice-to-Approval

Turns invoices into approval and payment workflows.

Outputs may include:

- Vendor
- Amount
- Due date
- Related project
- Approval status
- Duplicate risk
- Recommended action

### 5. Scope Guard

Checks whether a new client request is inside or outside the approved project and contract scope.

Example:

A client asks:

> Can you also add a mobile app for the same booking platform?

DocuPilot compares the request against the stored project scope and contract scope, then classifies it as:

> Out of Scope

Recommended action:

> Create Change Request

### 6. Risk Radar

Collects operational risks from different parts of the system.

Risk sources include:

- Project Evaluator
- Contract Analysis
- Invoice Analysis
- Scope Guard
- Meeting Notes

Each risk should show:

- Severity
- Source
- Impact
- Recommended action

### 7. Dashboard

Executive view for daily operations.

It shows:

- Active projects
- Pending approvals
- High risks
- Upcoming payments
- Scope issues
- Daily priorities
- Smart alerts

### 8. Ask DocuPilot

An internal AI assistant for project and company memory.

Example questions:

- What are the highest risks in this project?
- Which invoices need approval?
- Is the mobile app request out of scope?
- What actions are due this week?
- What documents are linked to the Clinic Booking Platform?

---

## Main Pages

| Route | Purpose |
|---|---|
| `/` | Dashboard |
| `/projects` | Project Workspace |
| `/srs-generator` | AI Project Evaluator / Smart SRS |
| `/contracts` | Contract-to-Actions |
| `/invoices` | Invoice Review |
| `/approvals` | Approval Center |
| `/scope-guard` | Scope Guard |
| `/risks` | Risk Radar |
| `/ask-docupilot` | Ask DocuPilot assistant |

---

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Gemini API planned / partially integrated
- Supabase planned / partially integrated
- Zod for structured AI outputs
- Lucide icons
- Recharts / dashboard visualizations where needed

---

## Current Status

DocuPilot is currently a high-fidelity MVP prototype.

Current state:

- Frontend prototype is mostly complete.
- Some AI routes are present.
- Many flows use realistic demo and fallback data.
- The connected workflow story is implemented across key pages.
- Full database persistence is still future work.
- Production AI workflows are still future work.
- Authentication and real company workspaces are still future work.

This project should be presented as an MVP prototype, not a production-ready SaaS platform.

---

## How to Run

Install dependencies:

```bash
npm install