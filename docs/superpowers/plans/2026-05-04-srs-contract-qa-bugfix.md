# SRS Generator & Contract-to-Actions QA + Bug Fix Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all critical bugs in the Smart SRS Generator and Contract-to-Actions modules so every UI option actually affects the API request, Gemini prompt, and rendered output; implement real Save Draft and Export PDF; fix Contract API non-blocking persistence; and restore a passing build.

**Architecture:** Wire the full option chain (Page → API body → Gemini prompt → rendered output) for SRS; keep existing schema structures intact; use localStorage for draft; use new-window + window.print() for PDF. Contract route stays structurally the same but persistence becomes non-blocking.

**Tech Stack:** Next.js 16 App Router · TypeScript strict · @google/genai · Zod 4 · Supabase · browser localStorage · window.print()

---

## Bugs Found (Pre-Fix Baseline)

### SRS Generator
| # | Severity | Bug |
|---|----------|-----|
| B1 | CRITICAL | `handleGenerate()` sends only `{ clientRequest }` — language, detailLevel, outputStyle, projectType, sections, clientFacingMode are all discarded |
| B2 | CRITICAL | `SrsRequest` interface has no fields for options |
| B3 | CRITICAL | `buildSrsPrompt()` takes only `clientRequest`; hardcoded rule says "produce English output" — Arabic/Bilingual modes are broken |
| B4 | CRITICAL | Save Draft button is a fake toast — saves nothing |
| B5 | CRITICAL | Export PDF button is a fake toast — exports nothing |
| B6 | MEDIUM | Client-Facing Mode toggle doesn't rename "AI Identified Gaps" → "Clarification Questions" in rendered output |
| B7 | LOW | `FR_DATA` / `frList` variable is dead code (computed but never rendered) |

### Contract-to-Actions
| # | Severity | Bug |
|---|----------|-----|
| B8 | CRITICAL | Supabase insert uses `if (contractError) throw contractError` — violates non-blocking rule; any DB failure crashes the entire route and discards the AI result |
| B9 | MEDIUM | Supabase alertRows step also throws implicitly if contractRow is undefined |

### Build
| # | Severity | Bug |
|---|----------|-----|
| B10 | HIGH | `supabaseAdmin` calls `createClient(undefined!, ...)` when `NEXT_PUBLIC_SUPABASE_URL` is missing — throws at module evaluation time, failing the build for any route that imports it |

---

## File Map

| File | Change |
|------|--------|
| `src/lib/ai/prompts/srs.ts` | Rewrite `buildSrsPrompt()` to accept options object; add language/style/detail/projectType/sections/clientFacing instructions |
| `src/app/api/ai/srs/route.ts` | Expand `SrsRequest` interface; pass full options to `buildSrsPrompt` |
| `src/app/srs-generator/page.tsx` | Send all options in fetch body; implement real Save Draft; implement Export PDF; fix client-facing label |
| `src/app/api/contracts/analyze/route.ts` | Wrap all Supabase calls in try/catch (non-blocking) |
| `src/lib/db/supabaseAdmin.ts` | Guard against missing env vars so module evaluation doesn't throw |

---

## Task 1: Fix supabaseAdmin — guard against missing env vars

**Files:**
- Modify: `src/lib/db/supabaseAdmin.ts`

- [ ] **Step 1: Read current file (already done in inspection)**

- [ ] **Step 2: Rewrite to lazy-guard the URL**

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
```

- [ ] **Step 3: Verify build still starts**

Run: `npm run build 2>&1 | head -30`

---

## Task 2: Fix SRS prompt builder — accept and apply all options

**Files:**
- Modify: `src/lib/ai/prompts/srs.ts`

- [ ] **Step 1: Add the SrsPromptOptions type and rewrite buildSrsPrompt**

Replace the entire `buildSrsPrompt` export with a version that accepts a second `options` parameter. Keep `SYSTEM_CONTEXT` and `buildRefinementPrompt` unchanged.

```typescript
export interface SrsPromptOptions {
  language: 'english' | 'arabic' | 'bilingual';
  detailLevel: 'concise' | 'standard' | 'detailed';
  outputStyle: 'business' | 'technical' | 'client';
  projectType: string;
  enabledSections: Record<string, boolean>;
  clientFacingMode: boolean;
}

