import React from 'react';
import { Clock, Shield, User, FileText, Activity, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient, { unwrapAdminResponse } from '../../api/apiClient';

const getLogMeta = (log) => {
  const action = (log.action || '').toUpperCase();
  if (action.includes('AUTH') || action.includes('LOGIN') || action.includes('USER') || action.includes('KYC')) {
    return { icon: User, color: 'text-[#4C1D95] bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20' };
  }
  if (action.includes('FRAUD') || action.includes('FLAG') || action.includes('BLACKLIST') || action.includes('BLOCK')) {
    return { icon: Shield, color: 'text-danger bg-danger/10' };
  }
  if (action.includes('ESCROW') || action.includes('PAYMENT') || action.includes('REFUND') || action.includes('WALLET')) {
    return { icon: FileText, color: 'text-success bg-success/10' };
  }
  return { icon: Activity, color: 'text-warning bg-warning/10' };
};

const formatRelativeTime = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
};

export default function AuditLogTimeline({ limit = 12, moduleFilter }) {
  const endpoint = moduleFilter
    ? `/audit-logs?moduleFilter=${encodeURIComponent(moduleFilter)}&limit=${limit}`
    : `/audit-logs?limit=${limit}`;

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['audit-timeline', moduleFilter, limit],
    queryFn: async () => {
      const res = await apiClient.get(endpoint);
      const d = unwrapAdminResponse(res).data;
      return Array.isArray(d) ? d : Array.isArray(d?.logs) ? d.logs : [];
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const logs = data || [];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-sans">
      <div className="mb-8 border-b border-gray-200 dark:border-surface-dark-border pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-dark dark:text-white">Audit Log & Activity</h1>
          <p className="text-sm text-gray-500 mt-1">Immutable record of all critical system actions, API calls, and administrative overrides.</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading && (
        <div className="space-y-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-6">
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse shrink-0" />
              <div className="flex-1 h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-white">Unable to load audit logs</p>
            <p className="text-xs text-zinc-400 mt-1">{error?.message || 'Backend error'}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && logs.length === 0 && (
        <div className="text-center py-14 text-zinc-500">
          <Activity size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold">No audit entries found.</p>
          <p className="text-sm mt-1">Actions will appear here as admins interact with the platform.</p>
        </div>
      )}

      {!isLoading && logs.length > 0 && (
        <div className="relative border-l-2 border-gray-200 dark:border-surface-dark-border ml-6 space-y-10 pb-12">
          {logs.map((log, idx) => {
            const { icon: Icon, color } = getLogMeta(log);
            return (
              <div key={log.id || idx} className="relative pl-8 animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                {/* Timeline dot */}
                <div className={`absolute -left-[21px] top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface-tertiary dark:border-surface-dark ${color} shadow-sm z-10`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content Card */}
                <div className="bg-white dark:bg-surface-dark-secondary border border-gray-200 dark:border-surface-dark-border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                    <div>
                      <h3 className="text-base font-bold text-surface-dark dark:text-white">
                        {log.action?.replace(/_/g, ' ') || 'System Action'}
                      </h3>
                      <p className="text-sm font-medium text-gray-500 mt-0.5 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {log.adminId ? `Admin #${log.adminId}` : log.actor || 'System'}
                        {log.targetType && <span className="ml-1 text-zinc-400">→ {log.targetType} #{log.targetId}</span>}
                      </p>
                    </div>
                    <div className="flex items-center text-xs font-bold text-gray-400 bg-surface dark:bg-surface-dark-tertiary px-3 py-1.5 rounded-badge whitespace-nowrap">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatRelativeTime(log.createdAt || log.timestamp)}
                    </div>
                  </div>

                  <div className="bg-surface-tertiary dark:bg-surface-dark p-4 rounded-xl text-sm font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-surface-dark-border">
                    <div className="grid grid-cols-2 gap-y-2">
                      {log.ipAddress && (
                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> IP: {log.ipAddress}</div>
                      )}
                      <div>Event ID: {log.id || `EVT-${idx}`}</div>
                      {log.metadata && (
                        <div className="col-span-2 mt-2 pt-2 border-t border-gray-200 dark:border-surface-dark-border text-xs text-zinc-400 truncate">
                          {JSON.stringify(log.metadata).slice(0, 80)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


