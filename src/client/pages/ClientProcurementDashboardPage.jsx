import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, DollarSign, TrendingUp, PieChart, 
  BarChart3, Download, Filter, Search, Users, 
  Target, AlertTriangle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const VENDORS = [
  { id: 'V-001', name: 'Sarah Mitchell', category: 'Software Development', spend: 45200, status: 'Active', trend: 'up' },
  { id: 'V-002', name: 'Global Design LLC', category: 'Design', spend: 28450, status: 'Active', trend: 'down' },
  { id: 'V-003', name: 'Alex Rivera', category: 'Content Creation', spend: 12100, status: 'Pending Approval', trend: 'up' },
  { id: 'V-004', name: 'David Kim', category: 'Engineering', spend: 8500, status: 'Active', trend: 'neutral' }
];

export default function ClientProcurementDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#14a800]" /> Procurement Dashboard
            </h1>
            <p className="text-zinc-500 font-medium">Enterprise visibility into freelancer spending and budget allocation.</p>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 border border-zinc-200 dark:border-zinc-700">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="px-4 py-2 bg-[#14a800] hover:bg-[#118a00] text-white font-bold rounded-lg shadow-sm transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#14a800]/5 dark:bg-[#14a800]/10 text-[#14a800] rounded-lg"><DollarSign className="w-5 h-5" /></div>
              <span className="text-xs font-bold text-success bg-emerald-50 dark:bg-success/10 px-2 py-1 rounded-md flex items-center gap-1"><ArrowDownRight className="w-3 h-3" /> 4.2%</span>
            </div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">YTD Spend</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">$248,500</h3>
            <p className="text-xs text-zinc-500 mt-2">vs $259,400 last year</p>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#14a800]/5 dark:bg-[#14a800]/10 text-[#14a800] rounded-lg"><Users className="w-5 h-5" /></div>
              <span className="text-xs font-bold text-success bg-emerald-50 dark:bg-success/10 px-2 py-1 rounded-md flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> 12%</span>
            </div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Active Vendors</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">42</h3>
            <p className="text-xs text-zinc-500 mt-2">Freelancers & Agencies</p>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-lg"><Target className="w-5 h-5" /></div>
              <span className="text-xs font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">On Track</span>
            </div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Budget Utilization</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">68%</h3>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-[#14a800] h-full w-[68%] rounded-full"></div>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
            </div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Cost Savings Opport.</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">$14,200</h3>
            <p className="text-xs text-[#14a800] dark:text-[#14a800] font-bold mt-2 cursor-pointer hover:underline">View Recommendations &rarr;</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Trend Chart (Mock) */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#14a800]" /> Spend Forecast vs Actual
                </h2>
                <select className="bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-bold outline-none">
                  <option>2026 (YTD)</option>
                  <option>2025</option>
                </select>
              </div>
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
                <BarChart3 className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-2" />
                <p className="text-sm font-medium text-zinc-500">Financial forecast chart renders here.</p>
              </div>
            </div>

            {/* Vendor Table */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-surface/50 dark:bg-surface-dark/50">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Top Vendors</h2>
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -tranzinc-y-1/2" />
                  <input type="text" placeholder="Search vendors..." className="pl-9 pr-4 py-2 bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-[#14a800]/20 w-64 shadow-sm" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Vendor</th>
                      <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Category</th>
                      <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Spend (YTD)</th>
                      <th className="py-4 px-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VENDORS.map(v => (
                      <tr key={v.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                        <td className="py-4 px-6">
                          <p className="text-sm font-bold text-zinc-900 dark:text-white">{v.name}</p>
                          <p className="text-xs font-mono text-zinc-500">{v.id}</p>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">{v.category}</td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
                            ${v.spend.toLocaleString()}
                            {v.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-success" />}
                            {v.trend === 'down' && <ArrowDownRight className="w-3 h-3 text-rose-500" />}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={cn(
                            "px-2 py-1 text-xs font-bold rounded-md",
                            v.status === 'Active' ? "bg-emerald-100 text-emerald-700 dark:bg-success/20 dark:text-success" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                          )}>
                            {v.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Allocation & Budgets */}
          <div className="space-y-8">
            
            {/* Department Allocation */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#14a800]" /> Dept. Allocation
              </h2>
              
              <div className="flex justify-center mb-8">
                <div className="w-40 h-40 rounded-full border-[16px] border-zinc-100 dark:border-zinc-800 border-t-#14a800] border-r-#14a800] border-b-amber-500 relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Total</span>
                    <span className="text-lg font-black text-zinc-900 dark:text-white">$248k</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Engineering', amount: 120000, color: 'bg-[#14a800]' },
                  { name: 'Marketing', amount: 85000, color: 'bg-[#14a800]' },
                  { name: 'Design', amount: 43500, color: 'bg-amber-500' }
                ].map(dept => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", dept.color)} />
                      <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{dept.name}</span>
                    </div>
                    <span className="text-sm font-black text-zinc-900 dark:text-white">${dept.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Approvals Needed */}
            <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-3xl p-8">
              <h2 className="text-xl font-bold text-amber-900 dark:text-amber-500 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Pending Approvals
              </h2>
              
              <div className="space-y-3">
                <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-amber-200/50 dark:border-amber-700/30 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Budget Increase</span>
                    <span className="text-sm font-black text-zinc-900 dark:text-white">+$5,000</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Requested by Marketing for "Q3 Campaign Design"</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md">Approve</button>
                    <button className="flex-1 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-md">Review</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
