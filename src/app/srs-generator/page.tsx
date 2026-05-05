'use client';
import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import type { ProjectIntelligenceOutput, TechnicalBlueprintOutput } from '@/lib/ai/schemas/projectIntelligence';

type Language = 'english' | 'arabic' | 'bilingual';
type DetailLevel = 'concise' | 'standard' | 'detailed';
type AnalysisDepth = 'quick' | 'standard' | 'deep';
type OutputStyle = 'business' | 'technical' | 'client';
type ToastType = 'success' | 'info' | 'warning' | 'error';
type Tab = 'overview' | 'analysis' | 'rules' | 'blueprint' | 'plan' | 'decision';

const SAMPLE_REQUEST = `نحتاج نظام حجوزات للعيادات يشمل موقع للحجز، لوحة تحكم للإدارة، إدارة المواعيد، إشعارات للمراجعين، وتقارير بسيطة للإدارة.`;

const DETAIL_TO_DEPTH: Record<DetailLevel, AnalysisDepth> = {
  concise: 'quick',
  standard: 'standard',
  detailed: 'deep',
};

const PROJECT_TYPES = [
  { value: 'web-app', label: 'Web App' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'saas', label: 'SaaS Platform' },
  { value: 'api', label: 'API / Backend' },
  { value: 'enterprise', label: 'Enterprise System' },
];

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

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'fa-regular fa-circle-info' },
  { id: 'analysis', label: 'Business Analysis', icon: 'fa-solid fa-chart-line' },
  { id: 'rules', label: 'Business Rules', icon: 'fa-solid fa-scale-balanced' },
  { id: 'blueprint', label: 'Technical Blueprint', icon: 'fa-regular fa-file-lines' },
  { id: 'plan', label: 'Execution Plan', icon: 'fa-solid fa-route' },
  { id: 'decision', label: 'Decision', icon: 'fa-solid fa-gavel' },
];

const PRIORITY_BADGE: Record<'low' | 'medium' | 'high' | 'critical', string> = {
  low: 'badge-neutral',
  medium: 'badge-info',
  high: 'badge-warning',
  critical: 'badge-danger',
};

const RECOMMENDATION_BADGE: Record<'build' | 'reconsider' | 'needs_validation', { className: string; label: string }> = {
  build: { className: 'badge-success', label: 'Build' },
  reconsider: { className: 'badge-danger', label: 'Reconsider' },
  needs_validation: { className: 'badge-warning', label: 'Needs Validation' },
};

const DECISION_BADGE: Record<'yes' | 'no' | 'conditional', { className: string; label: string }> = {
  yes: { className: 'badge-success', label: 'Go — Yes' },
  no: { className: 'badge-danger', label: 'No-Go' },
  conditional: { className: 'badge-warning', label: 'Conditional' },
};

