import React, { useState, useEffect } from 'react';
import { 
  Wallet, Search, Clock, CheckCircle2, XCircle, MoreVertical, Activity 
} from 'lucide-react';
import AuditLogViewer from '../../../admin/components/audit/AuditLogViewer';
import AdminActionModal from '../../../admin/components/ui/AdminActionModal';
import PopoverConfirm from '../../../admin/components/ui/PopoverConfirm';
import useFinancialStore from '../store/financialStore';
import { format } from 'date-fns';
import { cn } from '../../../admin/utils/cn';
import toast from 'react-hot-toast';

const MOCK_WITHDRAWALS = Array.from({ length: 12 }, (_, i) => ({
  id: `WTH-${9900 + i}`,
  freelancer: `Freelancer ${i}`,
  method: i % 2 === 0 ? 'M-PESA' : 'Bank Transfer',
  destination: i % 2 === 0 ? '+254712345678' : 'KCB ****4567',
  amount: 5000 + (Math.random() * 45000),
  status: i % 4 === 0 ? 'pending' : i % 5 === 0 ? 'failed' : 'completed',
  date: new Date(Date.now() - Math.random() * 500000000).toISOString(),
}));

export default function WithdrawalsPage() {
  const [activeTab, setActiveTab] = useState('management');
  const [isLoading, setIsLoading] = useState(true);
  const [actionModal, setActionModal] = useState({ isOpen: false, type: '', data: null });
  const { filters, setFilter } = useFinancialStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const triggerAction = (type, data) => {
    setActionModal({ isOpen: true, type, data });
  };

  const handleActionSuccess = (data, type) => {
    console.log(`Action ${type} completed for withdrawal ${data.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-success/10 text-success rounded-xl shadow-sm">
              <Wallet size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Withdrawal Requests</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Review and authorize outgoing payments to freelancer bank accounts and mobile wallets.
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
          <button 
            onClick={() => toast.success('Processing manual batch...')}
            className="px-4 py-2 bg-surface-dark text-white dark:bg-brand-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
             Process Manual Batch
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <AuditLogViewer 
             moduleFilter="PAYMENT" 
             title="Withdrawal Audit Log"
             description="Tracking payout authorizations, gateway responses, and failure investigations."
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
                  placeholder="Search freelancer or ID..." 
                  value={filters.withdrawals.search}
                  onChange={(e) => setFilter('withdrawals', 'search', e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <select 
                value={filters.withdrawals.status}
                onChange={(e) => setFilter('withdrawals', 'status', e.target.value)}
                className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold outline-none cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b border-zinc-200 dark:border-zinc-800">
                    <th className="p-4">Withdrawal ID / Date</th>
                    <th className="p-4">Freelancer</th>
                    <th className="p-4">Method / Destination</th>
                    <th className="p-4">Amount (KES)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="p-4"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-32" /></td>
                        <td className="p-4"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-24" /></td>
                        <td className="p-4"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-40" /></td>
                        <td className="p-4"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-20" /></td>
                        <td className="p-4"><div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded w-16" /></td>
                        <td className="p-4 text-right"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-24 ml-auto" /></td>
                      </tr>
                    ))
                  ) : (
                    MOCK_WITHDRAWALS.filter(w => !filters.withdrawals.status || w.status === filters.withdrawals.status).map(withdrawal => (
                      <tr key={withdrawal.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 group transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{withdrawal.id}</span>
                            <span className="text-[10px] text-zinc-500 mt-0.5">{format(new Date(withdrawal.date), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-zinc-700 dark:text-zinc-300 text-sm">
                          {withdrawal.freelancer}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-zinc-900 dark:text-white">{withdrawal.method}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">{withdrawal.destination}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-black text-zinc-900 dark:text-white">
                          {withdrawal.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                            withdrawal.status === 'completed' ? 'bg-emerald-50 text-success' :
                            withdrawal.status === 'failed' ? 'bg-red-50 text-red-600' :
                            'bg-amber-50 text-amber-600'
                          )}>
                            {withdrawal.status === 'completed' && <CheckCircle2 size={10} />}
                            {withdrawal.status === 'failed' && <XCircle size={10} />}
                            {withdrawal.status === 'pending' && <Clock size={10} />}
                            {withdrawal.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {withdrawal.status === 'pending' && (
                              <>
                                <PopoverConfirm
                                  title="Approve Payout?"
                                  description={`Authorize transfer of ${withdrawal.amount.toLocaleString()} KES to ${withdrawal.destination}?`}
                                  variant="info"
                                  confirmLabel="Authorize"
                                  onConfirm={() => toast.success(`Approved withdrawal ${withdrawal.id}`)}
                                >
                                  <button className="px-3 py-1.5 bg-emerald-50 text-success hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors">
                                    Approve
                                  </button>
                                </PopoverConfirm>
                                
                                <button 
                                  onClick={() => triggerAction('block-withdrawal', withdrawal)}
                                  className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                                >
                                  Block
                                </button>
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
