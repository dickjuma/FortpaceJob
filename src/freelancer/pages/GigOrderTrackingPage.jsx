import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, Package, MessageSquare, AlertTriangle, 
  CheckCircle2, Circle, ArrowRight, ShieldAlert,
  FileText
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

// Mock Data
const ORDER = {
  id: '#ORD-9821',
  title: 'I will build a responsive modern React JS web application',
  status: 'in_progress', // placed, requirements_submitted, in_progress, in_review, completed
  amount: 450,
  seller: {
    name: 'Alex Rivera',
    avatar: 'https://i.pravatar.cc/150?u=alex'
  },
  deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
  milestones: [
    { id: 1, title: 'Order Placed', date: 'May 10, 10:00 AM', status: 'completed' },
    { id: 2, title: 'Requirements Submitted', date: 'May 10, 11:30 AM', status: 'completed' },
    { id: 3, title: 'Order Started', date: 'May 10, 11:35 AM', status: 'completed' },
    { id: 4, title: 'Delivery Expected', date: 'May 17, 11:35 AM', status: 'pending' },
  ]
};

export default function GigOrderTrackingPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 45 });

  // Mock countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Timeline & Tracking */}
        <div className="flex-1 space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">Order {ORDER.id}</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium line-clamp-1">{ORDER.title}</p>
            </div>
            <div className="px-4 py-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-lg text-sm font-black uppercase tracking-wider hidden sm:block">
              In Progress
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/20 rounded-full blur-[80px] pointer-events-none" />
            
            <Clock className="w-8 h-8 text-brand-400 mx-auto mb-4 relative z-10" />
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 relative z-10">Time Left to Delivery</h2>
            
            <div className="flex justify-center gap-4 sm:gap-8 relative z-10">
              <div className="text-center">
                <span className="block text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-xs font-bold text-zinc-400 uppercase">Days</span>
              </div>
              <span className="text-4xl sm:text-5xl font-black text-zinc-600 font-mono">:</span>
              <div className="text-center">
                <span className="block text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-xs font-bold text-zinc-400 uppercase">Hours</span>
              </div>
              <span className="text-4xl sm:text-5xl font-black text-zinc-600 font-mono">:</span>
              <div className="text-center">
                <span className="block text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-xs font-bold text-zinc-400 uppercase">Mins</span>
              </div>
              <span className="text-4xl sm:text-5xl font-black text-zinc-600 font-mono hidden sm:inline">:</span>
              <div className="text-center hidden sm:block">
                <span className="block text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-xs font-bold text-zinc-400 uppercase">Secs</span>
              </div>
            </div>
          </div>

          {/* Timeline Tracker */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-8">Order Timeline</h3>
            
            <div className="relative border-l-2 border-zinc-100 dark:border-zinc-800 ml-4 space-y-10 pb-4">
              {ORDER.milestones.map((milestone, idx) => {
                const isLast = idx === ORDER.milestones.length - 1;
                const isCompleted = milestone.status === 'completed';
                
                return (
                  <div key={milestone.id} className="relative pl-8">
                    {/* Timeline Node */}
                    <div className={cn(
                      "absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-zinc-900 flex items-center justify-center transition-colors",
                      isCompleted ? "bg-success" : "bg-zinc-200 dark:bg-zinc-800"
                    )}>
                      {isCompleted && <CheckCircle2 className="w-5 h-5 text-success absolute" />}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h4 className={cn("text-base font-bold", isCompleted ? "text-zinc-900 dark:text-white" : "text-zinc-500")}>
                        {milestone.title}
                      </h4>
                      <span className="text-xs font-semibold text-zinc-400">{milestone.date}</span>
                    </div>

                    {isCompleted && idx === 2 && (
                      <div className="mt-4 p-4 bg-surface dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700">
                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          The seller has everything they need and is currently working on your order.
                        </p>
                      </div>
                    )}

                    {!isCompleted && isLast && (
                      <div className="mt-4 p-4 bg-brand-50 dark:bg-brand-500/10 rounded-xl border border-brand-100 dark:border-brand-500/20">
                        <p className="text-sm font-bold text-brand-700 dark:text-brand-400 flex items-center gap-2">
                          <Package className="w-4 h-4" /> Waiting for delivery
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Actions & Details */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          {/* Action Card */}
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-6">Need help with this order?</h3>
            
            <div className="space-y-3">
              <button className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" /> Message Seller
              </button>
              
              <button className="w-full py-3 bg-surface dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> View Requirements
              </button>

              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button className="w-full py-3 bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                  Resolution Center <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Seller Snapshot */}
          <div className="bg-surface dark:bg-zinc-800/50 rounded-3xl border border-zinc-200 dark:border-zinc-700/50 p-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Your Seller</h3>
            <div className="flex items-center gap-4">
              <img src={ORDER.seller.avatar} alt="Seller" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white">{ORDER.seller.name}</h4>
                <p className="text-xs font-semibold text-success flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success" /> Online
                </p>
              </div>
            </div>
          </div>

          {/* Safety Warning */}
          <div className="flex items-start gap-3 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
            <ShieldAlert className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              For your safety, never communicate or pay outside of the Forte platform. Doing so violates our Terms of Service.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
