import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import * as Lucide from 'lucide-react';
import { cn } from './lib/utils';

const { 
  Check, ChevronDown, ChevronUp, Trash2, HelpCircle, CheckCircle, X, ListChecks,
} = Lucide as any;
import { Sidebar } from './components/Layout/Sidebar';
import { TopBar } from './components/Layout/TopBar';
import { BoardHeader } from './components/Board/BoardHeader';
import { BoardHeavySkeleton } from './components/Board/board-heavy-skeleton';
import { ItemDetailPanel } from './components/Board/ItemDetailPanel';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ProfileView } from './components/Views/ProfileView';
import { TasksView } from './components/Views/TasksView';
import { MembersView } from './components/Views/MembersView';
import { SettingsView } from './components/Views/SettingsView';
import { InboxView } from './components/Views/InboxView';
import { NotificationsView } from './components/Views/NotificationsView';
import type { BoardGroup, ColumnDef, BoardItem } from './components/Board/VirtualBoard';

import { Login } from './components/Auth/Login';
import { AuthLayout } from './components/Auth/AuthLayout';
import { SwitchWorkspaceModal } from './components/Layout/SwitchWorkspaceModal';
import {
  useEcosystraBoardQuery,
  useEcosystraMeQuery,
  useEcosystraNotificationsQuery,
} from './hooks/use-ecosystra-queries';

const VirtualBoardLazy = lazy(() =>
  import('./components/Board/VirtualBoard').then((m) => ({ default: m.VirtualBoard }))
);
const KanbanViewLazy = lazy(() =>
  import('./components/Board/KanbanView').then((m) => ({ default: m.KanbanView }))
);

const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      isRead
    }
  }
`;

/* ============ GraphQL Mutations ============ */
const UPDATE_ITEM_DYNAMIC_DATA = gql`
  mutation UpdateItemDynamicData($id: ID!, $dynamicData: JSON!) {
    updateItemDynamicData(id: $id, dynamicData: $dynamicData) {
      id
      dynamicData
    }
  }
`;

const UPDATE_ITEM_NAME = gql`
  mutation UpdateItem($id: ID!, $name: String!) {
    updateItem(id: $id, name: $name) {
      id
      name
    }
  }
`;

const UPDATE_GROUP = gql`
  mutation UpdateGroup($id: ID!, $name: String, $color: String) {
    updateGroup(id: $id, name: $name, color: $color) {
      id
      name
      color
    }
  }
`;

const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!, $boardId: ID!, $color: String) {
    createGroup(name: $name, boardId: $boardId, color: $color) {
      id
      name
      color
    }
  }
`;

const DELETE_GROUP = gql`
  mutation DeleteGroup($id: ID!) {
    deleteGroup(id: $id)
  }
`;

const CREATE_ITEM = gql`
  mutation CreateItem($name: String!, $boardId: ID!, $groupId: ID, $parentItemId: ID, $dynamicData: JSON) {
    createItem(name: $name, boardId: $boardId, groupId: $groupId, parentItemId: $parentItemId, dynamicData: $dynamicData) {
      id
      name
      groupId
      dynamicData
    }
  }
`;

const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`;

const BULK_CREATE_ITEMS = gql`
  mutation BulkCreateItems($boardId: ID!, $groupId: ID!, $items: [JSON!]!) {
    bulkCreateItems(boardId: $boardId, groupId: $groupId, items: $items) {
      id
      name
      groupId
      dynamicData
    }
  }
`;

const UPDATE_BOARD = gql`
  mutation UpdateBoard($id: ID!, $name: String, $columns: JSON, $subitemColumns: JSON) {
    updateBoard(id: $id, name: $name, columns: $columns, subitemColumns: $subitemColumns) {
      id
      name
      columns
      subitemColumns
    }
  }
`;

const UPDATE_BOARD_METADATA = gql`
  mutation UpdateBoardMetadata($id: ID!, $metadata: JSON!) {
    updateBoardMetadata(id: $id, metadata: $metadata) {
      id
      metadata
    }
  }
`;

const ADD_ITEM_UPDATE = gql`
  mutation AddItemUpdate($id: ID!, $text: String!) {
    addItemUpdate(id: $id, text: $text) {
      id
      dynamicData
    }
  }
`;

const ARCHIVE_GROUP = gql`
  mutation ArchiveGroup($id: ID!) {
    archiveGroup(id: $id) {
      id
      name
      color
    }
  }
`;

const EXPORT_GROUP = gql`
  query ExportGroup($id: ID!) {
     exportGroup(id: $id)
  }
`;

/** Placeholder until GraphQL `me` or shell session user is applied (embedded shell only). */
const EXTERNAL_SHELL_USER_PLACEHOLDER = {
  id: "shell-pending",
  name: "User",
  email: "",
  status: "ONLINE",
  avatarUrl: null as string | null,
};

export type EcosystraShellUser = {
  id: string;
  name: string | null;
  email: string | null;
  status?: string;
  avatarUrl?: string | null;
};

const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($status: String!) {
    updateUserStatus(status: $status) {
      id
      status
    }
  }
`;

/* ============ Initial Definitions ============ */
const INITIAL_COLUMNS: ColumnDef[] = [
  { id: 'owner', title: 'Owner', type: 'person' },
  { id: 'status', title: 'Status', type: 'status' },
  { id: 'due_date', title: 'Due date', type: 'date' },
  { id: 'last_updated', title: 'Last updated', type: 'timestamp' },
  { id: 'notes', title: 'Notes', type: 'text' },
  { id: 'files', title: 'Files', type: 'file' },
  { id: 'timeline', title: 'Timeline', type: 'timeline' },
  { id: 'priority', title: 'Priority', type: 'priority' },
  { id: 'budget', title: 'Budget', type: 'numbers' },
  { id: 'due_date_priority', title: 'Due Date Pri...', type: 'due_date_priority' },
  { id: 'notes_category', title: 'Notes Categ...', type: 'notes_category' },
];

const INITIAL_SUBITEM_COLUMNS: ColumnDef[] = [
  { id: 'owner', title: 'Owner', type: 'person' },
  { id: 'status', title: 'Status', type: 'status' },
  { id: 'date', title: 'Date', type: 'date' },
];

const now = new Date().toISOString();

const DEMO_GROUPS: BoardGroup[] = [
  {
    id: 'new-group',
    name: 'New Group',
    color: '#A25DDC',
    items: [],
    columns: [...INITIAL_COLUMNS],
    primaryColumnTitle: 'Task'
  },
  {
    id: 'to-do',
    name: 'To-Do',
    color: '#579BFC',
    items: [
      {
        id: 'i1',
        name: 'Tender',
        groupId: 'to-do',
        subitemColumns: [...INITIAL_SUBITEM_COLUMNS],
        subitemPrimaryColumnTitle: 'Subitem',
        dynamicData: {
          owner: 'Ade Basir',
          status: 'Working on it',
          due_date: '2026-04-06',
          last_updated: now,
          notes: 'Action items',
          files: true,
          timeline: { start: '2026-04-06', end: '2026-04-07' },
          priority: 'Low',
          budget: 100,
          due_date_priority: 'Critical Priority',
          notes_category: 'Action Item',
        },
      },
      {
        id: 'i2',
        name: 'KOM',
        groupId: 'to-do',
        subitemColumns: [...INITIAL_SUBITEM_COLUMNS],
        subitemPrimaryColumnTitle: 'Subitem',
        dynamicData: {
          owner: '',
          status: 'Done',
          due_date: '2026-04-07',
          last_updated: now,
          notes: 'Meeting notes',
          files: false,
          timeline: { start: '2026-04-07', end: '2026-04-08' },
          priority: 'Medium',
          budget: 200,
        },
      },
      {
        id: 'i3',
        name: 'Project Overview',
        groupId: 'to-do',
        subitemColumns: [...INITIAL_SUBITEM_COLUMNS],
        subitemPrimaryColumnTitle: 'Subitem',
        dynamicData: {
          owner: '',
          status: 'Stuck',
          due_date: '2026-04-08',
          last_updated: now,
          notes: 'Other',
          files: false,
          timeline: { start: '2026-04-08', end: '2026-04-09' },
          priority: 'High',
          budget: 300,
        },
      }
    ],
    columns: [...INITIAL_COLUMNS],
    primaryColumnTitle: 'Task'
  },
  {
    id: 'completed',
    name: 'Completed',
    color: '#00C875',
    items: [],
    columns: [...INITIAL_COLUMNS],
    primaryColumnTitle: 'Task'
  },
];

