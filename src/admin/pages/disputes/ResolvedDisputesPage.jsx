import React from 'react';
import { Gavel, Shield, Calendar, CheckCircle2, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../utils/cn';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import apiClient, { unwrapAdminResponse } from '../../api/apiClient';
import { useQuery } from '@tanstack/react-query';
import AuditLogViewer from '../../components/audit/AuditLogViewer';

export default function ResolvedDisputesPage() {
  const [activeTab, setActiveTab] = React.useState('resolved');

  const { data: resolvedData, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'disputes', 'resolved'],
    queryFn: async () => {
      const response = await apiClient.get('/disputes?status=RESOLVED&limit=50');
      const { data, meta } = unwrapAdminResponse(response);
      const list = Array.isArray(data) ? data : data?.disputes || [];
      return { disputes: list, total: meta?.total ?? list.length };
    },
    staleTime: 60_000,
  });

  const resolvedDisputes = resolvedData?.disputes || [];

  if (activeTab === 'audit') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AuditLogViewer
          moduleFilter="DISPUTES"
          title="Dispute Resolution Trail"
          description="Historical record of all evidence submissions, arbitration rulings, and fund distributions."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-success/10 text-success rounded-xl">
              <Gavel size={24} />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Resolved Disputes</h1>
          </div>
          <p className="text-zinc-500 font-medium">
            Historical archive of completed dispute resolutions.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'resolved' ? 'audit' : 'resolved')}
            className="px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-surface"
          >
            <Shield size={16} /> Resolution Audit
          </button>
          <Button variant="secondary" leftIcon={<Download size={16} />}>Export Archive</Button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          Failed to load resolved disputes: {error?.message || 'Backend error'}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      )}

      {!isLoading && resolvedDisputes.length === 0 && (
        <div className="p-16 flex flex-col items-center justify-center bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <CheckCircle2 size={48} className="text-success mb-4" />
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No Resolved Disputes</h3>
          <p className="text-zinc-500 text-sm mt-1">All disputes are currently pending review.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resolvedDisputes.map((dispute) => (
          <Card key={dispute.id || dispute._id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-success/10 text-success rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                RESOLVED
              </span>
            </div>

            <h3 className="font-bold text-zinc-900 dark:text-white mb-2 truncate">
              {dispute.id || dispute._id}
            </h3>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-3 line-clamp-2">
              {dispute.subject || dispute.contract || dispute.title || 'Dispute Case'}
            </p>

            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
              <Calendar size={14} />
              <span>
                {dispute.resolvedAt
                  ? format(new Date(dispute.resolvedAt), 'MMM dd, yyyy')
                  : dispute.updatedAt
                  ? format(new Date(dispute.updatedAt), 'MMM dd, yyyy')
                  : '—'}
              </span>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">
                Outcome: <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  {(dispute.resolution || dispute.outcome || 'SETTLED').replace(/_/g, ' ')}
                </span>
              </span>
              {(dispute.amount || dispute.escrowAmount) && (
                <span className="text-sm font-bold text-success">
                  KES {(Number(dispute.amount || dispute.escrowAmount || 0) / 100).toLocaleString()}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {resolvedDisputes.length > 0 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Refresh Archive
          </Button>
        </div>
      )}
    </div>
  );
}
