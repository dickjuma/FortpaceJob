import React, { useState } from 'react';
import { 
  Repeat, Search, CheckCircle2, XCircle, 
  Clock, MoreVertical, Download, Zap
} from 'lucide-react';
import { cn } from '../../../admin/utils/cn';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useTransactions } from '../../../admin/hooks/useFinancial';
import { Loader2 } from 'lucide-react';

export default function SubscriptionsPage() {
  const { data: trxResponse, isLoading } = useTransactions();
  const subscriptions = (trxResponse?.data || [])
    .filter((t) => (t.type || '').toLowerCase().includes('subscription'))
    .map((t, i) => ({
      id: t.id || t._id || `SUB-${i}`,
      user: t.userName || t.clientName || '—',
      plan: t.plan || t.description || '—',
      amount: t.amount || 0,
      billingCycle: t.billingCycle || t.interval || 'monthly',
      status: (t.status || 'active').toLowerCase(),
      nextBilling: t.nextBillingAt || t.dueDate || new Date().toISOString(),
    }));
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#2bb75c]/10 text-[#2bb75c] rounded-xl shadow-sm">
              <Repeat size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Recurring Subscriptions</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Manage user subscription plans, billing cycles, and recurring revenue.
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => toast.success('Exporting subscription data...')}
             className="px-4 py-2 bg-surface-dark text-white dark:bg-[#2bb75c] rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
           >
             <Download size={16} /> Export Data
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Sub ID or User..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2bb75c] outline-none"
            />
          </div>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="past_due">Past Due</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4">Subscription ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Plan & Cycle</th>
                <th className="p-4 text-right">Amount (KES)</th>
                <th className="p-4">Status</th>
                <th className="p-4">Next Billing</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#2bb75c]" /></td></tr>
              ) : subscriptions.filter(s => !status || s.status === status).length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500 font-medium">No subscriptions found.</td></tr>
              ) : subscriptions.filter(s => !status || s.status === status).map(sub => (
                <tr key={sub.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 group transition-colors">
                  <td className="p-4 font-mono text-sm font-bold text-zinc-900 dark:text-white">
                    {sub.id}
                  </td>
                  <td className="p-4 font-bold text-zinc-900 dark:text-white">
                    {sub.user}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                        <Zap size={12} className="text-amber-500" /> {sub.plan}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{sub.billingCycle}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-black text-zinc-900 dark:text-white">
                    {sub.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                      sub.status === 'past_due' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' :
                      sub.status === 'cancelled' ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' :
                      'bg-emerald-50 text-success dark:bg-emerald-900/20'
                    )}>
                      {sub.status === 'past_due' && <Clock size={12} />}
                      {sub.status === 'cancelled' && <XCircle size={12} />}
                      {sub.status === 'active' && <CheckCircle2 size={12} />}
                      {sub.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {sub.status !== 'cancelled' ? format(new Date(sub.nextBilling), 'MMM dd, yyyy') : '-'}
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 text-zinc-400 hover:bg-zinc-100 rounded-lg">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

