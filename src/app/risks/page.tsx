'use client';
import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';

type ToastType = 'success' | 'info' | 'warning' | 'error';
type Severity = 'all' | 'high' | 'medium' | 'low';
type Source = 'all' | 'contract' | 'finance' | 'scope' | 'evaluator' | 'meeting';
type Status = 'all' | 'active' | 'mitigated';

const TOAST_ICONS: Record<ToastType, string> = {
  success: 'fa-solid fa-circle-check',
  info:    'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
  error:   'fa-solid fa-circle-xmark',
};

const RISK_DATA = [
  {
    id: 1, severity: 'high' as const, source: 'scope' as const,
    title: 'Mobile app request outside approved scope',
    sourceLabel: 'Scope Guard',
    impact: 'Timeline +2 to +4 weeks and additional cost',
    actionText: 'Create Change Request',
    icon: 'fa-solid fa-circle-exclamation',
    cardClass: 'risk-card-high',
    colorClass: 'danger',
  },
  {
    id: 2, severity: 'medium' as const, source: 'contract' as const,
    title: 'Medium-risk delivery clause',
    sourceLabel: 'Contract Analysis',
    impact: 'Possible penalty if beta delivery is delayed',
    actionText: 'Add delivery reminder and owner',
    icon: 'fa-solid fa-file-signature',
    cardClass: 'risk-card-medium',
    colorClass: 'warning',
  },
  {
    id: 3, severity: 'medium' as const, source: 'finance' as const,
    title: 'Invoice requires finance approval',
    sourceLabel: 'Invoice Analysis',
    impact: 'Payment may be delayed without approval',
    actionText: 'Send to Approval Center',
    icon: 'fa-solid fa-file-invoice-dollar',
    cardClass: 'risk-card-medium',
    colorClass: 'warning',
  },
  {
    id: 4, severity: 'medium' as const, source: 'evaluator' as const,
    title: 'Project feasibility depends on integrations',
    sourceLabel: 'Project Evaluator',
    impact: 'Cost and timeline may increase',
    actionText: 'Validate integration requirements early',
    icon: 'fa-solid fa-clipboard-question',
    cardClass: 'risk-card-medium',
    colorClass: 'warning',
  },
  {
    id: 5, severity: 'low' as const, source: 'meeting' as const,
    title: 'Meeting action has no owner',
    sourceLabel: 'Meeting Notes',
    impact: 'Follow-up may be missed',
    actionText: 'Assign owner',
    icon: 'fa-solid fa-users',
    cardClass: 'risk-card-low',
    colorClass: 'info',
  }
];

const RISKS = RISK_DATA.map(r => ({ id: r.id, severity: r.severity, source: r.source }));

