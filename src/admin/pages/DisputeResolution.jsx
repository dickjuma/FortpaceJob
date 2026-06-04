import React, { useState } from "react";
import {
  Gavel, MessageSquare, Clock, AlertCircle, ChevronRight,
  FileText, Scale, ShieldAlert, ArrowRight, RefreshCw
} from "lucide-react";
import { Activity, Link } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import AuditLogViewer from '../components/audit/AuditLogViewer';
import { useDisputes, useDisputeActions } from '../hooks/useDisputes';
import { useQuery } from "@tanstack/react-query";
import apiClient, { unwrapAdminResponse } from "../api/apiClient";
import { cn } from '../utils/cn';
import { ConfirmModal, SuccessOverlay } from '../components/ui/AdminModals';
import toast from "react-hot-toast";

const DisputeResolution = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('queue');
  const [actionModal, setActionModal] = useState(null); // { dispute, type: 'resolve'|'escalate' }
  const [successMsg, setSuccessMsg] = useState(null);

  const { data: disputesData, isLoading, error, refetch } = useDisputes();
  const { resolveDispute, escalateDispute } = useDisputeActions();

  // Fetch dispute stats from resolved disputes
  const { data: statsData } = useQuery({
    queryKey: ['admin', 'dispute-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/disputes?status=open&limit=100');
      const d = unwrapAdminResponse(res).data;
      const all = Array.isArray(d) ? d : Array.isArray(d?.disputes) ? d.disputes : [];
      const highSeverity = all.filter(d => d.level === 'L3' || d.priority === 'HIGH' || d.severity === 'HIGH').length;
      const totalEscrow = all.reduce((sum, d) => sum + (Number(d.escrowAmount) || Number(d.amount) || 0), 0);
      return { highSeverity, totalEscrow };
    },
    staleTime: 60_000,
  });

  const { data: recentRulings } = useQuery({
    queryKey: ['admin', 'recent-rulings'],
    queryFn: async () => {
      const res = await apiClient.get('/disputes?status=RESOLVED&limit=5');
      const d = unwrapAdminResponse(res).data;
      return Array.isArray(d) ? d : Array.isArray(d?.disputes) ? d.disputes : [];
    },
    staleTime: 60_000,
  });

  const activeDisputes = disputesData?.data || disputesData?.disputes || [];

  const handleResolveConfirm = (reason) => {
    resolveDispute.mutate(
      { disputeId: actionModal.dispute.id || actionModal.dispute._id, outcome: 'ADMIN_RESOLUTION', notes: reason },
      {
        onSuccess: () => {
          setActionModal(null);
          setSuccessMsg('Dispute resolved. Funds will be distributed per the ruling.');
        },
        onError: (e) => toast.error(e?.message || 'Resolution failed.'),
      }
    );
  };

  const handleEscalateConfirm = (reason) => {
    escalateDispute.mutate(
      { disputeId: actionModal.dispute.id || actionModal.dispute._id, reason },
      {
        onSuccess: () => {
          setActionModal(null);
          setSuccessMsg('Dispute escalated to senior arbitration.');
        },
        onError: (e) => toast.error(e?.message || 'Escalation failed.'),
      }
    );
  };

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      {/* Modals */}
      {actionModal?.type === 'resolve' && (
        <ConfirmModal
          isOpen
          onClose={() => setActionModal(null)}
          onConfirm={handleResolveConfirm}
          title={`Resolve Dispute: ${actionModal.dispute.id || actionModal.dispute._id}`}
          message={`Issue an admin resolution ruling for "${actionModal.dispute.contract || actionModal.dispute.title}". This is irreversible.`}
          requireReason
          reasonLabel="Ruling notes / resolution justification"
          variant="warning"
          isPending={resolveDispute.isPending}
        />
      )}
      {actionModal?.type === 'escalate' && (
        <ConfirmModal
          isOpen
          onClose={() => setActionModal(null)}
          onConfirm={handleEscalateConfirm}
          title={`Escalate Dispute: ${actionModal.dispute.id || actionModal.dispute._id}`}
          message="Escalate to a senior arbitrator. Both parties will be notified."
          requireReason
          reasonLabel="Reason for escalation"
          variant="warning"
          isPending={escalateDispute.isPending}
        />
      )}
      {successMsg && <SuccessOverlay isOpen message={successMsg} onClose={() => setSuccessMsg(null)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Dispute Resolution</h1>
          <p className="text-zinc-500 mt-1">Impartial arbitration for contract conflicts and escrow stalemates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setActiveTab(activeTab === 'queue' ? 'audit' : 'queue')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2",
              activeTab === 'audit' ? "bg-surface-dark text-white dark:bg-[#2bb75c]" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-surface"
            )}
          >
            <Activity size={16} /> {activeTab === 'queue' ? 'Arbitration Logs' : 'Back to Queue'}
          </button>
          <p className="text-xs font-semibold text-zinc-400">{activeDisputes.length} Cases</p>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AuditLogViewer
            moduleFilter="DISPUTES"
            title="Dispute Resolution Trail"
            description="Historical record of all evidence submissions, arbitration rulings, and fund distributions."
          />
        </div>
      ) : (
        <>
          {error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
              Failed to load disputes: {error?.message || 'Backend error'}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8">
            <div className="space-y-6">
              {/* Active Disputes Queue */}
              <div className="bg-white dark:bg-surface-dark rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Active Review Queue</h2>
                  <span className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {isLoading ? '…' : `${activeDisputes.length} Cases Pending`}
                  </span>
                </div>

                {isLoading && (
                  <div className="p-6 space-y-3">
                    {[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />)}
                  </div>
                )}

                {!isLoading && activeDisputes.length === 0 && (
                  <div className="p-12 text-center text-zinc-500">
                    <Gavel size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="font-bold">No active disputes in queue.</p>
                    <p className="text-sm mt-1">All cases are currently resolved.</p>
                  </div>
                )}

                <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
                  {activeDisputes.map((caseItem) => (
                    <div key={caseItem.id || caseItem._id} className="p-6 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                            caseItem.status === 'ARBITRATION' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                          }`}>
                            <Gavel size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-tighter">
                                {caseItem.id || caseItem._id}
                              </span>
                              {(caseItem.level || caseItem.priority) && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  caseItem.level === 'L3' || caseItem.priority === 'HIGH'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-zinc-800 text-zinc-300'
                                }`}>
                                  {caseItem.level ? `LEVEL ${caseItem.level}` : caseItem.priority}
                                </span>
                              )}
                            </div>
                            <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-1">
                              {caseItem.contract || caseItem.title || caseItem.subject || 'Dispute Case'}
                            </h3>
                            <p className="text-xs text-zinc-500 mt-1">
                              Status: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{caseItem.status?.replace(/_/g, ' ')}</span>
                              {(caseItem.escrowAmount || caseItem.amount) && (
                                <> • Escrow: <span className="font-bold text-emerald-600">{caseItem.currency || 'KES'} {(caseItem.escrowAmount || caseItem.amount || 0).toLocaleString()}</span></>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => setActionModal({ dispute: caseItem, type: 'escalate' })}
                            className="flex items-center gap-1.5 border border-amber-400/30 bg-amber-500/10 text-amber-200 px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-all"
                          >
                            Escalate
                          </button>
                          <button
                            onClick={() => setActionModal({ dispute: caseItem, type: 'resolve' })}
                            className="flex items-center gap-2 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all"
                          >
                            Resolve <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impartiality Standard */}
              <div className="bg-surface-dark rounded-[32px] p-8 text-white">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400 shrink-0">
                    <Scale size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Impartiality Standard</h2>
                    <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                      Every dispute resolution follows the Platform Fairness Protocol. Arbitrators must review submitted evidence from both parties before issuing a ruling. Once a ruling is issued, funds are automatically distributed and the decision is immutable.
                    </p>
                    <div className="mt-6 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                      <div className="flex items-center gap-2"><ShieldAlert size={14} className="text-emerald-400" /> Evidence Verified</div>
                      <div className="flex items-center gap-2"><ShieldAlert size={14} className="text-emerald-400" /> Double-Admin Check</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Live Stats */}
              <div className="bg-white dark:bg-surface-dark rounded-[32px] p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Dispute Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <AlertCircle size={18} className="text-rose-500" />
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">High Severity</span>
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      {statsData?.highSeverity ?? '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-amber-500" />
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Cases in Queue</span>
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      {isLoading ? '…' : activeDisputes.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-[#2bb75c]" />
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Escrow in Conflict</span>
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      {statsData?.totalEscrow ? `KES ${(statsData.totalEscrow / 100).toLocaleString()}` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Rulings (live) */}
              <div className="bg-white dark:bg-surface-dark rounded-[32px] p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Recent Rulings</h3>
                <div className="space-y-4">
                  {!recentRulings || recentRulings.length === 0 ? (
                    <p className="text-xs text-zinc-400 text-center py-4">No resolved disputes yet.</p>
                  ) : (
                    recentRulings.map((r) => (
                      <div key={r.id || r._id} className="flex items-center justify-between group cursor-pointer">
                        <div>
                          <p className="text-xs font-bold text-zinc-900 dark:text-white">{r.id || r._id}</p>
                          <p className="text-[10px] text-zinc-400 font-medium">
                            {r.resolvedAt || r.updatedAt ? new Date(r.resolvedAt || r.updatedAt).toLocaleDateString() : '—'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded-md uppercase">
                            {(r.resolution || r.outcome || 'RESOLVED').replace(/_/g, ' ')}
                          </span>
                          <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={() => navigate('/admin/disputes/resolved')}
                  className="mt-6 w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  View Resolution Archive
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DisputeResolution;
