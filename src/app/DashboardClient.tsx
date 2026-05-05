'use client';
import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/common/MetricCard';
import Link from 'next/link';
import type { DashboardData } from '@/lib/dashboard/load';

type Period = 'today' | 'week' | 'month';
type ToastType = 'success' | 'info' | 'warning' | 'error';

const METRICS: Record<Period, { projects: number; invoices: number; approvals: number; risks: number }> = {
  today: { projects: 12, invoices: 8, approvals: 5, risks: 3 },
  week: { projects: 12, invoices: 24, approvals: 17, risks: 6 },
  month: { projects: 12, invoices: 61, approvals: 43, risks: 9 },
};

const PERIOD_LABELS: Record<Period, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
};

const TOAST_ICONS: Record<ToastType, string> = {
  success: 'fa-solid fa-circle-check',
  info: 'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
  error: 'fa-solid fa-circle-xmark',
};

const UPCOMING_DEADLINES = [
  { label: 'Invoice INV-2026-042 approval', type: 'invoice', daysLeft: 4, icon: 'fa-solid fa-file-invoice', color: 'var(--status-warning)', bg: 'var(--status-warning-bg)', href: '/invoices' },
  { label: 'Clinic Booking Platform delivery', type: 'contract', daysLeft: 7, icon: 'fa-solid fa-file-signature', color: 'var(--status-danger)', bg: 'var(--status-danger-bg)', href: '/contracts' },
  { label: 'Mobile app CR signature', type: 'scope', daysLeft: 12, icon: 'fa-solid fa-shield-halved', color: 'var(--accent-primary)', bg: 'rgba(37,99,235,0.08)', href: '/scope-guard' },
  { label: 'DesignPro risk escalation', type: 'risk', daysLeft: 18, icon: 'fa-solid fa-triangle-exclamation', color: 'var(--status-info)', bg: 'var(--status-info-bg)', href: '/risks' },
];

const LEVEL_LABEL: Record<'low' | 'medium' | 'high', { label: string; color: string }> = {
  low: { label: 'Low', color: 'var(--status-success)' },
  medium: { label: 'Medium', color: 'var(--status-warning)' },
  high: { label: 'High', color: 'var(--status-danger)' },
};

const TIMELINE_LABEL = {
  on_track: { label: 'On Track', color: 'var(--status-success)', icon: 'fa-circle-check' },
  at_risk: { label: 'At Risk', color: 'var(--status-warning)', icon: 'fa-triangle-exclamation' },
  delayed: { label: 'Delayed', color: 'var(--status-danger)', icon: 'fa-circle-xmark' },
} as const;

const SOURCE_ICON: Record<'project_intelligence' | 'contract' | 'invoice' | 'scope_guard' | 'risk', string> = {
  project_intelligence: 'fa-solid fa-diagram-project',
  contract: 'fa-solid fa-file-signature',
  invoice: 'fa-solid fa-file-invoice',
  scope_guard: 'fa-solid fa-shield-halved',
  risk: 'fa-solid fa-triangle-exclamation',
};

interface DashboardClientProps {
  data: DashboardData;
}

