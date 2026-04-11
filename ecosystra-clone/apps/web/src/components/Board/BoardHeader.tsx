import React, { useState, useRef, useEffect } from 'react';
import * as Lucide from 'lucide-react';

const { 
  Plus, Search, Filter, ChevronDown, Star, ArrowUpDown, EyeOff, LayoutGrid, 
  MoreHorizontal, FileDown, FolderPlus, Pin, ChevronsUpDown, Pipette, Settings,
  X, Trash2, FileText, History, ChevronUp, Rows, Check,
  ListFilter, Type, HelpCircle, Sparkles, GripVertical, List, User, Calendar, 
  Clock, ArrowUpNarrowWide, ArrowDownWideNarrow, Hash, AlertCircle, Link, 
  CheckSquare, Mail, Phone, Tag, Layers, Flag
} = Lucide as any;
import { motion, AnimatePresence } from 'framer-motion';
import { ImportExcelModal } from '../Modals/ImportExcelModal';
import { Button } from '../../../../../../shadboard/full-kit/src/components/ui/button';
import { Input } from '../../../../../../shadboard/full-kit/src/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../../../../../shadboard/full-kit/src/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../../../shadboard/full-kit/src/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../../../shadboard/full-kit/src/components/ui/popover';

interface BoardHeaderProps {
  title: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddGroup: () => void;
  onImportItems: (items: any[]) => void;
  onRenameBoard: (title: string) => void;
  onQuickAddTask: () => void;
  onSaveView: (kind: 'filter' | 'sort' | 'groupby' | 'pin') => void;
  isBoardStarred?: boolean;
  onToggleBoardStar?: () => void;
  // Filter Props
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filters: any;
  onUpdateFilters: (filters: any) => void;
  sortConfig: any[]; // Multi-sort rules
  onSortChange: (config: any[]) => void;
  hiddenColumns: string[];
  onToggleColumn: (id: string) => void;
  viewSettings: { 
    itemHeight: 'single' | 'double' | 'triple', 
    pinnedColumns: boolean,
    pinnedColumnsCount: number,
    conditionalColoring: any[],
    defaultValues: Record<string, any>,
    groupBy?: { columnId: string | null, sortOption: string, showEmpty: boolean }
  };
  onUpdateViewSettings: (settings: any) => void;
  allColumns: any[];
  groups: any[];
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({ 
  title, activeTab, onTabChange, onAddGroup, onImportItems, onRenameBoard, onQuickAddTask, onSaveView, isBoardStarred, onToggleBoardStar,
  searchTerm, onSearchChange, filters, onUpdateFilters, sortConfig, onSortChange, hiddenColumns, onToggleColumn,
  viewSettings, onUpdateViewSettings, allColumns, groups
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [activeDropdown, setActiveDropdown] = useState<'filter' | 'sort' | 'hide' | 'more' | 'coloring' | 'defaults' | 'groupby' | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<'columns' | 'sort' | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [columnSearchTerm, setColumnSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState<'none' | 'coloring' | 'defaults'>('none');
  const [filterMode, setFilterMode] = useState<'quick' | 'advanced'>('advanced');
  const [isAiFilterEnabled, setIsAiFilterEnabled] = useState(false);

  useEffect(() => {
    const handleOpenDropdown = (e: any) => setActiveDropdown(e.detail);
    window.addEventListener('open-board-header-dropdown', handleOpenDropdown);
    return () => window.removeEventListener('open-board-header-dropdown', handleOpenDropdown);
  }, []);

  /* ============ Helper UI Components ============ */
  const renderColIcon = (colId: string, type?: string, size = 12) => {
    const isName = colId === 'name';
    const isGroup = colId === 'group';
    const isAll = colId === 'all';
    
    if (isName) return <div className="god-sort-type-icon purple" style={{ width: size + 6, height: size + 6 }}>Tt</div>;
    if (isGroup) return <div className="god-sort-type-icon yellow" style={{ width: size + 6, height: size + 6 }}>G</div>;
    if (isAll) return <div className="god-sort-type-icon grey" style={{ width: size + 6, height: size + 6 }}><Layers size={size} /></div>;

    const lowerId = colId.toLowerCase();
    const lowerType = (type || '').toLowerCase();

    const isStatus = lowerType === 'status' || lowerId === 'status';
    const isPriority = lowerType === 'priority' || lowerId === 'priority' || lowerId.includes('priority');
    const isPerson = lowerType === 'person' || lowerId === 'owner';
    const isDate = lowerType === 'date' || lowerId === 'due_date';
    const isTimeline = lowerType === 'timeline';
    const isHistory = lowerId === 'last_updated' || lowerType === 'history';
    const isNumbers = lowerType === 'numbers' || lowerId === 'budget';
    const isText = lowerType === 'text' || lowerId === 'notes';
    const isFiles = lowerType === 'files' || lowerId === 'files';
    const isLink = lowerType === 'link';
    const isCheckbox = lowerType === 'checkbox';
    const isMail = lowerType === 'email';
    const isPhone = lowerType === 'phone';
    const isTag = lowerType === 'tags' || lowerId.includes('category');

    const iconColor = 
      isStatus ? 'green' : 
      isPriority ? 'green' : 
      isDate || isTimeline || isHistory ? 'purple' : 
      isPerson ? 'blue' : 
      isNumbers ? 'yellow' : 
      isText ? 'yellow' : 
      isTag ? 'green' :
      isFiles ? 'red' : 'grey';

    const IconComp = 
      isStatus ? List : 
      isPriority ? Flag : 
      isPerson ? User : 
      isDate ? Calendar : 
      isTimeline ? Rows : 
      isHistory ? History :
      isNumbers ? Hash : 
      isText ? Type : 
      isFiles ? FileText : 
      isLink ? Link : 
      isCheckbox ? CheckSquare : 
      isMail ? Mail : 
      isPhone ? Phone : 
      isTag ? Tag : HelpCircle;

    return (
      <div className={`god-sort-type-icon ${iconColor}`} style={{ width: size + 6, height: size + 6 }}>
        <IconComp size={size} />
      </div>
    );
  };

  /* ============ Advanced Filter Helpers ============ */
  const getConditionsForColumn = (colId: string) => {
    const col = allColumns.find(c => c.id === colId);
    if (!col) return ['is', 'is_not', 'contains'];
    if (col.type === 'status' || col.type === 'priority') return ['is', 'is_not', 'is_empty', 'is_not_empty'];
    if (col.type === 'date' || col.type === 'timeline') return ['is', 'is_not', 'is_before', 'is_after', 'is_empty'];
    if (col.type === 'numbers') return ['is', 'is_not', 'greater_than', 'less_than'];
    return ['is', 'is_not', 'contains', 'not_contains', 'is_empty', 'is_not_empty'];
  };

  const renderFilterGroup = (group: any, path: number[]) => {
    return (
      <div className={`god-rule-group ${path.length > 0 ? 'nested' : ''}`}>
        <div className="god-group-header">
          <div className="dropdown-box-god-small">
            <select 
              value={group.operator} 
              onChange={(e) => {
                const nextAdvanced = { ...filters.advanced };
                let target = nextAdvanced;
                for (let i = 0; i < path.length; i++) target = target.rules[path[i]];
                target.operator = e.target.value;
                onUpdateFilters({ ...filters, advanced: nextAdvanced });
              }}
            >
              <option value="And">And</option>
              <option value="Or">Or</option>
            </select>
            <ChevronDown size={12} color="#676879" />
          </div>
        </div>

        <div className="god-group-rules">
          {group.rules.map((rule: any, idx: number) => {
            const currentPath = [...path, idx];
            if (rule.rules) {
              return (
                <div key={idx} style={{ position: 'relative' }}>
                   {renderFilterGroup(rule, currentPath)}
                   <button 
                    className="remove-rule-btn"
                    onClick={() => {
                      const nextAdvanced = { ...filters.advanced };
                      let target = nextAdvanced;
                      for (let i = 0; i < path.length; i++) target = target.rules[path[i]];
                      target.rules = target.rules.filter((_: any, i: number) => i !== idx);
                      onUpdateFilters({ ...filters, advanced: nextAdvanced });
                    }}
                   >×</button>
                </div>
              );
            }

            return (
              <div key={idx} className="rule-row-god">
                <span className="rule-prefix">{idx === 0 ? 'Where' : group.operator}</span>
                
                <div className="dropdown-box-god">
                  <select 
                    value={rule.columnId} 
                    onChange={(e) => {
                      const nextAdvanced = { ...filters.advanced };
                      let target = nextAdvanced;
                      for (let i = 0; i < path.length; i++) target = target.rules[path[i]];
                      target.rules[idx].columnId = e.target.value;
                      onUpdateFilters({ ...filters, advanced: nextAdvanced });
                    }}
                  >
                    <option value="">Column</option>
                    <option value="group">Group</option>
                    <option value="name">Name</option>
                    {allColumns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                  <ChevronDown size={14} color="#676879" />
                </div>

                <div className="dropdown-box-god">
                  <select 
                    value={rule.condition}
                    onChange={(e) => {
                      const nextAdvanced = { ...filters.advanced };
                      let target = nextAdvanced;
                      for (let i = 0; i < path.length; i++) target = target.rules[path[i]];
                      target.rules[idx].condition = e.target.value;
                      onUpdateFilters({ ...filters, advanced: nextAdvanced });
                    }}
                  >
                    {getConditionsForColumn(rule.columnId).map(cond => (
                      <option key={cond} value={cond}>{cond.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} color="#676879" />
                </div>

                <div className="dropdown-box-god">
                  <input 
                    placeholder="Value"
                    value={rule.value} 
                    onChange={(e) => {
                      const nextAdvanced = { ...filters.advanced };
                      let target = nextAdvanced;
                      for (let i = 0; i < path.length; i++) target = target.rules[path[i]];
                      target.rules[idx].value = e.target.value;
                      onUpdateFilters({ ...filters, advanced: nextAdvanced });
                    }}
                  />
                </div>

                <button 
                  className="remove-rule-btn"
                  onClick={() => {
                    const nextAdvanced = { ...filters.advanced };
                    let target = nextAdvanced;
                    for (let i = 0; i < path.length; i++) target = target.rules[path[i]];
                    target.rules = target.rules.filter((_: any, i: number) => i !== idx);
                    onUpdateFilters({ ...filters, advanced: nextAdvanced });
                  }}
                >×</button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const toolbarRef = useRef<HTMLDivElement>(null);
  const titleEditRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isEditingTitle && titleEditRef.current) {
      titleEditRef.current.focus();
      titleEditRef.current.select();
    }
  }, [isEditingTitle]);

  const handleImport = (items: any[]) => {
    onImportItems(items);
  };

  return (
    <div className="board-header">
      {/* Title row */}
      <div className="board-title-row">
        {isEditingTitle ? (
          <Input
            ref={titleEditRef}
            className="board-title-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={() => { setIsEditingTitle(false); onRenameBoard(editTitle); }}
            onKeyDown={(e) => { 
              if (e.key === 'Enter') { setIsEditingTitle(false); onRenameBoard(editTitle); }
              if (e.key === 'Escape') { setIsEditingTitle(false); setEditTitle(title); }
            }}
          />
        ) : (
          <h1 className="board-title" onClick={() => setIsEditingTitle(true)}>{title}</h1>
        )}
        <Star size={18} className="board-star" onClick={onToggleBoardStar} fill={isBoardStarred ? 'currentColor' : 'none'} />
        
        <div style={{ marginLeft: 'auto' }}>
          <Button variant="ghost" size="icon" className="idp-icon-btn">
            <MoreHorizontal size={18} />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="board-tabs">
        <button className={`board-tab ${activeTab === 'table' ? 'active' : ''}`} onClick={() => onTabChange('table')}>
          Main table
        </button>
        <button className="board-tab" style={{ opacity: 0.5, cursor: 'default', fontSize: 12 }}>⋯</button>
        <button className={`board-tab ${activeTab === 'kanban' ? 'active' : ''}`} onClick={() => onTabChange('kanban')}>
          Kanban
        </button>
        <button className="board-tab" style={{ color: 'var(--text-disabled)' }}>+</button>
      </div>

      {/* Toolbar */}
      {activeTab === 'table' && (
        <div className="board-toolbar" ref={toolbarRef}>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
              <Button className="btn-new-task" style={{ borderRadius: '4px 0 0 4px', borderRight: '1px solid rgba(255,255,255,0.2)' }} onClick={onQuickAddTask}>
                <Plus size={16} /> New task
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    className="btn-new-task"
                    style={{ borderRadius: '0 4px 4px 0', padding: '0 8px' }}
                  >
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={onAddGroup}>
                    <FolderPlus size={16} style={{ marginRight: 8 }} />
                    New group of tasks
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsImportModalOpen(true)}>
                    <FileDown size={16} style={{ marginRight: 8 }} />
                    Import tasks
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search */}
          <div className={`toolbar-item-container ${isSearchExpanded ? 'expanded' : ''}`} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <AnimatePresence mode="wait">
              {!isSearchExpanded ? (
                <motion.div
                  key="search-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button variant="outline" className="btn-toolbar" onClick={() => setIsSearchExpanded(true)}>
                    <Search size={14} />
                    <span>Search</span>
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="search-input"
                  className="toolbar-search-expanded"
                  initial={{ width: 80, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 80, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                >
                  <Search size={14} style={{ position: 'absolute', left: 10, color: 'var(--text-secondary)' }} />
                  <Input
                    className="toolbar-search-input"
                    placeholder="Search this board" 
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                    onBlur={() => !searchTerm && setIsSearchExpanded(false)}
                    style={{ paddingLeft: 32, paddingRight: 32, width: '100%' }}
                  />
                  <Settings size={14} style={{ position: 'absolute', right: 10, color: 'var(--text-secondary)', cursor: 'pointer' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Dropdown (Dual Mode) — shell Popover */}
          <div style={{ position: 'relative' }}>
            <Popover
              open={activeDropdown === 'filter'}
              onOpenChange={(open) => setActiveDropdown(open ? 'filter' : null)}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`btn-toolbar ${filters.rules?.length > 0 || Object.values(filters.quick || {}).some((v: any) => v?.length > 0) ? 'active' : ''}`}
                >
                  <Filter size={14} />
                  <span>Filter</span>
                  <ChevronDown size={10} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="filter-suite-popover w-auto max-w-[min(95vw,960px)] p-0"
              >
                  <div className="premium-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 500, color: '#323338' }}>
                        {filterMode === 'quick' ? 'Quick filters' : 'Advanced filters'}
                      </span>
                      <span style={{ fontSize: 14, color: '#676879', marginTop: 2 }}>
                        Showing all of {(groups || []).reduce((acc, g) => acc + (g.items?.length || 0), 0)} tasks
                      </span>
                      <HelpCircle size={16} color="#676879" style={{ cursor: 'pointer' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <button className="text-btn-muted-premium" onClick={() => onUpdateFilters({ ...filters, rules: [], quick: {} })}>Clear all</button>
                      <button className="btn-premium-save-small" onClick={() => onSaveView('filter')}>Save as new view</button>
                    </div>
                  </div>
                  
                  <div className="premium-content">
                    {filterMode === 'quick' ? (
                      <div className="quick-filters-container-god">
                        <div style={{ fontSize: 16, fontWeight: 500, color: '#323338', marginBottom: 20 }}>All columns</div>
                        <div className="quick-filters-scroll-view">
                          {/* Group Column */}
                          <div className="god-filter-col" style={{ borderRight: '1px solid #f0f0f0', paddingRight: 24, marginRight: 24 }}>
                            <div className="god-filter-col-title">Group</div>
                            {(groups || []).map(g => {
                              if (!g) return null;
                              const isSelected = filters.quick?.group?.includes(g.name);
                              return (
                                <div key={g.id} className={`god-pill-item ${isSelected ? 'selected' : ''}`} onClick={() => {
                                  const current = filters.quick?.group || [];
                                  const next = isSelected ? current.filter((v: any) => v !== g.name) : [...current, g.name];
                                  onUpdateFilters({ ...filters, quick: { ...filters.quick, group: next } });
                                }}>
                                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: g.color || '#c4c4c4' }} />
                                  <span className="god-pill-label">{g.name || 'Untitled Group'}</span>
                                  <span className="god-pill-count">{g.items?.length || 0}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Name Column */}
                          <div className="god-filter-col" style={{ borderRight: '1px solid #f0f0f0', paddingRight: 24, marginRight: 24 }}>
                            <div className="god-filter-col-title">Name</div>
                            {(groups || []).flatMap(g => g.items || []).slice(0, 5).map((item: any) => {
                              if (!item) return null;
                              const isSelected = filters.quick?.name?.includes(item.name);
                              return (
                                <div key={item.id} className={`god-pill-item ${isSelected ? 'selected' : ''}`} onClick={() => {
                                  const current = filters.quick?.name || [];
                                  const next = isSelected ? current.filter((v: any) => v !== item.name) : [...current, item.name];
                                  onUpdateFilters({ ...filters, quick: { ...filters.quick, name: next } });
                                }}>
                                  <span className="god-pill-label">{item.name || 'Untitled Task'}</span>
                                  <span className="god-pill-count">1</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Dynamic Table Columns */}
                          {(allColumns || []).map((col: any) => {
                            // Extract unique values for this column from all items
                            const rawValues = (groups || []).flatMap(g => 
                              (g.items || []).map((i: any) => i.dynamicData?.[col.id])
                            ).filter(v => v !== undefined && v !== null && v !== '');
                            
                            let options = Array.from(new Set(rawValues));
                            
                            // Standard options for specific types to match benchmark
                            if (col.type === 'status') options = ['Working on it', 'Done', 'Stuck', 'Not Started'];
                            if (col.type === 'priority') options = ['High', 'Medium', 'Low', 'Blank'];
                            if (col.type === 'date') options = ['Overdue', 'Today', 'Tomorrow', 'This week'];
                            if (col.type === 'timeline') options = ['Current', 'Due today', 'Future', 'Past', 'Milestone'];

                            return (
                              <div key={col.id} className="god-filter-col" style={{ borderRight: '1px solid #f0f0f0', paddingRight: 24, marginRight: 24 }}>
                                <div className="god-filter-col-title">{col.title}</div>
                                {options.map((val: any) => {
                                  // Formatting for display
                                  let label = String(val);
                                  if (col.type === 'timeline' && val && typeof val === 'object') {
                                    label = `${val.start} - ${val.end}`;
                                  } else if (val === null || val === undefined || val === '') {
                                    label = 'Blank';
                                  }

                                  const isSelected = filters.quick?.[col.id]?.includes(val);
                                  const count = rawValues.filter(v => 
                                    typeof v === 'object' ? JSON.stringify(v) === JSON.stringify(val) : v === val
                                  ).length;
                                  
                                  return (
                                    <div 
                                      key={`${col.id}-${label}`} 
                                      className={`god-pill-item ${isSelected ? 'selected' : ''}`} 
                                      onClick={() => {
                                        const current = filters.quick?.[col.id] || [];
                                        const next = isSelected ? current.filter((v: any) => v !== val) : [...current, val];
                                        onUpdateFilters({ ...filters, quick: { ...filters.quick, [col.id]: next } });
                                      }}
                                    >
                                      {/* Icon/Color based on type */}
                                      {col.type === 'status' || col.type === 'priority' ? (
                                        <div style={{ 
                                          width: 10, 
                                          height: 10, 
                                          borderRadius: '50%', 
                                          backgroundColor: 
                                            val === 'Done' ? '#00c875' : 
                                            val === 'Working on it' ? '#fdab3d' : 
                                            val === 'Stuck' ? '#e2445c' : 
                                            val === 'High' ? '#BB3354' :
                                            val === 'Medium' ? '#fdab3d' :
                                            val === 'Low' ? '#579bfc' : '#c4c4c4' 
                                        }} />
                                      ) : col.type === 'person' ? (
                                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
                                          {typeof val === 'string' ? val[0] : '?'}
                                        </div>
                                      ) : null}
                                      
                                      <span className="god-pill-label">{label}</span>
                                      <span className="god-pill-count">{count || '-'}</span>
                                    </div>
                                  );
                                })}
                                {/* Fallback for empty custom columns */}
                                {options.length === 0 && (
                                  <div style={{ fontSize: 12, color: '#c4c4c4', fontStyle: 'italic', padding: '8px 12px' }}>No options found</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="advanced-god-container">
                        <div className="ai-toggle-row-premium">
                          <label className="switch-god-tier">
                            <input type="checkbox" checked={isAiFilterEnabled} onChange={() => setIsAiFilterEnabled(!isAiFilterEnabled)} />
                            <span className="slider-god-tier"></span>
                          </label>
                          <span>Filter with AI</span>
                          <Sparkles size={14} color="#a25ddc" style={{ marginLeft: -4 }} />
                        </div>

                        {/* Rendering the root advanced group */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {renderFilterGroup(filters.advanced || { operator: 'And', rules: [{ columnId: '', condition: 'is', value: '' }] }, [])}
                        </div>

                        <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
                          <button 
                            className="text-btn-blue-god"
                            onClick={() => {
                              const nextAdvanced = { ...(filters.advanced || { operator: 'And', rules: [] }) };
                              nextAdvanced.rules = [...(nextAdvanced.rules || []), { columnId: '', condition: 'is', value: '' }];
                              onUpdateFilters({ ...filters, advanced: nextAdvanced });
                            }}
                          >
                            + New filter
                          </button>
                          <button 
                            className="text-btn-blue-god"
                            onClick={() => {
                               const nextAdvanced = { ...(filters.advanced || { operator: 'And', rules: [] }) };
                               nextAdvanced.rules = [...(nextAdvanced.rules || []), { operator: 'And', rules: [{ columnId: '', condition: 'is', value: '' }] }];
                               onUpdateFilters({ ...filters, advanced: nextAdvanced });
                            }}
                          >
                            + New group
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="premium-footer">
                    <button 
                      style={{ background: 'none', border: 'none', color: '#323338', fontSize: 14, cursor: 'pointer' }} 
                      onClick={() => setFilterMode(filterMode === 'quick' ? 'advanced' : 'quick')}
                    >
                      {filterMode === 'quick' ? 'Switch to advanced filters' : 'Switch to quick filters'}
                    </button>
                  </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Sort */}
          <div style={{ position: 'relative' }}>
            <Popover
              open={activeDropdown === 'sort'}
              onOpenChange={(open) => setActiveDropdown(open ? 'sort' : null)}
            >
              <PopoverTrigger asChild>
                <Button variant="outline" className={`btn-toolbar ${sortConfig.length > 0 ? 'active' : ''}`}>
                  <ArrowUpDown size={14} />
                  <span>Sort</span>
                  {sortConfig.length > 0 && <span className="toolbar-badge-blue">{sortConfig.length}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="filter-suite-popover sort-suite-popover"
                style={{ width: 440 }}
              >
                  <div className="premium-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 500, color: '#323338' }}>Sort by</span>
                      <HelpCircle size={16} color="#676879" style={{ cursor: 'pointer' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <button className="text-btn-muted-premium" onClick={() => onSortChange([])}>Clear all</button>
                      <button className="btn-premium-save-small" onClick={() => onSaveView('sort')}>Save as new view</button>
                    </div>
                  </div>

                  <div className="premium-content-sort">
                    {sortConfig.length === 0 ? (
                      <div className="empty-sort-state">
                        <p style={{ color: '#676879', fontSize: 14 }}>No sorting rules applied</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {sortConfig.map((rule, idx) => {
                          const col = allColumns.find(c => c.id === rule.id) || (rule.id === 'name' ? { id: 'name', title: 'Name', type: 'text' } : null);
                          
                          return (
                            <div key={idx} className="god-sort-row">
                              <div className="god-drag-handle">
                                <GripVertical size={16} color="#c4c4c4" />
                              </div>
                              
                              {/* Column Picker */}
                              <div className="god-sort-col-picker">
                                <div className="god-sort-icon-box">
                                  {renderColIcon(rule.id, col?.type)}
                                </div>
                                <select 
                                  value={rule.id}
                                  onChange={(e) => {
                                    const next = [...sortConfig];
                                    next[idx].id = e.target.value;
                                    onSortChange(next);
                                  }}
                                  className="god-sort-select"
                                >
                                  <option value="name">Name</option>
                                  <option value="group">Group</option>
                                  {allColumns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                                <ChevronDown size={14} color="#676879" />
                              </div>

                              {/* Direction Picker */}
                              <div className="god-sort-dir-picker">
                                <div className="god-sort-icon-box">
                                  {rule.direction === 'asc' ? <ArrowUpNarrowWide size={14} /> : <ArrowDownWideNarrow size={14} />}
                                </div>
                                <select 
                                  value={rule.direction}
                                  onChange={(e) => {
                                    const next = [...sortConfig];
                                    next[idx].direction = e.target.value as 'asc' | 'desc';
                                    onSortChange(next);
                                  }}
                                  className="god-sort-select"
                                >
                                  <option value="asc">Ascending</option>
                                  <option value="desc">Descending</option>
                                </select>
                                <ChevronDown size={14} color="#676879" />
                              </div>

                              <button className="god-rule-delete-btn" onClick={() => onSortChange(sortConfig.filter((_, i) => i !== idx))}>
                                <X size={18} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    <button 
                      className="text-btn-blue-god"
                      style={{ marginTop: 16 }}
                      onClick={() => onSortChange([...sortConfig, { id: 'name', direction: 'asc' }])}
                    >
                      + New sort
                    </button>
                  </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Hide */}
          <div style={{ position: 'relative' }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="btn-toolbar">
                  <EyeOff size={14} />
                  <span>Hide</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" style={{ minWidth: 280 }}>
                <div className="dropdown-search-wrapper">
                  <Search size={13} />
                  <Input
                    placeholder="Find columns"
                    className="dropdown-search-input"
                    value={columnSearchTerm}
                    onChange={(e) => setColumnSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenuCheckboxItem
                  checked={hiddenColumns.length === 0}
                  onCheckedChange={() => onToggleColumn('all')}
                >
                  <span style={{ marginRight: 8 }}>{renderColIcon('all', 'all', 11)}</span>
                  All columns
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Item columns</DropdownMenuLabel>
                {allColumns
                  .filter(col => col.title.toLowerCase().includes(columnSearchTerm.toLowerCase()))
                  .map((col: any) => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      checked={!hiddenColumns.includes(col.id)}
                      onCheckedChange={() => onToggleColumn(col.id)}
                    >
                      <span style={{ marginRight: 8 }}>{renderColIcon(col.id, col.type, 11)}</span>
                      {col.title}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Group by Suite — shell Popover */}
          <div style={{ position: 'relative' }}>
            <Popover
              open={activeDropdown === 'groupby'}
              onOpenChange={(open) => {
                if (!open) setActiveSubMenu(null);
                setActiveDropdown(open ? 'groupby' : null);
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`btn-toolbar ${viewSettings.groupBy?.columnId ? 'active-blue' : ''}`}
                >
                  <LayoutGrid size={14} />
                  <span>Group by {viewSettings.groupBy?.columnId ? `/ 1` : ''}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="dropdown-menu groupby-dropdown w-auto min-w-[300px] max-w-[440px] p-0"
              >
                  <div className="groupby-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="groupby-title">Group items by</span>
                      <HelpCircle size={14} style={{ color: '#676879', cursor: 'pointer' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <button className="btn-text-only" onClick={() => onUpdateViewSettings({ groupBy: { ...viewSettings.groupBy, columnId: null } })}>Clear</button>
                      <button className="btn-god-tier-save" onClick={() => onSaveView('groupby')}>Save as new view</button>
                    </div>
                  </div>

                  <div className="groupby-body">
                    <div className="groupby-selectors-row">
                      {/* Column Selector */}
                      <div className="groupby-selector-container">
                        <div className="groupby-custom-select" onClick={() => setActiveSubMenu(activeSubMenu === 'columns' ? null : 'columns')}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {renderColIcon(viewSettings.groupBy?.columnId || 'all', allColumns.find(c => c.id === viewSettings.groupBy?.columnId)?.type || 'all', 12)}
                            <span>{allColumns.find(c => c.id === viewSettings.groupBy?.columnId)?.title || 'All columns'}</span>
                          </div>
                          <ChevronDown size={14} className={activeSubMenu === 'columns' ? 'rotated' : ''} />
                        </div>
                        <AnimatePresence>
                          {activeSubMenu === 'columns' && (
                            <motion.div className="groupby-sub-menu" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}>
                               <div className="sub-menu-subtitle">Column options</div>
                               {allColumns.map(col => (
                                 <div 
                                   key={col.id} 
                                   className={`sub-menu-item ${viewSettings.groupBy?.columnId === col.id ? 'active' : ''}`}
                                   onClick={() => {
                                     onUpdateViewSettings({ groupBy: { ...viewSettings.groupBy, columnId: col.id } });
                                     setActiveSubMenu(null);
                                   }}
                                 >
                                   <div style={{ marginRight: 10 }}>{renderColIcon(col.id, col.type, 12)}</div>
                                   <span>{col.title}</span>
                                 </div>
                               ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Sort Strategy Selector */}
                      <div className="groupby-selector-container">
                        <div className="groupby-custom-select" onClick={() => setActiveSubMenu(activeSubMenu === 'sort' ? null : 'sort')}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <ArrowUpNarrowWide size={14} style={{ color: '#676879' }} />
                            <span>{viewSettings.groupBy?.sortOption || 'System default'}</span>
                          </div>
                          <ChevronDown size={14} className={activeSubMenu === 'sort' ? 'rotated' : ''} />
                        </div>
                        <AnimatePresence>
                          {activeSubMenu === 'sort' && (
                            <motion.div className="groupby-sub-menu" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}>
                               <div className="sub-menu-subtitle">Sort options</div>
                               <div className="sub-menu-item active" onClick={() => { onUpdateViewSettings({ groupBy: { ...viewSettings.groupBy, sortOption: 'System default' } }); setActiveSubMenu(null); }}>
                                 <ArrowUpNarrowWide size={14} style={{ marginRight: 10 }} />
                                 <span>System default</span>
                               </div>
                               <div className="sub-menu-item" onClick={() => { onUpdateViewSettings({ groupBy: { ...viewSettings.groupBy, sortOption: 'Reversed' } }); setActiveSubMenu(null); }}>
                                 <ArrowDownWideNarrow size={14} style={{ marginRight: 10 }} />
                                 <span>Reversed system default</span>
                               </div>
                               <div className="sub-menu-item" onClick={() => { onUpdateViewSettings({ groupBy: { ...viewSettings.groupBy, sortOption: 'Earliest' } }); setActiveSubMenu(null); }}>
                                 <ArrowUpNarrowWide size={14} style={{ marginRight: 10 }} />
                                 <span>Earliest to latest</span>
                               </div>
                               <div className="sub-menu-item" onClick={() => { onUpdateViewSettings({ groupBy: { ...viewSettings.groupBy, sortOption: 'Latest' } }); setActiveSubMenu(null); }}>
                                 <ArrowDownWideNarrow size={14} style={{ marginRight: 10 }} />
                                 <span>Latest to earliest</span>
                               </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="groupby-option-row">
                       <label className="god-checkbox-container">
                         <input 
                           type="checkbox" 
                           checked={viewSettings.groupBy?.showEmpty} 
                           onChange={(e) => onUpdateViewSettings({ groupBy: { ...viewSettings.groupBy, showEmpty: e.target.checked } })}
                         />
                         <div className="god-checkbox-box" />
                         <span>Show empty groups</span>
                       </label>
                    </div>
                  </div>

                  <div className="dropdown-divider" style={{ margin: '8px 0' }} />
                  <div className="groupby-feedback">
                    <div className="feedback-icon"><HelpCircle size={14} /></div>
                    <span>Give feedback</span>
                  </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* More actions menu ("...") */}
          <div style={{ position: 'relative' }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="btn-toolbar">
                  <MoreHorizontal size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" style={{ minWidth: 240 }}>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Pin size={14} style={{ marginRight: 8 }} />
                    Pin columns {viewSettings.pinnedColumnsCount > 0 ? `/ ${viewSettings.pinnedColumnsCount}` : ''}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent style={{ minWidth: 240 }}>
                    {[{ id: 'name', title: 'Name', type: 'text' }, ...allColumns].map((col, idx) => (
                      <DropdownMenuCheckboxItem
                        key={col.id}
                        checked={viewSettings.pinnedColumnsCount > idx}
                        onCheckedChange={() => onUpdateViewSettings({ pinnedColumnsCount: idx + 1 })}
                      >
                        <span style={{ marginRight: 8 }}>{renderColIcon(col.id, col.type, 11)}</span>
                        {col.title}
                      </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onSaveView('pin')}>
                      Save pin as new view
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ArrowUpDown size={14} style={{ marginRight: 8 }} />
                    Item height
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {(['single', 'double', 'triple'] as const).map((height) => (
                      <DropdownMenuItem
                        key={height}
                        onClick={() => onUpdateViewSettings({ itemHeight: height })}
                      >
                        <span style={{ textTransform: 'capitalize' }}>{height}</span>
                        {viewSettings.itemHeight === height && (
                          <Check size={12} style={{ marginLeft: 'auto' }} />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveModal('coloring')}>
                  <Pipette size={14} style={{ marginRight: 8 }} />
                  Conditional coloring
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveModal('defaults')}>
                  <Settings size={14} style={{ marginRight: 8 }} />
                  Default item values
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <Button variant="ghost" size="icon" className="idp-icon-btn" style={{ transform: 'rotate(180deg)' }}>
              <ChevronDown size={16} />
            </Button>
          </div>
        </div>
      )}

      <ImportExcelModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        boardColumns={allColumns}
      />

      <Dialog open={activeModal === 'coloring'} onOpenChange={(open) => !open && setActiveModal('none')}>
        <DialogContent className="modal-content coloring-modal sm:max-w-[760px] p-0">
          <DialogHeader className="modal-header p-0 text-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Pipette size={18} color="var(--brand-primary)" />
              <DialogTitle className="modal-title">Conditional coloring</DialogTitle>
            </div>
          </DialogHeader>
          <div className="modal-body">
            <DialogDescription className="modal-description">
              Highlight cells or rows based on specific conditions.
            </DialogDescription>

            <div className="rules-list">
              {(viewSettings?.conditionalColoring || []).map((rule: any, idx: number) => (
                <div key={idx} className="coloring-rule-item">
                  <div className="rule-color-swatch" style={{ background: rule.color }} />
                  <span className="rule-text">
                    If <strong>{allColumns.find(c => c.id === rule.columnId)?.title || rule.columnId}</strong> is <strong>{rule.value}</strong> then color <strong>{rule.scope}</strong>
                  </span>
                  <button
                    className="rule-delete-btn"
                    onClick={() => {
                      const newRules = [...(viewSettings.conditionalColoring || [])];
                      newRules.splice(idx, 1);
                      onUpdateViewSettings({ conditionalColoring: newRules });
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="add-rule-form">
              <div className="form-row" style={{ marginTop: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Quick Add Rule:</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['#e44258', '#42a5f5', '#66bb6a', '#ffca28', '#ab47bc'].map(c => (
                    <div
                      key={c}
                      className="color-option-circle"
                      style={{ background: c }}
                      onClick={() => {
                        const newRules = [...(viewSettings.conditionalColoring || []), { color: c, scope: 'row', columnId: 'status', operator: 'is', value: 'Done' }];
                        onUpdateViewSettings({ conditionalColoring: newRules });
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="modal-footer">
            <button className="btn-secondary" onClick={() => setActiveModal('none')}>Close</button>
            <button className="btn-primary" onClick={() => setActiveModal('none')}>Done</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === 'defaults'} onOpenChange={(open) => !open && setActiveModal('none')}>
        <DialogContent className="modal-content defaults-modal sm:max-w-[760px] p-0">
          <DialogHeader className="modal-header p-0 text-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Settings size={18} color="var(--brand-primary)" />
              <DialogTitle className="modal-title">Default item values</DialogTitle>
            </div>
          </DialogHeader>
          <div className="modal-body">
            <DialogDescription className="modal-description">
              Set values that will be automatically applied to any new task created on this board.
            </DialogDescription>

            <div className="defaults-list">
              {allColumns.map(col => (
                <div key={col.id} className="default-value-row">
                  <div className="col-info">
                    <span className="col-title">{col.title}</span>
                  </div>
                  <div className="col-input">
                    <input
                      type="text"
                      placeholder="Set default..."
                      className="defaults-input"
                      value={viewSettings.defaultValues?.[col.id] || ''}
                      onChange={(e) => {
                        const newDefaults = { ...(viewSettings.defaultValues || {}), [col.id]: e.target.value };
                        onUpdateViewSettings({ defaultValues: newDefaults });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="modal-footer">
            <button className="btn-secondary" onClick={() => setActiveModal('none')}>Cancel</button>
            <button className="btn-primary" onClick={() => setActiveModal('none')}>Save changes</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

