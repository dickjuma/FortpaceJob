import React, { useState } from 'react';
import { 
  AlertTriangle, ShieldAlert, 
  Trash2, Flag, MessageSquare 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

export default function MarketplaceActionModal({ isOpen, onClose, data, type = 'delist', onAction }) {
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !data) return null;

  const config = {
    delist: {
      title: 'Delist Gig',
      subtitle: 'Remove this service from the public marketplace.',
      icon: <Trash2 className="text-red-500" />,
      actionLabel: 'Confirm Delisting',
      color: 'bg-red-600',
      warning: 'This gig will no longer be searchable or purchasable. Active orders will still need to be completed.'
    },
    flag: {
      title: 'Flag Job',
      subtitle: 'Mark this job for administrative review.',
      icon: <Flag className="text-amber-500" />,
      actionLabel: 'Flag Entry',
      color: 'bg-amber-600',
      warning: 'The client will be notified and a moderator will review the job for policy violations.'
    },
    dispute: {
      title: 'Initiate Dispute',
      subtitle: 'Stop payments and start a formal mediation.',
      icon: <ShieldAlert className="text-rose-500" />,
      actionLabel: 'Start Dispute',
      color: 'bg-rose-600',
      warning: 'Funds will be locked in escrow. Both parties will be required to provide evidence within 48 hours.'
    }
  };

  const active = config[type] || config.delist;

  const handleAction = async () => {
    if (!reason) {
      toast.error('Please provide a reason for this action.');
      return;
    }

    setIsProcessing(true);
    try {
      if (onAction) {
        await onAction(reason);
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      toast.success(`${active.title} executed successfully`);
      onClose();
      setReason('');
    } catch (error) {
      toast.error(error.message || `${active.title} failed`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-surface-dark/70 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-surface-dark w-full max-w-md rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 pb-4 flex flex-col items-center text-center">
          <div className="p-5 bg-surface dark:bg-zinc-800 rounded-3xl mb-6 shadow-inner">
            {active.icon}
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">
            {active.title}
          </h2>
          <p className="text-sm text-zinc-500 font-medium px-4">
            {active.subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="p-8 pt-4 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <MessageSquare size={12} />
              Reason for Action
            </label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-5 py-4 bg-surface dark:bg-zinc-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#4C1D95] outline-none transition-all resize-none"
              placeholder="Provide a detailed explanation for this administrative action..."
            />
          </div>

          <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-start gap-4 border border-red-100 dark:border-red-800/50">
            <AlertTriangle size={20} className="text-red-600 shrink-0 mt-1" />
            <p className="text-xs text-red-700 dark:text-red-400 font-bold leading-relaxed">
              {active.warning}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-surface/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-4 rounded-2xl text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleAction}
            disabled={isProcessing}
            className={cn(
              "px-6 py-4 text-white rounded-2xl text-sm font-black shadow-xl transition-all active:scale-95 disabled:opacity-50",
              active.color,
              isProcessing && "animate-pulse"
            )}
          >
            {isProcessing ? 'Processing...' : active.actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


