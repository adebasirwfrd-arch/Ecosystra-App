import React from 'react';
import { GodTierView } from './GodTierView';
import { Layout, CheckCircle2, Clock, AlertCircle, Filter, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export const TasksView: React.FC = () => {
  const tasks = [
    { id: 1, title: 'Finalize Department Budget', board: 'Project Orion', status: 'Working on it', due: 'Today', priority: 'High' },
    { id: 2, title: 'Update Schema Documentation', board: 'Engineering', status: 'Done', due: 'Yesterday', priority: 'Medium' },
    { id: 3, title: 'Review PR #452', board: 'Engineering', status: 'Stuck', due: 'Tomorrow', priority: 'Critical' },
    { id: 4, title: 'Client Meeting Preparation', board: 'Sales Ops', status: 'Working on it', due: 'In 2 days', priority: 'Low' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'var(--status-done)';
      case 'Working on it': return 'var(--status-working)';
      case 'Stuck': return 'var(--status-stuck)';
      default: return 'var(--status-blank)';
    }
  };

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
          <button style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
            borderRadius: '8px', border: 'none', background: 'var(--primary)',
            color: 'white', cursor: 'pointer', fontWeight: 500, fontSize: '13px'
          }}>
            <Plus size={16} /> Add Task
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Summary Widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[
            { label: 'Assigned', count: 12, icon: Layout, color: 'var(--primary)' },
            { label: 'Completed', count: 8, icon: CheckCircle2, color: 'var(--status-done)' },
            { label: 'Overdue', count: 2, icon: AlertCircle, color: 'var(--status-stuck)' },
            { label: 'Upcoming', count: 4, icon: Clock, color: 'var(--status-working)' },
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
                <div style={{ 
                  padding: '8px', borderRadius: '8px', background: `${stat.color}15`, color: stat.color 
                }}>
                  <stat.icon size={20} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>{stat.label}</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.count}</div>
            </motion.div>
          ))}
        </div>

        {/* Task List */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-default)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-default)', fontWeight: 600, fontSize: '14px' }}>
            Current Tasks
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-default)' }}>
                <th style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Task</th>
                <th style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Board</th>
                <th style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Priority</th>
                <th style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Due</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 500 }}>{task.title}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '14px' }}>{task.board}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ 
                      padding: '4px 12px', borderRadius: '4px', background: getStatusColor(task.status),
                      color: 'white', fontSize: '12px', textAlign: 'center', width: 'fit-content'
                    }}>
                      {task.status}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      fontSize: '12px', fontWeight: 600, 
                      color: task.priority === 'Critical' ? 'var(--status-stuck)' : 'var(--text-secondary)'
                    }}>
                      {task.priority}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '14px' }}>{task.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </GodTierView>
  );
};
