import React from 'react';
import { GodTierView } from './GodTierView';
import { Users, UserPlus, Shield, MoreVertical, Search, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface MembersViewProps {
  memberships: any[];
}

export const MembersView: React.FC<MembersViewProps> = ({ memberships }) => {
  // Fallback if no memberships provided
  const displayMembers = memberships?.length ? memberships : [
    { id: '1', user: { name: 'Ade Basir', email: 'ade.basirwfrd@gmail.com' }, role: 'ADMIN' },
    { id: '2', user: { name: 'Syed Ali', email: 'ali@openclaw.dev' }, role: 'MEMBER' },
  ];

  return (
    <GodTierView 
      title="Team Members" 
      icon={Users}
      actions={
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
          borderRadius: '8px', border: 'none', background: 'var(--primary)',
          color: 'white', cursor: 'pointer', fontWeight: 500, fontSize: '13px'
        }}>
          <UserPlus size={16} /> Invite Member
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Search & Filter Bar */}
        <div style={{ 
          display: 'flex', gap: '12px', background: 'white', padding: '12px 16px', 
          borderRadius: '12px', border: '1px solid var(--border-default)' 
        }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
            <input 
              placeholder="Search by name or email..."
              style={{ 
                width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', 
                border: '1px solid var(--border-light)', outline: 'none'
              }}
            />
          </div>
          <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'white' }}>
            <option>All Roles</option>
            <option>Admins</option>
            <option>Members</option>
            <option>Viewers</option>
          </select>
        </div>

        {/* Members Table */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border-default)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-default)' }}>
                <th style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>User</th>
                <th style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Role</th>
                <th style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}></th>
              </tr>
            </thead>
            <tbody>
              {displayMembers.map((membership: any) => (
                <tr key={membership.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-selected)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                        fontWeight: 600, fontSize: '14px'
                      }}>
                        {membership.user?.name?.[0] || 'U'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{membership.user?.name || 'Unknown User'}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{membership.user?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <Shield size={14} color={membership.role === 'ADMIN' ? 'var(--primary)' : 'var(--text-secondary)'} />
                      <span style={{ fontWeight: 500 }}>{membership.role}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      fontSize: '12px', fontWeight: 600, padding: '4px 8px', borderRadius: '12px',
                      background: 'var(--status-done)15',
                      color: 'var(--status-done)'
                    }}>
                      Active
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <Mail size={16} />
                    </button>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginLeft: '12px' }}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </GodTierView>
  );
};
