import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GodTierView } from './GodTierView';
import { Users, UserPlus, Shield, MoreVertical, Search, Mail } from 'lucide-react';
import { WORKSPACE_MEMBERS } from '../../lib/gql-queries';

interface MembersViewProps {
  workspaceId: string | null;
}

export const MembersView: React.FC<MembersViewProps> = ({ workspaceId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data, loading } = useQuery(WORKSPACE_MEMBERS, {
    variables: { workspaceId },
    skip: !workspaceId,
  });

  const members = useMemo(() => {
    const raw = data?.workspaceMembers || [];
    return raw.filter((m: any) => {
      const matchesSearch = !searchTerm ||
        m.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [data, searchTerm, roleFilter]);

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
        <div style={{
          display: 'flex', gap: '12px', background: 'white', padding: '12px 16px',
          borderRadius: '12px', border: '1px solid var(--border-default)'
        }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
            <input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px',
                border: '1px solid var(--border-light)', outline: 'none'
              }}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'white' }}
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admins</option>
            <option value="MANAGER">Managers</option>
            <option value="MEMBER">Members</option>
            <option value="VIEWER">Viewers</option>
          </select>
        </div>

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
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No members found</td></tr>
              ) : (
                members.map((membership: any) => (
                  <tr key={membership.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: membership.user?.avatarUrl ? `url(${membership.user.avatarUrl}) center/cover` : 'var(--primary-selected)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                          fontWeight: 600, fontSize: '14px', overflow: 'hidden'
                        }}>
                          {!membership.user?.avatarUrl && (membership.user?.name?.[0] || 'U')}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{membership.user?.name || 'Unknown'}</span>
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
                        background: (membership.user?.status || 'Active') === 'Active' ? 'var(--status-done)15' : 'var(--bg-canvas)',
                        color: (membership.user?.status || 'Active') === 'Active' ? 'var(--status-done)' : 'var(--text-secondary)'
                      }}>
                        {membership.user?.status || 'Active'}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </GodTierView>
  );
};
