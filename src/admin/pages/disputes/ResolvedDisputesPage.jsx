import React, { useState } from 'react';
import { 
  Gavel, Search, CheckCircle2, ShieldCheck, 
  FileText, Download
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MOCK_RESOLVED = [
  { id: 'DSP-395', contract: 'Logo Design', client: 'Alice M.', freelancer: 'Bob C.', amount: 500, outcome: 'full_refund_to_client', dateResolved: new Date().toISOString() },
  { id: 'DSP-390', contract: 'SEO Optimization', client: 'RetailCo', freelancer: 'Sam L.', amount: 800, outcome: 'partial_split', split: '50/50', dateResolved: new Date(Date.now() - 86400000).toISOString() },
  { id: 'DSP-388', contract: 'Backend API', client: 'Startup Inc', freelancer: 'Jane Doe', amount: 3500, outcome: 'full_release_to_freelancer', dateResolved: new Date(Date.now() - 86400000 * 2).toISOString() },
];

export default function ResolvedDisputesPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-success/10 text-success rounded-xl shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Resolved Cases & Archive</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Immutable log of all arbitration rulings, fund splits, and case histories.
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => toast.success('Exporting archive log...')}
             className="px-4 py-2 bg-surface-dark text-white dark:bg-brand-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
           >
             <Download size={16} /> Export Archive
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Case ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4">Case ID</th>
                <th className="p-4">Date Resolved</th>
                <th className="p-4">Parties Involved</th>
                <th className="p-4">Escrow Value</th>
                <th className="p-4">Arbitration Outcome</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {MOCK_RESOLVED.map(caseItem => (
                <tr key={caseItem.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4 font-mono text-sm font-bold text-zinc-900 dark:text-white">
                    {caseItem.id}
                  </td>
                  <td className="p-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {format(new Date(caseItem.dateResolved), 'MMM dd, yyyy')}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col text-sm">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300"><span className="text-zinc-400 text-xs">C:</span> {caseItem.client}</span>
                      <span className="font-bold text-zinc-700 dark:text-zinc-300 mt-0.5"><span className="text-zinc-400 text-xs">F:</span> {caseItem.freelancer}</span>
                    </div>
                  </td>
                  <td className="p-4 font-black text-zinc-900 dark:text-white">
                    KES {caseItem.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                      caseItem.outcome === 'full_refund_to_client' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' :
                      caseItem.outcome === 'full_release_to_freelancer' ? 'bg-emerald-50 text-success dark:bg-emerald-900/20' :
                      'bg-brand-50 text-brand-600 dark:bg-brand-900/20'
                    )}>
                      <CheckCircle2 size={12} />
                      {caseItem.outcome.replace(/_/g, ' ')} {caseItem.split ? `(${caseItem.split})` : ''}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => toast.success(`Downloading PDF ruling for ${caseItem.id}`)}
                      className="px-3 py-1.5 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ml-auto"
                    >
                      <FileText size={14} /> Full Report
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
