import React from 'react';

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <header className="topbar">
      {children ? children : (
        <div className="search-bar">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search projects, contracts, or tasks..." />
        </div>
      )}

      <div className="topbar-actions">
        <button className="action-btn"><i className="fa-regular fa-bell"></i></button>
        <div className="user-profile">
          <div className="avatar">NX</div>
        </div>
      </div>
    </header>
  );
}
