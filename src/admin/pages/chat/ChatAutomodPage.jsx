import React from 'react';
import { Bot, AlertTriangle, MessageSquare, Clock, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { cn } from '../../utils/cn';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import apiClient, { unwrapAdminResponse } from '../../api/apiClient';
import { Download, RefreshCw } from 'lucide-react';
import AuditLogViewer from '../../components/audit/AuditLogViewer';

export default function ChatAutomodPage() {
  const [activeTab, setActiveTab] = React.useState('automod');

  const { data: automodData, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'chat', 'automod'],
    queryFn: async () => {
      const response = await apiClient.get('/chat/automod?limit=100');
      const { data, meta } = unwrapAdminResponse(response);
      const list = Array.isArray(data) ? data : data?.logs || [];
      return { logs: list, total: meta?.total ?? list.length };
    },
    staleTime: 60_000,
  });

  const automodLogs = automodData?.logs || [];

  if (activeTab === 'audit') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AuditLogViewer
          moduleFilter="CHAT"
          title="Chat Moderation Audit Trail"
          description="Comprehensive trail of auto-moderation actions, flagged messages, and intervention logs."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#2bb75c]/10 text-[#2bb75c] rounded-xl">
              <Bot size={24} />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Auto-Moderation Logs</h1>
          </div>
          <p className="text-zinc-500 font-medium">
            System-automated chat intervention and policy enforcement records.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'automod' ? 'audit' : 'automod')}
            className="px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-surface"
          >
            <FileText size={16} /> Audit View
          </button>
          <Button variant="secondary" leftIcon={<Download size={16} />}>Export Logs</Button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          Failed to load automod logs: {error?.message || 'Backend error'}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      )}

      {!isLoading && automodLogs.length === 0 && (
        <div className="p-16 flex flex-col items-center justify-center bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <Bot size={48} className="text-[#2bb75c] mb-4" />
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No Moderation Logs</h3>
          <p className="text-zinc-500 text-sm mt-1">Auto-moderation system has not flagged any messages.</p>
        </div>
      )}

      <div className="space-y-4">
        {automodLogs.map((log, index) => (
          <Card key={log.id || index} className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  log.action === 'BLOCK' || log.action === 'DELETE' ? "bg-rose-500/10 text-rose-600" : "bg-amber-500/10 text-amber-600"
                )}>
                  <Bot size={20} />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono font-bold text-zinc-400">
                      {log.id || log.messageId || log.conversationId || '—'}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      log.action === 'BLOCK' || log.action === 'DELETE'
                        ? "bg-rose-500/10 text-rose-600"
                        : "bg-amber-500/10 text-amber-600"
                    )}>
                      {log.action?.replace(/_/g, ' ') || 'FLAGGED'}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-zinc-900 dark:text-white mb-1 line-clamp-2">
                    {log.message || log.content || log.reason || 'Automated moderation trigger'}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {log.timestamp
                        ? format(new Date(log.timestamp), 'HH:mm:ss')
                        : '—'}
                    </span>
                    {log.confidence && (
                      <span>Confidence: <span className="font-bold text-zinc-700 dark:text-zinc-300">{log.confidence}%</span></span>
                    )}
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="sm">
                Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {automodLogs.length > 0 && (
        <div className="flex items-center justify-center pt-4">
          <Button variant="secondary" leftIcon={<RefreshCw size={16} />} onClick={() => refetch()}>
            Refresh Logs
          </Button>
        </div>
      )}
    </div>
  );
}
