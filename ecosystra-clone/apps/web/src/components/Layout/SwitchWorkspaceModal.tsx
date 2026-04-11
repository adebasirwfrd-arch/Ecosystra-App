import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Check, Plus, Search, ChevronRight } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  role: string;
  isCurrent?: boolean;
}

interface SwitchWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  onSelect: (id: string) => void;
}

export const SwitchWorkspaceModal: React.FC<SwitchWorkspaceModalProps> = ({ 
  isOpen, onClose, workspaces, onSelect 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ 
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', 
              zIndex: 1000, backdropFilter: 'blur(4px)' 
            }}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{ 
              position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
              width: '480px', background: 'white', borderRadius: '16px', 
              boxShadow: '0 24px 48px rgba(0,0,0,0.2)', zIndex: 1001,
              overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}
          >
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Switch Workspace</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Select an environment to view its boards and items.</p>
            </div>

            <div style={{ padding: '12px 24px', background: 'var(--bg-canvas)' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-disabled)' }} />
                <input 
                  placeholder="Search workspaces..."
                  style={{ 
                    width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', 
                    border: '1px solid var(--border-default)', outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '12px 0' }}>
              {workspaces.map((ws) => (
                <div 
                  key={ws.id}
                  onClick={() => { onSelect(ws.id); onClose(); }}
                  style={{ 
                    padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '16px',
                    cursor: 'pointer', transition: 'background 0.2s',
                    background: ws.isCurrent ? 'var(--primary-selected)' : 'transparent'
                  }}
                  className="ws-item"
                >
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '8px', 
                    background: ws.isCurrent ? 'var(--primary)' : 'var(--bg-hover)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: ws.isCurrent ? 'white' : 'var(--text-secondary)',
                    fontWeight: 700, fontSize: '18px'
                  }}>
                    {ws.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>{ws.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ws.role}</div>
                  </div>
                  {ws.isCurrent ? <Check size={18} color="var(--primary)" /> : <ChevronRight size={16} color="var(--text-disabled)" />}
                </div>
              ))}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-canvas)' }}>
              <button style={{ 
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', borderRadius: '12px', border: '2px dashed var(--border-default)',
                background: 'white', color: 'var(--text-secondary)', fontWeight: 600,
                cursor: 'pointer'
              }}>
                <Plus size={18} /> Create New Workspace
              </button>
            </div>
          </motion.div>
          <style dangerouslySetInnerHTML={{ __html: `
            .ws-item:hover {
              background: var(--bg-hover) !important;
            }
          `}} />
        </>
      )}
    </AnimatePresence>
  );
};
