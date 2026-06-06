// NotificationsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle, AlertCircle, DollarSign, Briefcase, MessageSquare, Star, Info, Check, Trash2, RefreshCw,
} from 'lucide-react';
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from '../services/clientHooks';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const TYPE_ICONS = {
  PAYMENT:   { icon: DollarSign, color: 'text-accent bg-accent-light' },
  JOB:       { icon: Briefcase,  color: 'text-accent bg-accent-light' },
  CONTRACT:  { icon: CheckCircle,color: 'text-info bg-info-light' },
  REVIEW:    { icon: Star,       color: 'text-warn bg-warn-light' },
  PROPOSAL:  { icon: Briefcase,  color: 'text-accent bg-accent-light' },
  DISPUTE:   { icon: AlertCircle,color: 'text-danger bg-danger-light' },
  MILESTONE: { icon: CheckCircle,color: 'text-accent bg-accent-light' },
  MESSAGE:   { icon: MessageSquare, color: 'text-info bg-info-light' },
  SYSTEM:    { icon: Info,       color: 'text-ink-tertiary bg-surface-muted' },
};

const TABS = ['All', 'Unread', 'PAYMENT', 'CONTRACT', 'PROPOSAL', 'REVIEW', 'DISPUTE'];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};
const buttonTap = { scale: 0.97 };

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);

  const filters = {
    page,
    limit: 15,
    ...(activeTab === 'Unread' ? { unread: true } : activeTab !== 'All' ? { type: activeTab } : {}),
  };

  const { data, isLoading, error, refetch } = useNotifications(filters);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllRead();

  const notifications = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (notifId) => {
    try {
      await markRead.mutateAsync(notifId);
    } catch (_) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAll.mutateAsync();
      refetch();
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-surface-soft font-body py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-accent" />
              Notifications
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-xs font-semibold">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-sm text-ink-secondary mt-1">{total} total notifications</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg text-ink-tertiary hover:text-accent transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markAll.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-border bg-white text-ink-primary rounded-lg text-xs font-medium transition-colors hover:bg-surface-soft disabled:opacity-50"
              >
                {markAll.isPending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Tab Filter */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                activeTab === tab
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white text-ink-secondary border-border hover:border-accent/30'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-surface-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3 bg-white border border-border rounded-2xl">
            <AlertCircle className="w-10 h-10 text-danger opacity-60" />
            <p className="text-ink-secondary text-sm">
              Failed to load notifications.{' '}
              <button onClick={() => refetch()} className="text-accent underline">
                Retry
              </button>
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-4 bg-white border border-border rounded-2xl">
            <Bell className="w-12 h-12 text-ink-tertiary" />
            <p className="text-ink-secondary">No notifications found.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            <AnimatePresence>
              {notifications.map((notif) => {
                const typeInfo = TYPE_ICONS[notif.type] || TYPE_ICONS.SYSTEM;
                const Icon = typeInfo.icon;
                return (
                  <motion.div
                    key={notif.id}
                    variants={itemVariants}
                    whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
                    className={cn(
                      'relative flex items-start gap-4 p-4 rounded-xl border transition-all cursor-default',
                      !notif.isRead
                        ? 'bg-accent-light border-accent/20'
                        : 'bg-white border-border'
                    )}
                  >
                    {/* Unread dot */}
                    {!notif.isRead && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent" />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                        typeInfo.color
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-6">
                      <p
                        className={cn(
                          'text-sm font-semibold',
                          !notif.isRead ? 'text-ink-primary' : 'text-ink-secondary'
                        )}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-ink-tertiary mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-ink-tertiary mt-1.5">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>

                    {/* Mark read button */}
                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkRead(notif.id)}
                        className="shrink-0 p-1.5 rounded-lg text-ink-tertiary hover:text-accent hover:bg-accent-light transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary disabled:opacity-40 hover:bg-surface-soft transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-ink-tertiary">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-ink-primary disabled:opacity-40 hover:bg-surface-soft transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
