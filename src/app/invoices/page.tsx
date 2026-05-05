'use client';
import { useState, useCallback, useEffect, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import type { InvoiceAnalysisOutput } from '@/lib/ai/schemas/invoice';

/** Local type — mirrors ContractListItem from the list route without importing server code. */
interface ContractListItem {
  id: string;
  title: string;
  client: string | null;
  vendor: string | null;
  total_value: number | null;
  currency: string | null;
  status: string | null;
  scope_summary?: string | null;
  scope_excluded?: string[] | null;
  payment_milestones?: string[] | null;
  change_request_terms?: string | null;
}

/** Client-side fallback — used when the fetch fails or returns no data. */
const CLIENT_DEMO_CONTRACTS: ContractListItem[] = [
  {
    id: 'CP-2026-88',
    title: 'Clinic Booking Platform Development Agreement',
    client: 'Al Waha Clinics',
    vendor: 'NexaSoft Solutions',
    total_value: 150000,
    currency: 'SAR',
    status: 'Active',
    scope_summary: 'Development of a full-stack clinic booking platform including patient-facing website, admin dashboard, and API integration layer.',
    scope_excluded: ['Mobile application development', 'Third-party payment gateway integration', 'Hardware procurement'],
    payment_milestones: ['40% on signing — 60,000 SAR', '30% on beta (week 4) — 45,000 SAR', '30% on final delivery (week 8) — 45,000 SAR'],
    change_request_terms: 'All additions outside agreed scope require written change request approval before work begins.',
  },
  {
    id: 'CP-2026-45',
    title: 'Mobile App UI Design Services',
    client: 'Al Waha Clinics',
    vendor: 'DesignPro Studio',
    total_value: 45000,
    currency: 'SAR',
    status: 'Active',
    scope_summary: 'UI/UX design for the Clinic Booking Platform mobile app across 3 milestones: wireframes, visual design, and clickable prototype.',
    scope_excluded: ['Frontend development or coding', 'Backend API work', 'Testing or QA', 'Web (desktop) design'],
    payment_milestones: ['Milestone 1 — Wireframes: 15,000 SAR', 'Milestone 2 — Visual Design: 15,000 SAR', 'Milestone 3 — Prototype: 15,000 SAR'],
    change_request_terms: 'Design revisions are limited to 2 rounds per milestone. Additional revisions require a signed change order at 500 SAR/screen.',
  },
  {
    id: 'CP-2025-12',
    title: 'Infrastructure & DevOps Retainer',
    client: 'Al Waha Clinics',
    vendor: 'CloudOps Arabia',
    total_value: 80000,
    currency: 'SAR',
    status: 'Active',
    scope_summary: '12-month retainer for cloud infrastructure management, CI/CD pipeline maintenance, and 24/7 on-call support.',
    scope_excluded: ['Application development', 'UI/UX design', 'Data migration or ETL pipelines', 'Security audits'],
    payment_milestones: ['Monthly retainer: 6,667 SAR/month (12-month term)'],
    change_request_terms: 'Additional out-of-scope services billed at 350 SAR/hour with prior written approval.',
  },
];

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

const ACTION_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  approve:  { label: 'Approve',  color: 'var(--status-success)', bg: 'var(--status-success-bg)' },
  review:   { label: 'Review',   color: 'var(--status-warning)', bg: 'var(--status-warning-bg)' },
  reject:   { label: 'Reject',   color: 'var(--status-danger)',  bg: 'var(--status-danger-bg)'  },
  escalate: { label: 'Escalate', color: 'var(--accent-primary)', bg: 'var(--bg-surface-elevated)' },
};

const DUPLICATE_COLORS: Record<string, string> = {
  none:   'var(--status-success)',
  low:    'var(--status-success)',
  medium: 'var(--status-warning)',
  high:   'var(--status-danger)',
};

/** Vendor in the demo invoice — used for deterministic contract suggestion when no text is pasted. */
const DEMO_VENDOR = 'DesignPro Studio';

