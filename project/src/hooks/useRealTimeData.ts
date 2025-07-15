import { useState, useEffect, useCallback } from 'react';
import { useUserData } from '../context/UserDataContext';

export interface RealTimeStatus {
  isConnected: boolean;
  lastUpdate: Date | null;
  updateCount: number;
  error: string | null;
}

export const useRealTimeData = (updateInterval: number = 30000) => {
  const { refreshData, lastUpdated, isLoading } = useUserData();
  const [status, setStatus] = useState<RealTimeStatus>({
    isConnected: true,
    lastUpdate: null,
    updateCount: 0,
    error: null
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setStatus(prev => ({ ...prev, isConnected: true, error: null }));
      // Refresh data when coming back online
      refreshData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setStatus(prev => ({ 
        ...prev, 
        isConnected: false, 
        error: 'No internet connection' 
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshData]);

  // Auto-refresh data at specified intervals
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(async () => {
      try {
        await refreshData();
        setStatus(prev => ({
          ...prev,
          lastUpdate: new Date(),
          updateCount: prev.updateCount + 1,
          error: null
        }));
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Update failed'
        }));
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [refreshData, updateInterval, isOnline]);

  // Update status when lastUpdated changes
  useEffect(() => {
    if (lastUpdated) {
      setStatus(prev => ({
        ...prev,
        lastUpdate: lastUpdated
      }));
    }
  }, [lastUpdated]);

  const forceRefresh = useCallback(async () => {
    if (!isOnline) {
      setStatus(prev => ({
        ...prev,
        error: 'Cannot refresh while offline'
      }));
      return;
    }

    try {
      await refreshData();
      setStatus(prev => ({
        ...prev,
        lastUpdate: new Date(),
        updateCount: prev.updateCount + 1,
        error: null
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Refresh failed'
      }));
    }
  }, [refreshData, isOnline]);

  const getConnectionStatus = useCallback(() => {
    if (!isOnline) return 'offline';
    if (isLoading) return 'updating';
    if (status.error) return 'error';
    return 'connected';
  }, [isOnline, isLoading, status.error]);

  const getLastUpdateText = useCallback(() => {
    if (!status.lastUpdate) return 'Never updated';
    
    const now = new Date();
    const diff = now.getTime() - status.lastUpdate.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return status.lastUpdate.toLocaleDateString();
  }, [status.lastUpdate]);

  return {
    status,
    isOnline,
    isLoading,
    connectionStatus: getConnectionStatus(),
    lastUpdateText: getLastUpdateText(),
    forceRefresh,
    updateCount: status.updateCount
  };
};

// Hook for component-specific real-time updates
export const useComponentRealTime = (
  componentName: string,
  updateCallback?: () => void,
  dependencies: any[] = []
) => {
  const { status, forceRefresh } = useRealTimeData();
  const [componentUpdateCount, setComponentUpdateCount] = useState(0);

  useEffect(() => {
    if (updateCallback) {
      updateCallback();
    }
    setComponentUpdateCount(prev => prev + 1);
  }, [status.updateCount, ...dependencies]);

  return {
    componentUpdateCount,
    lastUpdate: status.lastUpdate,
    forceRefresh,
    isConnected: status.isConnected
  };
};

// Utility function to format real-time timestamps
export const formatRealTimeTimestamp = (timestamp: number | Date): string => {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  
  return date.toLocaleDateString();
};

// Hook for real-time notifications
export const useRealTimeNotifications = () => {
  const { communityActivity, upcomingEvents } = useUserData();
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'community' | 'event' | 'mood' | 'session';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>>([]);

  useEffect(() => {
    // Check for new community activity
    const recentActivity = communityActivity.filter(activity => 
      new Date(activity.timestamp) > new Date(Date.now() - 3600000) // Last hour
    );

    // Check for upcoming events
    const soonEvents = upcomingEvents.filter(event => {
      const eventTime = new Date(`${event.date} ${event.time}`);
      const timeDiff = eventTime.getTime() - Date.now();
      return timeDiff > 0 && timeDiff < 3600000; // Next hour
    });

    const newNotifications = [
      ...recentActivity.map(activity => ({
        id: `community-${activity.id}`,
        type: 'community' as const,
        title: 'New Community Activity',
        message: `${activity.author}: ${activity.title}`,
        timestamp: new Date(activity.timestamp),
        read: false
      })),
      ...soonEvents.map(event => ({
        id: `event-${event.id}`,
        type: 'event' as const,
        title: 'Upcoming Event',
        message: `${event.title} starts in less than an hour`,
        timestamp: new Date(),
        read: false
      }))
    ];

    setNotifications(prev => {
      const existingIds = prev.map(n => n.id);
      const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
      return [...prev, ...uniqueNew].slice(0, 10); // Keep only last 10
    });
  }, [communityActivity, upcomingEvents]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll
  };
};
