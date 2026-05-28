import React from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCcw, 
  Search,
  Filter,
  Download,
  MoreHorizontal,
  CircleDollarSign,
  Landmark,
  ShieldAlert
} from "lucide-react";

const transactions = [
  { id: "TX-9021", user: "John Doe", type: "ESCROW_RELEASE", amount: "+$1,200.00", status: "COMPLETED", date: "2024-05-03 14:20" },
  { id: "TX-9020", user: "Sarah Smith", type: "ESCROW_DEPOSIT", amount: "+$2,500.00", status: "PENDING", date: "2024-05-03 12:45" },
  { id: "TX-9019", user: "Mike Johnson", type: "WITHDRAWAL", amount: "-$450.00", status: "COMPLETED", date: "2024-05-03 09:12" },
  { id: "TX-9018", user: "Alpha Systems", type: "REFUND", amount: "-$800.00", status: "REVERSED", date: "2024-05-02 18:30" },
  { id: "TX-9017", user: "TechCorp", type: "FEE_COLLECTION", amount: "+$120.00", status: "COMPLETED", date: "2024-05-02 16:15" },
];

const FinancialControl = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Financial Control</h1>
          <p className="text-zinc-500 mt-1 font-medium">Monitor platform liquidity, escrow ledger, and transaction integrity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
            <Download size={18} />
            Reconciliation Report
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-navy rounded-[24px] p-8 text-white relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Landmark size={24} className="text-emerald-400" />
              </div>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-emerald-500/20">Live Ledger</span>
            </div>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-6">Total Platform Escrow</p>
            <h3 className="text-4xl font-black mt-2 tracking-tight">$1,248,592.40</h3>
            <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 w-fit px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <ArrowUpRight size={14} />
              +$42.5k today
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/20 blur-[80px] rounded-full tranzinc-y-1/2 tranzinc-x-1/2 pointer-events-none"></div>
        </div>

        <div className="bg-white dark:bg-navy rounded-[24px] p-8 border border-zinc-200 dark:border-white/10 shadow-sm transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent-purple/10 rounded-xl text-accent-purple">
              <CircleDollarSign size={24} />
            </div>
            <button className="text-zinc-400 hover:text-accent-purple transition-colors"><RefreshCcw size={18} /></button>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mt-6">Pending Withdrawals</p>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-2 tracking-tight">$12,840.00</h3>
          <p className="mt-4 text-xs font-bold text-accent-purple bg-accent-purple/10 w-fit px-2.5 py-1 rounded-lg">8 requests awaiting approval</p>
        </div>

        <div className="bg-white dark:bg-navy rounded-[24px] p-8 border border-zinc-200 dark:border-white/10 shadow-sm transition-all hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
              <ShieldAlert size={24} />
            </div>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mt-6">Held Funds (Flags)</p>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-2 tracking-tight">$4,200.00</h3>
          <p className="mt-4 text-xs font-bold text-rose-500 bg-rose-500/10 w-fit px-2.5 py-1 rounded-lg uppercase tracking-tighter">Immediate audit required</p>
        </div>
      </div>

      {/* Modern Transaction Ledger Table */}
      <div className="bg-white dark:bg-navy rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden relative">
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-accent-purple/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Transaction Ledger</h2>
            <p className="text-sm text-zinc-500 font-medium">Full immutable history of platform value movement.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-zinc-400 group-focus-within:text-accent-purple transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Find TX ID..." 
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-white/5 border border-transparent focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50 rounded-xl text-sm outline-none transition-all dark:text-white"
              />
            </div>
            <button className="p-2.5 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/10 transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-white/5 border-b border-zinc-100 dark:border-white/10 text-zinc-500 dark:text-zinc-400 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-8 py-5">Transaction ID</th>
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Type</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-white/5">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="px-8 py-6">
                    <span className="font-mono text-xs font-bold text-zinc-400 group-hover:text-accent-purple transition-colors">{tx.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-accent-purple transition-colors">{tx.user}</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">{tx.date}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-white/10 px-2.5 py-1 rounded-lg">
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-sm">
                    <span className={tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-zinc-900 dark:text-white'}>{tx.amount}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                      tx.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 
                      tx.status === 'PENDING' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 
                      'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        tx.status === 'COMPLETED' ? 'bg-emerald-500' : 
                        tx.status === 'PENDING' ? 'bg-amber-500' : 
                        'bg-rose-500'
                      }`}></span>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-zinc-400 hover:text-accent-purple hover:bg-accent-purple/10 rounded-xl transition-all">
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
            Load Full Financial History
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialControl;
