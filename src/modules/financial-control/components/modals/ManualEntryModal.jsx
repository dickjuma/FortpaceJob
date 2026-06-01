import React from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManualEntryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dark/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-surface-dark rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">Manual Ledger Entry</h2>
            <p className="text-sm font-medium text-zinc-500 mt-1">
              Record manual adjustments. Subject to audit logging.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 space-y-5">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex gap-3 text-amber-700 dark:text-amber-400">
             <AlertCircle size={20} className="shrink-0 mt-0.5" />
             <div>
               <h4 className="font-bold text-sm">Strict Compliance Warning</h4>
               <p className="text-xs font-medium mt-1">
                 Manual entries instantly update balances and cannot be deleted. If you make a mistake, you must post a reversing entry.
               </p>
             </div>
          </div>

          <div>
             <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Debit Account</label>
             <select className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-semibold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#14a800]">
                <option>Platform Revenue Account</option>
                <option>Escrow Holding Account</option>
                <option>Tax Payable Account</option>
             </select>
          </div>

          <div>
             <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Credit Account</label>
             <select className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-semibold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#14a800]">
                <option>Tax Payable Account</option>
                <option>Escrow Holding Account</option>
                <option>Platform Revenue Account</option>
             </select>
          </div>

          <div>
             <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Amount (KES)</label>
             <input type="number" placeholder="0.00" className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#14a800]" />
          </div>

          <div>
             <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Memo / Reason</label>
             <textarea rows="3" placeholder="Explain reason for manual adjustment..." className="w-full px-4 py-3 bg-surface dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#14a800] resize-none"></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-surface dark:bg-zinc-800/50 flex justify-end gap-3">
           <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
             Cancel
           </button>
           <button 
             onClick={() => {
               toast.success('Manual entry posted successfully');
               onClose();
             }}
             className="px-5 py-2.5 bg-surface-dark dark:bg-[#14a800] text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2"
           >
             <Save size={16} /> Post Entry
           </button>
        </div>

      </div>
    </div>
  );
}
