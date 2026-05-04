'use client';
import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';

type ToastType = 'success' | 'info' | 'warning' | 'error';
type Severity = 'all' | 'high' | 'medium' | 'low';
type Source = 'all' | 'contract' | 'finance' | 'scope';
type Status = 'all' | 'active' | 'mitigated';

const TOAST_ICONS: Record<ToastType, string> = {
  success: 'fa-solid fa-circle-check',
  info:    'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
  error:   'fa-solid fa-circle-xmark',
};

const RISKS = [
  { id: 1, severity: 'high'   as const, source: 'contract' as const },
  { id: 2, severity: 'high'   as const, source: 'scope'    as const },
  { id: 3, severity: 'medium' as const, source: 'finance'  as const },
  { id: 4, severity: 'medium' as const, source: 'contract' as const },
];

const RISK_DETAILS: Record<number, { dueDate: string; daysLeft: number }> = {
  1: { dueDate: 'May 15, 2026', daysLeft: 12 },
  2: { dueDate: 'May 10, 2026', daysLeft: 7  },
  3: { dueDate: 'May 12, 2026', daysLeft: 9  },
  4: { dueDate: 'May 20, 2026', daysLeft: 17 },
};

const OWNER_OPTIONS = ['Ahmad K.', 'Sara M.', 'James W.', 'Lin C.', 'Unassigned'];

