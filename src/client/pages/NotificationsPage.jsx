import React, { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, DollarSign, Briefcase, MessageSquare, Star, Info, Check, Trash2, RefreshCw } from 'lucide-react';
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from '../services/clientHooks';
import toast, { Toaster } from 'react-hot-toast';

const TYPE_ICONS = {
  PAYMENT:   { icon: DollarSign, color: 'text-success bg-success/10' },
  JOB:       { icon: Briefcase,  color: 'text-success bg-success/10' },
  CONTRACT:  { icon: CheckCircle,color: 'text-blue-400 bg-blue-400/10' },
  REVIEW:    { icon: Star,       color: 'text-orange-400 bg-orange-400/10' },
  PROPOSAL:  { icon: Briefcase,  color: 'text-#14a800] bg-#14a800]/10' },
  DISPUTE:   { icon: AlertCircle,color: 'text-red-400 bg-red-400/10' },
  MILESTONE: { icon: CheckCircle,color: 'text-success bg-success/10' },
  MESSAGE:   { icon: MessageSquare, color: 'text-blue-400 bg-blue-400/10' },
  SYSTEM:    { icon: Info,       color: 'text-zinc-400 bg-zinc-800' },
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

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);

  const filters = {
    page, limit: 15,
    ...(activeTab === 'Unread' ? { unread: true } : activeTab !== 'All' ? { type: activeTab } : {}),
  };

  const { data, isLoading, error, refetch } = useNotifications(filters);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllRead();

  const notifications = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (notifId) => {
    try { await markRead.mutateAsync(notifId); } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6 overflow-y-auto custom-scrollbar">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-success" />
              Notifications
              {unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-success text-white text-xs font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">{total} total notifications</p>
          </div>
          <div className="flex gap-2">
            <button onClick={refetch} className="p-2 text-zinc-400 hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
            {unreadCount > 0 && (
              <button onClick={() => markAll.mutateAsync()} disabled={markAll.isPending}
                className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-xs font-bold transition-colors disabled:opacity-50">
                <Check className="w-3.5 h-3.5" /> Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Tab Filter */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                activeTab === tab ? 'bg-success text-white border-success' : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500'
              }`}>{tab}</button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-20 bg-zinc-900/40 rounded-2xl animate-pulse" />)}</div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3">
            <AlertCircle className="w-10 h-10 text-red-400 opacity-60" />
            <p className="text-zinc-400 text-sm">Failed to load notifications. <button onClick={refetch} className="text-success underline">Retry</button></p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-4 bg-zinc-900/30 rounded-2xl border border-zinc-800">
            <Bell className="w-12 h-12 text-zinc-600" />
            <p className="text-zinc-400">No notifications found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(notif => {
              const typeInfo = TYPE_ICONS[notif.type] || TYPE_ICONS.SYSTEM;
              const Icon = typeInfo.icon;
              return (
                <div
                  key={notif.id}
                  className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-colors cursor-default ${
                    !notif.isRead
                      ? 'bg-success/5 border-success/20 hover:border-success/30'
                      : 'bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700'
                  }`}
                >
                  {/* Unread dot */}
                  {!notif.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-success" />
                  )}

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeInfo.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <p className={`text-sm font-bold ${notif.isRead ? 'text-zinc-300' : 'text-white'}`}>{notif.title}</p>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{notif.message}</p>
                    <p className="text-[10px] text-zinc-600 mt-1.5">{timeAgo(notif.createdAt)}</p>
                  </div>

                  {/* Mark read */}
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="shrink-0 p-1.5 rounded-lg text-zinc-500 hover:text-success hover:bg-success/10 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 disabled:opacity-40 hover:bg-zinc-700 transition-colors">Previous</button>
            <span className="text-sm text-zinc-400">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 disabled:opacity-40 hover:bg-zinc-700 transition-colors">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