export default function InvoicesPage() {
  const [priority, setPriority] = useState<Priority>('urgent');
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [threshold, setThreshold] = useState('5000');
  const [vendorCategory, setVendorCategory] = useState('design');
  const [showDuplicate, setShowDuplicate] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [contractsLoading, setContractsLoading] = useState(true);
  const [contractsSource, setContractsSource] = useState<string>('');
  const [selectedContractId, setSelectedContractId] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<InvoiceAnalysisOutput | null>(null);
  const [analysisSource, setAnalysisSource] = useState<string>('');
  const [invoiceText, setInvoiceText] = useState<string>('');

  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadContracts() {
      setContractsLoading(true);
      try {
        const res = await fetch('/api/contracts/list', { cache: 'no-store' });
        const json = await res.json() as { success: boolean; source?: string; data?: ContractListItem[] };

        if (!cancelled) {
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setContracts(json.data);
            setContractsSource(json.source ?? 'api');
          } else {
            setContracts(CLIENT_DEMO_CONTRACTS);
            setContractsSource('client-demo');
          }
        }
      } catch {
        if (!cancelled) {
          setContracts(CLIENT_DEMO_CONTRACTS);
          setContractsSource('client-demo');
        }
      } finally {
        if (!cancelled) setContractsLoading(false);
      }
    }

    loadContracts();

    return () => { cancelled = true; };
  }, []);

  /** Deterministic suggestion: vendor-name match first, then title keyword match. */
  const suggestedContractId = useMemo(() => {
    if (contracts.length === 0) return '';
    // Use pasted text when available, otherwise fall back to the demo vendor name
    const searchText = (invoiceText.trim() || DEMO_VENDOR).toLowerCase();
    for (const c of contracts) {
      if (c.vendor && searchText.includes(c.vendor.toLowerCase())) return c.id;
    }
    for (const c of contracts) {
      const kw = c.title.toLowerCase().split(/\s+/).filter(w => w.length > 5);
      if (kw.some(w => searchText.includes(w))) return c.id;
    }
    return '';
  }, [contracts, invoiceText]);

  const selectedContract = contracts.find(c => c.id === selectedContractId) ?? null;

  const analyzeInvoice = useCallback(async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const body: Record<string, unknown> = {
        projectId: 'clinic-booking-platform',
        // Structured hints (demo defaults — overridden by AI extraction when invoiceText is present)
        invoiceNumber: '#65442',
        vendor: DEMO_VENDOR,
        amount: 6500,
        currency,
        dueDate: '2026-05-15',
        description: 'UI Design — Milestone 2 (Clinic Booking Platform Mobile App)',
        projectName: 'Clinic Booking Platform',
      };
      // Raw text takes precedence when provided
      if (invoiceText.trim()) {
        body.invoiceText = invoiceText.trim();
      }
      if (selectedContract) {
        body.contractId = selectedContract.id;
        body.linkedContract = {
          id: selectedContract.id,
          title: selectedContract.title,
          client: selectedContract.client,
          vendor: selectedContract.vendor,
          totalValue: selectedContract.total_value,
          currency: selectedContract.currency,
          status: selectedContract.status,
          scopeSummary: selectedContract.scope_summary ?? null,
          scopeExcluded: selectedContract.scope_excluded ?? null,
          paymentMilestones: selectedContract.payment_milestones ?? null,
          changeRequestTerms: selectedContract.change_request_terms ?? null,
        };
      }
      const res = await fetch('/api/ai/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAiAnalysis(json.data);
        setAnalysisSource(json.source ?? 'ai');
        showToast('Invoice analyzed successfully', 'success');
      } else {
        showToast('Analysis failed — try again', 'error');
      }
    } catch {
      showToast('Network error during analysis', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  }, [currency, invoiceText, selectedContract, showToast]);

  const pc = PRIORITY_COLORS[priority];
  const amount = currency === 'SAR' ? '6,500 SAR' : currency === 'USD' ? '1,733 USD' : '1,590 EUR';
  const amountNum = parseFloat(amount.replace(/[^0-9.]/g, ''));
  const isEscalated = amountNum > parseFloat(threshold);
  const approvalSteps = isEscalated
    ? [
        { label: 'PM\nReview',        state: 'step-done'    },
        { label: 'Finance\nReview',   state: 'step-active'  },
        { label: 'Finance\nDirector', state: 'step-pending' },
        { label: 'CFO\nApproval',     state: 'step-pending' },
      ]
    : [
        { label: 'PM\nReview',      state: 'step-done'    },
        { label: 'Finance\nReview', state: 'step-active'  },
        { label: 'Approved',        state: 'step-pending' },
      ];

  const showSuggestion = suggestedContractId !== '' && suggestedContractId !== selectedContractId;

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
            <span className="badge badge-lg" style={{ background: pc.bg, color: pc.color, borderColor: pc.border }}>
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
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowDuplicate(false)} style={{ flexShrink: 0 }}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        <div className="layout-sidebar-right-wide">

          {/* Left column: document preview + invoice text input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>

            {/* Document Preview */}
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

            {/* Invoice text input for AI analysis */}
            <div className="card">
              <div className="card-header" style={{ paddingBottom: 'var(--spacing-sm)' }}>
                <h2 className="card-title" style={{ fontSize: '0.875rem' }}>
                  <i className="fa-solid fa-paste text-accent"></i> Paste Invoice Text for AI Analysis
                </h2>
                {invoiceText.trim() && (
                  <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Ready</span>
                )}
              </div>
              <textarea
                value={invoiceText}
                onChange={e => { setInvoiceText(e.target.value); setAiAnalysis(null); }}
                placeholder={`Paste raw invoice text here for a richer AI analysis.\n\nExample:\nDesignPro Studio\nInvoice #65442 — May 1, 2026\nUI Design Milestone 2 — Clinic Booking Platform Mobile App\nAmount Due: 6,500.00 SAR\nPayment Terms: Net 15\n\nIf left empty, the demo invoice above is used.`}
                rows={8}
                style={{ width: '100%', resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--text-primary)', background: 'var(--bg-main)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', padding: '0.625rem', lineHeight: 1.6, outline: 'none', boxSizing: 'border-box' }}
              />
              {!invoiceText.trim() && (
                <p className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
                  <i className="fa-solid fa-circle-info" style={{ marginRight: '4px' }}></i>
                  Demo invoice data will be used if this field is empty.
                </p>
              )}
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
                      <button type="button" key={p} className={`seg-btn${priority === p ? ' active' : ''}`} style={{ flex: 1 }} onClick={() => setPriority(p)}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="opts-label">Currency</span>
                  <div className="seg-control" style={{ display: 'flex', width: '100%' }}>
                    {(['SAR', 'USD', 'EUR'] as Currency[]).map(c => (
                      <button type="button" key={c} className={`seg-btn${currency === c ? ' active' : ''}`} style={{ flex: 1 }} onClick={() => setCurrency(c)}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="opts-label">Approval Threshold ({currency})</span>
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    {['3000', '5000', '10000', '25000'].map(v => (
                      <button type="button" key={v} className={`seg-btn${threshold === v ? ' active' : ''}`} style={{ flex: 1, background: threshold === v ? 'white' : 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '4px 0', minHeight: '44px', fontSize: '0.75rem', color: threshold === v ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: threshold === v ? 600 : 500 }} onClick={() => setThreshold(v)}>
                        {parseInt(v) >= 1000 ? (parseInt(v) / 1000) + 'k' : v}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="opts-label">Vendor Category</span>
                  <select value={vendorCategory} onChange={e => setVendorCategory(e.target.value)} style={{ width: '100%', height: '44px', paddingLeft: '0.625rem', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--text-primary)', background: 'white', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', outline: 'none', cursor: 'pointer' }}>
                    <option value="design">Design & Creative</option>
                    <option value="development">Development</option>
                    <option value="consulting">Consulting</option>
                    <option value="infrastructure">Infrastructure</option>
                  </select>
                </div>

                {/* Linked Contract selector */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span className="opts-label" style={{ marginBottom: 0 }}>
                      Linked Contract
                    </span>
                    {selectedContractId && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--status-success)' }}>
                        <i className="fa-solid fa-link"></i> Linked
                      </span>
                    )}
                    {showSuggestion && (
                      <button
                        type="button"
                        onClick={() => { setSelectedContractId(suggestedContractId); setAiAnalysis(null); }}
                        style={{ fontSize: '0.65rem', fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--radius-full)', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Click to use suggested contract"
                      >
                        <i className="fa-solid fa-wand-magic-sparkles"></i> Suggested match
                      </button>
                    )}
                  </div>
                  <select
                    value={selectedContractId}
                    onChange={e => { setSelectedContractId(e.target.value); setAiAnalysis(null); }}
                    disabled={contractsLoading}
                    style={{ width: '100%', height: '44px', paddingLeft: '0.625rem', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--text-primary)', background: 'white', border: selectedContractId ? '1px solid var(--accent-primary)' : '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', outline: 'none', cursor: contractsLoading ? 'wait' : 'pointer', pointerEvents: contractsLoading ? 'none' : 'auto' }}
                  >
                    <option value="">{contractsLoading ? 'Loading contracts…' : '— No contract linked —'}</option>
                    {contracts.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.id} · {c.title}{c.vendor ? ` · ${c.vendor}` : ''}
                      </option>
                    ))}
                  </select>
                  {/* Helper text */}
                  <p className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {contractsLoading
                      ? 'Loading contracts…'
                      : contracts.length > 0
                        ? <>{contracts.length} contract{contracts.length !== 1 ? 's' : ''} available{contractsSource === 'demo' || contractsSource === 'client-demo' ? ' (demo)' : ''}</>
                        : 'No contracts available'}
                  </p>
                  {selectedContract && (
                    <div style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {selectedContract.vendor && <span><i className="fa-solid fa-building" style={{ marginRight: '4px' }}></i>{selectedContract.vendor}</span>}
                      {selectedContract.total_value != null && <span><i className="fa-solid fa-coins" style={{ marginRight: '4px' }}></i>{selectedContract.total_value.toLocaleString()} {selectedContract.currency}</span>}
                      {selectedContract.status && <span><i className="fa-solid fa-circle-dot" style={{ marginRight: '4px', color: 'var(--status-success)' }}></i>{selectedContract.status}</span>}
                    </div>
                  )}
                </div>

                {amountNum > parseFloat(threshold) && (
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

            {/* AI Reasoning / AI Analysis */}
            {aiAnalysis ? (
              <div className="card" style={{ border: '1px solid var(--accent-primary)', background: 'rgba(79,70,229,0.03)' }}>
                <div className="card-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                  <h2 className="card-title">
                    <i className="fa-solid fa-microchip text-accent"></i>
                    AI Invoice Analysis
                  </h2>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {analysisSource === 'fallback' && (
                      <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Demo data</span>
                    )}
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                      {aiAnalysis.confidenceScore}% confidence
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {aiAnalysis.analysisNotes}
                  </p>

                  {/* Contract Alignment */}
                  <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contract Alignment</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: aiAnalysis.contractAlignment.aligned ? 'var(--status-success)' : 'var(--status-warning)' }}>
                        {aiAnalysis.contractAlignment.score}%
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{aiAnalysis.contractAlignment.summary}</p>
                    {aiAnalysis.contractAlignment.discrepancies.length > 0 && (
                      <ul style={{ marginTop: '8px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {aiAnalysis.contractAlignment.discrepancies.map((d, i) => (
                          <li key={i} className="text-xs" style={{ color: 'var(--status-warning)' }}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Duplicate Risk */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <i className="fa-solid fa-copy" style={{ color: DUPLICATE_COLORS[aiAnalysis.duplicateRisk.level], fontSize: '0.875rem', marginTop: '2px', flexShrink: 0 }}></i>
                    <div>
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duplicate Risk: </span>
                      <span className="text-xs font-bold" style={{ color: DUPLICATE_COLORS[aiAnalysis.duplicateRisk.level] }}>
                        {aiAnalysis.duplicateRisk.level.toUpperCase()}
                      </span>
                      {aiAnalysis.duplicateRisk.reason && (
                        <p className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.5 }}>{aiAnalysis.duplicateRisk.reason}</p>
                      )}
                    </div>
                  </div>

                  {/* Flags */}
                  {aiAnalysis.flags.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {aiAnalysis.flags.map((flag, i) => {
                        const isDanger = flag.severity === 'critical' || flag.severity === 'high';
                        return (
                          <div key={i} style={{ background: isDanger ? 'var(--status-danger-bg)' : 'var(--status-warning-bg)', border: `1px solid ${isDanger ? 'var(--status-danger-border)' : 'var(--status-warning-border)'}`, borderRadius: 'var(--radius-sm)', padding: '8px 10px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '0.75rem', color: isDanger ? 'var(--status-danger)' : 'var(--status-warning)', flexShrink: 0, marginTop: '1px' }}></i>
                            <span className="text-xs" style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>{flag.message}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Recommendation */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--spacing-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recommendation:</span>
                      {ACTION_BADGE[aiAnalysis.approvalRecommendation.action] && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: ACTION_BADGE[aiAnalysis.approvalRecommendation.action].bg, color: ACTION_BADGE[aiAnalysis.approvalRecommendation.action].color }}>
                          {ACTION_BADGE[aiAnalysis.approvalRecommendation.action].label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{aiAnalysis.approvalRecommendation.reason}</p>
                    {aiAnalysis.approvalRecommendation.suggestedApprovers.length > 0 && (
                      <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {aiAnalysis.approvalRecommendation.suggestedApprovers.map((a, i) => (
                          <span key={i} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                            <i className="fa-solid fa-user" style={{ marginRight: '4px', fontSize: '0.6rem' }}></i>{a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card ai-insight">
                <div className="ai-insight-label">
                  <i className="fa-solid fa-microchip"></i>
                  AI Reasoning
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  Amount is above the internal approval limit of <strong>{threshold} {currency}</strong>. Verified vendor details against project contract <strong>{selectedContractId || '#CP-2026-88'}</strong>. Invoice line item matches SRS scope for mobile UI work.
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                  <i className="fa-solid fa-lightbulb" style={{ marginRight: '4px' }}></i>
                  {selectedContractId
                    ? 'Click Analyze with AI for a live contract-aligned analysis.'
                    : 'Link a contract above, then click Analyze with AI.'}
                </p>
                <div className="ai-insight-bg-icon"><i className="fa-solid fa-brain"></i></div>
              </div>
            )}

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

              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginBottom: 'var(--spacing-sm)', width: '100%' }}
                onClick={analyzeInvoice}
                disabled={isAnalyzing}
              >
                {isAnalyzing
                  ? <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing…</>
                  : <><i className="fa-solid fa-microchip"></i> Analyze with AI</>
                }
              </button>

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
