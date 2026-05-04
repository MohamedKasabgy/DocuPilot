'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

type ToastType = 'success' | 'info' | 'warning' | 'error';
type Tab = 'Overview' | 'SRS' | 'Contract' | 'Invoices' | 'Tasks' | 'Risks';
type StatusFilter = 'all' | 'In Progress' | 'Blocked' | 'Done';

const TOAST_ICONS: Record<ToastType, string> = {
  success: 'fa-solid fa-circle-check',
  info:    'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
  error:   'fa-solid fa-circle-xmark',
};

const TABS: { name: Tab; href?: string }[] = [
  { name: 'Overview' },
  { name: 'SRS',      href: '/srs-generator' },
  { name: 'Contract', href: '/contracts'     },
  { name: 'Invoices', href: '/invoices'      },
  { name: 'Tasks' },
  { name: 'Risks',    href: '/risks'         },
];

const ROADMAP = [
  { date: 'Oct 12', label: 'Kickoff',        state: 'completed' },
  { date: 'Oct 28', label: 'SRS Freeze',     state: 'completed' },
  { date: 'Nov 15', label: 'UAT Phase',      state: 'active', now: true },
  { date: 'Nov 22', label: 'Security Audit', state: '' },
  { date: 'Nov 30', label: 'Deployment',     state: '' },
] as const;

interface TaskRow {
  title: string;
  sub: string;
  owner: string;
  ownerBg?: string;
  status: 'In Progress' | 'Blocked' | 'Done';
  statusClass: string;
  due: string;
  dueStyle: React.CSSProperties;
  done: boolean;
}

const TASKS: TaskRow[] = [
  { title: 'Patient Dashboard UI Refinement', sub: 'Front-end Development · V2.1', owner: 'AM',                                                status: 'In Progress', statusClass: 'badge-accent',  due: 'Today',  dueStyle: { color: 'var(--status-warning)' }, done: false },
  { title: 'Payment Gateway Integration',     sub: 'Back-end · API Services',      owner: 'SJ', ownerBg: 'var(--status-success)',              status: 'Blocked',     statusClass: 'badge-danger',  due: 'Nov 18', dueStyle: {},                                  done: false },
  { title: 'Database Schema Finalization',    sub: 'DevOps · Architecture',        owner: 'RK', ownerBg: 'var(--status-warning)',              status: 'Done',        statusClass: 'badge-success', due: 'Nov 10', dueStyle: {},                                  done: true  },
];

const SRS_SECTIONS = [
  { title: 'Functional Requirements', count: 18, status: 'Approved'  },
  { title: 'User Roles',               count: 5,  status: 'Approved'  },
  { title: 'Non-Functional Reqs.',     count: 12, status: 'In Review' },
  { title: 'Acceptance Criteria',      count: 9,  status: 'Draft'     },
];

const CONTRACT_DETAILS = [
  { label: 'Contract ID',    value: 'CON-2024-089'              },
  { label: 'Client',         value: 'Al Waha Healthcare Group'  },
  { label: 'Total Value',    value: '$245,000'                  },
  { label: 'Effective Date', value: 'Oct 12, 2025'              },
  { label: 'End Date',       value: 'Nov 30, 2026'              },
  { label: 'Status',         value: 'Active'                    },
];

const INVOICES_LIST = [
  { id: 'INV-2026-040', desc: 'Phase 1 — Discovery',            amount: '$48,000', status: 'Paid',     statusClass: 'badge-success' },
  { id: 'INV-2026-041', desc: 'Phase 2 — UI/UX Design',          amount: '$36,500', status: 'Paid',     statusClass: 'badge-success' },
  { id: 'INV-2026-042', desc: 'Phase 3 — UI Milestone 2',        amount: '$6,500',  status: 'Pending',  statusClass: 'badge-warning' },
];

