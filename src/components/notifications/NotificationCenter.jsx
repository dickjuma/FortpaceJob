import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, FileText, AlertTriangle, DollarSign, X, MessageSquare, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useChatStore from '../../store/chatStore';

// Map notification type → icon & colour
const TYPE_STYLE = {
  payment:      { icon: DollarSign,    colour: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20' },
  message:      { icon: MessageSquare, colour: 'text-[#4C1D95] bg-[#4C1D95]/10' },
  contract:     { icon: FileText,      colour: 'text-[#4C1D95] bg-[#4C1D95]/10' },
  job:          { icon: Briefcase,     colour: 'text-[#4C1D95] bg-[#4C1D95]/10' },
  milestone:    { icon: CheckCircle,   colour: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20' },
  alert:        { icon: AlertTriangle, colour: 'text-amber-500 bg-amber-100 dark:bg-amber-500/20' },
  default:      { icon: Bell,          colour: 'text-gray-500 bg-gray-100 dark:bg-gray-800' },
};

function getTypeStyle(type = '') {
  const key = (type || '').toLowerCase();
  return TYPE_STYLE[key] || TYPE_STYLE.default;
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  <  1) return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NotificationCenter({ isOpen, onClose }) {
  const navigate = useNavigate();
  const notifications         = useChatStore((s) => s.notifications);
  const markNotificationRead  = useChatStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useChatStore((s) => s.markAllNotificationsRead);

  if (!isOpen) return null;

  // Show latest 10 in the dropdown
  const recent = notifications.slice(0, 10);

  const handleViewAll = () => {
    onClose?.();
    navigate('/notifications');
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
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-surface-dark-border bg-surface dark:bg-surface-dark-secondary">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
              <Bell className="w-4 h-4 mr-2" /> Notifications
            </h3>
            <div className="flex gap-3">
              {notifications.some((n) => !n.isRead) && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs font-medium text-[#4C1D95] hover:underline"
                >
                  Mark all read
                </button>
              )}
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {recent.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-surface-dark-border">
                {recent.map((notif) => {
                  const { icon: Icon, colour } = getTypeStyle(notif.type);
                  return (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-4 hover:bg-surface dark:hover:bg-surface-dark-secondary transition-colors cursor-pointer flex gap-4 ${
                        !notif.isRead ? 'bg-[#4C1D95]/5 dark:bg-[#4C1D95]/10' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colour}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm font-bold truncate ${!notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {notif.title || notif.type || 'Notification'}
                          </p>
                          <span className="text-xs text-gray-400 shrink-0 ml-2">
                            {timeAgo(notif.createdAt || notif.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {notif.message || notif.body || notif.text || ''}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-[#4C1D95] mt-2 shrink-0" />
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

          {/* Footer */}
          <div
            onClick={handleViewAll}
            className="p-3 border-t border-gray-100 dark:border-surface-dark-border text-center bg-surface dark:bg-surface-dark-secondary hover:bg-gray-100 dark:hover:bg-surface-dark-tertiary transition-colors cursor-pointer"
          >
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">View All Activity</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
