import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Filter, Calendar, 
  Download, Eye, Plus, ArrowRightLeft, Activity, X
} from 'lucide-react';
import { format } from 'date-fns';

// Inline cn utility to avoid missing import
function cn(...classes) { return classes.filter(Boolean).join(' '); }

// Stub: financial store
function useFinancialStore() {
  const [filters] = useState({ transactions: { search: '' } });
  return { filters, setFilter: () => {} };
}

// Stub: AuditLogViewer
function AuditLogViewer({ title, description }) {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
      <Activity className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
      <h3 className="font-bold text-zinc-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-zinc-500">{description}</p>
    </div>
  );
}

// Stub: TransactionDetailModal
function TransactionDetailModal({ isOpen, transaction, onClose }) {
  if (!isOpen || !transaction) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-zinc-200 dark:border-zinc-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-zinc-900 dark:text-white">Transaction Detail</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-zinc-500">ID</span><span className="font-bold">{transaction.id}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">Type</span><span className="font-bold capitalize">{transaction.type}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">Status</span><span className="font-bold capitalize">{transaction.status}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">Amount</span><span className="font-bold">{transaction.amount?.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}

const MOCK_TRANSACTIONS = Array.from({ length: 20 }, (_, i) => ({
  id: `TRX-${1000 + i}`,
  type: i % 3 === 0 ? 'payment' : i % 4 === 0 ? 'withdrawal' : 'refund',
  amount: 25000 + (Math.random() * 75000),
  currency: 'KES',
  status: i % 7 === 0 ? 'failed' : i % 5 === 0 ? 'pending' : 'completed',
  date: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
  reference: `REF-${Math.floor(Math.random() * 1000000)}`,
  account: i % 2 === 0 ? 'Escrow Holding' : 'Platform Revenue'
}));

const LedgerEntryBadge = ({ type }) => (
  <span className={cn(
    "px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
    type === 'debit' ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20" : "bg-emerald-50 text-success dark:bg-emerald-900/20"
  )}>
    {type}
  </span>
);

export default function LedgerPage() {
  const [activeTab, setActiveTab] = useState('ledger');
  const [isLoading, setIsLoading] = useState(true);
  const [trxData, setTrxData] = useState({ data: [] });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const { filters, setFilter } = useFinancialStore();

  useEffect(() => {
    // Simulate live data fetch
    const timer = setTimeout(() => {
      setTrxData({ data: MOCK_TRANSACTIONS });
      setIsLoading(false);
    }, 1300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-zinc-800 text-white rounded-xl shadow-sm">
              <BookOpen size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">General Ledger</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Immutable double-entry accounting records for all platform movements.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab(activeTab === 'ledger' ? 'audit' : 'ledger')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2",
              activeTab === 'audit' ? "bg-surface-dark text-white dark:bg-brand-600" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-surface"
            )}
          >
            <Activity size={16} /> {activeTab === 'ledger' ? 'Audit Trail' : 'Back to Ledger'}
          </button>
          <button className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold shadow-sm hover:bg-surface transition-colors flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
          <button 
            onClick={() => setIsManualEntryOpen(true)}
            className="px-4 py-2 bg-surface-dark text-white dark:bg-brand-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Manual Entry
          </button>
        </div>
      </div>

      {activeTab === 'ledger' ? (
      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search TXN ID, Reference, or Account..." 
              value={filters.transactions.search}
              onChange={(e) => setFilter('transactions', 'search', e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <select className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold outline-none cursor-pointer">
            <option>All Accounts</option>
            <option>Escrow Holding</option>
            <option>Platform Revenue</option>
            <option>User Wallets</option>
            <option>Withdrawal Clearing</option>
            <option>Tax Payable</option>
          </select>
          <button className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-600 flex items-center gap-2">
            <Calendar size={16} /> Date Range
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4">Entry ID / Timestamp</th>
                <th className="p-4">Operation Type</th>
                <th className="p-4">Debit Account</th>
                <th className="p-4">Credit Account</th>
                <th className="p-4 text-right">Amount (KES)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-24" /></td>
                    <td className="p-4"><div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded w-32" /></td>
                    <td className="p-4"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-28" /></td>
                    <td className="p-4"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-28" /></td>
                    <td className="p-4 text-right"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-20 ml-auto" /></td>
                    <td className="p-4 text-center"><div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded w-16 mx-auto" /></td>
                    <td className="p-4 text-right"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : (
                trxData?.data?.map((trx, idx) => {
                  const isWithdrawal = trx.type === 'withdrawal';
                  const isRefund = trx.type === 'refund';
                  const debitAcc = isWithdrawal ? 'User Wallet' : isRefund ? 'Escrow Holding' : 'User Wallet';
                  const creditAcc = isWithdrawal ? 'Withdrawal Clearing' : isRefund ? 'User Wallet' : 'Escrow Holding';

                  return (
                    <tr key={trx.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 group transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">LDG-{trx.id.split('-')[1]}</span>
                          <span className="text-[10px] text-zinc-500 font-medium mt-0.5">{format(new Date(trx.date), 'MMM dd, yyyy HH:mm:ss')}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <ArrowRightLeft size={14} className="text-zinc-400" />
                          <span className="text-sm font-bold text-zinc-900 dark:text-white capitalize">{trx.type === 'payment' ? 'Escrow Funding' : trx.type}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-medium">Ref: {trx.id}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{debitAcc}</span>
                          <LedgerEntryBadge type="debit" />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{creditAcc}</span>
                          <LedgerEntryBadge type="credit" />
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-sm font-black text-zinc-900 dark:text-white">
                          {trx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={cn(
                          "inline-flex px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                          trx.status === 'completed' ? 'bg-emerald-50 text-success dark:bg-emerald-900/20' :
                          trx.status === 'failed' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' :
                          'bg-amber-50 text-amber-600 dark:bg-amber-900/20'
                        )}>
                          {trx.status === 'completed' ? 'Settled' : trx.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setSelectedTransaction(trx)}
                          className="p-1.5 text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 rounded-lg transition-colors" title="View Detail"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <AuditLogViewer 
             moduleFilter="BILLING,PAYMENT" 
             title="Financial Activity Audit"
             description="Tracking payment authorizations, ledger entries, and fund movements."
           />
        </div>
      )}

      <TransactionDetailModal 
        isOpen={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