const LANGUAGE_RULES: Record<SrsPromptOptions['language'], string> = {
  english: 'Write ALL SRS content in English only.',
  arabic:
    'Write ALL SRS content in Arabic (Modern Standard Arabic). Technical terms universally used in English (API, UI, MVP, SRS) may stay in English but all explanations and descriptions must be Arabic.',
  bilingual:
    'Write ALL SRS content in BOTH English and Arabic. In every section, provide the English text first, then the Arabic translation on a new line prefixed with [AR]. Keep each language's block coherent — do not randomly mix mid-sentence.',
};

const DETAIL_RULES: Record<SrsPromptOptions['detailLevel'], string> = {
  concise:
    'Be brief and executive. Max 3 items per array. Max 3 functional requirements. Max 2 MVP phases. Omit edge cases. Suitable for a 5-minute stakeholder review.',
  standard:
    'Provide a balanced, professional SRS. 4–6 items per section. 5–7 functional requirements. 3–4 MVP phases.',
  detailed:
    'Be thorough and comprehensive. Cover validation rules, error scenarios, security edge cases, and technical constraints. 8–12 functional requirements. 6–8 non-functional requirements. 4–6 MVP phases with details.',
};

const STYLE_RULES: Record<SrsPromptOptions['outputStyle'], string> = {
  business:
    'Write for business stakeholders and management. Emphasise business value, operational goals, delivery scope, and strategic outcomes. Avoid deep technical implementation details.',
  technical:
    'Write for software engineers and technical leads. Include system behaviours, validation rules, data model implications, API concerns, security constraints, performance targets, and technical assumptions. Be precise about system behaviour.',
  client:
    'Write for the client to read and approve. Use polished, professional language. Replace "AI Identified Gaps" with "Clarification Questions". Frame risks as items to discuss together. Avoid harsh internal jargon. The document should inspire confidence.',
};

const PROJECT_TYPE_CONTEXT: Record<string, string> = {
  'web-app':    'This is a browser-based web application. Reference responsive UI, web authentication, admin dashboards, and web-based user journeys.',
  'mobile':     'This is a mobile application. Reference mobile screens, push notifications, offline mode, device permissions, app-store considerations, and mobile UX patterns.',
  'saas':       'This is a SaaS platform. Reference multi-tenancy, workspace/organisation concepts, subscription tiers, per-tenant data isolation, and role-based access across tenants.',
  'api':        'This is an API/Backend service. Focus on endpoints, data models, authentication schemes (API keys, OAuth 2.0), rate limiting, and integration documentation.',
  'enterprise': 'This is an enterprise system. Reference SSO/LDAP integration, audit logging, compliance requirements, data retention policies, and high-availability architecture.',
};

export function buildSrsPrompt(clientRequest: string, options: SrsPromptOptions): string {
  const {
    language,
    detailLevel,
    outputStyle,
    projectType,
    enabledSections,
    clientFacingMode,
  } = options;

  const effectiveStyle = clientFacingMode ? 'client' : outputStyle;
  const disabledSections = Object.entries(enabledSections)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  const sectionNote =
    disabledSections.length > 0
      ? `The following sections are DISABLED — return empty arrays [] for them: ${disabledSections.join(', ')}.`
      : 'All sections are enabled — generate full content for each.';

  return `${SYSTEM_CONTEXT}

## Generation Options (MUST be respected)

- Output language: ${language.toUpperCase()} — ${LANGUAGE_RULES[language]}
- Detail level: ${detailLevel.toUpperCase()} — ${DETAIL_RULES[detailLevel]}
- Output style: ${effectiveStyle.toUpperCase()} — ${STYLE_RULES[effectiveStyle]}
- Project type: ${projectType} — ${PROJECT_TYPE_CONTEXT[projectType] ?? 'A software platform.'}
- Section control: ${sectionNote}

## Task

Analyze the client request below and generate a Software Requirements Specification.

Rules:
- Return valid JSON only matching the provided schema.
- Respect every generation option above — they override default behaviour.
- Be realistic — identify what's missing, not just what's stated.
- Assign priorities based on business value and technical dependency.
- Generate meaningful functional requirement IDs (FR-01, FR-02, etc.).
- In missingQuestions, identify what the client SHOULD have specified (auth, capacity, hosting, integrations, compliance).
- MVP scope must be achievable in 4–8 weeks by a small team.
- Keep the confidence score honest: 90+ only for very detailed requests with clear user flows.

Client request:
"""
${clientRequest}
"""`;
}
```

- [ ] **Step 3: Verify TypeScript compiles** (done after all files are updated)

---

## Task 3: Fix SRS API route — expand interface, pass options to prompt

**Files:**
- Modify: `src/app/api/ai/srs/route.ts`

- [ ] **Step 1: Expand SrsRequest interface and route logic**

Replace the existing `SrsRequest` interface and adjust the prompt call:

```typescript
// Replace the SrsRequest interface (lines 8-13) with:
interface SrsRequest {
  clientRequest: string;
  projectId?: string;
  language?: 'english' | 'arabic' | 'bilingual';
  detailLevel?: 'concise' | 'standard' | 'detailed';
  outputStyle?: 'business' | 'technical' | 'client';
  projectType?: string;
  enabledSections?: Record<string, boolean>;
  clientFacingMode?: boolean;
  currentSrs?: SrsOutput;
  refinementMessage?: string;
}
```

Update the destructuring and prompt call inside `POST`:

```typescript
const {
  clientRequest,
  projectId,
  language = 'english',
  detailLevel = 'standard',
  outputStyle = 'business',
  projectType = 'web-app',
  enabledSections = {},
  clientFacingMode = false,
  currentSrs,
  refinementMessage,
} = body;

