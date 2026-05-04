'use client';
import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import type { SrsOutput } from '@/lib/ai/schemas/srs';

type Language = 'english' | 'arabic' | 'bilingual';
type DetailLevel = 'concise' | 'standard' | 'detailed';
type OutputStyle = 'business' | 'technical' | 'client';
type ToastType = 'success' | 'info' | 'warning' | 'error';

const SAMPLE_REQUEST = `نحتاج نظام حجوزات للعيادات يشمل موقع للحجز، لوحة تحكم للإدارة، إدارة المواعيد، إشعارات للمراجعين، وتقارير بسيطة للإدارة.`;

const PROJECT_TYPES = [
  { value: 'web-app', label: 'Web App' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'saas', label: 'SaaS Platform' },
  { value: 'api', label: 'API / Backend' },
  { value: 'enterprise', label: 'Enterprise System' },
];

const FR_DATA: Record<DetailLevel, { id: string; title: string; desc: string }[]> = {
  concise: [
    { id: 'FR-01', title: 'Real-time Slot Verification', desc: 'No double-bookings by locking slot selection during checkout.' },
    { id: 'FR-02', title: 'Automated Reminders', desc: 'Trigger notifications 24 hours and 1 hour before appointments.' },
  ],
  standard: [
    { id: 'FR-01', title: 'Real-time Slot Verification', desc: 'No double-bookings by locking slot selection during checkout.' },
    { id: 'FR-02', title: 'Automated Reminders (SMS/Email)', desc: 'Trigger notifications 24 hours and 1 hour before scheduled appointments.' },
    { id: 'FR-03', title: 'Administrative Overrides', desc: 'Admins can manually move, cancel, or block slots for emergency clinic needs.' },
    { id: 'FR-04', title: 'Performance Analytics', desc: 'Weekly reports on booking volume, cancellation rates, and peak hours.' },
  ],
  detailed: [
    { id: 'FR-01', title: 'Real-time Slot Verification', desc: 'No double-bookings by locking slot selection during checkout with a 5-minute hold.' },
    { id: 'FR-02', title: 'Automated Reminders (SMS/Email)', desc: 'Trigger notifications 24 hours and 1 hour before scheduled appointments.' },
    { id: 'FR-03', title: 'Administrative Overrides', desc: 'Admins can manually move, cancel, or block slots for emergency clinic needs.' },
    { id: 'FR-04', title: 'Performance Analytics', desc: 'Weekly reports on booking volume, cancellation rates, and peak hours.' },
    { id: 'FR-05', title: 'Multi-Doctor Schedule Management', desc: 'Concurrent schedule management for multiple practitioners with conflict detection.' },
    { id: 'FR-06', title: 'Patient Record Integration', desc: 'Link bookings to patient profiles for visit history, preferences, and follow-ups.' },
  ],
};

const SECTION_LABELS: Record<string, Record<Language, string>> = {
  projectBrief: { english: 'Project Brief', arabic: 'ملخص المشروع', bilingual: 'Project Brief / ملخص المشروع' },
  userRoles: { english: 'User Roles', arabic: 'أدوار المستخدمين', bilingual: 'User Roles / أدوار المستخدمين' },
  mainFeatures: { english: 'Main Features', arabic: 'الميزات الرئيسية', bilingual: 'Main Features / الميزات الرئيسية' },
  functionalReqs: { english: 'Functional Requirements', arabic: 'المتطلبات الوظيفية', bilingual: 'Functional Requirements / المتطلبات الوظيفية' },
  nonFunctionalReqs: { english: 'Non-Functional Requirements', arabic: 'المتطلبات غير الوظيفية', bilingual: 'Non-Functional Requirements / المتطلبات غير الوظيفية' },
  missingQuestions: { english: 'AI Identified Gaps', arabic: 'ثغرات مكتشفة بالذكاء الاصطناعي', bilingual: 'AI Identified Gaps / الثغرات المكتشفة' },
  mvpScope: { english: 'MVP Scope Definition', arabic: 'تعريف نطاق MVP', bilingual: 'MVP Scope / تعريف نطاق MVP' },
  assumptions: { english: 'Assumptions & Constraints', arabic: 'الافتراضات والقيود', bilingual: 'Assumptions / الافتراضات' },
  acceptanceCriteria: { english: 'Acceptance Criteria', arabic: 'معايير القبول', bilingual: 'Acceptance Criteria / معايير القبول' },
  userStories: { english: 'User Stories', arabic: 'قصص المستخدم', bilingual: 'User Stories / قصص المستخدم' },
};

function t(key: string, lang: Language): string {
  return SECTION_LABELS[key]?.[lang] ?? key;
}

