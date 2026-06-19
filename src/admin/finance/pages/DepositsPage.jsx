import React, { useState } from 'react';
import { 
  ArrowDownToLine, Search, CheckCircle2, 
  Clock, XCircle, MoreVertical, CreditCard 
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import { useTransactions } from '../../hooks/useFinancial';
import { Loader2 } from 'lucide-react';

export default function DepositsPage() {
  const { data: trxResponse, isLoading } = useTransactions();
  const deposits = (trxResponse?.data || [])
    .filter((t) => ['deposit', 'payment', 'credit'].includes((t.type || '').toLowerCase()))
    .map((t, i) => ({
      id: t.id || t._id || `DEP-${i}`,
      client: t.clientName || t.user?.name || t.payer || '—',
      method: t.method || t.gateway || '—',
      reference: t.reference || t.externalRef || '—',
      amount: t.amount || 0,
      status: (t.status || 'pending').toLowerCase(),
      date: t.createdAt || t.date || new Date().toISOString(),
    }));
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-success/10 text-success rounded-xl shadow-sm">
              <ArrowDownToLine size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Client Deposits</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Monitor incoming fund transfers to User Wallets and Escrow Holding.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Deposit ID or Client..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#4C1D95] outline-none"
            />
          </div>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed (Settled)</option>
            <option value="pending">Pending Clearing</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4">Deposit ID</th>
                <th className="p-4">Client</th>
                <th className="p-4">Gateway / Reference</th>
                <th className="p-4 text-right">Amount (KES)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#4C1D95]" /></td></tr>
              ) : deposits.filter(d => !status || d.status === status).length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500 font-medium">No deposits found.</td></tr>
              ) : deposits.filter(d => !status || d.status === status).map(dep => (
                <tr key={dep.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 group transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{dep.id}</span>
                      <span className="text-[10px] text-zinc-500 font-medium mt-0.5">{format(new Date(dep.date), 'MMM dd, HH:mm')}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-zinc-900 dark:text-white">{dep.client}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                        <CreditCard size={12} /> {dep.method}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono tracking-tight">{dep.reference}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-black text-success dark:text-success">
                      +{dep.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                      dep.status === 'pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' :
                      dep.status === 'failed' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' :
                      'bg-emerald-50 text-success dark:bg-emerald-900/20'
                    )}>
                      {dep.status === 'pending' && <Clock size={12} />}
                      {dep.status === 'failed' && <XCircle size={12} />}
                      {dep.status === 'completed' && <CheckCircle2 size={12} />}
                      {dep.status}
                    </span>
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


