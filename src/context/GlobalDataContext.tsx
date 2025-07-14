import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { realTimeSyncService, SyncEvent } from '../services/RealTimeSync';
import { persistenceHelpers } from '../services/DataPersistence';

// Global data that both users and admins can see
export interface GlobalCommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'support' | 'discussion' | 'announcement' | 'milestone';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  replies: number;
  isPublished: boolean;
}

export interface GlobalResource {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'self-care' | 'therapy' | 'crisis' | 'education' | 'tools';
  type: 'article' | 'video' | 'audio' | 'pdf' | 'external-link';
  url?: string;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  rating: number;
  isPublished: boolean;
}

export interface GlobalPartner {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  contactEmail: string;
  contactPhone?: string;
  services: string[];
  location: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalNGO {
  id: string;
  name: string;
  description: string;
  mission: string;
  logo: string;
  website: string;
  contactEmail: string;
  contactPhone?: string;
  address: string;
  services: string[];
  focusAreas: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalDataContextType {
  // Published content that users can see
  publishedCommunityPosts: GlobalCommunityPost[];
  publishedResources: GlobalResource[];
  activePartners: GlobalPartner[];
  activeNGOs: GlobalNGO[];
  
  // Real-time update functions
  refreshGlobalData: () => Promise<void>;
  subscribeToUpdates: (callback: () => void) => () => void;
  
  // User interaction functions
  likePost: (postId: string) => Promise<void>;
  viewResource: (resourceId: string) => Promise<void>;
  
  // Real-time status
  isLoading: boolean;
  lastUpdated: Date | null;
  updateCount: number;
}

const GlobalDataContext = createContext<GlobalDataContextType | null>(null);

export const GlobalDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  
  // Global data state
  const [publishedCommunityPosts, setPublishedCommunityPosts] = useState<GlobalCommunityPost[]>([]);
  const [publishedResources, setPublishedResources] = useState<GlobalResource[]>([]);
  const [activePartners, setActivePartners] = useState<GlobalPartner[]>([]);
  const [activeNGOs, setActiveNGOs] = useState<GlobalNGO[]>([]);
  
  // Subscribers for real-time updates
  const [updateSubscribers, setUpdateSubscribers] = useState<Set<() => void>>(new Set());

  // Load global data when user logs in
  useEffect(() => {
    if (user) {
      loadGlobalData();

      // Subscribe to real-time updates
      const unsubscribe = realTimeSyncService.subscribe({
        id: `global_data_${user.id}`,
        callback: handleRealTimeEvent
      });

      // Set up periodic refresh as fallback
      const interval = setInterval(refreshGlobalData, 30000);

      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    } else {
      clearGlobalData();
    }
  }, [user]);

  const loadGlobalData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadPublishedCommunityPosts(),
        loadPublishedResources(),
        loadActivePartners(),
        loadActiveNGOs()
      ]);
      setLastUpdated(new Date());
      setUpdateCount(prev => prev + 1);
      notifySubscribers();
    } catch (error) {
      console.error('Error loading global data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPublishedCommunityPosts = async () => {
    try {
      const data = persistenceHelpers.loadAllData();
      const publishedPosts = data.communityPosts.filter(post => post.isPublished);
      setPublishedCommunityPosts(publishedPosts);
      console.log('📂 Loaded published community posts:', publishedPosts.length);
    } catch (error) {
      console.error('❌ Error loading published community posts:', error);
      setPublishedCommunityPosts([]);
    }
  };

  const loadPublishedResources = async () => {
    try {
      const data = persistenceHelpers.loadAllData();
      const publishedResources = data.resources.filter(resource => resource.isPublished);
      setPublishedResources(publishedResources);
      console.log('📂 Loaded published resources:', publishedResources.length);
    } catch (error) {
      console.error('❌ Error loading published resources:', error);
      setPublishedResources([]);
    }
  };

  const loadActivePartners = async () => {
    try {
      const data = persistenceHelpers.loadAllData();
      const activePartners = data.partners.filter(partner => partner.isActive);
      setActivePartners(activePartners);
      console.log('📂 Loaded active partners:', activePartners.length);
    } catch (error) {
      console.error('❌ Error loading active partners:', error);
      setActivePartners([]);
    }
  };

  const loadActiveNGOs = async () => {
    try {
      const data = persistenceHelpers.loadAllData();
      const activeNGOs = data.ngos.filter(ngo => ngo.isActive);
      setActiveNGOs(activeNGOs);
      console.log('📂 Loaded active NGOs:', activeNGOs.length);
    } catch (error) {
      console.error('❌ Error loading active NGOs:', error);
      setActiveNGOs([]);
    }
  };

  const clearGlobalData = () => {
    setPublishedCommunityPosts([]);
    setPublishedResources([]);
    setActivePartners([]);
    setActiveNGOs([]);
    setLastUpdated(null);
    setUpdateCount(0);
  };

  const refreshGlobalData = useCallback(async () => {
    if (!user) return;
    await loadGlobalData();
  }, [user]);

  const subscribeToUpdates = useCallback((callback: () => void) => {
    setUpdateSubscribers(prev => new Set(prev).add(callback));
    
    return () => {
      setUpdateSubscribers(prev => {
        const newSet = new Set(prev);
        newSet.delete(callback);
        return newSet;
      });
    };
  }, []);

  const notifySubscribers = () => {
    updateSubscribers.forEach(callback => callback());
  };

  // Handle real-time events from admin
  const handleRealTimeEvent = useCallback((event: SyncEvent) => {
    console.log('🔄 Received real-time event:', event);

    switch (event.type) {
      case 'community_post':
        handleCommunityPostEvent(event);
        break;
      case 'resource':
        handleResourceEvent(event);
        break;
      case 'partner':
        handlePartnerEvent(event);
        break;
      case 'ngo':
        handleNGOEvent(event);
        break;
    }

    setLastUpdated(new Date());
    setUpdateCount(prev => prev + 1);
    notifySubscribers();
  }, []);

  const handleCommunityPostEvent = (event: SyncEvent) => {
    const { action, data } = event;

    switch (action) {
      case 'create':
      case 'publish':
        if (data.isPublished) {
          setPublishedCommunityPosts(prev => {
            const exists = prev.find(post => post.id === data.id);
            let updatedPosts;
            if (exists) {
              updatedPosts = prev.map(post => post.id === data.id ? data : post);
            } else {
              updatedPosts = [data, ...prev];
            }
            return updatedPosts;
          });
        }
        break;
      case 'update':
        if (data.isPublished) {
          setPublishedCommunityPosts(prev => {
            const updatedPosts = prev.map(post => post.id === data.id ? data : post);
            return updatedPosts;
          });
        } else {
          // Remove from published if unpublished
          setPublishedCommunityPosts(prev => {
            const updatedPosts = prev.filter(post => post.id !== data.id);
            return updatedPosts;
          });
        }
        break;
      case 'delete':
        setPublishedCommunityPosts(prev => {
          const updatedPosts = prev.filter(post => post.id !== data.id);
          return updatedPosts;
        });
        break;
    }
  };

  const handleResourceEvent = (event: SyncEvent) => {
    const { action, data } = event;

    switch (action) {
      case 'create':
      case 'publish':
        if (data.isPublished) {
          setPublishedResources(prev => {
            const exists = prev.find(resource => resource.id === data.id);
            if (exists) {
              return prev.map(resource => resource.id === data.id ? data : resource);
            }
            return [data, ...prev];
          });
        }
        break;
      case 'update':
        if (data.isPublished) {
          setPublishedResources(prev =>
            prev.map(resource => resource.id === data.id ? data : resource)
          );
        } else {
          setPublishedResources(prev =>
            prev.filter(resource => resource.id !== data.id)
          );
        }
        break;
      case 'delete':
        setPublishedResources(prev =>
          prev.filter(resource => resource.id !== data.id)
        );
        break;
    }
  };

  const handlePartnerEvent = (event: SyncEvent) => {
    const { action, data } = event;

    switch (action) {
      case 'create':
        if (data.isActive) {
          setActivePartners(prev => [data, ...prev]);
        }
        break;
      case 'update':
        if (data.isActive) {
          setActivePartners(prev => {
            const exists = prev.find(partner => partner.id === data.id);
            if (exists) {
              return prev.map(partner => partner.id === data.id ? data : partner);
            }
            return [data, ...prev];
          });
        } else {
          setActivePartners(prev =>
            prev.filter(partner => partner.id !== data.id)
          );
        }
        break;
      case 'delete':
        setActivePartners(prev =>
          prev.filter(partner => partner.id !== data.id)
        );
        break;
    }
  };

  const handleNGOEvent = (event: SyncEvent) => {
    const { action, data } = event;

    switch (action) {
      case 'create':
        if (data.isActive) {
          setActiveNGOs(prev => [data, ...prev]);
        }
        break;
      case 'update':
        if (data.isActive) {
          setActiveNGOs(prev => {
            const exists = prev.find(ngo => ngo.id === data.id);
            if (exists) {
              return prev.map(ngo => ngo.id === data.id ? data : ngo);
            }
            return [data, ...prev];
          });
        } else {
          setActiveNGOs(prev =>
            prev.filter(ngo => ngo.id !== data.id)
          );
        }
        break;
      case 'delete':
        setActiveNGOs(prev =>
          prev.filter(ngo => ngo.id !== data.id)
        );
        break;
    }
  };

  const likePost = async (postId: string) => {
    // Optimistic update
    setPublishedCommunityPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
    
    // In real app, make API call here
    notifySubscribers();
  };

  const viewResource = async (resourceId: string) => {
    // Optimistic update
    setPublishedResources(prev => 
      prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, views: resource.views + 1 }
          : resource
      )
    );
    
    // In real app, make API call here
    notifySubscribers();
  };

  const value: GlobalDataContextType = {
    publishedCommunityPosts,
    publishedResources,
    activePartners,
    activeNGOs,
    refreshGlobalData,
    subscribeToUpdates,
    likePost,
    viewResource,
    isLoading,
    lastUpdated,
    updateCount
  };

  return (
    <GlobalDataContext.Provider value={value}>
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => {
  const context = useContext(GlobalDataContext);
  if (!context) {
    throw new Error('useGlobalData must be used within a GlobalDataProvider');
  }
  return context;
};
