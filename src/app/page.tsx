'use client';
import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/common/MetricCard';
import Link from 'next/link';

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

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>('today');
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const m = METRICS[period];

  return (
    <>
      <Header />
      <div className="page-container animate-fade-in">

        {/* Page Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
              <p className="page-label" style={{ margin: 0 }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <span className="demo-badge" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', border: '1px solid rgba(124, 58, 237, 0.2)' }}><i className="fa-solid fa-sparkles"></i> AI-Powered</span>
            </div>
            <h1 className="page-title">Operational Overview</h1>
            <p className="page-subtitle">Welcome back. Here&apos;s what needs your attention.</p>
          </div>
          <div className="page-header-actions">
            <div className="seg-control">
              {(['today', 'week', 'month'] as Period[]).map(p => (
                <button type="button" key={p} className={`seg-btn${period === p ? ' active' : ''}`} onClick={() => setPeriod(p)}>
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => showToast('Generating report...', 'info')}>
              <i className="fa-solid fa-download"></i> <span>Export</span>
            </button>
            <button type="button" className="btn btn-primary" onClick={() => showToast('Project created', 'success')}>
              <i className="fa-solid fa-plus"></i> <span>New Project</span>
            </button>
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

        <div className="layout-sidebar-right">
          {/* Left Column */}
          <div className="section-gap">

            {/* Today's Priorities */}
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
                    <div className="list-item-meta">Due in 4 hours &middot; Amount: <strong>$12,450.00</strong></div>
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

            {/* Project Health Chart */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-chart-bar text-accent"></i>
                  {period === 'today' ? 'Hourly Activity' : period === 'week' ? 'Weekly Project Health' : 'Monthly Trend'}
                </h2>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent-primary)', display: 'inline-block' }}></span>
                    Progress
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--bg-surface-elevated)', display: 'inline-block', border: '1px solid var(--border-strong)' }}></span>
                    Benchmark
                  </span>
                </div>
              </div>

              <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '4px', padding: '0 4px', marginTop: 'var(--spacing-md)', overflow: 'hidden', minWidth: 0 }}>
                {(period === 'today'
                  ? [{ day: '9am', p: 60, b: 45 }, { day: '11am', p: 75, b: 60 }, { day: '1pm', p: 55, b: 50 }, { day: '3pm', p: 90, b: 70 }, { day: '5pm', p: 85, b: 75 }, { day: '7pm', p: 40, b: 35 }]
                  : period === 'week'
                    ? [{ day: 'Mon', p: 80, b: 60 }, { day: 'Tue', p: 75, b: 65 }, { day: 'Wed', p: 90, b: 85 }, { day: 'Thu', p: 80, b: 75 }, { day: 'Fri', p: 95, b: 90 }, { day: 'Sat', p: 50, b: 40 }, { day: 'Sun', p: 55, b: 45 }]
                    : [{ day: 'W1', p: 70, b: 60 }, { day: 'W2', p: 80, b: 72 }, { day: 'W3', p: 75, b: 68 }, { day: 'W4', p: 88, b: 80 }]
                ).map(item => (
                  <div key={item.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                    <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                      <div style={{ flex: 1, height: `${item.b}%`, background: 'var(--bg-surface-elevated)', borderRadius: '4px 4px 0 0', border: '1px solid var(--border-subtle)' }}></div>
                      <div style={{ flex: 1, height: `${item.p}%`, background: 'var(--accent-primary)', borderRadius: '4px 4px 0 0', opacity: 0.9 }}></div>
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 500 }}>{item.day}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
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
                    <div className="list-item-meta">Project: Clinic Booking Platform &middot; Confidence: 78% &middot; 35 min ago</div>
                  </div>
                </div>
                <div className="list-item">
                  <div className="list-item-icon" style={{ background: 'var(--status-warning-bg)', color: 'var(--status-warning)' }}>
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div className="list-item-content">
                    <div className="list-item-title"><strong>Scope Guard</strong> <span className="font-normal text-secondary">flagged out-of-scope request</span></div>
                    <div className="list-item-meta">Mobile app request &middot; Auto-generated CR-2026-014 &middot; 2 hours ago</div>
                  </div>
                </div>
                <div className="list-item">
                  <div className="list-item-icon" style={{ background: 'var(--status-success-bg)', color: 'var(--status-success)' }}>
                    <i className="fa-solid fa-file-signature"></i>
                  </div>
                  <div className="list-item-content">
                    <div className="list-item-title"><strong>Contract #4492</strong> <span className="font-normal text-secondary">AI extraction completed</span></div>
                    <div className="list-item-meta">3 risks flagged &middot; Payment schedule mapped &middot; 4 hours ago</div>
                  </div>
                </div>
              </div>

              <button type="button" className="btn btn-ghost" style={{ width: '100%', marginTop: 'var(--spacing-md)' }} onClick={() => showToast('Audit log exported', 'info')}>
                View Full Audit Log <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>

          </div>

          {/* Right Column */}
          <div className="section-gap">

            {/* Smart Alerts */}
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

            {/* Upcoming Deadlines */}
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
                    <span className={`deadline-badge ${dl.daysLeft <= 5 ? 'deadline-badge-urgent' : 'deadline-badge-upcoming'}`}>
                      <i className="fa-regular fa-clock"></i> {dl.daysLeft}d
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Next Best Actions */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-ranking-star text-accent"></i>
                  Next Best Actions
                </h2>
                <span className="badge badge-success">AI Ranked</span>
              </div>
              <div>
                {[
                  { title: 'Approve Invoice #INV-2024-0047 before deadline', meta: 'Saves $1,245 in late fees · Due in 4h', badge: 'Urgent', badgeColor: 'var(--status-danger)' },
                  { title: 'Assign a risk owner for the API delay on Clinic Booking', meta: 'Reduces probability from 68% → 30%', badge: 'High Impact', badgeColor: 'var(--status-warning)' },
                  { title: 'Generate change request for out-of-scope mobile app', meta: 'Protects $18,000 in potential extra work', badge: 'Revenue', badgeColor: 'var(--status-success)' },
                  { title: 'Run SRS generator on pending OMNIMOBILE request', meta: '3-day kickstart advantage · Client waiting', badge: 'Quick Win', badgeColor: 'var(--accent-primary)' },
                ].map((action, i) => (
                  <div key={i} className="next-action-item">
                    <div className="next-action-num">{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div className="next-action-title">{action.title}</div>
                      <div className="next-action-meta">{action.meta}</div>
                    </div>
                    <span style={{ background: action.badgeColor + '18', color: action.badgeColor, fontSize: '0.625rem', fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--radius-full)', border: `1px solid ${action.badgeColor}30`, whiteSpace: 'nowrap', flexShrink: 0 }}>{action.badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-bolt" style={{ color: 'var(--text-muted)' }}></i>
                  Quick Actions
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { icon: 'fa-solid fa-wand-magic-sparkles', label: 'Generate SRS', sub: 'From client request', href: '/srs-generator', color: 'var(--accent-primary)', bg: 'rgba(37, 99, 235, 0.1)' },
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
        <div className={`toast toast-${toast.type}`}>
          <i className={TOAST_ICONS[toast.type]}></i>
          {toast.msg}
        </div>
      )}
    </>
  );
}
