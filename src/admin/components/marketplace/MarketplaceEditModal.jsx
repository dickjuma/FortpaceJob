import React, { useState, useEffect } from 'react';
import { 
  X, Save, AlertCircle, Info, 
  Briefcase, ShoppingBag, FileText 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

export default function MarketplaceEditModal({ isOpen, onClose, data, type = 'job' }) {
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        amount: data.amount || data.price?.base || 0,
        status: data.status || '',
        description: data.description || '',
      });
    }
  }, [data]);

  if (!isOpen || !formData) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`, {
      style: {
        borderRadius: '12px',
        background: '#0f172a',
        color: '#fff',
        fontWeight: 'bold',
      },
    });
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'job': return <Briefcase size={18} />;
      case 'gig': return <ShoppingBag size={18} />;
      case 'contract': return <FileText size={18} />;
      default: return <Info size={18} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-surface-dark/40 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSave}>
          {/* Header */}
          <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#14a800] text-white rounded-2xl shadow-lg shadow-[#14a800]/25/20">
                {getIcon()}
              </div>
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                  Edit {type.charAt(0).toUpperCase() + type.slice(1)}
                </h2>
                <p className="text-xs text-zinc-500 font-bold font-mono">{data.id}</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Entry Title</label>
              <input 
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-5 py-3.5 bg-surface dark:bg-zinc-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#14a800] outline-none transition-all"
                placeholder="e.g. Mobile App Development"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Value (KES)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -tranzinc-y-1/2 text-zinc-400 font-bold text-xs">KES</span>
                  <input 
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-surface dark:bg-zinc-800 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-[#14a800] outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Global Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-5 py-3.5 bg-surface dark:bg-zinc-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#14a800] outline-none cursor-pointer appearance-none transition-all"
                >
                  <option value="active">Active</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="disputed">Disputed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Administrative Notes</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-5 py-3.5 bg-surface dark:bg-zinc-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#14a800] outline-none transition-all resize-none"
                placeholder="Internal notes regarding this marketplace entry..."
              />
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-start gap-3 border border-amber-100 dark:border-amber-800/50">
              <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-relaxed uppercase tracking-tight">
                Warning: Changing the status or value will trigger a system-wide audit log and notify the involved parties via email and push notification.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 bg-surface/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className={cn(
                "px-8 py-3 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-sm font-black shadow-xl transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50",
                isSaving && "animate-pulse"
              )}
            >
              <Save size={18} />
              {isSaving ? 'Synchronizing...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
