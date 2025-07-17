import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Heart, MessageCircle, Trophy, Clock, AlertCircle, Settings } from 'lucide-react';
import { useGlobalContext } from '../contexts/GlobalContext';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import socketService from '../services/socket';

const NotificationCenter: React.FC = () => {
  const { addNotification } = useGlobalContext();
  const { user: authUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'achievements' | 'community'>('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load notifications from backend
  const loadNotifications = async () => {
    if (!authUser) return;

    try {
      setIsLoading(true);
      const response = await apiService.get(`/users/${authUser.id}/notifications`);
      if (response.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark notification as read
  const markNotificationRead = async (notificationId: string) => {
    try {
      const response = await apiService.put(`/users/${authUser.id}/notifications/${notificationId}/read`);
      if (response.success) {
        setNotifications(prev => prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  // Load notifications on component mount and when user changes
  useEffect(() => {
    if (authUser) {
      loadNotifications();
    }
  }, [authUser]);

  // Setup real-time notification updates
  useEffect(() => {
    if (!authUser) return;

    // Listen for real-time notifications
    socketService.on('notification_received', (data: any) => {
      console.log('🔔 New notification received:', data);
      setNotifications(prev => [data.notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    // Cleanup on unmount
    return () => {
      socketService.off('notification_received');
    };
  }, [authUser]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment': return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'achievement': return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'reminder': return <Clock className="h-4 w-4 text-purple-500" />;
      case 'system': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'achievements') return notification.type === 'achievement';
    if (filter === 'community') return ['like', 'comment', 'reply'].includes(notification.type);
    return true;
  });

  const markAllAsRead = async () => {
    if (!authUser) return;

    try {
      const response = await apiService.put(`/users/${authUser.id}/notifications/mark-all-read`);
      if (response.success) {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    if (!authUser) return;

    try {
      // For now, just mark all as read since there's no clear all endpoint
      await markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('❌ Error clearing notifications:', error);
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Clear all
                      </button>
                    )}
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'unread', label: 'Unread' },
                    { key: 'achievements', label: 'Achievements' },
                    { key: 'community', label: 'Community' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key as any)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        filter === tab.key
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredNotifications.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => {
                          markNotificationRead(notification._id);
                          if (notification.actionUrl) {
                            // Navigate to action URL
                            window.location.hash = notification.actionUrl;
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No notifications</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {filter === 'unread' 
                        ? "You're all caught up!" 
                        : "We'll notify you when something happens"}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 py-2 rounded-lg hover:bg-white transition-colors">
                  <Settings className="h-4 w-4" />
                  Notification Settings
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
