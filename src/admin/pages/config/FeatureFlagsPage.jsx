import React from 'react';
import { 
  Layout, Zap, Plus, Settings2, 
  Play, Pause, Trash2, Filter, ToggleLeft, HelpCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const FLAGS = [
  { id: 'FL-1', key: 'ENABLE_CRYPTO_PAYMENTS', description: 'Enable Bitcoin/Ethereum payout options for freelancers.', status: 'off', scope: 'global' },
  { id: 'FL-2', key: 'NEW_JOB_MATCHING_V2', description: 'Enable the AI-driven job recommendation engine.', status: 'on', scope: 'internal_only' },
  { id: 'FL-3', key: 'DARK_MODE_DEFAULT', description: 'Force dark mode as default for all new users.', status: 'on', scope: 'global' },
];

export default function FeatureFlagsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-brand-500/10 text-brand-600 rounded-xl shadow-sm">
              <ToggleLeft size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Feature Flags & Rollouts</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Safely toggle platform features, manage beta testing, and control progressive rollouts.
          </p>
        </div>
        <button 
          onClick={() => toast.success('Flag creation panel opened')}
          className="px-5 py-2.5 bg-surface-dark text-white dark:bg-brand-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Define New Flag
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {FLAGS.map(flag => (
            <div key={flag.id} className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-surface/50 transition-colors">
               <div className="flex gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl shrink-0",
                    flag.status === 'on' ? "bg-emerald-50 text-success" : "bg-zinc-100 text-zinc-400"
                  )}>
                    <Zap size={24} fill={flag.status === 'on' ? "currentColor" : "none"} />
                  </div>
                  <div>
                     <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-mono text-sm font-black text-zinc-900 dark:text-white">{flag.key}</h3>
                        <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[9px] font-black text-zinc-500 uppercase tracking-widest">{flag.scope}</span>
                     </div>
                     <p className="text-xs font-medium text-zinc-500 max-w-lg">{flag.description}</p>
                  </div>
               </div>

               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                     <span className={cn("text-[10px] font-black uppercase tracking-widest", flag.status === 'on' ? "text-success" : "text-zinc-400")}>
                        {flag.status === 'on' ? 'Enabled' : 'Disabled'}
                     </span>
                     <div 
                       onClick={() => toast.success(`Flag ${flag.key} toggled ${flag.status === 'on' ? 'OFF' : 'ON'}`)}
                       className={cn(
                         "w-12 h-6 rounded-full relative cursor-pointer transition-colors",
                         flag.status === 'on' ? "bg-success" : "bg-zinc-300 dark:bg-zinc-700"
                       )}
                     >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                          flag.status === 'on' ? "right-1" : "left-1"
                        )} />
                     </div>
                  </div>
                  <button onClick={() => toast.success(`Deleting flag ${flag.key}`)} className="p-2 text-zinc-400 hover:text-rose-500 transition-colors">
                     <Trash2 size={18} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
