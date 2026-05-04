'use client';
import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';

type ToastType = 'success' | 'info' | 'warning' | 'error';
type CompareAgainst = 'contract' | 'srs' | 'sow' | 'proposal';
type AnalysisLang = 'auto' | 'english' | 'arabic';
type Strictness = 'strict' | 'balanced' | 'lenient';

const TOAST_ICONS: Record<ToastType, string> = {
  success: 'fa-solid fa-circle-check',
  info:    'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
  error:   'fa-solid fa-circle-xmark',
};

const CONFIDENCE: Record<Strictness, number> = { strict: 94, balanced: 87, lenient: 72 };

export default function ScopeGuardPage() {
  const [compareAgainst, setCompareAgainst] = useState<CompareAgainst>('contract');
  const [analysisLang, setAnalysisLang] = useState<AnalysisLang>('auto');
  const [strictness, setStrictness] = useState<Strictness>('balanced');
  const [generateReply, setGenerateReply] = useState(true);
  const [showCRDoc, setShowCRDoc] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  return (
    <>
      <Header />
      <div className="page-container animate-fade-in">

        <div className="page-header">
          <div>
            <nav className="page-breadcrumb" style={{ marginBottom: 'var(--spacing-xs)' }}>
              <Link href="/projects">Projects</Link>
              <i className="fa-solid fa-chevron-right sep" style={{ fontSize: '0.6rem' }}></i>
              <span>Alpha Platform v2.0</span>
              <i className="fa-solid fa-chevron-right sep" style={{ fontSize: '0.6rem' }}></i>
              <span className="current">Scope Guard</span>
            </nav>
            <p className="page-label">Scope Intelligence</p>
            <h1 className="page-title">Scope Guard Analysis</h1>
            <p className="page-subtitle">Real-time contract deviation detection and decision support.</p>
          </div>
          <button className="btn btn-secondary" onClick={() => showToast('Re-analyzing request...', 'info')}>
            <i className="fa-solid fa-rotate-right"></i> Re-analyze
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
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-danger)', display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--status-danger)' }}>Out of Scope</span>
            </div>
          </div>
        </div>

        {/* Main Analysis Grid */}
        <div className="grid grid-cols-2" style={{ marginBottom: 'var(--spacing-lg)' }}>

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

            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', textAlign: 'right', lineHeight: 1.8, color: 'var(--text-primary)', fontWeight: 500 }} dir="rtl">
                &ldquo;ممكن تضيفون تطبيق جوال iOS و Android للمنصة؟&rdquo;
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--spacing-md)' }}>
              <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '6px' }}>English Translation</div>
              <p className="text-sm font-medium" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                &ldquo;Could you add iOS and Android mobile applications to the platform?&rdquo;
              </p>
            </div>
          </div>

          {/* Analysis Result */}
          <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', borderColor: 'var(--status-danger-border)' }}>
            <div className="scope-result-header scope-result-danger">
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                <div className="list-item-icon" style={{ background: 'var(--status-danger)', color: 'white', width: '44px', height: '44px', borderRadius: 'var(--radius-lg)' }}>
                  <i className="fa-solid fa-ban" style={{ fontSize: '1.25rem' }}></i>
                </div>
                <div>
                  <h3 className="font-bold" style={{ fontSize: '1.0625rem', color: 'var(--status-danger)' }}>Analysis Result</h3>
                  <div className="text-xs text-muted">
                    Compared against {compareAgainst === 'contract' ? 'Contract #CON-2024-089' : compareAgainst === 'srs' ? 'SRS v2.1' : compareAgainst === 'sow' ? 'SOW-2024-001' : 'Initial Proposal'}
                    {' '}· {strictness.charAt(0).toUpperCase() + strictness.slice(1)} mode
                  </div>
                </div>
              </div>
              <span className="badge badge-danger badge-lg">Out of Scope</span>
            </div>

            <div style={{ padding: 'var(--spacing-lg)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>

              <div>
                <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: 'var(--spacing-sm)' }}>Primary Reason</div>
                <div style={{ background: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-border)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                  <i className="fa-solid fa-circle-info" style={{ color: 'var(--status-danger)', marginTop: '3px', flexShrink: 0 }}></i>
                  <p className="text-sm" style={{ lineHeight: 1.6, color: 'var(--text-primary)' }}>
                    The current {compareAgainst === 'contract' ? 'contract' : compareAgainst.toUpperCase()} covers web platform and admin dashboard only. Mobile development for native OS requires separate infrastructure not outlined in the agreement.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-md)' }}>
                <div style={{ border: '1px solid var(--border-subtle)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', background: 'white' }}>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-solid fa-clock" style={{ color: 'var(--status-warning)' }}></i> Timeline
                  </div>
                  <div className="font-bold" style={{ color: 'var(--status-danger)' }}>High Impact</div>
                  <div className="text-xs text-muted">+12–16 weeks estimated</div>
                </div>
                <div style={{ border: '1px solid var(--border-subtle)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', background: 'white' }}>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-solid fa-money-bill-wave" style={{ color: 'var(--accent-primary)' }}></i> Cost
                  </div>
                  <div className="font-bold" style={{ color: 'var(--status-warning)' }}>Requires Estimate</div>
                  <div className="text-xs text-muted">Not in current budget</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-md)' }}>
                <div>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>AI Confidence Score</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: CONFIDENCE[strictness] >= 90 ? 'var(--status-success)' : 'var(--accent-primary)' }}>{CONFIDENCE[strictness]}%</span>
                    <span className="text-xs text-muted">certainty</span>
                  </div>
                </div>
                <div style={{ flex: 1, maxWidth: '120px' }}>
                  <div className="progress-container" style={{ height: '8px' }}>
                    <div className="progress-bar" style={{ width: `${CONFIDENCE[strictness]}%`, background: CONFIDENCE[strictness] >= 90 ? 'var(--status-success)' : 'var(--accent-primary)' }}></div>
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: '4px' }}>{strictness.charAt(0).toUpperCase() + strictness.slice(1)} mode</div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', background: 'rgba(124, 58, 237, 0.06)', border: '1px solid rgba(124, 58, 237, 0.2)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                  <div className="list-item-icon" style={{ background: 'var(--accent-primary)', color: 'white', width: '36px', height: '36px' }}>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                  </div>
                  <div>
                    <div className="text-xs text-accent font-bold uppercase tracking-wider">AI Suggested Action</div>
                    <div className="font-bold text-sm">Create Change Request</div>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ flexShrink: 0 }} onClick={() => { setShowCRDoc(true); showToast('Change Request created', 'success'); }}>Execute</button>
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
                  <span className="info-pair-value">May 3, 2026</span>
                </div>
                <div className="info-pair">
                  <span className="info-pair-label">Project</span>
                  <span className="info-pair-value">Alpha Platform v2.0</span>
                </div>
                <div className="info-pair">
                  <span className="info-pair-label">Status</span>
                  <span className="badge badge-warning">Pending Review</span>
                </div>
              </div>

              <div className="cr-document">
                <div className="cr-document-row">
                  <span className="cr-document-key">Change Description</span>
                  <span className="cr-document-val">Addition of native iOS and Android mobile applications to the existing web platform project scope.</span>
                </div>
                <div className="cr-document-row">
                  <span className="cr-document-key">Reason / Justification</span>
                  <span className="cr-document-val">Client requested cross-platform mobile presence to reach users on the go. Not covered in {compareAgainst === 'contract' ? 'Contract #CON-2024-089' : compareAgainst.toUpperCase()}.</span>
                </div>
                <div className="cr-document-row">
                  <span className="cr-document-key">Timeline Impact</span>
                  <span className="cr-document-val" style={{ color: 'var(--status-danger)', fontWeight: 600 }}>+12–16 weeks estimated</span>
                </div>
                <div className="cr-document-row">
                  <span className="cr-document-key">Cost Impact</span>
                  <span className="cr-document-val" style={{ color: 'var(--status-warning)', fontWeight: 600 }}>Formal estimate required — not yet budgeted</span>
                </div>
                <div className="cr-document-row">
                  <span className="cr-document-key">Scope Boundary Before</span>
                  <span className="cr-document-val">Web platform + admin dashboard only (as per original agreement)</span>
                </div>
                <div className="cr-document-row">
                  <span className="cr-document-key">Scope Boundary After</span>
                  <span className="cr-document-val">Web platform + admin dashboard + iOS app + Android app</span>
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
                <button className="btn btn-ghost btn-sm" onClick={() => showToast('Reply copied to clipboard', 'success')}>
                  <i className="fa-regular fa-copy"></i> Copy
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => showToast('Reply sent to client', 'success')}>
                  <i className="fa-solid fa-paper-plane"></i> Send
                </button>
              </div>
            </div>

            <div style={{ padding: 'var(--spacing-lg) var(--spacing-xl)', lineHeight: 1.9, color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>Dear Client,</p>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                Thank you for reaching out about adding iOS and Android mobile applications to the NexaSoft platform. We appreciate the vision for cross-platform expansion.
              </p>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                After reviewing the current project scope ({compareAgainst === 'contract' ? 'Contract #CON-2024-089' : compareAgainst === 'srs' ? 'SRS v2.1' : compareAgainst === 'sow' ? 'SOW-2024-001' : 'the Initial Proposal'}), we confirmed that the existing engagement covers the <strong style={{ color: 'var(--text-primary)' }}>Web Platform and Administrative Dashboard</strong> only. Developing native mobile applications is currently considered{' '}
                <strong style={{ color: 'var(--status-danger)' }}>out of scope</strong>.
              </p>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                However, we would be happy to accommodate this! We have initiated a{' '}
                <strong style={{ color: 'var(--accent-primary)' }}>Change Request</strong>. Our team will provide a formal estimate for the additional timeline and cost by end of business Thursday.
              </p>
              <p>Best regards,<br /><strong style={{ color: 'var(--text-primary)' }}>Project Management Team</strong></p>
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