const TOAST_ICONS: Record<ToastType, string> = {
  success: 'fa-solid fa-circle-check',
  info: 'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
  error: 'fa-solid fa-circle-xmark',
};

const TECH_STACKS: Record<string, { frontend: string; backend: string; db: string; infra: string }> = {
  'web-app': { frontend: 'React / Next.js', backend: 'Node.js / Express', db: 'PostgreSQL', infra: 'Vercel / Railway' },
  'mobile': { frontend: 'React Native', backend: 'Node.js / Fastify', db: 'SQLite + Cloud Sync', infra: 'Expo + AWS Amplify' },
  'saas': { frontend: 'React / Next.js', backend: 'Nest.js + Microservices', db: 'PostgreSQL + Redis', infra: 'AWS ECS / RDS' },
  'api': { frontend: 'OpenAPI / Swagger', backend: 'FastAPI (Python)', db: 'PostgreSQL + MongoDB', infra: 'Docker + Kubernetes' },
  'enterprise': { frontend: 'React / TypeScript', backend: 'Java Spring Boot', db: 'Oracle / MSSQL', infra: 'Azure AKS' },
};

function computeComplexity(dl: DetailLevel, pt: string) {
  const base = dl === 'concise' ? 30 : dl === 'standard' ? 55 : 80;
  const mult: Record<string, number> = { 'web-app': 1, 'mobile': 1.2, 'saas': 1.4, 'api': 0.8, 'enterprise': 1.6 };
  const score = Math.round(Math.min(base * (mult[pt] ?? 1), 95));
  const label = score < 40 ? 'Low' : score < 65 ? 'Moderate' : score < 80 ? 'High' : 'Very High';
  const weeks = score < 40 ? '4–8' : score < 65 ? '8–16' : score < 80 ? '16–28' : '28+';
  const team = score < 40 ? '2–3 devs' : score < 65 ? '3–5 devs' : score < 80 ? '5–8 devs' : '8+ devs';
  return { score, label, weeks, team };
}

