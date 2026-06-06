import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Briefcase, DollarSign, MessageSquare, 
  Star, TrendingUp, CheckCircle2, Circle, 
  Settings, Loader2, ArrowRight
} from 'lucide-react';

// Mock Notification Data
const initialNotifications = [
  {
    id: 1,
    type: 'Contracts',
    title: 'Milestone Approved',
    message: 'Client approved "Core UI Implementation". Funds have been released to your account.',
    time: '2 mins ago',
    unread: true,
    action: 'View Contract',
    icon: Briefcase,
    color: 'text-[#4C1D95]',
    bg: 'bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10'
  },
  {
    id: 2,
    type: 'Payments',
    title: 'Payment Received',
    message: 'You received a payment of $6,000 from Enterprise Corp.',
    time: '1 hour ago',
    unread: true,
    action: 'View Earnings',
    icon: DollarSign,
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-500/10'
  },
  {
    id: 3,
    type: 'Messages',
    title: 'New Message from Sarah K.',
    message: '"Hey, can we schedule a quick sync for tomorrow morning to review the designs?"',
    time: '3 hours ago',
    unread: true,
    action: 'Reply',
    icon: MessageSquare,
    color: 'text-[#4C1D95]',
    bg: 'bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10'
  },
  {
    id: 4,
    type: 'Ranking',
    title: 'Ranking Updated',
    message: 'Congratulations! Your Trust Score has increased to 99/100. You are now in the Top 3% of freelancers.',
    time: 'Yesterday',
    unread: false,
    action: 'View Analytics',
    icon: TrendingUp,
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-500/10'
  },
  {
    id: 5,
    type: 'Reviews',
    title: '5-Star Review Received',
    message: 'David L. left a new 5-star review: "Exceptional work and great communication throughout the project."',
    time: 'Yesterday',
    unread: false,
    action: 'Read Review',
    icon: Star,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10'
  },
  {
    id: 6,
    type: 'Contracts',
    title: 'New Proposal Received',
    message: 'You have a new proposal from Alex D. for the "Mobile App Refactoring" job.',
    time: 'Oct 15, 2026',
    unread: false,
    action: 'Review Proposal',
    icon: Briefcase,
    color: 'text-[#4C1D95]',
    bg: 'bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10'
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const categories = ['All', 'Contracts', 'Payments', 'Messages', 'Reviews', 'Ranking'];

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const loadMore = () => {
    setIsLoadingMore(true);
    // Simulate API call for infinite loading
    setTimeout(() => {
      setIsLoadingMore(false);
      // In a real app, append new data here
    }, 1500);
  };

  const filteredNotifications = activeCategory === 'All' 
    ? notifications 
    : notifications.filter(n => n.type === activeCategory || n.type === 'Ranking' && activeCategory === 'Ranking');

  // Group by Date visually (Mock logic for today/yesterday)
  const groupedNotifications = {
    'New': filteredNotifications.filter(n => n.unread),
    'Earlier': filteredNotifications.filter(n => !n.unread)
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-8 h-8 text-[#4C1D95]" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-zinc-50 dark:border-zinc-900 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">Notifications</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Stay updated on your marketplace activity.</p>
          </div>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-semibold text-[#4C1D95] dark:text-[#4C1D95] bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10 hover:bg-[#4C1D95]/10 dark:hover:bg-[#4C1D95]/20 rounded-lg transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Mark all read
            </button>
          )}
          <button className="p-2 text-zinc-400 hover:text-zinc-600 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === category 
                ? 'bg-surface-dark text-white dark:bg-white dark:text-zinc-900 shadow-md' 
                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-surface dark:hover:bg-zinc-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Notification Feed */}
      <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-sm overflow-hidden">
        
        {Object.entries(groupedNotifications).map(([group, items]) => {
          if (items.length === 0) return null;
          
          return (
            <div key={group} className="mb-4 last:mb-0">
              <div className="px-6 py-3 bg-surface dark:bg-surface-dark/50 border-b border-zinc-100 dark:border-zinc-700/50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">{group}</h3>
              </div>
              
              <div className="divide-y divide-zinc-100 dark:divide-zinc-700/50">
                <AnimatePresence>
                  {items.map((notification) => (
                    <motion.div 
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-6 flex gap-4 transition-colors cursor-pointer relative group ${
                        notification.unread ? 'bg-[#4C1D95]/5/30 dark:bg-[#4C1D95]/10' : 'hover:bg-surface dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      {notification.unread && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4C1D95]" />
                      )}
                      
                      <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${notification.bg}`}>
                        <notification.icon className={`w-6 h-6 ${notification.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h4 className={`text-base font-bold truncate ${notification.unread ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs font-semibold text-zinc-400 shrink-0 mt-0.5">{notification.time}</span>
                        </div>
                        
                        <p className={`text-sm mb-3 ${notification.unread ? 'text-zinc-700 dark:text-zinc-300 font-medium' : 'text-zinc-500 dark:text-zinc-400'}`}>
                          {notification.message}
                        </p>
                        
                        <button className="text-sm font-bold text-[#4C1D95] dark:text-[#4C1D95] flex items-center gap-1 group-hover:gap-2 transition-all">
                          {notification.action} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="shrink-0 pt-1">
                        {notification.unread ? (
                          <div className="w-3 h-3 bg-[#4C1D95] rounded-full" />
                        ) : (
                          <Circle className="w-3 h-3 text-zinc-300 dark:text-zinc-600" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}

        {filteredNotifications.length === 0 && (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">You're all caught up!</h3>
            <p className="text-zinc-500">No new notifications in this category.</p>
          </div>
        )}
      </div>

      {/* Infinite Load More */}
      {filteredNotifications.length > 0 && (
        <div className="flex justify-center pt-4">
          <button 
            onClick={loadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-bold rounded-xl hover:bg-surface dark:hover:bg-zinc-700 transition-colors shadow-sm disabled:opacity-70"
          >
            {isLoadingMore ? (
              <><Loader2 className="w-4 h-4 animate-spin text-[#4C1D95]" /> Loading older alerts...</>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

    </div>
  );
};

export default Notifications;


