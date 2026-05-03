'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo">
          <i className="fa-solid fa-layer-group text-accent" style={{ marginBottom: '4px' }}></i>
          DocuPilot
          <span className="brand-subtitle">Operational Hub</span>
        </div>
      </div>

      <div className="nav-group">
        <ul className="nav-list">
          <li className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
            <Link href="/" className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-border-all w-5 text-center"></i> Dashboard
            </Link>
          </li>
          <li className={`nav-item ${pathname === '/projects' ? 'active' : ''}`}>
            <Link href="/projects" className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-folder-open w-5 text-center"></i> Projects
            </Link>
          </li>
          <li className={`nav-item ${pathname === '/srs-generator' ? 'active' : ''}`}>
            <Link href="/srs-generator" className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-wand-magic-sparkles w-5 text-center"></i> SRS Generator
            </Link>
          </li>
          <li className={`nav-item ${pathname === '/contracts' ? 'active' : ''}`}>
            <Link href="/contracts" className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-file-signature w-5 text-center"></i> Contracts
            </Link>
          </li>
          <li className={`nav-item ${pathname === '/invoices' || pathname === '/approvals' ? 'active' : ''}`}>
            <Link href="/invoices" className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-file-invoice-dollar w-5 text-center"></i> Invoices & Approvals
            </Link>
          </li>
          <li className={`nav-item ${pathname === '/scope-guard' ? 'active' : ''}`}>
            <Link href="/scope-guard" className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-shield-halved w-5 text-center"></i> Scope Guard
            </Link>
          </li>
          <li className={`nav-item ${pathname === '/risks' ? 'active' : ''}`}>
            <Link href="/risks" className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-triangle-exclamation w-5 text-center"></i> Risks
            </Link>
          </li>
        </ul>
      </div>

      <div className="nav-group" style={{ marginTop: 'auto', marginBottom: 0 }}>
        <div className="nav-label">Intelligence</div>
        <ul className="nav-list">
          <li className={`nav-item nav-item-special ${pathname === '/ask-docupilot' ? 'active' : ''}`}>
            <Link href="/ask-docupilot" className="flex items-center gap-3 w-full">
              <i className="fa-solid fa-robot w-5 text-center"></i> Ask DocuPilot
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer" style={{ marginTop: 'var(--spacing-xl)' }}>
        <button className="btn btn-primary" style={{ width: 'calc(100% - 2rem)', margin: '0 auto var(--spacing-md)' }}>
          <i className="fa-solid fa-plus"></i> New Project
        </button>
        <ul className="nav-list">
          <li className="nav-item">
            <span className="flex items-center gap-3 w-full"><i className="fa-regular fa-circle-question w-5 text-center"></i> Support</span>
          </li>
          <li className="nav-item text-danger">
            <span className="flex items-center gap-3 w-full"><i className="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i> Sign Out</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
