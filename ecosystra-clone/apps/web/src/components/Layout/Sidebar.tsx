import React from 'react';
import * as Lucide from 'lucide-react';
const { Home, Briefcase, MoreHorizontal, Workflow, Search, ChevronDown, Plus, LayoutDashboard, Users, Settings, Inbox, Bell, CheckSquare } = Lucide as any;

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const mainMenus = [
    { id: 'board', label: 'Task management', icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )},
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={16} /> },
    { id: 'members', label: 'Members', icon: <Users size={16} /> },
    { id: 'inbox', label: 'Inbox', icon: <Inbox size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <button className={`sidebar-item ${activeView === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
          <Home size={18} /> Home
        </button>
        <button className={`sidebar-item ${activeView === 'mywork' ? 'active' : ''}`} onClick={() => onNavigate('mywork')}>
          <Briefcase size={18} /> My work
        </button>
        <button className="sidebar-item">
          <MoreHorizontal size={18} /> More
        </button>
      </nav>

      <div className="sidebar-divider" />

      {/* Favorites */}
      <div className="sidebar-section-title" style={{ fontSize: '14px', textTransform: 'none', letterSpacing: 'normal', fontWeight: 400, color: 'var(--text-primary)' }}>
        Favorites <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>›</span>
      </div>

      <div className="sidebar-divider" />

      {/* Workspaces */}
      <div className="sidebar-section-title">
        <span style={{ fontSize: '14px', textTransform: 'none', letterSpacing: 'normal', fontWeight: 400, color: 'var(--text-secondary)' }}>Workspaces</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <MoreHorizontal size={16} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
          <Search size={16} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
        </div>
      </div>

      <div style={{ padding: '4px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="sidebar-workspace">
          <div className="sidebar-workspace-icon">M</div>
          <span>Main workspa...</span>
          <ChevronDown size={14} />
        </div>
        <button className="sidebar-add-btn">
          <Plus size={16} />
        </button>
      </div>

      <div className="sidebar-divider" />
      <div className="sidebar-section-title" style={{ fontSize: '14px', textTransform: 'none', letterSpacing: 'normal', fontWeight: 500, color: 'var(--text-secondary)', padding: '0 16px' }}>
        Ecosystra
      </div>

      {/* Main Navigation */}
      {mainMenus.map((menu) => (
        <button
          key={menu.id}
          className={`sidebar-board-item ${activeView === menu.id ? 'active' : ''}`}
          onClick={() => onNavigate(menu.id)}
        >
          {menu.icon}
          {menu.label}
        </button>
      ))}

      <button className="sidebar-board-item" onClick={() => onNavigate('workflow')}>
        <Workflow size={16} />
        New Workflow
      </button>
    </aside>
  );
};
