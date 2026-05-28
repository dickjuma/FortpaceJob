import React, { useState } from 'react';
import { 
  X, AlertTriangle, ShieldAlert, 
  Ban, ShieldX, Info, MessageSquare 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

export default function UserFlagModal({ isOpen, onClose, user }) {
  const [severity, setSeverity] = useState('warning');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !user) return null;

  const handleAction = async () => {
    if (!reason) {
      toast.error('Reason is required for moderation actions.');
      return;
    }
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    toast.success(`Action applied: ${severity.toUpperCase()} for ${user.name}`, {
      style: { background: '#ef4444', color: '#fff', borderRadius: '12px', fontWeight: 'bold' }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-surface-dark/70 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-surface-dark w-full max-w-md rounded-[3rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-5 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-[2rem] mb-6 animate-pulse">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Moderate User</h2>
            <p className="text-sm text-zinc-500 font-medium">{user.name} • {user.id || 'UID-10293'}</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setSeverity('warning')}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                  severity === 'warning' ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" : "border-zinc-100 dark:border-zinc-800"
                )}
              >
                <Info size={20} className="text-amber-500" />
                <span className="text-[10px] font-black uppercase text-zinc-500">Warning</span>
              </button>
              <button 
                onClick={() => setSeverity('suspension')}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                  severity === 'suspension' ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-zinc-100 dark:border-zinc-800"
                )}
              >
                <Ban size={20} className="text-red-500" />
                <span className="text-[10px] font-black uppercase text-zinc-500">Suspend</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <MessageSquare size={12} />
                Moderation Reason
              </label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-5 py-4 bg-surface dark:bg-zinc-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"
                placeholder="Why is this action being taken?..."
              />
            </div>
          </div>
        </div>

        <div className="p-8 bg-surface/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-3">
          <button 
            onClick={handleAction}
            disabled={isProcessing}
            className={cn(
              "w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm font-black shadow-xl shadow-red-500/20 transition-all active:scale-95 disabled:opacity-50",
              isProcessing && "animate-pulse"
            )}
          >
            {isProcessing ? 'Enforcing Action...' : `Confirm ${severity.toUpperCase()}`}
          </button>
          <button onClick={onClose} className="w-full py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors">Cancel Request</button>
        </div>
      </div>
    </div>
  );
}
