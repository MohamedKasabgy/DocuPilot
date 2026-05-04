'use client';
import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';

type ToastType = 'success' | 'info' | 'warning' | 'error';
type Priority = 'normal' | 'urgent' | 'critical';
type Currency = 'SAR' | 'USD' | 'EUR';

const TOAST_ICONS: Record<ToastType, string> = {
  success: 'fa-solid fa-circle-check',
  info:    'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
  error:   'fa-solid fa-circle-xmark',
};

const PRIORITY_COLORS: Record<Priority, { color: string; bg: string; border: string }> = {
  normal:   { color: 'var(--text-secondary)', bg: 'var(--bg-surface-elevated)', border: 'var(--border-subtle)' },
  urgent:   { color: 'var(--status-warning)', bg: 'var(--status-warning-bg)', border: 'var(--status-warning-border)' },
  critical: { color: 'var(--status-danger)', bg: 'var(--status-danger-bg)', border: 'var(--status-danger-border)' },
};

export default function InvoicesPage() {
  const [priority, setPriority] = useState<Priority>('urgent');
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [threshold, setThreshold] = useState('5000');
  const [vendorCategory, setVendorCategory] = useState('design');
  const [showDuplicate, setShowDuplicate] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const pc = PRIORITY_COLORS[priority];
  const amount = currency === 'SAR' ? '6,500 SAR' : currency === 'USD' ? '1,733 USD' : '1,590 EUR';
  const amountNum = parseFloat(amount.replace(/[^0-9.]/g, ''));
  const isEscalated = amountNum > parseFloat(threshold);
  const approvalSteps = isEscalated
    ? [
        { label: 'PM\nReview',       state: 'step-done'    },
        { label: 'Finance\nReview',  state: 'step-active'  },
        { label: 'Finance\nDirector', state: 'step-pending' },
        { label: 'CFO\nApproval',    state: 'step-pending' },
      ]
    : [
        { label: 'PM\nReview',      state: 'step-done'    },
        { label: 'Finance\nReview', state: 'step-active'  },
        { label: 'Approved',        state: 'step-pending' },
      ];

  return (
    <>
      <Header>
        <nav className="page-breadcrumb">
          <Link href="/invoices" className="text-muted">Invoices &amp; Approvals</Link>
          <i className="fa-solid fa-chevron-right sep" style={{ fontSize: '0.6rem' }}></i>
          <span className="current">Invoice Review</span>
        </nav>
      </Header>

      <div className="page-container animate-fade-in">

        <div className="page-header">
          <div>
            <h1 className="page-title">Invoice Review: INV-2026-042</h1>
            <p className="page-subtitle">Review vendor invoice against project contract and approve or reject.</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
            <span className={`badge badge-lg`} style={{ background: pc.bg, color: pc.color, borderColor: pc.border }}>
              <i className="fa-solid fa-clock"></i> {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
          </div>
        </div>

        {showDuplicate && (
          <div style={{ background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md) var(--spacing-lg)', marginBottom: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
            <i className="fa-solid fa-copy" style={{ color: 'var(--status-warning)', fontSize: '1.125rem', flexShrink: 0, marginTop: '2px' }}></i>
            <div style={{ flex: 1 }}>
              <div className="font-bold text-sm" style={{ color: 'var(--status-warning)', marginBottom: '4px' }}>Possible Duplicate Invoice Detected</div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Invoice <strong>#65441</strong> from <strong>DesignPro Studio</strong> was submitted 3 days ago for the same amount (<strong>6,500 SAR</strong>). Please verify this is not a duplicate before approving.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowDuplicate(false)} style={{ flexShrink: 0 }}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        <div className="layout-sidebar-right-wide">

          {/* Document Preview Panel */}
          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface-elevated)', padding: '5px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
              <i className="fa-regular fa-eye"></i> Preview Mode
            </div>

            <div className="document-preview" style={{ width: '100%' }}>
              <div className="invoice-header">
                <div>
                  <h2 style={{ fontSize: '1.75rem', color: '#111827', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>DesignPro Studio</h2>
                  <div style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.7 }}>
                    44 Creative Ave, Silicon District<br />
                    Riyadh, Saudi Arabia
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '4px' }}>Invoice</div>
                  <div style={{ fontSize: '1.5rem', color: 'var(--accent-primary)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>#65442</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)' }}>
                <div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px', marginBottom: '4px' }}>Bill To</div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>NexaSoft Operations</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#9CA3AF', fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px', marginBottom: '4px' }}>Issue Date</div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>May 01, 2026</div>
                </div>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div style={{ fontWeight: 600, color: '#111827' }}>UI Design — Milestone 2</div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', fontStyle: 'italic', marginTop: '3px' }}>
                        Clinic Booking Platform — Mobile App
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#111827', verticalAlign: 'middle' }}>6,500.00 SAR</td>
                  </tr>
                </tbody>
              </table>

              <div className="invoice-total-row">
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Payment Term: <strong>Net 15</strong></div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: 600, letterSpacing: '1px' }}>Total Balance Due</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>6,500 SAR</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="section-gap">

            {/* Finance Controls */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title"><i className="fa-solid fa-sliders text-accent"></i> Finance Controls</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <div>
                  <span className="opts-label">Priority</span>
                  <div className="seg-control" style={{ display: 'flex', width: '100%' }}>
                    {(['normal', 'urgent', 'critical'] as Priority[]).map(p => (
                      <button key={p} className={`seg-btn${priority === p ? ' active' : ''}`} style={{ flex: 1 }} onClick={() => setPriority(p)}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="opts-label">Currency</span>
                  <div className="seg-control" style={{ display: 'flex', width: '100%' }}>
                    {(['SAR', 'USD', 'EUR'] as Currency[]).map(c => (
                      <button key={c} className={`seg-btn${currency === c ? ' active' : ''}`} style={{ flex: 1 }} onClick={() => setCurrency(c)}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="opts-label">Approval Threshold ({currency})</span>
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    {['3000', '5000', '10000', '25000'].map(v => (
                      <button key={v} className={`seg-btn${threshold === v ? ' active' : ''}`} style={{ flex: 1, background: threshold === v ? 'white' : 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '4px 0', fontSize: '0.75rem', color: threshold === v ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: threshold === v ? 600 : 500 }} onClick={() => setThreshold(v)}>
                        {parseInt(v) >= 1000 ? (parseInt(v)/1000) + 'k' : v}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="opts-label">Vendor Category</span>
                  <select value={vendorCategory} onChange={e => setVendorCategory(e.target.value)} style={{ width: '100%', height: '32px', paddingLeft: '0.625rem', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--text-primary)', background: 'white', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', outline: 'none', cursor: 'pointer' }}>
                    <option value="design">Design & Creative</option>
                    <option value="development">Development</option>
                    <option value="consulting">Consulting</option>
                    <option value="infrastructure">Infrastructure</option>
                  </select>
                </div>
                {parseFloat(amount.replace(/[^0-9.]/g, '')) > parseFloat(threshold) && (
                  <div style={{ background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', padding: '8px 12px', borderRadius: 'var(--radius-md)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <i className="fa-solid fa-triangle-exclamation text-warning" style={{ fontSize: '0.75rem', flexShrink: 0 }}></i>
                    <span className="text-xs font-medium" style={{ color: 'var(--status-warning)' }}>Amount exceeds threshold — escalated approval required</span>
                  </div>
                )}
              </div>
            </div>

            {/* Extracted Data */}
            <div className="card">
              <div className="card-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--spacing-md)' }}>
                <h2 className="card-title">
                  <i className="fa-solid fa-wand-magic-sparkles text-accent"></i>
                  Extracted Data
                </h2>
                <span className="badge badge-success">Verified</span>
              </div>

              <div style={{ paddingTop: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div className="grid-2col">
                  <div className="info-pair">
                    <span className="info-pair-label">Vendor</span>
                    <span className="info-pair-value">DesignPro Studio</span>
                  </div>
                  <div className="info-pair">
                    <span className="info-pair-label">Service</span>
                    <span className="info-pair-value">UI Design</span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-main)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="info-pair">
                    <span className="info-pair-label">Amount ({currency})</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{amount}</span>
                  </div>
                  <div className="info-pair" style={{ alignItems: 'flex-end' }}>
                    <span className="info-pair-label">Due Date</span>
                    <span className="info-pair-value" style={{ color: 'var(--status-warning)' }}>15 May 2026</span>
                  </div>
                </div>

                <div className="info-pair">
                  <span className="info-pair-label">Related Project</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <i className="fa-solid fa-link text-muted" style={{ fontSize: '0.75rem' }}></i>
                    <span className="font-medium text-sm">Clinic Booking Platform</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="card ai-insight">
              <div className="ai-insight-label">
                <i className="fa-solid fa-microchip"></i>
                AI Reasoning
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                Amount is above the internal approval limit of <strong>{threshold} {currency}</strong>. Verified vendor details against project contract <strong>#CP-2026-88</strong>. Invoice line item matches SRS scope for mobile UI work.
              </p>
              <div className="ai-insight-bg-icon"><i className="fa-solid fa-brain"></i></div>
            </div>

            {/* Approval Chain */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-users-line text-accent"></i>
                  Approval Chain
                </h2>
                {isEscalated && <span className="badge badge-warning">Escalated</span>}
              </div>
              {isEscalated && (
                <div style={{ background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', borderRadius: 'var(--radius-md)', padding: '6px 12px', marginBottom: 'var(--spacing-md)', fontSize: '0.75rem', color: 'var(--status-warning)', fontWeight: 600 }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px' }}></i>
                  Amount exceeds threshold — CFO approval required
                </div>
              )}
              <div className="approval-chain">
                {approvalSteps.map((step, i) => (
                  <div key={i} className={`approval-step ${step.state}`}>
                    <div className="approval-step-dot">
                      {step.state === 'step-done' ? <i className="fa-solid fa-check" style={{ fontSize: '0.6875rem' }}></i> : i + 1}
                    </div>
                    <div className="approval-step-label">
                      {step.label.split('\n').map((line, j) => <span key={j} style={{ display: 'block' }}>{line}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Panel */}
            <div className="card" style={{ position: 'sticky', top: 'calc(var(--topbar-height) + 1rem)' }}>
              <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: 'var(--spacing-md)' }}>Required Action</div>

              <button className="btn btn-approve" style={{ marginBottom: 'var(--spacing-md)' }} onClick={() => showToast('Invoice approved successfully', 'success')}>
                <i className="fa-solid fa-circle-check"></i> Approve Invoice
              </button>

              <div className="grid-2col" style={{ gap: 'var(--spacing-sm)' }}>
                <button className="btn btn-secondary" onClick={() => showToast('Sent for additional review', 'info')}>
                  <i className="fa-solid fa-clock-rotate-left"></i> Needs Review
                </button>
                <button className="btn btn-danger" onClick={() => showToast('Invoice rejected', 'error')}>
                  <i className="fa-solid fa-circle-xmark"></i> Reject
                </button>
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
