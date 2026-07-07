'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Bell, 
  CheckCircle, 
  Trash2, 
  AlertCircle, 
  Clock, 
  UserPlus, 
  CreditCard,
  Settings,
  MoreVertical,
  Filter,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

const getNotificationInfo = (message: string) => {
  const msg = message.toLowerCase();
  if (msg.includes('check-in') || msg.includes('check in')) {
    return { title: 'Guest Check-In', icon: UserPlus, color: 'text-green-500', bg: 'bg-green-50', category: 'Bookings' };
  }
  if (msg.includes('check-out') || msg.includes('check out')) {
    return { title: 'Guest Check-Out', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', category: 'Bookings' };
  }
  if (msg.includes('reservation') || msg.includes('booking')) {
    return { title: 'New Reservation', icon: UserPlus, color: 'text-indigo-500', bg: 'bg-indigo-50', category: 'Bookings' };
  }
  if (msg.includes('payment failed') || msg.includes('failed payment')) {
    return { title: 'Payment Failed', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', category: 'Payments' };
  }
  if (msg.includes('payment') || msg.includes('received')) {
    return { title: 'Payment Confirmed', icon: CreditCard, color: 'text-green-500', bg: 'bg-green-50', category: 'Payments' };
  }
  if (msg.includes('low stock') || msg.includes('stock alert') || msg.includes('quantity')) {
    return { title: 'Inventory Stock Alert', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50', category: 'Inventory' };
  }
  return { title: 'System Notification', icon: Bell, color: 'text-gray-500', bg: 'bg-gray-50', category: 'System' };
};

const formatTime = (dateStr: string) => {
  if (!dateStr) return 'Just now';
  const date = new Date(dateStr);
  const diffMs = new Date().getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  return date.toLocaleDateString();
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      const data = response.data?.data ?? response.data ?? [];
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const deleteNotification = (id: number) => {
    // Backend doesn't support delete, so we filter it out locally
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.is_read);
      await Promise.all(unread.map(n => api.put(`/notifications/${n.id}/read`)));
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Filter notifications based on category
  const filteredNotifications = notifications.filter(n => {
    if (activeCategory === 'All') return true;
    const info = getNotificationInfo(n.message);
    return info.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Notifications</h1>
          <p className="text-gray-500 text-sm">Stay updated with the latest activities across the hotel.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="bg-white text-secondary border border-gray-100 px-6 py-3 rounded-2xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
            Mark all as read
          </button>
        </div>
      </div>

      {/* Notification Categories */}
      <div className="flex flex-wrap gap-4 mb-8">
        {['All', 'Bookings', 'Payments', 'Inventory', 'System'].map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeCategory === cat 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white text-gray-500 border border-gray-50 hover:bg-gray-50'
            }`}
          >
            {cat} {cat === 'All' && unreadCount > 0 && <span className="ml-1 bg-white/20 px-1.5 rounded-md">{unreadCount}</span>}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4 max-w-4xl">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-[32px] p-6 h-32 animate-pulse" />
          ))
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((notification, index) => {
              const info = getNotificationInfo(notification.message);
              const Icon = info.icon;
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group bg-white p-6 rounded-[32px] border border-gray-50 hover:shadow-premium transition-all relative ${!notification.is_read ? 'border-l-4 border-l-primary' : ''}`}
                >
                  <div className="flex gap-6">
                    <div className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center ${info.bg} ${info.color}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`text-lg font-bold ${notification.is_read ? 'text-secondary/70' : 'text-secondary'}`}>
                          {info.title}
                        </h3>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatTime(notification.created_at)}</span>
                      </div>
                      <p className={`text-sm leading-relaxed mb-4 ${notification.is_read ? 'text-gray-400' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <div className="flex gap-4">
                        {!notification.is_read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline"
                          >
                            <Check className="h-3 w-3" /> Mark as read
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {!loading && filteredNotifications.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[40px] border border-gray-50">
            <div className="h-20 w-20 bg-accent/30 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">No notifications yet</h3>
            <p className="text-gray-500">We'll notify you when something important happens in this category.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
