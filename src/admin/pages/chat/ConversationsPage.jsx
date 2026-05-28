import React, { useState } from 'react';
import { 
  MessageSquare, Search, Filter, Eye, 
  Flag, ShieldAlert, Clock, User, ArrowRight, Trash2
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const MOCK_CONVERSATIONS = [
  { id: 'CHT-101', participants: ['John (Client)', 'Sarah (Dev)'], lastMessage: 'The payment has been sent...', time: '5m ago', riskLevel: 'low', status: 'active' },
  { id: 'CHT-102', participants: ['Mike (Client)', 'Unknown (??)'], lastMessage: 'Contact me on Telegram at @scam...', time: '12m ago', riskLevel: 'high', status: 'flagged' },
  { id: 'CHT-103', participants: ['TechCorp', 'Jane Doe'], lastMessage: 'I need the source code now.', time: '1h ago', riskLevel: 'medium', status: 'active' },
];

export default function ConversationsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-brand-500/10 text-brand-600 rounded-xl shadow-sm">
              <MessageSquare size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Conversation Oversight</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Monitor platform-wide communications to ensure compliance and prevent off-platform transactions.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 bg-surface dark:bg-zinc-800/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by User or Message Content..." 
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
                <th className="p-4">Conversation ID</th>
                <th className="p-4">Participants</th>
                <th className="p-4">Last Message Snippet</th>
                <th className="p-4 text-center">Risk</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {MOCK_CONVERSATIONS.map(chat => (
                <tr key={chat.id} className="hover:bg-surface/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{chat.id}</span>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-0.5">
                      <Clock size={10} /> {chat.time}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                      <User size={14} className="text-zinc-400" />
                      {chat.participants.join(' & ')}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-xs font-medium text-zinc-500 max-w-[300px] truncate italic">"{chat.lastMessage}"</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                      chat.riskLevel === 'high' ? 'bg-rose-100 text-rose-700' :
                      chat.riskLevel === 'medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-emerald-100 text-emerald-700'
                    )}>
                      {chat.riskLevel}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-black uppercase tracking-widest text-zinc-500">
                    {chat.status}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => toast.success(`Opening conversation log for ${chat.id}`)}
                         className="px-3 py-1.5 bg-surface-dark text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2"
                       >
                         <Eye size={14} /> Open Logs
                       </button>
                       <button 
                         onClick={() => toast.success(`Conversation ${chat.id} has been flagged.`)}
                         className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                       >
                         <Flag size={16} />
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
