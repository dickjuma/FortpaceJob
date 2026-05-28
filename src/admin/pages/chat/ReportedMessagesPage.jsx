import React, { useState } from 'react';
import { 
  Flag, Search, ShieldAlert, AlertCircle, 
  Trash2, CheckCircle2, MessageSquare, User, Clock, ShieldX
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const MOCK_REPORTS = [
  { id: 'REP-201', reporter: 'Client_A', reported: 'Freelancer_X', reason: 'Abusive language', snippet: 'You are a complete idiot and I will...', time: '10m ago', severity: 'medium', status: 'pending' },
  { id: 'REP-202', reporter: 'Sarah', reported: 'Unknown_User', reason: 'Phishing attempt', snippet: 'Click this link to verify your...', time: '45m ago', severity: 'critical', status: 'under_investigation' },
  { id: 'REP-203', reporter: 'System', reported: 'Bot_99', reason: 'Spamming', snippet: 'Cheap services! Visit my site...', time: '2h ago', severity: 'high', status: 'pending' },
];

export default function ReportedMessagesPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl shadow-sm">
              <Flag size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Reported Messages</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Review and take action on user reports regarding inappropriate or suspicious messages.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search reports..." 
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
                <th className="p-4">Report Details</th>
                <th className="p-4">Parties</th>
                <th className="p-4">Message Snippet</th>
                <th className="p-4 text-center">Severity</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {MOCK_REPORTS.map(report => (
                <tr key={report.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{report.id}</span>
                      <span className="text-xs text-rose-500 font-bold mt-0.5">{report.reason}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    <div className="flex flex-col">
                      <span>Reporter: {report.reporter}</span>
                      <span className="text-rose-600">Reported: {report.reported}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="p-3 bg-surface dark:bg-zinc-800 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 italic max-w-[300px] whitespace-normal">
                      "{report.snippet}"
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                      report.severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                      report.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-brand-100 text-brand-700'
                    )}>
                      {report.severity}
                    </span>
                  </td>
                  <td className="p-4">
                     <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                      report.status === 'pending' ? 'bg-zinc-100 text-zinc-600' : 'bg-brand-50 text-brand-600'
                    )}>
                      {report.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => toast.success(`Report dismissed.`)}
                         className="p-2 text-zinc-400 hover:text-success hover:bg-emerald-50 rounded-lg transition-colors"
                         title="Dismiss"
                       >
                         <CheckCircle2 size={16} />
                       </button>
                       <button 
                         onClick={() => toast.success(`Message deleted.`)}
                         className="p-2 text-zinc-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                         title="Delete Message"
                       >
                         <Trash2 size={16} />
                       </button>
                       <button 
                         onClick={() => toast.success(`Reported user ${report.reported} banned.`)}
                         className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                         title="Ban User"
                       >
                         <ShieldX size={16} />
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
