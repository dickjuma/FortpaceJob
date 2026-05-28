import React, { useState } from 'react';
import { 
  PiggyBank, Search, TrendingUp, Download, MoreVertical 
} from 'lucide-react';
import { cn } from '../../../admin/utils/cn';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MOCK_FEES = Array.from({ length: 12 }, (_, i) => ({
  id: `FEE-${2000 + i}`,
  type: i % 4 === 0 ? 'Withdrawal Fee' : 'Platform Commission',
  sourceId: i % 4 === 0 ? `WTH-${9900 + i}` : `ESC-${4500 + i}`,
  amount: i % 4 === 0 ? 50 : Math.floor(Math.random() * 5000) + 500,
  date: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(),
}));

export default function FeeCollectionPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-violet-500/10 text-violet-600 rounded-xl shadow-sm">
              <PiggyBank size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Fee Collection Log</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Immutable record of all platform revenue collected from commissions and flat fees.
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => toast.success('Exporting Revenue Log to CSV...')}
             className="px-4 py-2 bg-surface-dark text-white dark:bg-brand-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
           >
             <Download size={16} /> Export Revenue
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Fee ID or Source Ref..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold outline-none cursor-pointer"
          >
            <option value="">All Revenue Streams</option>
            <option value="Platform Commission">Platform Commissions</option>
            <option value="Withdrawal Fee">Withdrawal Fees</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4">Collection ID</th>
                <th className="p-4">Revenue Type</th>
                <th className="p-4">Source Reference</th>
                <th className="p-4 text-right">Collected (KES)</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {MOCK_FEES.filter(f => !type || f.type === type).map(fee => (
                <tr key={fee.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 group transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{fee.id}</span>
                      <span className="text-[10px] text-zinc-500 font-medium mt-0.5">{format(new Date(fee.date), 'MMM dd, HH:mm')}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "inline-flex px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                      fee.type === 'Platform Commission' ? 'bg-violet-50 text-violet-600 dark:bg-violet-900/20' : 'bg-emerald-50 text-success dark:bg-emerald-900/20'
                    )}>
                      {fee.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400">
                    {fee.sourceId}
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-black text-zinc-900 dark:text-white flex items-center justify-end gap-1">
                      <TrendingUp size={14} className="text-brand-500" />
                      +{fee.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
