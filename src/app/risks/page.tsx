import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Link from 'next/link';

export default function RisksPage() {
  return (
    <>
      <Header />
      <div className="page-container animate-fade-in">


        <div className="page-header" style={{ 'justifyContent': 'space-between', 'alignItems': 'flex-start' }}>
          <div style={{ 'maxWidth': '60%' }}>
            <h1 className="page-title">Operational Risk Overview</h1>
            <p className="page-subtitle">Real-time exposure monitoring across active projects. Analyze potential slippage
              and scope threats before they impact delivery.</p>
          </div>
          <div className="flex"
            style={{ 'display': 'flex', 'gap': 'var(--spacing-sm)', 'background': 'var(--bg-surface-elevated)', 'padding': 'var(--spacing-xs)', 'borderRadius': 'var(--radius-md)', 'border': 'var(--glass-border)' }}>
            <button className="btn btn-ghost"
              style={{ 'background': 'var(--bg-surface-glass)', 'color': 'var(--text-primary)' }}>All</button>
            <button className="btn btn-ghost">High</button>
            <button className="btn btn-ghost">Medium</button>
            <button className="btn btn-ghost">Low</button>
          </div>
        </div>

        <div className="grid grid-cols-2" style={{ 'marginBottom': 'var(--spacing-xl)' }}>


          <div className="card" style={{ 'display': 'flex', 'flexDirection': 'column' }}>
            <div className="flex"
              style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'flex-start', 'marginBottom': 'var(--spacing-lg)' }}>
              <div className="flex" style={{ 'display': 'flex', 'gap': 'var(--spacing-md)', 'alignItems': 'flex-start' }}>
                <div className="list-item-icon"
                  style={{ 'background': 'rgba(239, 68, 68, 0.1)', 'color': 'var(--status-danger)', 'width': '48px', 'height': '48px', 'fontSize': '1.5rem' }}>
                  <i className="fa-solid fa-circle-exclamation"></i>
                </div>
                <div>
                  <span className="badge badge-danger" style={{ 'marginBottom': 'var(--spacing-xs)' }}>HIGH SEVERITY</span>
                  <h2 className="text-xl font-bold">Late delivery penalty (Clinic Booking Platform)</h2>
                </div>
              </div>
              <div style={{ 'textAlign': 'right' }}>
                <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase' }}>Exposure</div>
                <div className="text-xl font-bold text-danger">Penalty 10%</div>
              </div>
            </div>

            <div className="grid grid-cols-3"
              style={{ 'gap': 'var(--spacing-md)', 'marginBottom': 'var(--spacing-xl)', 'paddingBottom': 'var(--spacing-lg)', 'borderBottom': '1px solid var(--border-subtle)' }}>
              <div>
                <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'marginBottom': '4px' }}>Source
                </div>
                <div className="text-sm flex" style={{ 'display': 'flex', 'gap': '8px', 'alignItems': 'center' }}><i
                  className="fa-solid fa-clock-rotate-left"></i> Contract Milestone Breach</div>
              </div>
              <div>
                <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'marginBottom': '4px' }}>Impact
                </div>
                <div className="text-sm">Immediate revenue reduction on Q4 projected earnings.</div>
              </div>
              <div>
                <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'marginBottom': '4px' }}>Related
                  Project</div>
                <div className="text-sm text-accent flex"
                  style={{ 'display': 'flex', 'gap': '8px', 'alignItems': 'center', 'cursor': 'pointer' }}><i
                    className="fa-solid fa-briefcase-medical"></i> Clinic Booking Platform</div>
              </div>
            </div>

            <div className="flex"
              style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'background': 'rgba(99, 102, 241, 0.05)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'border': '1px solid rgba(99, 102, 241, 0.1)' }}>
              <div className="flex" style={{ 'display': 'flex', 'gap': 'var(--spacing-sm)', 'alignItems': 'center' }}>
                <i className="fa-regular fa-lightbulb text-accent text-lg"></i>
                <div className="text-sm"><strong>Suggested Action:</strong> Trigger Force Majeure clause review or initiate
                  stakeholder re-negotiation.</div>
              </div>
              <button className="btn btn-primary" style={{ 'whiteSpace': 'nowrap' }}>Resolve Now <i
                className="fa-solid fa-arrow-right"></i></button>
            </div>
          </div>


          <div className="card" style={{ 'display': 'flex', 'flexDirection': 'column' }}>
            <div className="flex"
              style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'flex-start', 'marginBottom': 'var(--spacing-lg)' }}>
              <div>
                <span className="badge badge-danger" style={{ 'marginBottom': 'var(--spacing-xs)' }}>HIGH SEVERITY</span>
                <h2 className="text-xl font-bold">Out-of-scope mobile app request</h2>
              </div>
              <i className="fa-solid fa-triangle-exclamation text-danger text-2xl"></i>
            </div>

            <p className="text-muted text-sm" style={{ 'marginBottom': 'var(--spacing-lg)' }}>Potential scope creep identified in
              recent client communication regarding cross-platform push notifications.</p>

            <div
              style={{ 'background': 'var(--bg-surface-elevated)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'border': 'var(--glass-border)', 'marginBottom': 'var(--spacing-lg)' }}>
              <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'marginBottom': '4px' }}>Impact
              </div>
              <div className="text-sm font-medium">Estimated 80 extra dev hours not currently in SOW.</div>
            </div>

            <div className="flex"
              style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'marginTop': 'auto' }}>
              <div>
                <span className="text-xs text-muted font-bold"
                  style={{ 'textTransform': 'uppercase', 'marginRight': '8px' }}>Project:</span>
                <span className="text-sm font-bold">OMNIMOBILE</span>
              </div>
              <div className="flex" style={{ 'display': 'flex', 'gap': 'var(--spacing-md)', 'alignItems': 'center' }}>
                <a href="#" className="text-sm font-bold">View SOW</a>
                <button className="btn btn-secondary" style={{ 'background': 'rgba(255, 255, 255, 0.05)' }}>Flag for
                  Billing</button>
              </div>
            </div>
          </div>


          <div className="card" style={{ 'display': 'flex', 'flexDirection': 'column' }}>
            <div className="flex"
              style={{ 'display': 'flex', 'alignItems': 'flex-start', 'gap': 'var(--spacing-md)', 'marginBottom': 'var(--spacing-lg)' }}>
              <div className="list-item-icon"
                style={{ 'background': 'rgba(245, 158, 11, 0.1)', 'color': 'var(--status-warning)', 'width': '48px', 'height': '48px', 'fontSize': '1.25rem' }}>
                <i className="fa-solid fa-file-invoice-dollar"></i>
              </div>
              <div style={{ 'flex': '1' }}>
                <span className="badge badge-warning" style={{ 'marginBottom': 'var(--spacing-xs)' }}>MEDIUM SEVERITY</span>
                <h2 className="text-lg font-bold">Invoice pending approval</h2>
              </div>
            </div>

            <div className="flex" style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': 'var(--spacing-md)' }}>
              <div>
                <div className="text-xs text-muted font-bold">Related Project</div>
                <div className="font-bold">DesignPro Studio Rebrand</div>
              </div>
              <div style={{ 'textAlign': 'right' }}>
                <div className="text-xs text-muted font-bold">Source</div>
                <div className="font-bold">Finance Portal</div>
              </div>
            </div>

            <p className="text-muted text-sm font-italic" style={{ 'fontStyle': 'italic', 'marginBottom': 'var(--spacing-xl)' }}>
              "Approval delayed due to missing tax ID on the primary vendor profile. Payment cycle at risk."</p>

            <div className="flex" style={{ 'display': 'flex', 'gap': 'var(--spacing-md)', 'marginTop': 'auto' }}>
              <button className="btn btn-secondary" style={{ 'flex': '1' }}>Remind Client</button>
              <button className="btn"
                style={{ 'flex': '1', 'background': 'rgba(245, 158, 11, 0.1)', 'color': 'var(--status-warning)', 'border': '1px solid rgba(245, 158, 11, 0.3)' }}>Update
                Info</button>
            </div>
          </div>


          <div className="card" style={{ 'display': 'flex', 'flexDirection': 'column' }}>
            <div className="flex"
              style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'flex-start', 'marginBottom': 'var(--spacing-lg)' }}>
              <div>
                <span className="badge badge-warning" style={{ 'marginBottom': 'var(--spacing-xs)' }}>MEDIUM SEVERITY</span>
                <h2 className="text-lg font-bold">Missing client confirmation on API docs</h2>
              </div>
              <i className="fa-solid fa-clipboard-question text-warning text-2xl"></i>
            </div>

            <div className="grid grid-cols-2" style={{ 'gap': 'var(--spacing-md)', 'marginBottom': 'var(--spacing-xl)' }}>
              <div
                style={{ 'background': 'rgba(16, 185, 129, 0.05)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'border': '1px solid rgba(16, 185, 129, 0.1)' }}>
                <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'marginBottom': '4px' }}>
                  Suggested Action</div>
                <div className="text-sm">Hold sprint kickoff until sign-off is secured via DocuPilot.</div>
              </div>
              <div
                style={{ 'background': 'var(--bg-surface-elevated)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'border': 'var(--glass-border)' }}>
                <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'marginBottom': '4px' }}>Project
                </div>
                <div className="text-sm">Legacy Integration v2</div>
              </div>
            </div>

            <div className="flex"
              style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'marginTop': 'auto' }}>
              <div className="flex" style={{ 'display': 'flex', 'gap': '-8px' }}>
                <div className="avatar"
                  style={{ 'width': '28px', 'height': '28px', 'fontSize': '0.7rem', 'border': '2px solid var(--bg-surface)', 'zIndex': '3' }}>
                  JS</div>
                <div className="avatar"
                  style={{ 'width': '28px', 'height': '28px', 'fontSize': '0.7rem', 'border': '2px solid var(--bg-surface)', 'background': 'var(--status-info)', 'zIndex': '2', 'marginLeft': '-8px' }}>
                  MK</div>
                <div className="avatar"
                  style={{ 'width': '28px', 'height': '28px', 'fontSize': '0.7rem', 'border': '2px solid var(--bg-surface)', 'background': 'var(--bg-surface-elevated)', 'color': 'var(--text-muted)', 'zIndex': '1', 'marginLeft': '-8px' }}>
                  +3</div>
              </div>
              <a href="#" className="text-sm font-bold flex" style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '4px' }}>Send
                Reminder <i className="fa-solid fa-paper-plane"></i></a>
            </div>
          </div>

        </div>


        <div className="grid grid-cols-4">
          <div className="card stat-card">
            <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase' }}>Total Risk Items</div>
            <div className="stat-value" style={{ 'fontSize': '3rem' }}>24</div>
          </div>
          <div className="card stat-card" style={{ 'borderLeft': '2px solid var(--status-danger)' }}>
            <div className="text-xs text-danger font-bold" style={{ 'textTransform': 'uppercase' }}>Critical (High)</div>
            <div className="stat-value text-danger" style={{ 'fontSize': '3rem' }}>02</div>
          </div>
          <div className="card stat-card" style={{ 'borderLeft': '2px solid var(--status-warning)' }}>
            <div className="text-xs text-warning font-bold" style={{ 'textTransform': 'uppercase' }}>Attention (Mid)</div>
            <div className="stat-value text-warning" style={{ 'fontSize': '3rem' }}>14</div>
          </div>
          <div className="card stat-card" style={{ 'borderLeft': '2px solid var(--status-success)' }}>
            <div className="text-xs text-success font-bold" style={{ 'textTransform': 'uppercase' }}>Mitigated Today</div>
            <div className="stat-value text-success" style={{ 'fontSize': '3rem' }}>08</div>
          </div>
        </div>



      </div>
    </>
  );
}
