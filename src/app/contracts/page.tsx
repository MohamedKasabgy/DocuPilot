'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import type { ContractAnalysisOutput } from '@/lib/ai/schemas/contract';

type ToastType = 'success' | 'info' | 'warning' | 'error';
type AnalysisDepth = 'quick' | 'standard' | 'deep';
type RiskSens = 'low' | 'medium' | 'high';
type AnalysisLang = 'auto' | 'english' | 'arabic';

const TOAST_ICONS: Record<ToastType, string> = {
  success: 'fa-solid fa-circle-check',
  info:    'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
  error:   'fa-solid fa-circle-xmark',
};

function getRiskScore(rs: RiskSens, d: AnalysisDepth) {
  const base = rs === 'low' ? 38 : rs === 'medium' ? 62 : 84;
  const mod  = d === 'quick' ? -8 : d === 'deep' ? 8 : 0;
  const overall = Math.min(base + mod, 97);
  return {
    overall,
    penalty:    Math.min(overall + 14, 97),
    deadline:   Math.min(overall - 6, 97),
    obligation: Math.min(overall - 20, 97),
    scope:      Math.min(overall + 7, 97),
  };
}

const MOCK_DEADLINES = [
  { label: 'Phase 1 Delivery',        date: 'Jun 15, 2026', daysLeft: 43, type: 'upcoming' as const },
  { label: 'UAT Submission',          date: 'May 28, 2026', daysLeft: 25, type: 'upcoming' as const },
  { label: 'Weekly Status Report',    date: 'May 09, 2026', daysLeft: 6,  type: 'urgent'   as const },
  { label: 'Milestone Payment — UAT', date: 'May 30, 2026', daysLeft: 27, type: 'upcoming' as const },
];

const SAMPLE_CONTRACT =
  `This Software Development Agreement is entered into between Acme Corp as the Client and DevShop Ltd as the Vendor. ` +
  `The Vendor shall design, develop, and deliver a web application for managing customer appointments and internal reports. ` +
  `The project duration is 12 weeks from the signing date. A beta version must be delivered within 6 weeks. ` +
  `Final delivery must be completed within 12 weeks. The total project fee is $50,000. ` +
  `Payment terms are 50% on signing and 50% on final delivery. ` +
  `Late delivery beyond 7 days incurs a 5% weekly penalty. ` +
  `All scope changes, including mobile apps, payment gateway integration, or advanced analytics, ` +
  `require written client approval before work begins.`;

const ACTION_ICONS: Record<string, string> = {
  create_task:              'fa-solid fa-list-check',
  create_risk:              'fa-solid fa-bell',
  create_payment_milestone: 'fa-solid fa-money-check-dollar',
  create_approval:          'fa-solid fa-file-signature',
  draft_amendment:          'fa-solid fa-file-pen',
  notify_manager:           'fa-solid fa-user-tie',
};

const ACTION_COLORS: Record<string, { bg: string; color: string }> = {
  create_task:              { bg: 'rgba(37,99,235,0.1)',       color: 'var(--accent-primary)'  },
  create_risk:              { bg: 'rgba(220,38,38,0.12)',      color: 'var(--status-danger)'   },
  create_payment_milestone: { bg: 'var(--status-success-bg)',  color: 'var(--status-success)'  },
  create_approval:          { bg: 'var(--status-info-bg)',     color: 'var(--status-info)'     },
  draft_amendment:          { bg: 'rgba(37,99,235,0.1)',       color: 'var(--accent-primary)'  },
  notify_manager:           { bg: 'var(--status-warning-bg)',  color: 'var(--status-warning)'  },
};

function parsePercent(p: string | null | undefined): number {
  if (!p) return 0;
  return Math.min(parseInt(p.replace('%', ''), 10) || 0, 100);
}

