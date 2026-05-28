import React, { useState } from 'react';
import { AlertTriangle, Clock, X, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../../utils/cn';
import useUserManagementStore from '../../../store/userManagementStore';
import { useUserActions } from '../../../hooks/users/useUserActions';
import Button from '../../../components/ui/Button';
import UserAvatar from '../shared/UserAvatar';

/**
 * Modal for suspending a user account with reason and duration.
 */
const SuspendUserModal = () => {
  const { activeModal, closeModal, modalTargetUser: user } = useUserManagementStore();
  const { suspendUser } = useUserActions();
  
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('7d');
  const [confirmed, setConfirmed] = useState(false);

  if (activeModal !== 'SUSPEND_USER' || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Processing account suspension...',
        success: 'Account suspended successfully',
        error: 'Failed to suspend account'
      }
    ).then(() => closeModal());
  };

  const durations = [
    { id: '24h', label: '24 Hours' },
    { id: '3d', label: '3 Days' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: 'indefinite', label: 'Indefinite' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-surface-dark/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeModal}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={24} />
               </div>
               <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Suspend Account</h2>
            </div>
            <button onClick={closeModal} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
               <X size={20} className="text-zinc-400" />
            </button>
          </div>

          {/* User Preview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 mb-8">
             <UserAvatar name={user.fullName} size="lg" />
             <div>
                <p className="text-sm font-black text-zinc-900 dark:text-white">{user.fullName}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{user.id}</p>
             </div>
             <div className="ml-auto">
                <span className="px-2 py-1 bg-emerald-50 text-success dark:bg-emerald-950/20 text-[9px] font-black uppercase tracking-widest rounded-md">Currently Active</span>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reason */}
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Reason for Suspension</label>
               <textarea 
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe the violation or reason for suspension (minimum 20 characters)..."
                  className="w-full h-32 p-4 bg-surface dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm font-medium outline-none focus:border-amber-500 transition-all resize-none"
               />
               {reason.length > 0 && reason.length < 20 && (
                 <p className="text-[10px] font-bold text-rose-500 ml-1">Keep typing... {20 - reason.length} characters left</p>
               )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Suspension Period</label>
               <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {durations.map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDuration(d.id)}
                      className={cn(
                        "h-10 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border",
                        duration === d.id 
                          ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20" 
                          : "bg-white dark:bg-surface-dark text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:border-amber-200"
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
               </div>
            </div>

            {/* Warning Card */}
            <div className="flex gap-3 p-4 bg-rose-50 dark:bg-rose-950/10 rounded-2xl border border-rose-100 dark:border-rose-900/30">
               <Info size={18} className="text-rose-500 shrink-0" />
               <p className="text-[11px] font-bold text-rose-700 dark:text-rose-400 leading-relaxed">
                  The user will be immediately logged out and unable to access their dashboard. Active contracts will be paused.
               </p>
            </div>

            {/* Confirmation */}
            <label className="flex items-center gap-3 cursor-pointer group">
               <input 
                  type="checkbox" 
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="h-5 w-5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
               />
               <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 transition-colors">
                  I confirm I want to suspend this account
               </span>
            </label>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
               <Button 
                  variant="secondary" 
                  type="button" 
                  onClick={closeModal} 
                  className="flex-1 h-14 rounded-2xl"
               >
                  Cancel
               </Button>
               <Button 
                  variant="primary" 
                  type="submit"
                  disabled={!confirmed || reason.length < 20 || suspendUser.isPending}
                  className="flex-1 h-14 rounded-2xl bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/20"
                  isLoading={suspendUser.isPending}
               >
                  Confirm Suspension
               </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuspendUserModal;