/* ============ App Component ============ */

/* ============ Modal Components ============ */
const ColumnValidationContent = ({ modal }: { modal: any }) => {
  const [activeTab, setActiveTab] = React.useState<'conditional' | 'validation'>('conditional');
  const [showValues, setShowValues] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');
  const [ifCondition, setIfCondition] = React.useState('is');
  const [thenColumn, setThenColumn] = React.useState('Column');
  const [thenCondition, setThenCondition] = React.useState('Condition');
  const [thenValue, setThenValue] = React.useState('Value');
  
  // Dynamic statuses from board
  const statuses = modal.data?.statuses || [
    { color: '#c4c4c4', label: 'Not Started' }
  ];

  // Dynamic columns from board
  const columns = modal.data?.columns || [
    { id: 'owner', title: 'Owner', type: 'person' },
    { id: 'due_date', title: 'Due date', type: 'date' },
    { id: 'notes', title: 'Notes', type: 'text' }
  ];

  const isReady = activeTab === 'validation' ? (selectedValue !== '') : (thenColumn !== 'Column');

  React.useEffect(() => {
    if (modal.onReadyChange) modal.onReadyChange(isReady);
  }, [isReady]);

  React.useEffect(() => {
    if (modal.onChange) {
      modal.onChange({
        activeTab,
        ifCondition,
        ifValue: selectedValue,
        thenColumn,
        thenCondition,
        thenValue
      });
    }
  }, [activeTab, ifCondition, selectedValue, thenColumn, thenCondition, thenValue]);

  return (
    <div style={{ padding: '0 24px 24px' }}>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Set type and configuration:</div>
      
      {/* Conditional rule */}
      <div 
         style={{ 
           borderRadius: 8, padding: '16px', 
           background: activeTab === 'conditional' ? '#f5faff' : '#f5f6f8', 
           marginBottom: 12, cursor: 'pointer',
           boxShadow: activeTab === 'conditional' ? '0 0 0 1px #0073ea' : 'none'
         }}
         onClick={() => setActiveTab('conditional')}
      >
         <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', border: activeTab === 'conditional' ? '5px solid #0073ea' : '1px solid #d0d4e4', background: 'white', marginTop: 2, flexShrink: 0 }} />
            <div style={{ width: '100%' }}>
               <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>Conditional rule</div>
               <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Define a condition to restrict values in other columns</div>
               
               {activeTab === 'conditional' && (
                  <div style={{ border: '1px solid #d0d4e4', borderRadius: 8, padding: 16, background: 'white', marginTop: 16 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>If</span>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: '#f1f2f4', borderRadius: 4, fontSize: 13 }}>
                            <div style={{ background: '#00c875', color: 'white', borderRadius: 2, padding: 2, display: 'flex' }}><ListChecks size={10} /></div> Status
                         </div>
                         <div style={{ flex: 1, position: 'relative' }}>
                            <select 
                               value={ifCondition}
                               onChange={(e) => setIfCondition(e.target.value)}
                               style={{ width: '100%', padding: '6px 12px', border: '1px solid #d0d4e4', borderRadius: 4, appearance: 'none', background: 'white', fontSize: 13 }}
                            >
                               <option value="is">is</option>
                               <option value="is_not">is not</option>
                               <option value="is_not_empty">is not empty</option>
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: 8, top: 8, opacity: 0.5 }} />
                         </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                           <select 
                             value={selectedValue}
                             onChange={(e) => setSelectedValue(e.target.value)}
                             style={{ width: '100%', padding: '6px 12px', border: '1px solid #d0d4e4', borderRadius: 4, appearance: 'none', background: 'white', fontSize: 13 }}
                           >
                              <option value="">Select label</option>
                              <option value="all_done">All done labels</option>
                              {statuses.map((s: any) => <option key={s.label} value={s.label}>{s.label}</option>)}
                           </select>
                           <ChevronDown size={14} style={{ position: 'absolute', right: 8, top: 8, opacity: 0.5 }} />
                        </div>
                        <Trash2 size={14} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
                     </div>

                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Then</span>
                        <div style={{ flex: 1, position: 'relative' }}>
                           <select 
                             value={thenColumn}
                             onChange={(e) => setThenColumn(e.target.value)}
                             style={{ width: '100%', padding: '6px 12px', border: '1px solid #d0d4e4', borderRadius: 4, appearance: 'none', background: 'white', fontSize: 13 }}
                           >
                              <option value="Column">Column</option>
                              {columns.map((c: any) => (
                                <option key={c.id} value={c.id}>
                                  {c.title}
                                </option>
                              ))}
                           </select>
                           <ChevronDown size={14} style={{ position: 'absolute', right: 8, top: 8, opacity: 0.5 }} />
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                           <select 
                             value={thenCondition}
                             onChange={(e) => setThenCondition(e.target.value)}
                             style={{ width: '100%', padding: '6px 12px', border: '1px solid #d0d4e4', borderRadius: 4, appearance: 'none', background: 'white', fontSize: 13 }}
                           >
                              <option>Condition</option>
                              <option value="is_required">is required</option>
                              <option value="must_contain">must contain</option>
                              <option value="cant_contain">can't contain</option>
                           </select>
                           <ChevronDown size={14} style={{ position: 'absolute', right: 8, top: 8, opacity: 0.5 }} />
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                           <input 
                             type="text" 
                             placeholder="Value"
                             value={thenValue}
                             onChange={(e) => setThenValue(e.target.value)}
                             style={{ width: '100%', padding: '6px 12px', border: '1px solid #d0d4e4', borderRadius: 4, background: 'white', fontSize: 13, outline: 'none' }} 
                           />
                        </div>
                     </div>
                     
                     <div style={{ color: '#0073ea', fontSize: 13, cursor: 'pointer', marginTop: 12 }}>+ New column</div>
                  </div>
               )}
            </div>
         </div>
         {activeTab === 'conditional' && (
           <div style={{ marginTop: 16 }}>
             <button style={{ background: 'white', border: '1px solid #d0d4e4', borderRadius: 4, padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}>+ New rule</button>
           </div>
         )}
      </div>
      
      {/* Validation rule */}
      <div 
         style={{ 
           borderRadius: 8, padding: 16, 
           background: activeTab === 'validation' ? '#f5faff' : '#f5f6f8', 
           cursor: 'pointer',
           boxShadow: activeTab === 'validation' ? '0 0 0 1px #0073ea' : 'none',
           marginTop: 12
         }}
         onClick={() => setActiveTab('validation')}
      >
         <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', border: activeTab === 'validation' ? '5px solid #0073ea' : '1px solid #d0d4e4', background: 'white', marginTop: 2, flexShrink: 0 }} />
            <div style={{ width: '100%' }}>
               <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>Validation rule</div>
               <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Restrict the values of this column to specific labels or range</div>
               
               {activeTab === 'validation' && (
                  <div style={{ border: '1px solid #d0d4e4', borderRadius: 8, padding: 16, background: 'white', marginTop: 16 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                           <div style={{ background: '#00c875', color: 'white', borderRadius: 2, padding: 2, display: 'flex' }}><ListChecks size={12} /></div> Status
                        </div>
                        <Trash2 size={14} 
                          style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} 
                          onClick={(e: any) => { e.stopPropagation(); setSelectedValue(''); }}
                        />
                     </div>
                     
                     <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                           <select style={{ width: '100%', padding: '6px 12px', border: '1px solid #d0d4e4', borderRadius: 4, appearance: 'none', background: 'white', fontSize: 13, outline: 'none' }}>
                              <option>must contain</option>
                              <option>must not contain</option>
                           </select>
                           <ChevronDown size={14} style={{ position: 'absolute', right: 8, top: 8, opacity: 0.5 }} />
                        </div>
                        
                        <div style={{ flex: 1.5, position: 'relative' }}>
                           <div 
                              onClick={(e) => { e.stopPropagation(); setShowValues(!showValues); }}
                              style={{ width: '100%', padding: '6px 12px', border: showValues ? '1px solid #0073ea' : '1px solid #d0d4e4', borderRadius: 4, background: 'white', fontSize: 13, cursor: 'pointer', minHeight: 18, display: 'flex', alignItems: 'center' }}
                           >
                              {selectedValue || ''}
                              {showValues ? 
                                <ChevronUp size={14} style={{ position: 'absolute', right: 8, top: 8, color: '#0073ea' }} /> :
                                <ChevronDown size={14} style={{ position: 'absolute', right: 8, top: 8, opacity: 0.5 }} />
                              }
                           </div>
                           
                           {showValues && (
                              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: 'white', border: '1px solid #d0d4e4', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, padding: 8 }}>
                                 <div 
                                    style={{ padding: '6px 8px', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', background: '#f5f6f8', borderRadius: 4, marginBottom: 8 }}
                                    onClick={(e) => { e.stopPropagation(); setSelectedValue('All done labels'); setShowValues(false); }}
                                 >
                                    <div style={{ display: 'flex' }}>
                                       <div style={{ width: 10, height: 10, background: '#00c875', borderRadius: '50%' }} />
                                       <div style={{ width: 10, height: 10, background: '#0070d2', borderRadius: '50%', marginLeft: -4 }} />
                                    </div>
                                    All done labels
                                 </div>
                                 
                                 {statuses.map((s: any, i: number) => (
                                    <div 
                                      key={i} 
                                      style={{ padding: '8px 8px', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', borderRadius: 4 }}
                                      onClick={(e) => { e.stopPropagation(); setSelectedValue(s.label); setShowValues(false); }}
                                    >
                                       <div style={{ width: 10, height: 10, background: s.color, borderRadius: '50%' }} />
                                       {s.label}
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};


const GlobalModals = ({ setBoardRules }: { setBoardRules: any }) => {
  const [modal, setModal] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      const data = e.detail;
      data.onReadyChange = (ready: boolean) => setIsReady(ready);
      data.onChange = (changes: any) => setPendingChanges(changes);
      setModal(data);
      setPendingChanges(null);
      setIsReady(false);
    };
    window.addEventListener('show-god-modal', handler);
    return () => window.removeEventListener('show-god-modal', handler);
  }, []);

  if (!modal) return null;

  const handleSaveLocal = () => {
    if (modal.name === 'columnValidation') {
      const rulesPayload = pendingChanges || {};
      setBoardRules((prev: any[]) => [...prev, { columnId: modal.data?.columnId || 'status', ...rulesPayload }]);
      setModal(null);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('show-god-modal', { 
          detail: { 
            title: 'Settings saved', 
            message: 'The column validation rules have been applied successfully.', 
            type: 'info' 
          } 
        }));
      }, 300);
      return;
    }
    const val = modal.type === 'prompt' ? (document.getElementById('god-modal-input') as HTMLInputElement).value : true;
    setModal(null);
    modal.onClose?.(val);
  };

  const renderCustomContent = () => {
    if (modal.name === 'statusSettings') {
      return (
        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Add or edit labels</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[
              { color: '#00c875', label: 'Done' },
              { color: '#579bfc', label: 'Spent Catalyst' },
              { color: '#fdab3d', label: 'Working on it' },
              { color: '#a25ddc', label: 'Used Oil' },
              { color: '#df2f4a', label: 'Stuck' },
              { color: '#0086c0', label: 'Contaminated Oil' },
              { color: '#c4c4c4', label: 'Not Started' }
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', border: '1px solid #d0d4e4', borderRadius: 4 }}>
                <div style={{ width: 16, height: 16, background: s.color, borderRadius: 2 }} />
                <input type="text" defaultValue={s.label} style={{ border: 'none', fontSize: 13, width: '100%', outline: 'none' }} />
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', border: '1px dashed #d0d4e4', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>+ New label</div>
          </div>

          <div style={{ background: '#e1f4fc', padding: 16, borderRadius: 8, marginBottom: 24, position: 'relative' }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: '#1d2129' }}>Keep your data clean and reliable</div>
            <div style={{ fontSize: 13, color: '#323338', marginBottom: 12 }}>Set validation rules on your columns to keep your board accurate and consistent.</div>
            <div 
              style={{ color: '#0073ea', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('show-god-modal', { 
                  detail: { 
                    title: 'Column validation rules', 
                    type: 'custom', 
                    name: 'columnValidation', 
                    data: { 
                      ...modal.data, 
                      columnId: modal.data?.columnId || 'status' 
                    } 
                  } 
                }));
              }}
            >
              Set column validation rules
            </div>
          </div>

          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>Choose which colors indicate that an item is completed</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['#00c875', '#fdab3d', '#df2f4a', '#c4c4c4', '#0070d2', '#a25ddc', '#0086c0'].map((c, i) => (
              <div 
                key={i} 
                style={{ 
                  width: 24, height: 24, background: c, borderRadius: 4, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: i === 0 ? '2px solid #0073ea' : 'none'
                }}
              >
                {i < 4 && <Check size={14} color="white" />}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (modal.name === 'columnValidation') {
      return <ColumnValidationContent modal={modal} />;
    }

    return (
      <div style={{ padding: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
        {modal.type === 'prompt' ? (
          <div>
            <div style={{ marginBottom: 8 }}>{modal.message}</div>
            <input autoFocus id="god-modal-input" type="text" defaultValue={modal.defaultValue} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-default)', borderRadius: 4 }} />
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
             <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e1f4fc', color: '#0073ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>i</div>
             <div style={{ paddingTop: 4 }}>{modal.message}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(29, 33, 41, 0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 8, width: modal.name === 'columnValidation' ? 640 : (modal.type === 'custom' ? 500 : 400), boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
        <div style={{ padding: '24px 24px 16px', borderBottom: modal.name === 'columnValidation' ? 'none' : '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>{modal.title}</h2>
          <div style={{ display: 'flex', gap: 16 }}>
             {modal.name === 'columnValidation' && <><HelpCircle size={20} /><CheckCircle size={20} /></>}
             <X size={20} style={{cursor: 'pointer'}} onClick={() => setModal(null)} />
          </div>
        </div>
        
        {renderCustomContent()}

        <div style={{ padding: '16px 24px', background: '#f5f6f8', display: 'flex', gap: 12 }}>
          {modal.name === 'columnValidation' && (
            <button 
              style={{ marginRight: 'auto', background: 'none', border: 'none', color: '#0073ea', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
              onClick={() => { setModal(null); }}
            >
              Remove all
            </button>
          )}
          {(modal.type === 'prompt' || modal.type === 'custom') && modal.name !== 'columnValidation' && (
            <button onClick={() => setModal(null)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #d0d4e4', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
          )}
          <button 
            disabled={modal.name === 'columnValidation' ? !isReady : false}
            onClick={() => handleSaveLocal()} 
            style={{ 
              padding: '8px 24px', 
              background: (modal.name === 'columnValidation' && !isReady) ? '#e6e9ef' : '#0073ea', 
              color: (modal.name === 'columnValidation' && !isReady) ? '#676879' : 'white', 
              border: 'none', borderRadius: 4, cursor: (modal.name === 'columnValidation' && !isReady) ? 'default' : 'pointer',
              fontSize: 13, fontWeight: 500
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}


function AppContent({
  initialView = 'board',
  onRouteNavigate,
  useExternalShell = false,
  shellUser,
  onShellSignOut,
}: {
  initialView?: string;
  onRouteNavigate?: (view: string) => void;
  useExternalShell?: boolean;
  shellUser?: EcosystraShellUser | null;
  onShellSignOut?: () => void;
}) {
  const apollo = useApolloClient();

  /* ============ Authentication State ============ */
  const [currentUser, setCurrentUser] = useState<any>(() => {
    if (!useExternalShell) return null;
    if (shellUser?.id) {
      return {
        id: shellUser.id,
        name: shellUser.name || "User",
        email: shellUser.email || "",
        status: shellUser.status || "ONLINE",
        avatarUrl: shellUser.avatarUrl ?? null,
      };
    }
    return { ...EXTERNAL_SHELL_USER_PLACEHOLDER };
  });

  /* ============ Helper UI Components ============ */
  const [activeView, setActiveView] = useState(initialView);
  const [activeTab, setActiveTab] = useState('table');
  const [selectedItem, setSelectedItem] = useState<BoardItem | null>(null);
  const [groups, setGroups] = useState<BoardGroup[]>(DEMO_GROUPS);
  const [boardTitle, setBoardTitle] = useState("Task management");
  const [boardId, setBoardId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [savedViews, setSavedViews] = useState<any[]>([]);
  const [isBoardStarred, setIsBoardStarred] = useState(false);
  const [columnSettings, setColumnSettings] = useState<Record<string, any>>({});
  const [automations, setAutomations] = useState<any[]>([]);

  // --- Search & Filter State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<any>({ 
    personId: null, 
    rules: [],
    quick: {} // { columnId: [values] }
  });
  const [sortConfig, setSortConfig] = useState<any[]>([]); // Array of { id, direction }
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [viewSettings, setViewSettings] = useState({
    itemHeight: 'single' as 'single' | 'double' | 'triple',
    pinnedColumns: false,
    pinnedColumnsCount: 1,
    conditionalColoring: [] as any[],
    defaultValues: {} as Record<string, any>,
    groupBy: { columnId: null as string | null, sortOption: 'default', showEmpty: true }
  });
  const [boardRules, setBoardRules] = useState<any[]>([]);

  const { data: boardData } = useEcosystraBoardQuery();
  const { data: meData, refetch: refetchUser } = useEcosystraMeQuery();
  const { data: notifData, refetch: refetchNotifs } =
    useEcosystraNotificationsQuery();
  const [updateItemDynamicData] = useMutation(UPDATE_ITEM_DYNAMIC_DATA);
  const [updateItemName] = useMutation(UPDATE_ITEM_NAME);
  const [updateGroup] = useMutation(UPDATE_GROUP);
  const [createGroupMutation] = useMutation(CREATE_GROUP);
  const [deleteGroupMutation] = useMutation(DELETE_GROUP);
  const [createItemMutation] = useMutation(CREATE_ITEM);
  const [deleteItemMutation] = useMutation(DELETE_ITEM);
  const [bulkCreateItemsMutation] = useMutation(BULK_CREATE_ITEMS);
  const [updateBoardMutation] = useMutation(UPDATE_BOARD);
  const [updateBoardMetadataMutation] = useMutation(UPDATE_BOARD_METADATA);
  const [addItemUpdateMutation] = useMutation(ADD_ITEM_UPDATE);
  const [archiveGroupMutation] = useMutation(ARCHIVE_GROUP);
  
  const [updateUserStatusMutation] = useMutation(UPDATE_USER_STATUS);

  useEffect(() => {
    setActiveView(initialView);
  }, [initialView]);

  useEffect(() => {
    if (meData?.me) {
      setCurrentUser(meData.me);
    }
  }, [meData]);

  useEffect(() => {
    if (!useExternalShell || !shellUser?.id) return;
    setCurrentUser((prev: any) => ({
      ...prev,
      id: shellUser.id,
      name: shellUser.name || prev?.name || "User",
      email: shellUser.email ?? prev?.email ?? "",
      status: shellUser.status || prev?.status || "ONLINE",
      avatarUrl: shellUser.avatarUrl ?? prev?.avatarUrl ?? null,
    }));
  }, [useExternalShell, shellUser]);

  const handleUpdateStatus = async (status: string) => {
    try {
      await updateUserStatusMutation({ variables: { status } });
      refetchUser();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleLogout = () => {
    if (useExternalShell && onShellSignOut) {
      onShellSignOut();
      return;
    }
    setCurrentUser(null);
    window.location.reload();
  };

  useEffect(() => {
    const board = boardData?.getOrCreateBoard;
    if (!board) return;

    setBoardId(board.id);
    setBoardTitle(board.name || 'Task management');

    const boardColumns = Array.isArray(board.columns) && board.columns.length > 0 ? board.columns : INITIAL_COLUMNS;
    const metadata = board.metadata || {};
    setSavedViews(Array.isArray(metadata.savedViews) ? metadata.savedViews : []);
    setIsBoardStarred(!!metadata.starred);
    if (metadata.filters) setFilters(metadata.filters);
    if (Array.isArray(metadata.sortConfig)) setSortConfig(metadata.sortConfig);
    if (Array.isArray(metadata.hiddenColumns)) setHiddenColumns(metadata.hiddenColumns);
    if (metadata.viewSettings) {
      setViewSettings((prev) => ({
        ...prev,
        ...metadata.viewSettings
      }));
    }
    if (Array.isArray(metadata.boardRules)) setBoardRules(metadata.boardRules);
    setColumnSettings(metadata.columnSettings || {});
    setAutomations(Array.isArray(metadata.automations) ? metadata.automations : []);

    const boardSubitemColumns = Array.isArray(board.subitemColumns) && board.subitemColumns.length > 0 ? board.subitemColumns : INITIAL_SUBITEM_COLUMNS;

    const mappedGroups: BoardGroup[] = (board.groups || []).map((group: any) => ({
      id: group.id,
      name: group.name,
      color: group.color || '#579BFC',
      columns: [...boardColumns],
      primaryColumnTitle: 'Task',
      items: (board.items || [])
        .filter((item: any) => item.groupId === group.id)
        .map((item: any) => ({
          id: item.id,
          name: item.name,
          groupId: item.groupId,
          dynamicData: item.dynamicData || {},
          subitemColumns: [...boardSubitemColumns],
          subitemPrimaryColumnTitle: 'Subitem',
          subitems: (item.subitems || []).map((sub: any) => ({
            id: sub.id,
            name: sub.name,
            groupId: sub.groupId || item.groupId,
            dynamicData: sub.dynamicData || {},
            subitems: []
          }))
        }))
    }));

    if (mappedGroups.length > 0) {
      setGroups(mappedGroups);
    }
    setIsHydrated(true);
  }, [boardData]);

  useEffect(() => {
    if (!boardId || !isHydrated) return;
    const columns = groups[0]?.columns || INITIAL_COLUMNS;
    const firstSubitemColumns =
      groups.flatMap((g) => g.items).find((i) => (i.subitemColumns || []).length > 0)?.subitemColumns ||
      INITIAL_SUBITEM_COLUMNS;
    updateBoardMutation({
      variables: {
        id: boardId,
        name: boardTitle,
        columns,
        subitemColumns: firstSubitemColumns
      }
    }).catch(() => {});
  }, [boardId, boardTitle, groups, isHydrated, updateBoardMutation]);

  useEffect(() => {
    if (!boardId || !isHydrated) return;
    updateBoardMetadataMutation({
      variables: {
        id: boardId,
        metadata: {
          savedViews,
          starred: isBoardStarred,
          filters,
          sortConfig,
          hiddenColumns,
          viewSettings,
          boardRules,
          columnSettings,
          automations
        }
      }
    }).catch(() => {});
  }, [
    boardId,
    savedViews,
    isBoardStarred,
    filters,
    sortConfig,
    hiddenColumns,
    viewSettings,
    boardRules,
    columnSettings,
    automations,
    isHydrated,
    updateBoardMetadataMutation
  ]);

  const handleSetColumnDescription = (columnId: string, description: string) => {
    setColumnSettings((prev) => ({
      ...prev,
      [columnId]: {
        ...(prev[columnId] || {}),
        description
      }
    }));
  };

  const handleSetColumnRequired = (columnId: string, required: boolean) => {
    setColumnSettings((prev) => ({
      ...prev,
      [columnId]: {
        ...(prev[columnId] || {}),
        required
      }
    }));
  };

  const handleToggleColumnNotifications = (columnId: string) => {
    setColumnSettings((prev) => ({
      ...prev,
      [columnId]: {
        ...(prev[columnId] || {}),
        notificationsMuted: !prev[columnId]?.notificationsMuted
      }
    }));
  };

  const handleSetStatusLabels = (columnId: string, labels: { label: string; color: string }[]) => {
    setColumnSettings((prev) => ({
      ...prev,
      [columnId]: {
        ...(prev[columnId] || {}),
        labels
      }
    }));
  };

  const handleCreateAutomation = (type: string, columnId: string) => {
    setAutomations((prev) => [
      {
        id: `auto-${Date.now()}`,
        type,
        columnId,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const handleQuickAddTask = () => {
    const firstGroup = groups[0];
    if (!firstGroup) return;
    handleAddItem(firstGroup.id, 'New task');
  };

  const handleSaveView = (kind: 'filter' | 'sort' | 'groupby' | 'pin') => {
    const snapshot = {
      id: `view-${Date.now()}`,
      kind,
      name: `${kind} view ${savedViews.length + 1}`,
      createdAt: new Date().toISOString(),
      payload: {
        filters,
        sortConfig,
        viewSettings,
        hiddenColumns
      }
    };
    setSavedViews((prev) => [snapshot, ...prev].slice(0, 20));
  };

  const handleAddItemUpdate = (itemId: string, text: string) => {
    addItemUpdateMutation({ variables: { id: itemId, text } })
      .then((res) => {
        const updated = res.data?.addItemUpdate;
        if (!updated) return;
        setGroups((prev) => prev.map((g) => ({
          ...g,
          items: findAndModifyItem(g.items, itemId, (item) => ({
            ...item,
            dynamicData: updated.dynamicData || item.dynamicData
          }))
        })));
        setSelectedItem((prev) => prev && prev.id === itemId ? { ...prev, dynamicData: updated.dynamicData || prev.dynamicData } : prev);
      })
      .catch(() => {});
  };

  const handleItemClick = (item: BoardItem) => {
    setSelectedItem(item);
  };

  const handleAddGroup = async () => {
    const newGroup: BoardGroup = {
      id: `group-${Date.now()}`,
      name: 'New Group',
      color: '#0086c0',
      items: [],
    };
    setGroups([newGroup, ...groups]);
    if (boardId) {
      createGroupMutation({
        variables: { name: newGroup.name, boardId, color: newGroup.color }
      }).then((res) => {
        const created = res.data?.createGroup;
        if (!created) return;
        setGroups((prev) => prev.map((g) => g.id === newGroup.id ? { ...g, id: created.id } : g));
      }).catch(() => {});
    }
  };

  const handleUpdateGroup = (groupId: string, data: Partial<BoardGroup>) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, ...data } : g));
    updateGroup({
      variables: { id: groupId, name: data.name, color: data.color }
    }).catch(() => {});
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    if (!groupId.startsWith('group-')) {
      deleteGroupMutation({ variables: { id: groupId } }).catch(() => {});
    }
  };

  const handleArchiveGroup = (groupId: string) => {
    archiveGroupMutation({ variables: { id: groupId } })
      .then((res) => {
        const archived = res.data?.archiveGroup;
        if (!archived) return;
        setGroups((prev) => prev.map((g) => g.id === groupId ? { ...g, name: archived.name, color: archived.color || g.color } : g));
      })
      .catch(() => {});
  };

  const handleExportGroup = async (groupId: string) => {
    try {
      const result = await apollo.query({ query: EXPORT_GROUP, variables: { id: groupId }, fetchPolicy: 'no-cache' });
      const rows = result.data?.exportGroup || [];
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Group');
      XLSX.writeFile(wb, `group-${groupId}.xlsx`);
    } catch {
      // noop
    }
  };

  const handleDuplicateGroup = async (groupId: string, _includeUpdates: boolean = false) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    const newGroup: BoardGroup = {
      ...group,
      id: `group-${Date.now()}`,
      name: `Copy of ${group.name}`,
      items: group.items.map(item => ({
        ...item,
        id: `item-${Math.random().toString(36).substr(2, 9)}`,
        subitems: item.subitems?.map(si => ({
          ...si,
          id: `subitem-${Math.random().toString(36).substr(2, 9)}`
        }))
      }))
    };
    setGroups(prev => {
      const idx = prev.findIndex(g => g.id === groupId);
      const updated = [...prev];
      updated.splice(idx + 1, 0, newGroup);
      return updated;
    });

    if (!boardId) return;
    try {
      const groupRes = await createGroupMutation({
        variables: { name: newGroup.name, boardId, color: newGroup.color }
      });
      const createdGroup = groupRes.data?.createGroup;
      if (!createdGroup) return;

      setGroups((prev) => prev.map((g) => g.id === newGroup.id ? { ...g, id: createdGroup.id } : g));

      for (const sourceItem of group.items) {
        const itemRes = await createItemMutation({
          variables: {
            name: `${sourceItem.name}`,
            boardId,
            groupId: createdGroup.id,
            dynamicData: sourceItem.dynamicData || {}
          }
        });
        const createdItemId = itemRes.data?.createItem?.id;
        if (!createdItemId) continue;

        for (const subitem of (sourceItem.subitems || [])) {
          await createItemMutation({
            variables: {
              name: `${subitem.name}`,
              boardId,
              groupId: createdGroup.id,
              parentItemId: createdItemId,
              dynamicData: subitem.dynamicData || {}
            }
          });
        }
      }
    } catch {
      // noop
    }
  };

  // --- Recursive Helper for Nested Items ---
  const findAndModifyItem = (
    items: BoardItem[], 
    targetId: string, 
    modifyFn: (item: BoardItem) => BoardItem
  ): BoardItem[] => {
    return items.map(item => {
      if (item.id === targetId) return modifyFn(item);
      if (item.subitems && item.subitems.length > 0) {
        return {
          ...item,
          subitems: findAndModifyItem(item.subitems, targetId, modifyFn)
        };
      }
      return item;
    });
  };

  const handleUpdateItem = (itemId: string, data: Partial<BoardItem>) => {
    // --- Validation Enforcement ---
    if (data.dynamicData) {
      // Find the item to check its current state + new updates
      let itemToValidate: BoardItem | null = null;
      groups.forEach(g => {
        const found = g.items.find(i => i.id === itemId);
        if (found) itemToValidate = found;
      });

      if (itemToValidate) {
        const mergedData = { ...(itemToValidate as BoardItem).dynamicData, ...data.dynamicData };
        
        // Check against boardRules
        for (const rule of boardRules) {
          if (rule.activeTab === 'conditional') {
            const ifVal = mergedData[rule.ifColumn || 'status'];
            const ruleIfVal = rule.ifValue === 'all_done' ? 'Done' : rule.ifValue;
            
            let conditionMet = false;
            if (rule.ifCondition === 'is') conditionMet = ifVal === ruleIfVal;
            if (rule.ifCondition === 'is_not') conditionMet = ifVal !== ruleIfVal;
            if (rule.ifCondition === 'is_not_empty') conditionMet = !!ifVal;

            if (conditionMet) {
              const thenVal = mergedData[rule.thenColumn];
              if (rule.thenCondition === 'is_required' && !thenVal) {
                window.dispatchEvent(new CustomEvent('show-god-modal', { 
                  detail: { title: 'Validation Error', message: `Column "${rule.thenColumn}" is required when status is "${ifVal}".`, type: 'error' } 
                }));
                return; // Block update
              }
            }
          }
        }
      }
    }

    setGroups(prev => prev.map(g => ({
      ...g,
      items: findAndModifyItem(g.items, itemId, (item) => {
        const newItem = { ...item, ...data };
        if (data.dynamicData) {
          newItem.dynamicData = { ...item.dynamicData, ...data.dynamicData };
        }
        return newItem;
      })
    })));

    if (data.name) {
      updateItemName({ variables: { id: itemId, name: data.name } }).catch(() => {});
    }
    if (data.dynamicData) {
      (updateItemDynamicData as any)({ variables: { id: itemId, dynamicData: data.dynamicData } }).catch(() => {});
    }
  };

  const handleRenameBoard = (newTitle: string) => {
    setBoardTitle(newTitle);
  };

  const handleRenameColumn = (columnId: string, newTitle: string, level: number, contextId?: string) => {
    setGroups(prev => prev.map(g => {
      if (level === 0) {
        if (g.id !== contextId) return g;
        if (columnId === 'primary') return { ...g, primaryColumnTitle: newTitle };
        return {
          ...g,
          columns: (g.columns || INITIAL_COLUMNS).map(col => col.id === columnId ? { ...col, title: newTitle } : col)
        };
      } else {
        return {
          ...g,
          items: findAndModifyItem(g.items, contextId || '', (item) => {
            if (columnId === 'subitem-primary') return { ...item, subitemPrimaryColumnTitle: newTitle };
            return {
              ...item,
              subitemColumns: (item.subitemColumns || INITIAL_SUBITEM_COLUMNS).map(col => col.id === columnId ? { ...col, title: newTitle } : col)
            };
          })
        };
      }
    }));
  };

  const handleAddColumn = (groupId: string, type: string) => {
    const newCol: ColumnDef = {
      id: `col-${Date.now()}`,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      type: type as any,
    };
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, columns: [...(g.columns || INITIAL_COLUMNS), newCol] } : g));
  };

  const handleAddColumnRight = (groupId: string, afterId: string, type: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const columns = g.columns || INITIAL_COLUMNS;
      const index = afterId === 'primary' ? -1 : columns.findIndex(c => c.id === afterId);
      const newCol: ColumnDef = {
        id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: type.charAt(0).toUpperCase() + type.slice(1),
        type: type as any,
        width: 140
      };
      const newColumns = [...columns];
      newColumns.splice(index + 1, 0, newCol);
      return { ...g, columns: newColumns };
    }));
  };

  const handleToggleWrapText = (groupId: string, columnId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        columns: (g.columns || INITIAL_COLUMNS).map(col => 
          col.id === columnId ? { ...col, wrapText: !col.wrapText } : col
        )
      };
    }));
  };

  const handleAddSubsort = (columnId: string) => {
    setSortConfig(prev => {
      const alreadySorted = prev.some(s => s.columnId === columnId);
      if (alreadySorted) return prev;
      return [...prev, { columnId, direction: 'asc' }];
    });
  };

  const handleSaveOrder = () => {
    if (sortConfig.length === 0) return;
    
    setGroups(prev => prev.map(group => {
      const sortedItems = [...group.items].sort((a, b) => {
        for (const rule of sortConfig) {
          const valA = a.dynamicData[rule.columnId] || '';
          const valB = b.dynamicData[rule.columnId] || '';
          if (valA < valB) return rule.direction === 'asc' ? -1 : 1;
          if (valA > valB) return rule.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      return { ...group, items: sortedItems };
    }));
    
    setSortConfig([]);
  };

  const handleDuplicateColumn = (groupId: string, columnId: string, includeValues: boolean) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const columns = g.columns || INITIAL_COLUMNS;
      const colToDup = columns.find(c => c.id === columnId);
      if (!colToDup) return g;
      
      const newColId = `${columnId}-copy-${Date.now()}`;
      const newCol: ColumnDef = {
        ...colToDup,
        id: newColId,
        title: `${colToDup.title} (Copy)`
      };
      
      const newColumns = [...columns];
      const index = columns.findIndex(c => c.id === columnId);
      newColumns.splice(index + 1, 0, newCol);
      
      const newItems = g.items.map(item => {
        const newItem = { ...item, dynamicData: { ...item.dynamicData } };
        if (includeValues) {
          newItem.dynamicData[newColId] = item.dynamicData[columnId];
        } else {
          newItem.dynamicData[newColId] = '';
        }
        return newItem;
      });
      
      return { ...g, columns: newColumns, items: newItems };
    }));
  };

  const handleChangeColumnType = (groupId: string, columnId: string, newType: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        columns: (g.columns || INITIAL_COLUMNS).map(col => 
          col.id === columnId ? { ...col, type: newType as any } : col
        )
      };
    }));
  };

  const handleRemoveColumn = (groupId: string, columnId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const currentCols = g.columns || INITIAL_COLUMNS;
      return {
        ...g,
        columns: currentCols.filter(c => c.id !== columnId)
      };
    }));
  };

  const handleAddItem = (groupId: string, name: string) => {
    const defaultData = viewSettings.defaultValues || {};
    const newItem: BoardItem = {
      id: `item-${Date.now()}`,
      name,
      groupId,
      dynamicData: { 
        status: '', owner: '', due_date: '', last_updated: new Date().toISOString(), 
        notes: '', files: false, timeline: null, priority: '', budget: '', 
        due_date_priority: '', notes_category: '',
        ...defaultData
      },
      subitems: [],
    };
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, items: [...g.items, newItem] } : g
    ));
    if (boardId) {
      createItemMutation({
        variables: { name, boardId, groupId, dynamicData: newItem.dynamicData }
      }).then((res) => {
        const created = res.data?.createItem;
        if (!created) return;
        setGroups((prev) => prev.map((g) => ({
          ...g,
          items: g.items.map((i) => i.id === newItem.id ? { ...i, id: created.id } : i)
        })));
      }).catch(() => {});
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setGroups(prev => prev.map(g => ({
      ...g,
      items: g.items.filter(i => i.id !== itemId)
    })));
    if (!itemId.startsWith('item-') && !itemId.startsWith('sub-') && !itemId.startsWith('import-')) {
      deleteItemMutation({ variables: { id: itemId } }).catch(() => {});
    }
  };

  const handleDuplicateItem = (item: BoardItem) => {
    const dup: BoardItem = {
      ...item,
      id: `item-${Date.now()}`,
      name: `${item.name} (copy)`,
      dynamicData: { ...item.dynamicData, last_updated: new Date().toISOString() },
    };
    setGroups(prev => prev.map(g =>
      g.id === item.groupId ? { ...g, items: [...g.items, dup] } : g
    ));

    if (boardId) {
      createItemMutation({
        variables: { name: dup.name, boardId, groupId: item.groupId, dynamicData: dup.dynamicData }
      }).then(async (res) => {
        const created = res.data?.createItem;
        if (!created) return;
        setGroups((prev) => prev.map((g) => ({
          ...g,
          items: g.items.map((i) => i.id === dup.id ? { ...i, id: created.id } : i)
        })));
        for (const subitem of (item.subitems || [])) {
          await createItemMutation({
            variables: {
              name: `${subitem.name}`,
              boardId,
              groupId: item.groupId,
              parentItemId: created.id,
              dynamicData: subitem.dynamicData || {}
            }
          });
        }
      }).catch(() => {});
    }
  };

  const handleAddSubitem = (parentItemId: string, name: string) => {
    const newSub: BoardItem = {
      id: `sub-${Date.now()}`,
      name: name || '',
      groupId: '', // Will be inherited
      dynamicData: { status: '', owner: '', date: '', last_updated: new Date().toISOString() },
      subitems: []
    };

    setGroups(prev => prev.map(g => ({
      ...g,
      items: findAndModifyItem(g.items, parentItemId, (item) => ({
        ...item,
        subitems: [...(item.subitems || []), { ...newSub, groupId: item.groupId }]
      }))
    })));
    if (boardId && !parentItemId.startsWith('item-') && !parentItemId.startsWith('sub-') && !parentItemId.startsWith('import-')) {
      const parentGroup = groups.find((g) => g.items.some((i) => i.id === parentItemId));
      createItemMutation({
        variables: {
          name,
          boardId,
          groupId: parentGroup?.id,
          parentItemId,
          dynamicData: newSub.dynamicData
        }
      }).catch(() => {});
    }
  };

  const handleAddSubitemColumn = (parentItemId: string, type: string) => {
    const newCol: ColumnDef = {
      id: `scol-${Date.now()}`,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      type: type as any,
    };
    setGroups(prev => prev.map(g => ({
      ...g,
      items: findAndModifyItem(g.items, parentItemId, (item) => ({ 
        ...item, 
        subitemColumns: [...(item.subitemColumns || INITIAL_SUBITEM_COLUMNS), newCol] 
      }))
    })));
  };

  const handleImportItems = (importedItems: any[]) => {
    if (groups.length === 0) return;
    const newGroups = [...groups];
    const targetGroup = newGroups[0];
    const newItems: BoardItem[] = importedItems.map((item, index) => ({
      id: `import-${Date.now()}-${index}`,
      name: item.name,
      groupId: targetGroup.id,
      dynamicData: item.dynamicData,
      subitems: []
    }));
    targetGroup.items = [...newItems, ...targetGroup.items];
    setGroups(newGroups);
    if (boardId && targetGroup?.id) {
      bulkCreateItemsMutation({
        variables: {
          boardId,
          groupId: targetGroup.id,
          items: importedItems.map((item) => ({
            name: item.name,
            dynamicData: item.dynamicData || {}
          }))
        }
      }).catch(() => {});
    }
  };

  // --- Filtering & Sorting Logic ---
  const filteredGroups = React.useMemo(() => {
    const processItemsRecursive = (items: BoardItem[]): BoardItem[] => {
      let result = items.map(item => {
        const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const filteredSubitems = item.subitems ? processItemsRecursive(item.subitems) : [];
        
        // Person filter check
        const matchesPerson = !filters.personId || item.dynamicData?.owner === filters.personId;
        
        // Quick Filters check (Multi-select within category, AND across categories)
        const matchesQuick = Object.entries(filters.quick || {}).every(([colId, selectedValues]: [string, any]) => {
          if (!selectedValues || selectedValues.length === 0) return true;
          const itemValue = colId === 'group' ? groups.find(g => g.items.some(i => i.id === item.id))?.name : item.dynamicData?.[colId];
          return selectedValues.includes(itemValue);
        });

        // Advanced Rules check (Recursive Group Evaluation)
        const evaluateFilterRule = (rule: any): boolean => {
          if (!rule.columnId || !rule.condition) return true;
          const itemValue = rule.columnId === 'group' ? groups.find(g => g.items.some(i => i.id === item.id))?.name : item.dynamicData?.[rule.columnId];
          
          const val = String(itemValue || '').toLowerCase();
          const target = String(rule.value || '').toLowerCase();

          switch (rule.condition) {
            case 'is': return val === target;
            case 'is_not': return val !== target;
            case 'contains': return val.includes(target);
            case 'not_contains': return !val.includes(target);
            case 'is_empty': return !itemValue;
            case 'is_not_empty': return !!itemValue;
            default: return true;
          }
        };

        const evaluateFilterGroup = (group: any): boolean => {
          if (!group || !group.rules || group.rules.length === 0) return true;
          const operator = group.operator || 'And';
          
          if (operator === 'And') {
            return group.rules.every((r: any) => r.rules ? evaluateFilterGroup(r) : evaluateFilterRule(r));
          } else {
            return group.rules.some((r: any) => r.rules ? evaluateFilterGroup(r) : evaluateFilterRule(r));
          }
        };

        const matchesRules = evaluateFilterGroup(filters.advanced);

        const shouldKeep = (matchesSearch || filteredSubitems.length > 0) && matchesPerson && matchesQuick && matchesRules;
        
        if (shouldKeep) {
          return { ...item, subitems: filteredSubitems };
        }
        return null;
      }).filter(Boolean) as BoardItem[];

      // Multi-layer Sort
      if (sortConfig.length > 0) {
        result.sort((a, b) => {
          for (const rule of sortConfig) {
            const valA = (a as any).dynamicData?.[rule.id] || (a as any)[rule.id] || (a as any).name;
            const valB = (b as any).dynamicData?.[rule.id] || (b as any)[rule.id] || (b as any).name;
            
            if (valA < valB) return rule.direction === 'asc' ? -1 : 1;
            if (valA > valB) return rule.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      return result;
    };

    const baseGroups = groups.map(group => ({
      ...group,
      items: processItemsRecursive(group.items)
    }));

    if (viewSettings.groupBy.columnId) {
      const colId = viewSettings.groupBy.columnId;
      const col = INITIAL_COLUMNS.find(c => c.id === colId);
      const groupedMap: Record<string, BoardItem[]> = {};
      
      // Handle "Show empty groups" for Status and Priority
      if (viewSettings.groupBy.showEmpty) {
        let possibleValues: string[] = [];
        if (col?.type === 'status') {
          possibleValues = ['Done', 'Working on it', 'Stuck', 'None'];
        } else if (col?.type === 'priority') {
          possibleValues = ['Critical', 'High', 'Medium', 'Low', 'None'];
        }
        possibleValues.forEach(val => {
          groupedMap[val] = [];
        });
      }

      // Flatten all filtered items
      const allItems: BoardItem[] = [];
      baseGroups.forEach(g => allItems.push(...g.items));

      allItems.forEach(item => {
        const val = item.dynamicData?.[colId] || 'None';
        const key = String(val);
        if (!groupedMap[key]) groupedMap[key] = [];
        groupedMap[key].push(item);
      });

      // Convert map to groups
      return Object.entries(groupedMap).map(([name, items]) => ({
        id: `grouped-${name}`,
        name: name === 'None' ? `No ${col?.title || colId}` : name,
        color: items[0]?.dynamicData?.[colId + '_color'] || '#808080',
        items: items,
        columns: baseGroups[0]?.columns || INITIAL_COLUMNS
      }));
    }

    return baseGroups;
  }, [groups, searchTerm, filters, sortConfig, viewSettings.groupBy]);

  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  const notifications = notifData?.notifications || [];
  const memberships = meData?.me?.memberships || [];

  const handleMarkAsRead = async (id: string) => {
    await markAsRead({ variables: { id } });
    refetchNotifs();
  };

  const handleNavigate = (view: string) => {
    if (view === 'switch') {
      setIsWorkspaceModalOpen(true);
    } else {
      onRouteNavigate?.(view);
      setActiveView(view.replace('/', '')); 
    }
  };

  if (!currentUser) {
    return (
      <AuthLayout>
        <Login onAuthenticated={(user) => setCurrentUser(user)} />
      </AuthLayout>
    );
  }

  const mainViewContent = (
    <div
      className={cn(
        'main-body',
        useExternalShell &&
          'flex min-h-0 flex-1 flex-col bg-transparent text-foreground antialiased'
      )}
      data-ecosystra-embedded={useExternalShell ? 'true' : undefined}
      data-item-height={viewSettings.itemHeight}
    >
      {activeView === 'board' && (
        <>
          <BoardHeader
            title={boardTitle}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddGroup={handleAddGroup}
            onImportItems={handleImportItems}
            onRenameBoard={setBoardTitle}
            onQuickAddTask={handleQuickAddTask}
            onSaveView={handleSaveView}
            isBoardStarred={isBoardStarred}
            onToggleBoardStar={() => setIsBoardStarred(!isBoardStarred)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onUpdateFilters={setFilters}
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
            hiddenColumns={hiddenColumns}
            onToggleColumn={(id) => setHiddenColumns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
            viewSettings={viewSettings}
            onUpdateViewSettings={(s) => setViewSettings(prev => ({...prev, ...s}))}
            allColumns={groups[0]?.columns || INITIAL_COLUMNS}
            groups={groups}
          />
          <Suspense
            fallback={
              <BoardHeavySkeleton
                variant={activeTab === "kanban" ? "kanban" : "table"}
              />
            }
          >
            {activeTab === "kanban" ? (
              <KanbanViewLazy
                groups={filteredGroups}
                onItemClick={setSelectedItem}
              />
            ) : (
              <VirtualBoardLazy
                groups={groups}
                selectedItem={selectedItem}
                onItemClick={handleItemClick}
                columnSettings={columnSettings}
                searchTerm={searchTerm}
                filters={filters}
                sortConfig={sortConfig}
                viewSettings={viewSettings}
                onUpdateGroup={handleUpdateGroup}
                onUpdateItem={handleUpdateItem}
                onAddColumn={handleAddColumn}
                onAddItem={handleAddItem}
                onDeleteItem={handleDeleteItem}
                onDuplicateItem={handleDuplicateItem}
                onAddSubitem={handleAddSubitem}
                onAddSubitemColumn={handleAddSubitemColumn}
                onRenameColumn={handleRenameColumn}
                onAddGroup={handleAddGroup}
                onDeleteGroup={handleDeleteGroup}
                onDuplicateGroup={handleDuplicateGroup}
                onAddColumnRight={handleAddColumnRight}
                onArchiveGroup={handleArchiveGroup}
                onExportGroup={handleExportGroup}
                onToggleWrapText={handleToggleWrapText}
                onAddSubsort={handleAddSubsort}
                onSaveOrder={handleSaveOrder}
                onDuplicateColumn={handleDuplicateColumn}
                onChangeColumnType={handleChangeColumnType}
                onRemoveColumn={handleRemoveColumn}
                onSetColumnDescription={handleSetColumnDescription}
                onSetColumnRequired={handleSetColumnRequired}
                onToggleColumnNotifications={handleToggleColumnNotifications}
                onSetStatusLabels={handleSetStatusLabels}
                onCreateAutomation={handleCreateAutomation}
              />
            )}
          </Suspense>
        </>
      )}
      {activeView === 'dashboard' && (
        <DashboardView boardTitle={boardTitle} />
      )}
      {activeView === 'profile' && (
        <ProfileView user={currentUser} onUpdateStatus={handleUpdateStatus} onLogout={handleLogout} />
      )}
      {activeView === 'tasks' && <TasksView />}
      {activeView === 'members' && <MembersView memberships={memberships} />}
      {activeView === 'settings' && <SettingsView />}
      {activeView === 'inbox' && <InboxView notifications={notifications} onMarkAsRead={handleMarkAsRead} />}
      {activeView === 'notifications' && <NotificationsView />}
    </div>
  );

  if (useExternalShell) {
    return (
      <>
        {mainViewContent}
        {selectedItem && (
          <ItemDetailPanel
            item={selectedItem}
            columns={INITIAL_COLUMNS}
            onAddItemUpdate={handleAddItemUpdate}
            onClose={() => setSelectedItem(null)}
            onUpdateItem={(id, data) => handleUpdateItem(id, data)}
          />
        )}
        <GlobalModals setBoardRules={() => {}} />
        <SwitchWorkspaceModal 
          isOpen={isWorkspaceModalOpen}
          onClose={() => setIsWorkspaceModalOpen(false)}
          onSelect={(id) => console.log('Switch to', id)}
          workspaces={[
            { id: '1', name: 'Main Workspace', role: 'Admin', isCurrent: true },
            { id: '2', name: 'Personal Projects', role: 'Member' },
            { id: '3', name: 'Client Work', role: 'Viewer' }
          ]}
        />
      </>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar onNavigate={handleNavigate} activeView={activeView} />
      <div className="main-content">
        <TopBar 
          user={currentUser} 
          onLogout={handleLogout} 
          onUpdateStatus={handleUpdateStatus} 
          onNavigate={handleNavigate}
        />
        {mainViewContent}
      </div>

      {selectedItem && (
        <ItemDetailPanel
          item={selectedItem}
          columns={INITIAL_COLUMNS}
          onAddItemUpdate={handleAddItemUpdate}
          onClose={() => setSelectedItem(null)}
          onUpdateItem={(id, data) => handleUpdateItem(id, data)}
        />
      )}
      <GlobalModals setBoardRules={() => {}} />

      <SwitchWorkspaceModal 
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onSelect={(id) => console.log('Switch to', id)}
        workspaces={[
          { id: '1', name: 'Main Workspace', role: 'Admin', isCurrent: true },
          { id: '2', name: 'Personal Projects', role: 'Member' },
          { id: '3', name: 'Client Work', role: 'Viewer' }
        ]}
      />
    </div>
  );
}

export default function App({
  initialView = 'board',
  onRouteNavigate,
  useExternalShell = false,
  shellUser,
  onShellSignOut,
}: {
  initialView?: string;
  onRouteNavigate?: (view: string) => void;
  useExternalShell?: boolean;
  shellUser?: EcosystraShellUser | null;
  onShellSignOut?: () => void;
}) {
  return (
    <AppContent
      initialView={initialView}
      onRouteNavigate={onRouteNavigate}
      useExternalShell={useExternalShell}
      shellUser={shellUser}
      onShellSignOut={onShellSignOut}
    />
  );
}


