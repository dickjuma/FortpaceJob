import React, { useState } from 'react';
import { 
  X, AlertTriangle, ShieldAlert, 
  CheckCircle2, AlertOctagon, Info,
  MessageSquare, Lock, Unlock,
  RotateCcw, Ban, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

export default function AdminActionModal({ 
  isOpen, 
  onClose, 
  data, 
  actionType, 
  onSuccess,
  module = 'general'
}) {
  const [reason, setReason] = useState('');
  const [frictionValue, setFrictionValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !data) return null;

  const actionConfigs = {
    // Financial Actions
    'force-release': {
      title: 'Force Release Escrow',
      subtitle: `Authorize immediate fund release for ${data.id}`,
      icon: <Unlock className="text-success" />,
      actionLabel: 'RELEASE',
      color: 'bg-success',
      warning: 'This action is irreversible. Funds will be moved from escrow to the freelancer\'s wallet immediately.',
      successMsg: 'Funds released successfully.',
      requiresFriction: true,
      impact: ['Escrow funds will be depleted', 'Freelancer wallet will be credited', 'Commission will be processed']
    },
    'resolve-dispute': {
      title: 'Resolve Dispute',
      subtitle: `Adjudicate dispute for ${data.id}`,
      icon: <ShieldAlert className="text-rose-500" />,
      actionLabel: 'RESOLVE',
      color: 'bg-rose-600',
      warning: 'This will execute the proposed settlement. Both parties will be notified of the final administrative decision.',
      successMsg: 'Dispute resolved and funds distributed.',
      requiresFriction: true,
      impact: ['Dispute case will be closed', 'Funds will be split per resolution', 'Audit trail entry created']
    },
    'approve-refund': {
      title: 'Approve Refund Request',
      subtitle: `Authorize refund of ${data.amount} KES for ${data.id}`,
      icon: <RotateCcw className="text-amber-500" />,
      actionLabel: 'Confirm Refund',
      color: 'bg-amber-600',
      warning: 'This will reverse the payment and return funds to the client\'s source of payment.',
      successMsg: 'Refund authorized successfully.',
      impact: ['Client will receive credit', 'Freelancer earnings may be clawed back']
    },
    'block-withdrawal': {
      title: 'Block Withdrawal',
      subtitle: `Suspend payout for ${data.id}`,
      icon: <AlertOctagon className="text-red-500" />,
      actionLabel: 'BLOCK',
      color: 'bg-red-600',
      warning: 'The user will be notified that their withdrawal is under administrative review for potential policy violations.',
      successMsg: 'Withdrawal blocked for review.',
      requiresFriction: true,
      impact: ['Payout status changed to BLOCKED', 'Security team will be notified']
    },
    // User Actions
    'suspend-user': {
      title: 'Suspend User Account',
      subtitle: `Revoke platform access for ${data.name || data.id}`,
      icon: <Ban className="text-red-500" />,
      actionLabel: 'SUSPEND',
      color: 'bg-red-600',
      warning: 'The user will be immediately logged out and unable to access their account or funds until the suspension is lifted.',
      successMsg: 'User account suspended.',
      requiresFriction: true,
      impact: ['Active sessions terminated', 'API keys revoked', 'Marketplace listings hidden']
    },
    'flag-user': {
      title: 'Flag User Profile',
      subtitle: `Mark ${data.name || data.id} for priority monitoring`,
      icon: <AlertTriangle className="text-amber-500" />,
      actionLabel: 'Flag User',
      color: 'bg-amber-600',
      warning: 'This increases the risk score and may trigger automated restrictions on high-value transactions.',
      successMsg: 'User flagged for monitoring.',
      impact: ['Risk score incremented', 'Moderation queue entry added']
    },
    'delist-item': {
      title: 'Delist Content',
      subtitle: `Remove ${data.title || data.id} from public view`,
      icon: <Trash2 className="text-zinc-500" />,
      actionLabel: 'Confirm Delisting',
      color: 'bg-zinc-700',
      warning: 'The item will no longer appear in search results or category listings.',
      successMsg: 'Content delisted.',
      impact: ['Public visibility removed', 'Deep-links disabled']
    }
  };

  const config = actionConfigs[actionType] || {
    title: 'Confirm Action',
    subtitle: 'Please confirm you wish to proceed.',
    icon: <Info className="text-brand-500" />,
    actionLabel: 'Confirm',
    color: 'bg-brand-600',
    warning: 'This action may have significant impact on user experience or platform data.',
    successMsg: 'Action completed.'
  };

  const isFrictionValid = !config.requiresFriction || frictionValue === config.actionLabel;

  const handleConfirm = async () => {
    if (!reason && actionType !== 'approve-refund') {
      toast.error('Administrative reason is required.');
      return;
    }

    if (!isFrictionValid) {
      toast.error(`Please type ${config.actionLabel} to confirm.`);
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);

    toast.success(config.successMsg, {
      icon: <CheckCircle2 className="text-success" />,
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', border: '1px solid #1e293b' },
    });

    if (onSuccess) onSuccess(data, actionType, reason);
    setReason('');
    setFrictionValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-surface-dark/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-2 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div className={cn("absolute inset-y-0 left-0 transition-all duration-1000", config.color)} style={{ width: isProcessing ? '100%' : '0%' }} />
        </div>

        <div className="p-8 pb-4 flex flex-col items-center text-center">
          <div className="p-6 bg-surface dark:bg-zinc-800 rounded-[2rem] mb-6 shadow-inner relative group">
            <div className="absolute inset-0 bg-current opacity-10 rounded-[2rem] animate-ping group-hover:animate-none" />
            {config.icon}
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">
            {config.title}
          </h2>
          <p className="text-sm text-zinc-500 font-medium px-4 leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        <div className="p-8 pt-4 space-y-6">
          {/* Impact Summary */}
          {config.impact && (
            <div className="grid grid-cols-1 gap-2">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Operation Impact</p>
              <div className="flex flex-wrap gap-2">
                {config.impact.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-surface dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 rounded-lg border border-zinc-100 dark:border-zinc-700">
                    • {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <MessageSquare size={12} className="text-brand-500" />
              Administrative Reason
            </label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full px-6 py-4 bg-surface dark:bg-zinc-800 border-2 border-transparent focus:border-brand-500/20 rounded-2xl text-sm font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-all resize-none shadow-inner"
              placeholder="Justification for audit trail..."
            />
          </div>

          {config.requiresFriction && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black text-red-500 uppercase tracking-widest px-1">
                Type <span className="underline">{config.actionLabel}</span> to confirm high-risk action
              </label>
              <input 
                type="text"
                value={frictionValue}
                onChange={(e) => setFrictionValue(e.target.value.toUpperCase())}
                className="w-full px-6 py-4 bg-red-50/50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 focus:border-red-500 rounded-2xl text-sm font-black text-red-600 outline-none transition-all"
                placeholder={`Type ${config.actionLabel} here...`}
              />
            </div>
          )}

          <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-[1.5rem] flex items-start gap-4 border border-amber-100 dark:border-amber-800/30">
            <AlertTriangle size={24} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest">Administrative Warning</p>
              <p className="text-xs text-amber-800 dark:text-amber-200/80 font-bold leading-relaxed">
                {config.warning}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 bg-surface/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-8 py-4 rounded-2xl text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={isProcessing || (config.requiresFriction && !isFrictionValid)}
            className={cn(
              "flex-[1.5] px-8 py-4 text-white rounded-2xl text-sm font-black shadow-xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3",
              config.color,
              isProcessing && "animate-pulse"
            )}
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              config.requiresFriction ? `CONFIRM ${config.actionLabel}` : config.actionLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