export default function DashboardClient({ data }: DashboardClientProps) {
  const [period, setPeriod] = useState<Period>('today');
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const m = METRICS[period];
  const isFallback = data.source === 'fallback';

  return (
    <>
      <Header />
      <div className="page-container animate-fade-in">

        {/* Page Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
              <p className="page-label" style={{ margin: 0 }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <span className="demo-badge" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', border: '1px solid rgba(124, 58, 237, 0.2)' }}><i className="fa-solid fa-sparkles"></i> AI-Powered</span>
              {isFallback && (
                <span className="badge badge-warning" title="Supabase not configured or no data yet">
                  <i className="fa-solid fa-shield-halved"></i> Demo Data
                </span>
              )}
            </div>
            <h1 className="page-title">Decision Dashboard</h1>
            <p className="page-subtitle">Active decisions, project health, financial signal, and AI-recommended next moves.</p>
          </div>
          <div className="page-header-actions">
            <div className="seg-control">
              {(['today', 'week', 'month'] as Period[]).map(p => (
                <button key={p} className={`seg-btn${period === p ? ' active' : ''}`} aria-pressed={period === p} onClick={() => setPeriod(p)}>
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
            <button className="btn btn-secondary" onClick={() => showToast('Dashboard export prepared', 'success')}>
              <i className="fa-solid fa-download"></i> Export
            </button>
            <Link href="/projects?new=true" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              <i className="fa-solid fa-plus"></i> New Project
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-4 section-mb">
          <MetricCard
            title="Active Projects"
            value={m.projects}
            icon="fa-solid fa-chart-line"
            badgeText="+2 this week"
            badgeType="success"
            iconBgColor="rgba(37, 99, 235, 0.1)"
            iconColor="var(--accent-primary)"
            trend="2 new this week"
            trendDir="up"
          />
          <MetricCard
            title="Pending Invoices"
            value={m.invoices}
            icon="fa-solid fa-file-invoice"
            badgeText="Needs Attention"
            badgeType="warning"
            iconBgColor="rgba(217, 119, 6, 0.1)"
            iconColor="var(--status-warning)"
            trend="3 overdue"
            trendDir="down"
          />
          <MetricCard
            title="Required Approvals"
            value={m.approvals}
            icon="fa-solid fa-clipboard-check"
            badgeText={`${m.approvals} Pending`}
            badgeType="info"
            iconBgColor="rgba(2, 132, 199, 0.1)"
            iconColor="var(--status-info)"
            trend="Due today"
            trendDir="neutral"
          />
          <MetricCard
            title="High Risks"
            value={m.risks}
            icon="fa-solid fa-triangle-exclamation"
            badgeText="Critical"
            badgeType="danger"
            iconBgColor="rgba(220, 38, 38, 0.1)"
            iconColor="var(--status-danger)"
            trend="2 unresolved"
            trendDir="down"
          />
        </div>

        {/* Active Decisions */}
        <div className="card section-mb">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fa-solid fa-gavel text-accent"></i>
              Active Decisions
            </h2>
            <span className="badge badge-accent">{data.decisions.length} Awaiting</span>
          </div>
          <p className="text-sm text-muted" style={{ marginBottom: 'var(--spacing-md)' }}>Projects, scope changes, and approvals that need a call this week.</p>
          <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-md)' }}>
            {data.decisions.map(d => (
              <Link key={d.id} href={d.href} style={{ display: 'flex', gap: 'var(--spacing-md)', padding: 'var(--spacing-md)', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'inherit' }}>
                <div className="list-item-icon" style={{ background: d.badgeColor + '18', color: d.badgeColor, flexShrink: 0 }}>
                  <i className="fa-solid fa-circle-info"></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span className="text-sm font-semibold" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</span>
                    <span style={{ background: d.badgeColor + '18', color: d.badgeColor, fontSize: '0.625rem', fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--radius-full)', border: `1px solid ${d.badgeColor}30`, whiteSpace: 'nowrap', flexShrink: 0 }}>{d.badge}</span>
                  </div>
                  <div className="text-xs text-muted" style={{ lineHeight: 1.5 }}>{d.context}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="layout-sidebar-right">
          {/* Left Column */}
          <div className="section-gap">

            {/* Project Health (per-project) */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-heart-pulse text-accent"></i>
                  Project Health
                </h2>
                <Link href="/projects" className="card-link">View All <i className="fa-solid fa-arrow-right text-xs"></i></Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
                {data.projects.map(p => {
                  const tl = TIMELINE_LABEL[p.timelineStatus];
                  const scoreColor = p.healthScore >= 80 ? 'var(--status-success)' : p.healthScore >= 60 ? 'var(--status-warning)' : 'var(--status-danger)';
                  return (
                    <div key={p.id} style={{ padding: 'var(--spacing-md)', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                        <span className="text-sm font-semibold">{p.name}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', fontWeight: 700, color: tl.color }}>
                          <i className={`fa-solid ${tl.icon}`}></i> {tl.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-3" style={{ gap: 'var(--spacing-sm)' }}>
                        <div>
                          <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Health</div>
                          <div className="font-bold" style={{ color: scoreColor }}>{p.healthScore}/100</div>
                          <div className="progress-container" style={{ height: '4px', marginTop: '4px' }}>
                            <div className="progress-bar" style={{ width: `${p.healthScore}%`, background: scoreColor }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>ROI</div>
                          <span className="badge" style={{ background: LEVEL_LABEL[p.roi].color + '18', color: LEVEL_LABEL[p.roi].color, border: `1px solid ${LEVEL_LABEL[p.roi].color}30` }}>{LEVEL_LABEL[p.roi].label}</span>
                        </div>
                        <div>
                          <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Risk</div>
                          <span className="badge" style={{ background: LEVEL_LABEL[p.riskLevel].color + '18', color: LEVEL_LABEL[p.riskLevel].color, border: `1px solid ${LEVEL_LABEL[p.riskLevel].color}30` }}>{LEVEL_LABEL[p.riskLevel].label}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's Priorities (preserved) */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-regular fa-calendar-check text-accent"></i>
                  Today&apos;s Priorities
                </h2>
                <Link href="/projects" className="card-link">View All <i className="fa-solid fa-arrow-right text-xs"></i></Link>
              </div>

              <div className="list-group" style={{ marginTop: 'var(--spacing-sm)' }}>
                <div className="list-item" style={{ alignItems: 'center' }}>
                  <div className="priority-dot" style={{ background: 'var(--status-warning)' }}></div>
                  <div className="list-item-icon" style={{ background: 'var(--status-warning-bg)', color: 'var(--status-warning)' }}>
                    <i className="fa-solid fa-file-invoice-dollar"></i>
                  </div>
                  <div className="list-item-content">
                    <div className="list-item-title">Invoice from DesignPro Studio needs approval</div>
                    <div className="list-item-meta">Due in 4 hours · Amount: <strong>$12,450.00</strong></div>
                  </div>
                  <Link href="/approvals" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>Review</Link>
                </div>

                <div className="list-item" style={{ alignItems: 'center' }}>
                  <div className="priority-dot" style={{ background: 'var(--status-danger)' }}></div>
                  <div className="list-item-icon" style={{ background: 'var(--status-danger-bg)', color: 'var(--status-danger)' }}>
                    <i className="fa-solid fa-circle-exclamation"></i>
                  </div>
                  <div className="list-item-content">
                    <div className="list-item-title">Clinic Booking Platform has a high delay risk</div>
                    <div className="list-item-meta">Dependency: External API integration pending client credentials</div>
                  </div>
                  <Link href="/risks" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>Mitigate</Link>
                </div>

                <div className="list-item" style={{ alignItems: 'center' }}>
                  <div className="priority-dot" style={{ background: 'var(--accent-primary)' }}></div>
                  <div className="list-item-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-primary)' }}>
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div className="list-item-content">
                    <div className="list-item-title">Mobile app request is out of scope &mdash; needs change request</div>
                    <div className="list-item-meta">Detected via Scope Guard AI analysis of SRS vs Email threads</div>
                  </div>
                  <Link href="/scope-guard" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>Generate CR</Link>
                </div>
              </div>
            </div>

            {/* Financial Insight */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-coins text-accent"></i>
                  Financial Insight
                </h2>
                <span className="badge" style={{ background: LEVEL_LABEL[data.financial.costLevel].color + '18', color: LEVEL_LABEL[data.financial.costLevel].color, border: `1px solid ${LEVEL_LABEL[data.financial.costLevel].color}30` }}>
                  {LEVEL_LABEL[data.financial.costLevel].label} cost
                </span>
              </div>
              <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Estimated Revenue Range</div>
                  <p className="text-sm" style={{ lineHeight: 1.5 }}>{data.financial.estimatedRevenueRange}</p>
                </div>
                <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Invoice Approvals</div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <div>
                      <div className="font-bold" style={{ color: 'var(--status-warning)' }}>{data.financial.pendingInvoices}</div>
                      <div className="text-xs text-muted">Pending</div>
                    </div>
                    <div>
                      <div className="font-bold" style={{ color: 'var(--status-success)' }}>{data.financial.approvedInvoices}</div>
                      <div className="text-xs text-muted">Approved</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '6px' }}>Payment Milestones</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {data.financial.paymentMilestones.map(ms => {
                  const meta =
                    ms.status === 'paid' ? { color: 'var(--status-success)', icon: 'fa-circle-check', label: 'Paid' }
                    : ms.status === 'due' ? { color: 'var(--status-warning)', icon: 'fa-clock', label: 'Due' }
                    : { color: 'var(--text-muted)', icon: 'fa-circle-dot', label: 'Upcoming' };
                  return (
                    <div key={ms.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', gap: 'var(--spacing-sm)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <i className={`fa-solid ${meta.icon}`} style={{ color: meta.color }}></i>
                        <span className="text-sm font-medium">{ms.label}</span>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <span className="text-sm font-semibold tabular-nums">{ms.amount}</span>
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, color: meta.color, background: meta.color + '18', padding: '2px 6px', borderRadius: 'var(--radius-full)', border: `1px solid ${meta.color}30` }}>{meta.label}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity (preserved) */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--text-muted)' }}></i>
                  Recent Activity
                </h2>
              </div>

              <div className="list-group" style={{ marginTop: 'var(--spacing-sm)' }}>
                <div className="list-item">
                  <div className="list-item-icon" style={{ background: 'rgba(124, 58, 237, 0.08)', color: '#7C3AED' }}>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                  </div>
                  <div className="list-item-content">
                    <div className="list-item-title"><strong>AI</strong> <span className="font-normal text-secondary">generated SRS from Arabic client request</span></div>
                    <div className="list-item-meta">Project: Clinic Booking Platform · Confidence: 78% · 35 min ago</div>
                  </div>
                </div>
                <div className="list-item">
                  <div className="list-item-icon" style={{ background: 'var(--status-warning-bg)', color: 'var(--status-warning)' }}>
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div className="list-item-content">
                    <div className="list-item-title"><strong>Scope Guard</strong> <span className="font-normal text-secondary">flagged out-of-scope request</span></div>
                    <div className="list-item-meta">Mobile app request · Auto-generated CR-2026-014 · 2 hours ago</div>
                  </div>
                </div>
                <div className="list-item">
                  <div className="list-item-icon" style={{ background: 'var(--status-success-bg)', color: 'var(--status-success)' }}>
                    <i className="fa-solid fa-file-signature"></i>
                  </div>
                  <div className="list-item-content">
                    <div className="list-item-title"><strong>Contract #4492</strong> <span className="font-normal text-secondary">AI extraction completed</span></div>
                    <div className="list-item-meta">3 risks flagged · Payment schedule mapped · 4 hours ago</div>
                  </div>
                </div>
              </div>

              <button className="btn btn-ghost" style={{ width: '100%', marginTop: 'var(--spacing-md)' }} onClick={() => showToast('Audit log exported', 'info')}>
                View Full Audit Log <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>

          </div>

          {/* Right Column */}
          <div className="section-gap">

            {/* Smart Alerts (preserved) */}
            <div className="card card-ai">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-bolt text-accent"></i>
                  Smart Alerts
                </h2>
                <span className="badge badge-accent">Live</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <div className="alert-card" style={{ borderLeft: '3px solid var(--accent-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                    <span className="alert-label" style={{ color: 'var(--accent-primary)' }}>Scope Deviation Detected</span>
                    <span className="alert-time">2m ago</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Client request for <strong>mobile app (iOS &amp; Android)</strong> is out of scope. Change Request CR-2026-014 auto-generated.
                  </p>
                  <Link href="/scope-guard" className="text-xs font-medium text-accent" style={{ display: 'inline-block', marginTop: '8px' }}>
                    Review in Scope Guard <i className="fa-solid fa-arrow-right text-xs"></i>
                  </Link>
                </div>

                <div className="alert-card" style={{ borderLeft: '3px solid var(--status-success)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                    <span className="alert-label" style={{ color: 'var(--status-success)' }}>SRS Generated</span>
                    <span className="alert-time">35m ago</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    AI generated SRS for <strong>Clinic Booking Platform</strong> from Arabic client request. Confidence: <strong>78%</strong> — 4 clarification questions flagged.
                  </p>
                  <Link href="/srs-generator" className="text-xs font-medium text-accent" style={{ display: 'inline-block', marginTop: '8px' }}>
                    View SRS <i className="fa-solid fa-arrow-right text-xs"></i>
                  </Link>
                </div>
              </div>

              <Link href="/ask-docupilot" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--spacing-lg)', justifyContent: 'center' }}>
                <i className="fa-solid fa-robot"></i>
                Launch AI Assistant
              </Link>
            </div>

            {/* Scope Changes Impact */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-shield-halved text-accent"></i>
                  Scope Changes Impact
                </h2>
                <Link href="/scope-guard" className="card-link">Open Scope Guard <i className="fa-solid fa-arrow-right text-xs"></i></Link>
              </div>
              <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ padding: 'var(--spacing-md)', background: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-border)', borderRadius: 'var(--radius-md)' }}>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Out of Scope</div>
                  <div className="font-bold tabular-nums" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--status-danger)' }}>{data.scopeImpact.outOfScopeCount}</div>
                </div>
                <div style={{ padding: 'var(--spacing-md)', background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', borderRadius: 'var(--radius-md)' }}>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Needs Clarification</div>
                  <div className="font-bold tabular-nums" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--status-warning)' }}>{data.scopeImpact.needsClarificationCount}</div>
                </div>
              </div>
              <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ padding: '10px 12px', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Cost Impact</div>
                  <span className="badge" style={{ background: LEVEL_LABEL[data.scopeImpact.costImpactLabel].color + '18', color: LEVEL_LABEL[data.scopeImpact.costImpactLabel].color, border: `1px solid ${LEVEL_LABEL[data.scopeImpact.costImpactLabel].color}30` }}>{LEVEL_LABEL[data.scopeImpact.costImpactLabel].label}</span>
                </div>
                <div style={{ padding: '10px 12px', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Timeline Impact</div>
                  <span className="badge" style={{ background: LEVEL_LABEL[data.scopeImpact.timelineImpactLabel].color + '18', color: LEVEL_LABEL[data.scopeImpact.timelineImpactLabel].color, border: `1px solid ${LEVEL_LABEL[data.scopeImpact.timelineImpactLabel].color}30` }}>{LEVEL_LABEL[data.scopeImpact.timelineImpactLabel].label}</span>
                </div>
              </div>
              <div style={{ padding: 'var(--spacing-md)', background: 'var(--accent-primary-bg)', border: '1px solid var(--accent-primary-soft)', borderRadius: 'var(--radius-md)' }}>
                <div className="text-xs text-accent font-bold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Recommended Action</div>
                <div className="text-sm" style={{ lineHeight: 1.5 }}>{data.scopeImpact.recommendedAction}</div>
              </div>
            </div>

            {/* Upcoming Deadlines (preserved) */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-regular fa-calendar-exclamation" style={{ color: 'var(--status-warning)' }}></i>
                  Upcoming Deadlines
                </h2>
                <span className="badge badge-warning">4 This Week</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {UPCOMING_DEADLINES.map(dl => (
                  <Link key={dl.label} href={dl.href} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', padding: '8px var(--spacing-sm)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', textDecoration: 'none', transition: 'box-shadow var(--transition-fast)' }}>
                    <div className="list-item-icon" style={{ background: dl.bg, color: dl.color, width: '32px', height: '32px', flexShrink: 0, fontSize: '0.875rem' }}>
                      <i className={dl.icon}></i>
                    </div>
                    <span className="text-sm font-medium" style={{ flex: 1, color: 'var(--text-primary)', lineHeight: 1.3 }}>{dl.label}</span>
                    <span className={`deadline-badge tabular-nums ${dl.daysLeft <= 5 ? 'deadline-badge-urgent' : 'deadline-badge-upcoming'}`}>
                      <i className="fa-regular fa-clock" aria-hidden="true"></i> {dl.daysLeft}d
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* AI Recommended Next Actions */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-ranking-star text-accent"></i>
                  AI Recommended Next Actions
                </h2>
                <span className="badge badge-success">AI Ranked</span>
              </div>
              <div>
                {data.nextActions.map((action, i) => (
                  <Link key={action.title} href={action.href} className="next-action-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="next-action-num">{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="next-action-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className={SOURCE_ICON[action.source]} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}></i>
                        <span style={{ flex: 1, minWidth: 0 }}>{action.title}</span>
                      </div>
                      <div className="next-action-meta">{action.meta}</div>
                    </div>
                    <span style={{ background: action.badgeColor + '18', color: action.badgeColor, fontSize: '0.625rem', fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--radius-full)', border: `1px solid ${action.badgeColor}30`, whiteSpace: 'nowrap', flexShrink: 0 }}>{action.badge}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions (preserved) */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-bolt" style={{ color: 'var(--text-muted)' }}></i>
                  Quick Actions
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { icon: 'fa-solid fa-wand-magic-sparkles', label: 'Project Intelligence', sub: 'Run full pipeline', href: '/srs-generator', color: 'var(--accent-primary)', bg: 'rgba(37, 99, 235, 0.1)' },
                  { icon: 'fa-solid fa-file-signature', label: 'Analyze Contract', sub: 'Extract obligations', href: '/contracts', color: 'var(--status-success)', bg: 'rgba(5, 150, 105, 0.1)' },
                  { icon: 'fa-solid fa-shield-halved', label: 'Check Scope', sub: 'Detect scope creep', href: '/scope-guard', color: 'var(--status-info)', bg: 'rgba(2, 132, 199, 0.1)' },
                  { icon: 'fa-solid fa-triangle-exclamation', label: 'Review Risks', sub: 'Open risk radar', href: '/risks', color: 'var(--status-warning)', bg: 'rgba(217, 119, 6, 0.1)' },
                ].map(item => (
                  <Link key={item.href} href={item.href} className="action-suggest">
                    <div className="action-icon" style={{ background: item.bg, color: item.color }}>
                      <i className={item.icon}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-muted">{item.sub}</div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.6875rem' }}></i>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
          <i className={TOAST_ICONS[toast.type]} aria-hidden="true"></i>
          {toast.msg}
        </div>
      )}
    </>
  );
}