const RISK_DETAILS: Record<number, { dueDate: string; daysLeft: number }> = {
  1: { dueDate: 'May 10, 2026', daysLeft: 7  },
  2: { dueDate: 'May 15, 2026', daysLeft: 12 },
  3: { dueDate: 'May 12, 2026', daysLeft: 9  },
  4: { dueDate: 'May 20, 2026', daysLeft: 17 },
  5: { dueDate: 'May 05, 2026', daysLeft: 2  },
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

  const handleExport = useCallback(() => {
    const data = RISK_DATA.map(r => ({
      title: r.title,
      severity: r.severity,
      source: r.sourceLabel,
      status: mitigatedRisks.has(r.id) ? 'mitigated' : 'active',
      impact: r.impact,
      suggestedAction: r.actionText
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docupilot-risks-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Risk report exported', 'success');
  }, [mitigatedRisks, showToast]);

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
          <button type="button" className="btn btn-secondary" onClick={handleExport}>
            <i className="fa-solid fa-download"></i> Export
          </button>
        </div>

        {/* Filter Bar */}
        <div className="opts-panel">
          <div>
            <span className="opts-label">Severity</span>
            <div className="filter-group">
              {([['all', 'All'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']] as [Severity, string][]).map(([val, label]) => (
                <button type="button" key={val} className={`filter-btn${severity === val ? ' active' : ''}`} onClick={() => setSeverity(val)}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="opts-label">Source</span>
            <div className="filter-group">
              {([['all', 'All'], ['scope', 'Scope Guard'], ['contract', 'Contract Analysis'], ['finance', 'Invoice Analysis'], ['evaluator', 'Project Evaluator'], ['meeting', 'Meeting Notes']] as [Source, string][]).map(([val, label]) => (
                <button type="button" key={val} className={`filter-btn${source === val ? ' active' : ''}`} onClick={() => setSource(val)}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="opts-label">Status</span>
            <div className="filter-group">
              {([['all', 'All'], ['active', 'Active'], ['mitigated', 'Mitigated']] as [Status, string][]).map(([val, label]) => (
                <button type="button" key={val} className={`filter-btn${status === val ? ' active' : ''}`} onClick={() => setStatus(val)}>{label}</button>
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
          <div className="grid grid-cols-2 section-mb">
            {RISK_DATA.map(r => {
              if (!show(r.id)) return null;
              const details = RISK_DETAILS[r.id];
              return (
                <div key={r.id} className={`card ${r.cardClass} content-gap`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start', flex: 1 }}>
                      <div className="list-item-icon" style={{ background: `var(--status-${r.colorClass}-bg)`, color: `var(--status-${r.colorClass})`, width: '44px', height: '44px', fontSize: '1.125rem', flexShrink: 0 }}>
                        <i className={r.icon}></i>
                      </div>
                      <div>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span className={`badge badge-${r.colorClass}`}>{r.severity.charAt(0).toUpperCase() + r.severity.slice(1)} Severity</span>
                          <span className={`deadline-badge ${deadlineBadgeClass(details.daysLeft)}`}>
                            <i className="fa-regular fa-clock"></i> {details.daysLeft}d — {details.dueDate}
                          </span>
                        </div>
                        <h2 className="font-bold" style={{ fontSize: '1.0625rem', lineHeight: 1.3 }}>{r.title}</h2>
                      </div>
                    </div>
                  </div>

                  <div className="grid-2col" style={{ paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border-subtle)' }}>
                    <div className="info-pair">
                      <span className="info-pair-label">Source</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                        <i className="fa-solid fa-link" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}></i>
                        {r.sourceLabel}
                      </div>
                    </div>
                    <div className="info-pair">
                      <span className="info-pair-label">Impact</span>
                      <span className="info-pair-value" style={{ fontSize: '0.875rem' }}>{r.impact}</span>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', flex: 1 }}>
                      <i className="fa-regular fa-lightbulb text-accent"></i>
                      <p className="text-sm" style={{ lineHeight: 1.5 }}>
                        <strong>Action:</strong> {r.actionText}
                      </p>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <button
                        type="button"
                        className="text-sm font-semibold text-accent"
                        style={{ background: 'var(--bg-main)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => setOwnerDropdown(ownerDropdown === r.id ? null : r.id)}
                      >
                        {owners[r.id] || 'Assign Owner'} <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.5rem' }}></i>
                      </button>
                      {ownerDropdown === r.id && (
                        <div style={{ position: 'absolute', bottom: '100%', right: 0, zIndex: 10, background: 'white', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', minWidth: '130px', overflow: 'hidden', marginBottom: '4px' }}>
                          {OWNER_OPTIONS.map(o => (
                            <button type="button" key={o} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '6px 12px', fontSize: '0.8125rem', borderRadius: 0 }} onClick={() => handleOwnerSelect(r.id, o)}>
                              {o}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {mitigationFor !== r.id ? (
                    <button type="button" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => setMitigationFor(r.id)}>
                      <i className="fa-solid fa-shield-check"></i> Create Mitigation Task
                    </button>
                  ) : (
                    <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                      <div className="text-xs font-bold text-accent uppercase tracking-wider">New Mitigation Task</div>
                      <textarea className="form-textarea" rows={2} value={mitigationText} onChange={e => setMitigationText(e.target.value)} placeholder="Describe the mitigation action..." style={{ minHeight: '60px' }} />
                      <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => handleMitigate(r.id)} disabled={!mitigationText.trim()}>
                          <i className="fa-solid fa-check"></i> Save Task
                        </button>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setMitigationFor(null); setMitigationText(''); }}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
