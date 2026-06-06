import React, { useState } from 'react';
import { useTransactions } from '../../../admin/hooks/useFinancial';
import { Loader2 } from 'lucide-react';
import { 
  ShieldCheck, Search, Lock, Unlock,
  AlertTriangle, MoreVertical, FileText, Activity
} from 'lucide-react';
import AuditLogViewer from '../../../admin/components/audit/AuditLogViewer';
import AdminActionModal from '../../../admin/components/ui/AdminActionModal';
import PopoverConfirm from '../../../admin/components/ui/PopoverConfirm';
import useFinancialStore from '../store/financialStore';
import { cn } from '../../../admin/utils/cn';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function EscrowManagementPage() {
  const { data: trxResponse, isLoading } = useTransactions();
  const escrowItems = (trxResponse?.data || [])
    .filter((t) => (t.type || '').toLowerCase().includes('escrow'))
    .map((t, i) => ({
      id: t.id || t._id || `ESC-${i}`,
      contractId: t.contractId || t.reference || '—',
      client: t.clientName || '—',
      freelancer: t.freelancerName || '—',
      amount: t.amount || 0,
      status: (t.status || 'funded').toLowerCase(),
      dateFunded: t.createdAt || t.date || new Date().toISOString(),
    }));
  const [activeTab, setActiveTab] = useState('management');
  const [actionModal, setActionModal] = useState({ isOpen: false, type: '', data: null });
  const { filters, setFilter } = useFinancialStore();

  const triggerAction = (type, data) => {
    setActionModal({ isOpen: true, type, data });
  };

  const handleActionSuccess = (data, type, reason) => {
    console.log(`Action ${type} executed for ${data.id} with reason: ${reason}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4C1D95]/10 text-[#4C1D95] rounded-xl shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Escrow Management</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Monitor protected funds, handle milestone releases, and manage disputes.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab(activeTab === 'management' ? 'audit' : 'management')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2",
              activeTab === 'audit' ? "bg-surface-dark text-white dark:bg-[#4C1D95]" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-surface"
            )}
          >
            <Activity size={16} /> {activeTab === 'management' ? 'Audit Trail' : 'Back to Management'}
          </button>
          
          <PopoverConfirm
            title="Generate Global Report?"
            description="This will compile escrow data across all active contracts. May take a few seconds."
            variant="info"
            confirmLabel="Generate"
            onConfirm={() => toast.success('Escrow Report generated successfully')}
          >
            <button className="px-4 py-2 bg-surface-dark text-white dark:bg-[#4C1D95] rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2 h-full">
               Generate Escrow Report
            </button>
          </PopoverConfirm>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <AuditLogViewer 
             moduleFilter="BILLING,PAYMENT" 
             title="Escrow Audit Trail"
             description="Monitoring all fund locks, releases, and dispute-related ledger adjustments."
           />
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search Escrow ID or Contract..." 
                  value={filters.escrow.search}
                  onChange={(e) => setFilter('escrow', 'search', e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#4C1D95] outline-none"
                />
              </div>
              <select 
                value={filters.escrow.status}
                onChange={(e) => setFilter('escrow', 'status', e.target.value)}
                className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold outline-none cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="funded">Funded (Locked)</option>
                <option value="released">Released</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b border-zinc-200 dark:border-zinc-800">
                    <th className="p-4">Escrow ID / Contract</th>
                    <th className="p-4">Parties</th>
                    <th className="p-4">Amount Held (KES)</th>
                    <th className="p-4">Date Funded</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="p-4"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-24" /></td>
                        <td className="p-4"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-32" /></td>
                        <td className="p-4"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-20" /></td>
                        <td className="p-4"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-24" /></td>
                        <td className="p-4"><div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded w-16" /></td>
                        <td className="p-4 text-right"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-24 ml-auto" /></td>
                      </tr>
                    ))
                  ) : (
                    escrowItems.filter(e => !filters.escrow.status || e.status === filters.escrow.status).length === 0 && !isLoading ? (
                      <tr><td colSpan={6} className="p-8 text-center text-zinc-500 font-medium">No escrow records found.</td></tr>
                    ) : escrowItems.filter(e => !filters.escrow.status || e.status === filters.escrow.status).map(escrow => (
                      <tr key={escrow.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 group transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{escrow.id}</span>
                            <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                              <FileText size={12} /> {escrow.contractId}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col text-sm">
                            <span className="font-bold text-zinc-700 dark:text-zinc-300"><span className="text-zinc-400 text-xs">C:</span> {escrow.client}</span>
                            <span className="font-bold text-zinc-700 dark:text-zinc-300 mt-0.5"><span className="text-zinc-400 text-xs">F:</span> {escrow.freelancer}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-black text-zinc-900 dark:text-white">
                            {escrow.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          {format(new Date(escrow.dateFunded), 'MMM dd, yyyy')}
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                            escrow.status === 'funded' ? 'bg-[#4C1D95]/5 text-[#4C1D95] dark:bg-[#4C1D95]/20' :
                            escrow.status === 'disputed' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' :
                            'bg-emerald-50 text-success dark:bg-emerald-900/20'
                          )}>
                            {escrow.status === 'funded' && <Lock size={12} />}
                            {escrow.status === 'disputed' && <AlertTriangle size={12} />}
                            {escrow.status === 'released' && <Unlock size={12} />}
                            {escrow.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {escrow.status === 'funded' && (
                              <button 
                                onClick={() => triggerAction('force-release', escrow)}
                                className="px-3 py-1.5 bg-emerald-50 text-success hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors"
                              >
                                Force Release
                              </button>
                            )}
                            {escrow.status === 'disputed' && (
                              <button 
                                onClick={() => triggerAction('resolve-dispute', escrow)}
                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                              >
                                Resolve
                              </button>
                            )}
                            <button className="p-1.5 text-zinc-400 hover:bg-zinc-100 rounded-lg">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AdminActionModal 
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        actionType={actionModal.type}
        data={actionModal.data}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
}


