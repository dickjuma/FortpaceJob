import React, { useState } from 'react';
import { 
  ShieldAlert, Search, AlertTriangle, 
  Eye, ShieldX, MapPin, Globe
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const MOCK_ALERTS = [
  { id: 'ALT-901', type: 'Brute Force Attempt', severity: 'high', user: 'johndoe@example.com', location: 'Moscow, RU', ip: '192.168.1.1', status: 'pending', date: new Date().toISOString() },
  { id: 'ALT-902', type: 'Impossible Travel', severity: 'critical', user: 'sarah@example.com', location: 'Nairobi, KE & London, UK', ip: '45.12.33.1', status: 'in_review', date: new Date(Date.now() - 3600000).toISOString() },
  { id: 'ALT-903', type: 'High Value Withdrawal', severity: 'medium', user: 'mike@tech.com', location: 'Lagos, NG', ip: '102.3.4.5', status: 'resolved', date: new Date(Date.now() - 7200000).toISOString() },
];

export default function SecurityAlertsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-rose-500/20 text-rose-500 rounded-xl shadow-sm border border-rose-500/20">
              <ShieldAlert size={24} />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Security Alerts</h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Real-time monitoring of suspicious activity and potential security threats.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-navy rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden relative">
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-rose-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="p-6 md:p-8 border-b border-zinc-200 dark:border-white/10 flex flex-wrap gap-3 relative z-10">
          <div className="relative flex-1 min-w-[240px] group">
            <Search className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-zinc-400 group-focus-within:text-accent-purple transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by User or IP..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-white/5 border border-transparent focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50 rounded-xl text-sm outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-white/5 border-b border-zinc-100 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-8 py-5">Alert ID / Type</th>
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Location / IP</th>
                <th className="px-8 py-5 text-center">Severity</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-white/5">
              {MOCK_ALERTS.map(alert => (
                <tr key={alert.id} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white group-hover:text-accent-purple transition-colors">{alert.id}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold mt-0.5">{alert.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-zinc-700 dark:text-zinc-300 text-sm">
                    {alert.user}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                        <MapPin size={14} className="text-zinc-400" /> {alert.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-500">
                        <Globe size={14} className="text-zinc-400" /> {alert.ip}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      alert.severity === 'critical' ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400' :
                      alert.severity === 'high' ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400' :
                      'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    )}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                     <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      alert.status === 'pending' ? 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300' :
                      alert.status === 'in_review' ? 'bg-accent-purple/10 text-accent-purple' :
                      'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    )}>
                      {alert.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                         onClick={() => toast.success(`Investigating ${alert.id}...`)}
                         className="p-2 text-zinc-400 hover:text-accent-purple hover:bg-accent-purple/10 rounded-xl transition-colors"
                         title="Investigate"
                       >
                         <Eye size={18} />
                       </button>
                       <button 
                         onClick={() => toast.success(`User ${alert.user} flagged for review.`)}
                         className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-colors"
                         title="Flag User"
                       >
                         <AlertTriangle size={18} />
                       </button>
                       <button 
                         onClick={() => toast.success(`User ${alert.user} blocked successfully.`)}
                         className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                         title="Block Account"
                       >
                         <ShieldX size={18} />
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