// ...

const prompt = isRefinement
  ? buildRefinementPrompt(currentSrs, refinementMessage)
  : buildSrsPrompt(clientRequest, {
      language,
      detailLevel,
      outputStyle,
      projectType,
      enabledSections,
      clientFacingMode,
    });
```

Also update the import line to include `SrsPromptOptions`:

```typescript
import { buildSrsPrompt, buildRefinementPrompt } from "@/lib/ai/prompts/srs";
// (SrsPromptOptions is used inline, no import needed unless re-exported)
```

---

## Task 4: Fix SRS page — send options, real Save Draft, real Export PDF, fix client-facing label

**Files:**
- Modify: `src/app/srs-generator/page.tsx`

### Step A: Send all options in handleGenerate (line 121-125)

Replace:
```typescript
body: JSON.stringify({ clientRequest: requestText }),
```
With:
```typescript
body: JSON.stringify({
  clientRequest: requestText,
  language,
  detailLevel,
  outputStyle,
  projectType,
  enabledSections: sections,
  clientFacingMode,
}),
```

### Step B: Implement real Save Draft

Replace the Save Draft button onClick with a real handler:

```typescript
const handleSaveDraft = useCallback(() => {
  if (!aiResult) {
    showToast('Generate an SRS first before saving a draft', 'warning');
    return;
  }
  const draft = {
    timestamp: new Date().toISOString(),
    options: { language, detailLevel, outputStyle, projectType, sections, clientFacingMode },
    requestText,
    srsOutput: aiResult,
  };
  try {
    localStorage.setItem('docupilot_srs_draft', JSON.stringify(draft));
    showToast('Draft saved successfully', 'success');
  } catch {
    showToast('Failed to save draft (storage full?)', 'error');
  }
}, [aiResult, language, detailLevel, outputStyle, projectType, sections, clientFacingMode, requestText, showToast]);
```

Change the button:
```tsx
<button className="btn btn-secondary" onClick={handleSaveDraft}>
```

### Step C: Implement real Export PDF

Add `handleExportPdf` function:

```typescript
const handleExportPdf = useCallback(() => {
  if (!aiResult) {
    showToast('Generate an SRS first before exporting', 'warning');
    return;
  }

  const w = window.open('', '_blank');
  if (!w) {
    showToast('Popup blocked. Allow popups and try again.', 'error');
    return;
  }

  const date = new Date().toLocaleDateString();
  const dir = language === 'arabic' ? 'rtl' : 'ltr';
  const gapLabel = clientFacingMode ? 'Clarification Questions' : 'AI Identified Gaps';
  const projectLabel = PROJECT_TYPES.find(p => p.value === projectType)?.label ?? projectType;

  const sec = (title: string, content: string) =>
    `<section><h2>${title}</h2>${content}</section><hr>`;

  let body = '';

  if (sections.projectBrief) {
    body += sec('Project Brief', `
      <h3>${aiResult.projectBrief.projectName}</h3>
      <p><strong>Industry:</strong> ${aiResult.projectBrief.industry} &nbsp;|&nbsp;
         <strong>Complexity:</strong> ${aiResult.projectBrief.complexity}</p>
      <p>${aiResult.projectBrief.summary}</p>`);
  }

  if (sections.userRoles) {
    body += sec('User Roles', aiResult.userRoles
      .map(r => `<p><strong>${r.role}</strong> — ${r.description}</p>`).join(''));
  }

  if (sections.mainFeatures) {
    body += sec('Main Features', '<ul>' + aiResult.mainFeatures
      .map(f => `<li><strong>${f.title}</strong> (${f.priority}): ${f.description}</li>`).join('') + '</ul>');
  }

  if (sections.functionalReqs) {
    body += sec('Functional Requirements', '<ul>' + aiResult.functionalRequirements
      .map(fr => `<li><strong>${fr.id}</strong> ${fr.title}: ${fr.description}</li>`).join('') + '</ul>');
  }

  if (sections.nonFunctionalReqs) {
    body += sec('Non-Functional Requirements', '<ul>' + aiResult.nonFunctionalRequirements
      .map(nfr => `<li><strong>${nfr.category}:</strong> ${nfr.requirement}</li>`).join('') + '</ul>');
  }

  if (sections.missingQuestions) {
    body += sec(gapLabel, '<ul>' + aiResult.missingQuestions
      .map(q => `<li>${q}</li>`).join('') + '</ul>');
  }

  if (sections.mvpScope) {
    body += sec('MVP Scope', '<ol>' + aiResult.mvpScope
      .map(s => `<li>${s}</li>`).join('') + '</ol>');
  }

  if (sections.assumptions) {
    body += sec('Assumptions & Constraints', '<ul>' + aiResult.assumptions
      .map(a => `<li>${a}</li>`).join('') + '</ul>');
  }

  if (sections.acceptanceCriteria) {
    body += sec('Acceptance Criteria', '<ul>' + aiResult.nonFunctionalRequirements
      .map(nfr => `<li>${nfr.requirement}</li>`).join('') + '</ul>');
  }

  if (sections.userStories) {
    body += sec('User Stories', aiResult.userRoles
      .map(r => `<p><em>As a <strong>${r.role}</strong>, ${r.description}</em></p>`).join(''));
  }

  w.document.write(`<!DOCTYPE html>
<html lang="${language === 'arabic' ? 'ar' : 'en'}" dir="${dir}">
<head>
<meta charset="UTF-8">
<title>SRS — ${aiResult.projectBrief.projectName}</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 860px; margin: 0 auto; padding: 32px; color: #111; }
  h1 { font-size: 1.6rem; border-bottom: 2px solid #4F46E5; padding-bottom: 8px; }
  h2 { font-size: 1.1rem; color: #4F46E5; margin-top: 24px; }
  h3 { font-size: 1rem; margin: 0 0 8px; }
  .meta { font-size: 0.8rem; color: #666; margin-bottom: 24px; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0; }
  ul, ol { padding-left: 20px; }
  li { margin-bottom: 4px; line-height: 1.5; }
  p { line-height: 1.6; }
  section { margin-bottom: 16px; }
  @media print { body { padding: 16px; } }
</style>
</head>
<body>
<h1>Software Requirements Specification</h1>
<div class="meta">
  Generated: ${date} &nbsp;|&nbsp;
  Language: ${language} &nbsp;|&nbsp;
  Style: ${outputStyle}${clientFacingMode ? ' (Client-Facing)' : ''} &nbsp;|&nbsp;
  Detail: ${detailLevel} &nbsp;|&nbsp;
  Project Type: ${projectLabel} &nbsp;|&nbsp;
  AI Confidence: ${aiResult.confidenceScore}%
</div>
<hr>
${body}
</body>
</html>`);
  w.document.close();
  w.print();
}, [aiResult, language, detailLevel, outputStyle, projectType, sections, clientFacingMode, showToast]);
```

Change the Export PDF button:
```tsx
<button className="btn btn-primary" onClick={handleExportPdf}>
```

### Step D: Fix Client-Facing Mode gap label

In the "AI Gaps + MVP Scope" section (around line 442), change:
```tsx
<h2 className="card-title">...<i ...></i>{t('missingQuestions', language)}</h2>
```
To use a computed label:
```tsx
const gapSectionLabel = clientFacingMode
  ? (language === 'arabic' ? 'أسئلة التوضيح' : language === 'bilingual' ? 'Clarification Questions / أسئلة التوضيح' : 'Clarification Questions')
  : t('missingQuestions', language);
