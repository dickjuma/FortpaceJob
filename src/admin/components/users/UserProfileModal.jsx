import React from 'react';
import { 
  X, User, Mail, Shield, 
  Star, Award, CheckCircle2, MapPin, 
  Calendar, Briefcase, ExternalLink 
} from 'lucide-react';
import { cn } from '../../utils/cn';

export default function UserProfileModal({ isOpen, onClose, user, onAction }) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-surface-dark/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[3rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Header */}
        <div className="relative h-40 bg-gradient-to-r from-brand-600 to-indigo-700 p-8">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="absolute -bottom-16 left-10 flex items-end gap-6">
            <div className="h-32 w-32 rounded-[2rem] border-8 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shadow-xl">
              <span className="text-4xl font-black text-zinc-400">
                {user.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="pb-4">
              <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                {user.name || 'Anonymous User'}
              </h2>
              <div className="flex items-center gap-2 text-white/80 font-bold text-sm">
                <MapPin size={14} />
                Nairobi, Kenya
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-24 p-10 space-y-10">
          {/* Top Stats Bar */}
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 bg-surface dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700/50">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Trust Score</p>
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-success" />
                <span className="text-xl font-black text-zinc-900 dark:text-white">98/100</span>
              </div>
            </div>
            <div className="p-4 bg-surface dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700/50">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Success Rate</p>
              <div className="flex items-center gap-2">
                <Award size={18} className="text-brand-500" />
                <span className="text-xl font-black text-zinc-900 dark:text-white">100%</span>
              </div>
            </div>
            <div className="p-4 bg-surface dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700/50">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Avg Rating</p>
              <div className="flex items-center gap-2">
                <Star size={18} className="text-amber-500 fill-amber-500" />
                <span className="text-xl font-black text-zinc-900 dark:text-white">4.9</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
                <Briefcase size={16} className="text-brand-500" />
                Marketplace Activity
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-bold">Total Earnings</span>
                  <span className="font-black text-zinc-900 dark:text-white">KES 1.2M</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-bold">Jobs Completed</span>
                  <span className="font-black text-zinc-900 dark:text-white">42 Projects</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-bold">Active Contracts</span>
                  <span className="font-black text-zinc-900 dark:text-white">3 Active</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
                <User size={16} className="text-brand-500" />
                Account Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-zinc-400" />
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{user.email || 'user@forte.co.ke'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-zinc-400" />
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Joined Jan 2024</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-success" />
                  <span className="text-sm font-black text-success dark:text-success uppercase tracking-tighter">ID Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-10 bg-surface dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <div className="flex gap-4">
            <button 
              onClick={() => onAction('ranking')}
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-bold transition-colors"
            >
              <Star size={18} />
              Adjust Ranking
            </button>
            <button 
              onClick={() => onAction('flag')}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-bold transition-colors"
            >
              <Shield size={18} />
              Flag User
            </button>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-surface-dark dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-sm font-black shadow-xl active:scale-95 transition-all">
              Manage Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
