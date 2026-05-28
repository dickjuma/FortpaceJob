import React from 'react';
import { 
  ShieldAlert, AlertTriangle, ShieldX, Flag, XCircle, Search, Eye, CheckCircle
} from 'lucide-react';
import { useJobs, useGigs } from '../../hooks/useMarketplace';
import Avatar from '../../components/ui/Avatar';
import { cn } from '../../utils/cn';

export default function QualityPage() {
  const { data: jobsData } = useJobs({ status: '' }); // Fetch some data to extract flagged ones
  const { data: gigsData } = useGigs({ status: '' });

  // For demonstration, mock filter the first few flagged items
  const flaggedJobs = jobsData?.data?.filter(j => j.flagged) || [];
  const flaggedGigs = gigsData?.data?.filter(g => g.flagged) || [];

  const allFlagged = [
    ...flaggedJobs.map(j => ({ ...j, type: 'job' })),
    ...flaggedGigs.map(g => ({ ...g, type: 'gig' }))
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
              <ShieldAlert size={24} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Quality Control</h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Hub for resolving flagged content, disputes, and enforcing platform quality standards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats Panel */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-5">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle size={20} />
              <h3 className="font-bold">Critical Alerts</h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-red-700 dark:text-red-400">Flagged Jobs</span>
                <span className="font-black text-red-700 dark:text-red-400">{flaggedJobs.length}</span>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Flagged Gigs</span>
                <span className="font-black text-orange-700 dark:text-orange-400">{flaggedGigs.length}</span>
              </div>
              <div className="p-3 bg-surface dark:bg-zinc-800 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Active Disputes</span>
                <span className="font-black text-zinc-700 dark:text-zinc-300">12</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white shadow-md">
             <div className="flex items-center gap-3 mb-2">
               <ShieldX size={20} className="text-white/80" />
               <h3 className="font-bold">Auto-Mod Status</h3>
             </div>
             <p className="text-brand-100 text-sm mb-4">
               The AI moderation engine is actively scanning new listings.
             </p>
             <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
               <div className="flex justify-between items-center text-sm font-medium">
                 <span>Items Scanned Today</span>
                 <span>4,291</span>
               </div>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-surface dark:bg-zinc-800/50">
              <h2 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Flag size={16} className="text-amber-500" /> Action Required Queue
              </h2>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {allFlagged.length === 0 ? (
                <div className="p-12 text-center text-zinc-500">
                  <CheckCircle size={32} className="mx-auto mb-3 text-success opacity-50" />
                  <p>Queue is empty! All flagged content resolved.</p>
                </div>
              ) : (
                allFlagged.map(item => (
                  <div key={item.id} className="p-4 hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-colors flex items-start gap-4">
                    <div className={cn(
                      "p-2 rounded-lg mt-1",
                      item.type === 'job' ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/30' : 'bg-brand-100 text-brand-600 dark:bg-brand-900/30'
                    )}>
                      <AlertTriangle size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded mr-2">
                            {item.type}
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-white">{item.title}</span>
                        </div>
                        <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                          {item.flagReason?.replace('_', ' ') || 'suspicious'}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <button className="text-xs font-semibold px-3 py-1.5 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 rounded-lg hover:bg-brand-100 transition-colors">
                          Investigate
                        </button>
                        <button className="text-xs font-semibold px-3 py-1.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