const LEVEL_BADGE: Record<'low' | 'medium' | 'high', string> = {
  low: 'badge-neutral',
  medium: 'badge-info',
  high: 'badge-success',
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

function isArabicText(s: string): boolean {
  return /[؀-ۿ]/.test(s);
}

function dirFor(s: string, language: Language): 'rtl' | 'ltr' {
  if (language === 'arabic') return 'rtl';
  if (language === 'bilingual') return isArabicText(s) ? 'rtl' : 'ltr';
  return 'ltr';
}

export default function ProjectIntelligencePage() {
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
  const [pipelineData, setPipelineData] = useState<ProjectIntelligenceOutput | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [providerUsed, setProviderUsed] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const blueprint: TechnicalBlueprintOutput | null = pipelineData?.technicalBlueprint ?? null;

  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleSaveDraft = useCallback(() => {
    if (!pipelineData) {
      showToast('Analyze a project request first before saving a draft', 'warning');
      return;
    }
    const draft = {
      timestamp: new Date().toISOString(),
      options: { language, detailLevel, outputStyle, projectType, sections, clientFacingMode },
      requestText,
      pipeline: pipelineData,
    };
    try {
      localStorage.setItem('docupilot_pi_draft', JSON.stringify(draft));
      showToast('Draft saved successfully', 'success');
    } catch {
      showToast('Failed to save draft (storage full?)', 'error');
    }
  }, [pipelineData, language, detailLevel, outputStyle, projectType, sections, clientFacingMode, requestText, showToast]);

  const handleExportPdf = useCallback(() => {
    if (!blueprint) {
      showToast('Analyze a project request first before exporting', 'warning');
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

    const PDF_AR: Record<string, string> = {
      title: 'وثيقة المخطط التقني',
      projectBrief: 'ملخص المشروع',
      userRoles: 'أدوار المستخدمين',
      mainFeatures: 'الميزات الرئيسية',
      functionalReqs: 'المتطلبات الوظيفية',
      nonFunctionalReqs: 'المتطلبات غير الوظيفية',
      missingQuestions: 'الفجوات والأسئلة المفتوحة',
      clarificationQuestions: 'أسئلة التوضيح',
      mvpScope: 'نطاق النسخة الأولية',
      assumptions: 'الافتراضات والقيود',
      generated: 'تاريخ الإنشاء',
      language: 'اللغة',
      style: 'النمط',
      detail: 'مستوى التفصيل',
      projectType: 'نوع المشروع',
      confidence: 'نسبة الثقة',
      industry: 'المجال',
      complexity: 'درجة التعقيد',
    };

    const pdfL = (key: string, en: string): string => isArabic ? (PDF_AR[key] ?? en) : en;
    const gapLabel = isArabic
      ? (clientFacingMode ? PDF_AR.clarificationQuestions : PDF_AR.missingQuestions)
      : (clientFacingMode ? 'Clarification Questions' : 'AI Identified Gaps');

    const projectLabel = PROJECT_TYPES.find(p => p.value === projectType)?.label ?? projectType;
    const ltrId = (id: string) => `<span class="ltr">${id}</span>`;
    const sec = (title: string, content: string) =>
      `<section><h2>${title}</h2>${content}</section><hr>`;

    let body = '';
    if (sections.projectBrief) {
      body += sec(pdfL('projectBrief', 'Project Brief'), `
        <h3>${blueprint.projectBrief.projectName}</h3>
        <p>
          <strong>${pdfL('industry', 'Industry')}:</strong> ${blueprint.projectBrief.industry}
          &nbsp;|&nbsp;
          <strong>${pdfL('complexity', 'Complexity')}:</strong> ${blueprint.projectBrief.complexity}
        </p>
        <p>${blueprint.projectBrief.summary}</p>`);
    }
    if (sections.userRoles) {
      body += sec(pdfL('userRoles', 'User Roles'), blueprint.userRoles.map(r =>
        `<p><strong>${r.role}</strong> — ${r.description}</p>`).join(''));
    }
    if (sections.mainFeatures) {
      body += sec(pdfL('mainFeatures', 'Main Features'), '<ul>' + blueprint.mainFeatures.map(f =>
        `<li><strong>${f.title}</strong> (${f.priority}): ${f.description}</li>`).join('') + '</ul>');
    }
    if (sections.functionalReqs) {
      body += sec(pdfL('functionalReqs', 'Functional Requirements'), '<ul>' + blueprint.functionalRequirements.map(fr =>
        `<li>${ltrId(fr.id)} <strong>${fr.title}</strong>: ${fr.description}</li>`).join('') + '</ul>');
    }
    if (sections.nonFunctionalReqs) {
      body += sec(pdfL('nonFunctionalReqs', 'Non-Functional Requirements'), '<ul>' + blueprint.nonFunctionalRequirements.map(nfr =>
        `<li><strong>${nfr.category}:</strong> ${nfr.requirement}</li>`).join('') + '</ul>');
    }
    if (sections.missingQuestions) {
      body += sec(gapLabel, '<ul>' + blueprint.missingQuestions.map(q =>
        `<li>${q}</li>`).join('') + '</ul>');
    }
    if (sections.mvpScope) {
      body += sec(pdfL('mvpScope', 'MVP Scope'), '<ol>' + blueprint.mvpScope.map(s =>
        `<li>${s}</li>`).join('') + '</ol>');
    }
    if (sections.assumptions) {
      body += sec(pdfL('assumptions', 'Assumptions & Constraints'), '<ul>' + blueprint.assumptions.map(a =>
        `<li>${a}</li>`).join('') + '</ul>');
    }

    const metaItems = isArabic
      ? [
          `${PDF_AR.generated}: ${date}`,
          `${PDF_AR.language}: عربي`,
          `${PDF_AR.style}: ${outputStyle}${clientFacingMode ? ' (عميل)' : ''}`,
          `${PDF_AR.detail}: ${detailLevel}`,
          `${PDF_AR.projectType}: ${projectLabel}`,
          `${PDF_AR.confidence}: ${blueprint.confidenceScore}%`,
        ]
      : [
          `Generated: ${date}`,
          `Language: ${language}`,
          `Style: ${outputStyle}${clientFacingMode ? ' (Client-Facing)' : ''}`,
          `Detail: ${detailLevel}`,
          `Project Type: ${projectLabel}`,
          `AI Confidence: ${blueprint.confidenceScore}%`,
        ];

    const mainTitle = isArabic ? PDF_AR.title : 'Technical Blueprint';

    w.document.write(`<!DOCTYPE html>
<html lang="${htmlLang}" dir="${dir}">
<head>
<meta charset="UTF-8">
<title>Blueprint — ${blueprint.projectBrief.projectName}</title>
<style>
  body{font-family:Arial,sans-serif;max-width:860px;margin:0 auto;padding:32px;color:#111}
  h1{font-size:1.6rem;border-bottom:2px solid #2563EB;padding-bottom:8px}
  h2{font-size:1.1rem;color:#2563EB;margin-top:24px}
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
  }, [blueprint, language, detailLevel, outputStyle, projectType, sections, clientFacingMode, showToast]);

  const handleGenerate = async () => {
    if (requestText.trim().length < 10) {
      showToast('Request too short (min 10 characters)', 'warning');
      return;
    }
    setIsGenerating(true);
    setIsGenerated(false);
    try {
      const res = await fetch('/api/ai/project-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientRequest: requestText,
          language,
          analysisDepth: DETAIL_TO_DEPTH[detailLevel],
          includeTechnicalBlueprint: true,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || 'Analysis failed');
      setPipelineData(result.data);
      setUsedFallback(!!result.usedFallback);
      setProviderUsed(result.providerUsed ?? null);
      setIsGenerated(true);
      setActiveTab('overview');
      if (result.providerUsed === 'qwen') {
        showToast('Project Intelligence generated via Qwen (Gemini unavailable)', 'info');
      } else if (result.providerUsed === 'local_fallback') {
        showToast('All AI providers unavailable — demo report loaded', 'warning');
      } else {
        showToast('Project Intelligence generated successfully', 'success');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to analyze project request', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSection = (key: string) => {
    setSections(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
              <p className="page-label" style={{ margin: 0 }}>AI Laboratory</p>
              <span className="demo-badge"><i className="fa-solid fa-bolt"></i> Gemini AI</span>
              {usedFallback && (
                <span className="badge badge-warning" title={providerUsed ?? ''}>
                  <i className="fa-solid fa-shield-halved"></i> Fallback Mode
                </span>
              )}
            </div>
            <h1 className="page-title">Project Intelligence Engine</h1>
            <p className="page-subtitle">
              Turn client requests into business analysis, rules, technical scope, execution plan, and a build decision.
            </p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-secondary" onClick={handleSaveDraft}>
              <i className="fa-regular fa-floppy-disk"></i> Save Draft
            </button>
            <button className="btn btn-primary" onClick={handleExportPdf}>
              <i className="fa-solid fa-file-arrow-down"></i> Export Blueprint PDF
            </button>
          </div>
        </div>

        {/* Options Panel */}
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
            <span className="opts-label">Analysis Depth</span>
            <div className="seg-control">
              {(['concise', 'standard', 'detailed'] as DetailLevel[]).map(d => (
                <button key={d} className={`seg-btn${detailLevel === d ? ' active' : ''}`} onClick={() => setDetailLevel(d)}>
                  {d === 'concise' ? 'Quick' : d === 'standard' ? 'Standard' : 'Deep'}
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
            <span className="opts-label">Blueprint Sections</span>
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
                ? <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing...</>
                : <><i className="fa-solid fa-wand-magic-sparkles"></i> Analyze Project Request</>}
            </button>
          </div>
        </div>

        {/* Section Toggles (control what renders inside the Technical Blueprint tab) */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-sliders text-accent"></i> Blueprint Sections</h2>
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

        {/* Loading state */}
        {isGenerating && (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>
            <i className="fa-solid fa-spinner fa-spin text-accent" style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}></i>
            <p className="text-secondary font-medium">Running the Project Intelligence pipeline...</p>
            <p className="text-xs text-muted" style={{ marginTop: '6px' }}>Business understanding · analysis · rules · blueprint · plan · decision</p>
          </div>
        )}

        {/* Empty state — before first analysis */}
        {!isGenerating && !isGenerated && (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-lg)' }}>
            <i className="fa-solid fa-diagram-project text-accent" style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)', opacity: 0.6 }}></i>
            <p className="text-secondary font-medium">Submit a client request above to run the full Project Intelligence pipeline.</p>
            <p className="text-xs text-muted" style={{ marginTop: '6px' }}>You will get business understanding, analysis, rules, technical blueprint, execution plan, and a final build decision.</p>
          </div>
        )}

        {/* Tab nav + tab content */}
        {isGenerated && !isGenerating && pipelineData && (
          <>
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-sm)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ flex: '1 1 auto', minWidth: '140px' }}
                  >
                    <i className={tab.icon}></i> {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'overview' && (
              <OverviewTabContent data={pipelineData} language={language} />
            )}

            {activeTab === 'analysis' && (
              <AnalysisTabContent data={pipelineData} language={language} />
            )}

            {activeTab === 'rules' && (
              <RulesTabContent data={pipelineData} language={language} />
            )}

            {activeTab === 'blueprint' && blueprint && (
              <BlueprintTabContent
                blueprint={blueprint}
                sections={sections}
                language={language}
                outputStyle={outputStyle}
                clientFacingMode={clientFacingMode}
                projectType={projectType}
                complexity={complexity}
                techStack={techStack}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'plan' && (
              <PlanTabContent data={pipelineData} language={language} />
            )}

            {activeTab === 'decision' && (
              <DecisionTabContent data={pipelineData} language={language} onShowToast={showToast} />
            )}
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

// ─── Tab content components ─────────────────────────────────────────────────

function OverviewTabContent({ data, language }: { data: ProjectIntelligenceOutput; language: Language }) {
  const u = data.businessUnderstanding;
  return (
    <>
      <div className="layout-sidebar-right" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><i className="fa-regular fa-lightbulb text-accent"></i> Problem & Goal</h2>
            <span className="badge badge-info">{u.confidenceScore}% confidence</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div>
              <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Problem</div>
              <p className="text-sm leading-relaxed" dir={dirFor(u.problem, language)}>{u.problem}</p>
            </div>
            <div>
              <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Business Goal</div>
              <p className="text-sm leading-relaxed" dir={dirFor(u.businessGoal, language)}>{u.businessGoal}</p>
            </div>
            <div>
              <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Value Proposition</div>
              <p className="text-sm leading-relaxed" dir={dirFor(u.valueProposition, language)}>{u.valueProposition}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-users text-accent"></i> Target Users</h2>
            <span className="badge badge-neutral">{u.targetUsers.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {u.targetUsers.map((tu, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                <i className="fa-regular fa-user text-accent" style={{ marginTop: '3px', flexShrink: 0 }}></i>
                <span className="text-sm" dir={dirFor(tu, language)}>{tu}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-list-check" style={{ color: 'var(--status-info)' }}></i> Core Use Cases</h2>
            <span className="badge badge-info">{u.coreUseCases.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {u.coreUseCases.map((uc, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'var(--status-info-bg)', border: '1px solid var(--status-info-border)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                <span style={{ background: 'var(--status-info)', color: 'white', padding: '2px 7px', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="text-sm" dir={dirFor(uc, language)}>{uc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><i className="fa-regular fa-circle-question" style={{ color: 'var(--status-warning)' }}></i> Missing Information</h2>
            <span className="badge badge-warning">{u.missingInformation.length}</span>
          </div>
          <p className="text-sm text-muted" style={{ marginBottom: 'var(--spacing-md)' }}>Items the AI flagged as needing clarification before commitment.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {u.missingInformation.map((q, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'rgba(217, 119, 6, 0.05)', border: '1px solid var(--status-warning-border)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                <i className="fa-regular fa-circle-question text-warning" style={{ marginTop: '3px', flexShrink: 0 }}></i>
                <span className="text-sm" dir={dirFor(q, language)}>{q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {u.assumptions.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-lightbulb" style={{ color: 'var(--status-warning)' }}></i> Assumptions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {u.assumptions.map((a, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                <i className="fa-solid fa-circle-dot text-muted" style={{ marginTop: '5px', fontSize: '0.625rem', flexShrink: 0 }}></i>
                <span className="text-sm" dir={dirFor(a, language)}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function AnalysisTabContent({ data, language }: { data: ProjectIntelligenceOutput; language: Language }) {
  const a = data.businessAnalysis;
  const rec = RECOMMENDATION_BADGE[a.recommendation];
  return (
    <>
      <div className="grid grid-cols-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-chart-line text-accent"></i> Commercial Outlook</h2>
            <span className={`badge ${rec.className}`}>{rec.label}</span>
          </div>
          <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
            {[
              { label: 'Revenue Potential', value: a.revenuePotential, badge: LEVEL_BADGE[a.revenuePotential] },
              { label: 'Cost Level', value: a.costLevel, badge: LEVEL_BADGE[a.costLevel] },
              { label: 'ROI Assessment', value: a.roiAssessment, badge: LEVEL_BADGE[a.roiAssessment] },
              { label: 'Market Maturity', value: a.marketMaturity, badge: 'badge-info' },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '6px' }}>{item.label}</div>
                <span className={`badge ${item.badge}`} style={{ textTransform: 'capitalize' }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
            <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Estimated Revenue Range</div>
            <p className="text-sm" dir={dirFor(a.estimatedRevenueRange, language)}>{a.estimatedRevenueRange}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-coins" style={{ color: 'var(--status-warning)' }}></i> Cost Breakdown</h2>
            <span className="badge badge-neutral">{a.costBreakdown.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {a.costBreakdown.map((c, i) => (
              <div key={i} style={{ padding: 'var(--spacing-sm) var(--spacing-md)', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div className="text-sm font-semibold" dir={dirFor(c.category, language)}>{c.category}</div>
                <div className="text-xs text-secondary" style={{ marginTop: '2px' }} dir={dirFor(c.estimate, language)}>{c.estimate}</div>
                {c.notes && <div className="text-xs text-muted" style={{ marginTop: '2px', fontStyle: 'italic' }} dir={dirFor(c.notes, language)}>{c.notes}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-triangle-exclamation text-danger"></i> Key Risks</h2>
            <span className="badge badge-danger">{a.keyRisks.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {a.keyRisks.map((r, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-border)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                <i className="fa-solid fa-circle-exclamation text-danger" style={{ marginTop: '3px', flexShrink: 0 }}></i>
                <span className="text-sm" dir={dirFor(r, language)}>{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-arrow-trend-up text-success"></i> Opportunities</h2>
            <span className="badge badge-success">{a.opportunities.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {a.opportunities.map((o, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'var(--status-success-bg)', border: '1px solid var(--status-success-border)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                <i className="fa-solid fa-circle-check text-success" style={{ marginTop: '3px', flexShrink: 0 }}></i>
                <span className="text-sm" dir={dirFor(o, language)}>{o}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card card-accent" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-header">
          <h2 className="card-title"><i className="fa-solid fa-circle-check text-accent"></i> Recommendation</h2>
          <span className={`badge ${rec.className}`}>{rec.label}</span>
        </div>
        <p className="text-sm leading-relaxed" dir={dirFor(a.reasoning, language)}>{a.reasoning}</p>
        <div className="text-xs text-muted" style={{ marginTop: 'var(--spacing-sm)' }}>Confidence: {a.confidenceScore}%</div>
      </div>
    </>
  );
}

function RulesTabContent({ data, language }: { data: ProjectIntelligenceOutput; language: Language }) {
  const r = data.businessRules;
  return (
    <>
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-header">
          <h2 className="card-title"><i className="fa-solid fa-scale-balanced text-accent"></i> Business Rules</h2>
          <span className="badge badge-info">{r.businessRules.length} Rules</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {r.businessRules.map(rule => (
            <div key={rule.id} style={{ padding: 'var(--spacing-md)', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--accent-primary-bg)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', fontWeight: 700, direction: 'ltr', display: 'inline-block' }}>{rule.id}</span>
                <span className={`badge ${PRIORITY_BADGE[rule.priority]}`}>{rule.priority}</span>
              </div>
              <div className="text-sm font-semibold" dir={dirFor(rule.rule, language)}>{rule.rule}</div>
              <div className="text-xs text-muted" style={{ marginTop: '4px', fontStyle: 'italic' }} dir={dirFor(rule.rationale, language)}>{rule.rationale}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-shield-halved" style={{ color: 'var(--status-warning)' }}></i> Constraints</h2>
            <span className="badge badge-warning">{r.constraints.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {r.constraints.map((c, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                <i className="fa-solid fa-lock text-warning" style={{ marginTop: '3px', flexShrink: 0 }}></i>
                <span className="text-sm" dir={dirFor(c, language)}>{c}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-clipboard-check text-accent"></i> Policy Decisions</h2>
            <span className="badge badge-neutral">{r.policyDecisions.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {r.policyDecisions.map((p, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                <i className="fa-regular fa-circle-question text-accent" style={{ marginTop: '3px', flexShrink: 0 }}></i>
                <span className="text-sm" dir={dirFor(p, language)}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-header">
          <h2 className="card-title"><i className="fa-solid fa-route text-accent"></i> Workflows</h2>
          <span className="badge badge-info">{r.workflows.length}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {r.workflows.map((w, i) => (
            <div key={i} style={{ padding: 'var(--spacing-md)', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div className="text-sm font-semibold" style={{ marginBottom: '8px' }} dir={dirFor(w.name, language)}>{w.name}</div>
              <ol style={{ paddingInlineStart: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {w.steps.map((s, si) => (
                  <li key={si} className="text-sm text-secondary" style={{ listStyle: 'decimal' }} dir={dirFor(s, language)}>{s}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-header">
          <h2 className="card-title"><i className="fa-solid fa-people-arrows text-accent"></i> Role Interactions</h2>
          <span className="badge badge-neutral">{r.rolesInteractions.length}</span>
        </div>
        <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-md)' }}>
          {r.rolesInteractions.map((ri, i) => (
            <div key={i} style={{ padding: 'var(--spacing-md)', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div className="text-sm font-semibold" style={{ marginBottom: '4px' }} dir={dirFor(ri.role, language)}>{ri.role}</div>
              <div className="text-xs text-muted" style={{ marginBottom: '6px' }}>Interacts with: {ri.interactsWith.join(', ')}</div>
              <div className="text-xs text-secondary" style={{ lineHeight: 1.5 }} dir={dirFor(ri.description, language)}>{ri.description}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

interface BlueprintTabProps {
  blueprint: TechnicalBlueprintOutput;
  sections: Record<string, boolean>;
  language: Language;
  outputStyle: OutputStyle;
  clientFacingMode: boolean;
  projectType: string;
  complexity: { score: number; label: string; weeks: string; team: string };
  techStack: { frontend: string; backend: string; db: string; infra: string };
  onShowToast: (msg: string, type?: ToastType) => void;
}

function BlueprintTabContent({ blueprint, sections, language, outputStyle, clientFacingMode, projectType, complexity, techStack, onShowToast }: BlueprintTabProps) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-md)' }}>
        <div style={{ padding: 'var(--spacing-xs) var(--spacing-md)', borderRadius: 'var(--radius-full)', background: blueprint.confidenceScore >= 80 ? 'rgba(5, 150, 105, 0.1)' : 'rgba(217, 119, 6, 0.1)', border: `1px solid ${blueprint.confidenceScore >= 80 ? 'rgba(5, 150, 105, 0.3)' : 'rgba(217, 119, 6, 0.3)'}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className={`fa-solid fa-gauge-high ${blueprint.confidenceScore >= 80 ? 'text-success' : 'text-warning'}`}></i>
          <span className="text-xs font-bold">Blueprint Confidence: {blueprint.confidenceScore}%</span>
        </div>
      </div>

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
              <h3 className="font-semibold" style={{ marginBottom: 'var(--spacing-sm)', fontSize: '1.1rem' }} dir={dirFor(blueprint.projectBrief.projectName, language)}>{blueprint.projectBrief.projectName}</h3>
              {blueprint.projectBrief.clientName && <div className="text-xs text-muted" style={{ marginBottom: 'var(--spacing-sm)' }}>Client: {blueprint.projectBrief.clientName}</div>}
              <p className="text-sm leading-relaxed text-secondary" style={{ marginBottom: 'var(--spacing-xl)' }} dir={dirFor(blueprint.projectBrief.summary, language)}>
                {blueprint.projectBrief.summary}
              </p>
              <div className="grid grid-cols-3" style={{ marginTop: 'auto', gap: 'var(--spacing-md)' }}>
                {[
                  { label: 'Complexity', value: blueprint.projectBrief.complexity },
                  { label: 'Infrastructure', value: projectType === 'saas' ? 'SaaS / Multi-Tenant' : 'Cloud-Native' },
                  { label: 'Industry', value: blueprint.projectBrief.industry },
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
                <span className="badge badge-neutral">{blueprint.userRoles.length} Roles</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {blueprint.userRoles.map((role, i) => {
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
                        <div className="font-semibold text-sm" dir={dirFor(role.role, language)}>{role.role}</div>
                        <div className="text-xs text-muted" style={{ marginTop: '2px', lineHeight: 1.5 }} dir={dirFor(role.description, language)}>{role.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {(sections.mainFeatures || sections.functionalReqs) && (
        <div className="grid grid-cols-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
          {sections.mainFeatures && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title"><i className="fa-regular fa-square-check" style={{ color: 'var(--status-success)' }}></i>{t('mainFeatures', language)}</h2>
                <span className="badge badge-success">{blueprint.mainFeatures.length} Confirmed</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {blueprint.mainFeatures.map((f, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--status-success-bg)', border: '1px solid var(--status-success-border)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <span className="text-sm font-semibold" dir={dirFor(f.title, language)}>{f.title}</span>
                      <div className="text-xs text-muted" style={{ marginTop: '2px' }} dir={dirFor(f.description, language)}>{f.description}</div>
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
                <span className="badge badge-info">{blueprint.functionalRequirements.length} Requirements</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', maxHeight: '500px', overflowY: 'auto' }}>
                {blueprint.functionalRequirements.map(fr => (
                  <div key={fr.id} style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                    <div style={{ background: 'var(--status-info-bg)', color: 'var(--status-info)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', fontWeight: 700, flexShrink: 0, marginTop: '2px', border: '1px solid var(--status-info-border)', direction: 'ltr' }}>{fr.id}</div>
                    <div>
                      <div className="text-sm font-semibold" dir={dirFor(fr.title, language)}>{fr.title}</div>
                      <div className="text-xs text-muted" style={{ marginTop: '3px', lineHeight: 1.5, fontStyle: 'italic' }} dir={dirFor(fr.description, language)}>{fr.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {sections.nonFunctionalReqs && (
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-gauge-high" style={{ color: 'var(--accent-ai)' }}></i>{t('nonFunctionalReqs', language)}</h2>
            <span className="badge badge-neutral">{blueprint.nonFunctionalRequirements.length} Constraints</span>
          </div>
          <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-md)' }}>
            {blueprint.nonFunctionalRequirements.map((nfr, i) => (
              <div key={i} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--accent-ai)', padding: '2px 7px', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', fontWeight: 700, direction: 'ltr' }}>NFR-{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-semibold" dir={dirFor(nfr.category, language)}>{nfr.category}</span>
                </div>
                <p className="text-xs text-muted" style={{ lineHeight: 1.5 }} dir={dirFor(nfr.requirement, language)}>{nfr.requirement}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
                <span className="badge badge-warning">{blueprint.missingQuestions.length} Open</span>
              </div>
              <p className="text-sm text-muted" style={{ marginBottom: 'var(--spacing-lg)' }}>
                {clientFacingMode ? 'Items we recommend clarifying before development begins:' : 'Missing information required for a high-fidelity blueprint:'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                {blueprint.missingQuestions.map((q, i) => (
                  <div key={i} style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start', padding: 'var(--spacing-sm) var(--spacing-md)', background: 'rgba(217, 119, 6, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-warning-border)' }}>
                    <i className="fa-regular fa-circle-question text-accent" style={{ marginTop: '3px', flexShrink: 0 }}></i>
                    <div className="text-sm" dir={dirFor(q, language)}>{q}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => onShowToast('Clarification request sent to client', 'success')}>
                <i className="fa-solid fa-paper-plane"></i> Request Clarifications from Client
              </button>
            </div>
          )}
          {sections.mvpScope && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title"><i className="fa-solid fa-rocket text-accent"></i>{t('mvpScope', language)}</h2>
                <span className="badge badge-accent">{blueprint.mvpScope.length} Items</span>
              </div>
              <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--border-subtle)', marginLeft: '8px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', marginTop: 'var(--spacing-md)' }}>
                {blueprint.mvpScope.map((item, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-30px', top: '3px', width: '10px', height: '10px', borderRadius: '50%', background: i === 0 ? 'var(--accent-primary)' : 'var(--border-strong)', boxShadow: i === 0 ? '0 0 0 4px rgba(37, 99, 235, 0.2)' : 'none' }}></div>
                    <div className="text-sm font-semibold" style={{ marginBottom: '4px', color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Phase {i + 1}</div>
                    <div className="text-xs text-muted" style={{ lineHeight: 1.6 }} dir={dirFor(item, language)}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {sections.assumptions && (
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-lightbulb" style={{ color: 'var(--status-warning)' }}></i>{t('assumptions', language)}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {blueprint.assumptions.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--spacing-sm)', padding: '8px 12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <i className="fa-solid fa-circle-dot text-muted" style={{ marginTop: '3px', fontSize: '0.625rem', flexShrink: 0 }}></i>
                <span className="text-sm" dir={dirFor(a, language)}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.userStories && (
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="card-header">
            <h2 className="card-title"><i className="fa-regular fa-comment-dots text-accent"></i>{t('userStories', language)}</h2>
            <span className="badge badge-neutral">{blueprint.userRoles.length} Stories</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {blueprint.userRoles.map((role, i) => (
              <div key={i} style={{ padding: 'var(--spacing-md)', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--accent-primary)' }}>
                <div className="text-xs font-bold text-accent uppercase tracking-wider" style={{ marginBottom: '4px' }}>As a {role.role}</div>
                <p className="text-sm" dir={dirFor(role.description, language)}>{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.acceptanceCriteria && blueprint.nonFunctionalRequirements.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-check-double" style={{ color: 'var(--status-success)' }}></i>{t('acceptanceCriteria', language)}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {blueprint.nonFunctionalRequirements.map((nfr, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start', padding: '8px 12px', background: 'var(--status-success-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-success-border)' }}>
                <i className="fa-solid fa-circle-check text-success" style={{ marginTop: '2px', fontSize: '0.75rem', flexShrink: 0 }}></i>
                <span className="text-sm" dir={dirFor(nfr.requirement, language)}>{nfr.requirement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
        </div>
      </div>
    </>
  );
}

function PlanTabContent({ data, language }: { data: ProjectIntelligenceOutput; language: Language }) {
  const p = data.executionPlan;
  return (
    <>
      <div className="grid grid-cols-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><i className="fa-regular fa-clock text-accent"></i> Timeline</h2>
            <span className={`badge ${LEVEL_BADGE[p.complexity]}`} style={{ textTransform: 'capitalize' }}>{p.complexity} Complexity</span>
          </div>
          <p className="text-sm leading-relaxed" dir={dirFor(p.estimatedTimeline, language)}>{p.estimatedTimeline}</p>
          <div className="text-xs text-muted" style={{ marginTop: 'var(--spacing-sm)' }}>Confidence: {p.confidenceScore}%</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-people-group text-accent"></i> Team Roles</h2>
            <span className="badge badge-neutral">{p.teamRolesNeeded.reduce((s, r) => s + r.count, 0)} People</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {p.teamRolesNeeded.map((r, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <div className="text-sm font-semibold" dir={dirFor(r.role, language)}>{r.role}</div>
                  <span className="badge badge-info">×{r.count}</span>
                </div>
                <div className="text-xs text-muted" style={{ marginTop: '4px', lineHeight: 1.5 }} dir={dirFor(r.responsibilities, language)}>{r.responsibilities}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-header">
          <h2 className="card-title"><i className="fa-solid fa-list-check text-accent"></i> Key Tasks</h2>
          <span className="badge badge-info">{p.keyTasks.length}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {p.keyTasks.map((task, i) => (
            <div key={i} style={{ padding: 'var(--spacing-md)', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: '4px' }}>
                <div className="text-sm font-semibold" dir={dirFor(task.title, language)}>{task.title}</div>
                <span className="badge badge-neutral" style={{ direction: 'ltr' }}>{task.effort}</span>
              </div>
              <div className="text-xs text-muted" style={{ lineHeight: 1.5 }} dir={dirFor(task.description, language)}>{task.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-header">
          <h2 className="card-title"><i className="fa-solid fa-flag-checkered text-accent"></i> Milestones</h2>
          <span className="badge badge-accent">{p.milestones.length}</span>
        </div>
        <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--border-subtle)', marginLeft: '8px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', marginTop: 'var(--spacing-md)' }}>
          {p.milestones.map((m, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-30px', top: '3px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.2)' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                <div className="text-sm font-bold" dir={dirFor(m.name, language)}>{m.name}</div>
                <span className="badge badge-info" style={{ direction: 'ltr' }}>{m.timeline}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {m.deliverables.map((d, di) => (
                  <div key={di} className="text-xs text-secondary" style={{ display: 'flex', gap: '6px' }}>
                    <i className="fa-solid fa-check text-success" style={{ marginTop: '3px', fontSize: '0.625rem' }}></i>
                    <span dir={dirFor(d, language)}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {p.risksInExecution.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-triangle-exclamation text-warning"></i> Execution Risks</h2>
            <span className="badge badge-warning">{p.risksInExecution.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {p.risksInExecution.map((r, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'rgba(217, 119, 6, 0.05)', border: '1px solid var(--status-warning-border)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                <i className="fa-solid fa-circle-exclamation text-warning" style={{ marginTop: '3px', flexShrink: 0 }}></i>
                <span className="text-sm" dir={dirFor(r, language)}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function DecisionTabContent({ data, language, onShowToast }: { data: ProjectIntelligenceOutput; language: Language; onShowToast: (msg: string, type?: ToastType) => void }) {
  const d = data.finalDecision;
  const decisionMeta = DECISION_BADGE[d.finalDecision];
  const accentColor =
    d.finalDecision === 'yes' ? 'var(--status-success)' :
    d.finalDecision === 'no' ? 'var(--status-danger)' :
    'var(--status-warning)';
  const accentBg =
    d.finalDecision === 'yes' ? 'var(--status-success-bg)' :
    d.finalDecision === 'no' ? 'var(--status-danger-bg)' :
    'var(--status-warning-bg)';

  return (
    <>
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center', padding: 'var(--spacing-2xl)', background: accentBg, border: `1px solid ${accentColor}` }}>
        <i className="fa-solid fa-gavel" style={{ fontSize: '2.5rem', color: accentColor, marginBottom: 'var(--spacing-md)' }}></i>
        <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Final Decision</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: accentColor, marginBottom: '8px' }}>{decisionMeta.label}</h2>
        <p className="text-sm" style={{ maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }} dir={dirFor(d.mainReason, language)}>{d.mainReason}</p>
        <div style={{ display: 'inline-flex', gap: '8px', marginTop: 'var(--spacing-md)', padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.7)', border: '1px solid var(--border-subtle)' }}>
          <i className="fa-solid fa-gauge-high text-accent"></i>
          <span className="text-xs font-bold">Confidence: {d.confidenceScore}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-triangle-exclamation text-danger"></i> Key Risk</h2>
          </div>
          <div style={{ padding: 'var(--spacing-md)', background: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-border)', borderRadius: 'var(--radius-md)' }}>
            <p className="text-sm leading-relaxed" dir={dirFor(d.keyRisk, language)}>{d.keyRisk}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><i className="fa-solid fa-arrow-right-long text-accent"></i> Suggested Next Step</h2>
          </div>
          <div style={{ padding: 'var(--spacing-md)', background: 'var(--accent-primary-bg)', border: '1px solid var(--accent-primary-soft)', borderRadius: 'var(--radius-md)' }}>
            <p className="text-sm leading-relaxed" dir={dirFor(d.suggestedNextStep, language)}>{d.suggestedNextStep}</p>
          </div>
        </div>
      </div>

      <div className="card card-accent" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-lg)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ flex: '1 1 240px', minWidth: 0 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Ready to act?</h2>
          <p className="text-sm text-muted" style={{ lineHeight: 1.7 }}>
            Push this analysis downstream — to the Contracts module for drafting, or refine the requirements with the client first.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', flex: '0 0 auto', width: '100%', maxWidth: '260px' }}>
          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => onShowToast('Project Intelligence pushed to Contracts', 'success')}>
            <i className="fa-solid fa-file-signature"></i> Push to Contracts
          </button>
          <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => onShowToast('Saved for refinement', 'info')}>
            Refine With Client
          </button>
        </div>
      </div>
    </>
  );
}
