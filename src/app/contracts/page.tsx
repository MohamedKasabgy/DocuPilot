import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Link from 'next/link';

export default function ContractsPage() {
  return (
    <>
      <Header />
      <div className="page-container animate-fade-in">


        <div className="page-header">
          <div>
            <h1 className="page-title text-display">Contract-to-Actions</h1>
            <p className="page-subtitle">Upload legal documents to extract operational milestones and risk alerts.</p>
          </div>
        </div>

        <div className="layout-sidebar-right">


          <div className="flex-col" style={{ 'display': 'flex', 'flexDirection': 'column', 'gap': 'var(--spacing-xl)' }}>


            <div className="card" style={{ 'display': 'flex', 'gap': 'var(--spacing-xl)' }}>
              <div style={{ 'flex': '1' }}>
                <div className="upload-zone">
                  <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
                  <h3 className="font-medium text-lg" style={{ 'marginBottom': '4px' }}>Upload Contract PDF</h3>
                  <p className="text-sm text-muted">Drag and drop or click to browse</p>
                </div>
              </div>

              <div style={{ 'flex': '1', 'display': 'flex', 'flexDirection': 'column' }}>
                <div className="text-xs font-bold text-muted"
                  style={{ 'marginBottom': 'var(--spacing-sm)', 'textTransform': 'uppercase' }}>Or Paste Contract Text</div>
                <textarea placeholder="Paste the legal clauses here for immediate extraction..."
                  style={{ 'flex': '1', 'width': '100%', 'background': 'var(--bg-main)', 'border': '1px solid var(--border-strong)', 'borderRadius': 'var(--radius-md)', 'padding': 'var(--spacing-md)', 'color': 'var(--text-primary)', 'fontFamily': 'var(--font-sans)', 'resize': 'none', 'marginBottom': 'var(--spacing-md)' }}></textarea>
                <button className="btn btn-primary" style={{ 'width': '100%', 'padding': '0.75rem' }}>
                  <i className="fa-solid fa-bolt"></i> Run AI Extraction
                </button>
              </div>
            </div>


            <div className="grid grid-cols-2 delay-100">

              <div className="card extraction-card">
                <div className="card-header">
                  <div className="list-item-icon"
                    style={{ 'background': 'rgba(16, 185, 129, 0.1)', 'color': 'var(--status-success)' }}><i
                      className="fa-solid fa-bullseye"></i></div>
                  <span className="badge badge-success">Verified</span>
                </div>
                <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'letterSpacing': '1px' }}>Scope
                </div>
                <h3 className="text-xl font-medium" style={{ 'marginTop': '8px' }}>Development of Clinic Web Platform</h3>
              </div>


              <div className="card extraction-card">
                <div className="card-header">
                  <div className="list-item-icon" style={{ 'background': 'rgba(59, 130, 246, 0.1)', 'color': 'var(--status-info)' }}><i
                    className="fa-solid fa-box-open"></i></div>
                  <span className="badge badge-info">3 Items</span>
                </div>
                <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'letterSpacing': '1px' }}>
                  Deliverables</div>
                <ul
                  style={{ 'marginTop': '8px', 'paddingLeft': '20px', 'listStyleType': 'disc', 'color': 'var(--text-secondary)', 'lineHeight': '1.8' }}>
                  <li>Web App</li>
                  <li>Admin Panel</li>
                  <li>API</li>
                </ul>
              </div>


              <div className="card extraction-card">
                <div className="card-header">
                  <div className="list-item-icon"
                    style={{ 'background': 'rgba(16, 185, 129, 0.1)', 'color': 'var(--status-success)' }}><i
                      className="fa-solid fa-money-bill-wave"></i></div>
                </div>
                <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'letterSpacing': '1px' }}>
                  Payments</div>
                <div style={{ 'marginTop': 'var(--spacing-md)' }}>
                  <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '4px' }}>
                    <span className="text-sm">Upfront</span><span className="font-bold">50%</span>
                  </div>
                  <div className="progress-container" style={{ 'marginBottom': 'var(--spacing-md)' }}>
                    <div className="progress-bar" style={{ 'width': '50%', 'background': 'var(--status-success)' }}></div>
                  </div>

                  <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '4px' }}>
                    <span className="text-sm text-secondary">UAT</span><span className="font-bold text-secondary">30%</span>
                  </div>
                  <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '4px', 'marginTop': '8px' }}>
                    <span className="text-sm text-secondary">Launch</span><span className="font-bold text-secondary">20%</span>
                  </div>
                </div>
              </div>


              <div className="card extraction-card">
                <div className="card-header">
                  <div className="list-item-icon"
                    style={{ 'background': 'rgba(245, 158, 11, 0.1)', 'color': 'var(--status-warning)' }}><i
                      className="fa-solid fa-clipboard-list"></i></div>
                </div>
                <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'letterSpacing': '1px' }}>
                  Obligations</div>
                <div
                  style={{ 'background': 'var(--bg-main)', 'padding': 'var(--spacing-sm)', 'borderRadius': 'var(--radius-sm)', 'border': '1px solid var(--border-subtle)', 'marginTop': '8px' }}>
                  <div className="font-medium text-sm text-primary">Weekly Reporting</div>
                  <div className="text-xs text-muted mt-1">Mandatory status update every Friday by 5:00 PM EST via
                    designated project dashboard.</div>
                </div>
              </div>
            </div>


            <div className="card delay-200"
              style={{ 'borderColor': 'rgba(239, 68, 68, 0.3)', 'background': 'linear-gradient(to right, rgba(239, 68, 68, 0.05), transparent)' }}>
              <div style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'marginBottom': 'var(--spacing-md)' }}>
                <i className="fa-solid fa-triangle-exclamation text-danger"></i>
                <span className="font-bold text-danger" style={{ 'textTransform': 'uppercase', 'letterSpacing': '1px' }}>High
                  Priority Risks & Clauses</span>
              </div>

              <div className="grid grid-cols-2">
                <div
                  style={{ 'background': 'var(--bg-main)', 'border': '1px solid var(--border-subtle)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'borderLeft': '4px solid var(--status-danger)' }}>
                  <div className="text-xs font-bold text-danger" style={{ 'textTransform': 'uppercase', 'marginBottom': '4px' }}>
                    Penalty Clause</div>
                  <div className="font-medium">7-day delay penalty highlighted</div>
                  <p className="text-xs text-muted mt-2">Any delay exceeding the agreed timeline triggers an immediate
                    financial review.</p>
                </div>

                <div
                  style={{ 'background': 'var(--status-danger)', 'color': 'white', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'boxShadow': '0 4px 15px rgba(239, 68, 68, 0.3)' }}>
                  <div className="text-xs font-bold"
                    style={{ 'textTransform': 'uppercase', 'marginBottom': '4px', 'color': 'rgba(255,255,255,0.8)' }}>Financial
                    Impact</div>
                  <div className="font-bold text-lg">'10% deduction if delivery is delayed more than 7 days'</div>
                  <p className="text-xs mt-2" style={{ 'color': 'rgba(255,255,255,0.8)' }}>Critical risk detected in Clause 14.2 of
                    the master agreement.</p>
                </div>
              </div>
            </div>

          </div>


          <div className="flex-col" style={{ 'display': 'flex', 'flexDirection': 'column', 'gap': 'var(--spacing-xl)' }}>

            <div className="card"
              style={{ 'background': 'linear-gradient(180deg, var(--bg-surface-elevated), var(--bg-surface))' }}>
              <h3 className="font-bold text-lg" style={{ 'marginBottom': 'var(--spacing-lg)' }}>Suggested Actions</h3>

              <div className="action-suggest">
                <div className="action-icon" style={{ 'background': 'rgba(99, 102, 241, 0.1)', 'color': 'var(--accent-primary)' }}>
                  <i className="fa-solid fa-list-check"></i>
                </div>
                <div style={{ 'flex': '1' }}>
                  <div className="font-medium text-sm">Create Task</div>
                  <div className="text-xs text-muted">Auto-map from deliverables</div>
                </div>
                <i className="fa-solid fa-chevron-right text-muted text-xs"></i>
              </div>

              <div className="action-suggest">
                <div className="action-icon" style={{ 'background': 'rgba(16, 185, 129, 0.1)', 'color': 'var(--status-success)' }}>
                  <i className="fa-solid fa-money-check-dollar"></i>
                </div>
                <div style={{ 'flex': '1' }}>
                  <div className="font-medium text-sm">Create Payment Milestone</div>
                  <div className="text-xs text-muted">Generate invoice schedules</div>
                </div>
                <i className="fa-solid fa-chevron-right text-muted text-xs"></i>
              </div>

              <div className="action-suggest"
                style={{ 'borderColor': 'rgba(239, 68, 68, 0.3)', 'background': 'rgba(239, 68, 68, 0.05)' }}>
                <div className="action-icon" style={{ 'background': 'rgba(239, 68, 68, 0.1)', 'color': 'var(--status-danger)' }}>
                  <i className="fa-solid fa-bell"></i>
                </div>
                <div style={{ 'flex': '1' }}>
                  <div className="font-medium text-sm text-danger">Create Risk Alert</div>
                  <div className="text-xs text-danger" style={{ 'opacity': '0.8' }}>Flag delay penalty to PM</div>
                </div>
                <i className="fa-solid fa-chevron-right text-danger text-xs"></i>
              </div>

              <div style={{ 'textAlign': 'center', 'marginTop': 'var(--spacing-lg)' }}>
                <span className="text-xs text-muted font-medium"><i className="fa-solid fa-bolt text-accent"
                  style={{ 'marginRight': '4px' }}></i> Powered by DocuPilot Intelligence</span>
              </div>
            </div>


            <div className="card" style={{ 'padding': 'var(--spacing-md)' }}>
              <div className="text-xs font-bold text-muted"
                style={{ 'textTransform': 'uppercase', 'marginBottom': 'var(--spacing-sm)' }}>Project Context</div>
              <div
                style={{ 'display': 'flex', 'gap': 'var(--spacing-sm)', 'alignItems': 'center', 'marginBottom': 'var(--spacing-md)' }}>
                <div
                  style={{ 'width': '32px', 'height': '32px', 'background': 'var(--bg-main)', 'borderRadius': 'var(--radius-sm)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'border': '1px solid var(--border-subtle)' }}>
                  <i className="fa-solid fa-folder text-accent"></i>
                </div>
                <div>
                  <div className="font-medium text-sm">Clinic Web Platform</div>
                  <div className="text-xs text-muted">Project ID: NEX-2024-082</div>
                </div>
              </div>

              <div
                style={{ 'display': 'flex', 'justifyContent': 'space-between', 'borderBottom': '1px solid var(--border-subtle)', 'paddingBottom': '4px', 'marginBottom': '4px' }}>
                <span className="text-xs text-muted">Signatory A</span>
                <span className="text-xs font-medium">HealthConnect Inc.</span>
              </div>
              <div
                style={{ 'display': 'flex', 'justifyContent': 'space-between', 'borderBottom': '1px solid var(--border-subtle)', 'paddingBottom': '4px', 'marginBottom': '4px' }}>
                <span className="text-xs text-muted">Signatory B</span>
                <span className="text-xs font-medium">NexaSoft Solutions</span>
              </div>
              <div style={{ 'display': 'flex', 'justifyContent': 'space-between' }}>
                <span className="text-xs text-muted">Effective Date</span>
                <span className="text-xs font-medium">Oct 24, 2024</span>
              </div>
            </div>

          </div>
        </div>


      </div>
    </>
  );
}
