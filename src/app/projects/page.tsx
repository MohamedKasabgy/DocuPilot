import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <>
      <Header>
        <div className="text-sm text-secondary">
          <Link href="/projects" className="text-muted">Projects</Link> /
          <span className="text-primary font-medium ml-1">Clinic Booking Platform</span>
        </div>
      </Header>

      <div className="page-container animate-fade-in">
        {/* Project Header */}
        <div className="mb-8 pb-8 border-b border-subtle">
          <div className="flex justify-between items-start">
            <div>
              <span className="badge badge-success mb-2">ON TRACK</span>
              <h1 className="page-title text-display">Al Waha Clinics</h1>
              <p className="text-secondary max-w-[600px]">Digital Transformation: Implementation of an end-to-end patient booking and management ecosystem.</p>
            </div>

            <div className="flex gap-8 text-right">
              <div>
                <div className="text-xs text-muted font-semibold uppercase">Health Score</div>
                <div className="text-display text-2xl font-bold text-accent">82%</div>
              </div>
              <div>
                <div className="text-xs text-muted font-semibold uppercase">Delivery Date</div>
                <div className="text-lg font-medium mt-1">Nov 30, 2024</div>
              </div>
              <div>
                <div className="text-xs text-muted font-semibold uppercase">Risk Level</div>
                <div className="mt-1"><span className="badge badge-warning">Medium</span></div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mt-8">
            <div className="text-accent font-medium border-b-2 border-accent pb-2">Overview</div>
            <div className="text-muted cursor-pointer">SRS</div>
            <div className="text-muted cursor-pointer">Contract</div>
            <div className="text-muted cursor-pointer">Invoices</div>
            <div className="text-muted cursor-pointer">Tasks</div>
            <div className="text-muted cursor-pointer">Risks</div>
          </div>
        </div>

        <div className="layout-sidebar-right">
          {/* Left Column */}
          <div className="flex-col flex gap-6">

            {/* Roadmap */}
            <Card>
              <div className="card-header">
                <h2 className="card-title text-display">Project Roadmap</h2>
                <a href="#" className="text-sm text-accent">Full Gantt <i className="fa-solid fa-arrow-right text-xs"></i></a>
              </div>

              <div className="timeline">
                <div className="timeline-node completed">
                  <div className="node-dot"></div>
                  <div className="text-xs text-muted font-semibold mt-2">OCT 12</div>
                  <div className="text-sm font-medium">Kickoff</div>
                </div>
                <div className="timeline-node completed">
                  <div className="node-dot"></div>
                  <div className="text-xs text-muted font-semibold mt-2">OCT 28</div>
                  <div className="text-sm font-medium">SRS Freeze</div>
                </div>
                <div className="timeline-node active">
                  <div className="node-dot flex items-center justify-center text-white text-[10px]">
                    <i className="fa-solid fa-play ml-0.5"></i>
                  </div>
                  <div className="text-xs font-bold text-accent mt-2">NOV 15 (NOW)</div>
                  <div className="text-sm font-bold text-primary">UAT Phase</div>
                </div>
                <div className="timeline-node">
                  <div className="node-dot"></div>
                  <div className="text-xs text-muted font-semibold mt-2">NOV 22</div>
                  <div className="text-sm text-secondary">Security Audit</div>
                </div>
                <div className="timeline-node">
                  <div className="node-dot"></div>
                  <div className="text-xs text-muted font-semibold mt-2">NOV 30</div>
                  <div className="text-sm text-secondary">Deployment</div>
                </div>
              </div>
            </Card>

            {/* Active Tasks */}
            <Card>
              <div className="card-header">
                <h2 className="card-title text-display">Active Task Stream</h2>
                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm"><i className="fa-solid fa-filter"></i></button>
                  <button className="btn btn-secondary btn-sm"><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>
              </div>

              <table className="w-full border-collapse text-left mt-4">
                <thead>
                  <tr className="border-b border-strong text-muted text-xs uppercase">
                    <th className="pb-2">Task Detail</th>
                    <th className="pb-2">Owner</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Due</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-subtle">
                    <td className="py-4">
                      <div className="font-medium text-sm">Patient Dashboard UI Refinement</div>
                      <div className="text-xs text-muted">Front-end Development • V2.1</div>
                    </td>
                    <td><div className="avatar w-6 h-6 text-[10px]">AM</div></td>
                    <td><span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>In Progress</span></td>
                    <td className="text-sm text-warning">Today</td>
                    <td><button className="action-btn"><i className="fa-solid fa-ellipsis-vertical"></i></button></td>
                  </tr>
                  <tr className="border-b border-subtle">
                    <td className="py-4">
                      <div className="font-medium text-sm">Payment Gateway Integration</div>
                      <div className="text-xs text-muted">Back-end • API Services</div>
                    </td>
                    <td><div className="avatar w-6 h-6 text-[10px] bg-green-500 border-green-500">SJ</div></td>
                    <td><span className="badge badge-danger">Blocked</span></td>
                    <td className="text-sm">Nov 18</td>
                    <td><button className="action-btn"><i className="fa-solid fa-ellipsis-vertical"></i></button></td>
                  </tr>
                  <tr>
                    <td className="py-4">
                      <div className="font-medium text-sm text-secondary line-through">Database Schema Finalization</div>
                      <div className="text-xs text-muted">DevOps • Architecture</div>
                    </td>
                    <td><div className="avatar w-6 h-6 text-[10px] bg-amber-500 border-amber-500">RK</div></td>
                    <td><span className="badge badge-success">Done</span></td>
                    <td className="text-sm text-secondary">Nov 10</td>
                    <td><button className="action-btn"><i className="fa-solid fa-ellipsis-vertical"></i></button></td>
                  </tr>
                </tbody>
              </table>
            </Card>

          </div>

          {/* Right Column */}
          <div className="flex-col flex gap-6">

            {/* Project Vault */}
            <Card>
              <div className="card-header">
                <h2 className="card-title text-display">Project Vault</h2>
                <button className="action-btn"><i className="fa-solid fa-cloud-arrow-up"></i></button>
              </div>

              <div className="list-group">
                <div className="vault-item">
                  <div className="text-red-500 text-2xl"><i className="fa-solid fa-file-pdf"></i></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Final_SRS_v2.4.pdf</div>
                    <div className="text-xs text-muted mb-2">Uploaded 2 days ago • 4.2 MB</div>
                    <div className="bg-main p-2 rounded text-xs border-l-2 border-accent">
                      <span className="font-bold text-accent">AI Summary:</span> Defines 12 core modules including HIPAA-compliant storage and Stripe checkout logic.
                    </div>
                  </div>
                </div>

                <div className="vault-item">
                  <div className="text-blue-500 text-2xl"><i className="fa-solid fa-file-word"></i></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Service_Agreement.docx</div>
                    <div className="text-xs text-muted mb-2">Uploaded Oct 15 • 1.1 MB</div>
                    <div className="bg-main p-2 rounded text-xs border-l-2 border-accent">
                      <span className="font-bold text-accent">AI Summary:</span> Standard maintenance terms apply post-launch. Includes 6 months of premium support.
                    </div>
                  </div>
                </div>
              </div>
              <button className="btn btn-secondary w-full mt-4">View All Assets</button>
            </Card>

            {/* Insight Card */}
            <Card style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.05))', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-wand-magic-sparkles text-accent"></i>
                <span className="text-xs font-bold text-accent uppercase tracking-wider">DocuPilot Insight</span>
              </div>
              <p className="text-sm leading-relaxed text-primary">
                Based on current task velocity, the UAT phase might extend by <strong className="text-warning">2 days</strong>. Suggesting reallocation of resources to 'Database Schema' to avoid blockers.
              </p>
              <button className="btn btn-primary w-full mt-4">
                Optimize Schedule
              </button>
              <i className="fa-solid fa-robot absolute -bottom-2 -right-2 text-[5rem] opacity-5"></i>
            </Card>

          </div>
        </div>
      </div>
    </>
  );
}