const RISK_LIST = [
  { title: 'Late delivery penalty exposure',     severity: 'High',   class: 'badge-danger'  },
  { title: 'Out-of-scope mobile app request',     severity: 'High',   class: 'badge-danger'  },
  { title: 'Missing client confirmation on API', severity: 'Medium', class: 'badge-warning' },
];

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [taskFilter, setTaskFilter] = useState<StatusFilter>('all');
  const [taskSearch, setTaskSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [openTaskMenu, setOpenTaskMenu] = useState<number | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  const showToast = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const filteredTasks = TASKS
    .map((t, i) => ({ ...t, index: i, done: completedTasks.has(i) || t.done }))
    .filter(t => {
      if (taskFilter !== 'all' && t.status !== taskFilter) return false;
      if (taskSearch && !t.title.toLowerCase().includes(taskSearch.toLowerCase())) return false;
      return true;
    });

  const toggleTaskDone = (i: number) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
    setOpenTaskMenu(null);
    showToast('Task status updated', 'success');
  };

  return (
    <>
      <Header>
        <nav className="page-breadcrumb">
          <Link href="/projects">Projects</Link>
          <i className="fa-solid fa-chevron-right sep" style={{ fontSize: '0.6rem' }}></i>
          <span className="current">Al Waha Clinics</span>
        </nav>
      </Header>

      <div className="page-container animate-fade-in">

        {/* Project Header */}
        <div style={{ marginBottom: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>

            <div style={{ flex: '1 1 260px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                <span className="badge badge-success">On Track</span>
                <span className="badge badge-neutral">NEX-2024-082</span>
              </div>
              <h1 className="page-title">Al Waha Clinics</h1>
              <p className="page-subtitle">
                Digital Transformation: Implementation of an end-to-end patient booking and management ecosystem.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Health Score</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--accent-primary)', lineHeight: 1 }}>82%</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '4px' }}>Delivery</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, lineHeight: 1, marginTop: '4px' }}>Nov 30</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="text-xs text-muted font-semibold uppercase tracking-wider" style={{ marginBottom: '6px' }}>Risk Level</div>
                <span className="badge badge-warning badge-lg">Medium</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-nav" style={{ marginTop: 'var(--spacing-xl)', marginBottom: 0 }}>
            {TABS.map(tab => (
              <button
                key={tab.name}
                className={`tab-item ${activeTab === tab.name ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.name)}
                style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'Overview' && (
          <div className="layout-sidebar-right">
            {/* Left Column */}
            <div className="section-gap">

              {/* Roadmap */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fa-solid fa-map-location-dot text-accent"></i>
                    Project Roadmap
                  </h2>
                  <button
                    onClick={() => showToast('Full Gantt view coming soon', 'info')}
                    className="card-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                  >
                    Full Gantt <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                </div>

                {/* Horizontal timeline (tablet/desktop) */}
                <div className="timeline timeline-horizontal">
                  {ROADMAP.map((node) => (
                    <div key={node.date} className={`timeline-node ${node.state}`}>
                      <div className="node-dot">
                        {node.state === 'completed' && <i className="fa-solid fa-check" style={{ fontSize: '0.5rem', color: 'white' }}></i>}
                        {node.state === 'active' && <i className="fa-solid fa-play" style={{ fontSize: '0.4rem', color: 'white', marginLeft: '1px' }}></i>}
                      </div>
                      <div className={`text-xs font-semibold uppercase tracking-wider ${node.state === 'active' ? 'text-accent' : 'text-muted'}`} style={{ marginBottom: '2px' }}>
                        {'now' in node && node.now ? `${node.date} — NOW` : node.date}
                      </div>
                      <div className={`text-sm ${node.state === 'active' ? 'font-bold text-primary' : node.state === 'completed' ? 'font-medium' : 'text-muted'}`}>
                        {node.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vertical timeline (mobile) */}
                <div className="timeline-vertical">
                  {ROADMAP.map((node) => (
                    <div key={node.date} className={`timeline-node-v ${node.state}`}>
                      <div className="node-dot">
                        {node.state === 'completed' && <i className="fa-solid fa-check" style={{ fontSize: '0.5rem', color: 'white' }}></i>}
                        {node.state === 'active' && <i className="fa-solid fa-play" style={{ fontSize: '0.4rem', color: 'white', marginLeft: '1px' }}></i>}
                      </div>
                      <div className="node-content">
                        <div className="node-date">{'now' in node && node.now ? `${node.date} — NOW` : node.date}</div>
                        <div className="node-label">{node.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Task Stream */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fa-solid fa-list-check text-accent"></i>
                    Active Task Stream
                  </h2>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {showSearch && (
                      <input
                        type="text"
                        autoFocus
                        value={taskSearch}
                        onChange={e => setTaskSearch(e.target.value)}
                        placeholder="Search tasks..."
                        style={{ padding: '4px 10px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', outline: 'none', maxWidth: '160px' }}
                      />
                    )}
                    <select
                      value={taskFilter}
                      onChange={e => setTaskFilter(e.target.value as StatusFilter)}
                      style={{ height: '28px', fontSize: '0.75rem', padding: '0 6px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', background: 'white', cursor: 'pointer' }}
                      aria-label="Filter tasks by status"
                    >
                      <option value="all">All status</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Done">Done</option>
                    </select>
                    <button className="btn btn-secondary btn-icon-sm" onClick={() => { setShowSearch(v => !v); if (showSearch) setTaskSearch(''); }} aria-label="Toggle task search">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </div>
                </div>

                {filteredTasks.length === 0 ? (
                  <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <i className="fa-solid fa-filter-circle-xmark" style={{ marginRight: '6px' }}></i>
                    No tasks match the current filter.
                  </div>
                ) : (
                  <>
                    {/* Desktop table */}
                    <div className="task-table-desktop" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' as never }}>
                      <table className="data-table" style={{ marginTop: 'var(--spacing-sm)', minWidth: '480px' }}>
                        <thead>
                          <tr>
                            <th style={{ width: '40%' }}>Task</th>
                            <th>Owner</th>
                            <th>Status</th>
                            <th>Due</th>
                            <th style={{ width: '32px' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTasks.map(task => (
                            <tr key={task.title}>
                              <td>
                                <div className={`font-medium text-sm${task.done ? ' text-muted line-through' : ''}`}>{task.title}</div>
                                <div className="text-xs text-muted">{task.sub}</div>
                              </td>
                              <td><div className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.6875rem', ...(task.ownerBg ? { background: task.ownerBg } : {}) }}>{task.owner}</div></td>
                              <td><span className={`badge ${task.statusClass}`}>{task.status}</span></td>
                              <td><span className={`text-sm${task.done ? ' text-muted' : ' font-medium'}`} style={task.dueStyle}>{task.due}</span></td>
                              <td style={{ position: 'relative' }}>
                                <button className="action-btn" onClick={() => setOpenTaskMenu(openTaskMenu === task.index ? null : task.index)} aria-label="Task actions">
                                  <i className="fa-solid fa-ellipsis-vertical"></i>
                                </button>
                                {openTaskMenu === task.index && (
                                  <div style={{ position: 'absolute', top: '100%', right: 0, background: 'white', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', zIndex: 10, minWidth: '160px' }}>
                                    <button onClick={() => toggleTaskDone(task.index)} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8125rem', textAlign: 'left' }}>
                                      <i className="fa-solid fa-check" style={{ width: '12px', color: 'var(--status-success)' }}></i>
                                      {task.done ? 'Mark as not done' : 'Mark as done'}
                                    </button>
                                    <button onClick={() => { setOpenTaskMenu(null); showToast('Edit task — coming soon', 'info'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8125rem', textAlign: 'left' }}>
                                      <i className="fa-solid fa-pen" style={{ width: '12px', color: 'var(--text-muted)' }}></i>
                                      Edit task
                                    </button>
                                    <button onClick={() => { setOpenTaskMenu(null); showToast('Reassign — coming soon', 'info'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8125rem', textAlign: 'left' }}>
                                      <i className="fa-solid fa-user-plus" style={{ width: '12px', color: 'var(--text-muted)' }}></i>
                                      Reassign
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile task cards */}
                    <div className="task-cards-mobile">
                      {filteredTasks.map(task => (
                        <div key={task.title} className="task-card">
                          <div className="task-card-header">
                            <div className={`task-card-title${task.done ? ' done' : ''}`}>{task.title}</div>
                            <div style={{ position: 'relative' }}>
                              <button className="action-btn" style={{ width: '32px', height: '32px', flexShrink: 0 }} onClick={() => setOpenTaskMenu(openTaskMenu === task.index ? null : task.index)} aria-label="Task actions">
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </button>
                              {openTaskMenu === task.index && (
                                <div style={{ position: 'absolute', top: '100%', right: 0, background: 'white', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', zIndex: 10, minWidth: '160px' }}>
                                  <button onClick={() => toggleTaskDone(task.index)} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8125rem', textAlign: 'left' }}>
                                    <i className="fa-solid fa-check" style={{ width: '12px', color: 'var(--status-success)' }}></i>
                                    {task.done ? 'Mark as not done' : 'Mark as done'}
                                  </button>
                                  <button onClick={() => { setOpenTaskMenu(null); showToast('Edit task — coming soon', 'info'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8125rem', textAlign: 'left' }}>
                                    <i className="fa-solid fa-pen" style={{ width: '12px', color: 'var(--text-muted)' }}></i>
                                    Edit task
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="task-card-meta">{task.sub}</div>
                          <div className="task-card-footer">
                            <div className="avatar" style={{ width: '24px', height: '24px', fontSize: '0.625rem', ...(task.ownerBg ? { background: task.ownerBg } : {}) }}>{task.owner}</div>
                            <span className={`badge ${task.statusClass}`}>{task.status}</span>
                            <span className="task-card-due" style={task.dueStyle}>{task.due}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <button className="btn btn-ghost" style={{ width: '100%', marginTop: 'var(--spacing-md)' }} onClick={() => setActiveTab('Tasks')}>
                  View All Tasks <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </div>

            </div>

            {/* Right Column */}
            <div className="section-gap">

              {/* Project Vault */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fa-solid fa-vault text-accent"></i>
                    Project Vault
                  </h2>
                  <button className="btn btn-secondary btn-icon-sm" data-tooltip="Upload file" onClick={() => showToast('File upload is not connected yet — coming soon', 'info')} aria-label="Upload file">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  </button>
                </div>

                <div>
                  <div className="vault-item">
                    <div className="vault-item-icon" style={{ background: 'rgba(220, 38, 38, 0.08)', color: '#DC2626' }}>
                      <i className="fa-solid fa-file-pdf"></i>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="text-sm font-medium">Final_SRS_v2.4.pdf</div>
                      <div className="text-xs text-muted" style={{ marginBottom: '8px' }}>2 days ago &middot; 4.2 MB</div>
                      <div style={{ background: 'var(--bg-main)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid var(--accent-primary)', fontSize: '0.75rem' }}>
                        <span className="font-bold text-accent">AI:</span>
                        <span className="text-secondary"> 12 core modules including HIPAA-compliant storage and Stripe checkout.</span>
                      </div>
                    </div>
                  </div>

                  <div className="vault-item">
                    <div className="vault-item-icon" style={{ background: 'rgba(2, 132, 199, 0.08)', color: 'var(--status-info)' }}>
                      <i className="fa-solid fa-file-word"></i>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="text-sm font-medium">Service_Agreement.docx</div>
                      <div className="text-xs text-muted" style={{ marginBottom: '8px' }}>Oct 15 &middot; 1.1 MB</div>
                      <div style={{ background: 'var(--bg-main)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid var(--accent-primary)', fontSize: '0.75rem' }}>
                        <span className="font-bold text-accent">AI:</span>
                        <span className="text-secondary"> Standard maintenance terms apply post-launch. 6 months premium support.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--spacing-md)' }} onClick={() => showToast('Asset library — coming soon', 'info')}>
                  View All Assets
                </button>
              </div>

              {/* DocuPilot Insight */}
              <div className="card ai-insight">
                <div className="ai-insight-label">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  DocuPilot Insight
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  Based on current task velocity, the UAT phase might extend by{' '}
                  <strong style={{ color: 'var(--status-warning)' }}>2 days</strong>.
                  Suggesting reallocation of resources to &lsquo;Database Schema&rsquo; to avoid blockers.
                </p>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--spacing-md)' }} onClick={() => showToast('Schedule optimization initiated — review changes in Tasks tab', 'success')}>
                  Optimize Schedule
                </button>
                <div className="ai-insight-bg-icon"><i className="fa-solid fa-robot"></i></div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'SRS' && (
          <div className="card content-gap">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fa-regular fa-file-lines text-accent"></i>
                SRS Document
              </h2>
              <Link href="/srs-generator" className="btn btn-secondary btn-sm">
                <i className="fa-solid fa-pen"></i> Open in Generator
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {SRS_SECTIONS.map(s => (
                <div key={s.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-md)', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div className="font-semibold text-sm">{s.title}</div>
                    <div className="text-xs text-muted">{s.count} items</div>
                  </div>
                  <span className={`badge ${s.status === 'Approved' ? 'badge-success' : s.status === 'In Review' ? 'badge-warning' : 'badge-neutral'}`}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Contract' && (
          <div className="card content-gap">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fa-solid fa-file-signature text-accent"></i>
                Contract Details
              </h2>
              <Link href="/contracts" className="btn btn-secondary btn-sm">
                <i className="fa-solid fa-arrow-up-right-from-square"></i> Open Contract Tool
              </Link>
            </div>
            <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-md)' }}>
              {CONTRACT_DETAILS.map(d => (
                <div key={d.label} className="data-row">
                  <span className="data-label">{d.label}</span>
                  <span className="data-value font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Invoices' && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fa-solid fa-file-invoice-dollar text-accent"></i>
                Project Invoices
              </h2>
              <Link href="/invoices" className="btn btn-secondary btn-sm">
                <i className="fa-solid fa-arrow-up-right-from-square"></i> Open Invoice Tool
              </Link>
            </div>
            <table className="data-table" style={{ marginTop: 'var(--spacing-sm)' }}>
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {INVOICES_LIST.map(inv => (
                  <tr key={inv.id}>
                    <td className="font-medium text-sm">{inv.id}</td>
                    <td className="text-sm text-secondary">{inv.desc}</td>
                    <td className="font-bold text-sm">{inv.amount}</td>
                    <td><span className={`badge ${inv.statusClass}`}>{inv.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Tasks' && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fa-solid fa-list-check text-accent"></i>
                All Tasks
              </h2>
              <select
                value={taskFilter}
                onChange={e => setTaskFilter(e.target.value as StatusFilter)}
                style={{ height: '28px', fontSize: '0.75rem', padding: '0 6px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', background: 'white', cursor: 'pointer' }}
              >
                <option value="all">All status</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Done">Done</option>
              </select>
            </div>
            {filteredTasks.length === 0 ? (
              <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No tasks match the current filter.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {filteredTasks.map(task => (
                  <div key={task.title} className="task-card">
                    <div className="task-card-header">
                      <div className={`task-card-title${task.done ? ' done' : ''}`}>{task.title}</div>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleTaskDone(task.index)}>
                        {task.done ? 'Reopen' : 'Mark Done'}
                      </button>
                    </div>
                    <div className="task-card-meta">{task.sub}</div>
                    <div className="task-card-footer">
                      <div className="avatar" style={{ width: '24px', height: '24px', fontSize: '0.625rem', ...(task.ownerBg ? { background: task.ownerBg } : {}) }}>{task.owner}</div>
                      <span className={`badge ${task.statusClass}`}>{task.status}</span>
                      <span className="task-card-due" style={task.dueStyle}>{task.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Risks' && (
          <div className="card content-gap">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fa-solid fa-triangle-exclamation text-accent"></i>
                Project Risks
              </h2>
              <Link href="/risks" className="btn btn-secondary btn-sm">
                <i className="fa-solid fa-arrow-up-right-from-square"></i> Open Risk Radar
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {RISK_LIST.map(r => (
                <div key={r.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-md)', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span className="font-medium text-sm">{r.title}</span>
                  <span className={`badge ${r.class}`}>{r.severity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
