import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, FileText, AlertTriangle, DollarSign, X } from 'lucide-react';

export default function NotificationCenter({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', icon: CheckCircle, title: 'Milestone Approved', text: 'Client has approved M2. Funds are released.', time: '2m ago', unread: true },
    { id: 2, type: 'info', icon: FileText, title: 'New Contract Signed', text: 'You and Alex Client signed CON-9921.', time: '1h ago', unread: true },
    { id: 3, type: 'warning', icon: AlertTriangle, title: 'Dispute Update', text: 'Admin requested more evidence on DSP-4921.', time: '4h ago', unread: false },
    { id: 4, type: 'success', icon: DollarSign, title: 'Payment Sent', text: 'Withdrawal of $4,500.00 is processing.', time: '1d ago', unread: false },
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'success': return 'text-success bg-success/10';
      case 'warning': return 'text-warning bg-warning/10';
      case 'info': return 'text-brand-600 bg-brand-50 dark:bg-brand-900/20 dark:text-brand-400';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <AnimatePresence>
      <div className="absolute top-16 right-4 sm:right-6 w-96 z-50">
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border rounded-2xl shadow-dropdown overflow-hidden"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-surface-dark-border bg-surface dark:bg-surface-dark-secondary">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
              <Bell className="w-4 h-4 mr-2" /> Notifications
            </h3>
            <div className="flex gap-3">
              <button onClick={markAllRead} className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700">Mark all read</button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-surface-dark-border">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div key={notif.id} className={`p-4 hover:bg-surface dark:hover:bg-surface-dark-secondary transition-colors cursor-pointer flex gap-4 ${notif.unread ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconColor(notif.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm font-bold truncate ${notif.unread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {notif.title}
                          </p>
                          <span className="text-xs text-gray-400 shrink-0 ml-2">{notif.time}</span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">{notif.text}</p>
                      </div>
                      {notif.unread && (
                        <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p>No new notifications</p>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100 dark:border-surface-dark-border text-center bg-surface dark:bg-surface-dark-secondary hover:bg-gray-100 dark:hover:bg-surface-dark-tertiary transition-colors cursor-pointer">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">View All Activity</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
