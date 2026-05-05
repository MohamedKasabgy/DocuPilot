# DocuPilot

**From Documents to Decisions**

DocuPilot is an AI-powered business document operations platform for software companies and service businesses.

## What DocuPilot Does

DocuPilot turns client requests, contracts, invoices, SRS documents, scope changes, approvals, and risks into structured workflows, actions, and decisions.

## Problem

Companies have documents scattered across email, Google Drive, WhatsApp, meetings, and PDFs. However, those documents do not automatically become actions, reminders, approvals, risks, or decisions. They sit idle while teams struggle to manually track obligations and scope.

## Why Not Just ChatGPT?

- **ChatGPT** answers in a temporary chat, lacking project context.
- **DocuPilot** stores a structured project memory.
- **DocuPilot** connects documents directly to projects.
- **DocuPilot** automatically creates tasks, approvals, risks, payment milestones, and dashboard insights from your documents.

## MVP Scope

- Project Workspace
- AI Project Evaluator / Smart SRS
- Contract-to-Actions
- Invoice-to-Approval
- Scope Guard
- Risk Radar
- Dashboard
- Ask DocuPilot

## Core Demo Scenario

- **Company:** NexaSoft
- **Client:** Al Waha Clinics
- **Project:** Clinic Booking Platform

**The Flow:**
Client request → Project Evaluator/SRS → Contract Analysis → Invoice Approval → Scope Guard → Risk Radar → Dashboard → Ask DocuPilot.

## Connected DocuPilot Workflow

- **Client requests** become requirements and project evaluation.
- **Contracts** become obligations, payments, and risks.
- **Invoices** become approvals and payment reminders.
- **Scope changes** are checked against stored project and contract scope.
- **Risks** are aggregated from Project Evaluator, Contract Analysis, Invoice Analysis, Scope Guard, and Meeting Notes into a single view.
- **Ask DocuPilot** answers questions from this connected project memory.

## Main Pages

- `/` (Dashboard)
- `/projects` (Project Workspace)
- `/srs-generator` (Smart SRS)
- `/contracts` (Contract-to-Actions)
- `/invoices` (Invoice Review)
- `/approvals` (Invoice Approvals)
- `/scope-guard` (Scope Guard)
- `/risks` (Risk Radar)
- `/ask-docupilot` (AI Assistant)

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Gemini API (planned/partially integrated)
- Supabase (planned/partially integrated)
- Zod for structured AI outputs

## Current Status

- Frontend prototype is mostly complete.
- Some AI routes are present and functional.
- Many flows use realistic demo/fallback data.
- Full database persistence and production AI workflows are still future work.

## How to Run

```bash
npm install
npm run dev
```
