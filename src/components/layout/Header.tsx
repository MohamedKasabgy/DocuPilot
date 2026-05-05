'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  children?: React.ReactNode;
}

interface Notification {
  id: number;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  meta: string;
  href: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, icon: 'fa-solid fa-shield-halved', iconColor: 'var(--accent-primary)', iconBg: 'rgba(37,99,235,0.1)', title: 'Scope deviation detected', meta: 'Mobile app request flagged · 2m ago', href: '/scope-guard', read: false },
  { id: 2, icon: 'fa-solid fa-file-invoice-dollar', iconColor: 'var(--status-warning)', iconBg: 'var(--status-warning-bg)', title: 'Invoice INV-2026-042 needs approval', meta: '6,500 SAR · DesignPro Studio · 4h left', href: '/invoices', read: false },
  { id: 3, icon: 'fa-solid fa-wand-magic-sparkles', iconColor: '#7C3AED', iconBg: 'rgba(124,58,237,0.08)', title: 'SRS generated — 78% confidence', meta: 'Clinic Booking Platform · 35m ago', href: '/srs-generator', read: true },
];

const SEARCH_TARGETS: { label: string; href: string; tag: string }[] = [
  { label: 'Dashboard', href: '/', tag: 'page' },
  { label: 'Projects', href: '/projects', tag: 'page' },
  { label: 'Al Waha Clinics', href: '/projects', tag: 'project' },
  { label: 'SRS Generator', href: '/srs-generator', tag: 'tool' },
  { label: 'Contracts', href: '/contracts', tag: 'page' },
  { label: 'Invoices', href: '/invoices', tag: 'page' },
  { label: 'INV-2026-042', href: '/invoices', tag: 'invoice' },
  { label: 'Scope Guard', href: '/scope-guard', tag: 'tool' },
  { label: 'Risk Radar', href: '/risks', tag: 'page' },
  { label: 'Approvals', href: '/approvals', tag: 'page' },
  { label: 'Ask DocuPilot', href: '/ask-docupilot', tag: 'ai' },
  { label: 'Change Request', href: '/scope-guard', tag: 'workflow' },
];

export default function Header({ children }: HeaderProps) {
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const flashToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    flashToast('All notifications marked as read');
  };

  const handleNotificationClick = (n: Notification) => {
    setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    setNotifOpen(false);
    router.push(n.href);
  };

  const filteredResults = searchTerm.trim().length > 0
    ? SEARCH_TARGETS.filter(t => t.label.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 6)
    : [];

  const handleSearchSelect = (href: string) => {
    setSearchTerm('');
    setSearchOpen(false);
    router.push(href);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredResults.length > 0) {
      handleSearchSelect(filteredResults[0].href);
    } else if (searchTerm.trim().length > 0) {
      flashToast(`No matches for "${searchTerm}"`);
    }
  };

  return (
    <header className="topbar">
      <div style={{ flex: 1, minWidth: 0 }}>
        {children ? children : (
          <div ref={searchRef} style={{ position: 'relative', maxWidth: '420px' }}>
            <form onSubmit={handleSearchSubmit} className="search-bar">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search projects, contracts, tasks..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                aria-label="Search"
              />
            </form>
            {searchOpen && filteredResults.length > 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'white', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', zIndex: 50, overflow: 'hidden' }}>
                {filteredResults.map(r => (
                  <button
                    type="button"
                    key={r.label + r.href}
                    onClick={() => handleSearchSelect(r.href)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', touchAction: 'manipulation' }}
                  >
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.label}</span>
                    <span className="text-xs text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>{r.tag}</span>
                  </button>
                ))}
              </div>
            )}
            {searchOpen && searchTerm.trim().length > 0 && filteredResults.length === 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'white', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', zIndex: 50, padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                No results for &ldquo;{searchTerm}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>

      <div className="topbar-actions">
        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="action-btn"
            data-tooltip="Notifications"
            onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <i className="fa-regular fa-bell"></i>
            {unreadCount > 0 && <span className="notification-dot"></span>}
          </button>
          {notifOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '340px', maxWidth: 'calc(100vw - 24px)', background: 'white', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', zIndex: 50, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="font-bold text-sm">Notifications</span>
                {unreadCount > 0 ? (
                  <button type="button" onClick={markAllRead} className="text-xs font-semibold text-accent" style={{ background: 'none', border: 'none', cursor: 'pointer', touchAction: 'manipulation' }}>
                    Mark all read
                  </button>
                ) : (
                  <span className="text-xs text-muted">All caught up</span>
                )}
              </div>
              <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px 14px', textAlign: 'center' }} className="text-sm text-muted">
                    No notifications.
                  </div>
                ) : notifications.map(n => (
                  <button
                    type="button"
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    style={{ display: 'flex', gap: '10px', width: '100%', padding: '12px 14px', background: n.read ? 'white' : 'rgba(37,99,235,0.04)', border: 'none', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', textAlign: 'left', alignItems: 'flex-start', touchAction: 'manipulation' }}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: n.iconBg, color: n.iconColor }}>
                      <i className={n.icon} style={{ fontSize: '0.875rem' }}></i>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.title}</div>
                      <div className="text-xs text-muted" style={{ marginTop: '2px' }}>{n.meta}</div>
                    </div>
                    {!n.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0, marginTop: '6px' }}></span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile — hidden on mobile, topbar has enough actions without it */}
        <div ref={profileRef} className="hidden md:block relative">
          <button
            type="button"
            onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
            aria-label="User menu"
            aria-expanded={profileOpen}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, touchAction: 'manipulation' }}
          >
            <div className="user-profile">
              <div className="avatar">DP</div>
              <div className="user-info">
                <span className="user-name">DocuPilot Admin</span>
                <span className="user-role">Operations Manager</span>
              </div>
            </div>
          </button>
          {profileOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '220px', background: 'white', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', zIndex: 50, overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="font-bold text-sm">DocuPilot Admin</div>
                <div className="text-xs text-muted">admin@docupilot.io</div>
              </div>
              {[
                { icon: 'fa-regular fa-user', label: 'Profile', msg: 'Profile page coming soon' },
                { icon: 'fa-solid fa-gear', label: 'Settings', msg: 'Settings page coming soon' },
                { icon: 'fa-regular fa-circle-question', label: 'Help & Support', msg: 'Support center coming soon' },
              ].map(item => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => { setProfileOpen(false); flashToast(item.msg); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-primary)', touchAction: 'manipulation' }}
                >
                  <i className={item.icon} style={{ width: '16px', color: 'var(--text-muted)' }}></i>
                  {item.label}
                </button>
              ))}
              <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => { setProfileOpen(false); flashToast('Sign-out is disabled in the demo'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: 'var(--status-danger)', touchAction: 'manipulation' }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket" style={{ width: '16px' }}></i>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="toast toast-info" style={{ zIndex: 100 }}>
          <i className="fa-solid fa-circle-info"></i>
          {toast}
        </div>
      )}
    </header>
  );
}
