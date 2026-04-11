import React, { useState } from 'react';
import * as Lucide from 'lucide-react';

const { 
  X, MessageSquare, MoreHorizontal, Check, User, Calendar, Clock, 
  Tag, ListFilter, Type, Hash, FileText, FunctionSquare, ExternalLink, Copy
} = Lucide as any;

/* ============ Shared Types ============ */
export interface ColumnDef {
  id: string;
  title: string;
  type: 'status' | 'person' | 'date' | 'text' | 'priority' | 'timestamp' | 'file' | 'numbers' | 'tags' | 'timeline' | 'due_date_priority' | 'notes_category' | 'checkbox' | 'dropdown' | 'doc' | 'formula' | 'connect' | 'extract' | 'mirror' | 'link' | 'world_clock';
  width?: number;
  wrapText?: boolean;
}

export interface BoardItem {
  id: string;
  name: string;
  groupId?: string;
  dynamicData: Record<string, any>;
  subitems?: any[];
}

interface ItemDetailPanelProps {
  item: BoardItem;
  columns: ColumnDef[];
  onUpdateItem: (itemId: string, data: Partial<BoardItem>) => void;
  onAddItemUpdate: (itemId: string, text: string) => void;
  onClose: () => void;
}

export const ItemDetailPanel: React.FC<ItemDetailPanelProps> = ({ item, columns, onUpdateItem, onAddItemUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'updates' | 'details' | 'files' | 'activity'>('updates');
  const [updateText, setUpdateText] = useState('');


  const getIconForType = (type: string) => {
    switch (type) {
      case 'status': return <ListFilter size={14} />;
      case 'person': return <User size={14} />;
      case 'date': return <Calendar size={14} />;
      case 'timeline': return <Clock size={14} />;
      case 'numbers': return <Hash size={14} />;
      case 'priority': return <Tag size={14} />;
      case 'text': return <Type size={14} />;
      case 'checkbox': return <Check size={14} />;
      case 'dropdown': return <ListFilter size={14} />;
      case 'link': return <ExternalLink size={14} />;
      case 'mirror': return <Copy size={14} />;
      case 'doc': return <FileText size={14} />;
      case 'formula': return <FunctionSquare size={14} />;
      default: return <Tag size={14} />;
    }
  };

  return (
    <div className="item-detail-overlay" onClick={onClose}>
      <div className="item-detail-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="idp-header">
          <button className="idp-close" onClick={onClose}>
            <X size={18} />
          </button>
          <div style={{ flex: 1, marginLeft: 12 }}>
            <h2 className="idp-title">{item.name}</h2>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Main Table</span> / {item.name}
            </div>
          </div>
          <div className="idp-header-actions">
            <div className="person-avatar" style={{ background: 'linear-gradient(135deg, #879CFF, #6C6CFF)', width: 30, height: 30, fontSize: 11 }}>
              {item.dynamicData.owner ? item.dynamicData.owner.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
            </div>
            <button className="idp-icon-btn">
              <MessageSquare size={16} />
            </button>
            <button className="idp-icon-btn">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="idp-tabs">
          <button className={`idp-tab ${activeTab === 'updates' ? 'active' : ''}`} onClick={() => setActiveTab('updates')}>
            <span style={{ marginRight: 4 }}>🏠</span> Updates
          </button>
          <button className={`idp-tab ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>
            Details
          </button>
          <button className={`idp-tab ${activeTab === 'files' ? 'active' : ''}`} onClick={() => setActiveTab('files')}>
            Files
          </button>
          <button className={`idp-tab ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
            Activity
          </button>
        </div>

        {/* Content */}
        <div className="idp-content">
          {activeTab === 'updates' && (
            <>
              {/* Rich Text Editor */}
              <div className="idp-editor">
                <div className="idp-editor-toolbar">
                  <button className="idp-editor-btn">¶</button>
                  <button className="idp-editor-btn"><strong>B</strong></button>
                  <button className="idp-editor-btn"><em>I</em></button>
                  <button className="idp-editor-btn"><u>U</u></button>
                  <button className="idp-editor-btn">🔗</button>
                  <button className="idp-editor-btn">☐</button>
                  <button className="idp-editor-btn">✨</button>
                </div>
                <textarea
                  className="idp-editor-area"
                  placeholder="Share progress, mention a teammate, or upload a file..."
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                />
                <div className="idp-editor-footer">
                  <div className="idp-editor-actions">
                    <button className="idp-editor-action">@</button>
                    <button className="idp-editor-action">📎</button>
                  </div>
                  <button
                    className="btn-update"
                    onClick={() => {
                      if (!updateText.trim()) return;
                      onAddItemUpdate(item.id, updateText.trim());
                      setUpdateText('');
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>

              {Array.isArray(item.dynamicData?.updates) && item.dynamicData.updates.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {item.dynamicData.updates.map((u: any) => (
                    <div key={u.id} style={{ border: '1px solid var(--border-light)', borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{u.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleString() : ''}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="idp-empty-state">
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
                  <h3 className="idp-empty-title">No updates yet</h3>
                  <p className="idp-empty-text">Everything is up to date!</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'details' && (
            <div className="idp-details-view">
              <div className="idp-details-group">
                <div className="idp-details-group-title">Columns</div>
                {columns.map(col => {
                  const val = item.dynamicData[col.id];
                  return (
                    <div key={col.id} className="idp-field-row">
                      <div className="idp-field-label">
                        {getIconForType(col.type)}
                        <span>{col.title}</span>
                      </div>
                      <div className="idp-field-value">
                        {col.type === 'status' || col.type === 'priority' || col.type === 'due_date_priority' || col.type === 'notes_category' ? (
                          <div className={`idp-inline-badge ${col.type === 'status' ? 'status-' + (val?.toLowerCase().replace(/ /g, '-') || 'blank') : ''}`} 
                               style={col.type !== 'status' ? { background: 'var(--bg-hover)', color: 'var(--text-primary)' } : {}}>
                            {val || '—'}
                          </div>
                        ) : col.type === 'timeline' ? (
                          <div className="idp-inline-pill">
                            {val ? `${val.start} - ${val.end}` : '—'}
                          </div>
                        ) : col.type === 'numbers' ? (
                          <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                            {val ? `$${val.toLocaleString()}` : '—'}
                          </div>
                        ) : (
                          <div style={{ color: 'var(--text-primary)' }}>{val || '—'}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="idp-empty-state">
              <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
              <h3 className="idp-empty-title">No files yet</h3>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="idp-empty-state">
              <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
              <h3 className="idp-empty-title">Activity Log</h3>
              <p className="idp-empty-text">Track all changes here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
