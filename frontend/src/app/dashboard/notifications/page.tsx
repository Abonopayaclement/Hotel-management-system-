'use client';

import React, { useState } from 'react';
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

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, title: 'New Booking Received', message: 'John Anderson booked Room 201 for 3 nights.', type: 'booking', time: '2 mins ago', read: false, icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 2, title: 'Payment Confirmed', message: 'Payment of GH₵750 received for RES001.', type: 'payment', time: '15 mins ago', read: false, icon: CreditCard, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 3, title: 'Housekeeping Alert', message: 'Room 304 is marked as Dirty after checkout.', type: 'housekeeping', time: '1 hour ago', read: true, icon: Settings, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 4, title: 'Low Stock Warning', message: 'Cotton Towels are below minimum stock level.', type: 'inventory', time: '2 hours ago', read: false, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 5, title: 'Guest Checked Out', message: 'Sarah Williams checked out from Room 305.', type: 'guest', time: '4 hours ago', read: true, icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50' },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
            className="bg-white text-secondary border border-gray-100 px-6 py-3 rounded-2xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Mark all as read
          </button>
        </div>
      </div>

      {/* Notification Categories */}
      <div className="flex flex-wrap gap-4 mb-8">
        {['All', 'Bookings', 'Payments', 'Inventory', 'System'].map((cat) => (
          <button key={cat} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            cat === 'All' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-gray-500 border border-gray-50 hover:bg-gray-50'
          }`}>
            {cat} {cat === 'All' && unreadCount > 0 && <span className="ml-1 bg-white/20 px-1.5 rounded-md">{unreadCount}</span>}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4 max-w-4xl">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`group bg-white p-6 rounded-[32px] border border-gray-50 hover:shadow-premium transition-all relative ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex gap-6">
                <div className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center ${notification.bg} ${notification.color}`}>
                  <notification.icon className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-lg font-bold ${notification.read ? 'text-secondary/70' : 'text-secondary'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{notification.time}</span>
                  </div>
                  <p className={`text-sm leading-relaxed mb-4 ${notification.read ? 'text-gray-400' : 'text-gray-600'}`}>
                    {notification.message}
                  </p>
                  <div className="flex gap-4">
                    {!notification.read && (
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
              
              <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-gray-50 rounded-xl text-gray-400">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[40px] border border-gray-50">
            <div className="h-20 w-20 bg-accent/30 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">No notifications yet</h3>
            <p className="text-gray-500">We'll notify you when something important happens.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
