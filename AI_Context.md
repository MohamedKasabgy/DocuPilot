# DocuPilot AI Context

This file is written for AI coding assistants such as Claude, ChatGPT, Gemini, and Cursor.

Before making changes to this project, always read this file and README.md.

---

## Project Summary

DocuPilot is a B2B AI-powered document operations platform.

It helps software companies and service businesses turn documents and client inputs into structured workflows, approvals, risks, and decisions.

Tagline:

> From Documents to Decisions.

Main MVP flow:

Client Request → SRS Generator → Contract-to-Actions → Invoice-to-Approval → Scope Guard → Risk Radar → Dashboard

---

## Current Status

The frontend/UI is approximately 80% complete.

The project currently behaves like a high-fidelity interactive SaaS prototype.

Most pages, cards, layouts, and navigation are already implemented.

The current data is mostly static/mock data.

The next major phase is backend, database, and AI integration.

---

## Important Instruction for AI Assistants

Do not redesign the whole UI unless explicitly asked.

Do not remove existing pages, routes, components, or styling.

Preserve the current DocuPilot identity, layout, and SaaS dashboard feel.

Focus on incremental improvements and backend integration.

When modifying code:
- Inspect the existing structure first.
- Reuse existing components where possible.
- Keep TypeScript clean.
- Avoid unnecessary architecture changes.
- Do not invent features outside the MVP.
- Explain what files were changed after every task.

---

## Current Frontend Routes

The project includes these main routes:

- `/` — Dashboard
- `/projects` — Project Workspace
- `/srs-generator` — Smart SRS Generator
- `/contracts` — Contract-to-Actions
- `/invoices` — Invoice Review
- `/approvals` — Approval Workflow
- `/scope-guard` — Scope Guard
- `/risks` — Risk Radar
- `/ask-docupilot` — AI Assistant / future RAG chat

---

## Current Backend Status

Backend is not fully implemented yet.

Existing API routes may currently be stubs or mock endpoints.

The next backend work should focus on:

1. Database setup
2. Data models
3. Demo seed data
4. Gemini API integration
5. Zod validation
6. Saving AI outputs
7. Connecting dashboard metrics to real stored data

---

## Planned Data Models

Use these as the core backend models:

- `companies`
- `projects`
- `srs_outputs`
- `contracts`
- `invoices`
- `approvals`
- `risks`
- `client_requests`
- `ai_outputs`

Every AI-generated output should be linked to a `projectId`.

---

## AI Workflows

### 1. SRS Generator

Input:
- Client request text

Output:
- Project brief
- User roles
- Main features
- Functional requirements
- Non-functional requirements
- Missing questions
- MVP scope
- Assumptions

---

### 2. Contract-to-Actions

Input:
- Contract text

Output:
- Scope
- Deliverables
- Deadlines
- Payments
- Obligations
- Risks
- Change request terms
- Suggested actions

Important:
Do not provide legal advice. Extract operational information only.

---

### 3. Invoice-to-Approval

Input:
- Invoice text

Output:
- Vendor
- Service
- Amount
- Currency
- Due date
- Related project
- Approval status
- Reason
- Recommended action

Rule:
If amount is greater than 5000 SAR, approval is required.

---

### 4. Scope Guard

Input:
- New client request
- Existing SRS
- Contract scope

Output:
- `in_scope`
- `out_of_scope`
- `needs_clarification`

Also return:
- Reason
- Timeline impact
- Cost impact
- Suggested action
- Client reply

---

## Demo Scenario

Use this scenario for demo data:

Company:
NexaSoft

Client:
Al Waha Clinics

Project:
Clinic Booking Platform

Scenario:
NexaSoft is building a clinic booking platform for Al Waha Clinics.

DocuPilot should:
1. Generate an SRS from the initial client request.
2. Analyze the contract and extract risks, payments, obligations, and deadlines.
3. Analyze an invoice from DesignPro Studio.
4. Detect that a mobile app request is out of scope.
5. Show all risks, approvals, invoices, and actions in the dashboard.

---

## Backend Priority Order

Do backend work in this order:

1. Create database connection.
2. Create project schema/models.
3. Add demo seed data.
4. Implement SRS Generator API.
5. Save SRS output to database.
6. Display saved SRS in Project Workspace.
7. Implement Contract-to-Actions API.
8. Implement Invoice-to-Approval API.
9. Implement Scope Guard API.
10. Connect dashboard metrics to stored data.
11. Add fallback demo data for pitch safety.
12. Add Ask DocuPilot only if the core MVP works.

---

## Recommended AI Integration

Use Gemini Flash for:
- Fast extraction
- SRS generation
- Invoice parsing

Use Gemini Pro for:
- Contract reasoning
- Scope comparison
- Complex risk analysis

All AI outputs must return structured JSON.

Validate every AI response with Zod before saving it.

If AI fails, return a clean fallback response instead of breaking the UI.

---

## Things Not To Build Yet

Do not prioritize these before the core MVP works:

- Full RAG system
- Full authentication system
- Full role-based access control
- Payment integration
- Gmail/WhatsApp/Calendar integrations
- Full OCR system
- Full accounting system
- Enterprise audit logs

---

## Current Development Rule

The main value of DocuPilot is not chatting with documents.

The main value is turning documents into:

- Decisions
- Risks
- Approvals
- Tasks
- Alerts
- Dashboard insights

Always preserve this product direction.