```
Then use `{gapSectionLabel}` in the section header.

---

## Task 5: Fix Contract API route — non-blocking persistence

**Files:**
- Modify: `src/app/api/contracts/analyze/route.ts`

Replace the blocking Supabase block (lines 355–399) with a non-blocking try/catch pattern:

```typescript
// Non-blocking persistence — AI result is returned regardless of DB failures
try {
  const { data: contractRow, error: contractError } = await supabaseAdmin
    .from("contract_analyses")
    .insert({
      project_id: projectId || "clinic-booking-platform",
      contract_text: contractText,
      output_json: validated,
      confidence_score: validated.confidenceScore,
    })
    .select()
    .single();

  if (!contractError && contractRow) {
    const alertRows = [
      ...validated.risks.map((risk) => ({
        project_id: projectId || "clinic-booking-platform",
        source_type: "contract",
        source_id: contractRow.id,
        title: risk.title,
        message: risk.impact,
        severity: risk.severity,
        status: "open",
      })),
      ...validated.deadlines
        .filter((d) => d.priority === "high" || d.priority === "critical")
        .map((deadline) => ({
          project_id: projectId || "clinic-booking-platform",
          source_type: "contract_deadline",
          source_id: contractRow.id,
          title: deadline.title,
          message: deadline.consequenceIfMissed || "Important contract deadline.",
          severity: deadline.priority,
          status: "open",
        })),
    ];
    if (alertRows.length > 0) {
      await supabaseAdmin.from("alerts").insert(alertRows);
    }
  } else if (contractError) {
    console.error("Contract DB persistence failed (non-blocking):", contractError);
  }

  await supabaseAdmin.from("ai_outputs").insert({
    project_id: projectId || "clinic-booking-platform",
    type: "contract_analysis",
    json: validated,
  });
} catch (dbError) {
  console.error("Contract persistence failed (non-blocking):", dbError);
}

