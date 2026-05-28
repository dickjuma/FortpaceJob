import React from 'react';
import { 
  X, FileText, User, DollarSign, 
  Target, Clock, CheckCircle2, 
  ExternalLink, Download, MessageCircle, AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function MarketplaceProposalModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-surface-dark/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-surface-dark w-full max-w-3xl rounded-[3rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-surface/50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-500 text-white rounded-2xl shadow-lg shadow-brand-500/20">
              <FileText size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Proposal Review</span>
                <span className="h-1 w-1 bg-zinc-300 rounded-full" />
                <span className="text-[10px] font-mono text-brand-600 font-bold">{data.id}</span>
              </div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                {data.jobTitle}
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
        <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-surface dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Bid Amount</p>
              <p className="text-lg font-black text-zinc-900 dark:text-white">
                <span className="text-xs mr-1 text-zinc-400">KES</span>
                {data.bidAmount?.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-surface dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Match Score</p>
              <div className="flex items-center gap-2">
                <Target size={14} className="text-success" />
                <span className="text-lg font-black text-zinc-900 dark:text-white">{data.matchScore}%</span>
              </div>
            </div>
            <div className="p-4 bg-surface dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Timeline</p>
              <p className="text-sm font-black text-zinc-700 dark:text-zinc-300">14 Days</p>
            </div>
            <div className="p-4 bg-surface dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Status</p>
              <span className="text-[10px] font-black uppercase text-brand-600 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded">
                {data.status}
              </span>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <MessageCircle size={14} className="text-brand-500" />
              Cover Letter / Bid Text
            </h3>
            <div className="p-6 bg-surface dark:bg-zinc-800/50 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium italic">
              "I have reviewed your requirements for {data.jobTitle} and I am confident that my experience in high-performance web applications perfectly aligns with this project. I have successfully delivered 12 similar projects in the last quarter with 100% client satisfaction..."
            </div>
          </div>

          {/* Freelancer Profile Quick View */}
          <div className="p-6 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center text-brand-600 text-2xl font-black">
                {data.freelancerName?.charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-black text-zinc-900 dark:text-white">{data.freelancerName}</h4>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                  <Clock size={12} />
                  Top Rated Plus
                  <span className="h-1 w-1 bg-zinc-300 rounded-full" />
                  98% Success Rate
                </div>
              </div>
            </div>
            <button className="px-6 py-3 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
              View Profile
            </button>
          </div>

          {/* Attachments */}
          <div className="space-y-4">
             <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Attachments (2)</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl flex items-center justify-between group hover:border-brand-500 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-surface dark:bg-surface-dark rounded-lg text-zinc-400"><FileText size={16} /></div>
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Portfolio_2026.pdf</span>
                   </div>
                   <Download size={16} className="text-zinc-300 group-hover:text-brand-500 cursor-pointer" />
                </div>
                <div className="p-4 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl flex items-center justify-between group hover:border-brand-500 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-surface dark:bg-surface-dark rounded-lg text-zinc-400"><FileText size={16} /></div>
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Technical_Spec.pdf</span>
                   </div>
                   <Download size={16} className="text-zinc-300 group-hover:text-brand-500 cursor-pointer" />
                </div>
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-surface/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
           <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
              <AlertCircle size={16} />
              Flag Proposal
           </button>
           <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-3 text-sm font-bold text-zinc-500 transition-colors"
              >
                Close
              </button>
              <button className="px-8 py-3 bg-success hover:bg-emerald-700 text-white rounded-2xl text-sm font-black shadow-xl shadow-emerald-500/20 transition-all active:scale-95">
                Approve & Hire
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
