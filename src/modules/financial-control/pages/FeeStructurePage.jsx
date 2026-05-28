import React from 'react';
import { 
  Settings, Percent, DollarSign, AlertCircle, Save
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeeStructurePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-violet-500/10 text-violet-600 rounded-xl shadow-sm">
              <Settings size={24} />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Fee Configuration</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Manage global platform commissions, withdrawal fees, and escrow pricing models.
          </p>
        </div>
        <button 
          onClick={() => toast.success('Global fee structure updated successfully!')}
          className="px-4 py-2 bg-surface-dark text-white dark:bg-brand-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex gap-3 text-amber-700 dark:text-amber-400">
        <AlertCircle size={20} className="shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm">Audit Warning</h4>
          <p className="text-xs font-medium mt-1">
            Modifying global fee structures will immediately affect all new transactions. Existing active escrows and pending withdrawals will be grandfathered into the previous rate. All changes are logged in the immutable audit trail.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Platform Fees */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <Percent size={18} className="text-brand-500"/> Platform Commission
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Base Commission (%)</label>
              <div className="flex relative">
                <input type="number" defaultValue={15.0} className="w-full pl-4 pr-12 py-2.5 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" />
                <span className="absolute right-4 top-1/2 -tranzinc-y-1/2 text-zinc-400 font-bold">%</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1.5 font-medium">Applied to all successfully released milestone payments.</p>
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">High-Volume Tier (&gt; $10k)</label>
              <div className="flex relative">
                <input type="number" defaultValue={10.0} className="w-full pl-4 pr-12 py-2.5 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500" />
                <span className="absolute right-4 top-1/2 -tranzinc-y-1/2 text-zinc-400 font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Fees */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <DollarSign size={18} className="text-success"/> Withdrawal & Gateways
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">M-PESA B2C Fixed Fee (KES)</label>
              <div className="flex relative">
                <span className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-zinc-400 font-bold">KES</span>
                <input type="number" defaultValue={50.0} className="w-full pl-14 pr-4 py-2.5 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Bank Transfer Fee (KES)</label>
              <div className="flex relative">
                <span className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-zinc-400 font-bold">KES</span>
                <input type="number" defaultValue={150.0} className="w-full pl-14 pr-4 py-2.5 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
