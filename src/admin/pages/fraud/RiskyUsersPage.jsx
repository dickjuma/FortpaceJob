import React, { useState } from 'react';
import { 
  Users, Search, ShieldAlert, AlertCircle, 
  Eye, CheckCircle2, XCircle, TrendingUp, Filter
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const MOCK_RISKY_USERS = [
  { id: 'USR-771', name: 'James Wilson', role: 'Freelancer', trustScore: 32, riskLevel: 'critical', flags: 12, lastActive: '2m ago', reason: 'Multiple failed withdrawal attempts' },
  { id: 'USR-782', name: 'Marketing Pro', role: 'Client', trustScore: 45, riskLevel: 'high', flags: 8, lastActive: '15m ago', reason: 'High-frequency contract cancellations' },
  { id: 'USR-801', name: 'Dev Solutions', role: 'Agency', trustScore: 58, riskLevel: 'medium', flags: 4, lastActive: '1h ago', reason: 'Suspicious IP switching' },
];

export default function RiskyUsersPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-orange-500/10 text-orange-600 rounded-xl shadow-sm">
              <Users size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Risky User Monitoring</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Identify and review accounts with low trust scores and suspicious behavior patterns.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
              <ShieldAlert size={20} />
            </div>
            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Critical Risk</span>
          </div>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white">12</h3>
          <p className="text-sm text-zinc-500 font-medium mt-1">Users require immediate action</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Avg. Trust Score</span>
          </div>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white">68.4</h3>
          <p className="text-sm text-zinc-500 font-medium mt-1">Platform-wide average</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-brand-50 text-brand-500 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">New Flags</span>
          </div>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white">+24</h3>
          <p className="text-sm text-zinc-500 font-medium mt-1">Reported in last 24 hours</p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by Name or User ID..." 
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
                <th className="p-4">User Details</th>
                <th className="p-4">Trust Score</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4">Primary Flag Reason</th>
                <th className="p-4">Activity</th>
                <th className="p-4 text-right">Review Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {MOCK_RISKY_USERS.map(user => (
                <tr key={user.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-900 dark:text-white">{user.name}</span>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tighter">{user.id} • {user.role}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            user.trustScore < 40 ? "bg-rose-500" : user.trustScore < 60 ? "bg-amber-500" : "bg-success"
                          )} 
                          style={{ width: `${user.trustScore}%` }} 
                        />
                      </div>
                      <span className="text-xs font-black text-zinc-700 dark:text-zinc-300">{user.trustScore}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                      user.riskLevel === 'critical' ? 'bg-rose-100 text-rose-700' :
                      user.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-brand-100 text-brand-700'
                    )}>
                      {user.riskLevel}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-xs font-medium text-zinc-500 max-w-[200px] truncate">{user.reason}</p>
                  </td>
                  <td className="p-4 text-xs font-bold text-zinc-400 italic">
                    {user.lastActive}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => toast.success(`Viewing profile for ${user.name}`)}
                         className="px-3 py-1.5 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-xs font-bold transition-colors"
                       >
                         Review
                       </button>
                       <button 
                         onClick={() => toast.success(`Restrictions applied to ${user.name}`)}
                         className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                         title="Restrict"
                       >
                         <XCircle size={18} />
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
