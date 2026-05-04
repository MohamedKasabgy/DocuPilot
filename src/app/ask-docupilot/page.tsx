'use client';
import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';

type ToastType = 'success' | 'info' | 'warning' | 'error';
type Lang = 'en' | 'ar';

const TOAST_ICONS: Record<ToastType, string> = {
  success: 'fa-solid fa-circle-check',
  info:    'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
  error:   'fa-solid fa-circle-xmark',
};

const suggestedQueries = [
  { icon: 'fa-solid fa-triangle-exclamation', label: 'What are the top risks this week?', color: 'var(--status-danger)', bg: 'var(--status-danger-bg)' },
  { icon: 'fa-solid fa-file-invoice-dollar', label: 'Which invoices need approval today?', color: 'var(--status-warning)', bg: 'var(--status-warning-bg)' },
  { icon: 'fa-solid fa-shield-halved', label: 'Any scope creep in active projects?', color: 'var(--accent-primary)', bg: 'rgba(37, 99, 235, 0.08)' },
  { icon: 'fa-solid fa-file-signature', label: 'Summarize contract #CON-2024-089', color: 'var(--status-success)', bg: 'var(--status-success-bg)' },
  { icon: 'fa-solid fa-chart-line', label: 'What is the health of Clinic Booking?', color: 'var(--status-info)', bg: 'var(--status-info-bg)' },
  { icon: 'fa-solid fa-clock', label: 'What milestones are due this month?', color: 'var(--text-secondary)', bg: 'var(--bg-surface-elevated)' },
];

const PROMPT_CHIPS = [
  { icon: 'fa-solid fa-triangle-exclamation', label: 'Top risks today' },
  { icon: 'fa-solid fa-file-invoice', label: 'Pending invoices' },
  { icon: 'fa-solid fa-shield-halved', label: 'Scope creep check' },
  { icon: 'fa-solid fa-chart-bar', label: 'Project health' },
  { icon: 'fa-solid fa-clock', label: 'Upcoming milestones' },
];

const BRIEFING_CHIP = { icon: 'fa-solid fa-sparkles', label: 'What needs my attention today?' };

