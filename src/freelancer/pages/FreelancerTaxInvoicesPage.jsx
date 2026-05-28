import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Filter, Search, TrendingUp, 
  DollarSign, Calculator, Settings, Receipt, FileDown,
  PieChart, ChevronRight
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
const INVOICES = [
  { id: 'INV-2024-001', client: 'TechFlow Solutions', date: 'May 15, 2026', amount: 3200, tax: 640, status: 'Paid' },
  { id: 'INV-2024-002', client: 'Sarah Mitchell', date: 'May 12, 2026', amount: 850, tax: 170, status: 'Paid' },
  { id: 'INV-2024-003', client: 'Global Design LLC', date: 'May 08, 2026', amount: 4500, tax: 900, status: 'Pending' },
  { id: 'INV-2024-004', client: 'Nexus Tech', date: 'May 01, 2026', amount: 1200, tax: 240, status: 'Paid' },
  { id: 'INV-2024-005', client: 'Creative Labs', date: 'Apr 25, 2026', amount: 2100, tax: 420, status: 'Overdue' },
];

export default function FreelancerTaxInvoicesPage() {
  const [activeTab, setActiveTab] = useState('invoices'); // invoices, taxes, settings
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-purple/20 text-accent-purple rounded-xl shadow-sm border border-accent-purple/20">
              <Receipt size={24} />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Taxes & Invoices</h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">Manage your earnings, taxes, and download official invoices.</p>
        </div>
        
        <div className="flex bg-zinc-100 dark:bg-white/5 p-1.5 rounded-2xl border border-zinc-200 dark:border-white/10">
          {[
            { id: 'invoices', label: 'Invoices', icon: Receipt },
            { id: 'taxes', label: 'Tax Summary', icon: PieChart },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 uppercase tracking-widest", 
                activeTab === tab.id ? "bg-white dark:bg-navy text-accent-purple shadow-sm border border-zinc-200 dark:border-white/10" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              <tab.icon size={16} className={cn(activeTab === tab.id ? "text-accent-purple" : "")} /> 
              {tab.label}
            </button>
          ))}
        </div>
      </div>
        
      {/* Quick Stats (Always visible) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-navy rounded-[24px] border border-zinc-200 dark:border-white/10 p-6 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-xl"><DollarSign size={20} /></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">$42,850</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">YTD Earnings</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-navy rounded-[24px] border border-zinc-200 dark:border-white/10 p-6 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-rose-500/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-rose-500/10 transition-colors"></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2.5 bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-xl"><Calculator size={20} /></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">$8,570</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1 flex items-center justify-between">
              Est. Tax (20%)
              <ChevronRight size={12} className="text-rose-500 cursor-pointer" />
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-navy rounded-[24px] border border-zinc-200 dark:border-white/10 p-6 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-amber-500/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-amber-500/10 transition-colors"></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2.5 bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-xl"><Receipt size={20} /></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">$4,500</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Unpaid Invoices</p>
          </div>
        </div>

        <div className="bg-accent-purple rounded-[24px] p-6 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform flex flex-col justify-center">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none tranzinc-x-1/4 tranzinc-y-1/4 group-hover:scale-110 transition-transform duration-700">
            <FileDown size={120} />
          </div>
          <h3 className="font-black text-xl text-white mb-2 tracking-tight relative z-10">Export Data</h3>
          <p className="text-xs font-medium text-white/80 mb-6 relative z-10 leading-relaxed">Download your Q2 2026 financial report for tax filing.</p>
          <button className="w-full py-3 bg-white text-accent-purple font-black rounded-xl text-xs uppercase tracking-widest shadow-sm hover:bg-zinc-50 transition-colors relative z-10">
            Download CSV
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'invoices' && (
          <motion.div key="invoices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            <div className="bg-white dark:bg-navy rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden relative">
              <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-accent-purple/5 blur-[100px] rounded-full pointer-events-none"></div>

              {/* Toolbar */}
              <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-50/50 dark:bg-white/5 relative z-10">
                <div className="relative w-full md:w-auto group">
                  <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -tranzinc-y-1/2 group-focus-within:text-accent-purple transition-colors" />
                  <input 
                    type="text" placeholder="Search invoices..." 
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-white dark:bg-navy border border-zinc-200 dark:border-white/10 rounded-xl text-sm font-bold outline-none focus:border-accent-purple w-full md:w-80 shadow-sm text-zinc-900 dark:text-white transition-all" 
                  />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button className="px-5 py-3 bg-white dark:bg-navy border border-zinc-200 dark:border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-700 dark:text-white shadow-sm flex items-center gap-2 flex-1 md:flex-none justify-center hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                    <Filter size={16} /> Filter
                  </button>
                  <button className="px-5 py-3 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent-purple/20 flex items-center gap-2 flex-1 md:flex-none justify-center transition-all">
                    <FileText size={16} /> New Invoice
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-zinc-50/50 dark:bg-white/5 border-b border-zinc-100 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                      <th className="px-8 py-5">Invoice ID</th>
                      <th className="px-8 py-5">Client</th>
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5">Amount</th>
                      <th className="px-8 py-5 text-center">Status</th>
                      <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-white/5">
                    {INVOICES.filter(i => i.client.toLowerCase().includes(searchTerm.toLowerCase()) || i.id.toLowerCase().includes(searchTerm.toLowerCase())).map((invoice, idx) => (
                      <tr key={invoice.id} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                        <td className="px-8 py-6 font-mono text-sm font-black text-accent-purple">{invoice.id}</td>
                        <td className="px-8 py-6 font-bold text-zinc-900 dark:text-white text-sm group-hover:text-accent-purple transition-colors">{invoice.client}</td>
                        <td className="px-8 py-6 font-bold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-widest">{invoice.date}</td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-black text-zinc-900 dark:text-white text-sm">${invoice.amount}</span>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">+${invoice.tax} tax</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className={cn(
                            "px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg inline-block",
                            invoice.status === 'Paid' ? "bg-emerald-500/10 text-emerald-500" :
                            invoice.status === 'Pending' ? "bg-amber-500/10 text-amber-500" :
                            "bg-rose-500/10 text-rose-500"
                          )}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2.5 text-zinc-400 hover:text-white hover:bg-accent-purple rounded-xl transition-all inline-flex items-center gap-2 shadow-sm">
                            <Download size={18} /> <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 hidden sm:inline-block transition-opacity">PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'taxes' && (
          <motion.div key="taxes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="bg-white dark:bg-navy rounded-[32px] border border-zinc-200 dark:border-white/10 p-12 shadow-xl flex flex-col items-center justify-center min-h-[500px] text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-purple/20 via-transparent to-transparent pointer-events-none"></div>
              <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-2xl relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <PieChart size={48} className="text-accent-purple" />
              </div>
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight relative z-10">Detailed Tax Analytics</h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md font-medium leading-relaxed relative z-10">
                Connect your accounting software or use our advanced tracking features to see breakdown by tax category, deductions, and jurisdictions.
              </p>
              <button className="mt-8 px-8 py-4 bg-white text-navy font-black rounded-xl shadow-lg hover:bg-zinc-50 transition-all text-xs uppercase tracking-widest relative z-10">
                Connect Quickbooks
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
