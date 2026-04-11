import React from 'react';
import { GodTierView } from './GodTierView';
import { Bell, CheckCircle2, AlertCircle, Info, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type?: string;
}

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
}

function timeAgo(dateStr: string): string {
  const t = new Date(dateStr).getTime();
  if (Number.isNaN(t)) return '—';
  const diff = Date.now() - t;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ notifications, onMarkAsRead }) => {
  const unread = notifications.filter(n => !n.isRead);
  const read = notifications.filter(n => n.isRead);

  const renderNotification = (notif: Notification) => (
    <div
      key={notif.id}
      onClick={() => !notif.isRead && onMarkAsRead?.(notif.id)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px 24px',
        borderBottom: '1px solid var(--border-light)',
        background: notif.isRead ? 'transparent' : 'var(--primary-selected)',
        cursor: notif.isRead ? 'default' : 'pointer',
      }}
    >
      <div style={{
        padding: '8px', borderRadius: '8px',
        background: notif.isRead ? 'var(--bg-canvas)' : 'var(--primary)15',
        color: notif.isRead ? 'var(--text-secondary)' : 'var(--primary)',
      }}>
        {notif.type === 'alert' ? <AlertCircle size={16} /> : <Info size={16} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{notif.title}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{notif.message}</div>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-disabled)', whiteSpace: 'nowrap' }}>
        {timeAgo(notif.createdAt)}
      </div>
      {!notif.isRead && (
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px', flexShrink: 0 }} />
      )}
    </div>
  );

  return (
    <GodTierView
      title="Notifications"
      icon={Bell}
      actions={
        notifications.length > 0 ? (
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
            borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white',
            cursor: 'pointer', fontSize: '13px', color: 'var(--status-stuck)'
          }}>
            <Trash2 size={14} /> Clear all
          </button>
        ) : null
      }
    >
      {notifications.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-canvas)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-disabled)',
            margin: '0 auto 24px'
          }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>All caught up!</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '300px', margin: '12px auto' }}>
            You've read all your notifications. New updates from your boards will appear here.
          </p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-default)', overflow: 'hidden' }}>
          {unread.length > 0 && (
            <>
              <div style={{ padding: '12px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-canvas)' }}>
                Unread ({unread.length})
              </div>
              {unread.map(renderNotification)}
            </>
          )}
          {read.length > 0 && (
            <>
              <div style={{ padding: '12px 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-canvas)' }}>
                Earlier
              </div>
              {read.map(renderNotification)}
            </>
          )}
        </div>
      )}
    </GodTierView>
  );
};
