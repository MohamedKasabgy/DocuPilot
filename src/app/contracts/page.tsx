'use client';
import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';

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

const DEADLINES = [
  { label: 'Phase 1 Delivery',       date: 'Jun 15, 2026', daysLeft: 43, type: 'upcoming' as const },
  { label: 'UAT Submission',         date: 'May 28, 2026', daysLeft: 25, type: 'upcoming' as const },
  { label: 'Weekly Status Report',   date: 'May 09, 2026', daysLeft: 6,  type: 'urgent'   as const },
  { label: 'Milestone Payment — UAT',date: 'May 30, 2026', daysLeft: 27, type: 'upcoming' as const },
];

export default function ContractsPage() {
  const [depth, setDepth] = useState<AnalysisDepth>('standard');
  const [riskSens, setRiskSens] = useState<RiskSens>('medium');
  const [lang, setLang] = useState<AnalysisLang>('auto');
  const [extracts, setExtracts] = useState({ obligations: true, milestones: true, payment: true, risks: true });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => { setIsAnalyzing(false); showToast('Extraction complete — 4 sections found', 'success'); }, 1800);
  };

  const riskScore = getRiskScore(riskSens, depth);

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
          <button className="btn btn-secondary" onClick={() => showToast('Contract vault opened', 'info')}>
            <i className="fa-solid fa-folder-open"></i> Contract Vault
          </button>
        </div>

        {/* Analysis Options */}
        <div className="opts-panel" style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-lg)', alignItems: 'flex-end' }}>
          <div>
            <span className="opts-label">Analysis Depth</span>
            <div className="seg-control">
              {([['quick', 'Quick'], ['standard', 'Standard'], ['deep', 'Deep']] as [AnalysisDepth, string][]).map(([val, label]) => (
                <button key={val} className={`seg-btn${depth === val ? ' active' : ''}`} onClick={() => setDepth(val)}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="opts-label">Risk Sensitivity</span>
            <div className="seg-control">
              {([['low', 'Low'], ['medium', 'Medium'], ['high', 'High']] as [RiskSens, string][]).map(([val, label]) => (
                <button key={val} className={`seg-btn${riskSens === val ? ' active' : ''}`} onClick={() => setRiskSens(val)}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="opts-label">Language</span>
            <div className="seg-control">
              {([['auto', 'Auto'], ['english', 'English'], ['arabic', 'Arabic']] as [AnalysisLang, string][]).map(([val, label]) => (
                <button key={val} className={`seg-btn${lang === val ? ' active' : ''}`} onClick={() => setLang(val)}>{label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
            <span className="opts-label" style={{ marginBottom: 0, alignSelf: 'center' }}>Extract:</span>
            {(Object.keys(extracts) as (keyof typeof extracts)[]).map(key => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  className={`toggle-switch${extracts[key] ? ' on' : ''}`}
                  style={{ width: '28px', height: '16px' }}
                  onClick={() => setExtracts(prev => ({ ...prev, [key]: !prev[key] }))}
                  aria-label={`Toggle ${key}`}
                />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="layout-sidebar-right">

          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>

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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                <div className="upload-zone" onClick={() => showToast('File picker opened', 'info')}>
                  <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
                  <div className="font-semibold" style={{ marginBottom: '4px' }}>Upload Contract PDF</div>
                  <p className="text-sm text-muted">Drag & drop or click to browse</p>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--spacing-sm)' }}>Browse Files</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider">Or Paste Contract Text</div>
                  <textarea
                    className="form-textarea"
                    placeholder="Paste the legal clauses here for immediate extraction..."
                    style={{ flex: 1, minHeight: '130px' }}
                  ></textarea>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAnalyze} disabled={isAnalyzing}>
                    {isAnalyzing
                      ? <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing...</>
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
                    <span className="badge badge-success">Verified</span>
                  </div>
                  <div className="extraction-label">Scope</div>
                  <h3 className="text-lg font-semibold" style={{ marginTop: '6px', lineHeight: 1.3 }}>Development of Clinic Web Platform</h3>
                </div>
              )}

              {extracts.milestones && (
                <div className="card extraction-card">
                  <div className="card-header">
                    <div className="list-item-icon" style={{ background: 'var(--status-info-bg)', color: 'var(--status-info)' }}>
                      <i className="fa-solid fa-box-open"></i>
                    </div>
                    <span className="badge badge-info">3 Items</span>
                  </div>
                  <div className="extraction-label">Deliverables</div>
                  <ul style={{ marginTop: '8px', listStyleType: 'disc', paddingLeft: '18px', color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.9375rem' }}>
                    <li>Web Application</li>
                    <li>Admin Panel</li>
                    <li>REST API</li>
                  </ul>
                </div>
              )}

              {extracts.payment && (
                <div className="card extraction-card">
                  <div className="card-header">
                    <div className="list-item-icon" style={{ background: 'var(--status-success-bg)', color: 'var(--status-success)' }}>
                      <i className="fa-solid fa-money-bill-wave"></i>
                    </div>
                    <span className="badge badge-neutral">3 Milestones</span>
                  </div>
                  <div className="extraction-label">Payment Schedule</div>
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { label: 'Upfront', pct: 50, style: 'progress-success' },
                      { label: 'UAT', pct: 30, style: 'progress-warning' },
                      { label: 'Launch', pct: 20, style: 'progress-primary' },
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
                    ))}
                  </div>
                </div>
              )}

              {extracts.risks && (
                <div className="card extraction-card">
                  <div className="card-header">
                    <div className="list-item-icon" style={{ background: 'var(--status-warning-bg)', color: 'var(--status-warning)' }}>
                      <i className="fa-solid fa-clipboard-list"></i>
                    </div>
                    <span className="badge badge-warning">1 Active</span>
                  </div>
                  <div className="extraction-label">Obligations</div>
                  <div style={{ marginTop: '8px', background: 'var(--bg-main)', padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--status-warning)' }}>
                    <div className="font-semibold text-sm">Weekly Reporting</div>
                    <div className="text-xs text-muted" style={{ marginTop: '3px', lineHeight: 1.5 }}>
                      Mandatory status update every Friday by 5:00 PM EST via designated project dashboard.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* High Priority Risks */}
            <div className="card card-danger delay-200">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
                <i className="fa-solid fa-triangle-exclamation text-danger"></i>
                <span className="font-bold text-danger uppercase tracking-wider" style={{ fontSize: '0.8125rem' }}>
                  High Priority Risks & Clauses
                  {riskSens === 'high' && <span className="badge badge-danger" style={{ marginLeft: '8px' }}>High Sensitivity</span>}
                </span>
              </div>

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
            </div>

          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>

            {/* Contract Risk Score */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-shield-halved" style={{ color: riskScore.overall >= 75 ? 'var(--status-danger)' : riskScore.overall >= 50 ? 'var(--status-warning)' : 'var(--status-success)' }}></i>
                  Contract Risk Score
                </h2>
                <span className={`badge ${riskScore.overall >= 75 ? 'badge-danger' : riskScore.overall >= 50 ? 'badge-warning' : 'badge-success'}`}>
                  {riskScore.overall >= 75 ? 'High Risk' : riskScore.overall >= 50 ? 'Medium Risk' : 'Low Risk'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', padding: 'var(--spacing-md) 0' }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1, color: riskScore.overall >= 75 ? 'var(--status-danger)' : riskScore.overall >= 50 ? 'var(--status-warning)' : 'var(--status-success)' }}>
                    {riskScore.overall}
                  </div>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginTop: '4px' }}>/ 100</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="progress-container" style={{ height: '10px', marginBottom: 'var(--spacing-xs)' }}>
                    <div className="progress-bar" style={{ width: `${riskScore.overall}%`, background: riskScore.overall >= 75 ? 'var(--status-danger)' : riskScore.overall >= 50 ? 'var(--status-warning)' : 'var(--status-success)' }}></div>
                  </div>
                  <div className="text-xs text-muted">Composite risk across {depth === 'deep' ? '18' : depth === 'standard' ? '12' : '6'} contract clauses</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {([
                  { label: 'Penalty Exposure',   val: riskScore.penalty,    color: 'var(--status-danger)' },
                  { label: 'Deadline Risk',      val: riskScore.deadline,   color: 'var(--status-warning)' },
                  { label: 'Scope Ambiguity',    val: riskScore.scope,      color: 'var(--accent-primary)' },
                  { label: 'Obligation Clarity', val: riskScore.obligation, color: 'var(--status-info)' },
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
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-regular fa-calendar-clock text-accent"></i>
                  Deadline Tracker
                </h2>
                <span className="badge badge-warning">1 Urgent</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {DEADLINES.map(dl => (
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
                ))}
              </div>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 'var(--spacing-md)' }} onClick={() => showToast('Calendar sync initiated', 'info')}>
                <i className="fa-regular fa-calendar-plus"></i> Sync to Calendar
              </button>
            </div>

            {/* Suggested Actions */}
            <div className="card" style={{ background: 'linear-gradient(180deg, var(--bg-surface-elevated), white)' }}>
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-bolt text-accent"></i>
                  Suggested Actions
                </h2>
              </div>

              <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <button className="action-suggest" style={{ width: '100%', textAlign: 'left' }} onClick={() => showToast('Tasks created from deliverables', 'success')}>
                  <div className="action-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-primary)' }}>
                    <i className="fa-solid fa-list-check"></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="font-medium text-sm">Create Tasks</div>
                    <div className="text-xs text-muted">Auto-map from deliverables</div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.6875rem' }}></i>
                </button>

                <button className="action-suggest" style={{ width: '100%', textAlign: 'left' }} onClick={() => showToast('Payment milestones created', 'success')}>
                  <div className="action-icon" style={{ background: 'var(--status-success-bg)', color: 'var(--status-success)' }}>
                    <i className="fa-solid fa-money-check-dollar"></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="font-medium text-sm">Create Payment Milestone</div>
                    <div className="text-xs text-muted">Generate invoice schedules</div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.6875rem' }}></i>
                </button>

                <button className="action-suggest" style={{ width: '100%', textAlign: 'left', borderColor: 'var(--status-danger-border)', background: 'var(--status-danger-bg)' }} onClick={() => showToast('Risk alert flagged to PM', 'warning')}>
                  <div className="action-icon" style={{ background: 'rgba(220, 38, 38, 0.12)', color: 'var(--status-danger)' }}>
                    <i className="fa-solid fa-bell"></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="font-medium text-sm text-danger">Create Risk Alert</div>
                    <div className="text-xs" style={{ color: 'var(--status-danger)', opacity: 0.8 }}>Flag delay penalty to PM</div>
                  </div>
                  <i className="fa-solid fa-chevron-right" style={{ color: 'var(--status-danger)', fontSize: '0.6875rem' }}></i>
                </button>
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
                  <div className="font-semibold text-sm">Clinic Web Platform</div>
                  <div className="text-xs text-muted">Project ID: NEX-2024-082</div>
                </div>
              </div>

              <div>
                {[
                  { label: 'Signatory A', value: 'HealthConnect Inc.' },
                  { label: 'Signatory B', value: 'NexaSoft Solutions' },
                  { label: 'Effective Date', value: 'Oct 24, 2024' },
                ].map(row => (
                  <div key={row.label} className="data-row">
                    <span className="data-label">{row.label}</span>
                    <span className="data-value">{row.value}</span>
                  </div>
                ))}
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
