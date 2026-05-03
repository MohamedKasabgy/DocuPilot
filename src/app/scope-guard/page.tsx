import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Link from 'next/link';

export default function ScopeGuardPage() {
  return (
    <>
      <Header />
      <div className="page-container animate-fade-in">


        <div className="page-header" style={{ 'flexDirection': 'column', 'alignItems': 'flex-start', 'gap': 'var(--spacing-sm)' }}>
          <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase' }}>Projects <i
            className="fa-solid fa-chevron-right" style={{ 'margin': '0 4px', 'fontSize': '8px' }}></i> Alpha Platform v2.0 <i
              className="fa-solid fa-chevron-right" style={{ 'margin': '0 4px', 'fontSize': '8px' }}></i> Scope Guard Analysis</div>
          <div>
            <h1 className="page-title">Scope Guard Analysis</h1>
            <p className="page-subtitle">Real-time contract deviation detection and decision support.</p>
          </div>
        </div>

        <div className="grid grid-cols-2" style={{ 'marginBottom': 'var(--spacing-lg)' }}>


          <div className="card" style={{ 'display': 'flex', 'flexDirection': 'column' }}>
            <div className="flex"
              style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'marginBottom': 'var(--spacing-xl)' }}>
              <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase' }}>Incoming Request</div>
              <div className="text-sm text-muted flex" style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px' }}><i
                className="fa-regular fa-envelope"></i> Email Content</div>
            </div>

            <div
              style={{ 'background': 'rgba(255, 255, 255, 0.02)', 'border': '1px solid rgba(255,255,255,0.05)', 'padding': 'var(--spacing-xl)', 'borderRadius': 'var(--radius-lg)', 'marginBottom': 'var(--spacing-lg)', 'flex': '1', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center' }}>
              <p className="text-xl font-display text-primary" style={{ 'textAlign': 'right', 'lineHeight': '1.8' }} dir="rtl">
                "ممكن تضيفون تطبيق جوال iOS و Android للمنصة؟"
              </p>
            </div>

            <div style={{ 'borderTop': '1px solid var(--border-subtle)', 'paddingTop': 'var(--spacing-md)' }}>
              <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'marginBottom': '8px' }}>English
                Translation</div>
              <p className="text-sm font-medium">"Could you add iOS and Android mobile applications to the platform?"</p>
            </div>
          </div>


          <div className="card" style={{ 'display': 'flex', 'flexDirection': 'column', 'padding': '0' }}>


            <div
              style={{ 'background': 'rgba(239, 68, 68, 0.1)', 'padding': 'var(--spacing-lg)', 'borderBottom': '1px solid rgba(239, 68, 68, 0.2)', 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center' }}>
              <div className="flex" style={{ 'display': 'flex', 'gap': 'var(--spacing-md)', 'alignItems': 'center' }}>
                <div className="list-item-icon"
                  style={{ 'background': 'var(--status-danger)', 'color': 'white', 'width': '40px', 'height': '40px' }}>
                  <i className="fa-solid fa-ban"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-danger">Analysis Result</h3>
                  <div className="text-xs text-muted">Compared against Contract #CON-2024-089</div>
                </div>
              </div>
              <span className="badge badge-danger" style={{ 'fontSize': '0.8rem', 'padding': '6px 12px' }}>OUT OF SCOPE</span>
            </div>

            <div
              style={{ 'padding': 'var(--spacing-lg)', 'flex': '1', 'display': 'flex', 'flexDirection': 'column', 'gap': 'var(--spacing-lg)' }}>


              <div>
                <div className="text-xs text-muted font-bold"
                  style={{ 'textTransform': 'uppercase', 'marginBottom': 'var(--spacing-sm)' }}>Primary Reason</div>
                <div
                  style={{ 'background': 'var(--bg-surface-elevated)', 'border': 'var(--glass-border)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'display': 'flex', 'gap': 'var(--spacing-md)', 'alignItems': 'flex-start' }}>
                  <i className="fa-solid fa-circle-info text-danger text-lg" style={{ 'marginTop': '2px' }}></i>
                  <p className="text-sm">The current contract includes web platform and admin dashboard only. Mobile
                    development for native OS requires separate infrastructure and UI/UX tracks not outlined in the
                    Master Service Agreement.</p>
                </div>
              </div>


              <div className="grid grid-cols-2" style={{ 'gap': 'var(--spacing-md)' }}>
                <div style={{ 'border': 'var(--glass-border)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)' }}>
                  <div className="text-xs text-muted font-bold flex"
                    style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '6px', 'textTransform': 'uppercase', 'marginBottom': 'var(--spacing-sm)' }}>
                    <i className="fa-solid fa-clock-rotate-left text-warning"></i> Timeline</div>
                  <div className="font-bold">High Impact</div>
                  <div className="text-xs text-muted">+12-16 weeks est.</div>
                </div>
                <div style={{ 'border': 'var(--glass-border)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)' }}>
                  <div className="text-xs text-muted font-bold flex"
                    style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '6px', 'textTransform': 'uppercase', 'marginBottom': 'var(--spacing-sm)' }}>
                    <i className="fa-solid fa-money-bill-wave text-accent"></i> Cost</div>
                  <div className="font-bold">Requires Estimate</div>
                  <div className="text-xs text-muted">Not in current budget</div>
                </div>
              </div>


              <div
                style={{ 'background': 'rgba(99, 102, 241, 0.05)', 'border': '1px solid rgba(99, 102, 241, 0.2)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'marginTop': 'auto' }}>
                <div className="flex" style={{ 'display': 'flex', 'gap': 'var(--spacing-md)', 'alignItems': 'center' }}>
                  <div className="list-item-icon"
                    style={{ 'background': 'var(--accent-primary)', 'color': 'white', 'width': '32px', 'height': '32px' }}>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                  </div>
                  <div>
                    <div className="text-xs text-accent font-bold" style={{ 'textTransform': 'uppercase' }}>AI Suggested Action
                    </div>
                    <div className="font-bold">Create Change Request</div>
                  </div>
                </div>
                <button className="btn btn-primary">Execute Action</button>
              </div>

            </div>
          </div>
        </div>


        <div className="card" style={{ 'marginBottom': 'var(--spacing-lg)' }}>
          <div className="flex"
            style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'marginBottom': 'var(--spacing-lg)', 'paddingBottom': 'var(--spacing-md)', 'borderBottom': '1px solid var(--border-subtle)' }}>
            <div className="font-bold flex" style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px' }}><i
              className="fa-regular fa-comment-dots text-accent"></i> Suggested Client Reply</div>
            <button className="btn btn-ghost text-xs"><i className="fa-regular fa-copy"></i> Copy to Clipboard</button>
          </div>
          <div className="text-sm" style={{ 'lineHeight': '1.8', 'color': 'var(--text-secondary)', 'padding': '0 var(--spacing-xl)' }}>
            <p style={{ 'marginBottom': 'var(--spacing-md)' }}>Dear Client,</p>
            <p style={{ 'marginBottom': 'var(--spacing-md)' }}>Thank you for reaching out about the possibility of adding iOS
              and Android mobile applications to the NexaSoft platform. We appreciate the vision for cross-platform
              expansion.</p>
            <p style={{ 'marginBottom': 'var(--spacing-md)' }}>After reviewing the current project scope (Contract
              #CON-2024-089), we confirmed that the existing engagement covers the Web Platform and Administrative
              Dashboard only. Developing native mobile applications is currently considered <strong
                className="text-danger">out of scope</strong>.</p>
            <p style={{ 'marginBottom': 'var(--spacing-md)' }}>However, we would be happy to accommodate this! I have
              initiated a <strong className="text-accent">Change Request</strong>. Our team will provide a formal estimate
              for the additional timeline and cost by end of business Thursday.</p>
            <p>Best regards,<br /><strong>Project Management Team</strong></p>
          </div>
        </div>


        <div className="grid grid-cols-3">
          <div className="card">
            <div className="font-bold flex"
              style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'marginBottom': 'var(--spacing-md)' }}><i
                className="fa-solid fa-file-contract text-accent"></i> Contract Snapshot</div>
            <div className="flex" style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': 'var(--spacing-sm)' }}>
              <span className="text-sm text-muted">Total Budget</span>
              <span className="font-bold">$245,000</span>
            </div>
            <div className="flex" style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': 'var(--spacing-xs)' }}>
              <span className="text-sm text-muted">Consumption</span>
              <span className="font-bold">62%</span>
            </div>
            <div className="progress-container" style={{ 'height': '4px' }}>
              <div className="progress-bar progress-primary" style={{ 'width': '62%' }}></div>
            </div>
          </div>

          <div className="card">
            <div className="font-bold flex"
              style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'marginBottom': 'var(--spacing-md)' }}><i
                className="fa-solid fa-clock-rotate-left text-accent"></i> Similar Requests</div>
            <ul
              style={{ 'listStyleType': 'disc', 'paddingLeft': 'var(--spacing-lg)', 'color': 'var(--text-muted)', 'fontSize': '0.875rem' }}>
              <li style={{ 'marginBottom': '4px' }}>Dark Mode Request <span className="text-success text-xs">(In-Scope)</span>
              </li>
              <li>Export to PDF <span className="text-success text-xs">(In-Scope)</span></li>
            </ul>
          </div>

          <div className="card">
            <div className="font-bold flex"
              style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'marginBottom': 'var(--spacing-md)' }}><i
                className="fa-solid fa-users text-accent"></i> Stakeholder Trust</div>
            <div className="flex"
              style={{ 'display': 'flex', 'alignItems': 'center', 'gap': 'var(--spacing-md)', 'marginTop': 'var(--spacing-lg)' }}>
              <div className="flex" style={{ 'display': 'flex', 'gap': '-8px' }}>
                <div className="avatar" style={{ 'width': '36px', 'height': '36px', 'border': '2px solid var(--bg-surface)', 'zIndex': '3' }}>
                  AD</div>
                <div className="avatar"
                  style={{ 'width': '36px', 'height': '36px', 'border': '2px solid var(--bg-surface)', 'background': 'var(--status-info)', 'zIndex': '2', 'marginLeft': '-8px' }}>
                  MK</div>
              </div>
              <span className="text-sm text-muted font-bold">+4 Approvers</span>
            </div>
          </div>
        </div>



      </div>
    </>
  );
}
