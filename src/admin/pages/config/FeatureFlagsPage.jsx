import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Plus, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';
import apiClient, { unwrapAdminResponse } from '../../api/apiClient';
import { ConfirmModal, SuccessOverlay, PrimaryActionModal } from '../../components/ui/AdminModals';

export default function FeatureFlagsPage() {
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'feature-flags'],
    queryFn: async () => {
      const res = await apiClient.get('/settings/feature-flags');
      return unwrapAdminResponse(res).data || [];
    },
    staleTime: 30_000,
  });

  const flags = Array.isArray(data) ? data : [];

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }) => {
      const res = await apiClient.patch(`/settings/feature-flags/${id}/toggle`, { enabled });
      return unwrapAdminResponse(res).data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feature-flags'] });
      setSuccessMsg(`Flag ${vars.enabled ? 'enabled' : 'disabled'} successfully.`);
      toast.success('Feature flag updated.');
      setTogglingId(null);
    },
    onError: (e) => {
      toast.error(e?.message || 'Failed to toggle flag.');
      setTogglingId(null);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values) => {
      const res = await apiClient.post('/settings/feature-flags', values);
      return unwrapAdminResponse(res).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feature-flags'] });
      setCreateModal(false);
      setSuccessMsg('Feature flag created.');
      toast.success('Flag created.');
    },
    onError: (e) => toast.error(e?.message || 'Failed to create flag.'),
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await apiClient.delete(`/settings/feature-flags/${id}`);
      return unwrapAdminResponse(res).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feature-flags'] });
      setDeleteTarget(null);
      setSuccessMsg('Feature flag deleted.');
      toast.success('Flag deleted.');
    },
    onError: (e) => toast.error(e?.message || 'Failed to delete flag.'),
  });

  const handleToggle = (flag) => {
    const newState = !flag.enabled && flag.status !== 'on';
    const enabled = flag.enabled !== undefined ? !flag.enabled : flag.status !== 'on';
    setTogglingId(flag.id || flag._id);
    toggleMutation.mutate({ id: flag.id || flag._id, enabled });
  };

  return (
    <div className="space-y-6">
      {/* Modals */}
      <PrimaryActionModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        onSubmit={(v) => createMutation.mutate({ ...v, enabled: false })}
        isPending={createMutation.isPending}
        action={{
          label: 'Define New Feature Flag',
          fields: [
            { name: 'key', label: 'Flag Key (SCREAMING_SNAKE_CASE)', placeholder: 'e.g., ENABLE_CRYPTO_PAYMENTS', required: true },
            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'What does this flag control?', required: true },
            { name: 'scope', label: 'Scope', placeholder: 'global / internal_only / beta_users', required: false },
          ],
        }}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate({ id: deleteTarget?.id || deleteTarget?._id })}
        title={`Delete flag "${deleteTarget?.key}"?`}
        message="This feature flag will be permanently deleted. Any code checking this flag will fall back to its default behavior."
        variant="danger"
        isPending={deleteMutation.isPending}
      />

      {successMsg && (
        <SuccessOverlay isOpen message={successMsg} onClose={() => setSuccessMsg(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#14a800]/10 text-[#14a800] rounded-xl shadow-sm">
              <ToggleLeft size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Feature Flags & Rollouts</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Safely toggle platform features, manage beta testing, and control progressive rollouts.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => refetch()} disabled={isLoading} className="p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setCreateModal(true)}
            className="px-5 py-2.5 bg-surface-dark text-white dark:bg-[#14a800] rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Define New Flag
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-[24px] bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-sm text-red-200">
          <strong>Failed to load feature flags:</strong> {error?.message || 'Backend error'}. Ensure <code>/settings/feature-flags</code> is registered.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && flags.length === 0 && (
        <div className="text-center py-14 text-zinc-500">
          <ToggleLeft size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold">No feature flags defined yet.</p>
          <p className="text-sm mt-1">Create your first feature flag to start controlling rollouts.</p>
        </div>
      )}

      {/* Flags List */}
      {!isLoading && flags.length > 0 && (
        <div className="bg-white dark:bg-surface-dark rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {flags.map((flag) => {
              const isEnabled = flag.enabled !== undefined ? flag.enabled : flag.status === 'on';
              const isToggling = togglingId === (flag.id || flag._id);
              return (
                <div key={flag.id || flag._id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex gap-4">
                    <div className={cn(
                      "p-3 rounded-2xl shrink-0 transition-colors",
                      isEnabled ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                    )}>
                      {isEnabled ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="font-mono text-sm font-black text-zinc-900 dark:text-white">{flag.key}</h3>
                        {flag.scope && (
                          <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                            {flag.scope}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-zinc-500 max-w-lg">{flag.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    {/* Toggle */}
                    <div className="flex items-center gap-3">
                      <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", isEnabled ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400")}>
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <button
                        onClick={() => handleToggle(flag)}
                        disabled={isToggling}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-60",
                          isEnabled ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                        )}
                        aria-label={isEnabled ? 'Disable flag' : 'Enable flag'}
                      >
                        {isToggling ? (
                          <Loader2 size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" />
                        ) : (
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                            isEnabled ? "right-1" : "left-1"
                          )} />
                        )}
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteTarget(flag)}
                      className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Delete this flag"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
