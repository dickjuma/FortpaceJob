import React from 'react';
import { 
  X, Briefcase, ShoppingBag, FileText, 
  User, Calendar, DollarSign, Activity,
  CheckCircle2, AlertTriangle, ExternalLink
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function MarketplaceDetailModal({ isOpen, onClose, data, type = 'job' }) {
  if (!isOpen || !data) return null;

  const getIcon = () => {
    switch (type) {
      case 'job': return <Briefcase className="text-[#4C1D95]" />;
      case 'gig': return <ShoppingBag className="text-[#4C1D95]" />;
      case 'contract': return <FileText className="text-success" />;
      default: return <Activity className="text-zinc-500" />;
    }
  };

  const getTitle = () => data.title || data.id;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-surface/50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm">
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {type} Details
                </span>
                <span className="h-1 w-1 bg-zinc-300 rounded-full" />
                <span className="text-[10px] font-mono text-[#4C1D95] font-bold">{data.id}</span>
              </div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                {getTitle()}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-surface dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Budget / Value</p>
              <p className="text-lg font-black text-zinc-900 dark:text-white">
                <span className="text-xs mr-1">KES</span>
                {(data.amount || data.price?.base || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-surface dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Status</p>
              <div className="flex items-center gap-1.5">
                <div className={cn("h-2 w-2 rounded-full animate-pulse", 
                  data.status === 'active' || data.status === 'completed' ? "bg-success" : "bg-amber-500"
                )} />
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 capitalize">
                  {data.status}
                </span>
              </div>
            </div>
            <div className="p-4 bg-surface dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Created</p>
              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                {data.date || 'May 12, 2026'}
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Activity size={14} className="text-[#4C1D95]" />
              Description & Summary
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              {data.description || "No detailed description provided for this entry. This module tracks the full lifecycle of marketplace interactions including audits, milestones, and dispute logs."}
            </p>
          </div>

          {/* Parties Involved */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Client Details</h4>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30 rounded-xl flex items-center justify-center text-[#4C1D95] font-bold">
                  {data.clientName?.charAt(0) || data.client?.charAt(0) || 'C'}
                </div>
                <div>
                  <p className="text-sm font-black text-zinc-900 dark:text-white">{data.clientName || data.client || 'N/A'}</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Verified Client</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Freelancer Details</h4>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30 rounded-xl flex items-center justify-center text-[#4C1D95] font-bold">
                  {data.freelancerName?.charAt(0) || data.freelancer?.charAt(0) || 'F'}
                </div>
                <div>
                  <p className="text-sm font-black text-zinc-900 dark:text-white">{data.freelancerName || data.freelancer || 'N/A'}</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Pro Freelancer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-surface dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <button 
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-sm font-bold transition-colors"
          >
            <ExternalLink size={16} />
            View Public Page
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>
            <button className="px-6 py-2.5 bg-[#4C1D95] hover:bg-[#22C55E] text-white rounded-xl text-sm font-black shadow-lg shadow-[#4C1D95]/25/20 transition-all active:scale-95">
              Edit {type}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


