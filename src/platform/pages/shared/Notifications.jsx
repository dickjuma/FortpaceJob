import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Briefcase, DollarSign, MessageSquare, 
  Star, TrendingUp, CheckCircle2, Circle, 
  Settings, Loader2, ArrowRight
} from 'lucide-react';
import { api } from '../../common/services/api';
import { websocketService } from '../../common/services/websocket.service';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const categories = ['All', 'Contracts', 'Payments', 'Messages', 'Reviews', 'Ranking'];

  useEffect(() => {
    loadNotifications();
    const socket = websocketService.socket;
    if (socket) {
      const handleNewNotification = (data) => {
        setNotifications(prev => [data, ...prev]);
      };
      socket.on('NOTIFICATION_CREATED', handleNewNotification);
      return () => {
        socket.off('NOTIFICATION_CREATED', handleNewNotification);
      };
    }
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/notifications');
      setNotifications(data.data || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const loadMore = async () => {
    setIsLoadingMore(true);
    try {
      // Would fetch next page in real implementation
    } finally {
      setIsLoadingMore(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIconAndColor = (type) => {
    const map = {
      Contracts: { icon: Briefcase, color: 'text-[#4C1D95]', bg: 'bg-[#4C1D95]/5' },
      Payments: { icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
      Messages: { icon: MessageSquare, color: 'text-[#4C1D95]', bg: 'bg-[#4C1D95]/5' },
      Reviews: { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
      Ranking: { icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    };
    return map[type] || map.Contracts;
  };

  const filteredNotifications = activeCategory === 'All' 
    ? notifications 
    : notifications.filter(n => (n.category || n.type) === activeCategory);

  const groupedNotifications = {
    'New': filteredNotifications.filter(n => !n.read),
    'Earlier': filteredNotifications.filter(n => n.read)
  };

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading notifications...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-8 h-8 text-[#4C1D95]" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-zinc-50 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">Notifications</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Stay updated on your marketplace activity.</p>
          </div>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-semibold text-[#4C1D95] bg-[#4C1D95]/5 rounded-lg hover:bg-[#4C1D95]/10 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
        {categories.map((category) => (
          <button key={category} onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === category ? 'bg-surface-dark text-white shadow-md' : 'bg-white text-zinc-600 border border-zinc-200'
            }`}>
            {category}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm overflow-hidden">
        {Object.entries(groupedNotifications).map(([group, items]) => {
          if (items.length === 0) return null;
          
          return (
            <div key={group} className="mb-4 last:mb-0">
              <div className="px-6 py-3 bg-surface border-b border-zinc-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">{group}</h3>
              </div>
              
              <div className="divide-y divide-zinc-100">
                <AnimatePresence>
                  {items.map((notification) => {
                    const { icon: Icon, color, bg } = getIconAndColor(notification.category || notification.type);
                    return (
                      <motion.div key={notification.id} initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-6 flex gap-4 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-[#4C1D95]/5' : 'hover:bg-surface'
                        }`}>
                        {!notification.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4C1D95]" />
                        )}
                        
                        <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${bg}`}>
                          <Icon className={`w-6 h-6 ${color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <h4 className={`text-base font-bold truncate ${
                              !notification.read ? 'text-zinc-900' : 'text-zinc-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs font-semibold text-zinc-400">{notification.time}</span>
                          </div>
                          
                          <p className={`text-sm mb-3 ${
                            !notification.read ? 'text-zinc-700 font-medium' : 'text-zinc-500'
                          }`}>
                            {notification.message || notification.body}
                          </p>
                          
                          <button className="text-sm font-bold text-[#4C1D95] flex items-center gap-1">
                            View <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="shrink-0 pt-1">
                          {!notification.read ? (
                            <div className="w-3 h-3 bg-[#4C1D95] rounded-full" />
                          ) : (
                            <Circle className="w-3 h-3 text-zinc-300" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          );
        })}

        {filteredNotifications.length === 0 && (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
            <h3 className="text-lg font-bold text-zinc-900 mb-2">You're all caught up!</h3>
            <p className="text-zinc-500">No notifications in this category.</p>
          </div>
        )}
      </div>

      {filteredNotifications.length > 0 && (
        <div className="flex justify-center pt-4">
          <button onClick={loadMore} disabled={isLoadingMore}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 text-sm font-bold rounded-xl hover:bg-zinc-50">
            {isLoadingMore ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
            ) : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};