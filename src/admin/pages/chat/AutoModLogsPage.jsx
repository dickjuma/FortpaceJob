import React, { useState } from 'react';
import { 
  ShieldCheck, Search, Zap, AlertTriangle, 
  Trash2, Play, Pause, Filter, MessageSquare, ShieldX
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const MOCK_MOD_LOGS = [
  { id: 'MOD-501', user: 'scammer123', trigger: 'Keyword "WhatsApp"', message: 'Contact me on WhatsApp...', action: 'flagged', time: '5m ago' },
  { id: 'MOD-502', user: 'bot_prime', trigger: 'Pattern "Mass Spam"', message: 'Hire me for $5! Check my profile...', action: 'blocked', time: '12m ago' },
  { id: 'MOD-503', user: 'angry_dev', trigger: 'Profanity Filter', message: 'You are a f***ing idiot...', action: 'masked', time: '1h ago' },
];

export default function AutoModLogsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-brand-500/10 text-brand-600 rounded-xl shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Auto-Mod Performance Logs</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Monitor the automated content filtering system and audit its intervention history.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => toast.success('Auto-Mod filters updated.')}
            className="px-5 py-2.5 bg-surface-dark text-white dark:bg-brand-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            Update Filter Rules
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by User or Trigger..." 
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
                <th className="p-4">Log ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Trigger Reason</th>
                <th className="p-4">Filtered Message</th>
                <th className="p-4">Action Taken</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {MOCK_MOD_LOGS.map(log => (
                <tr key={log.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{log.id}</span>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-0.5 font-bold">
                      {log.time}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    {log.user}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md text-[10px] font-black uppercase tracking-widest border border-zinc-200 dark:border-zinc-700">
                      <Zap size={10} className="text-brand-500" /> {log.trigger}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="p-2 bg-surface dark:bg-zinc-800/50 rounded-lg text-xs font-medium text-zinc-500 max-w-[250px] truncate">
                      {log.message}
                    </div>
                  </td>
                  <td className="p-4">
                     <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                      log.action === 'blocked' ? 'bg-rose-100 text-rose-700' :
                      log.action === 'flagged' ? 'bg-amber-100 text-amber-700' :
                      'bg-brand-100 text-brand-700'
                    )}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => toast.success(`Viewing full context for log ${log.id}`)}
                      className="p-2 text-zinc-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      <MessageSquare size={16} />
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
