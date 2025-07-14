import React from 'react';

// Real-time synchronization service
// This simulates WebSocket/Server-Sent Events for real-time updates

export interface SyncEvent {
  type: 'community_post' | 'resource' | 'partner' | 'ngo';
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  data: any;
  timestamp: number;
  adminId?: string;
}

export interface SyncSubscriber {
  id: string;
  callback: (event: SyncEvent) => void;
  filters?: string[]; // Optional filters for event types
}

class RealTimeSyncService {
  private subscribers: Map<string, SyncSubscriber> = new Map();
  private eventQueue: SyncEvent[] = [];
  private isProcessing = false;
  private processingInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start processing events every 2 seconds for demo
    this.startProcessing();
  }

  // Subscribe to real-time updates
  subscribe(subscriber: SyncSubscriber): () => void {
    this.subscribers.set(subscriber.id, subscriber);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(subscriber.id);
    };
  }

  // Emit an event (called by admin actions)
  emit(event: Omit<SyncEvent, 'timestamp'>): void {
    const fullEvent: SyncEvent = {
      ...event,
      timestamp: Date.now()
    };
    
    this.eventQueue.push(fullEvent);
    console.log('🔄 Real-time event emitted:', fullEvent);
  }

  // Process queued events and notify subscribers
  private processEvents(): void {
    if (this.isProcessing || this.eventQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!;
      this.notifySubscribers(event);
    }
    
    this.isProcessing = false;
  }

  // Notify all relevant subscribers
  private notifySubscribers(event: SyncEvent): void {
    this.subscribers.forEach(subscriber => {
      // Check if subscriber has filters
      if (subscriber.filters && !subscriber.filters.includes(event.type)) {
        return;
      }
      
      try {
        subscriber.callback(event);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  // Start the processing loop
  private startProcessing(): void {
    if (this.processingInterval) return;
    
    this.processingInterval = setInterval(() => {
      this.processEvents();
    }, 2000); // Process every 2 seconds
  }

  // Stop the processing loop
  stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  // Get current subscriber count
  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  // Get pending events count
  getPendingEventsCount(): number {
    return this.eventQueue.length;
  }

  // Clear all events (for testing)
  clearEvents(): void {
    this.eventQueue = [];
  }

  // Get event history (last 50 events for debugging)
  private eventHistory: SyncEvent[] = [];
  
  getEventHistory(): SyncEvent[] {
    return [...this.eventHistory].reverse(); // Most recent first
  }

  private addToHistory(event: SyncEvent): void {
    this.eventHistory.push(event);
    if (this.eventHistory.length > 50) {
      this.eventHistory.shift(); // Keep only last 50 events
    }
  }
}

// Singleton instance
export const realTimeSyncService = new RealTimeSyncService();

// Helper functions for common operations
export const syncHelpers = {
  // Community post events
  communityPostCreated: (post: any, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'community_post',
      action: 'create',
      data: post,
      adminId
    });
  },

  communityPostUpdated: (post: any, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'community_post',
      action: 'update',
      data: post,
      adminId
    });
  },

  communityPostDeleted: (postId: string, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'community_post',
      action: 'delete',
      data: { id: postId },
      adminId
    });
  },

  communityPostPublished: (post: any, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'community_post',
      action: 'publish',
      data: post,
      adminId
    });
  },

  // Resource events
  resourceCreated: (resource: any, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'resource',
      action: 'create',
      data: resource,
      adminId
    });
  },

  resourceUpdated: (resource: any, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'resource',
      action: 'update',
      data: resource,
      adminId
    });
  },

  resourceDeleted: (resourceId: string, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'resource',
      action: 'delete',
      data: { id: resourceId },
      adminId
    });
  },

  resourcePublished: (resource: any, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'resource',
      action: 'publish',
      data: resource,
      adminId
    });
  },

  // Partner events
  partnerCreated: (partner: any, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'partner',
      action: 'create',
      data: partner,
      adminId
    });
  },

  partnerUpdated: (partner: any, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'partner',
      action: 'update',
      data: partner,
      adminId
    });
  },

  partnerDeleted: (partnerId: string, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'partner',
      action: 'delete',
      data: { id: partnerId },
      adminId
    });
  },

  // NGO events
  ngoCreated: (ngo: any, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'ngo',
      action: 'create',
      data: ngo,
      adminId
    });
  },

  ngoUpdated: (ngo: any, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'ngo',
      action: 'update',
      data: ngo,
      adminId
    });
  },

  ngoDeleted: (ngoId: string, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'ngo',
      action: 'delete',
      data: { id: ngoId },
      adminId
    });
  },

  // User management events
  userRoleChanged: (userId: string, newRole: string, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'user',
      action: 'role_change',
      data: { userId, newRole },
      adminId
    });
  },

  userStatusChanged: (userId: string, isActive: boolean, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'user',
      action: 'status_change',
      data: { userId, isActive },
      adminId
    });
  },

  userDeleted: (userId: string, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'user',
      action: 'delete',
      data: { userId },
      adminId
    });
  },

  // Settings events
  settingsUpdated: (settings: any, adminId?: string) => {
    realTimeSyncService.emit({
      type: 'settings',
      action: 'update',
      data: settings,
      adminId
    });
  }
};

// React hook for using real-time sync
export const useRealTimeSync = (
  eventTypes?: string[],
  onEvent?: (event: SyncEvent) => void
) => {
  const [isConnected, setIsConnected] = React.useState(true);
  const [eventCount, setEventCount] = React.useState(0);
  const [lastEvent, setLastEvent] = React.useState<SyncEvent | null>(null);

  React.useEffect(() => {
    const subscriberId = `subscriber_${Date.now()}_${Math.random()}`;
    
    const unsubscribe = realTimeSyncService.subscribe({
      id: subscriberId,
      filters: eventTypes,
      callback: (event) => {
        setEventCount(prev => prev + 1);
        setLastEvent(event);
        if (onEvent) {
          onEvent(event);
        }
      }
    });

    return unsubscribe;
  }, [eventTypes, onEvent]);

  return {
    isConnected,
    eventCount,
    lastEvent,
    subscriberCount: realTimeSyncService.getSubscriberCount(),
    pendingEvents: realTimeSyncService.getPendingEventsCount()
  };
};

export default realTimeSyncService;
