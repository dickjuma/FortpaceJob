import React, { useState } from 'react';
import { 
  X, Send, Clock, FileCheck, 
  CreditCard, MessageSquare, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

export default function MarketplaceRequestUpdateModal({ isOpen, onClose, data }) {
  const [requestType, setRequestType] = useState('status');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !data) return null;

  const requestOptions = [
    { id: 'status', label: 'Progress Update', icon: Clock, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5' },
    { id: 'files', label: 'Missing Deliverables', icon: FileCheck, color: 'text-success', bg: 'bg-emerald-50' },
    { id: 'payment', label: 'Payment Clarification', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message) {
      toast.error('Please include a message for the parties.');
      return;
    }

    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    setIsSending(false);
    toast.success('Update request dispatched to all parties!', {
      icon: '📧',
      style: {
        borderRadius: '12px',
        background: '#0f172a',
        color: '#fff',
        fontWeight: 'bold',
      },
    });
    onClose();
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-surface-dark/50 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in slide-in-from-top-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSend}>
          {/* Header */}
          <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-surface/50 dark:bg-zinc-800/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#14a800] text-white rounded-2xl shadow-lg shadow-[#14a800]/25/20">
                <Send size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                  Request Contract Update
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

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Request Type Selector */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Request Category</label>
              <div className="grid grid-cols-3 gap-3">
                {requestOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRequestType(opt.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                      requestType === opt.id 
                        ? "border-[#14a800]/20 bg-[#14a800]/5 dark:bg-[#14a800]/10" 
                        : "border-zinc-100 dark:border-zinc-800 bg-surface dark:bg-zinc-800/50 hover:border-zinc-200"
                    )}
                  >
                    <opt.icon size={20} className={cn(requestType === opt.id ? "text-[#14a800]" : opt.color)} />
                    <span className={cn("text-[10px] font-black text-center", requestType === opt.id ? "text-[#14a800] dark:text-[#14a800]" : "text-zinc-500")}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <MessageSquare size={12} />
                Detailed Instructions
              </label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-5 py-4 bg-surface dark:bg-zinc-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#14a800] outline-none transition-all resize-none"
                placeholder="What exactly do you need the parties to provide or update?..."
                required
              />
            </div>

            <div className="p-4 bg-[#14a800]/5 dark:bg-[#14a800]/20 rounded-2xl flex items-start gap-3 border border-[#14a800]/20 dark:border-[#14a800]/20/50">
              <AlertCircle size={18} className="text-[#14a800] mt-0.5 shrink-0" />
              <p className="text-[10px] text-[#14a800] dark:text-[#14a800] font-bold leading-relaxed uppercase tracking-tight">
                Note: This request will be sent to both {data.clientName || 'the client'} and {data.freelancerName || 'the freelancer'} to ensure transparency.
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
              disabled={isSending}
              className={cn(
                "px-8 py-3 bg-[#14a800] hover:bg-[#118a00] text-white rounded-2xl text-sm font-black shadow-xl shadow-[#14a800]/25/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50",
                isSending && "animate-pulse"
              )}
            >
              {isSending ? 'Sending Request...' : 'Dispatch Request'}
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
