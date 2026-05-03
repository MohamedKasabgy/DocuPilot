# AI Business Document Manager

AI Business Document Manager is a SaaS-style web application that helps small businesses manage invoices and contracts using AI.

Users can upload or paste business documents, and the system automatically extracts important information such as amounts, due dates, contract parties, expiry dates, and document summaries. The extracted data is displayed in a smart dashboard with alerts, status tracking, and an AI chat assistant.

---

## Problem

Small businesses often manage invoices and contracts manually using emails, spreadsheets, and scattered files. This causes problems such as:

- Missed invoice due dates
- Forgotten contract renewals
- Slow document review
- Difficulty tracking business obligations
- Lack of clear financial and operational visibility

---

## Solution

This platform uses AI to convert unstructured business documents into organized, trackable data.

The system allows users to:

- Upload or paste invoices and contracts
- Extract key business information using AI
- Track unpaid invoices and expiring contracts
- View alerts and summaries in one dashboard
- Ask questions through an AI chat assistant

---

## Key Features

### 1. Document Upload

Users can upload or paste text from:

- Invoices
- Contracts
- Business documents

---

### 2. AI Data Extraction

The AI analyzes the document and extracts structured data.

For invoices, it can extract:

- Vendor name
- Invoice number
- Amount
- Issue date
- Due date
- Payment status
- Summary

For contracts, it can extract:

- Client or party name
- Contract start date
- Contract end date
- Contract value
- Important terms
- Risk summary

---

### 3. Smart Dashboard

The dashboard displays:

- Total unpaid invoices
- Total outstanding amount
- Overdue invoices
- Contracts expiring soon
- Recent uploaded documents
- AI-generated business summary

---

### 4. Alerts System

The platform provides simple business alerts such as:

- Invoice overdue
- Payment due soon
- Contract expiring soon
- Missing important document information

---

### 5. AI Chat Assistant

Users can ask business questions such as:

- "How many unpaid invoices do I have?"
- "Which contracts expire this month?"
- "What payments are due this week?"
- "Summarize my current business obligations."

The assistant answers based on the saved business data.

---

## Tech Stack

- Frontend: React
- Styling: Tailwind CSS
- Backend: Node.js / Express
- Database: PostgreSQL
- AI: OpenAI API or Gemini API
- Hosting/Development: Replit

---

## Project Scope

This project is designed as a 4-day MVP for an AI bootcamp competition.

The goal is not to build a full business management system, but to demonstrate a focused AI-powered solution for managing invoices and contracts.

---

## Future Improvements

Planned features for future versions:

- HR management
- Payroll tracking
- Real accounting integrations
- Email reminders
- Advanced workflow automation
- Legal compliance checking
- Full AI business manager dashboard
- Integration with QuickBooks, Salesforce, and Gmail

---

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/ai-business-document-manager.git
cd ai-business-document-manager
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_api_key
```

Start the development server:

```bash
npm run dev
```

---

## Database Tables

Suggested basic tables:

### users

Stores user account information.

### documents

Stores uploaded document records.

### invoices

Stores extracted invoice data.

### contracts

Stores extracted contract data.

### alerts

Stores system-generated alerts.

---

## Example AI Extraction Output

```json
{
  "type": "invoice",
  "vendor": "ABC Supplies",
  "invoiceNumber": "INV-204",
  "amount": 12500,
  "issueDate": "2026-05-01",
  "dueDate": "2026-05-15",
  "status": "unpaid",
  "summary": "Invoice for office equipment. Payment is due in 14 days."
}
```

---

## Demo Scenario

1. User logs into the platform.
2. User uploads an invoice or contract.
3. AI extracts the important information.
4. The document appears in the dashboard.
5. The system creates alerts for due dates or risks.
6. User asks the AI assistant about invoices, contracts, or obligations.

---

## Project Vision

AI Business Document Manager is the first module of a larger AI-powered business operations platform.

The long-term vision is to build an AI Business Manager that helps companies manage documents, employees, workflows, decisions, and operations from one intelligent dashboard.

---

## Team

Built for an AI Bootcamp Competition.

---

## License

This project is for educational and competition purposes.

# DocuPilot Operational Hub UI

A high-fidelity static prototype for the DocuPilot B2B SaaS platform, served using a Node.js Express server.

## Features
- Complete Neo-Dark SaaS Theme
- 5 Core Views (Dashboard, Projects, Contracts, Approvals, Ask DocuPilot)
- Vanilla HTML/CSS/JS (Zero frontend framework dependencies)

## Setup Instructions

1. **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
2. **Install Dependencies**: Open your terminal in the root directory and run:
   ```bash
   npm install
   ```
3. **Start the Server**: Run the following command to boot up the Express server:
   ```bash
   npm start
   ```
4. **View the Application**: Open your web browser and navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure
- `/` - Root directory containing all HTML views (e.g., `index.html`, `projects.html`) and the Node.js server (`server.js`).
- `/css` - Contains the design system stylesheets (`index.css`, `layout.css`, `components.css`).
- `/js` - Contains the client-side interaction script (`main.js`).

## Troubleshooting
- If you encounter an `EADDRINUSE` error, it means port 3000 is already being used. You can change the port by setting an environment variable (e.g., `set PORT=3001 && npm start` on Windows).
- Make sure to run the server from the root directory (`a:\college\outside project\MM`). Do not execute `node js/main.js` as it is client-side code meant for the browser, not Node.js.
