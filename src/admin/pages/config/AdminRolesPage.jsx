import React, { useState } from 'react';
import { 
  Shield, UserCheck, Plus, MoreVertical, Users, Loader2, RefreshCw
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient, { unwrapAdminResponse } from '../../api/apiClient';
import { ConfirmModal, SuccessOverlay, PrimaryActionModal } from '../../components/ui/AdminModals';

export default function AdminRolesPage() {
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: async () => {
      const res = await apiClient.get('/settings/roles');
      return unwrapAdminResponse(res).data || [];
    },
    staleTime: 60_000,
  });

  const roles = Array.isArray(data) ? data : [];

  const createMutation = useMutation({
    mutationFn: async (values) => {
      const res = await apiClient.post('/settings/roles', values);
      return unwrapAdminResponse(res).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
      setCreateModal(false);
      setSuccessMsg('New admin role created successfully.');
      toast.success('Role created.');
    },
    onError: (e) => toast.error(e?.message || 'Failed to create role.'),
  });

  const deactivateMutation = useMutation({
    mutationFn: async ({ id, reason }) => {
      const res = await apiClient.patch(`/settings/roles/${id}/deactivate`, { reason });
      return unwrapAdminResponse(res).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
      setDeactivateTarget(null);
      setSuccessMsg('Admin role deactivated.');
      toast.success('Role deactivated.');
    },
    onError: (e) => toast.error(e?.message || 'Failed to deactivate role.'),
  });

  const ROLE_COLORS = {
    SUPER_ADMIN: 'bg-#14a800]/10 text-violet-400 border-#14a800]/20',
    FINANCIAL_ADMIN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    OPERATIONS_ADMIN: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    SUPPORT_ADMIN: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Modals */}
      <PrimaryActionModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        onSubmit={(v) => createMutation.mutate(v)}
        isPending={createMutation.isPending}
        action={{
          label: 'Create New Admin Role',
          fields: [
            { name: 'name', label: 'Role Name', placeholder: 'e.g., Finance Manager', required: true },
            { name: 'slug', label: 'Role Key (SCREAMING_SNAKE)', placeholder: 'e.g., FINANCE_MANAGER', required: true },
            { name: 'permissions', label: 'Permissions (comma-separated)', placeholder: 'e.g., LEDGER,ESCROW,PAYOUTS', required: false },
            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the responsibilities of this role', required: false },
          ],
        }}
      />

      <ConfirmModal
        isOpen={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={(reason) => deactivateMutation.mutate({ id: deactivateTarget?.id, reason })}
        title={`Deactivate "${deactivateTarget?.name}"?`}
        message="This role will be marked inactive. Admins assigned to it will lose access until re-assigned."
        requireReason
        reasonLabel="Reason for deactivation"
        variant="danger"
        isPending={deactivateMutation.isPending}
      />

      {successMsg && (
        <SuccessOverlay isOpen message={successMsg} onClose={() => setSuccessMsg(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#14a800]/10 text-[#14a800] rounded-xl shadow-sm">
              <Shield size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Admin Roles & Permissions</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Define administrative roles, manage granular permissions, and assign staff accounts.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setCreateModal(true)}
            className="px-5 py-2.5 bg-surface-dark text-white dark:bg-[#14a800] rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Create New Role
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-[32px] bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-sm text-red-200">
          <strong>Failed to load roles:</strong> {error?.message || 'Backend error'}. Ensure the <code>/settings/roles</code> endpoint is registered.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && roles.length === 0 && (
        <div className="text-center py-14 text-zinc-500">
          <Shield size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold">No roles defined yet.</p>
          <p className="text-sm mt-1">Create your first admin role to get started.</p>
        </div>
      )}

      {/* Role Cards */}
      {!isLoading && roles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {roles.map((role) => {
            const colorClass = ROLE_COLORS[role.slug || role.key] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
            return (
              <div
                key={role.id || role._id}
                className="bg-white dark:bg-surface-dark p-7 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-[#14a800]/20/30 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-2xl border ${colorClass}`}>
                    <UserCheck size={22} />
                  </div>
                  <button
                    onClick={() => setDeactivateTarget(role)}
                    className="text-zinc-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                    title="Deactivate role"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>

                <h3 className="text-base font-black text-zinc-900 dark:text-white mb-1">{role.name}</h3>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-4">{role.slug || role.key}</p>

                {role.description && (
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4 line-clamp-2">{role.description}</p>
                )}

                <div className="flex items-center gap-2 mb-5">
                  <Users size={13} className="text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-500">{role.adminCount ?? role.userCount ?? 0} Active Admin{role.adminCount !== 1 ? 's' : ''}</span>
                </div>

                {role.permissions && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(Array.isArray(role.permissions) ? role.permissions : role.permissions.split(',')).slice(0, 4).map((perm) => (
                      <span key={perm} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                        {perm.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    role.status === 'active' || !role.status
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${role.status === 'active' || !role.status ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                    {role.status || 'active'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
