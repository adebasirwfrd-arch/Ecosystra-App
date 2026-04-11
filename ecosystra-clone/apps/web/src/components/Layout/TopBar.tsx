import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';

const { Bell, Mail, Users, Search, HelpCircle, Grid3x3, X } = Lucide as any;

interface TopBarProps {
  user?: {
    name: string;
    email: string;
    status: string;
    avatarUrl?: string;
  };
  unreadCount?: number;
  onLogout: () => void;
  onUpdateStatus: (status: string) => void;
  onNavigate: (path: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ user, unreadCount = 0, onLogout, onUpdateStatus, onNavigate }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const defaultUser = {
    name: 'Ade Basir',
    email: 'ade.basirwfrd@gmail.com',
    status: 'Working on it'
  };

  const currentUser = user || defaultUser;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-logo">
          <div className="topbar-logo-icon" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '15px', fontWeight: 700 }}>ecosystra</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 400, marginTop: '-2px' }}>WorkOS Management</span>
          </div>
        </div>
      </div>

      <div className="topbar-right">
        {/* Global Search */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 180, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                style={{ overflow: 'hidden', marginRight: '8px' }}
              >
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search..."
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: '4px', 
                    border: '1px solid var(--border-default)',
                    fontSize: '13px',
                    width: '100%',
                    outline: 'none',
                    background: 'var(--bg-canvas)'
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            className="topbar-icon-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            style={isSearchOpen ? { background: 'var(--primary-selected)', color: 'var(--primary)' } : {}}
          >
            {isSearchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
        </div>

        <button className="topbar-icon-btn relative group" onClick={() => onNavigate('notifications')}>
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="topbar-notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
          )}
        </button>
        
        <button className="topbar-icon-btn" onClick={() => onNavigate('inbox')}>
          <Mail size={18} />
        </button>
        <button className="topbar-icon-btn" onClick={() => onNavigate('members')}>
          <Users size={18} />
        </button>
        <button className="topbar-icon-btn" onClick={() => onNavigate('help')}>
          <HelpCircle size={18} />
        </button>
        <button className="topbar-icon-btn" onClick={() => onNavigate('apps')}>
          <Grid3x3 size={18} />
        </button>
        
        <div className="relative">
          <div 
            className="topbar-avatar"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{ 
              background: currentUser.avatarUrl ? `url(${currentUser.avatarUrl}) center/cover` : 'linear-gradient(135deg, var(--primary), #6C6CFF)',
              display: 'flex',
              flexDirection: 'column',
              padding: '2px',
              height: '34px',
              width: '34px',
              overflow: 'hidden'
            }}
          >
            {!currentUser.avatarUrl && currentUser.name.split(' ').map((n: string) => n[0]).join('')}
          </div>

          <AnimatePresence>
            {isProfileOpen && (
              <ProfileDropdown 
                user={currentUser}
                onClose={() => setIsProfileOpen(false)}
                onLogout={onLogout}
                onUpdateStatus={onUpdateStatus}
                onNavigate={onNavigate}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
