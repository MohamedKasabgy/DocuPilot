import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Link from 'next/link';

export default function ApprovalsPage() {
  return (
    <>
      <Header />
      <div className="page-container animate-fade-in">


        <div className="page-header">
          <div style={{ 'fontSize': '0.875rem', 'color': 'var(--text-secondary)', 'marginBottom': '8px' }}>
            <a href="#" style={{ 'color': 'var(--text-muted)' }}>Approvals</a> / <a href="#"
              style={{ 'color': 'var(--text-muted)' }}>Invoice Review</a>
          </div>
          <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'width': '100%' }}>
            <h1 className="page-title text-display">Invoice Review: INV-2026-042</h1>
            <span className="badge badge-warning" style={{ 'fontSize': '0.875rem', 'padding': '0.5rem 1rem' }}>NEEDS APPROVAL</span>
          </div>
        </div>

        <div className="layout-sidebar-right" style={{ 'gridTemplateColumns': '1fr 400px' }}>


          <div className="flex-col"
            style={{ 'background': 'var(--bg-main)', 'padding': 'var(--spacing-xl)', 'borderRadius': 'var(--radius-lg)', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'flex-start', 'overflowY': 'auto' }}>

            <div style={{ 'width': '100%', 'maxWidth': '700px', 'position': 'relative' }}>
              <div
                style={{ 'position': 'absolute', 'top': '-16px', 'left': '0', 'background': 'var(--bg-surface-elevated)', 'color': 'var(--text-secondary)', 'padding': '4px 12px', 'borderRadius': '16px', 'fontSize': '0.75rem', 'display': 'flex', 'alignItems': 'center', 'gap': '6px', 'boxShadow': 'var(--shadow-sm)' }}>
                <i className="fa-regular fa-eye"></i> PREVIEW MODE
              </div>


              <div className="document-preview">
                <div className="invoice-header">
                  <div>
                    <h2 style={{ 'fontSize': '2rem', 'color': '#111827', 'marginBottom': '8px' }}>DesignPro Studio</h2>
                    <div style={{ 'color': '#6B7280', 'fontSize': '0.875rem', 'lineHeight': '1.6' }}>
                      44 Creative Ave, Silicon District<br />
                      Riyadh, Saudi Arabia
                    </div>
                  </div>
                  <div style={{ 'textAlign': 'right' }}>
                    <div
                      style={{ 'color': '#6B7280', 'fontWeight': '600', 'textTransform': 'uppercase', 'fontSize': '0.875rem', 'letterSpacing': '1px' }}>
                      Invoice</div>
                    <div
                      style={{ 'fontSize': '1.5rem', 'color': 'var(--accent-primary)', 'fontWeight': '700', 'fontFamily': 'var(--font-display)' }}>
                      #65442</div>
                  </div>
                </div>

                <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': 'var(--spacing-2xl)' }}>
                  <div>
                    <div
                      style={{ 'color': '#6B7280', 'fontSize': '0.75rem', 'textTransform': 'uppercase', 'fontWeight': '600', 'marginBottom': '4px' }}>
                      Bill To</div>
                    <div style={{ 'fontWeight': '600', 'color': '#111827' }}>NexaSoft Operations</div>
                  </div>
                  <div style={{ 'textAlign': 'right' }}>
                    <div
                      style={{ 'color': '#6B7280', 'fontSize': '0.75rem', 'textTransform': 'uppercase', 'fontWeight': '600', 'marginBottom': '4px' }}>
                      Issue Date</div>
                    <div style={{ 'fontWeight': '600', 'color': '#111827' }}>May 01, 2026</div>
                  </div>
                </div>

                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th style={{ 'textAlign': 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div style={{ 'fontWeight': '600', 'color': '#111827' }}>UI Design - Milestone 2</div>
                        <div style={{ 'fontSize': '0.75rem', 'color': '#6B7280', 'fontStyle': 'italic' }}>Clinic Booking Platform -
                          Mobile App</div>
                      </td>
                      <td style={{ 'textAlign': 'right', 'fontWeight': '600' }}>6,500.00 SAR</td>
                    </tr>
                  </tbody>
                </table>

                <div
                  style={{ 'marginTop': '150px', 'borderTop': '2px solid #111827', 'paddingTop': 'var(--spacing-md)', 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'flex-end' }}>
                  <div style={{ 'fontSize': '0.875rem', 'color': '#6B7280' }}>Payment Term: Net 15</div>
                  <div style={{ 'textAlign': 'right' }}>
                    <div style={{ 'fontSize': '0.75rem', 'textTransform': 'uppercase', 'color': '#6B7280', 'fontWeight': '600' }}>Total
                      Balance Due</div>
                    <div style={{ 'fontSize': '2rem', 'fontWeight': '800', 'color': '#111827', 'fontFamily': 'var(--font-display)' }}>
                      6,500 SAR</div>
                  </div>
                </div>
              </div>
            </div>

          </div>


          <div className="flex-col" style={{ 'display': 'flex', 'flexDirection': 'column', 'gap': 'var(--spacing-xl)' }}>


            <div className="card">
              <div className="card-header"
                style={{ 'borderBottom': '1px solid var(--border-subtle)', 'paddingBottom': 'var(--spacing-md)' }}>
                <h2 className="card-title"><i className="fa-solid fa-wand-magic-sparkles text-accent"
                  style={{ 'marginRight': '8px' }}></i> Extracted Data</h2>
              </div>

              <div style={{ 'paddingTop': 'var(--spacing-md)' }}>
                <div style={{ 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': 'var(--spacing-md)' }}>
                  <div>
                    <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase' }}>Vendor</div>
                    <div className="font-medium text-lg">DesignPro Studio</div>
                  </div>
                  <div style={{ 'textAlign': 'right' }}>
                    <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase' }}>Service</div>
                    <div className="font-medium">UI Design</div>
                  </div>
                </div>

                <div
                  style={{ 'background': 'var(--bg-main)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'border': '1px solid var(--border-subtle)', 'marginBottom': 'var(--spacing-md)' }}>
                  <div>
                    <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase' }}>Amount</div>
                    <div className="text-xl font-bold text-accent">6,500 SAR</div>
                  </div>
                  <div style={{ 'textAlign': 'right' }}>
                    <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase' }}>Due Date</div>
                    <div className="font-medium">15 May 2026</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'marginBottom': '4px' }}>
                    Related Project</div>
                  <div style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px' }}>
                    <i className="fa-solid fa-link text-muted"></i>
                    <span className="font-medium">Clinic Booking Platform</span>
                  </div>
                </div>
              </div>
            </div>


            <div className="card"
              style={{ 'background': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)', 'borderColor': 'rgba(59, 130, 246, 0.3)' }}>
              <div style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'marginBottom': 'var(--spacing-md)' }}>
                <i className="fa-solid fa-microchip text-info" style={{ 'color': 'var(--status-info)' }}></i>
                <span className="text-xs font-bold"
                  style={{ 'textTransform': 'uppercase', 'letterSpacing': '1px', 'color': 'var(--status-info)' }}>AI Reasoning</span>
              </div>
              <p className="text-sm" style={{ 'lineHeight': '1.6' }}>
                Amount is above the internal approval limit of 5,000 SAR. Verified vendor details against project
                contract #CP-2026-88.
              </p>
              <i className="fa-solid fa-brain"
                style={{ 'position': 'absolute', 'top': '10px', 'right': '10px', 'fontSize': '4rem', 'opacity': '0.05', 'color': 'var(--status-info)' }}></i>
            </div>


            <div className="card" style={{ 'position': 'sticky', 'top': '80px' }}>
              <div className="text-xs text-muted font-bold"
                style={{ 'textTransform': 'uppercase', 'marginBottom': 'var(--spacing-md)' }}>Required Action</div>

              <button className="btn btn-approve btn" style={{ 'marginBottom': 'var(--spacing-md)' }}>
                <i className="fa-solid fa-check-circle"></i> Approve
              </button>

              <div style={{ 'display': 'flex', 'gap': 'var(--spacing-md)' }}>
                <button className="btn btn-secondary" style={{ 'flex': '1' }}><i className="fa-solid fa-clock-rotate-left"></i> Needs
                  Review</button>
                <button className="btn btn-danger" style={{ 'flex': '1' }}><i className="fa-solid fa-circle-xmark"></i> Reject</button>
              </div>
            </div>

          </div>
        </div>


      </div>
    </>
  );
}
