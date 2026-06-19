import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Plus, Search, Users, CheckSquare, Trash2, Edit3, Loader2 } from 'lucide-react';
import { useAgencyRoles, useDeleteAgencyRole } from '../services/agencyHooks';

const PERMISSION_GROUPS = ['Contracts', 'Projects', 'Team Members', 'Billing', 'Analytics', 'Settings'];

export default function RoleManagementPage() {
  const { data = [], isLoading, refetch } = useAgencyRoles();
  const deleteRole = useDeleteAgencyRole();
  const [search, setSearch] = useState('');

  const roles = useMemo(() => Array.isArray(data) ? data : [], [data]);
  const filtered = roles.filter((role) => `${role.name || ''} ${role.description || ''}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 rounded-xl"><ShieldCheck className="w-6 h-6 text-[#4C1D95]" /></div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Role management</h1>
          </div>
          <p className="text-ink-secondary">Create roles, assign permissions, and review assigned users.</p>
        </div>
        <Link to="/agency/roles/new" className="rounded-xl bg-[#4C1D95] px-5 py-2.5 text-sm font-bold text-white inline-flex items-center gap-2 hover:bg-[#3b1378]">
          <Plus className="w-4 h-4" /> Create role
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search roles..." className="w-full rounded-2xl border border-border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-48 rounded-2xl bg-surface-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <ShieldCheck className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
          <h3 className="font-display font-bold text-brand-900">No roles found</h3>
          <p className="text-sm text-ink-secondary mt-1">Create the first agency role to start assigning permissions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((role) => (
            <motion.div key={role.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-brand-900">{role.name || 'Untitled role'}</h3>
                  <p className="text-sm text-ink-secondary mt-1">{role.description || 'No description'}</p>
                </div>
                <div className="rounded-xl bg-accent-light text-accent-dark p-2"><ShieldCheck className="w-5 h-5" /></div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {PERMISSION_GROUPS.map((group) => {
                  const enabled = role.permissions?.[group] || role.permissions?.includes?.(group);
                  return <span key={group} className={`rounded-full px-2.5 py-1 text-xs font-bold ${enabled ? 'bg-accent-light text-accent-dark' : 'bg-surface-muted text-ink-tertiary'}`}>{group}</span>;
                })}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="inline-flex items-center gap-2 text-xs font-bold text-ink-secondary"><Users className="w-3.5 h-3.5" /> {role.assignedUsers?.length || role.userCount || 0} users</span>
                <div className="flex items-center gap-2">
                  <Link to={`/agency/roles/${role.id}/edit`} className="rounded-lg border border-border p-2 text-ink-secondary hover:text-brand-900 hover:bg-surface-muted"><Edit3 className="w-4 h-4" /></Link>
                  <button disabled={deleteRole.isPending} onClick={() => deleteRole.mutate(role.id, { onSuccess: refetch })} className="rounded-lg border border-danger/30 p-2 text-danger hover:bg-danger/5 disabled:opacity-50">
                    {deleteRole.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
