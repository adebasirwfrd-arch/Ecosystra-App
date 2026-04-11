import React from 'react';
import { GodTierView } from './GodTierView';
import { Bell, Activity, Clock, Trash2 } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  return (
    <GodTierView 
      title="Notifications" 
      icon={Bell}
      actions={
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
          borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white',
          cursor: 'pointer', fontSize: '13px', color: 'var(--status-stuck)'
        }}>
          <Trash2 size={14} /> Clear all
        </button>
      }
    >
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-canvas)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-disabled)',
          margin: '0 auto 24px'
        }}>
          <Bell size={40} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>All caught up!</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '300px', margin: '12px auto' }}>
          You've read all your notifications. New updates from your boards will appear here.
        </p>
      </div>
    </GodTierView>
  );
};
