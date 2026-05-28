import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, Search, CheckCircle2, AlertTriangle, 
  XCircle, ArrowRight, Activity
} from 'lucide-react';
import AuditLogViewer from '../../../admin/components/audit/AuditLogViewer';
import AdminActionModal from '../../../admin/components/ui/AdminActionModal';
import PopoverConfirm from '../../../admin/components/ui/PopoverConfirm';
import { cn } from '../../../admin/utils/cn';
import toast from 'react-hot-toast';

const MOCK_RECONCILIATION = Array.from({ length: 10 }, (_, i) => ({
  id: `REC-${8800 + i}`,
  provider: i % 2 === 0 ? 'M-PESA' : 'Flutterwave',
  externalId: `EXT-${Math.floor(Math.random() * 1000000)}`,
  internalId: i % 4 === 0 ? null : `TRX-${1000 + i}`,
  amount: Math.floor(Math.random() * 50000) + 5000,
  status: i % 4 === 0 ? 'missing' : i % 3 === 0 ? 'mismatch' : 'matched',
}));

export default function ReconciliationPage() {
  const [activeTab, setActiveTab] = useState('management');
  const [isLoading, setIsLoading] = useState(true);
  const [actionModal, setActionModal] = useState({ isOpen: false, type: '', data: null });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const triggerAction = (type, data) => {
    setActionModal({ isOpen: true, type, data });
  };

  const handleSync = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Sync completed. 4 mismatches found.');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-brand-500/10 text-brand-600 rounded-xl shadow-sm">
              <RefreshCw size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">External Reconciliation</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Compare platform ledger entries against external payment gateway statements (M-PESA, Flutterwave).
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab(activeTab === 'management' ? 'audit' : 'management')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2",
              activeTab === 'audit' ? "bg-surface-dark text-white dark:bg-brand-600" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-surface"
            )}
          >
            <Activity size={16} /> {activeTab === 'management' ? 'Audit Trail' : 'Back to Management'}
          </button>
          
          <PopoverConfirm
            title="Sync with Payment Gateway?"
            description="This will fetch the latest transaction logs from M-PESA and Flutterwave API. It may take up to 30 seconds."
            variant="info"
            confirmLabel="Start Sync"
            onConfirm={handleSync}
          >
            <button className="px-4 py-2 bg-surface-dark text-white dark:bg-brand-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2 h-full">
               <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> Sync Gateway Data
            </button>
          </PopoverConfirm>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <AuditLogViewer 
             moduleFilter="RECON" 
             title="Reconciliation Logs"
             description="Records of manual resolutions and automated sync events."
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
                  placeholder="Search by Provider ID or Internal Ref..." 
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b border-zinc-200 dark:border-zinc-800">
                    <th className="p-4">External Ref / Provider</th>
                    <th className="p-4">Internal Transaction</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Recon Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="p-4"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-32" /></td>
                        <td className="p-4"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-24" /></td>
                        <td className="p-4"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-20" /></td>
                        <td className="p-4"><div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded w-16" /></td>
                        <td className="p-4 text-right"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-24 ml-auto" /></td>
                      </tr>
                    ))
                  ) : (
                    MOCK_RECONCILIATION.map(rec => (
                      <tr key={rec.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 group transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{rec.externalId}</span>
                            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{rec.provider}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {rec.internalId ? (
                            <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                              <CheckCircle2 size={14} className="text-success" />
                              {rec.internalId}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm font-bold text-red-500">
                              <AlertTriangle size={14} />
                              Unlinked Entry
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-sm font-black text-zinc-900 dark:text-white">
                          {rec.amount.toLocaleString()} KES
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                            rec.status === 'matched' ? 'bg-emerald-50 text-success' :
                            rec.status === 'mismatch' ? 'bg-amber-50 text-amber-600' :
                            'bg-red-50 text-red-600'
                          )}>
                            {rec.status === 'matched' && <CheckCircle2 size={12} />}
                            {rec.status === 'mismatch' && <AlertTriangle size={12} />}
                            {rec.status === 'missing' && <XCircle size={12} />}
                            {rec.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {rec.status !== 'matched' && (
                             <button 
                               onClick={() => triggerAction('resolve-dispute', rec)}
                               className="px-3 py-1.5 bg-surface-dark text-white dark:bg-brand-600 rounded-lg text-xs font-bold transition-all hover:shadow-lg active:scale-95"
                             >
                               Resolve
                             </button>
                          )}
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
        onSuccess={() => toast.success('Resolution entry logged to Audit Trail')}
      />
    </div>
  );
}
