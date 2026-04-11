import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Settings, Users, LogOut, Moon, Sun, 
  HelpCircle, Sparkles, Layout, CheckCircle2,
  ChevronRight, Smile, Pencil
} from 'lucide-react';

interface ProfileDropdownProps {
  user: {
    name: string;
    email: string;
    status: string;
    avatarUrl?: string;
  };
  onClose: () => void;
  onLogout: () => void;
  onUpdateStatus: (status: string) => void;
  onNavigate: (path: string) => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ 
  user, onClose, onLogout, onUpdateStatus, onNavigate 
}) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(user.status);

  const menuItems = [
    { icon: User, label: 'My profile', path: '/profile' },
    { icon: Layout, label: 'My tasks', path: '/tasks' },
    { icon: Sparkles, label: 'Ecosystra Labs', path: '/apps', isNew: true },
  ];

  const adminItems = [
    { icon: Users, label: 'Members', path: '/members', count: 12 },
    { icon: Settings, label: 'Workspace settings', path: '/settings' },
    { icon: Layout, label: 'Switch workspace', path: '/settings' },
  ];

  const supportItems = [
    { icon: HelpCircle, label: 'Help center', path: '/help' },
    { icon: CheckCircle2, label: 'Product updates', path: '/updates' },
  ];

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(newStatus);
    setIsEditingStatus(false);
  };

  return (
    <>
      <div 
        style={{ position: 'fixed', inset: 0, zIndex: 100 }} 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          right: 0,
          top: '48px',
          width: '300px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          zIndex: 101,
          border: '1px solid var(--border-default)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* User Identity Section */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-canvas)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ 
              width: '44px', height: '44px', borderRadius: '12px', 
              background: 'linear-gradient(135deg, var(--primary), #6C6CFF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '16px'
            }}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px' }}>{user.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{user.email}</div>
            </div>
          </div>

          {/* Status Section */}
          <div style={{ display: 'flex' }}>
            {!isEditingStatus ? (
              <button 
                onClick={() => setIsEditingStatus(true)}
                style={{ 
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-default)',
                  background: 'white', textAlign: 'left', cursor: 'pointer',
                  fontSize: '13px', color: 'var(--text-secondary)'
                }}
              >
                <Smile size={14} color="var(--status-working)" />
                <span style={{ flex: 1 }}>{user.status || 'Set status'}</span>
                <Pencil size={12} style={{ opacity: 0.3 }} />
              </button>
            ) : (
              <form onSubmit={handleStatusSubmit} style={{ width: '100%' }}>
                <input 
                  autoFocus
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ 
                    width: '100%', padding: '6px 12px', borderRadius: '4px', 
                    border: '1px solid var(--primary)', outline: 'none',
                    fontSize: '13px'
                  }}
                  onBlur={() => setIsEditingStatus(false)}
                />
              </form>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ padding: '8px 0', maxHeight: '400px', overflowY: 'auto' }}>
          {menuItems.map((item, i) => (
            <div 
              key={i} 
              className="dropdown-item"
              onClick={() => { onNavigate(item.path); onClose(); }}
            >
              <item.icon size={16} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.isNew && <span style={{ fontSize: '9px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '10px', fontWeight: 700 }}>NEW</span>}
            </div>
          ))}
          
          <div style={{ height: '1px', background: 'var(--border-light)', margin: '8px 0' }} />
          
          <div style={{ padding: '4px 16px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Workspace</div>
          {adminItems.map((item, i) => (
            <div 
              key={i} 
              className="dropdown-item"
              onClick={() => { onNavigate(item.path); onClose(); }}
            >
              <item.icon size={16} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.count && <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.count}</span>}
            </div>
          ))}

          <div style={{ height: '1px', background: 'var(--border-light)', margin: '8px 0' }} />
          
          {supportItems.map((item, i) => (
            <div 
              key={i} 
              className="dropdown-item"
              onClick={() => { onNavigate(item.path); onClose(); }}
            >
              <item.icon size={16} />
              <span style={{ flex: 1 }}>{item.label}</span>
              <ChevronRight size={14} style={{ opacity: 0.3 }} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--border-light)', padding: '8px 0' }}>
          <div className="dropdown-item" style={{ color: 'var(--status-stuck)' }} onClick={onLogout}>
            <LogOut size={16} />
            <span>Log out</span>
          </div>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          font-size: 14px;
          color: var(--text-primary);
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .dropdown-item:hover {
          background: var(--bg-hover);
        }
        .dropdown-item svg {
          color: var(--text-secondary);
        }
      `}} />
    </>
  );
};
