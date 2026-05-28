import React, { useState } from 'react';
import { 
  Globe, Search, Map, ShieldAlert, 
  Activity, ArrowUpRight, CheckCircle2, MoreVertical, LayoutGrid, List
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const MOCK_IPS = [
  { ip: '102.44.5.1', userCount: 1, country: 'Kenya', city: 'Nairobi', score: 98, status: 'safe', lastActive: 'Now' },
  { ip: '45.12.33.12', userCount: 8, country: 'Russia', city: 'Moscow', score: 42, status: 'suspicious', lastActive: '2m ago' },
  { ip: '192.168.1.101', userCount: 1, country: 'Unknown', city: 'Private Network', score: 10, status: 'blocked', lastActive: '1d ago' },
];

export default function IPMonitoringPage() {
  const [view, setView] = useState('list');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-brand-500/10 text-brand-600 rounded-xl shadow-sm">
              <Globe size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">IP Intelligence Monitoring</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Monitor traffic origins, detect VPN/Proxy usage, and identify high-risk networks.
          </p>
        </div>
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
           <button 
             onClick={() => setView('list')}
             className={cn("p-2 rounded-lg transition-all", view === 'list' ? "bg-white dark:bg-zinc-700 shadow-sm text-brand-600" : "text-zinc-500")}
           >
             <List size={18} />
           </button>
           <button 
             onClick={() => setView('grid')}
             className={cn("p-2 rounded-lg transition-all", view === 'grid' ? "bg-white dark:bg-zinc-700 shadow-sm text-brand-600" : "text-zinc-500")}
           >
             <LayoutGrid size={18} />
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search IP Address or Location..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface dark:bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest font-black border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4">IP Address</th>
                <th className="p-4">Geographic Origin</th>
                <th className="p-4 text-center">User Density</th>
                <th className="p-4 text-center">Safety Score</th>
                <th className="p-4">Network Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {MOCK_IPS.map(item => (
                <tr key={item.ip} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4 font-mono text-sm font-bold text-zinc-900 dark:text-white">
                    {item.ip}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{item.country}</span>
                      <span className="text-xs text-zinc-500 font-medium">{item.city}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-black text-zinc-700 dark:text-zinc-300">
                      {item.userCount}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn(
                        "text-xs font-black",
                        item.score > 80 ? "text-success" : item.score > 40 ? "text-amber-500" : "text-rose-500"
                      )}>
                        {item.score}%
                      </span>
                      <div className="w-20 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            item.score > 80 ? "bg-success" : item.score > 40 ? "bg-amber-500" : "bg-rose-500"
                          )} 
                          style={{ width: `${item.score}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                      item.status === 'suspicious' ? 'bg-amber-50 text-amber-600' :
                      item.status === 'blocked' ? 'bg-rose-50 text-rose-600' :
                      'bg-emerald-50 text-success'
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => toast.success(`Analyzing network for ${item.ip}...`)}
                      className="p-2 text-zinc-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      <Activity size={18} />
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
