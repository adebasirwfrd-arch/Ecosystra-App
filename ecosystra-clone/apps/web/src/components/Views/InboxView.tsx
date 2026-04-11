import React from 'react';
import { GodTierView } from './GodTierView';
import { Mail, Bell, Check, MoreHorizontal, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface InboxViewProps {
  notifications: any[];
  onMarkAsRead: (id: string) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({ notifications, onMarkAsRead }) => {

  return (
    <GodTierView 
      title="Inbox" 
      icon={Mail}
      actions={
        <button style={{ 
          fontSize: '13px', color: 'var(--primary)', background: 'transparent',
          border: 'none', cursor: 'pointer', fontWeight: 600
        }}>
          Mark all as read
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border-light)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-default)' }}>
        {notifications.map((notif, i) => (
          <motion.div 
            key={notif.id}
            whileHover={{ background: 'var(--bg-canvas)' }}
            style={{ 
              padding: '20px 24px', background: 'white', display: 'flex', gap: '16px',
              borderBottom: i === notifications.length - 1 ? 'none' : '1px solid var(--border-light)',
              opacity: notif.isRead ? 0.7 : 1, position: 'relative'
            }}
          >
            {!notif.isRead && (
              <div style={{ 
                position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' 
              }} />
            )}
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-canvas)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)'
            }}>
              {notif.type === 'system' ? <Bell size={18} /> : <User size={18} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{notif.title}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {(() => {
                    const t = new Date(notif.createdAt);
                    return Number.isNaN(t.getTime())
                      ? '—'
                      : t.toLocaleDateString();
                  })()}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{notif.message}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {!notif.isRead && (
                <button 
                  onClick={() => onMarkAsRead(notif.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                >
                  <Check size={18} />
                </button>
              )}
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-disabled)', cursor: 'pointer' }}>
                <MoreHorizontal size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </GodTierView>
  );
};
