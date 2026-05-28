import React, { useState } from 'react';
import { 
  ShieldX, Search, Plus, Trash2, 
  Globe, UserX, AlertOctagon, Calendar, Filter
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const MOCK_BLACKLIST = [
  { id: 'BL-001', target: '192.168.44.12', type: 'ip', reason: 'Brute force origin', dateAdded: '2024-05-01', addedBy: 'Admin (System)' },
  { id: 'BL-002', target: 'scammer@fraud.com', type: 'email', reason: 'Confirmed payment fraud', dateAdded: '2024-04-28', addedBy: 'SuperAdmin' },
  { id: 'BL-003', target: 'badactor_profile', type: 'username', reason: 'Chat harassment & phishing', dateAdded: '2024-04-25', addedBy: 'Moderator_L2' },
];

export default function BlacklistPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-surface-dark text-white rounded-xl shadow-sm">
              <ShieldX size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Platform Blacklist</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Manage banned IPs, email domains, and users to maintain ecosystem integrity.
          </p>
        </div>
        <button 
          onClick={() => toast.success('Add to Blacklist modal opened')}
          className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-rose-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Entry
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Blacklist Target..." 
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
                <th className="p-4">Target Type</th>
                <th className="p-4">Identification Value</th>
                <th className="p-4">Reason for Ban</th>
                <th className="p-4">Date Added</th>
                <th className="p-4">Enforced By</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {MOCK_BLACKLIST.map(entry => (
                <tr key={entry.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                      entry.type === 'ip' ? 'bg-brand-100 text-brand-700' :
                      entry.type === 'email' ? 'bg-brand-100 text-brand-700' :
                      'bg-orange-100 text-orange-700'
                    )}>
                      {entry.type === 'ip' && <Globe size={10} />}
                      {entry.type === 'email' && <UserX size={10} />}
                      {entry.type === 'username' && <AlertOctagon size={10} />}
                      {entry.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-sm font-bold text-zinc-900 dark:text-white">
                    {entry.target}
                  </td>
                  <td className="p-4 text-xs font-medium text-zinc-500 max-w-[250px] whitespace-normal">
                    {entry.reason}
                  </td>
                  <td className="p-4 text-xs font-bold text-zinc-400">
                    {entry.dateAdded}
                  </td>
                  <td className="p-4 text-xs font-black text-zinc-600 dark:text-zinc-300">
                    {entry.addedBy}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => toast.success(`Removed ${entry.target} from blacklist.`)}
                      className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove from Blacklist"
                    >
                      <Trash2 size={16} />
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
