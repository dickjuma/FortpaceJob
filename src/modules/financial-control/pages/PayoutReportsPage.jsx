import React from 'react';
import { 
  FileText, Search, Download
} from 'lucide-react';
import { cn } from '../../../admin/utils/cn';
import toast from 'react-hot-toast';

const MOCK_PAYOUTS = [
  { id: 'PAY-8801', provider: 'M-PESA', amount: 45000, fee: 15, status: 'processed', date: '2024-05-01' },
  { id: 'PAY-8802', provider: 'Bank Transfer', amount: 120000, fee: 50, status: 'pending', date: '2024-05-02' },
  { id: 'PAY-8803', provider: 'Stripe', amount: 8500, fee: 5, status: 'processed', date: '2024-04-30' },
];

export default function PayoutReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-brand-500/10 text-brand-600 rounded-xl shadow-sm">
              <FileText size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Payout & Disbursement Logs</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Monitor all funds exiting the platform to freelancers and agencies.
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => toast.success('Generating payout summary...')}
             className="px-4 py-2 bg-surface-dark text-white dark:bg-brand-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
           >
             <Download size={16} /> Export CSV
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Payout ID or Provider..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4">Payout ID</th>
                <th className="p-4">Disbursement Provider</th>
                <th className="p-4 text-right">Net Amount (KES)</th>
                <th className="p-4 text-right">Processing Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4">Settlement Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {MOCK_PAYOUTS.map(item => (
                <tr key={item.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4 font-mono text-sm font-bold text-zinc-900 dark:text-white">
                    {item.id}
                  </td>
                  <td className="p-4 font-bold text-zinc-700 dark:text-zinc-300">
                    {item.provider}
                  </td>
                  <td className="p-4 text-right font-black text-zinc-900 dark:text-white">
                    {item.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-right text-xs font-medium text-zinc-500">
                    {item.fee.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                      item.status === 'processed' ? 'bg-emerald-50 text-success' : 'bg-amber-50 text-amber-600'
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-bold text-zinc-400">
                    {item.date}
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
