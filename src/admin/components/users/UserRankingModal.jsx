import React, { useState } from 'react';
import { 
  X, Star, TrendingUp, TrendingDown, 
  Zap 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserRankingModal({ isOpen, onClose, user }) {
  const [ranking, setRanking] = useState(4.5);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast.success(`${user.name}'s platform ranking adjusted to ${ranking} stars`, {
      icon: '⭐',
      style: { background: '#0f172a', color: '#fff', borderRadius: '12px' }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-surface-dark/40 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-surface-dark w-full max-w-md rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500 text-white rounded-2xl">
                <Star size={20} className="fill-current" />
              </div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Adjust Ranking</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
              <X size={20} className="text-zinc-400" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col items-center text-center">
              <div className="text-5xl font-black text-zinc-900 dark:text-white mb-2">{ranking.toFixed(1)}</div>
              <div className="flex gap-1 text-amber-500 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={24} className={i < Math.floor(ranking) ? "fill-current" : "text-zinc-200 dark:text-zinc-700"} />
                ))}
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                step="0.1" 
                value={ranking}
                onChange={(e) => setRanking(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-brand-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex flex-col items-center gap-2 group hover:bg-emerald-100 transition-all">
                <TrendingUp size={20} className="text-success" />
                <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-success">Boost Score</span>
              </button>
              <button className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl flex flex-col items-center gap-2 group hover:bg-red-100 transition-all">
                <TrendingDown size={20} className="text-red-600" />
                <span className="text-[10px] font-black uppercase text-red-700 dark:text-red-400">Apply Penalty</span>
              </button>
            </div>

            <div className="p-5 bg-[#4C1D95]/5 dark:bg-[#4C1D95]/20 rounded-[2rem] border border-[#4C1D95]/20 dark:border-[#4C1D95]/20/50 flex gap-4">
              <Zap size={24} className="text-[#4C1D95] shrink-0" />
              <p className="text-[10px] text-[#4C1D95] dark:text-[#4C1D95] font-bold leading-relaxed uppercase tracking-tight">
                Ranking changes affect search visibility and trust badges. Boosted users appear 2.5x more often in searches.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 bg-surface/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Cancel</button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-sm font-black shadow-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? 'Syncing...' : 'Update Ranking'}
          </button>
        </div>
      </div>
    </div>
  );
}


