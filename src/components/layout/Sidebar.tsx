'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/',              icon: 'fa-solid fa-border-all',           label: 'Dashboard' },
  { href: '/projects',      icon: 'fa-solid fa-folder-open',          label: 'Projects' },
  { href: '/srs-generator', icon: 'fa-solid fa-wand-magic-sparkles',  label: 'SRS Generator' },
  { href: '/contracts',     icon: 'fa-solid fa-file-signature',       label: 'Contracts' },
  { href: '/invoices',      icon: 'fa-solid fa-file-invoice-dollar',  label: 'Invoices & Approvals' },
  { href: '/scope-guard',   icon: 'fa-solid fa-shield-halved',        label: 'Scope Guard' },
  { href: '/risks',         icon: 'fa-solid fa-triangle-exclamation', label: 'Risk Radar' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/invoices') return pathname === '/invoices' || pathname === '/approvals';
    return pathname.startsWith(href);
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-header">
        <div className="brand-logo">
          <div className="brand-logo-icon">
            <i className="fa-solid fa-layer-group"></i>
          </div>
          <div className="brand-text">
            DocuPilot
            <span className="brand-subtitle">Operational Hub</span>
          </div>
        </div>
      </div>

      <div className="sidebar-divider"></div>

      {/* Main Navigation */}
      <div className="nav-group">
        <div className="nav-label">Workspace</div>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.href} className={`nav-item ${isActive(item.href) ? 'active' : ''}`}>
              <Link href={item.href} className="flex items-center gap-3 w-full">
                <i className={`${item.icon} w-5 text-center`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-divider"></div>

      {/* AI Intelligence */}
      <div className="nav-group" style={{ marginBottom: 0 }}>
        <div className="nav-label">AI Intelligence</div>
        <ul className="nav-list">
          <li className={`nav-item nav-item-special ${isActive('/ask-docupilot') ? 'active' : ''}`}>
            <Link href="/ask-docupilot" className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-robot w-5 text-center"></i>
              Ask DocuPilot
            </Link>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="btn-new-project">
          <i className="fa-solid fa-plus"></i>
          New Project
        </button>
        <ul className="nav-list">
          <li className="nav-item" style={{ fontSize: '0.875rem' }}>
            <span className="flex items-center gap-3 w-full">
              <i className="fa-regular fa-circle-question w-5 text-center"></i>
              Support
            </span>
          </li>
          <li className="nav-item" style={{ fontSize: '0.875rem', color: 'var(--status-danger)', opacity: 0.8 }}>
            <span className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i>
              Sign Out
            </span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
