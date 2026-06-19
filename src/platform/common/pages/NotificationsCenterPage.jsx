import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, FileText, DollarSign, MessageSquare,
  Star, Briefcase, Shield, CheckCircle2,
  Settings, MoreHorizontal, Trash2
} from 'lucide-react';
import { cn } from '../../../admin/utils/cn';
import useChatStore from '../../store/chatStore';

// ─── Icon / colour map ────────────────────────────────────────────────────────

const TYPE_META = {
  payment:   { icon: DollarSign,    color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10',  label: 'Payments'  },
  message:   { icon: MessageSquare, color: 'text-[#4C1D95]',   bg: 'bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10',  label: 'Messages'  },
  contract:  { icon: FileText,      color: 'text-[#4C1D95]',   bg: 'bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10',  label: 'Contracts' },
  review:    { icon: Star,          color: 'text-amber-500',    bg: 'bg-amber-50 dark:bg-amber-500/10',      label: 'Reviews'   },
  security:  { icon: Shield,        color: 'text-rose-500',     bg: 'bg-rose-50 dark:bg-rose-500/10',        label: 'Security'  },
  job:       { icon: Briefcase,     color: 'text-[#4C1D95]',   bg: 'bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10',  label: 'Jobs'      },
  milestone: { icon: CheckCircle2,  color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10',  label: 'Payments'  },
};

function getMeta(type = '') {
  return TYPE_META[(type || '').toLowerCase()] || {
    icon: Bell, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', label: 'Other',
  };
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  <  1) return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const FILTER_LABELS = ['All', 'Unread', 'Payments', 'Messages', 'Contracts', 'Reviews', 'Jobs', 'Security'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationsCenterPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const notifications          = useChatStore((s) => s.notifications);
  const markNotificationRead   = useChatStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useChatStore((s) => s.markAllNotificationsRead);
  const clearNotifications     = useChatStore((s) => s.clearNotifications);

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'All')    return true;
    if (activeFilter === 'Unread') return !n.isRead;
    const meta = getMeta(n.type);
    return meta.label === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark font-sans pb-24">

      {/* ── Header ── */}
      <div className="bg-white dark:bg-surface-dark border-b border-zinc-200 dark:border-zinc-800 pt-12 pb-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
              <Bell className="w-8 h-8 text-[#4C1D95]" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-sm font-bold bg-[#4C1D95] text-white">
                  {unreadCount}
                </span>
              )}
            </h1>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="hidden sm:flex px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Clear all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <button className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {FILTER_LABELS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  'px-4 py-2 text-sm font-bold rounded-full transition-all whitespace-nowrap',
                  activeFilter === f
                    ? 'bg-surface-dark dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                    : 'bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── List ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <AnimatePresence mode="popLayout">
            {filtered.map((notif) => {
              const { icon: Icon, color, bg } = getMeta(notif.type);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={cn(
                    'group p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 last:border-0',
                    'hover:bg-surface dark:hover:bg-zinc-800/50 transition-colors cursor-pointer flex gap-4',
                    !notif.isRead ? 'bg-[#4C1D95]/[0.04] dark:bg-[#4C1D95]/10' : ''
                  )}
                >
                  {/* Icon */}
                  <div className="relative shrink-0">
                    <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', bg)}>
                      <Icon className={cn('w-6 h-6', color)} />
                    </div>
                    {!notif.isRead && (
                      <div className="absolute top-0 right-0 w-3 h-3 bg-[#4C1D95] rounded-full border-2 border-white dark:border-zinc-900" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={cn(
                        'text-sm font-bold truncate pr-4',
                        !notif.isRead ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'
                      )}>
                        {notif.title || notif.type || 'Notification'}
                      </p>
                      <span className="text-xs font-bold text-zinc-400 whitespace-nowrap shrink-0">
                        {timeAgo(notif.createdAt || notif.timestamp)}
                      </span>
                    </div>
                    <p className={cn(
                      'text-sm leading-snug',
                      !notif.isRead ? 'font-bold text-zinc-700 dark:text-zinc-200' : 'font-medium text-zinc-500'
                    )}>
                      {notif.message || notif.body || notif.text || ''}
                    </p>
                  </div>

                  {/* Actions (hover) */}
                  <div className="shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors hidden sm:block">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No notifications found</h3>
              <p className="text-sm font-medium text-zinc-500">
                You&apos;re all caught up! No {activeFilter.toLowerCase()} notifications.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
