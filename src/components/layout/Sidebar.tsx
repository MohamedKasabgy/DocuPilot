'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/', icon: 'fa-solid fa-border-all', label: 'Dashboard' },
  { href: '/projects', icon: 'fa-solid fa-folder-open', label: 'Projects' },
  { href: '/srs-generator', icon: 'fa-solid fa-wand-magic-sparkles', label: 'SRS Generator' },
  { href: '/contracts', icon: 'fa-solid fa-file-signature', label: 'Contracts' },
  { href: '/invoices', icon: 'fa-solid fa-file-invoice-dollar', label: 'Invoices & Approvals' },
  { href: '/scope-guard', icon: 'fa-solid fa-shield-halved', label: 'Scope Guard' },
  { href: '/risks', icon: 'fa-solid fa-triangle-exclamation', label: 'Risk Radar' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/invoices') return pathname === '/invoices' || pathname === '/approvals';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        type="button"
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-header">
          <div className="brand-logo">
            <div className="brand-logo-icon">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <div className="brand-text">
              DocuPilot
              <span className="brand-subtitle">AI-Powered Software Ops</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
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
          <button
            type="button"
            className="btn-new-project"
            onClick={() => { setMobileOpen(false); router.push('/srs-generator'); flash('Start by generating an SRS for the new project'); }}
          >
            <i className="fa-solid fa-plus"></i>
            New Project
          </button>
          <ul className="nav-list">
            <li className="nav-item" style={{ fontSize: '0.875rem' }}>
              <button
                type="button"
                onClick={() => { setMobileOpen(false); flash('Support center coming soon — reach us at support@docupilot.io'); }}
                className="flex items-center gap-3 w-full"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', font: 'inherit', textAlign: 'left', touchAction: 'manipulation' }}
              >
                <i className="fa-regular fa-circle-question w-5 text-center"></i>
                Support
              </button>
            </li>
            <li className="nav-item" style={{ fontSize: '0.875rem', color: 'var(--status-danger)', opacity: 0.8 }}>
              <button
                type="button"
                onClick={() => { setMobileOpen(false); flash('Sign-out is disabled in the demo'); }}
                className="flex items-center gap-3 w-full"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', font: 'inherit', textAlign: 'left', touchAction: 'manipulation' }}
              >
                <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i>
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {toast && (
        <div className="toast toast-info" role="status" aria-live="polite" style={{ zIndex: 200 }}>
          <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
          {toast}
        </div>
      )}
    </>
  );
}