export default function AskDocuPilotPage() {
  const [inputValue, setInputValue] = useState('');
  const [lang, setLang] = useState<Lang>('en');
  const [showBriefing, setShowBriefing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleChip = (label: string) => setInputValue(label);
  const handleSuggest = (label: string) => setInputValue(label);
  const handleBriefing = () => { setShowBriefing(true); setInputValue(''); };

  return (
    <>
      <Header />
      <div className="page-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-height))' }}>

        <div className="layout-sidebar-right" style={{ flex: 1, minHeight: 0 }}>

          {/* Chat Column */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>

            {/* Chat Header */}
            <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', background: 'white' }}>
              <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.125rem', boxShadow: '0 4px 12px var(--accent-primary-glow)', flexShrink: 0 }}>
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <div className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>DocuPilot AI</div>
                <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-success)', display: 'inline-block' }}></span>
                  Connected to all workspace data
                </div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div className="seg-control">
                  <button className={`seg-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
                  <button className={`seg-btn${lang === 'ar' ? ' active' : ''}`} onClick={() => setLang('ar')}>AR</button>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => showToast('Conversation cleared', 'info')}>
                  <i className="fa-solid fa-trash-can"></i> Clear
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', background: 'var(--bg-main)' }}>

              {/* AI Welcome */}
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8125rem', flexShrink: 0 }}>
                  <i className="fa-solid fa-robot"></i>
                </div>
                <div style={{ background: 'white', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)', padding: 'var(--spacing-md) var(--spacing-lg)', maxWidth: '85%', boxShadow: 'var(--shadow-sm)' }}>
                  {lang === 'en' ? (
                    <>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                        Hello, I&apos;m your DocuPilot AI assistant. I have full visibility into your workspace — projects, contracts, invoices, risks, and scope activity.
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', marginTop: '8px' }}>
                        How can I help you operate more efficiently today?
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', direction: 'rtl', textAlign: 'right' }}>
                        مرحباً، أنا مساعد DocuPilot الذكي. لدي رؤية كاملة لمساحة عملك — المشاريع، العقود، الفواتير، المخاطر، ونطاق العمل.
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', marginTop: '8px', direction: 'rtl', textAlign: 'right' }}>
                        كيف يمكنني مساعدتك اليوم؟
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* User Message */}
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                <div style={{ background: 'var(--accent-primary)', color: 'white', borderRadius: 'var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl)', padding: 'var(--spacing-md) var(--spacing-lg)', maxWidth: '70%' }}>
                  <p className="text-sm leading-relaxed">
                    What is the contract risk for the Clinic Booking Platform project?
                  </p>
                </div>
                <div className="avatar" style={{ flexShrink: 0 }}>NX</div>
              </div>

              {/* AI Structured Response */}
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8125rem', flexShrink: 0 }}>
                  <i className="fa-solid fa-robot"></i>
                </div>
                <div style={{ flex: 1, maxWidth: '88%' }}>
                  <div style={{ background: 'white', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)', padding: 'var(--spacing-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    <p className="text-sm leading-relaxed" style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-primary)' }}>
                      I found <strong>2 high-priority contract risks</strong> for the Clinic Booking Platform (Contract #CON-2024-089):
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                      <div style={{ background: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', borderLeft: '3px solid var(--status-danger)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span className="text-xs font-bold text-danger uppercase tracking-wider">Penalty Clause — Clause 14.2</span>
                          <span className="badge badge-danger">High</span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>10% financial deduction if delivery is delayed by more than 7 days past the agreed timeline.</p>
                      </div>

                      <div style={{ background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', borderLeft: '3px solid var(--status-warning)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span className="text-xs font-bold text-warning uppercase tracking-wider">Current UAT Delay Risk</span>
                          <span className="badge badge-warning">Medium</span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>Based on current task velocity, UAT may extend by 2 days. This brings you within 5 days of the penalty window.</p>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                      <strong className="text-primary">Recommended action:</strong> Reallocate 2 developers from the reporting module to unblock the Payment Gateway integration and reduce UAT risk.
                    </p>

                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <Link href="/risks" className="btn btn-primary btn-sm">
                        <i className="fa-solid fa-triangle-exclamation"></i> Open Risk Radar
                      </Link>
                      <Link href="/contracts" className="btn btn-secondary btn-sm">
                        <i className="fa-solid fa-file-signature"></i> View Contract
                      </Link>
                    </div>
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: '6px', paddingLeft: 'var(--spacing-sm)' }}>
                    <i className="fa-solid fa-bolt" style={{ color: 'var(--accent-primary)', marginRight: '4px' }}></i>
                    DocuPilot AI &middot; Powered by workspace intelligence
                  </div>
                </div>
              </div>


              {/* Briefing Response */}
              {showBriefing && (
                <>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                    <div style={{ background: 'var(--accent-primary)', color: 'white', borderRadius: 'var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl)', padding: 'var(--spacing-md) var(--spacing-lg)', maxWidth: '70%' }}>
                      <p className="text-sm leading-relaxed">{BRIEFING_CHIP.label}</p>
                    </div>
                    <div className="avatar" style={{ flexShrink: 0 }}>NX</div>
                  </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start', padding: '0 var(--spacing-xl)' }}>
                  <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8125rem', flexShrink: 0 }}>
                    <i className="fa-solid fa-robot"></i>
                  </div>
                  <div style={{ flex: 1, maxWidth: '92%' }}>
                    <div style={{ background: 'white', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)', padding: 'var(--spacing-lg)', boxShadow: 'var(--shadow-sm)' }}>
                      <p className="text-sm font-semibold" style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-primary)' }}>
                        Here&apos;s your morning briefing for <strong>May 3, 2026</strong>. You have 4 items requiring attention:
                      </p>

                      {/* High Risks */}
                      <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--status-danger)', fontSize: '0.8125rem' }}></i>
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--status-danger)' }}>High Risks</span>
                          <span className="badge badge-danger">2</span>
                        </div>
                        {[
                          'Penalty clause on Clinic Booking Platform — delivery 12 days away. Penalty window: 7 days.',
                          'Scope creep detected: mobile app request not in contract. Change Request pending signature.',
                        ].map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: '8px', padding: '6px 10px', background: 'var(--status-danger-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-danger-border)', marginBottom: '4px' }}>
                            <i className="fa-solid fa-circle-dot" style={{ color: 'var(--status-danger)', fontSize: '0.5rem', marginTop: '6px', flexShrink: 0 }}></i>
                            <span className="text-sm" style={{ lineHeight: 1.5 }}>{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Pending Approvals */}
                      <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <i className="fa-solid fa-clipboard-check" style={{ color: 'var(--status-warning)', fontSize: '0.8125rem' }}></i>
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--status-warning)' }}>Pending Approvals</span>
                          <span className="badge badge-warning">1</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', padding: '6px 10px', background: 'var(--status-warning-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-warning-border)' }}>
                          <i className="fa-solid fa-circle-dot" style={{ color: 'var(--status-warning)', fontSize: '0.5rem', marginTop: '6px', flexShrink: 0 }}></i>
                          <span className="text-sm" style={{ lineHeight: 1.5 }}>Invoice <strong>#INV-2026-042</strong> (6,500 SAR from DesignPro Studio) — due in 4 days. Possible duplicate flagged.</span>
                        </div>
                      </div>

                      {/* Upcoming Deadlines */}
                      <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <i className="fa-regular fa-clock" style={{ color: 'var(--status-info)', fontSize: '0.8125rem' }}></i>
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--status-info)' }}>Upcoming Deadlines</span>
                          <span className="badge badge-info">3</span>
                        </div>
                        {[
                          { label: 'Weekly status report', days: '6 days' },
                          { label: 'UAT submission', days: '25 days' },
                          { label: 'Phase 1 delivery', days: '43 days' },
                        ].map((dl, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                            <span className="text-sm">{dl.label}</span>
                            <span className="text-xs font-bold text-muted">{dl.days}</span>
                          </div>
                        ))}
                      </div>

                      {/* Recommended Actions */}
                      <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <i className="fa-solid fa-bolt" style={{ color: 'var(--accent-primary)', fontSize: '0.8125rem' }}></i>
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>Recommended Actions</span>
                        </div>
                        {[
                          { action: 'Approve or flag Invoice INV-2026-042', href: '/invoices' },
                          { action: 'Review and sign the Scope Guard Change Request', href: '/scope-guard' },
                          { action: 'Assign a risk owner for the API delay risk', href: '/risks' },
                        ].map((rec, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(37,99,235,0.1)', color: 'var(--accent-primary)', fontSize: '0.6875rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                              <span className="text-sm">{rec.action}</span>
                            </div>
                            <Link href={rec.href} className="text-xs font-medium text-accent" style={{ flexShrink: 0, marginLeft: '8px' }}>
                              Go <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.6rem' }}></i>
                            </Link>
                          </div>
                        ))}
                      </div>

                    </div>
                    <div className="text-xs text-muted" style={{ marginTop: '6px', paddingLeft: 'var(--spacing-sm)' }}>
                      <i className="fa-solid fa-bolt" style={{ color: 'var(--accent-primary)', marginRight: '4px' }}></i>
                      DocuPilot AI &middot; Morning briefing · May 3, 2026
                    </div>
                  </div>
                </div>
              </>
              )}

            </div>

            {/* Input Area */}
            <div style={{ padding: 'var(--spacing-md) var(--spacing-lg) var(--spacing-lg)', borderTop: '1px solid var(--border-subtle)', background: 'white' }}>
              {/* Featured Briefing Chip */}
              <button
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', background: 'linear-gradient(135deg, rgba(79,70,229,0.08), rgba(124,58,237,0.08))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', marginBottom: 'var(--spacing-sm)', fontFamily: 'var(--font-sans)', transition: 'all var(--transition-fast)' }}
                onClick={handleBriefing}
              >
                <i className={BRIEFING_CHIP.icon} style={{ color: 'var(--accent-ai)', fontSize: '0.875rem', flexShrink: 0 }}></i>
                <span className="text-sm font-semibold" style={{ flex: 1, textAlign: 'left', color: 'var(--accent-ai)' }}>{BRIEFING_CHIP.label}</span>
                <span className="demo-badge" style={{ fontSize: '0.5625rem', padding: '2px 6px' }}>AI Briefing</span>
              </button>
              {/* Prompt Chips */}
              <div className="prompt-chips" style={{ marginBottom: 'var(--spacing-sm)' }}>
                {PROMPT_CHIPS.map(chip => (
                  <button key={chip.label} className="prompt-chip" onClick={() => handleChip(chip.label)}>
                    <i className={chip.icon}></i>
                    {chip.label}
                  </button>
                ))}
              </div>

              <div className="chat-input-row">
                <textarea
                  rows={1}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={lang === 'en' ? 'Ask about risks, invoices, contracts, scope, or projects...' : 'اسأل عن المخاطر، الفواتير، العقود، النطاق، أو المشاريع...'}
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', color: 'var(--text-primary)', resize: 'none', lineHeight: 1.5, maxHeight: '120px', minHeight: '24px' }}
                ></textarea>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flexShrink: 0 }}
                  onClick={() => { if (inputValue.trim()) { setInputValue(''); showToast('Message sent', 'info'); } }}
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
              <p className="text-xs text-muted" style={{ marginTop: '8px', textAlign: 'center' }}>
                DocuPilot AI has access to your projects, contracts, invoices, risks, and scope data.
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>

            {/* Suggested Queries */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-lightbulb text-accent"></i>
                  Suggested Queries
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {suggestedQueries.map((query, i) => (
                  <button
                    key={i}
                    className="action-suggest"
                    style={{ textAlign: 'left', cursor: 'pointer', background: 'white', border: '1px solid var(--border-subtle)' }}
                    onClick={() => handleSuggest(query.label)}
                  >
                    <div className="action-icon" style={{ background: query.bg, color: query.color, fontSize: '0.875rem' }}>
                      <i className={query.icon}></i>
                    </div>
                    <span className="text-sm font-medium" style={{ flex: 1, lineHeight: 1.4 }}>{query.label}</span>
                    <i className="fa-solid fa-arrow-right text-muted" style={{ fontSize: '0.6875rem' }}></i>
                  </button>
                ))}
              </div>
            </div>

            {/* Connected Data Sources */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-database text-accent"></i>
                  Data Sources
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {[
                  { icon: 'fa-solid fa-folder-open', label: 'Projects', count: '12 Active', color: 'var(--accent-primary)', bg: 'rgba(37, 99, 235, 0.08)' },
                  { icon: 'fa-solid fa-file-signature', label: 'Contracts', count: '8 Indexed', color: 'var(--status-success)', bg: 'var(--status-success-bg)' },
                  { icon: 'fa-solid fa-file-invoice', label: 'Invoices', count: '24 Total', color: 'var(--status-warning)', bg: 'var(--status-warning-bg)' },
                  { icon: 'fa-solid fa-triangle-exclamation', label: 'Risk Items', count: '24 Tracked', color: 'var(--status-danger)', bg: 'var(--status-danger-bg)' },
                  { icon: 'fa-solid fa-shield-halved', label: 'Scope Events', count: '6 This Month', color: 'var(--status-info)', bg: 'var(--status-info-bg)' },
                ].map(src => (
                  <div key={src.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', padding: '8px var(--spacing-sm)', borderRadius: 'var(--radius-md)' }}>
                    <div className="list-item-icon" style={{ background: src.bg, color: src.color, width: '32px', height: '32px', flexShrink: 0, fontSize: '0.875rem' }}>
                      <i className={src.icon}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="text-sm font-medium">{src.label}</div>
                      <div className="text-xs text-muted">{src.count}</div>
                    </div>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-success)' }}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--text-muted)' }}></i>
                  Recent Sessions
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  'Contract risk analysis — yesterday',
                  'Invoice approval summary — 2 days ago',
                  'Scope guard query for OMNIMOBILE — 3 days ago',
                ].map((session, i) => (
                  <button key={i} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '8px 10px', fontSize: '0.8125rem', color: 'var(--text-secondary)', gap: '8px', textAlign: 'left' }} onClick={() => showToast('Session loaded', 'info')}>
                    <i className="fa-regular fa-comment-dots text-muted" style={{ fontSize: '0.75rem', flexShrink: 0 }}></i>
                    {session}
                  </button>
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
