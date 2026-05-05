'use client';
import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';

type ToastType = 'success' | 'info' | 'warning' | 'error';
const TOAST_ICONS: Record<ToastType, string> = {
  success: 'fa-solid fa-circle-check',
  info:    'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
  error:   'fa-solid fa-circle-xmark',
};

export default function ApprovalsPage() {
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);
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
          <span className="badge badge-warning badge-lg">
            <i className="fa-solid fa-clock"></i> Needs Approval
          </span>
        </div>

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

              <div className="overflow-x-auto">
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
              </div>

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
                    <span className="info-pair-label">Amount</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--accent-primary)' }}>6,500 SAR</span>
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
                Amount is above the internal approval limit of <strong>5,000 SAR</strong>. Verified vendor details against project contract <strong>#CP-2026-88</strong>. Invoice line item matches SRS scope for mobile UI work.
              </p>
              <div className="ai-insight-bg-icon"><i className="fa-solid fa-brain"></i></div>
            </div>

            {/* Action Panel */}
            <div className="card" style={{ position: 'sticky', top: 'calc(var(--topbar-height) + 1rem)' }}>
              <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: 'var(--spacing-md)' }}>Required Action</div>

              <button type="button" className="btn btn-approve" style={{ marginBottom: 'var(--spacing-md)' }} onClick={() => showToast('Invoice approved successfully', 'success')}>
                <i className="fa-solid fa-circle-check"></i> Approve Invoice
              </button>

              <div className="grid-2col" style={{ gap: 'var(--spacing-sm)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => showToast('Sent for additional review', 'info')}>
                  <i className="fa-solid fa-clock-rotate-left"></i> Needs Review
                </button>
                <button type="button" className="btn btn-danger" onClick={() => showToast('Invoice rejected', 'error')}>
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
