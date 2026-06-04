import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, TrendingUp, Search, Filter, 
  MessageSquare, Star, Edit3, Tag, Building2,
  Clock, DollarSign
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
const CLIENTS = [
  {
    id: 'C-101',
    name: 'Sarah Mitchell',
    company: 'TechFlow Solutions',
    avatar: 'https://i.pravatar.cc/150?u=s101',
    totalRevenue: 12450,
    contracts: 4,
    lastActivity: '2 days ago',
    satisfaction: 5.0,
    tags: ['VIP', 'Retainer', 'Fast Payer'],
    notes: 'Prefers updates on Tuesdays. Avoid scheduling meetings before 10 AM PST.'
  },
  {
    id: 'C-102',
    name: 'David Kim',
    company: 'Nexus Tech',
    avatar: 'https://i.pravatar.cc/150?u=d102',
    totalRevenue: 3200,
    contracts: 1,
    lastActivity: '1 week ago',
    satisfaction: 4.8,
    tags: ['New', 'Agency'],
    notes: 'Startup founder. Very focused on UI details.'
  },
  {
    id: 'C-103',
    name: 'Emma Roberts',
    company: 'Creative Labs',
    avatar: 'https://i.pravatar.cc/150?u=e103',
    totalRevenue: 850,
    contracts: 2,
    lastActivity: '3 months ago',
    satisfaction: 4.5,
    tags: ['One-off'],
    notes: 'Usually needs small fixes to their Webflow site.'
  }
];

export default function FreelancerClientManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(CLIENTS[0]);

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#2bb75c]" /> Client CRM
          </h1>
          <p className="text-zinc-500 font-medium">Manage relationships, track revenue, and grow your repeat business.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Clients</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">124</h3>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Repeat Rate</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">42%</h3>
            <p className="text-xs font-bold text-success mt-1">+4% this month</p>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Avg Client Value (LTV)</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">$3,450</h3>
          </div>
          <div className="bg-gradient-to-br from-[#2bb75c] to-[#1d8d38] rounded-2xl p-6 shadow-md text-white">
            <h3 className="font-bold mb-1 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Top Client</h3>
            <p className="text-xl font-black mb-1">Sarah Mitchell</p>
            <p className="text-sm font-medium text-white/80">$12,450 lifetime</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main List */}
          <div className="flex-1 space-y-4">
            
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -tranzinc-y-1/2" />
                <input 
                  type="text" placeholder="Search clients by name, company, or tags..." 
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2.5 w-full bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium outline-none focus:border-[#2bb75c]/20 shadow-sm"
                />
              </div>
              <button className="px-4 py-2.5 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 shadow-sm flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-surface/50 dark:bg-surface-dark/50">
                      <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Client</th>
                      <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Revenue</th>
                      <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Rating</th>
                      <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CLIENTS.map((client) => (
                      <tr 
                        key={client.id} 
                        onClick={() => setSelectedClient(client)}
                        className={cn(
                          "border-b border-zinc-100 dark:border-zinc-800 transition-colors cursor-pointer",
                          selectedClient.id === client.id ? "bg-[#2bb75c]/5 dark:bg-[#2bb75c]/10" : "hover:bg-surface dark:hover:bg-zinc-800/50"
                        )}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <p className="text-sm font-bold text-zinc-900 dark:text-white">{client.name}</p>
                              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1"><Building2 className="w-3 h-3" /> {client.company}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-black text-zinc-900 dark:text-white">${client.totalRevenue.toLocaleString()}</p>
                          <p className="text-xs font-medium text-zinc-500">{client.contracts} contracts</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-bold text-zinc-900 dark:text-white">{client.satisfaction}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {client.tags.slice(0,2).map(tag => (
                              <span key={tag} className="text-[10px] font-bold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-md border border-zinc-200 dark:border-zinc-700">
                                {tag}
                              </span>
                            ))}
                            {client.tags.length > 2 && <span className="text-[10px] font-bold px-2 py-0.5 text-zinc-400">+{client.tags.length - 2}</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Panel: CRM Detail */}
          <AnimatePresence mode="wait">
            {selectedClient && (
              <motion.div 
                key={selectedClient.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-96 shrink-0"
              >
                <div className="sticky top-8 bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
                  
                  {/* Header */}
                  <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-surface/50 dark:bg-surface-dark/50">
                    <div className="flex justify-between items-start mb-4">
                      <img src={selectedClient.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                      <button className="p-2 text-zinc-400 hover:text-[#2bb75c] bg-white dark:bg-zinc-800 rounded-lg shadow-sm transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white">{selectedClient.name}</h2>
                    <p className="text-sm font-medium text-zinc-500 mb-4">{selectedClient.company}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.tags.map(tag => (
                        <span key={tag} className="text-xs font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-md border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {tag}
                        </span>
                      ))}
                      <button className="text-xs font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600 rounded-md border border-zinc-200 dark:border-zinc-700 border-dashed">
                        + Add Tag
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Body */}
                  <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-surface dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">LTV</p>
                        <p className="text-base font-black text-zinc-900 dark:text-white flex items-center gap-1"><DollarSign className="w-4 h-4 text-success" />{selectedClient.totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-surface dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Last Active</p>
                        <p className="text-base font-black text-zinc-900 dark:text-white flex items-center gap-1"><Clock className="w-4 h-4 text-[#2bb75c]" />{selectedClient.lastActivity}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2"><Edit3 className="w-4 h-4 text-[#2bb75c]" /> Private Notes</h3>
                        <button className="text-xs font-bold text-[#2bb75c] hover:underline">Edit</button>
                      </div>
                      <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 italic">"{selectedClient.notes}"</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Relationship Timeline</h3>
                      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-tranzinc-x-px md:before:mx-auto md:before:tranzinc-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 dark:before:via-zinc-800 before:to-transparent">
                        
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-white dark:border-zinc-900 bg-[#2bb75c] shadow shrink-0 md:order-1 md:group-odd:-tranzinc-x-1/2 md:group-even:tranzinc-x-1/2 z-10" />
                          <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-surface-dark shadow-sm ml-4 md:ml-0 md:group-odd:mr-4 md:group-even:ml-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-zinc-900 dark:text-white">Order Completed</span>
                            </div>
                            <div className="text-[10px] font-bold text-zinc-400 mb-1">2 days ago</div>
                            <div className="text-xs text-zinc-500 font-medium">$1,200 · 5 stars</div>
                          </div>
                        </div>

                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                          <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-300 dark:bg-zinc-700 shadow shrink-0 md:order-1 md:group-odd:-tranzinc-x-1/2 md:group-even:tranzinc-x-1/2 z-10" />
                          <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-surface-dark shadow-sm ml-4 md:ml-0 md:group-odd:mr-4 md:group-even:ml-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-zinc-900 dark:text-white">First Contact</span>
                            </div>
                            <div className="text-[10px] font-bold text-zinc-400">Mar 12, 2025</div>
                          </div>
                        </div>
                        
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