return NextResponse.json({ success: true, data: validated });
```

---

## Task 6: Final validation

- [ ] Run `npm run build` — verify it compiles (env-variable warning is OK; crash is not)
- [ ] Run `npm run lint` — fix any lint errors
- [ ] Start dev server `npm run dev`, manually test:
  - SRS: English + Standard + Business + Web App → Generate → verify output is English
  - SRS: Arabic + Standard → verify prompt includes Arabic instructions
  - SRS: Bilingual → verify bilingual instructions in prompt
  - SRS: Concise → verify prompt says concise
  - SRS: Detailed → verify prompt says detailed
  - SRS: Client-Facing Mode ON → verify gaps section says "Clarification Questions"
  - SRS: Disable Non-Functional Reqs → verify card disappears
  - SRS: Save Draft → verify localStorage has 'docupilot_srs_draft'
  - SRS: Export PDF → verify new window opens with content
  - Contract: Paste sample → Analyze → verify UI populates with real data (or fallback if no Supabase)
  - Contract: Verify no crash when Supabase unavailable

---

## Test Cases

### SRS Test Cases

| # | Name | Input | Mode | Purpose |
|---|------|-------|------|---------|
| TC1 | E-commerce Dashboard | "We need an operations dashboard for our e-commerce team to track orders, returns, inventory alerts, and supplier performance. Staff are not technical." | English + Standard + Business + Web App | Tests standard business mode, web app |
| TC2 | Arabic-only LMS | `"نحتاج نظام تعليمي إلكتروني لمركز تدريب يشمل تسجيل الطلاب، جدولة الدورات، متابعة التقدم، وشهادات إتمام."` | Arabic + Detailed + Technical | Tests Arabic output, RTL, detailed mode |
| TC3 | Vague CRM | "Something to help our team track customer issues. Not sure about the details yet." | English + Standard + Business | Tests AI Identified Gaps with vague input |
| TC4 | SaaS HR Portal | "Build a self-service HR portal for employees to submit leave requests, view payslips, update personal info. Managers approve requests. Bilingual Arabic/English." | Bilingual + Detailed + Technical + SaaS | Tests bilingual, SaaS type, detailed |
| TC5 | Maintenance App | "Mobile app for field technicians to receive work orders, update job status, capture photos, and get GPS navigation to sites." | English + Standard + Technical + Mobile App | Tests mobile app type, technical style |

### Contract Test Cases

| # | Name | Contract | Purpose |
|---|------|---------|---------|
| CC1 | Complete Software Contract | Sample contract (Acme Corp / DevShop: 12-week, $50k, 50/50 payment, 5% weekly penalty) | Full extraction test |
| CC2 | Vague/Minimal Contract | "This agreement is between Client A and Vendor B for software development services. Work to begin shortly. Payment to be agreed." | Tests missing info detection |
| CC3 | Penalty-Heavy Contract | Full contract with multiple penalty clauses, SLA requirements | Tests risk extraction severity |
| CC4 | Change-Request-Heavy Contract | Contract with detailed change request terms, approval workflows, out-of-scope definitions | Tests change request term extraction |