export default function RisksPage() {
  const [severity, setSeverity] = useState<Severity>('all');
  const [source, setSource] = useState<Source>('all');
  const [status, setStatus] = useState<Status>('all');
  const [owners, setOwners] = useState<Record<number, string>>({ 1: 'Ahmad K.', 2: 'Unassigned', 3: 'Sara M.', 4: 'Unassigned' });
  const [ownerDropdown, setOwnerDropdown] = useState<number | null>(null);
  const [mitigationFor, setMitigationFor] = useState<number | null>(null);
  const [mitigationText, setMitigationText] = useState('');
  const [mitigatedRisks, setMitigatedRisks] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const effectiveStatus = (id: number): Status => mitigatedRisks.has(id) ? 'mitigated' : 'active';

  const visibleRisks = RISKS.filter(r =>
    (severity === 'all' || r.severity === severity) &&
    (source === 'all' || r.source === source) &&
    (status === 'all' || effectiveStatus(r.id) === status)
  );

  const show = (id: number) => visibleRisks.some(r => r.id === id);

  const handleOwnerSelect = (riskId: number, owner: string) => {
    setOwners(prev => ({ ...prev, [riskId]: owner }));
    setOwnerDropdown(null);
    showToast(`Risk owner set to ${owner}`, 'success');
  };

  const handleMitigate = (riskId: number) => {
    setMitigatedRisks(prev => new Set([...prev, riskId]));
    setMitigationFor(null);
    setMitigationText('');
    showToast('Mitigation task created', 'success');
  };

  const deadlineBadgeClass = (daysLeft: number) =>
    daysLeft <= 3 ? 'deadline-badge-overdue' : daysLeft <= 10 ? 'deadline-badge-urgent' : 'deadline-badge-upcoming';

  return (
    <>
      <Header />
      <div className="page-container animate-fade-in">

        <div className="page-header">
          <div>
            <p className="page-label">Risk Intelligence</p>
            <h1 className="page-title">Risk Radar</h1>
            <p className="page-subtitle">Real-time exposure monitoring across active projects. Analyze potential slippage and scope threats before they impact delivery.</p>
          </div>
          <button className="btn btn-secondary" onClick={() => showToast('Risk report exported', 'info')}>
            <i className="fa-solid fa-download"></i> Export
          </button>
        </div>

        {/* Filter Bar */}
        <div className="opts-panel" style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-lg)', alignItems: 'flex-end' }}>
          <div>
            <span className="opts-label">Severity</span>
            <div className="filter-group">
              {([['all', 'All'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']] as [Severity, string][]).map(([val, label]) => (
                <button key={val} className={`filter-btn${severity === val ? ' active' : ''}`} onClick={() => setSeverity(val)}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="opts-label">Source</span>
            <div className="filter-group">
              {([['all', 'All'], ['contract', 'Contract'], ['finance', 'Finance'], ['scope', 'Scope']] as [Source, string][]).map(([val, label]) => (
                <button key={val} className={`filter-btn${source === val ? ' active' : ''}`} onClick={() => setSource(val)}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="opts-label">Status</span>
            <div className="filter-group">
              {([['all', 'All'], ['active', 'Active'], ['mitigated', 'Mitigated']] as [Status, string][]).map(([val, label]) => (
                <button key={val} className={`filter-btn${status === val ? ' active' : ''}`} onClick={() => setStatus(val)}>{label}</button>
              ))}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span className="opts-label">Showing</span>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-primary)' }}>{visibleRisks.length} / {RISKS.length} risks</div>
          </div>
        </div>

        {/* Risk Cards */}
        {visibleRisks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-xl)' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '2rem', color: 'var(--status-success)', marginBottom: 'var(--spacing-md)' }}></i>
            <p className="font-semibold">No risks match the selected filters.</p>
            <p className="text-sm text-muted" style={{ marginTop: '6px' }}>Try adjusting severity, source, or status filters above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2" style={{ marginBottom: 'var(--spacing-xl)' }}>

            {show(1) && (
              <div className="card risk-card-high" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start', flex: 1 }}>
                    <div className="list-item-icon" style={{ background: 'var(--status-danger-bg)', color: 'var(--status-danger)', width: '44px', height: '44px', fontSize: '1.125rem', flexShrink: 0 }}>
                      <i className="fa-solid fa-circle-exclamation"></i>
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span className="badge badge-danger">High Severity</span>
                        <span className={`deadline-badge ${deadlineBadgeClass(RISK_DETAILS[1].daysLeft)}`}>
                          <i className="fa-regular fa-clock"></i> {RISK_DETAILS[1].daysLeft}d — {RISK_DETAILS[1].dueDate}
                        </span>
                      </div>
                      <h2 className="font-bold" style={{ fontSize: '1.0625rem', lineHeight: 1.3 }}>Late delivery penalty — Clinic Booking Platform</h2>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div className="text-xs text-muted font-semibold uppercase tracking-wider">Exposure</div>
                    <div className="font-bold" style={{ color: 'var(--status-danger)', fontSize: '1.125rem', marginTop: '2px' }}>Penalty 10%</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="info-pair">
                    <span className="info-pair-label">Source</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                      <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}></i>
                      Contract Milestone
                    </div>
                  </div>
                  <div className="info-pair">
                    <span className="info-pair-label">Impact</span>
                    <span className="info-pair-value" style={{ fontSize: '0.875rem' }}>Immediate Q4 revenue reduction</span>
                  </div>
                  <div className="info-pair">
                    <span className="info-pair-label">Owner</span>
                    <div style={{ position: 'relative' }}>
                      <button
                        className="text-sm font-semibold text-accent"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}
                        onClick={() => setOwnerDropdown(ownerDropdown === 1 ? null : 1)}
                      >
                        <i className="fa-solid fa-user-circle" style={{ fontSize: '0.75rem' }}></i>
                        {owners[1]}
                        <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.5rem' }}></i>
                      </button>
                      {ownerDropdown === 1 && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 10, background: 'white', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', minWidth: '130px', overflow: 'hidden', marginTop: '4px' }}>
                          {OWNER_OPTIONS.map(o => (
                            <button key={o} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '6px 12px', fontSize: '0.8125rem', borderRadius: 0 }} onClick={() => handleOwnerSelect(1, o)}>
                              {o}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.18)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', flex: 1 }}>
                    <i className="fa-regular fa-lightbulb text-accent"></i>
                    <p className="text-sm" style={{ lineHeight: 1.5 }}>
                      <strong>Suggested:</strong> Trigger Force Majeure clause review or initiate stakeholder re-negotiation.
                    </p>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ flexShrink: 0 }} onClick={() => showToast('Risk resolution initiated', 'success')}>
                    Resolve <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                </div>

                {mitigationFor !== 1 ? (
                  <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => setMitigationFor(1)}>
                    <i className="fa-solid fa-shield-check"></i> Create Mitigation Task
                  </button>
                ) : (
                  <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    <div className="text-xs font-bold text-accent uppercase tracking-wider">New Mitigation Task</div>
                    <textarea className="form-textarea" rows={2} value={mitigationText} onChange={e => setMitigationText(e.target.value)} placeholder="Describe the mitigation action..." style={{ minHeight: '60px' }} />
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleMitigate(1)} disabled={!mitigationText.trim()}>
                        <i className="fa-solid fa-check"></i> Save Task
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setMitigationFor(null); setMitigationText(''); }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {show(2) && (
              <div className="card risk-card-high" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span className="badge badge-danger">High Severity</span>
                      <span className={`deadline-badge ${deadlineBadgeClass(RISK_DETAILS[2].daysLeft)}`}>
                        <i className="fa-regular fa-clock"></i> {RISK_DETAILS[2].daysLeft}d — {RISK_DETAILS[2].dueDate}
                      </span>
                    </div>
                    <h2 className="font-bold" style={{ fontSize: '1.0625rem', lineHeight: 1.3 }}>Out-of-scope mobile app request</h2>
                  </div>
                  <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--status-danger)', fontSize: '1.5rem', flexShrink: 0 }}></i>
                </div>

                <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
                  Potential scope creep identified in recent client communication regarding cross-platform push notifications.
                </p>

                <div style={{ background: 'var(--bg-surface-elevated)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Impact</div>
                  <div className="text-sm font-medium">Estimated 80 extra dev hours not currently in SOW</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--spacing-sm)', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ position: 'relative' }}>
                    <span className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginRight: '6px' }}>Owner:</span>
                    <button
                      className="text-sm font-semibold text-accent"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onClick={() => setOwnerDropdown(ownerDropdown === 2 ? null : 2)}
                    >
                      {owners[2]} <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.5rem' }}></i>
                    </button>
                    {ownerDropdown === 2 && (
                      <div style={{ position: 'absolute', bottom: '100%', left: 0, zIndex: 10, background: 'white', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', minWidth: '130px', overflow: 'hidden', marginBottom: '4px' }}>
                        {OWNER_OPTIONS.map(o => (
                          <button key={o} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '6px 12px', fontSize: '0.8125rem', borderRadius: 0 }} onClick={() => handleOwnerSelect(2, o)}>
                            {o}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                    <Link href="/scope-guard" className="text-sm font-semibold text-accent">View SOW</Link>
                    <button className="btn btn-secondary btn-sm" onClick={() => showToast('Risk flagged for billing', 'warning')}>Flag for Billing</button>
                  </div>
                </div>

                {mitigationFor !== 2 ? (
                  <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => setMitigationFor(2)}>
                    <i className="fa-solid fa-shield-check"></i> Create Mitigation Task
                  </button>
                ) : (
                  <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    <div className="text-xs font-bold text-accent uppercase tracking-wider">New Mitigation Task</div>
                    <textarea className="form-textarea" rows={2} value={mitigationText} onChange={e => setMitigationText(e.target.value)} placeholder="Describe the mitigation action..." style={{ minHeight: '60px' }} />
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleMitigate(2)} disabled={!mitigationText.trim()}>
                        <i className="fa-solid fa-check"></i> Save Task
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setMitigationFor(null); setMitigationText(''); }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {show(3) && (
              <div className="card risk-card-medium" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                  <div className="list-item-icon" style={{ background: 'var(--status-warning-bg)', color: 'var(--status-warning)', width: '44px', height: '44px', fontSize: '1.125rem', flexShrink: 0 }}>
                    <i className="fa-solid fa-file-invoice-dollar"></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span className="badge badge-warning">Medium Severity</span>
                      <span className={`deadline-badge ${deadlineBadgeClass(RISK_DETAILS[3].daysLeft)}`}>
                        <i className="fa-regular fa-clock"></i> {RISK_DETAILS[3].daysLeft}d — {RISK_DETAILS[3].dueDate}
                      </span>
                    </div>
                    <h2 className="font-bold" style={{ fontSize: '1.0625rem', lineHeight: 1.3 }}>Invoice pending approval</h2>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <div className="info-pair">
                    <span className="info-pair-label">Related Project</span>
                    <span className="info-pair-value text-sm">DesignPro Studio Rebrand</span>
                  </div>
                  <div className="info-pair">
                    <span className="info-pair-label">Source</span>
                    <span className="info-pair-value text-sm">Finance Portal</span>
                  </div>
                </div>

                <div style={{ background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', fontStyle: 'italic' }}>
                  <p className="text-sm" style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    &ldquo;Approval delayed due to missing tax ID on the primary vendor profile. Payment cycle at risk.&rdquo;
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--spacing-sm)', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ position: 'relative' }}>
                    <span className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginRight: '6px' }}>Owner:</span>
                    <button
                      className="text-sm font-semibold text-accent"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onClick={() => setOwnerDropdown(ownerDropdown === 3 ? null : 3)}
                    >
                      {owners[3]} <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.5rem' }}></i>
                    </button>
                    {ownerDropdown === 3 && (
                      <div style={{ position: 'absolute', bottom: '100%', left: 0, zIndex: 10, background: 'white', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', minWidth: '130px', overflow: 'hidden', marginBottom: '4px' }}>
                        {OWNER_OPTIONS.map(o => (
                          <button key={o} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '6px 12px', fontSize: '0.8125rem', borderRadius: 0 }} onClick={() => handleOwnerSelect(3, o)}>
                            {o}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => showToast('Reminder sent to client', 'success')}>
                      <i className="fa-solid fa-bell"></i> Remind Client
                    </button>
                    <button className="btn" style={{ flex: 1, background: 'var(--status-warning-bg)', color: 'var(--status-warning)', border: '1px solid var(--status-warning-border)' }} onClick={() => showToast('Invoice info updated', 'success')}>
                      <i className="fa-solid fa-pen"></i> Update Info
                    </button>
                  </div>
                </div>

                {mitigationFor !== 3 ? (
                  <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => setMitigationFor(3)}>
                    <i className="fa-solid fa-shield-check"></i> Create Mitigation Task
                  </button>
                ) : (
                  <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    <div className="text-xs font-bold text-accent uppercase tracking-wider">New Mitigation Task</div>
                    <textarea className="form-textarea" rows={2} value={mitigationText} onChange={e => setMitigationText(e.target.value)} placeholder="Describe the mitigation action..." style={{ minHeight: '60px' }} />
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleMitigate(3)} disabled={!mitigationText.trim()}>
                        <i className="fa-solid fa-check"></i> Save Task
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setMitigationFor(null); setMitigationText(''); }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {show(4) && (
              <div className="card risk-card-medium" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span className="badge badge-warning">Medium Severity</span>
                      <span className={`deadline-badge ${deadlineBadgeClass(RISK_DETAILS[4].daysLeft)}`}>
                        <i className="fa-regular fa-clock"></i> {RISK_DETAILS[4].daysLeft}d — {RISK_DETAILS[4].dueDate}
                      </span>
                    </div>
                    <h2 className="font-bold" style={{ fontSize: '1.0625rem', lineHeight: 1.3 }}>Missing client confirmation on API docs</h2>
                  </div>
                  <i className="fa-solid fa-clipboard-question" style={{ color: 'var(--status-warning)', fontSize: '1.5rem', flexShrink: 0 }}></i>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <div style={{ background: 'var(--status-success-bg)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-success-border)' }}>
                    <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Suggested Action</div>
                    <div className="text-sm font-medium">Hold sprint kickoff until sign-off is secured.</div>
                  </div>
                  <div style={{ background: 'var(--bg-surface-elevated)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Project</div>
                    <div className="text-sm font-medium">Legacy Integration v2</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--spacing-sm)', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <div style={{ display: 'flex' }}>
                      {[{ initials: 'JS', bg: 'var(--accent-primary)' }, { initials: 'MK', bg: 'var(--status-info)' }, { initials: '+3', bg: 'var(--bg-surface-elevated)' }].map((a, i) => (
                        <div key={i} className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.6875rem', zIndex: 3 - i, marginLeft: i > 0 ? '-8px' : '0', background: a.bg, border: '2px solid white', color: i === 2 ? 'var(--text-muted)' : 'white' }}>
                          {a.initials}
                        </div>
                      ))}
                    </div>
                    <div style={{ position: 'relative' }}>
                      <button
                        className="text-sm font-semibold text-accent"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={() => setOwnerDropdown(ownerDropdown === 4 ? null : 4)}
                      >
                        {owners[4]} <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.5rem' }}></i>
                      </button>
                      {ownerDropdown === 4 && (
                        <div style={{ position: 'absolute', bottom: '100%', left: 0, zIndex: 10, background: 'white', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', minWidth: '130px', overflow: 'hidden', marginBottom: '4px' }}>
                          {OWNER_OPTIONS.map(o => (
                            <button key={o} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '6px 12px', fontSize: '0.8125rem', borderRadius: 0 }} onClick={() => handleOwnerSelect(4, o)}>
                              {o}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="text-sm font-semibold text-accent" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => showToast('Reminder sent', 'success')}>
                    Send Reminder <i className="fa-solid fa-paper-plane text-xs"></i>
                  </button>
                </div>

                {mitigationFor !== 4 ? (
                  <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => setMitigationFor(4)}>
                    <i className="fa-solid fa-shield-check"></i> Create Mitigation Task
                  </button>
                ) : (
                  <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    <div className="text-xs font-bold text-accent uppercase tracking-wider">New Mitigation Task</div>
                    <textarea className="form-textarea" rows={2} value={mitigationText} onChange={e => setMitigationText(e.target.value)} placeholder="Describe the mitigation action..." style={{ minHeight: '60px' }} />
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleMitigate(4)} disabled={!mitigationText.trim()}>
                        <i className="fa-solid fa-check"></i> Save Task
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setMitigationFor(null); setMitigationText(''); }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* Risk Stats */}
        <div className="grid grid-cols-4">
          <div className="card stat-card">
            <div className="stat-card-header">
              <div className="stat-icon" style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>
                <i className="fa-solid fa-chart-bar"></i>
              </div>
            </div>
            <div className="stat-value">24</div>
            <div className="stat-label">Total Risk Items</div>
          </div>

          <div className="card stat-card" style={{ borderTop: '3px solid var(--status-danger)' }}>
            <div className="stat-card-header">
              <div className="stat-icon" style={{ background: 'var(--status-danger-bg)', color: 'var(--status-danger)' }}>
                <i className="fa-solid fa-circle-exclamation"></i>
              </div>
              <span className="badge badge-danger">Action Required</span>
            </div>
            <div className="stat-value" style={{ color: 'var(--status-danger)' }}>02</div>
            <div className="stat-label">Critical (High)</div>
          </div>

          <div className="card stat-card" style={{ borderTop: '3px solid var(--status-warning)' }}>
            <div className="stat-card-header">
              <div className="stat-icon" style={{ background: 'var(--status-warning-bg)', color: 'var(--status-warning)' }}>
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <span className="badge badge-warning">Monitor</span>
            </div>
            <div className="stat-value" style={{ color: 'var(--status-warning)' }}>14</div>
            <div className="stat-label">Attention (Mid)</div>
          </div>

          <div className="card stat-card" style={{ borderTop: '3px solid var(--status-success)' }}>
            <div className="stat-card-header">
              <div className="stat-icon" style={{ background: 'var(--status-success-bg)', color: 'var(--status-success)' }}>
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <span className="badge badge-success">Today</span>
            </div>
            <div className="stat-value" style={{ color: 'var(--status-success)' }}>{mitigatedRisks.size > 0 ? String(mitigatedRisks.size).padStart(2, '0') : '08'}</div>
            <div className="stat-label">Mitigated Today</div>
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
