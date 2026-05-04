import Header from '@/components/layout/Header';
import Link from 'next/link';

export default function ProjectsPage() {
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-lg)' }}>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                <span className="badge badge-success">On Track</span>
                <span className="badge badge-neutral">NEX-2024-082</span>
              </div>
              <h1 className="page-title">Al Waha Clinics</h1>
              <p className="page-subtitle" style={{ maxWidth: '560px' }}>
                Digital Transformation: Implementation of an end-to-end patient booking and management ecosystem.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-xl)', flexShrink: 0 }}>
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
            {['Overview', 'SRS', 'Contract', 'Invoices', 'Tasks', 'Risks'].map((tab, i) => (
              <div key={tab} className={`tab-item ${i === 0 ? 'active' : ''}`}>{tab}</div>
            ))}
          </div>
        </div>

        <div className="layout-sidebar-right">
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>

            {/* Roadmap */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-map-location-dot text-accent"></i>
                  Project Roadmap
                </h2>
                <a href="#" className="card-link">Full Gantt <i className="fa-solid fa-arrow-right text-xs"></i></a>
              </div>

              <div className="timeline">
                {[
                  { date: 'Oct 12', label: 'Kickoff', state: 'completed' },
                  { date: 'Oct 28', label: 'SRS Freeze', state: 'completed' },
                  { date: 'Nov 15', label: 'UAT Phase', state: 'active', now: true },
                  { date: 'Nov 22', label: 'Security Audit', state: '' },
                  { date: 'Nov 30', label: 'Deployment', state: '' },
                ].map((node) => (
                  <div key={node.date} className={`timeline-node ${node.state}`}>
                    <div className="node-dot">
                      {node.state === 'completed' && <i className="fa-solid fa-check" style={{ fontSize: '0.5rem', color: 'white' }}></i>}
                      {node.state === 'active' && <i className="fa-solid fa-play" style={{ fontSize: '0.4rem', color: 'white', marginLeft: '1px' }}></i>}
                    </div>
                    <div className={`text-xs font-semibold uppercase tracking-wider ${node.state === 'active' ? 'text-accent' : 'text-muted'}`} style={{ marginBottom: '2px' }}>
                      {node.now ? `${node.date} — NOW` : node.date}
                    </div>
                    <div className={`text-sm ${node.state === 'active' ? 'font-bold text-primary' : node.state === 'completed' ? 'font-medium' : 'text-muted'}`}>
                      {node.label}
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
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-secondary btn-icon-sm"><i className="fa-solid fa-filter"></i></button>
                  <button className="btn btn-secondary btn-icon-sm"><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>
              </div>

              <table className="data-table" style={{ marginTop: 'var(--spacing-sm)' }}>
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
                  <tr>
                    <td>
                      <div className="font-medium text-sm">Patient Dashboard UI Refinement</div>
                      <div className="text-xs text-muted">Front-end Development &middot; V2.1</div>
                    </td>
                    <td>
                      <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.6875rem' }}>AM</div>
                    </td>
                    <td><span className="badge badge-accent">In Progress</span></td>
                    <td><span className="text-sm font-medium" style={{ color: 'var(--status-warning)' }}>Today</span></td>
                    <td><button className="action-btn"><i className="fa-solid fa-ellipsis-vertical"></i></button></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="font-medium text-sm">Payment Gateway Integration</div>
                      <div className="text-xs text-muted">Back-end &middot; API Services</div>
                    </td>
                    <td>
                      <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.6875rem', background: 'var(--status-success)' }}>SJ</div>
                    </td>
                    <td><span className="badge badge-danger">Blocked</span></td>
                    <td><span className="text-sm text-secondary">Nov 18</span></td>
                    <td><button className="action-btn"><i className="fa-solid fa-ellipsis-vertical"></i></button></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="font-medium text-sm text-muted line-through">Database Schema Finalization</div>
                      <div className="text-xs text-muted">DevOps &middot; Architecture</div>
                    </td>
                    <td>
                      <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.6875rem', background: 'var(--status-warning)' }}>RK</div>
                    </td>
                    <td><span className="badge badge-success">Done</span></td>
                    <td><span className="text-sm text-muted">Nov 10</span></td>
                    <td><button className="action-btn"><i className="fa-solid fa-ellipsis-vertical"></i></button></td>
                  </tr>
                </tbody>
              </table>

              <button className="btn btn-ghost" style={{ width: '100%', marginTop: 'var(--spacing-md)' }}>
                View All Tasks <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>

          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>

            {/* Project Vault */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-solid fa-vault text-accent"></i>
                  Project Vault
                </h2>
                <button className="btn btn-secondary btn-icon-sm" data-tooltip="Upload file">
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

              <button className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--spacing-md)' }}>
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
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--spacing-md)' }}>
                Optimize Schedule
              </button>
              <div className="ai-insight-bg-icon"><i className="fa-solid fa-robot"></i></div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
