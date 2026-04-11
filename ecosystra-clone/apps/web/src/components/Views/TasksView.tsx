import React, { useMemo } from 'react';
import { GodTierView } from './GodTierView';
import { Layout, CheckCircle2, Clock, AlertCircle, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface BoardItem {
  id: string;
  name: string;
  groupId?: string | null;
  dynamicData?: Record<string, unknown>;
}

interface BoardGroup {
  id: string;
  name: string;
  color?: string;
}

interface TasksViewProps {
  items: BoardItem[];
  groups: BoardGroup[];
  currentUserId?: string | null;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Done': return 'var(--status-done)';
    case 'Working on it': return 'var(--status-working)';
    case 'Stuck': return 'var(--status-stuck)';
    default: return 'var(--status-blank)';
  }
}

function formatDueDate(dateStr: unknown): string {
  if (!dateStr || typeof dateStr !== 'string') return '—';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((d.getTime() - now.getTime()) / 86400000);
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `In ${diff} days`;
  } catch { return '—'; }
}

export const TasksView: React.FC<TasksViewProps> = ({ items, groups, currentUserId }) => {
  const groupMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const g of groups) m[g.id] = g.name;
    return m;
  }, [groups]);

  const myTasks = useMemo(() => {
    if (!currentUserId) return items;
    return items.filter(item => {
      const d = item.dynamicData || {};
      const ownerId =
        (d.ownerUserId as string) ||
        (d.owner_userId as string) ||
        null;
      const assigneeId =
        (d.assigneeUserId as string) ||
        (d.assignee_userId as string) ||
        null;
      return ownerId === currentUserId || assigneeId === currentUserId || (!ownerId && !assigneeId);
    });
  }, [items, currentUserId]);

  const stats = useMemo(() => {
    let done = 0, working = 0, stuck = 0;
    for (const item of myTasks) {
      const status = ((item.dynamicData?.status as string) || '').toLowerCase();
      if (status === 'done') done++;
      else if (status === 'working on it') working++;
      else if (status === 'stuck') stuck++;
    }
    const overdue = myTasks.filter(item => {
      const due = item.dynamicData?.due_date as string | undefined;
      if (!due) return false;
      return new Date(due).getTime() < Date.now();
    }).length;
    return { total: myTasks.length, done, inProgress: working, overdue };
  }, [myTasks]);

  return (
    <GodTierView
      title="My Work"
      icon={Layout}
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
            borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white',
            cursor: 'pointer', fontSize: '13px'
          }}>
            <Filter size={14} /> Filter
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[
            { label: 'Assigned', count: stats.total, icon: Layout, color: 'var(--primary)' },
            { label: 'Completed', count: stats.done, icon: CheckCircle2, color: 'var(--status-done)' },
            { label: 'Overdue', count: stats.overdue, icon: AlertCircle, color: 'var(--status-stuck)' },
            { label: 'In Progress', count: stats.inProgress, icon: Clock, color: 'var(--status-working)' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              style={{
                padding: '24px', borderRadius: '16px', background: 'white',
                border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: `${stat.color}15`, color: stat.color }}>
                  <stat.icon size={20} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>{stat.label}</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.count}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-default)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-default)', fontWeight: 600, fontSize: '14px' }}>
            Current Tasks
          </div>
          {myTasks.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No tasks assigned to you yet. Create items on the board to see them here.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-default)' }}>
                  <th style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Task</th>
                  <th style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Group</th>
                  <th style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Priority</th>
                  <th style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Due</th>
                </tr>
              </thead>
              <tbody>
                {myTasks.map((task) => {
                  const d = task.dynamicData || {};
                  const status = (d.status as string) || '';
                  const priority = (d.priority as string) || '';
                  const dueDate = d.due_date;
                  return (
                    <tr key={task.id} style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}>
                      <td style={{ padding: '16px 24px', fontWeight: 500 }}>{task.name}</td>
                      <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {task.groupId ? groupMap[task.groupId] || '—' : '—'}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {status ? (
                          <div style={{
                            padding: '4px 12px', borderRadius: '4px', background: getStatusColor(status),
                            color: 'white', fontSize: '12px', textAlign: 'center', width: 'fit-content'
                          }}>
                            {status}
                          </div>
                        ) : <span style={{ color: 'var(--text-disabled)' }}>—</span>}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          fontSize: '12px', fontWeight: 600,
                          color: priority === 'Critical' ? 'var(--status-stuck)' : 'var(--text-secondary)'
                        }}>
                          {priority || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {formatDueDate(dueDate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </GodTierView>
  );
};