export default function SRSGeneratorPage() {
  const [language, setLanguage] = useState<Language>('english');
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('standard');
  const [outputStyle, setOutputStyle] = useState<OutputStyle>('business');
  const [projectType, setProjectType] = useState('web-app');
  const [sections, setSections] = useState({
    projectBrief: true,
    userRoles: true,
    mainFeatures: true,
    functionalReqs: true,
    nonFunctionalReqs: false,
    missingQuestions: true,
    mvpScope: true,
    assumptions: false,
    acceptanceCriteria: false,
    userStories: false,
  });
  const [requestText, setRequestText] = useState(SAMPLE_REQUEST);
  const [clientFacingMode, setClientFacingMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [aiResult, setAiResult] = useState<SrsOutput | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

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

  const handleExportPdf = useCallback(() => {
    if (!aiResult) {
      showToast('Generate an SRS first before exporting', 'warning');
      return;
    }
    const w = window.open('', '_blank');
    if (!w) {
      showToast('Popup blocked — allow popups and try again', 'error');
      return;
    }
    const date = new Date().toLocaleDateString();
    const isArabic = language === 'arabic';
    const dir = isArabic ? 'rtl' : 'ltr';
    const htmlLang = isArabic ? 'ar' : 'en';

    // Arabic labels used only when language === 'arabic'
    const PDF_AR: Record<string, string> = {
      title: 'وثيقة متطلبات النظام',
      projectBrief: 'ملخص المشروع',
      userRoles: 'أدوار المستخدمين',
      mainFeatures: 'الميزات الرئيسية',
      functionalReqs: 'المتطلبات الوظيفية',
      nonFunctionalReqs: 'المتطلبات غير الوظيفية',
      missingQuestions: 'الفجوات والأسئلة المفتوحة',
      clarificationQuestions: 'أسئلة التوضيح',
      mvpScope: 'نطاق النسخة الأولية',
      assumptions: 'الافتراضات والقيود',
      acceptanceCriteria: 'معايير القبول',
      userStories: 'قصص المستخدم',
      generated: 'تاريخ الإنشاء',
      language: 'اللغة',
      style: 'النمط',
      detail: 'مستوى التفصيل',
      projectType: 'نوع المشروع',
      confidence: 'نسبة الثقة',
      industry: 'المجال',
      complexity: 'درجة التعقيد',
    };

    // Return Arabic label when in Arabic mode, English otherwise
    const pdfL = (key: string, en: string): string => isArabic ? (PDF_AR[key] ?? en) : en;

    const gapLabel = isArabic
      ? (clientFacingMode ? PDF_AR.clarificationQuestions : PDF_AR.missingQuestions)
      : (clientFacingMode ? 'Clarification Questions' : 'AI Identified Gaps');

    const projectLabel = PROJECT_TYPES.find(p => p.value === projectType)?.label ?? projectType;

    // Wrap alphanumeric IDs (FR-01, NFR-01) in a LTR span so they don't reverse in RTL documents
    const ltrId = (id: string) => `<span class="ltr">${id}</span>`;

    const sec = (title: string, content: string) =>
      `<section><h2>${title}</h2>${content}</section><hr>`;

    let body = '';
    if (sections.projectBrief) {
      body += sec(pdfL('projectBrief', 'Project Brief'), `
        <h3>${aiResult.projectBrief.projectName}</h3>
        <p>
          <strong>${pdfL('industry', 'Industry')}:</strong> ${aiResult.projectBrief.industry}
          &nbsp;|&nbsp;
          <strong>${pdfL('complexity', 'Complexity')}:</strong> ${aiResult.projectBrief.complexity}
        </p>
        <p>${aiResult.projectBrief.summary}</p>`);
    }
    if (sections.userRoles) {
      body += sec(pdfL('userRoles', 'User Roles'), aiResult.userRoles.map(r =>
        `<p><strong>${r.role}</strong> — ${r.description}</p>`).join(''));
    }
    if (sections.mainFeatures) {
      body += sec(pdfL('mainFeatures', 'Main Features'), '<ul>' + aiResult.mainFeatures.map(f =>
        `<li><strong>${f.title}</strong> (${f.priority}): ${f.description}</li>`).join('') + '</ul>');
    }
    if (sections.functionalReqs) {
      body += sec(pdfL('functionalReqs', 'Functional Requirements'), '<ul>' + aiResult.functionalRequirements.map(fr =>
        `<li>${ltrId(fr.id)} <strong>${fr.title}</strong>: ${fr.description}</li>`).join('') + '</ul>');
    }
    if (sections.nonFunctionalReqs) {
      body += sec(pdfL('nonFunctionalReqs', 'Non-Functional Requirements'), '<ul>' + aiResult.nonFunctionalRequirements.map(nfr =>
        `<li><strong>${nfr.category}:</strong> ${nfr.requirement}</li>`).join('') + '</ul>');
    }
    if (sections.missingQuestions) {
      body += sec(gapLabel, '<ul>' + aiResult.missingQuestions.map(q =>
        `<li>${q}</li>`).join('') + '</ul>');
    }
    if (sections.mvpScope) {
      body += sec(pdfL('mvpScope', 'MVP Scope'), '<ol>' + aiResult.mvpScope.map(s =>
        `<li>${s}</li>`).join('') + '</ol>');
    }
    if (sections.assumptions) {
      body += sec(pdfL('assumptions', 'Assumptions & Constraints'), '<ul>' + aiResult.assumptions.map(a =>
        `<li>${a}</li>`).join('') + '</ul>');
    }
    if (sections.acceptanceCriteria) {
      body += sec(pdfL('acceptanceCriteria', 'Acceptance Criteria'), '<ul>' + aiResult.nonFunctionalRequirements.map(nfr =>
        `<li>${nfr.requirement}</li>`).join('') + '</ul>');
    }
    if (sections.userStories) {
      body += sec(pdfL('userStories', 'User Stories'), aiResult.userRoles.map(r =>
        `<p><em>As a <strong>${r.role}</strong>, ${r.description}</em></p>`).join(''));
    }

    // Meta bar items — Arabic labels when in Arabic mode
    const metaItems = isArabic
      ? [
          `${PDF_AR.generated}: ${date}`,
          `${PDF_AR.language}: عربي`,
          `${PDF_AR.style}: ${outputStyle}${clientFacingMode ? ' (عميل)' : ''}`,
          `${PDF_AR.detail}: ${detailLevel}`,
          `${PDF_AR.projectType}: ${projectLabel}`,
          `${PDF_AR.confidence}: ${aiResult.confidenceScore}%`,
        ]
      : [
          `Generated: ${date}`,
          `Language: ${language}`,
          `Style: ${outputStyle}${clientFacingMode ? ' (Client-Facing)' : ''}`,
          `Detail: ${detailLevel}`,
          `Project Type: ${projectLabel}`,
          `AI Confidence: ${aiResult.confidenceScore}%`,
        ];

    const mainTitle = isArabic ? PDF_AR.title : 'Software Requirements Specification';

    w.document.write(`<!DOCTYPE html>
<html lang="${htmlLang}" dir="${dir}">
<head>
<meta charset="UTF-8">
<title>SRS — ${aiResult.projectBrief.projectName}</title>
<style>
  body{font-family:Arial,sans-serif;max-width:860px;margin:0 auto;padding:32px;color:#111}
  h1{font-size:1.6rem;border-bottom:2px solid #4F46E5;padding-bottom:8px}
  h2{font-size:1.1rem;color:#4F46E5;margin-top:24px}
  h3{font-size:1rem;margin:0 0 8px}
  .meta{font-size:.8rem;color:#666;margin-bottom:24px}
  .ltr{direction:ltr;unicode-bidi:isolate;display:inline-block}
  hr{border:none;border-top:1px solid #e5e7eb;margin:16px 0}
  ul,ol{padding-inline-start:20px;padding-left:0}
  li{margin-bottom:4px;line-height:1.5}
  p{line-height:1.6}
  section{margin-bottom:16px}
  @media print{body{padding:16px}}
  ${isArabic ? 'body{direction:rtl;text-align:right}.meta{direction:rtl}' : ''}
</style>
</head>
<body>
<h1>${mainTitle}</h1>
<div class="meta">${metaItems.join(' &nbsp;|&nbsp; ')}</div>
<hr>${body}
</body></html>`);
    w.document.close();
    w.print();
  }, [aiResult, language, detailLevel, outputStyle, projectType, sections, clientFacingMode, showToast]);

  const handleGenerate = async () => {
    if (requestText.trim().length < 10) {
      showToast('Request too short (min 10 characters)', 'warning');
      return;
    }
    setIsGenerating(true);
    setIsGenerated(false);
    try {
      const res = await fetch('/api/ai/srs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientRequest: requestText,
          language,
          detailLevel,
          outputStyle,
          projectType,
          enabledSections: sections,
          clientFacingMode,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || 'Generation failed');
      setAiResult(result.data);
      setIsGenerated(true);
      if (result.providerUsed === 'qwen') {
        showToast('SRS generated via Qwen AI (Gemini temporarily unavailable)', 'info');
      } else if (result.providerUsed === 'local_fallback') {
        showToast('All AI providers unavailable — demo SRS loaded', 'warning');
      } else {
        showToast('SRS generated successfully', 'success');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to generate SRS', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSection = (key: string) => {
    setSections(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const frList = FR_DATA[detailLevel];
  const enabledSectionCount = Object.values(sections).filter(Boolean).length;
  const complexity = computeComplexity(detailLevel, projectType);
  const techStack = TECH_STACKS[projectType] ?? TECH_STACKS['web-app'];

  return (
    <>
      <Header />
      <div className="page-container animate-fade-in">

        {/* Page Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
              <p className="page-label" style={{ margin: 0 }}>AI Laboratory</p>
              <span className="demo-badge"><i className="fa-solid fa-bolt"></i> Gemini AI</span>
            </div>
            <h1 className="page-title">Smart SRS Generator</h1>
            <p className="page-subtitle">Transform raw client requests into professional Software Requirements Specifications.</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-secondary" onClick={handleSaveDraft}>
              <i className="fa-regular fa-floppy-disk"></i> Save Draft
            </button>
            <button className="btn btn-primary" onClick={handleExportPdf}>
              <i className="fa-solid fa-file-arrow-down"></i> Export PDF
            </button>
          </div>
        </div>

        {/* SRS Options Panel */}
        <div className="opts-panel" style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-lg)', alignItems: 'flex-end' }}>
          <div>
            <span className="opts-label">Output Language</span>
            <div className="seg-control">
              {(['english', 'arabic', 'bilingual'] as Language[]).map(l => (
                <button key={l} className={`seg-btn${language === l ? ' active' : ''}`} onClick={() => setLanguage(l)}>
                  {l === 'english' ? 'English' : l === 'arabic' ? 'Arabic' : 'Bilingual'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="opts-label">Detail Level</span>
            <div className="seg-control">
              {(['concise', 'standard', 'detailed'] as DetailLevel[]).map(d => (
                <button key={d} className={`seg-btn${detailLevel === d ? ' active' : ''}`} onClick={() => setDetailLevel(d)}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="opts-label">Output Style</span>
            <div className="seg-control">
              {([['business', 'Business'], ['technical', 'Technical'], ['client', 'Client-Facing']] as [OutputStyle, string][]).map(([val, label]) => (
                <button key={val} className={`seg-btn${outputStyle === val ? ' active' : ''}`} onClick={() => setOutputStyle(val)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="opts-label">Project Type</span>
            <select
              value={projectType}
              onChange={e => setProjectType(e.target.value)}
              style={{ height: '30px', paddingLeft: '0.625rem', paddingRight: '1.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--text-primary)', background: 'white', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', outline: 'none', cursor: 'pointer', appearance: 'auto' }}
            >
              {PROJECT_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <span className="opts-label">Sections Enabled</span>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-primary)' }}>{enabledSectionCount} / {Object.keys(sections).length}</div>
          </div>
          <div className="toggle-row" style={{ gap: 'var(--spacing-md)', padding: 0 }}>
            <span className="opts-label" style={{ marginBottom: 0 }}>Client-Facing Mode</span>
            <button
              className={`toggle-switch${clientFacingMode ? ' on' : ''}`}
              onClick={() => setClientFacingMode(v => !v)}
              aria-label="Toggle client-facing mode"
            />
          </div>
        </div>

        {/* Client Request */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="card-header">
            <h2 className="card-title">
              <i className="fa-regular fa-envelope text-accent"></i>
              Client Request
            </h2>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
              <span className="badge badge-info"><i className="fa-solid fa-language"></i> Arabic Detected</span>
              <button className="btn btn-ghost btn-sm" onClick={() => { setRequestText(SAMPLE_REQUEST); showToast('Sample request loaded', 'info'); }}>
                <i className="fa-solid fa-wand-magic-sparkles"></i> Sample
              </button>
            </div>
          </div>

          <textarea
            className="form-textarea"
            value={requestText}
            onChange={e => setRequestText(e.target.value)}
            rows={4}
            dir={language === 'arabic' ? 'rtl' : 'ltr'}
            style={{ marginBottom: 'var(--spacing-sm)', textAlign: language === 'arabic' ? 'right' : 'left', fontFamily: language !== 'english' ? 'var(--font-display)' : 'var(--font-sans)', fontSize: language !== 'english' ? '1rem' : '0.9375rem', lineHeight: 1.8 }}
            placeholder="Paste your client request here..."
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-xs text-muted">{requestText.length} characters</span>
            <button className="btn btn-primary" onClick={handleGenerate} disabled={isGenerating || requestText.trim().length === 0}>
              {isGenerating
                ? <><i className="fa-solid fa-spinner fa-spin"></i> Generating...</>
                : <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate SRS</>}
            </button>
          </div>
        </div>

        {/* Section Toggles */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-sliders text-accent"></i> Include Sections</h2>
            <button className="btn btn-ghost btn-sm text-muted" onClick={() => setSections(Object.fromEntries(Object.keys(sections).map(k => [k, true])) as typeof sections)}>Enable All</button>
          </div>
          <div className="grid-2col" style={{ gap: '2px var(--spacing-md)' }}>
            {(Object.keys(sections) as (keyof typeof sections)[]).map(key => (
              <div key={key} className="toggle-row">
                <span className="toggle-row-label text-sm">{t(key, language)}</span>
                <button
                  className={`toggle-switch${sections[key] ? ' on' : ''}`}
                  onClick={() => toggleSection(key)}
                  aria-label={`Toggle ${key}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Generated Output */}
        {isGenerating && (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>
            <i className="fa-solid fa-spinner fa-spin text-accent" style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}></i>
            <p className="text-secondary font-medium">Analyzing client request and generating SRS...</p>
            <p className="text-xs text-muted" style={{ marginTop: '6px' }}>This usually takes a few seconds</p>
          </div>
        )}

        {isGenerated && !isGenerating && aiResult && (
          <>
            {/* Confidence Score */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-md)' }}>
              <div style={{ padding: 'var(--spacing-xs) var(--spacing-md)', borderRadius: 'var(--radius-full)', background: aiResult.confidenceScore >= 80 ? 'rgba(5, 150, 105, 0.1)' : 'rgba(217, 119, 6, 0.1)', border: `1px solid ${aiResult.confidenceScore >= 80 ? 'rgba(5, 150, 105, 0.3)' : 'rgba(217, 119, 6, 0.3)'}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className={`fa-solid fa-gauge-high ${aiResult.confidenceScore >= 80 ? 'text-success' : 'text-warning'}`}></i>
                <span className="text-xs font-bold">AI Confidence: {aiResult.confidenceScore}%</span>
              </div>
            </div>

            {/* Project Brief + User Roles */}
            {(sections.projectBrief || sections.userRoles) && (
              <div className="layout-sidebar-right" style={{ marginBottom: 'var(--spacing-lg)' }}>

                {sections.projectBrief && (
                  <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="card-header">
                      <h2 className="card-title">
                        <i className="fa-regular fa-file-lines text-accent"></i>
                        {t('projectBrief', language)}
                      </h2>
                      {outputStyle === 'technical' && <span className="badge badge-info">Technical</span>}
                      {outputStyle === 'client' && <span className="badge badge-accent">Client-Facing</span>}
                    </div>
                    <h3 className="font-semibold" style={{ marginBottom: 'var(--spacing-sm)', fontSize: '1.1rem' }}>{aiResult.projectBrief.projectName}</h3>
                    {aiResult.projectBrief.clientName && <div className="text-xs text-muted" style={{ marginBottom: 'var(--spacing-sm)' }}>Client: {aiResult.projectBrief.clientName}</div>}
                    <p className="text-sm leading-relaxed text-secondary" style={{ marginBottom: 'var(--spacing-xl)' }}>
                      {aiResult.projectBrief.summary}
                    </p>
                    <div className="grid grid-cols-3" style={{ marginTop: 'auto', gap: 'var(--spacing-md)' }}>
                      {[
                        { label: 'Complexity', value: aiResult.projectBrief.complexity },
                        { label: 'Infrastructure', value: projectType === 'saas' ? 'SaaS / Multi-Tenant' : 'Cloud-Native' },
                        { label: 'Industry', value: aiResult.projectBrief.industry },
                      ].map(item => (
                        <div key={item.label} style={{ background: 'var(--bg-main)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: 'var(--glass-border)' }}>
                          <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>{item.label}</div>
                          <div className="text-sm font-bold" style={{ textTransform: 'capitalize' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sections.userRoles && (
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title"><i className="fa-solid fa-users" style={{ color: 'var(--status-warning)' }}></i>{t('userRoles', language)}</h2>
                      <span className="badge badge-neutral">{aiResult.userRoles.length} Roles</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                      {aiResult.userRoles.map((role, i) => {
                        const icons = [
                          { icon: 'fa-regular fa-user', color: 'var(--status-info)', bg: 'var(--status-info-bg)' },
                          { icon: 'fa-solid fa-shield-halved', color: 'var(--accent-primary)', bg: 'rgba(37, 99, 235, 0.08)' },
                          { icon: 'fa-solid fa-briefcase-medical', color: 'var(--status-success)', bg: 'var(--status-success-bg)' },
                          { icon: 'fa-solid fa-user-gear', color: 'var(--status-warning)', bg: 'rgba(217, 119, 6, 0.08)' },
                          { icon: 'fa-solid fa-user-tie', color: 'var(--text-muted)', bg: 'var(--bg-surface)' },
                        ];
                        const iconData = icons[i % icons.length];
                        return (
                          <div key={i} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                            <div className="list-item-icon" style={{ background: iconData.bg, color: iconData.color, flexShrink: 0 }}>
                              <i className={iconData.icon}></i>
                            </div>
                            <div>
                              <div className="font-semibold text-sm">{role.role}</div>
                              <div className="text-xs text-muted" style={{ marginTop: '2px', lineHeight: 1.5 }}>{role.description}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Main Features + Functional Requirements */}
            {(sections.mainFeatures || sections.functionalReqs) && (
              <div className="grid grid-cols-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
                {sections.mainFeatures && (
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title"><i className="fa-regular fa-square-check" style={{ color: 'var(--status-success)' }}></i>{t('mainFeatures', language)}</h2>
                      <span className="badge badge-success">{aiResult.mainFeatures.length} Confirmed</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {aiResult.mainFeatures.map((f, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--status-success-bg)', border: '1px solid var(--status-success-border)', borderRadius: 'var(--radius-md)' }}>
                          <div>
                            <span className="text-sm font-semibold">{f.title}</span>
                            <div className="text-xs text-muted" style={{ marginTop: '2px' }}>{f.description}</div>
                          </div>
                          <i className="fa-solid fa-circle-check" style={{ color: 'var(--status-success)', flexShrink: 0 }}></i>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {sections.functionalReqs && (
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title"><i className="fa-solid fa-list-check" style={{ color: 'var(--status-info)' }}></i>{t('functionalReqs', language)}</h2>
                      <span className="badge badge-info">{aiResult.functionalRequirements.length} Requirements</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', maxHeight: '500px', overflowY: 'auto' }}>
                      {aiResult.functionalRequirements.map(fr => (
                        <div key={fr.id} style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                          <div style={{ background: 'var(--status-info-bg)', color: 'var(--status-info)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', fontWeight: 700, flexShrink: 0, marginTop: '2px', border: '1px solid var(--status-info-border)' }}>{fr.id}</div>
                          <div>
                            <div className="text-sm font-semibold">{fr.title}</div>
                            <div className="text-xs text-muted" style={{ marginTop: '3px', lineHeight: 1.5, fontStyle: 'italic' }}>{fr.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Non-Functional Requirements */}
            {sections.nonFunctionalReqs && (
              <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="card-header">
                  <h2 className="card-title"><i className="fa-solid fa-gauge-high" style={{ color: 'var(--accent-ai)' }}></i>{t('nonFunctionalReqs', language)}</h2>
                  <span className="badge badge-neutral">{aiResult.nonFunctionalRequirements.length} Constraints</span>
                </div>
                <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-md)' }}>
                  {aiResult.nonFunctionalRequirements.map((nfr, i) => (
                    <div key={i} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--accent-ai)', padding: '2px 7px', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', fontWeight: 700 }}>NFR-{String(i + 1).padStart(2, '0')}</span>
                        <span className="text-sm font-semibold">{nfr.category}</span>
                      </div>
                      <p className="text-xs text-muted" style={{ lineHeight: 1.5 }}>{nfr.requirement}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Gaps + MVP Scope */}
            {(sections.missingQuestions || sections.mvpScope) && (
              <div className="grid grid-cols-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
                {sections.missingQuestions && (
                  <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="card-header">
                      <h2 className="card-title">
                        <i className="fa-regular fa-circle-question text-accent"></i>
                        {clientFacingMode
                          ? (language === 'arabic' ? 'أسئلة التوضيح' : language === 'bilingual' ? 'Clarification Questions / أسئلة التوضيح' : 'Clarification Questions')
                          : t('missingQuestions', language)}
                      </h2>
                      <span className="badge badge-warning">{aiResult.missingQuestions.length} Open</span>
                    </div>
                    <p className="text-sm text-muted" style={{ marginBottom: 'var(--spacing-lg)' }}>
                      {clientFacingMode ? 'Items we recommend clarifying before development begins:' : 'Missing information required for a high-fidelity SRS:'}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                      {aiResult.missingQuestions.map((q, i) => (
                        <div key={i} style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start', padding: 'var(--spacing-sm) var(--spacing-md)', background: 'rgba(217, 119, 6, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-warning-border)' }}>
                          <i className="fa-regular fa-circle-question text-accent" style={{ marginTop: '3px', flexShrink: 0 }}></i>
                          <div className="text-sm">{q}</div>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-secondary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => showToast('Clarification request sent to client', 'success')}>
                      <i className="fa-solid fa-paper-plane"></i> Request Clarifications from Client
                    </button>
                  </div>
                )}
                {sections.mvpScope && (
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title"><i className="fa-solid fa-rocket text-accent"></i>{t('mvpScope', language)}</h2>
                      <span className="badge badge-accent">{aiResult.mvpScope.length} Items</span>
                    </div>
                    <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--border-subtle)', marginLeft: '8px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', marginTop: 'var(--spacing-md)' }}>
                      {aiResult.mvpScope.map((item, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <div style={{ position: 'absolute', left: '-30px', top: '3px', width: '10px', height: '10px', borderRadius: '50%', background: i === 0 ? 'var(--accent-primary)' : 'var(--border-strong)', boxShadow: i === 0 ? '0 0 0 4px rgba(37, 99, 235, 0.2)' : 'none' }}></div>
                          <div className="text-sm font-semibold" style={{ marginBottom: '4px', color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Phase {i + 1}</div>
                          <div className="text-xs text-muted" style={{ lineHeight: 1.6 }}>{item}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Assumptions */}
            {sections.assumptions && (
              <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="card-header">
                  <h2 className="card-title"><i className="fa-solid fa-lightbulb" style={{ color: 'var(--status-warning)' }}></i>{t('assumptions', language)}</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {aiResult.assumptions.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 'var(--spacing-sm)', padding: '8px 12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <i className="fa-solid fa-circle-dot text-muted" style={{ marginTop: '3px', fontSize: '0.625rem', flexShrink: 0 }}></i>
                      <span className="text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Stories - generated from roles */}
            {sections.userStories && (
              <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="card-header">
                  <h2 className="card-title"><i className="fa-regular fa-comment-dots text-accent"></i>{t('userStories', language)}</h2>
                  <span className="badge badge-neutral">{aiResult.userRoles.length} Stories</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {aiResult.userRoles.map((role, i) => (
                    <div key={i} style={{ padding: 'var(--spacing-md)', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--accent-primary)' }}>
                      <div className="text-xs font-bold text-accent uppercase tracking-wider" style={{ marginBottom: '4px' }}>As a {role.role}</div>
                      <p className="text-sm">{role.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acceptance Criteria - derived from NFRs */}
            {sections.acceptanceCriteria && aiResult.nonFunctionalRequirements.length > 0 && (
              <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="card-header">
                  <h2 className="card-title"><i className="fa-solid fa-check-double" style={{ color: 'var(--status-success)' }}></i>{t('acceptanceCriteria', language)}</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {aiResult.nonFunctionalRequirements.map((nfr, i) => (
                    <div key={i} style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start', padding: '8px 12px', background: 'var(--status-success-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-success-border)' }}>
                      <i className="fa-solid fa-circle-check text-success" style={{ marginTop: '2px', fontSize: '0.75rem', flexShrink: 0 }}></i>
                      <span className="text-sm">{nfr.requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complexity + Tech Stack */}
            <div className="grid grid-cols-2" style={{ marginBottom: 'var(--spacing-lg)' }}>

              <div className="card content-gap">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fa-solid fa-gauge-high" style={{ color: 'var(--accent-ai)' }}></i>
                    AI Complexity Estimate
                  </h2>
                  <span className={`badge ${complexity.score < 65 ? 'badge-success' : complexity.score < 80 ? 'badge-warning' : 'badge-danger'}`}>
                    {complexity.label}
                  </span>
                </div>
                <div style={{ textAlign: 'center', padding: 'var(--spacing-sm) 0' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1, color: complexity.score < 65 ? 'var(--status-success)' : complexity.score < 80 ? 'var(--status-warning)' : 'var(--status-danger)' }}>
                    {complexity.score}
                  </div>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginTop: '4px' }}>Complexity Score / 100</div>
                  <div className="progress-container" style={{ marginTop: 'var(--spacing-md)', height: '8px' }}>
                    <div className="progress-bar" style={{ width: `${complexity.score}%`, background: complexity.score < 65 ? 'var(--status-success)' : complexity.score < 80 ? 'var(--status-warning)' : 'var(--status-danger)' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-sm)' }}>
                  {[
                    { label: 'Timeline', value: complexity.weeks + ' weeks' },
                    { label: 'Team Size', value: complexity.team },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'var(--bg-main)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>{item.label}</div>
                      <div className="text-sm font-bold">{item.value}</div>
                    </div>
                  ))}
                </div>
                {clientFacingMode && (
                  <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                    <div className="text-xs font-bold" style={{ color: 'var(--accent-ai)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Client Summary</div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      This project requires approximately <strong>{complexity.weeks} weeks</strong> with a team of <strong>{complexity.team}</strong>.
                    </p>
                  </div>
                )}
              </div>

              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fa-solid fa-layer-group" style={{ color: 'var(--status-info)' }}></i>
                    Recommended Tech Stack
                  </h2>
                  <span className="badge badge-info">{PROJECT_TYPES.find(p => p.value === projectType)?.label}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {([
                    { layer: 'Frontend', value: techStack.frontend, icon: 'fa-solid fa-display', color: 'var(--accent-primary)', bg: 'rgba(37,99,235,0.08)' },
                    { layer: 'Backend', value: techStack.backend, icon: 'fa-solid fa-server', color: 'var(--status-success)', bg: 'var(--status-success-bg)' },
                    { layer: 'Database', value: techStack.db, icon: 'fa-solid fa-database', color: 'var(--status-warning)', bg: 'var(--status-warning-bg)' },
                    { layer: 'Infra/Deploy', value: techStack.infra, icon: 'fa-solid fa-cloud-arrow-up', color: 'var(--status-info)', bg: 'var(--status-info-bg)' },
                  ] as { layer: string; value: string; icon: string; color: string; bg: string }[]).map(row => (
                    <div key={row.layer} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', padding: '8px var(--spacing-md)', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div className="list-item-icon" style={{ background: row.bg, color: row.color, width: '32px', height: '32px', flexShrink: 0, fontSize: '0.875rem' }}>
                        <i className={row.icon}></i>
                      </div>
                      <div>
                        <div className="text-xs text-muted font-semibold uppercase tracking-wider">{row.layer}</div>
                        <div className="text-sm font-bold" style={{ marginTop: '2px' }}>{row.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {!clientFacingMode && (
                  <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 'var(--spacing-md)' }} onClick={() => showToast('Tech stack locked in', 'success')}>
                    <i className="fa-solid fa-lock"></i> Lock Stack Selection
                  </button>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="card card-accent" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-lg)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Ready to finalize?</h2>
                <p className="text-sm text-muted" style={{ lineHeight: 1.7 }}>
                  The AI has analyzed your request and structured the initial scope.
                  Push this to the Contracts module or refine the requirements further.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', flex: '0 0 auto', width: '100%', maxWidth: '260px' }}>
                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => showToast('SRS pushed to Contracts', 'success')}>
                  <i className="fa-solid fa-file-signature"></i> Push to Contracts
                </button>
                <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => showToast('Requirements saved for refinement', 'info')}>
                  Refine Requirements
                </button>
              </div>
              <div style={{ fontSize: '5rem', opacity: 0.06, color: 'var(--accent-primary)', pointerEvents: 'none', position: 'absolute', right: '40px' }}>
                <i className="fa-solid fa-chart-network"></i>
              </div>
            </div>
          </>
        )}

      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <i className={TOAST_ICONS[toast.type]}></i>
          {toast.msg}
        </div>
      )}
    </>
  );
}
