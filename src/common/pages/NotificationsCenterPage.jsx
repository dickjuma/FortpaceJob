import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, FileText, DollarSign, MessageSquare, 
  Star, Briefcase, Shield, CheckCircle2, 
  Settings, MoreHorizontal, Check
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const NOTIFICATIONS = [
  { id: 1, type: 'Payments', title: 'Payment Released', message: 'Funds for Milestone 1 ($1,200) have been released to your wallet.', time: '10 mins ago', isRead: false, icon: DollarSign, color: 'text-success', bg: 'bg-emerald-50 dark:bg-success/10' },
  { id: 2, type: 'Messages', title: 'New Message from Sarah', message: 'Great work! Let\'s proceed with the next milestone.', time: '1 hour ago', isRead: false, icon: MessageSquare, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5 dark:bg-[#14a800]/10' },
  { id: 3, type: 'Contracts', title: 'Contract Started', message: 'You have a new active contract: React Native E-Commerce App.', time: 'Yesterday', isRead: true, icon: FileText, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5 dark:bg-[#14a800]/10' },
  { id: 4, type: 'Reviews', title: 'New Review Received', message: 'Alex Rivera left you a 5-star review on your recent project.', time: 'Yesterday', isRead: true, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  { id: 5, type: 'Security', title: 'New Login Detected', message: 'We noticed a new login from Mac OS, Chrome in San Francisco.', time: 'May 18', isRead: true, icon: Shield, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  { id: 6, type: 'Jobs', title: 'Job Match', message: 'A new job matching your skills was just posted: Senior Next.js Developer.', time: 'May 17', isRead: true, icon: Briefcase, color: 'text-[#14a800]', bg: 'bg-[#14a800]/5 dark:bg-[#14a800]/10' },
];

export default function NotificationsCenterPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const filters = ['All', 'Unread', 'Contracts', 'Payments', 'Messages', 'Reviews', 'Jobs', 'Security'];

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !n.isRead;
    return n.type === activeFilter;
  });

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const toggleRead = (id) => {
    setNotifications(notifications.map(n => {
      if (n.id === id) return { ...n, isRead: !n.isRead };
      return n;
    }));
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
              <Bell className="w-8 h-8 text-[#14a800]" /> Notifications
            </h1>
            <div className="flex items-center gap-3">
              <button 
                onClick={markAllRead}
                className="hidden sm:flex px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Mark all as read
              </button>
              <button className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
            {filters.map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-4 py-2 text-sm font-bold rounded-full transition-all whitespace-nowrap",
                  activeFilter === filter ? "bg-surface-dark dark:bg-white text-white dark:text-zinc-900 shadow-sm" : "bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((notif, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={notif.id} 
                className={cn(
                  "p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors cursor-pointer flex gap-4",
                  !notif.isRead ? "bg-[#14a800]/5/30 dark:bg-[#14a800]/10" : ""
                )}
                onClick={() => toggleRead(notif.id)}
              >
                
                {/* Icon */}
                <div className="relative shrink-0">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", notif.bg)}>
                    <notif.icon className={cn("w-6 h-6", notif.color)} />
                  </div>
                  {!notif.isRead && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-[#14a800] rounded-full border-2 border-white dark:border-zinc-900"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className={cn("text-sm font-bold truncate pr-4", !notif.isRead ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300")}>
                      {notif.title}
                    </p>
                    <span className="text-xs font-bold text-zinc-400 whitespace-nowrap shrink-0">{notif.time}</span>
                  </div>
                  <p className={cn("text-sm leading-snug", !notif.isRead ? "font-bold text-zinc-700 dark:text-zinc-200" : "font-medium text-zinc-500")}>
                    {notif.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors hidden sm:block">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>

          {filteredNotifications.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No notifications found</h3>
              <p className="text-sm font-medium text-zinc-500">You're all caught up! There are no {activeFilter.toLowerCase()} notifications.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
