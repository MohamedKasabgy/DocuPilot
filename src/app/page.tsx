import Header from '@/components/layout/Header';
import MetricCard from '@/components/common/MetricCard';
import Card from '@/components/common/Card';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <>
      <Header />
      <div className="page-container animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Operational Overview</h1>
            <p className="page-subtitle">Welcome back, NexaSoft Admin. Here's what needs your attention today.</p>
          </div>
        </div>

        <div className="layout-sidebar-right">
          {/* Left Column */}
          <div className="flex-col flex gap-6">

            {/* Metric Cards */}
            <div className="grid grid-cols-4 gap-4">
              <MetricCard
                title="Active Projects"
                value={12}
                icon="fa-solid fa-chart-line"
                badgeText="+2 this week"
                badgeType="success"
                iconBgColor="rgba(99, 102, 241, 0.1)"
              />
              <MetricCard
                title="Pending Invoices"
                value={8}
                icon="fa-solid fa-file-invoice"
                badgeText="Attention"
                badgeType="warning"
                iconBgColor="rgba(245, 158, 11, 0.1)"
                iconColor="var(--status-warning)"
              />
              <MetricCard
                title="Required Approvals"
                value={5}
                icon="fa-solid fa-clipboard-check"
                badgeText="5 Action Items"
                badgeType="info"
                iconBgColor="rgba(59, 130, 246, 0.1)"
                iconColor="var(--status-info)"
              />
              <MetricCard
                title="High Risks"
                value={3}
                icon="fa-solid fa-triangle-exclamation"
                badgeText="Critical"
                badgeType="danger"
                iconBgColor="rgba(239, 68, 68, 0.1)"
                iconColor="var(--status-danger)"
              />
            </div>

            {/* Priorities */}
            <Card>
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fa-regular fa-calendar-check text-accent mr-2"></i>
                  Today's Priorities
                </h2>
                <Link href="/projects" className="text-sm font-medium">View All Task Queue</Link>
              </div>

              <div className="list-group mt-4">
                <div className="list-item items-center">
                  <div className="notification-dot" style={{ position: 'static', border: 'none', backgroundColor: 'var(--status-warning)' }}></div>
                  <div className="list-item-content">
                    <div className="list-item-title">Invoice from DesignPro Studio needs approval.</div>
                    <div className="list-item-meta">Due in 4 hours • Amount: $12,450.00</div>
                  </div>
                  <Link href="/approvals" className="btn btn-secondary btn-sm">Review</Link>
                </div>

                <div className="list-item items-center">
                  <div className="notification-dot" style={{ position: 'static', border: 'none', backgroundColor: 'var(--status-danger)' }}></div>
                  <div className="list-item-content">
                    <div className="list-item-title">Clinic Booking Platform has a high delay risk.</div>
                    <div className="list-item-meta">Dependency: External API integration pending client credentials.</div>
                  </div>
                  <button className="btn btn-secondary btn-sm">Mitigate</button>
                </div>

                <div className="list-item items-center">
                  <div className="notification-dot" style={{ position: 'static', border: 'none', backgroundColor: 'var(--accent-primary)' }}></div>
                  <div className="list-item-content">
                    <div className="list-item-title">Mobile app request is out of scope and needs change request.</div>
                    <div className="list-item-meta">Detected via Scope Guard AI analysis of SRS vs Email threads.</div>
                  </div>
                  <button className="btn btn-secondary btn-sm">Generate CR</button>
                </div>
              </div>
            </Card>

            {/* Project Health Bar Chart (CSS Mock) */}
            <Card>
              <div className="card-header">
                <h2 className="card-title">Project Health</h2>
                <div className="flex gap-4">
                  <span className="text-xs flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-accent mr-1" style={{ background: 'var(--accent-primary)' }}></span> Progress
                  </span>
                  <span className="text-xs flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: 'var(--bg-surface-elevated)' }}></span> Benchmark
                  </span>
                </div>
              </div>

              <div className="h-48 flex items-end justify-between pt-8 gap-2">
                {/* Bars Mockup */}
                {[
                  { day: 'Mon', p: '80%', b: '60%' },
                  { day: 'Tue', p: '75%', b: '65%' },
                  { day: 'Wed', p: '90%', b: '85%' },
                  { day: 'Thu', p: '80%', b: '75%' },
                  { day: 'Fri', p: '95%', b: '95%' },
                  { day: 'Sat', p: '50%', b: '40%' },
                  { day: 'Sun', p: '55%', b: '45%' },
                ].map((item) => (
                  <div key={item.day} className="w-[12%] relative rounded-t" style={{ height: item.b, background: 'var(--bg-surface-elevated)' }}>
                    <div className="absolute bottom-0 w-full rounded-t" style={{ height: item.p, background: 'var(--accent-primary)' }}></div>
                    <div className="absolute -bottom-6 w-full text-center text-xs text-muted">{item.day}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="flex-col flex gap-6">

            {/* Smart Alerts */}
            <Card style={{ background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%)' }}>
              <div className="card-header">
                <h2 className="card-title"><i className="fa-solid fa-bolt text-accent mr-2"></i> Smart Alerts</h2>
              </div>

              <div className="list-group">
                <Card style={{ padding: 'var(--spacing-md)', background: 'var(--bg-main)' }}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-accent">CONTRACT DRIFT</span>
                    <span className="text-xs text-muted">2m ago</span>
                  </div>
                  <p className="text-sm">Clause 4.2 in 'SRS_v2.pdf' contradicts the original Master Service Agreement regarding liability caps.</p>
                </Card>

                <Card style={{ padding: 'var(--spacing-md)', background: 'var(--bg-main)' }}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-success" style={{ color: 'var(--status-success)' }}>EFFICIENCY TIP</span>
                    <span className="text-xs text-muted">1h ago</span>
                  </div>
                  <p className="text-sm">AI suggests bundling Invoice #884 and #885 for 'Global Logistics' to reduce processing fees.</p>
                </Card>
              </div>

              <Link href="/ask-docupilot" className="btn btn-secondary w-full mt-4 text-center block">
                Launch AI Assistant
              </Link>
            </Card>

            {/* Recent Activity */}
            <Card>
              <div className="card-header">
                <h2 className="card-title"><i className="fa-solid fa-clock-rotate-left text-muted mr-2"></i> Recent Activity</h2>
              </div>

              <div className="list-group mt-4">
                <div className="list-item border-none pb-0">
                  <div className="list-item-icon w-6 h-6 text-[10px]" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                    <i className="fa-solid fa-file-pdf"></i>
                  </div>
                  <div className="list-item-content">
                    <div className="text-sm font-medium">Sarah M. <span className="text-secondary font-normal">uploaded SRS Final</span></div>
                    <div className="text-xs text-muted">Project: Quantum Leap • 45m ago</div>
                  </div>
                </div>

                <div className="list-item border-none pb-0">
                  <div className="list-item-icon w-6 h-6 text-[10px]" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-success)' }}>
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div className="list-item-content">
                    <div className="text-sm font-medium">Contract <a href="#">#4492</a> <span className="text-secondary font-normal">approved</span></div>
                    <div className="text-xs text-muted">Auto-filed to secure cloud vault • 2h ago</div>
                  </div>
                </div>

                <div className="list-item border-none pb-0">
                  <div className="list-item-icon w-6 h-6 text-[10px]" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--status-info)' }}>
                    <i className="fa-solid fa-user-plus"></i>
                  </div>
                  <div className="list-item-content">
                    <div className="text-sm font-medium">James Wilson <span className="text-secondary font-normal">joined the hub</span></div>
                    <div className="text-xs text-muted">Access level: Project Manager • 5h ago</div>
                  </div>
                </div>
              </div>

              <button className="btn btn-ghost w-full mt-6">
                View Full Audit Log
              </button>
            </Card>

          </div>
        </div>
      </div>
    </>
  );
}
