// src/pages/common/NotificationsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Info, AlertCircle, X, Check } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'Welcome to Forte Marketplace!', date: new Date().toISOString(), read: false },
    { id: 2, type: 'success', message: 'Your freelancer application was approved.', date: new Date().toISOString(), read: false }
  ]);
  const [showSuccess, setShowSuccess] = useState(null);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setShowSuccess({ message: 'Marked as read' });
    setTimeout(() => setShowSuccess(null), 1500);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setShowSuccess({ message: 'All notifications marked as read' });
    setTimeout(() => setShowSuccess(null), 1500);
  };

  const clearAll = () => {
    setNotifications([]);
    setShowSuccess({ message: 'All notifications cleared' });
    setTimeout(() => setShowSuccess(null), 1500);
  };

  const getTypeStyles = (type) => {
    switch(type) {
      case 'success': return { bg: 'bg-accent-light', text: 'text-accent-dark', icon: CheckCircle2 };
      case 'info': return { bg: 'bg-info-light', text: 'text-info', icon: Info };
      case 'warning': return { bg: 'bg-warn-light', text: 'text-warn', icon: AlertCircle };
      default: return { bg: 'bg-surface-muted', text: 'text-ink-secondary', icon: Bell };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
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
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors"
            >
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-lg border border-border text-ink-primary hover:bg-surface-muted font-body font-medium text-sm transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
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
              {notifications.map((notif, idx) => {
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
