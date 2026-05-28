import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, MoreVertical, FileText, Activity,
  RotateCcw, Search, XCircle, CheckCircle2
} from 'lucide-react';
import AuditLogViewer from '../../../admin/components/audit/AuditLogViewer';
import AdminActionModal from '../../../admin/components/ui/AdminActionModal';
import PopoverConfirm from '../../../admin/components/ui/PopoverConfirm';
import { cn } from '../../../admin/utils/cn';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MOCK_REFUNDS = Array.from({ length: 8 }, (_, i) => ({
  id: `REF-${3000 + i}`,
  contractId: `CTR-${8800 + i}`,
  client: `Client Name ${i}`,
  freelancer: `Freelancer ${i}`,
  amount: Math.floor(Math.random() * 20000) + 1500,
  status: i % 3 === 0 ? 'pending' : i % 2 === 0 ? 'completed' : 'rejected',
  date: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
}));

export default function RefundsPage() {
  const [activeTab, setActiveTab] = useState('management');
  const [isLoading, setIsLoading] = useState(true);
  const [actionModal, setActionModal] = useState({ isOpen: false, type: '', data: null });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  const triggerAction = (type, data) => {
    setActionModal({ isOpen: true, type, data });
  };

  const handleActionSuccess = (data, type) => {
    console.log(`Refund ${type} for ${data.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl shadow-sm">
              <RotateCcw size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Refund Management</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Review and process refund requests from clients for cancelled milestones or disputed contracts.
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
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <AuditLogViewer 
             moduleFilter="BILLING" 
             title="Refund Audit Trail"
             description="Records of refund authorizations, reversals, and fund adjustments."
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
                  placeholder="Search Refund ID or Client..." 
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b border-zinc-200 dark:border-zinc-800">
                    <th className="p-4">Refund ID / Date</th>
                    <th className="p-4">Client / Freelancer</th>
                    <th className="p-4">Amount (KES)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="p-4"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-32" /></td>
                        <td className="p-4"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-40" /></td>
                        <td className="p-4"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-20" /></td>
                        <td className="p-4"><div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded w-16" /></td>
                        <td className="p-4 text-right"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-24 ml-auto" /></td>
                      </tr>
                    ))
                  ) : (
                    MOCK_REFUNDS.map(ref => (
                      <tr key={ref.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 group transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{ref.id}</span>
                            <span className="text-[10px] text-zinc-500 mt-0.5">{format(new Date(ref.date), 'MMM dd, yyyy')}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col text-sm">
                            <span className="font-bold text-zinc-700 dark:text-zinc-300">C: {ref.client}</span>
                            <span className="font-medium text-zinc-500">F: {ref.freelancer}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-black text-zinc-900 dark:text-white">
                          {ref.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                            ref.status === 'completed' ? 'bg-emerald-50 text-success' :
                            ref.status === 'rejected' ? 'bg-red-50 text-red-600' :
                            'bg-amber-50 text-amber-600'
                          )}>
                            {ref.status === 'completed' && <CheckCircle2 size={10} />}
                            {ref.status === 'rejected' && <XCircle size={10} />}
                            {ref.status === 'pending' && <Activity size={10} />}
                            {ref.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {ref.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => triggerAction('approve-refund', ref)}
                                  className="px-3 py-1.5 bg-emerald-50 text-success hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors"
                                >
                                  Approve
                                </button>
                                
                                <PopoverConfirm
                                  title="Reject Refund?"
                                  description="The client will be notified and funds will remain in their current state."
                                  variant="danger"
                                  confirmLabel="Reject"
                                  onConfirm={() => toast.success(`Refund ${ref.id} rejected.`)}
                                >
                                  <button className="px-3 py-1.5 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 rounded-lg text-xs font-bold transition-colors">
                                    Reject
                                  </button>
                                </PopoverConfirm>
                              </>
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