export default function ContractsPage() {
  const [depth, setDepth] = useState<AnalysisDepth>('standard');
  const [riskSens, setRiskSens] = useState<RiskSens>('medium');
  const [lang, setLang] = useState<AnalysisLang>('auto');
  const [extracts, setExtracts] = useState({ obligations: true, milestones: true, payment: true, risks: true });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const [contractText, setContractText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleAnalyze = async () => {
    const trimmed = contractText.trim();
    if (trimmed.length < 50) {
      showToast('Contract text is too short (min 50 characters).', 'error');
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch('/api/contracts/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: 'clinic-booking-platform',
          contractText: trimmed,
          depth,
          riskSensitivity: riskSens,
          language: lang,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Analysis failed.');
      setAnalysisResult(json.data as ContractAnalysisOutput);
      showToast(
        `Extraction complete — ${json.data.risks.length} risks, ${json.data.deadlines.length} deadlines found`,
        'success',
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unexpected error during analysis.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const riskScore   = getRiskScore(riskSens, depth);
  const displayScore = analysisResult ? analysisResult.confidenceScore : riskScore.overall;

  const client = analysisResult?.parties.find(p => p.role === 'client');
  const vendor = analysisResult?.parties.find(p => p.role === 'vendor');

  const filteredRisks = analysisResult
    ? analysisResult.risks.filter(risk => {
        if (riskSens === 'low')    return risk.severity === 'critical';
        if (riskSens === 'medium') return risk.severity === 'critical' || risk.severity === 'high';
        return true;
      })
    : [];

  const filteredActions = analysisResult
    ? analysisResult.suggestedActions.filter(action => {
        if (action.type === 'create_risk'              && !extracts.risks)       return false;
        if (action.type === 'create_payment_milestone' && !extracts.payment)     return false;
        if ((action.type === 'create_approval' || action.type === 'draft_amendment') && !extracts.obligations) return false;
        return true;
      })
    : [];

  return (
    <>
      <Header />
      <div className="page-container animate-fade-in">

        <div className="page-header">
          <div>
            <p className="page-label">Document Intelligence</p>
            <h1 className="page-title">Contract-to-Actions</h1>
            <p className="page-subtitle">Upload legal documents to extract operational milestones and risk alerts.</p>
          </div>
          <Link href="/projects" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            <i className="fa-solid fa-folder-open"></i> <span>Contract Vault</span>
          </Link>
        </div>

        {/* Analysis Options */}
        <div className="opts-panel" style={lang === 'arabic' ? { marginBottom: 'var(--spacing-sm)' } : undefined}>
          <div>
            <span className="opts-label">Analysis Depth</span>
            <div className="seg-control">
              {([['quick', 'Quick'], ['standard', 'Standard'], ['deep', 'Deep']] as [AnalysisDepth, string][]).map(([val, label]) => (
                <button type="button" key={val} className={`seg-btn${depth === val ? ' active' : ''}`} onClick={() => setDepth(val)}>{label}</button>
              ))}
            </div>
            <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <i className="fa-solid fa-circle-info" style={{ marginRight: '3px' }}></i>
              Controls extraction detail sent to AI
            </span>
          </div>
          <div>
            <span className="opts-label">Risk Sensitivity</span>
            <div className="seg-control">
              {([['low', 'Low'], ['medium', 'Medium'], ['high', 'High']] as [RiskSens, string][]).map(([val, label]) => (
                <button type="button" key={val} className={`seg-btn${riskSens === val ? ' active' : ''}`} onClick={() => setRiskSens(val)}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="opts-label">Language</span>
            <div className="seg-control">
              {([['auto', 'Auto'], ['english', 'English'], ['arabic', 'Arabic']] as [AnalysisLang, string][]).map(([val, label]) => (
                <button type="button" key={val} className={`seg-btn${lang === val ? ' active' : ''}`} onClick={() => setLang(val)}>{label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
            <span className="opts-label" style={{ marginBottom: 0, alignSelf: 'center' }}>Extract:</span>
            {(Object.keys(extracts) as (keyof typeof extracts)[]).map(key => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  className={`toggle-switch${extracts[key] ? ' on' : ''}`}
                  onClick={() => setExtracts(prev => ({ ...prev, [key]: !prev[key] }))}
                  aria-label={`Toggle ${key}`}
                />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Arabic language note */}
        {lang === 'arabic' && (
          <div style={{ marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-sm) var(--spacing-md)', background: 'var(--status-info-bg)', border: '1px solid var(--status-info-border)', borderRadius: 'var(--radius-md)', color: 'var(--status-info)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
            <i className="fa-solid fa-circle-info"></i>
            Arabic contract text is supported. Results are displayed in English in this MVP.
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div style={{ marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-border)', borderRadius: 'var(--radius-md)', color: 'var(--status-danger)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9375rem' }}>
            <i className="fa-solid fa-circle-xmark"></i>
            {error}
          </div>
        )}

        <div className="layout-sidebar-right">

          {/* ── Left Column ── */}
          <div className="section-gap">

            {/* Analysis Result Summary — visible only after a successful call */}
            {analysisResult && (
              <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fa-solid fa-file-contract text-accent"></i>
                    {analysisResult.contractTitle}
                  </h2>
                  <span className="badge badge-success">
                    <i className="fa-solid fa-circle-check" style={{ marginRight: '4px' }}></i>
                    AI Analyzed
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 'var(--spacing-md)' }}>
                  {analysisResult.executiveSummary}
                </p>
                <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                  {analysisResult.clientName && (
                    <div>
                      <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '2px' }}>Client</div>
                      <div className="font-semibold text-sm">{analysisResult.clientName}</div>
                    </div>
                  )}
                  {analysisResult.projectName && (
                    <div>
                      <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '2px' }}>Project</div>
                      <div className="font-semibold text-sm">{analysisResult.projectName}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '2px' }}>AI Confidence</div>
                    <div className="font-bold text-sm" style={{ color: 'var(--accent-primary)' }}>{analysisResult.confidenceScore}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '2px' }}>Parties</div>
                    <div className="font-semibold text-sm">{analysisResult.parties.length} identified</div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload / Paste */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-file-signature text-accent"></i>
                  Contract Input
                </h2>
                {depth !== 'standard' && (
                  <span className={`badge ${depth === 'deep' ? 'badge-accent' : 'badge-neutral'}`}>
                    {depth === 'deep' ? 'Deep Analysis' : 'Quick Scan'}
                  </span>
                )}
              </div>

              <div className="grid-2col" style={{ gap: 'var(--spacing-lg)' }}>
                <div className="upload-zone" onClick={() => showToast('PDF upload is not connected yet — paste contract text below to analyze.', 'info')}>
                  <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
                  <div className="font-semibold" style={{ marginBottom: '4px' }}>Upload Contract PDF</div>
                  <p className="text-sm text-muted">Drag & drop or click to browse</p>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--spacing-sm)' }}>Browse Files</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="text-xs text-muted font-semibold uppercase tracking-wider">Or Paste Contract Text</div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.75rem', padding: '2px 10px', height: 'auto' }}
                      onClick={() => setContractText(SAMPLE_CONTRACT)}
                    >
                      <i className="fa-solid fa-flask" style={{ marginRight: '4px' }}></i>
                      Use sample
                    </button>
                  </div>
                  <textarea
                    className="form-textarea"
                    placeholder="Paste the legal clauses here for immediate extraction..."
                    style={{ flex: 1, minHeight: '180px', resize: 'vertical' }}
                    value={contractText}
                    onChange={e => setContractText(e.target.value)}
                    disabled={isAnalyzing}
                  />
                  <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={handleAnalyze} disabled={isAnalyzing}>
                    {isAnalyzing
                      ? <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing...</>
                      : analysisResult
                        ? <><i className="fa-solid fa-rotate-right"></i> Re-analyze Contract</>
                        : <><i className="fa-solid fa-bolt"></i> Run AI Extraction</>}
                  </button>
                </div>
              </div>
            </div>

            {/* Extraction Cards */}
            <div className="grid grid-cols-2 delay-100">

              {extracts.obligations && (
                <div className="card extraction-card">
                  <div className="card-header">
                    <div className="list-item-icon" style={{ background: 'var(--status-success-bg)', color: 'var(--status-success)' }}>
                      <i className="fa-solid fa-bullseye"></i>
                    </div>
                    <span className="badge badge-success">{analysisResult ? 'AI Extracted' : 'Verified'}</span>
                  </div>
                  <div className="extraction-label">Scope</div>
                  {analysisResult ? (
                    <>
                      <h3 className="text-base font-semibold" style={{ marginTop: '6px', lineHeight: 1.4 }}>
                        {analysisResult.scope.summary}
                      </h3>
                      {analysisResult.scope.included.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          <div className="text-xs text-muted font-semibold" style={{ marginBottom: '4px' }}>INCLUDED</div>
                          <ul style={{ listStyleType: 'disc', paddingLeft: '16px', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.8 }}>
                            {analysisResult.scope.included.slice(0, 4).map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>
                      )}
                      {analysisResult.scope.excluded.length > 0 && (
                        <div style={{ marginTop: '8px' }}>
                          <div className="text-xs text-muted font-semibold" style={{ marginBottom: '4px' }}>EXCLUDED</div>
                          <ul style={{ listStyleType: 'disc', paddingLeft: '16px', color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.8, opacity: 0.7 }}>
                            {analysisResult.scope.excluded.slice(0, 3).map((item, i) => <li key={i} style={{ textDecoration: 'line-through' }}>{item}</li>)}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <h3 className="text-lg font-semibold" style={{ marginTop: '6px', lineHeight: 1.3 }}>Development of Clinic Web Platform</h3>
                  )}
                </div>
              )}

              {extracts.milestones && (
                <div className="card extraction-card">
                  <div className="card-header">
                    <div className="list-item-icon" style={{ background: 'var(--status-info-bg)', color: 'var(--status-info)' }}>
                      <i className="fa-solid fa-box-open"></i>
                    </div>
                    <span className="badge badge-info">
                      {analysisResult ? `${analysisResult.deliverables.length} Items` : '3 Items'}
                    </span>
                  </div>
                  <div className="extraction-label">Deliverables</div>
                  <ul style={{ marginTop: '8px', listStyleType: 'disc', paddingLeft: '18px', color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.9375rem' }}>
                    {analysisResult
                      ? analysisResult.deliverables.slice(0, 5).map((d, i) => <li key={i}>{d.title}</li>)
                      : <><li>Web Application</li><li>Admin Panel</li><li>REST API</li></>
                    }
                  </ul>
                </div>
              )}

              {extracts.payment && (
                <div className="card extraction-card">
                  <div className="card-header">
                    <div className="list-item-icon" style={{ background: 'var(--status-success-bg)', color: 'var(--status-success)' }}>
                      <i className="fa-solid fa-money-bill-wave"></i>
                    </div>
                    <span className="badge badge-neutral">
                      {analysisResult ? `${analysisResult.payments.length} Milestones` : '3 Milestones'}
                    </span>
                  </div>
                  <div className="extraction-label">Payment Schedule</div>
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {analysisResult
                      ? analysisResult.payments.slice(0, 4).map((p, i) => {
                          const equalShare = Math.round(100 / Math.min(analysisResult.payments.length, 4));
                          const pct = parsePercent(p.percentage) || equalShare;
                          const barClass = ['progress-success', 'progress-warning', 'progress-primary', 'progress-primary'][i % 4];
                          return (
                            <div key={i}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span className="text-sm text-secondary">{p.title}</span>
                                <span className="text-sm font-bold">{p.percentage ?? p.amount ?? '—'}</span>
                              </div>
                              <div className="progress-container">
                                <div className={`progress-bar ${barClass}`} style={{ width: `${pct}%` }}></div>
                              </div>
                            </div>
                          );
                        })
                      : [
                          { label: 'Upfront', pct: 50, style: 'progress-success' },
                          { label: 'UAT',     pct: 30, style: 'progress-warning' },
                          { label: 'Launch',  pct: 20, style: 'progress-primary' },
                        ].map(m => (
                          <div key={m.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span className="text-sm text-secondary">{m.label}</span>
                              <span className="text-sm font-bold">{m.pct}%</span>
                            </div>
                            <div className="progress-container">
                              <div className={`progress-bar ${m.style}`} style={{ width: `${m.pct}%` }}></div>
                            </div>
                          </div>
                        ))
                    }
                  </div>
                </div>
              )}

              {extracts.obligations && (
                <div className="card extraction-card">
                  <div className="card-header">
                    <div className="list-item-icon" style={{ background: 'var(--status-warning-bg)', color: 'var(--status-warning)' }}>
                      <i className="fa-solid fa-clipboard-list"></i>
                    </div>
                    <span className="badge badge-warning">
                      {analysisResult ? `${analysisResult.obligations.length} Active` : '1 Active'}
                    </span>
                  </div>
                  <div className="extraction-label">Obligations</div>
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {analysisResult
                      ? analysisResult.obligations.slice(0, 3).map((o, i) => (
                          <div key={i} style={{ background: 'var(--bg-main)', padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', borderLeft: `3px solid ${o.severity === 'critical' || o.severity === 'high' ? 'var(--status-warning)' : 'var(--border-subtle)'}` }}>
                            <div className="font-semibold text-sm">{o.title}</div>
                            <div className="text-xs text-muted" style={{ marginTop: '3px', lineHeight: 1.5 }}>{o.description}</div>
                          </div>
                        ))
                      : (
                          <div style={{ background: 'var(--bg-main)', padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--status-warning)' }}>
                            <div className="font-semibold text-sm">Weekly Reporting</div>
                            <div className="text-xs text-muted" style={{ marginTop: '3px', lineHeight: 1.5 }}>
                              Mandatory status update every Friday by 5:00 PM EST via designated project dashboard.
                            </div>
                          </div>
                        )
                    }
                  </div>
                </div>
              )}
            </div>

            {/* High Priority Risks */}
            {extracts.risks && <div className="card card-danger delay-200">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
                <i className="fa-solid fa-triangle-exclamation text-danger"></i>
                <span className="font-bold text-danger uppercase tracking-wider" style={{ fontSize: '0.8125rem' }}>
                  High Priority Risks & Clauses
                  {riskSens === 'high' && <span className="badge badge-danger" style={{ marginLeft: '8px' }}>High Sensitivity</span>}
                </span>
              </div>

              {analysisResult && filteredRisks.length === 0 && analysisResult.risks.length > 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', padding: 'var(--spacing-sm) 0' }}>
                  <i className="fa-solid fa-circle-info" style={{ marginRight: '6px' }}></i>
                  No risks match the current sensitivity threshold ({riskSens}). Raise Risk Sensitivity to see more.
                </p>
              ) : analysisResult && filteredRisks.length > 0 ? (
                <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-md)' }}>
                  {filteredRisks.slice(0, 2).map((risk, i) =>
                    i === 0 ? (
                      <div key={i} style={{ background: 'white', border: '1px solid var(--border-subtle)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--status-danger)' }}>
                        <div className="text-xs font-bold text-danger uppercase tracking-wider" style={{ marginBottom: '6px' }}>
                          {risk.category} Risk
                        </div>
                        <div className="font-semibold text-sm" style={{ marginBottom: '6px' }}>{risk.title}</div>
                        <p className="text-xs text-muted" style={{ lineHeight: 1.5 }}>{risk.impact}</p>
                      </div>
                    ) : (
                      <div key={i} style={{ background: 'var(--status-danger)', color: 'white', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 16px rgba(220, 38, 38, 0.25)' }}>
                        <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, marginBottom: '6px' }}>
                          {risk.severity} severity
                        </div>
                        <div className="font-bold" style={{ lineHeight: 1.4, marginBottom: '6px' }}>
                          &ldquo;{risk.sourceQuote.length > 120 ? risk.sourceQuote.slice(0, 117) + '…' : risk.sourceQuote}&rdquo;
                        </div>
                        <p style={{ fontSize: '0.75rem', opacity: 0.85, lineHeight: 1.5 }}>{risk.suggestedAction}</p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-md)' }}>
                  <div style={{ background: 'white', border: '1px solid var(--border-subtle)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--status-danger)' }}>
                    <div className="text-xs font-bold text-danger uppercase tracking-wider" style={{ marginBottom: '6px' }}>Penalty Clause</div>
                    <div className="font-semibold text-sm" style={{ marginBottom: '6px' }}>7-day delay penalty highlighted</div>
                    <p className="text-xs text-muted" style={{ lineHeight: 1.5 }}>Any delay exceeding the agreed timeline triggers an immediate financial review.</p>
                  </div>
                  <div style={{ background: 'var(--status-danger)', color: 'white', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 16px rgba(220, 38, 38, 0.25)' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, marginBottom: '6px' }}>Financial Impact</div>
                    <div className="font-bold" style={{ lineHeight: 1.4, marginBottom: '6px' }}>
                      &ldquo;10% deduction if delivery is delayed more than 7 days&rdquo;
                    </div>
                    <p style={{ fontSize: '0.75rem', opacity: 0.85, lineHeight: 1.5 }}>Critical risk detected in Clause 14.2 of the master agreement.</p>
                  </div>
                </div>
              )}
            </div>}

          </div>

          {/* ── Right Column ── */}
          <div className="section-gap">

            {/* Contract Risk Score / AI Confidence */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-shield-halved" style={{ color: analysisResult ? 'var(--accent-primary)' : (riskScore.overall >= 75 ? 'var(--status-danger)' : riskScore.overall >= 50 ? 'var(--status-warning)' : 'var(--status-success)') }}></i>
                  {analysisResult ? 'AI Confidence Score' : 'Contract Risk Score'}
                </h2>
                <span className={`badge ${analysisResult ? (displayScore >= 80 ? 'badge-success' : displayScore >= 60 ? 'badge-warning' : 'badge-neutral') : (riskScore.overall >= 75 ? 'badge-danger' : riskScore.overall >= 50 ? 'badge-warning' : 'badge-success')}`}>
                  {analysisResult
                    ? (displayScore >= 80 ? 'High Confidence' : displayScore >= 60 ? 'Medium Confidence' : 'Low Confidence')
                    : (riskScore.overall >= 75 ? 'High Risk' : riskScore.overall >= 50 ? 'Medium Risk' : 'Low Risk')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', padding: 'var(--spacing-md) 0' }}>
                <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 0 }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1, color: analysisResult ? 'var(--accent-primary)' : (riskScore.overall >= 75 ? 'var(--status-danger)' : riskScore.overall >= 50 ? 'var(--status-warning)' : 'var(--status-success)') }}>
                    {displayScore}
                  </div>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginTop: '4px' }}>/ 100</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="progress-container" style={{ height: '10px', marginBottom: 'var(--spacing-xs)' }}>
                    <div className="progress-bar" style={{ width: `${displayScore}%`, background: analysisResult ? 'var(--accent-primary)' : (riskScore.overall >= 75 ? 'var(--status-danger)' : riskScore.overall >= 50 ? 'var(--status-warning)' : 'var(--status-success)') }}></div>
                  </div>
                  <div className="text-xs text-muted">
                    {analysisResult
                      ? `${analysisResult.risks.length} risks · ${analysisResult.deliverables.length} deliverables · ${analysisResult.deadlines.length} deadlines`
                      : `Composite risk across ${depth === 'deep' ? '18' : depth === 'standard' ? '12' : '6'} contract clauses`}
                  </div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {([
                  { label: 'Penalty Exposure',   val: riskScore.penalty,    color: 'var(--status-danger)'  },
                  { label: 'Deadline Risk',      val: riskScore.deadline,   color: 'var(--status-warning)' },
                  { label: 'Scope Ambiguity',    val: riskScore.scope,      color: 'var(--accent-primary)' },
                  { label: 'Obligation Clarity', val: riskScore.obligation, color: 'var(--status-info)'    },
                ] as { label: string; val: number; color: string }[]).map(row => (
                  <div key={row.label} className="risk-sub-bar">
                    <span className="risk-sub-bar-label">{row.label}</span>
                    <div className="risk-sub-bar-track">
                      <div className="risk-sub-bar-fill" style={{ width: `${row.val}%`, background: row.color }}></div>
                    </div>
                    <span className="risk-sub-bar-value" style={{ color: row.color }}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deadline Tracker */}
            {extracts.milestones && <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-regular fa-calendar-clock text-accent"></i>
                  Deadline Tracker
                </h2>
                <span className={`badge ${analysisResult && analysisResult.deadlines.some(d => d.priority === 'critical') ? 'badge-danger' : 'badge-warning'}`}>
                  {analysisResult
                    ? `${analysisResult.deadlines.filter(d => d.priority === 'critical' || d.priority === 'high').length} Urgent`
                    : '1 Urgent'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {analysisResult && analysisResult.deadlines.length > 0
                  ? analysisResult.deadlines.map((dl, i) => {
                      const isUrgent = dl.priority === 'critical' || dl.priority === 'high';
                      return (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px var(--spacing-md)', background: isUrgent ? 'var(--status-warning-bg)' : 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: `1px solid ${isUrgent ? 'var(--status-warning-border)' : 'var(--border-subtle)'}` }}>
                          <div>
                            <div className="text-sm font-semibold">{dl.title}</div>
                            <div className="text-xs text-muted" style={{ marginTop: '2px' }}>
                              {dl.dueDate ?? dl.relativeTimeline ?? 'No date specified'}
                            </div>
                          </div>
                          <span className={`deadline-badge deadline-badge-${isUrgent ? 'urgent' : 'upcoming'}`}>
                            <i className="fa-regular fa-clock"></i>
                            {isUrgent ? '!' : '→'}
                          </span>
                        </div>
                      );
                    })
                  : MOCK_DEADLINES.map(dl => (
                      <div key={dl.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px var(--spacing-md)', background: dl.type === 'urgent' ? 'var(--status-warning-bg)' : 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: `1px solid ${dl.type === 'urgent' ? 'var(--status-warning-border)' : 'var(--border-subtle)'}` }}>
                        <div>
                          <div className="text-sm font-semibold">{dl.label}</div>
                          <div className="text-xs text-muted" style={{ marginTop: '2px' }}>{dl.date}</div>
                        </div>
                        <span className={`deadline-badge deadline-badge-${dl.type}`}>
                          <i className="fa-regular fa-clock"></i>
                          {dl.daysLeft}d
                        </span>
                      </div>
                    ))
                }
              </div>
              <button type="button" className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 'var(--spacing-md)' }} onClick={() => showToast('Calendar sync initiated', 'info')}>
                <i className="fa-regular fa-calendar-plus"></i> Sync to Calendar
              </button>
            </div>}

            {/* Suggested Actions */}
            <div className="card" style={{ background: 'linear-gradient(180deg, var(--bg-surface-elevated), white)' }}>
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-bolt text-accent"></i>
                  Suggested Actions
                </h2>
              </div>

              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                {analysisResult && filteredActions.length === 0 ? (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', padding: 'var(--spacing-sm) 0', textAlign: 'center' }}>
                    <i className="fa-solid fa-toggle-off" style={{ marginRight: '6px' }}></i>
                    Enable extract toggles to see suggested actions.
                  </p>
                ) : analysisResult && filteredActions.length > 0
                  ? filteredActions.slice(0, 4).map((action, i) => {
                      const colors = ACTION_COLORS[action.type] ?? { bg: 'rgba(37,99,235,0.1)', color: 'var(--accent-primary)' };
                      const isDanger = action.type === 'create_risk';
                      return (
                        <button
                          type="button"
                          key={i}
                          className="action-suggest"
                          style={{ width: '100%', textAlign: 'left', ...(isDanger ? { borderColor: 'var(--status-danger-border)', background: 'var(--status-danger-bg)' } : {}) }}
                          onClick={() => showToast(`${action.title} created`, isDanger ? 'warning' : 'success')}
                        >
                          <div className="action-icon" style={{ background: colors.bg, color: colors.color }}>
                            <i className={ACTION_ICONS[action.type] ?? 'fa-solid fa-bolt'}></i>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className={`font-medium text-sm${isDanger ? ' text-danger' : ''}`}>{action.title}</div>
                            <div className="text-xs text-muted" style={isDanger ? { color: 'var(--status-danger)', opacity: 0.8 } : {}}>{action.description}</div>
                          </div>
                          <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.6875rem', ...(isDanger ? { color: 'var(--status-danger)' } : {}) }}></i>
                        </button>
                      );
                    })
                  : (
                    <>
                      <button type="button" className="action-suggest" style={{ width: '100%', textAlign: 'left' }} onClick={() => showToast('Tasks created from deliverables', 'success')}>
                        <div className="action-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-primary)' }}>
                          <i className="fa-solid fa-list-check"></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="font-medium text-sm">Create Tasks</div>
                          <div className="text-xs text-muted">Auto-map from deliverables</div>
                        </div>
                        <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.6875rem' }}></i>
                      </button>

                      <button type="button" className="action-suggest" style={{ width: '100%', textAlign: 'left' }} onClick={() => showToast('Payment milestones created', 'success')}>
                        <div className="action-icon" style={{ background: 'var(--status-success-bg)', color: 'var(--status-success)' }}>
                          <i className="fa-solid fa-money-check-dollar"></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="font-medium text-sm">Create Payment Milestone</div>
                          <div className="text-xs text-muted">Generate invoice schedules</div>
                        </div>
                        <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.6875rem' }}></i>
                      </button>

                      <button type="button" className="action-suggest" style={{ width: '100%', textAlign: 'left', borderColor: 'var(--status-danger-border)', background: 'var(--status-danger-bg)' }} onClick={() => showToast('Risk alert flagged to PM', 'warning')}>
                        <div className="action-icon" style={{ background: 'rgba(220, 38, 38, 0.12)', color: 'var(--status-danger)' }}>
                          <i className="fa-solid fa-bell"></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="font-medium text-sm text-danger">Create Risk Alert</div>
                          <div className="text-xs" style={{ color: 'var(--status-danger)', opacity: 0.8 }}>Flag delay penalty to PM</div>
                        </div>
                        <i className="fa-solid fa-chevron-right" style={{ color: 'var(--status-danger)', fontSize: '0.6875rem' }}></i>
                      </button>
                    </>
                  )
                }
              </div>

              <div style={{ textAlign: 'center', marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border-subtle)' }}>
                <span className="text-xs text-muted font-medium">
                  <i className="fa-solid fa-bolt text-accent" style={{ marginRight: '4px' }}></i>
                  Powered by DocuPilot Intelligence
                </span>
              </div>
            </div>

            {/* Project Context */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-folder text-accent"></i>
                  Project Context
                </h2>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-sm)', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ width: '36px', height: '36px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-folder text-accent"></i>
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {analysisResult?.projectName ?? 'Clinic Web Platform'}
                  </div>
                  <div className="text-xs text-muted">
                    {analysisResult ? `${analysisResult.parties.length} parties identified` : 'Project ID: NEX-2024-082'}
                  </div>
                </div>
              </div>

              <div>
                {analysisResult
                  ? [
                      { label: 'Contract Title', value: analysisResult.contractTitle },
                      { label: 'Client',         value: client?.name ?? analysisResult.clientName ?? '—' },
                      { label: 'Vendor',         value: vendor?.name ?? '—' },
                      {
                        label: 'Change Requests',
                        value: analysisResult.changeRequestTerms.requiresWrittenApproval
                          ? 'Written approval required'
                          : 'No formal process defined',
                      },
                    ].map(row => (
                      <div key={row.label} className="data-row">
                        <span className="data-label">{row.label}</span>
                        <span className="data-value">{row.value}</span>
                      </div>
                    ))
                  : [
                      { label: 'Signatory A',    value: 'HealthConnect Inc.'  },
                      { label: 'Signatory B',    value: 'NexaSoft Solutions'  },
                      { label: 'Effective Date', value: 'Oct 24, 2024'        },
                    ].map(row => (
                      <div key={row.label} className="data-row">
                        <span className="data-label">{row.label}</span>
                        <span className="data-value">{row.value}</span>
                      </div>
                    ))
                }
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
