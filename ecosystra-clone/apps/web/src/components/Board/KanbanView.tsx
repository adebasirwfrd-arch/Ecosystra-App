import React from 'react';
import * as Lucide from 'lucide-react';
const { Plus, MoreHorizontal, MessageSquare, Copy, Settings } = Lucide as any;
import type { BoardGroup, BoardItem } from './VirtualBoard';

interface KanbanViewProps {
  groups: BoardGroup[];
  onItemClick?: (item: BoardItem) => void;
}

const STATUS_BG: Record<string, string> = {
  'Done': '#00C875',
  'Working on it': '#FDAB3D',
  'Stuck': '#E2445C',
  'Not Started': '#C4C4C4',
  '': '#C4C4C4',
};

const PRIORITY_BG: Record<string, { bg: string; label: string }> = {
  'High': { bg: '#401694', label: 'High' },
  'Medium': { bg: '#5559DF', label: 'Medium' },
  'Low': { bg: '#579BFC', label: 'Low' },
  'Critical': { bg: '#333333', label: 'Critical' },
};

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export const KanbanView: React.FC<KanbanViewProps> = ({ groups, onItemClick }) => {
  // Gather all items and group by status
  const allItems = groups.flatMap(g => g.items);
  const statusColumns: Record<string, BoardItem[]> = {};
  
  allItems.forEach(item => {
    const status = item.dynamicData.status || 'Not Started';
    if (!statusColumns[status]) statusColumns[status] = [];
    statusColumns[status].push(item);
  });

  const columnOrder = ['Done', 'Working on it', 'Stuck', 'Not Started'];

  return (
    <div className="kanban-container">
      <div className="kanban-toolbar">
        <button className="btn-toolbar">🔍 Search</button>
        <button className="btn-toolbar">👤 Person</button>
        <button className="btn-toolbar">🔽 Filter</button>
        <button className="btn-toolbar">↕ Sort</button>
        <button className="btn-toolbar">⋯</button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Status summary bar */}
          <div style={{ display: 'flex', width: 100, height: 8, borderRadius: 4, overflow: 'hidden' }}>
            {columnOrder.map(s => {
              const count = (statusColumns[s] || []).length;
              if (count === 0) return null;
              return (
                <div key={s} style={{ width: `${(count / allItems.length) * 100}%`, background: STATUS_BG[s] }} />
              );
            })}
          </div>
          <button className="idp-icon-btn"><Settings size={16} /></button>
        </div>
      </div>

      <div className="kanban-board">
        {columnOrder.map(status => {
          const items = statusColumns[status] || [];
          return (
            <div key={status} className="kanban-column">
              <div className="kanban-column-header" style={{ background: STATUS_BG[status] }}>
                <span className="kanban-column-title">{status}</span>
                <span className="kanban-column-count">{items.length}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                  <button className="kanban-column-btn"><MoreHorizontal size={14} /></button>
                  <button className="kanban-column-btn"><Plus size={14} /></button>
                </div>
              </div>
              <div className="kanban-column-body">
                {items.map(item => (
                  <div key={item.id} className="kanban-card" onClick={() => onItemClick?.(item)}>
                    <div className="kanban-card-name">{item.name}</div>
                    <div className="kanban-card-badges">
                      {/* Status badge */}
                      <span className="kanban-card-badge" style={{ borderLeft: `3px solid ${STATUS_BG[status]}` }}>
                        {status}
                      </span>
                      {/* Date */}
                      {item.dynamicData.due_date && (
                        <span className="kanban-card-badge">
                          📅 {formatDate(item.dynamicData.due_date)}
                        </span>
                      )}
                    </div>
                    {/* Notes */}
                    {item.dynamicData.notes && (
                      <div className="kanban-card-notes">{item.dynamicData.notes}</div>
                    )}
                    {/* Priority */}
                    {item.dynamicData.priority && PRIORITY_BG[item.dynamicData.priority] && (
                      <span className="kanban-card-badge" style={{
                        borderLeft: `3px solid ${PRIORITY_BG[item.dynamicData.priority].bg}`,
                      }}>
                        {item.dynamicData.priority}
                      </span>
                    )}
                    {/* Footer */}
                    <div className="kanban-card-footer">
                      {item.dynamicData.owner && (
                        <div className="person-avatar" style={{
                          background: 'linear-gradient(135deg, #879CFF, #6C6CFF)',
                          width: 24, height: 24, fontSize: 9,
                        }}>
                          {getInitials(item.dynamicData.owner)}
                        </div>
                      )}
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text-disabled)' }}>
                        <MessageSquare size={13} />
                        {item.subitems && item.subitems.length > 0 && (
                          <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Copy size={11} /> {item.subitems.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <button className="kanban-add-task">
                  <Plus size={14} /> Add task
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
