// src/pages/common/NotificationsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Info, AlertCircle, Check } from 'lucide-react';
import { useNotifications } from '../services/freelancerHooks';
import { api } from '../../platform/common/services/api';

export default function NotificationsPage() {
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('All');
  const { data: notifications = [], refetch } = useNotifications();

  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 1500);
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      refetch();
      showToast('Marked as read');
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      refetch();
      showToast('All notifications marked as read');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getTypeStyles = (type) => {
    switch(type) {
      case 'success': return { bg: 'bg-accent-light', text: 'text-accent-dark', icon: CheckCircle2 };
      case 'info': return { bg: 'bg-info-light', text: 'text-info', icon: Info };
      case 'warning': return { bg: 'bg-warn-light', text: 'text-warn', icon: AlertCircle };
      default: return { bg: 'bg-surface-muted', text: 'text-ink-secondary', icon: Bell };
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead && !n.read).length;
  const filteredNotifications = filter === 'All' ? notifications : notifications.filter((notification) => String(notification.type || '').toLowerCase() === filter.toLowerCase());

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
      <AnimatePresence>
{toast && (
           <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
           >
             <Check className="w-4 h-4" />
             {toast.message}
           </motion.div>
         )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-accent-light rounded-xl">
              <Bell className="w-6 h-6 text-accent DEFAULT" />
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-900">Notifications</h1>
          </div>
          <p className="text-ink-secondary font-body">Stay updated with your latest activities</p>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
            >
              {['All', 'success', 'info', 'warning'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors"
            >
              Mark all read
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-ink-tertiary mx-auto mb-4" />
            <h3 className="font-body font-semibold text-lg text-ink-primary mb-1">No notifications</h3>
            <p className="text-ink-secondary">You're all caught up!</p>
          </div>
        ) : (
          <>
            {unreadCount > 0 && (
              <div className="px-6 py-3 bg-accent-light border-b border-border">
                <p className="text-sm font-body font-medium text-accent-dark">
                  {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                </p>
              </div>
            )}
            <ul className="divide-y divide-border">
              {filteredNotifications.map((notif, idx) => {
                const styles = getTypeStyles(notif.type);
                const Icon = styles.icon;
                return (
                  <motion.li
                    key={notif.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`p-5 hover:bg-surface-soft transition-colors cursor-pointer ${!notif.read ? 'bg-surface-soft/50' : ''}`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${styles.bg} shrink-0`}>
                        <Icon className={`w-5 h-5 ${styles.text}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-body text-ink-primary">{notif.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs font-body text-ink-tertiary">
                            {new Date(notif.date).toLocaleString()}
                          </p>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-accent DEFAULT" />
                          )}
                        </div>
                      </div>
                      {!notif.read && (
                        <button className="p-1 text-ink-tertiary hover:text-accent DEFAULT transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </motion.div>
  );
}
