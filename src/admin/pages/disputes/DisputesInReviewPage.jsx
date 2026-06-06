import React, { useState } from 'react';
import { useDisputes, useDisputeActions } from '../../hooks/useDisputes';
import { 
  Gavel, Search, CheckCircle2, AlertTriangle, 
  Clock, ArrowRight, XCircle, FileText, CheckCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

export default function DisputesInReviewPage() {
  const [search, setSearch] = useState('');
  const { data: disputesData, isLoading, error } = useDisputes();
  const { resolveDispute, escalateDispute } = useDisputeActions();

  const disputes = disputesData?.data || [];

  const filteredDisputes = disputes.filter(d => 
    d.id?.toLowerCase().includes(search.toLowerCase()) ||
    d.contract?.toLowerCase().includes(search.toLowerCase()) ||
    d.client?.toLowerCase().includes(search.toLowerCase()) ||
    d.freelancer?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="p-8">Loading disputes...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load disputes</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl shadow-sm">
              <Clock size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Disputes In Review</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Manage active cases currently assigned to the arbitration queue.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Case ID or Contract..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#4C1D95] outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4">Case ID / Contract</th>
                <th className="p-4">Parties Involved</th>
                <th className="p-4">Escrow Value</th>
                <th className="p-4">Current Phase</th>
                <th className="p-4">Time Remaining</th>
                <th className="p-4 text-right">Arbitration Actions</th>
              </tr>
            </thead>
<tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
               {filteredDisputes.map(caseItem => (
                 <tr key={caseItem.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-colors">
                   <td className="p-4">
                     <div className="flex flex-col">
                       <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{caseItem.id || caseItem.disputeId}</span>
                       <span className="text-xs text-zinc-500 font-medium mt-0.5">{caseItem.contract || caseItem.title}</span>
                     </div>
                   </td>
                   <td className="p-4">
                     <div className="flex flex-col text-sm">
                       <span className="font-bold text-zinc-700 dark:text-zinc-300"><span className="text-zinc-400 text-xs">C:</span> {caseItem.client || caseItem.clientName}</span>
                       <span className="font-bold text-zinc-700 dark:text-zinc-300 mt-0.5"><span className="text-zinc-400 text-xs">F:</span> {caseItem.freelancer || caseItem.freelancerName}</span>
                     </div>
                   </td>
                   <td className="p-4 font-black text-zinc-900 dark:text-white">
                     KES {(caseItem.amount || caseItem.escrowAmount)?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                   </td>
                   <td className="p-4">
                     <span className={cn(
                       "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                       caseItem.phase === 'evidence_gathering' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' :
                       caseItem.phase === 'arbitrator_review' ? 'bg-[#4C1D95]/5 text-[#4C1D95] dark:bg-[#4C1D95]/20' :
                       'bg-[#4C1D95]/5 text-[#4C1D95] dark:bg-[#4C1D95]/20'
                     )}>
                       {(caseItem.status || caseItem.phase)?.replace('_', ' ') || 'in review'}
                     </span>
                   </td>
                   <td className="p-4 text-sm font-bold text-rose-600">
                     {caseItem.deadline || caseItem.timeRemaining || 'N/A'}
                   </td>
                   <td className="p-4 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toast.success(`Viewing evidence logs for ${caseItem.id || caseItem.disputeId}`)}
                          className="px-3 py-1.5 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-xs font-bold transition-colors"
                        >
                          View Evidence
                        </button>
                        <button 
                          onClick={() => {
                            const disputeId = caseItem.id || caseItem.disputeId;
                            resolveDispute.mutate({ disputeId, outcome: 'approve', splitPercentage: 85 });
                          }}
                          disabled={resolveDispute.isPending}
                          className="px-3 py-1.5 bg-surface-dark text-white dark:bg-[#4C1D95] hover:bg-zinc-800 rounded-lg text-xs font-bold transition-colors"
                        >
                          {resolveDispute.isPending ? 'Processing...' : 'Issue Ruling'}
                        </button>
                     </div>
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


