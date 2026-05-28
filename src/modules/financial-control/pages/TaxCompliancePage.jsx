import React, { useState } from 'react';
import { 
  ShieldCheck, Calculator, Download, 
  FileCheck, AlertTriangle, Search, Filter, CheckCircle2,
  MoreHorizontal, RefreshCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../../admin/utils/cn';

const mockKRAData = [
  { id: "KRA-2024-891", entity: "Tech Solutions Ltd", pin: "P051234567M", vatStatus: "FILED", amount: "KES 145,000", date: "2024-05-15", status: "COMPLIANT" },
  { id: "KRA-2024-890", entity: "John Doe", pin: "A011223344V", vatStatus: "PENDING", amount: "KES 12,400", date: "2024-05-14", status: "WARNING" },
  { id: "KRA-2024-889", entity: "Alpha Design", pin: "P098765432K", vatStatus: "OVERDUE", amount: "KES 340,000", date: "2024-05-01", status: "NON_COMPLIANT" },
  { id: "KRA-2024-888", entity: "Sarah Smith", pin: "A099887766C", vatStatus: "FILED", amount: "KES 5,200", date: "2024-05-10", status: "COMPLIANT" },
];

export default function TaxCompliancePage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-purple/20 text-accent-purple rounded-xl shadow-sm border border-accent-purple/20">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">KRA Tax Compliance</h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Automated tax calculation, VAT tracking, and KRA integration for cross-border payments.
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => toast.success('Preparing annual tax report...')}
             className="px-5 py-2.5 bg-navy dark:bg-white text-white dark:text-navy rounded-xl text-sm font-bold shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center gap-2"
           >
             <Download size={18} /> Generate KRA Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-navy p-8 rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm relative overflow-hidden transition-all hover:scale-[1.02]">
           <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl w-fit mb-6 border border-emerald-500/20">
              <Calculator size={24} />
           </div>
           <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">VAT Collected (Q2)</span>
           <h3 className="text-4xl font-black text-zinc-900 dark:text-white mt-2 tracking-tight">KES 1.2M</h3>
           <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 w-fit px-3 py-1.5 rounded-lg">
             <FileCheck size={14} /> Ready for KRA iTax filing
           </div>
        </div>

        <div className="bg-white dark:bg-navy p-8 rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm relative overflow-hidden transition-all hover:scale-[1.02]">
           <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl w-fit mb-6 border border-amber-500/20">
              <AlertTriangle size={24} />
           </div>
           <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Withholding Tax (WHT)</span>
           <h3 className="text-4xl font-black text-zinc-900 dark:text-white mt-2 tracking-tight">KES 450K</h3>
           <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold mt-6 bg-zinc-50 dark:bg-white/5 w-fit px-3 py-1.5 rounded-lg">Pending 12 foreign jurisdiction filings.</p>
        </div>

        <div className="bg-navy p-8 rounded-[24px] relative overflow-hidden shadow-sm">
           <div className="absolute top-0 right-0 w-48 h-48 bg-accent-purple/20 blur-[80px] rounded-full tranzinc-y-1/2 tranzinc-x-1/2 pointer-events-none"></div>
           <div className="relative z-10">
             <h4 className="text-xl font-black text-white tracking-tight mb-6">Tax Policy Status</h4>
             <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-bold">
                   <span className="text-zinc-400 uppercase tracking-widest text-[10px]">KRA API Link</span>
                   <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={14} /> ACTIVE</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                   <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Digital Service Tax</span>
                   <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={14} /> ENFORCED</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                   <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Withholding Rate</span>
                   <span className="text-white">10% (Local)</span>
                </div>
             </div>
             <button 
               onClick={() => toast.success('Tax rules engine opened.')}
               className="mt-8 w-full py-3 bg-accent-purple/20 hover:bg-accent-purple/40 text-accent-purple rounded-xl text-xs font-bold uppercase tracking-widest transition-colors border border-accent-purple/20"
             >
                Manage Tax Rules
             </button>
           </div>
        </div>
      </div>

      {/* Modern KRA Integration Table */}
      <div className="bg-white dark:bg-navy rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden relative mt-8">
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-accent-purple/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">KRA Tax Ledgers</h2>
            <p className="text-sm text-zinc-500 font-medium">Real-time synchronization with KRA iTax platform.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-zinc-400 group-focus-within:text-accent-purple transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search by KRA PIN..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-zinc-50 dark:bg-white/5 border border-transparent focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50 rounded-xl text-sm outline-none transition-all dark:text-white"
              />
            </div>
            <button className="p-2.5 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/10 transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-white/5 border-b border-zinc-100 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-8 py-5">Filing ID</th>
                <th className="px-8 py-5">Entity / KRA PIN</th>
                <th className="px-8 py-5 text-center">VAT Status</th>
                <th className="px-8 py-5">Tax Liability</th>
                <th className="px-8 py-5">Compliance</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-white/5">
              {mockKRAData.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="px-8 py-6">
                    <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white group-hover:text-accent-purple transition-colors">{row.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-accent-purple transition-colors">{row.entity}</span>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold mt-0.5 font-mono uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldCheck size={10} className="text-accent-purple" /> {row.pin}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      row.vatStatus === 'OVERDUE' ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400' :
                      row.vatStatus === 'PENDING' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' :
                      'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    )}>
                      {row.vatStatus}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-zinc-900 dark:text-white">{row.amount}</span>
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mt-0.5 uppercase tracking-widest">{row.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      row.status === 'WARNING' ? 'bg-amber-500/10 text-amber-500' :
                      row.status === 'NON_COMPLIANT' ? 'bg-rose-500/10 text-rose-500' :
                      'bg-emerald-500/10 text-emerald-500'
                    )}>
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-zinc-400 hover:text-accent-purple hover:bg-accent-purple/10 rounded-xl transition-colors" title="Sync with KRA">
                         <RefreshCcw size={18} className="lucide lucide-refresh-ccw" />
                       </button>
                       <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-xl transition-colors" title="More Options">
                         <MoreHorizontal size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-zinc-50/50 dark:bg-white/5 flex items-center justify-center relative z-10 border-t border-zinc-100 dark:border-white/10">
          <button className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-accent-purple dark:hover:text-accent-purple transition-colors uppercase tracking-widest">
            Load Full KRA Integration History
          </button>
        </div>
      </div>
    </div>
  );
}


