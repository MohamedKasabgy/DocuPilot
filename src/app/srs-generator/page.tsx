import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Link from 'next/link';

export default function SRSGeneratorPage() {
  return (
    <>
      <Header />
      <div className="page-container animate-fade-in">


        <div className="page-header" style={{ 'justifyContent': 'space-between', 'alignItems': 'flex-end' }}>
          <div>
            <div className="text-xs font-bold text-accent"
              style={{ 'textTransform': 'uppercase', 'letterSpacing': '2px', 'marginBottom': '4px' }}>AI Laboratory</div>
            <h1 className="page-title">Smart SRS Generator</h1>
            <p className="page-subtitle">Transform raw client requests into professional Software Requirements
              Specifications.</p>
          </div>
          <div className="flex" style={{ 'display': 'flex', 'gap': 'var(--spacing-md)' }}>
            <button className="btn btn-secondary">Save Draft</button>
            <button className="btn btn-primary">Export PDF</button>
          </div>
        </div>


        <div className="card" style={{ 'marginBottom': 'var(--spacing-lg)' }}>
          <div className="text-xs text-muted font-bold"
            style={{ 'textTransform': 'uppercase', 'marginBottom': 'var(--spacing-md)' }}>Initial Client Request</div>
          <div
            style={{ 'background': 'rgba(255, 255, 255, 0.02)', 'border': '1px solid rgba(255,255,255,0.05)', 'padding': 'var(--spacing-xl)', 'borderRadius': 'var(--radius-lg)', 'marginBottom': 'var(--spacing-lg)', 'minHeight': '120px', 'position': 'relative', 'overflow': 'hidden' }}>
            <div
              style={{ 'position': 'absolute', 'right': '20px', 'top': '-20px', 'fontSize': '10rem', 'opacity': '0.02', 'color': 'var(--accent-primary)', 'pointerEvents': 'none' }}>
              <i className="fa-solid fa-wand-magic-sparkles"></i></div>
            <p className="text-lg font-medium text-primary" style={{ 'textAlign': 'right', 'lineHeight': '1.8' }} dir="rtl">
              "نحتاج نظام حجوزات للعيادات يشمل موقع للحجز، لوحة تحكم للإدارة، إدارة المواعيد، إشعارات للمراجعين، وتقارير
              بسيطة للإدارة."
            </p>
          </div>
          <div className="flex" style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center' }}>
            <div className="text-xs text-accent flex" style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '6px' }}><i
              className="fa-solid fa-language"></i> Arabic detected</div>
            <button className="btn btn-primary"><i className="fa-solid fa-wand-magic-sparkles"></i> Generate SRS</button>
          </div>
        </div>


        <div className="grid layout-sidebar-right"
          style={{ 'gap': 'var(--spacing-lg)', 'marginBottom': 'var(--spacing-lg)', 'gridTemplateColumns': '1fr 400px' }}>
          <div className="card" style={{ 'display': 'flex', 'flexDirection': 'column' }}>
            <div className="font-bold flex"
              style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'marginBottom': 'var(--spacing-lg)' }}><i
                className="fa-regular fa-file-lines text-accent"></i> Project Brief</div>
            <p className="text-sm"
              style={{ 'lineHeight': '1.8', 'color': 'var(--text-secondary)', 'marginBottom': 'var(--spacing-xl)' }}>
              The project aims to develop a comprehensive <strong className="text-accent">Clinic Reservation
                Ecosystem</strong>. It focuses on bridging the gap between patients and clinic administrators through a
              digital-first approach. The core objective is to automate the appointment lifecycle—from initial booking
              to post-consultation reporting—minimizing manual intervention and optimizing clinic resource allocation.
            </p>
            <div className="grid grid-cols-3" style={{ 'gap': 'var(--spacing-md)', 'marginTop': 'auto' }}>
              <div
                style={{ 'background': 'var(--bg-surface-elevated)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'border': 'var(--glass-border)' }}>
                <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'marginBottom': '4px' }}>
                  Complexity</div>
                <div className="text-sm font-bold">Moderate / Tier 2</div>
              </div>
              <div
                style={{ 'background': 'var(--bg-surface-elevated)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'border': 'var(--glass-border)' }}>
                <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'marginBottom': '4px' }}>
                  Infrastructure</div>
                <div className="text-sm font-bold">Cloud-Native SaaS</div>
              </div>
              <div
                style={{ 'background': 'var(--bg-surface-elevated)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'border': 'var(--glass-border)' }}>
                <div className="text-xs text-muted font-bold" style={{ 'textTransform': 'uppercase', 'marginBottom': '4px' }}>
                  Industry</div>
                <div className="text-sm font-bold">Healthcare / MedTech</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="font-bold flex"
              style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'marginBottom': 'var(--spacing-lg)' }}><i
                className="fa-solid fa-users text-warning"></i> User Roles</div>
            <div className="list-group">
              <div
                style={{ 'background': 'var(--bg-surface-elevated)', 'border': 'var(--glass-border)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'display': 'flex', 'gap': 'var(--spacing-md)', 'alignItems': 'center' }}>
                <div style={{ 'color': 'var(--status-info)' }}><i className="fa-regular fa-user"></i></div>
                <div>
                  <div className="font-bold text-sm">Patient</div>
                  <div className="text-xs text-muted">External users booking appointments and receiving notifications.</div>
                </div>
              </div>
              <div
                style={{ 'background': 'var(--bg-surface-elevated)', 'border': 'var(--glass-border)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'display': 'flex', 'gap': 'var(--spacing-md)', 'alignItems': 'center' }}>
                <div style={{ 'color': 'var(--accent-primary)' }}><i className="fa-solid fa-shield-halved"></i></div>
                <div>
                  <div className="font-bold text-sm">Admin</div>
                  <div className="text-xs text-muted">Global system management, clinic settings, and staff access.</div>
                </div>
              </div>
              <div
                style={{ 'background': 'var(--bg-surface-elevated)', 'border': 'var(--glass-border)', 'padding': 'var(--spacing-md)', 'borderRadius': 'var(--radius-md)', 'display': 'flex', 'gap': 'var(--spacing-md)', 'alignItems': 'center' }}>
                <div style={{ 'color': 'var(--status-success)' }}><i className="fa-solid fa-briefcase-medical"></i></div>
                <div>
                  <div className="font-bold text-sm">Doctor</div>
                  <div className="text-xs text-muted">Schedule viewing and basic session management (internal).</div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-2" style={{ 'gap': 'var(--spacing-lg)', 'marginBottom': 'var(--spacing-lg)' }}>
          <div className="card">
            <div className="font-bold flex"
              style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'marginBottom': 'var(--spacing-lg)' }}><i
                className="fa-regular fa-square-check text-success"></i> Main Features</div>
            <div className="list-group">
              <div className="flex"
                style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'padding': '12px 16px', 'border': '1px solid rgba(16, 185, 129, 0.2)', 'background': 'rgba(16, 185, 129, 0.05)', 'borderRadius': 'var(--radius-md)' }}>
                <span className="text-sm font-bold">BOOKING PORTAL</span>
                <i className="fa-solid fa-check-circle text-success"></i>
              </div>
              <div className="flex"
                style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'padding': '12px 16px', 'border': '1px solid rgba(16, 185, 129, 0.2)', 'background': 'rgba(16, 185, 129, 0.05)', 'borderRadius': 'var(--radius-md)' }}>
                <span className="text-sm font-bold">ADMIN DASHBOARD</span>
                <i className="fa-solid fa-check-circle text-success"></i>
              </div>
              <div className="flex"
                style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'padding': '12px 16px', 'border': '1px solid rgba(16, 185, 129, 0.2)', 'background': 'rgba(16, 185, 129, 0.05)', 'borderRadius': 'var(--radius-md)' }}>
                <span className="text-sm font-bold">SCHEDULE MANAGEMENT</span>
                <i className="fa-solid fa-check-circle text-success"></i>
              </div>
              <div className="flex"
                style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'padding': '12px 16px', 'border': '1px solid rgba(16, 185, 129, 0.2)', 'background': 'rgba(16, 185, 129, 0.05)', 'borderRadius': 'var(--radius-md)' }}>
                <span className="text-sm font-bold">NOTIFICATION ENGINE</span>
                <i className="fa-solid fa-check-circle text-success"></i>
              </div>
              <div className="flex"
                style={{ 'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'padding': '12px 16px', 'border': '1px solid rgba(16, 185, 129, 0.2)', 'background': 'rgba(16, 185, 129, 0.05)', 'borderRadius': 'var(--radius-md)' }}>
                <span className="text-sm font-bold">BI REPORTING</span>
                <i className="fa-solid fa-check-circle text-success"></i>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="font-bold flex"
              style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'marginBottom': 'var(--spacing-lg)' }}><i
                className="fa-solid fa-list-check text-info"></i> Functional Requirements</div>
            <div className="list-group" style={{ 'gap': 'var(--spacing-lg)' }}>
              <div className="flex" style={{ 'display': 'flex', 'gap': 'var(--spacing-md)', 'alignItems': 'flex-start' }}>
                <div className="text-xs font-bold text-muted" style={{ 'width': '40px', 'marginTop': '2px' }}>FR-01</div>
                <div>
                  <div className="text-sm font-bold">Real-time Slot Verification</div>
                  <div className="text-xs text-muted" style={{ 'fontStyle': 'italic', 'marginTop': '4px' }}>The system must ensure no
                    double-bookings occur by locking slot selection during checkout.</div>
                </div>
              </div>
              <div className="flex" style={{ 'display': 'flex', 'gap': 'var(--spacing-md)', 'alignItems': 'flex-start' }}>
                <div className="text-xs font-bold text-muted" style={{ 'width': '40px', 'marginTop': '2px' }}>FR-02</div>
                <div>
                  <div className="text-sm font-bold">Automated Reminders (SMS/Email)</div>
                  <div className="text-xs text-muted" style={{ 'fontStyle': 'italic', 'marginTop': '4px' }}>Triggering notifications
                    24 hours and 1 hour before scheduled appointments.</div>
                </div>
              </div>
              <div className="flex" style={{ 'display': 'flex', 'gap': 'var(--spacing-md)', 'alignItems': 'flex-start' }}>
                <div className="text-xs font-bold text-muted" style={{ 'width': '40px', 'marginTop': '2px' }}>FR-03</div>
                <div>
                  <div className="text-sm font-bold">Administrative Overrides</div>
                  <div className="text-xs text-muted" style={{ 'fontStyle': 'italic', 'marginTop': '4px' }}>Ability for Admins to
                    manually move, cancel, or block slots for emergency clinic needs.</div>
                </div>
              </div>
              <div className="flex" style={{ 'display': 'flex', 'gap': 'var(--spacing-md)', 'alignItems': 'flex-start' }}>
                <div className="text-xs font-bold text-muted" style={{ 'width': '40px', 'marginTop': '2px' }}>FR-04</div>
                <div>
                  <div className="text-sm font-bold">Performance Analytics</div>
                  <div className="text-xs text-muted" style={{ 'fontStyle': 'italic', 'marginTop': '4px' }}>Generate weekly reports
                    on booking volume, cancellation rates, and peak hours.</div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-2" style={{ 'gap': 'var(--spacing-lg)', 'marginBottom': 'var(--spacing-lg)' }}>
          <div className="card" style={{ 'display': 'flex', 'flexDirection': 'column' }}>
            <div className="font-bold flex"
              style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'marginBottom': 'var(--spacing-md)' }}><i
                className="fa-solid fa-question text-accent"
                style={{ 'width': '20px', 'height': '20px', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'background': 'rgba(99, 102, 241, 0.1)', 'borderRadius': '4px' }}></i>
              AI Identified Gaps</div>
            <p className="text-sm text-muted" style={{ 'marginBottom': 'var(--spacing-lg)' }}>Missing information required for a
              high-fidelity SRS:</p>

            <div className="list-group" style={{ 'marginBottom': 'var(--spacing-xl)' }}>
              <div className="flex" style={{ 'display': 'flex', 'gap': 'var(--spacing-sm)', 'alignItems': 'flex-start' }}>
                <i className="fa-regular fa-circle-question text-accent" style={{ 'marginTop': '4px' }}></i>
                <div className="text-sm">Do we need to support <strong>multiple clinic locations</strong> within a single
                  dashboard?</div>
              </div>
              <div className="flex" style={{ 'display': 'flex', 'gap': 'var(--spacing-sm)', 'alignItems': 'flex-start' }}>
                <i className="fa-regular fa-circle-question text-accent" style={{ 'marginTop': '4px' }}></i>
                <div className="text-sm">Will there be an online payment integration at the time of booking?</div>
              </div>
              <div className="flex" style={{ 'display': 'flex', 'gap': 'var(--spacing-sm)', 'alignItems': 'flex-start' }}>
                <i className="fa-regular fa-circle-question text-accent" style={{ 'marginTop': '4px' }}></i>
                <div className="text-sm">What specific types of reports are required (CSV, PDF, or Live Dashboard)?</div>
              </div>
            </div>

            <button className="btn btn-secondary"
              style={{ 'width': '100%', 'marginTop': 'auto', 'border': '1px solid var(--border-strong)' }}>REQUEST CLARIFICATIONS FROM
              CLIENT</button>
          </div>

          <div className="card">
            <div className="font-bold flex"
              style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'marginBottom': 'var(--spacing-lg)' }}><i
                className="fa-solid fa-rocket text-accent"></i> MVP Scope Definition</div>

            <div
              style={{ 'position': 'relative', 'paddingLeft': '20px', 'borderLeft': '2px solid var(--border-subtle)', 'display': 'flex', 'flexDirection': 'column', 'gap': 'var(--spacing-xl)', 'marginLeft': '8px', 'marginTop': 'var(--spacing-md)' }}>
              <div style={{ 'position': 'relative' }}>
                <div
                  style={{ 'position': 'absolute', 'left': '-25px', 'top': '2px', 'width': '8px', 'height': '8px', 'borderRadius': '50%', 'background': 'var(--accent-primary)', 'boxShadow': '0 0 8px var(--accent-primary-glow)' }}>
                </div>
                <div className="text-sm font-bold" style={{ 'marginBottom': '4px' }}>Phase 1: Foundation</div>
                <div className="text-xs text-muted">Booking website with basic slot management and Email notifications.
                </div>
              </div>
              <div style={{ 'position': 'relative' }}>
                <div
                  style={{ 'position': 'absolute', 'left': '-25px', 'top': '2px', 'width': '8px', 'height': '8px', 'borderRadius': '50%', 'background': 'var(--border-strong)' }}>
                </div>
                <div className="text-sm font-bold" style={{ 'marginBottom': '4px' }}>Phase 2: Management Hub</div>
                <div className="text-xs text-muted">Admin dashboard for multi-doctor schedules and basic reporting.</div>
              </div>
              <div style={{ 'position': 'relative' }}>
                <div
                  style={{ 'position': 'absolute', 'left': '-25px', 'top': '2px', 'width': '8px', 'height': '8px', 'borderRadius': '50%', 'background': 'var(--border-strong)' }}>
                </div>
                <div className="text-sm font-bold" style={{ 'marginBottom': '4px' }}>Phase 3: Optimization</div>
                <div className="text-xs text-muted">SMS Integration, advanced BI analytics, and patient records.</div>
              </div>
            </div>
          </div>
        </div>


        <div className="card"
          style={{ 'background': 'rgba(79, 70, 229, 0.05)', 'border': '1px solid rgba(79, 70, 229, 0.2)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'padding': 'var(--spacing-xl)' }}>
          <div>
            <h2 className="text-2xl font-display font-bold" style={{ 'marginBottom': '8px', 'color': 'var(--text-primary)' }}>Ready to finalize?</h2>
            <p className="text-sm text-muted">The AI has analyzed your request and structured the initial scope.<br />You can
              now push this to the Contracts module or refine the requirements further.</p>
          </div>
          <div style={{ 'fontSize': '4rem', 'opacity': '0.1', 'color': 'var(--accent-primary)', 'pointerEvents': 'none' }}>
            <i className="fa-solid fa-chart-network"></i>
          </div>
        </div>



      </div>
    </>
  );
}
