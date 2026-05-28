import React, { useState } from 'react';
import { 
  DollarSign, Activity, Wallet, ShieldCheck, 
  ArrowUpRight, Search, 
  Download, CreditCard
} from 'lucide-react';
import { useFinancialStats, useTransactions } from '../hooks/useFinancial';
import useFinancialStore from '../store/financialStore';
import { TRANSACTION_STATUSES } from '../config/financialConfig';
import { cn } from '../../../admin/utils/cn';
import { format } from 'date-fns';
import TransactionDetailModal from '../components/modals/TransactionDetailModal';
import AuditLogViewer from '../../../admin/components/audit/AuditLogViewer';

const StatusBadge = ({ status }) => {
  const config = TRANSACTION_STATUSES[status] || TRANSACTION_STATUSES.pending;
  return (
    <span className={cn("inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider", config.bg, config.color)}>
      {config.label}
    </span>
  );
};

export default function FinancialHubPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data: stats } = useFinancialStats();
  const { data: trxData, isLoading: trxLoading } = useTransactions();
  const { filters, setFilter } = useFinancialStore();
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-success/10 text-success rounded-xl">
              <DollarSign size={24} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Financial Control Hub</h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Monitor revenue, platform fees, escrow holdings, and manage user withdrawals.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab(activeTab === 'dashboard' ? 'audit' : 'dashboard')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2",
              activeTab === 'audit' ? "bg-surface-dark text-white dark:bg-brand-600" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-surface"
            )}
          >
            <Activity size={16} /> {activeTab === 'dashboard' ? 'Audit Trail' : 'Back to Dashboard'}
          </button>
          <button className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:bg-surface transition-colors flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <AuditLogViewer 
             moduleFilter="BILLING,PAYMENT" 
             title="Financial Audit Logs"
             description="Tracking all platform revenue, commission adjustments, and disbursement activities."
           />
        </div>
      ) : (
        <>

      {/* Top Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white dark:bg-surface-dark rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-50 text-brand-500 rounded-xl">
                <Activity size={18} />
              </div>
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Gross Volume</h3>
            </div>
            <span className="text-xs font-bold text-success flex items-center bg-emerald-50 px-2 py-0.5 rounded-full"><ArrowUpRight size={12}/> {stats?.revenue?.trend || 0}%</span>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white">
            <span className="text-sm text-zinc-400 font-bold mr-1">KES</span>
            {stats?.revenue?.total?.toLocaleString() || 0}
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Processed today</span>
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">KES 24,500</span>
          </div>
        </div>
        
        <div className="p-6 bg-white dark:bg-surface-dark rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-success rounded-xl">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Escrow Holdings</h3>
            </div>
            <span className="text-xs font-bold text-zinc-400 bg-surface px-2 py-0.5 rounded-full">{stats?.escrow?.active || 0} active</span>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white">
            <span className="text-sm text-zinc-400 font-bold mr-1">KES</span>
            {stats?.escrow?.total?.toLocaleString() || 0}
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Awaiting Release</span>
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{stats?.escrow?.pendingRelease || 4} cases</span>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-surface-dark rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                <Wallet size={18} />
              </div>
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Pending Payouts</h3>
            </div>
            <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">{stats?.pendingWithdrawals?.count || 0} req</span>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
            <span className="text-sm text-amber-600/50 font-bold mr-1">KES</span>
            {stats?.pendingWithdrawals?.amount?.toLocaleString() || 0}
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Next batch in</span>
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">2h 15m</span>
          </div>
        </div>

        <div className="p-6 bg-surface-dark rounded-[32px] shadow-xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 text-success rounded-xl">
                  <CreditCard size={18} />
                </div>
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Platform Fees</h3>
              </div>
              <span className="text-xs font-bold text-success flex items-center bg-white/5 px-2 py-0.5 rounded-full"><ArrowUpRight size={12}/> {stats?.platformFees?.trend || 0}%</span>
            </div>
            <div className="text-3xl font-black">
              <span className="text-sm text-success font-bold mr-1">KES</span>
              {stats?.platformFees?.total?.toLocaleString() || 0}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Net Revenue</span>
              <span className="text-xs font-bold text-success">Stable</span>
            </div>
          </div>
          {/* Decorative glow */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-success/10 rounded-full blur-2xl group-hover:bg-success/20 transition-all" />
        </div>
      </div>

      {/* High-Accessibility Module Directory */}
      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-6">Financial Command Directory</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Core Ledger & Activity */}
            <div className="group bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:border-brand-500/50 transition-all cursor-pointer" onClick={() => window.location.pathname = '/admin/finance/transactions'}>
               <div className="w-16 h-16 bg-brand-500/10 text-brand-600 rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity size={32} />
               </div>
               <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">General Ledger</h3>
               <p className="text-sm text-zinc-500 mb-6 leading-relaxed">Immutable record of every single transaction on the platform. Audit-ready double-entry logs.</p>
               <div className="flex items-center text-brand-600 font-bold text-sm">
                 Open Ledger <ArrowUpRight size={16} className="ml-1" />
               </div>
            </div>

            {/* Deposits Management */}
            <div className="group bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:border-emerald-500/50 transition-all cursor-pointer" onClick={() => window.location.pathname = '/admin/finance/deposits'}>
               <div className="w-16 h-16 bg-success/10 text-success rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Download size={32} />
               </div>
               <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Client Deposits</h3>
               <p className="text-sm text-zinc-500 mb-6 leading-relaxed">Track all incoming funds from clients. Manage bank transfers, cards, and M-Pesa flows.</p>
               <div className="flex items-center text-success font-bold text-sm">
                 Manage Deposits <ArrowUpRight size={16} className="ml-1" />
               </div>
            </div>

            {/* Withdrawals & Payouts */}
            <div className="group bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:border-amber-500/50 transition-all cursor-pointer" onClick={() => window.location.pathname = '/admin/finance/withdrawals'}>
               <div className="w-16 h-16 bg-amber-500/10 text-amber-600 rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Wallet size={32} />
               </div>
               <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Withdrawals</h3>
               <p className="text-sm text-zinc-500 mb-6 leading-relaxed">Process freelancer payout requests. Batch approve and monitor clearing status.</p>
               <div className="flex items-center text-amber-600 font-bold text-sm">
                 Approve Payouts <ArrowUpRight size={16} className="ml-1" />
               </div>
            </div>

            {/* Subscriptions */}
            <div className="group bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:border-purple-500/50 transition-all cursor-pointer" onClick={() => window.location.pathname = '/admin/finance/subscriptions'}>
               <div className="w-16 h-16 bg-brand-500/10 text-brand-600 rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CreditCard size={32} />
               </div>
               <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Subscriptions</h3>
               <p className="text-sm text-zinc-500 mb-6 leading-relaxed">Manage recurring revenue, plan tiers, and automated billing for platform members.</p>
               <div className="flex items-center text-brand-600 font-bold text-sm">
                 Revenue Manager <ArrowUpRight size={16} className="ml-1" />
               </div>
            </div>

            {/* Fees & Revenue */}
            <div className="group bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:border-zinc-500/50 transition-all cursor-pointer" onClick={() => window.location.pathname = '/admin/finance/fee-collection'}>
               <div className="w-16 h-16 bg-zinc-500/10 text-zinc-600 rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <DollarSign size={32} />
               </div>
               <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Fees Collected</h3>
               <p className="text-sm text-zinc-500 mb-6 leading-relaxed">Analyze platform revenue from commissions and withdrawal cuts. Monitor real-time earnings.</p>
               <div className="flex items-center text-zinc-600 font-bold text-sm">
                 View Earnings <ArrowUpRight size={16} className="ml-1" />
               </div>
            </div>

            {/* Tax & Compliance */}
            <div className="group bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:border-red-500/50 transition-all cursor-pointer" onClick={() => window.location.pathname = '/admin/finance/tax'}>
               <div className="w-16 h-16 bg-red-500/10 text-red-600 rounded-[24px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={32} />
               </div>
               <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Tax Compliance</h3>
               <p className="text-sm text-zinc-500 mb-6 leading-relaxed">Automated VAT, Withholding Tax, and KRA compliance reporting for auditing.</p>
               <div className="flex items-center text-red-600 font-bold text-sm">
                 Review Compliance <ArrowUpRight size={16} className="ml-1" />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table Section */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 items-center justify-between bg-surface dark:bg-zinc-800/50">
          <h2 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <CreditCard size={18} className="text-zinc-400"/> Recent Transactions
          </h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search Ref ID..." 
                value={filters.transactions.search}
                onChange={(e) => setFilter('transactions', 'search', e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none w-48"
              />
            </div>
            <select 
              value={filters.transactions.status}
              onChange={(e) => setFilter('transactions', 'status', e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none"
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Type & Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {trxLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-zinc-500">Loading ledger...</td></tr>
              ) : (
                trxData?.data?.slice(0, 10).map(trx => (
                  <tr key={trx.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20">
                    <td className="p-4 font-mono text-xs font-bold text-zinc-500">{trx.id}</td>
                    <td className="p-4 font-semibold text-zinc-900 dark:text-white">{trx.user}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold capitalize text-zinc-700 dark:text-zinc-300">{trx.type}</span>
                        <span className="text-[10px] text-zinc-500 uppercase">{trx.method}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn("font-black", trx.type === 'withdrawal' ? 'text-amber-600' : trx.type === 'refund' ? 'text-red-500' : 'text-success')}>
                        {trx.type === 'withdrawal' ? '-' : '+'}{trx.currency} {trx.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {format(new Date(trx.date), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="p-4"><StatusBadge status={trx.status} /></td>
                    <td className="p-4 text-right">
                       <button 
                         onClick={() => setSelectedTransaction(trx)}
                         className="text-xs font-semibold px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                       >
                         View
                       </button>
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

      <TransactionDetailModal 
        isOpen={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
