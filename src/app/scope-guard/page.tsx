'use client';
import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import type { ScopeAnalysisOutput } from '@/lib/ai/schemas/scope';

type ToastType = 'success' | 'info' | 'warning' | 'error';
type CompareAgainst = 'contract' | 'srs' | 'sow' | 'proposal';
type AnalysisLang = 'auto' | 'english' | 'arabic';
type Strictness = 'strict' | 'balanced' | 'lenient';
type ImpactLevel = 'low' | 'medium' | 'high';

const TOAST_ICONS: Record<ToastType, string> = {
  success: 'fa-solid fa-circle-check',
  info: 'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
  error: 'fa-solid fa-circle-xmark',
};

const SAMPLE_REQUEST = 'Can you also add a mobile app for the same booking platform?';

const STATUS_META = {
  in_scope: { label: 'In Scope', color: 'var(--status-success)', bg: 'var(--status-success-bg)', border: 'var(--status-success-border)', badge: 'badge-success', icon: 'fa-circle-check' },
  out_of_scope: { label: 'Out of Scope', color: 'var(--status-danger)', bg: 'var(--status-danger-bg)', border: 'var(--status-danger-border)', badge: 'badge-danger', icon: 'fa-ban' },
  needs_clarification: { label: 'Needs Clarification', color: 'var(--status-warning)', bg: 'var(--status-warning-bg)', border: 'var(--status-warning-border)', badge: 'badge-warning', icon: 'fa-circle-question' },
} as const;

const IMPACT_META: Record<ImpactLevel, { color: string; label: string }> = {
  low: { color: 'var(--status-success)', label: 'Low' },
  medium: { color: 'var(--status-warning)', label: 'Medium' },
  high: { color: 'var(--status-danger)', label: 'High' },
};

const RECOMMENDATION_META = {
  approve: { label: 'Approve', icon: 'fa-circle-check', className: 'btn-primary', toastMsg: 'Request approved within current scope', toastType: 'success' as ToastType },
  reject: { label: 'Reject', icon: 'fa-ban', className: 'btn-secondary', toastMsg: 'Request declined', toastType: 'warning' as ToastType },
  convert_to_change_request: { label: 'Convert to Change Request', icon: 'fa-file-pen', className: 'btn-primary', toastMsg: 'Change Request created', toastType: 'success' as ToastType },
} as const;

