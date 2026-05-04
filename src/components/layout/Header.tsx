import React from 'react';

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <header className="topbar">
      <div style={{ flex: 1, minWidth: 0 }}>
        {children ? children : (
          <div className="search-bar">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search projects, contracts, tasks..." />
          </div>
        )}
      </div>

      <div className="topbar-actions">
        <button className="action-btn" data-tooltip="Notifications">
          <i className="fa-regular fa-bell"></i>
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile">
          <div className="avatar">NX</div>
          <div className="user-info">
            <span className="user-name">NexaSoft Admin</span>
            <span className="user-role">Project Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}