export default function ScopeGuardPage() {
  const [compareAgainst, setCompareAgainst] = useState<CompareAgainst>('contract');
  const [analysisLang, setAnalysisLang] = useState<AnalysisLang>('auto');
  const [strictness, setStrictness] = useState<Strictness>('balanced');
  const [generateReply, setGenerateReply] = useState(true);
  const [requestText, setRequestText] = useState(SAMPLE_REQUEST);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ScopeAnalysisOutput | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [showCRDoc, setShowCRDoc] = useState(false);
  const [decision, setDecision] = useState<'approve' | 'reject' | 'convert_to_change_request' | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (requestText.trim().length < 5) {
      showToast('Request too short (min 5 characters)', 'warning');
      return;
    }
    setIsAnalyzing(true);
    setShowCRDoc(false);
    setDecision(null);
    try {
      const res = await fetch('/api/ai/scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newRequest: requestText,
          language: analysisLang,
          existingSrs: compareAgainst === 'srs' ? 'Project SRS v2.1 covers web booking platform, admin dashboard, online payments, appointment management, patient profiles, and notification settings.' : undefined,
          contractScope: compareAgainst === 'contract' ? 'Contract #CON-2024-089 covers web platform and admin dashboard only. Mobile applications are not included unless approved through a separate change request.' : undefined,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || 'Analysis failed');
      setAnalysis(result.data);
      setUsedFallback(!!result.usedFallback);
      if (result.providerUsed === 'qwen') {
        showToast('Scope analyzed via Qwen (Gemini unavailable)', 'info');
      } else if (result.providerUsed === 'local_fallback') {
        showToast('AI providers unavailable — demo analysis loaded', 'warning');
      } else {
        showToast('Scope analyzed successfully', 'success');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to analyze scope', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  }, [requestText, analysisLang, compareAgainst, showToast]);

  const handleRecommendation = useCallback((rec: 'approve' | 'reject' | 'convert_to_change_request') => {
    setDecision(rec);
    if (rec === 'convert_to_change_request') setShowCRDoc(true);
    else setShowCRDoc(false);
    const meta = RECOMMENDATION_META[rec];
    showToast(meta.toastMsg, meta.toastType);
  }, [showToast]);

  const status = analysis?.scopeStatus ?? 'out_of_scope';
  const statusMeta = STATUS_META[status];
  const impacts: { label: string; icon: string; level: ImpactLevel }[] = analysis ? [
    { label: 'Timeline', icon: 'fa-clock', level: analysis.timelineImpact },
    { label: 'Cost', icon: 'fa-money-bill-wave', level: analysis.costImpact },
    { label: 'Business', icon: 'fa-briefcase', level: analysis.businessImpact },
    { label: 'Risk', icon: 'fa-shield-halved', level: analysis.riskImpact },
  ] : [
    { label: 'Timeline', icon: 'fa-clock', level: 'high' },
    { label: 'Cost', icon: 'fa-money-bill-wave', level: 'high' },
    { label: 'Business', icon: 'fa-briefcase', level: 'medium' },
    { label: 'Risk', icon: 'fa-shield-halved', level: 'high' },
  ];

  const recommended = analysis?.recommendation ?? 'convert_to_change_request';
  const compareLabel = compareAgainst === 'contract' ? 'Contract #CON-2024-089'
    : compareAgainst === 'srs' ? 'SRS v2.1'
    : compareAgainst === 'sow' ? 'SOW-2024-001'
    : 'Initial Proposal';

  return (
    <>
      <Header />
      <div className="page-container animate-fade-in">

        <div className="page-header">
          <div>
            <nav className="page-breadcrumb" style={{ marginBottom: 'var(--spacing-xs)' }}>
              <Link href="/projects">Projects</Link>
              <i className="fa-solid fa-chevron-right sep" style={{ fontSize: '0.6rem' }}></i>
              <span>Clinic Booking Platform</span>
              <i className="fa-solid fa-chevron-right sep" style={{ fontSize: '0.6rem' }}></i>
              <span className="current">Scope Guard</span>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
              <p className="page-label" style={{ margin: 0 }}>Scope Intelligence</p>
              <span className="demo-badge"><i className="fa-solid fa-bolt"></i> Gemini AI</span>
              {usedFallback && (
                <span className="badge badge-warning">
                  <i className="fa-solid fa-shield-halved"></i> Fallback Mode
                </span>
              )}
            </div>
            <h1 className="page-title">Scope Impact Engine</h1>
            <p className="page-subtitle">Classify client requests and quantify their full operational, cost, business, and risk impact.</p>
          </div>
          <button className="btn btn-secondary" onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing
              ? <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing...</>
              : <><i className="fa-solid fa-rotate-right"></i> {analysis ? 'Re-analyze' : 'Analyze Request'}</>}
          </button>
        </div>

        {/* Options Panel */}
        <div className="opts-panel" style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-lg)', alignItems: 'flex-end' }}>
          <div>
            <span className="opts-label">Compare Against</span>
            <div className="seg-control">
              {([['contract', 'Contract'], ['srs', 'SRS'], ['sow', 'SOW'], ['proposal', 'Proposal']] as [CompareAgainst, string][]).map(([val, label]) => (
                <button key={val} className={`seg-btn${compareAgainst === val ? ' active' : ''}`} onClick={() => setCompareAgainst(val)}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="opts-label">Analysis Language</span>
            <div className="seg-control">
              {([['auto', 'Auto-Detect'], ['english', 'English'], ['arabic', 'Arabic']] as [AnalysisLang, string][]).map(([val, label]) => (
                <button key={val} className={`seg-btn${analysisLang === val ? ' active' : ''}`} onClick={() => setAnalysisLang(val)}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="opts-label">Strictness</span>
            <div className="seg-control">
              {([['strict', 'Strict'], ['balanced', 'Balanced'], ['lenient', 'Lenient']] as [Strictness, string][]).map(([val, label]) => (
                <button key={val} className={`seg-btn${strictness === val ? ' active' : ''}`} onClick={() => setStrictness(val)}>{label}</button>
              ))}
            </div>
          </div>
          <div className="toggle-row" style={{ gap: 'var(--spacing-md)', padding: 0 }}>
            <span className="opts-label" style={{ marginBottom: 0 }}>Auto-Generate Reply</span>
            <button
              className={`toggle-switch${generateReply ? ' on' : ''}`}
              onClick={() => setGenerateReply(v => !v)}
              aria-label="Toggle auto-generate reply"
            />
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span className="opts-label">Verdict</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusMeta.color, display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: statusMeta.color }}>{statusMeta.label}</span>
            </div>
          </div>
        </div>

        {/* Main Analysis Grid */}
        <div className="grid grid-cols-2 section-mb">

          {/* Incoming Request */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <h2 className="card-title">
                <i className="fa-regular fa-envelope text-accent"></i>
                Incoming Request
              </h2>
              <span className="badge badge-neutral">
                <i className="fa-regular fa-envelope"></i> Email
              </span>
            </div>

            <textarea
              className="form-textarea"
              value={requestText}
              onChange={e => setRequestText(e.target.value)}
              rows={4}
              dir={/[؀-ۿ]/.test(requestText) ? 'rtl' : 'ltr'}
              style={{ marginBottom: 'var(--spacing-md)', fontFamily: 'var(--font-display)', fontSize: '1rem', lineHeight: 1.8, textAlign: /[؀-ۿ]/.test(requestText) ? 'right' : 'left' }}
              placeholder="Paste the new client request here..."
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
              <span className="text-xs text-muted">{requestText.length} characters</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setRequestText(SAMPLE_REQUEST)}>
                <i className="fa-solid fa-wand-magic-sparkles"></i> Sample
              </button>
            </div>

            {analysis ? (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--spacing-md)', flex: 1 }}>
                <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '6px' }}>Strategic Impact</div>
                <p className="text-sm" style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{analysis.strategicImpact}</p>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--spacing-md)', flex: 1 }}>
                <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '6px' }}>Parsed Request</div>
                <p className="text-sm font-medium" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                  &ldquo;Can you also add a mobile app for the same booking platform?&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Analysis Result */}
          <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', borderColor: statusMeta.border }}>
            <div className="scope-result-header" style={{ background: statusMeta.bg, borderBottom: `1px solid ${statusMeta.border}` }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                <div className="list-item-icon" style={{ background: statusMeta.color, color: 'white', width: '44px', height: '44px', borderRadius: 'var(--radius-lg)' }}>
                  <i className={`fa-solid ${statusMeta.icon}`} style={{ fontSize: '1.25rem' }}></i>
                </div>
                <div>
                  <h3 className="font-bold" style={{ fontSize: '1.0625rem', color: statusMeta.color }}>Analysis Result</h3>
                  <div className="text-xs text-muted">
                    Compared against {compareLabel} · {strictness.charAt(0).toUpperCase() + strictness.slice(1)} mode
                  </div>
                </div>
              </div>
              <span className={`badge ${statusMeta.badge} badge-lg`}>{statusMeta.label}</span>
            </div>

            <div style={{ padding: 'var(--spacing-lg)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>

              <div>
                <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: 'var(--spacing-sm)' }}>Primary Reason</div>
                <div style={{ background: statusMeta.bg, border: `1px solid ${statusMeta.border}`, padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                  <i className="fa-solid fa-circle-info" style={{ color: statusMeta.color, marginTop: '3px', flexShrink: 0 }}></i>
                  <p className="text-sm" style={{ lineHeight: 1.6, color: 'var(--text-primary)' }}>
                    {analysis?.reason ?? 'The requested mobile app is not included in the approved project scope or contract scope.'}
                  </p>
                </div>
              </div>

              {/* Impact cards: timeline, cost, business, risk */}
              <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-md)' }}>
                {impacts.map(imp => {
                  const meta = IMPACT_META[imp.level];
                  return (
                    <div key={imp.label} style={{ border: '1px solid var(--border-subtle)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', background: 'white' }}>
                      <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className={`fa-solid ${imp.icon}`} style={{ color: meta.color }}></i> {imp.label}
                      </div>
                      <div className="font-bold" style={{ color: meta.color }}>{meta.label} Impact</div>
                      <div style={{ marginTop: '6px', height: '4px', borderRadius: '2px', background: 'var(--bg-main)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: imp.level === 'low' ? '33%' : imp.level === 'medium' ? '66%' : '100%', background: meta.color }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-md)' }}>
                <div>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>AI Confidence Score</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: (analysis?.confidenceScore ?? 87) >= 80 ? 'var(--status-success)' : 'var(--accent-primary)' }}>{analysis?.confidenceScore ?? 87}%</span>
                    <span className="text-xs text-muted">certainty</span>
                  </div>
                </div>
                <div style={{ flex: 1, maxWidth: '120px' }}>
                  <div className="progress-container" style={{ height: '8px' }}>
                    <div className="progress-bar" style={{ width: `${analysis?.confidenceScore ?? 87}%`, background: (analysis?.confidenceScore ?? 87) >= 80 ? 'var(--status-success)' : 'var(--accent-primary)' }}></div>
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: '4px' }}>{strictness.charAt(0).toUpperCase() + strictness.slice(1)} mode</div>
                </div>
              </div>

              {/* Suggested action banner */}
              {analysis && (
                <div style={{ background: 'rgba(124, 58, 237, 0.06)', border: '1px solid rgba(124, 58, 237, 0.2)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                    <div className="list-item-icon" style={{ background: 'var(--accent-primary)', color: 'white', width: '36px', height: '36px', flexShrink: 0 }}>
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                    </div>
                    <div>
                      <div className="text-xs text-accent font-bold uppercase tracking-wider">AI Suggested Action</div>
                      <div className="text-sm" style={{ marginTop: '2px', lineHeight: 1.5 }}>{analysis.suggestedAction}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendation buttons */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <div className="text-xs text-muted font-semibold uppercase tracking-wider">Recommendation</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-sm)' }}>
                  {(['approve', 'reject', 'convert_to_change_request'] as const).map(rec => {
                    const meta = RECOMMENDATION_META[rec];
                    const isRecommended = recommended === rec;
                    const isChosen = decision === rec;
                    const isApprove = rec === 'approve';
                    const isReject = rec === 'reject';
                    return (
                      <button
                        key={rec}
                        onClick={() => handleRecommendation(rec)}
                        className={`btn btn-sm ${isChosen ? meta.className : 'btn-secondary'}`}
                        style={{
                          position: 'relative',
                          fontSize: '0.75rem',
                          padding: '8px 10px',
                          ...(isRecommended && !isChosen ? { boxShadow: '0 0 0 2px var(--accent-primary)' } : {}),
                          ...(isApprove && isChosen ? { background: 'var(--status-success)', borderColor: 'var(--status-success)' } : {}),
                          ...(isReject && isChosen ? { background: 'var(--status-danger)', borderColor: 'var(--status-danger)', color: 'white' } : {}),
                        }}
                      >
                        <i className={`fa-solid ${meta.icon}`}></i> {meta.label}
                        {isRecommended && (
                          <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--accent-primary)', color: 'white', fontSize: '0.5625rem', fontWeight: 700, padding: '2px 5px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Change Request Document */}
        {showCRDoc && (
          <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div className="card-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--spacing-md)' }}>
              <h2 className="card-title">
                <i className="fa-solid fa-file-pen text-accent"></i>
                Change Request Document
              </h2>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                <span className="badge badge-success">Generated</span>
                <button className="btn btn-ghost btn-sm" onClick={() => showToast('CR document exported', 'success')}>
                  <i className="fa-solid fa-file-arrow-down"></i> Export
                </button>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-md)', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div className="info-pair">
                  <span className="info-pair-label">CR Reference</span>
                  <span className="info-pair-value font-bold">CR-2026-014</span>
                </div>
                <div className="info-pair">
                  <span className="info-pair-label">Date Raised</span>
                  <span className="info-pair-value">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="info-pair">
                  <span className="info-pair-label">Project</span>
                  <span className="info-pair-value">Clinic Booking Platform</span>
                </div>
                <div className="info-pair">
                  <span className="info-pair-label">Status</span>
                  <span className="badge badge-warning">Pending Review</span>
                </div>
              </div>

              <div className="cr-document">
                <div className="cr-document-row">
                  <span className="cr-document-key">Change Description</span>
                  <span className="cr-document-val">{analysis?.changeRequestSummary ?? 'Addition of native iOS and Android mobile applications to the existing web platform project scope.'}</span>
                </div>
                <div className="cr-document-row">
                  <span className="cr-document-key">Reason / Justification</span>
                  <span className="cr-document-val">{analysis?.reason ?? `Client requested cross-platform mobile presence to reach users on the go. Not covered in ${compareLabel}.`}</span>
                </div>
                <div className="cr-document-row">
                  <span className="cr-document-key">Timeline Impact</span>
                  <span className="cr-document-val" style={{ color: IMPACT_META[analysis?.timelineImpact ?? 'high'].color, fontWeight: 600 }}>Estimated +2 to +4 weeks</span>
                </div>
                <div className="cr-document-row">
                  <span className="cr-document-key">Cost Impact</span>
                  <span className="cr-document-val" style={{ color: IMPACT_META[analysis?.costImpact ?? 'high'].color, fontWeight: 600 }}>Additional mobile development, QA, and deployment cost required.</span>
                </div>
                <div className="cr-document-row">
                  <span className="cr-document-key">Business Impact</span>
                  <span className="cr-document-val" style={{ color: IMPACT_META[analysis?.businessImpact ?? 'medium'].color, fontWeight: 600 }}>{IMPACT_META[analysis?.businessImpact ?? 'medium'].label} impact</span>
                </div>
                <div className="cr-document-row">
                  <span className="cr-document-key">Risk Impact</span>
                  <span className="cr-document-val" style={{ color: IMPACT_META[analysis?.riskImpact ?? 'high'].color, fontWeight: 600 }}>{IMPACT_META[analysis?.riskImpact ?? 'high'].label} impact</span>
                </div>
                <div className="cr-document-row">
                  <span className="cr-document-key">Approval Required From</span>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                    <div style={{ display: 'flex' }}>
                      {[{ initials: 'AD', bg: 'var(--accent-primary)' }, { initials: 'PM', bg: 'var(--status-info)' }].map((a, i) => (
                        <div key={i} className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.6875rem', background: a.bg, color: 'white', border: '2px solid white', marginLeft: i > 0 ? '-8px' : '0' }}>
                          {a.initials}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-medium">Account Director + Project Manager</span>
                  </div>
                </div>
                <div className="cr-document-row">
                  <span className="cr-document-key">Signature Line</span>
                  <div className="grid-2col">
                    {['Client Signature', 'PM Signature'].map(sig => (
                      <div key={sig} style={{ borderBottom: '1px dashed var(--border-strong)', paddingBottom: '4px' }}>
                        <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginTop: '24px' }}>{sig}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Client Reply */}
        {generateReply && (
          <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div className="card-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--spacing-md)' }}>
              <h2 className="card-title">
                <i className="fa-regular fa-comment-dots text-accent"></i>
                Suggested Client Reply
              </h2>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    if (analysis) navigator.clipboard.writeText(analysis.clientReply).catch(() => undefined);
                    showToast('Reply copied to clipboard', 'success');
                  }}
                >
                  <i className="fa-regular fa-copy"></i> Copy
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => showToast('Reply sent to client', 'success')}>
                  <i className="fa-solid fa-paper-plane"></i> Send
                </button>
              </div>
            </div>

            <div
              style={{
                padding: 'var(--spacing-lg) var(--spacing-xl)',
                lineHeight: 1.9,
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
                whiteSpace: 'pre-wrap',
                direction: analysis && /[؀-ۿ]/.test(analysis.clientReply) ? 'rtl' : 'ltr',
                textAlign: analysis && /[؀-ۿ]/.test(analysis.clientReply) ? 'right' : 'left',
              }}
            >
              {analysis?.clientReply ?? `Thank you for the request. Based on the current approved scope, the project includes the web platform and admin dashboard only. A mobile app would be considered an additional scope item. We can prepare a change request with the estimated timeline and cost for your approval.`}
            </div>
          </div>
        )}

        {/* Bottom Info Row */}
        <div className="grid grid-cols-3">

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fa-solid fa-file-contract text-accent"></i>
                Contract Snapshot
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <div className="data-row">
                <span className="data-label">Total Budget</span>
                <span className="data-value font-bold">$245,000</span>
              </div>
              <div>
                <div className="data-row" style={{ borderBottom: 'none', paddingBottom: 'var(--spacing-xs)' }}>
                  <span className="data-label">Budget Used</span>
                  <span className="data-value font-bold">62%</span>
                </div>
                <div className="progress-container" style={{ height: '4px' }}>
                  <div className="progress-bar progress-primary" style={{ width: '62%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fa-solid fa-clock-rotate-left text-accent"></i>
                Similar Requests
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {[
                { label: 'Dark Mode Request', status: 'In-Scope', type: 'success' },
                { label: 'Export to PDF', status: 'In-Scope', type: 'success' },
              ].map(item => (
                <div key={item.label} className="data-row">
                  <span className="data-label">{item.label}</span>
                  <span className={`badge badge-${item.type}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fa-solid fa-users text-accent"></i>
                Stakeholders
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-sm)' }}>
              <div style={{ display: 'flex' }}>
                {[{ initials: 'AD', z: 3, bg: 'var(--accent-primary)' }, { initials: 'MK', z: 2, bg: 'var(--status-info)' }, { initials: '+4', z: 1, bg: 'var(--bg-surface-elevated)', color: 'var(--text-muted)' }].map((a, i) => (
                  <div key={i} className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.75rem', zIndex: a.z, marginLeft: i > 0 ? '-8px' : '0', background: a.bg, color: a.color ?? 'white', border: '2px solid white' }}>
                    {a.initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="font-semibold text-sm">6 Approvers</div>
                <div className="text-xs text-muted">Notified automatically</div>
              </div>
            </div>
          </div>

        </div>

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
