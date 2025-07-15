import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { syncHelpers } from '../services/RealTimeSync';
import { persistenceHelpers } from '../services/DataPersistence';
import { publicDataHelpers } from '../services/PublicDataService';

// Admin-managed content types
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'support' | 'discussion' | 'announcement' | 'milestone';
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  likes: number;
  replies: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'self-care' | 'therapy' | 'crisis' | 'education' | 'tools';
  type: 'article' | 'video' | 'audio' | 'pdf' | 'external-link';
  url?: string;
  imageUrl?: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  views: number;
  rating: number;
}

export interface Partner {
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

export interface NGO {
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

export interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category: 'anxiety' | 'depression' | 'trauma' | 'relationships' | 'self-care' | 'general';
  facilitator: string;
  facilitatorBio?: string;
  maxMembers: number;
  currentMembers: number;
  meetingSchedule: string;
  meetingType: 'online' | 'in-person' | 'hybrid';
  meetingLink?: string;
  location?: string;
  isActive: boolean;
  isPublic: boolean;
  requirements?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'workshop' | 'webinar' | 'support-session' | 'social' | 'educational' | 'wellness';
  organizer: string;
  organizerContact: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  type: 'online' | 'in-person' | 'hybrid';
  meetingLink?: string;
  location?: string;
  maxAttendees?: number;
  currentAttendees: number;
  isPublic: boolean;
  isFree: boolean;
  price?: number;
  requirements?: string[];
  tags: string[];
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalResources: number;
  totalPartners: number;
  totalNGOs: number;
  totalSupportGroups: number;
  totalEvents: number;
  monthlyGrowth: number;
  userEngagement: number;
}

export interface AdminContextType {
  // Content Management
  communityPosts: CommunityPost[];
  resources: Resource[];
  partners: Partner[];
  ngos: NGO[];
  supportGroups: SupportGroup[];
  events: Event[];

  // Statistics
  adminStats: AdminStats;

  // Community Management
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'replies'>) => Promise<boolean>;
  updateCommunityPost: (id: string, updates: Partial<CommunityPost>) => Promise<boolean>;
  deleteCommunityPost: (id: string) => Promise<boolean>;

  // Resource Management
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'rating'>) => Promise<boolean>;
  updateResource: (id: string, updates: Partial<Resource>) => Promise<boolean>;
  deleteResource: (id: string) => Promise<boolean>;

  // Partner Management
  addPartner: (partner: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updatePartner: (id: string, updates: Partial<Partner>) => Promise<boolean>;
  deletePartner: (id: string) => Promise<boolean>;

  // NGO Management
  addNGO: (ngo: Omit<NGO, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateNGO: (id: string, updates: Partial<NGO>) => Promise<boolean>;
  deleteNGO: (id: string) => Promise<boolean>;

  // Support Group Management
  addSupportGroup: (group: Omit<SupportGroup, 'id' | 'createdAt' | 'updatedAt' | 'currentMembers'>) => Promise<boolean>;
  updateSupportGroup: (id: string, updates: Partial<SupportGroup>) => Promise<boolean>;
  deleteSupportGroup: (id: string) => Promise<boolean>;

  // Event Management
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'currentAttendees'>) => Promise<boolean>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;

  // Data refresh
  refreshAdminData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for admin-managed content
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [supportGroups, setSupportGroups] = useState<SupportGroup[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    totalResources: 0,
    totalPartners: 0,
    totalNGOs: 0,
    totalSupportGroups: 0,
    totalEvents: 0,
    monthlyGrowth: 0,
    userEngagement: 0
  });

  // Initialize admin data when admin logs in
  useEffect(() => {
    if (user && isAdmin()) {
      console.log('🔑 Admin user detected, loading admin data...');
      loadAdminData();
    } else if (!user) {
      // Only clear data when user logs out completely
      console.log('👋 User logged out, clearing admin data...');
      clearAdminData();
    }
    // Don't clear data if user exists but isn't admin - they might switch to admin later
  }, [user, isAdmin]);

  const loadAdminData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadCommunityPosts(),
        loadResources(),
        loadPartners(),
        loadNGOs(),
        loadSupportGroups(),
        loadEvents(),
        loadAdminStats()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCommunityPosts = async () => {
    try {
      const data = persistenceHelpers.loadAllData();
      setCommunityPosts(data.communityPosts);
      console.log('📂 Loaded community posts from storage:', data.communityPosts.length);
    } catch (error) {
      console.error('❌ Error loading community posts:', error);
      setCommunityPosts([]);
    }
  };

  const loadResources = async () => {
    try {
      const data = persistenceHelpers.loadAllData();
      setResources(data.resources);
      console.log('📂 Loaded resources from storage:', data.resources.length);
    } catch (error) {
      console.error('❌ Error loading resources:', error);
      setResources([]);
    }
  };

  const loadPartners = async () => {
    try {
      const data = persistenceHelpers.loadAllData();
      setPartners(data.partners);
      console.log('📂 Loaded partners from storage:', data.partners.length);
    } catch (error) {
      console.error('❌ Error loading partners:', error);
      setPartners([]);
    }
  };

  const loadNGOs = async () => {
    try {
      const data = persistenceHelpers.loadAllData();
      setNgos(data.ngos);
      console.log('📂 Loaded NGOs from storage:', data.ngos.length);
    } catch (error) {
      console.error('❌ Error loading NGOs:', error);
      setNgos([]);
    }
  };

  const loadSupportGroups = async () => {
    try {
      const data = persistenceHelpers.loadAllData();
      const groups = data.supportGroups || [];
      setSupportGroups(groups);
      // Sync to public data for all users
      publicDataHelpers.updateSupportGroups(groups);
      console.log('📂 Loaded support groups from storage:', groups.length);
    } catch (error) {
      console.error('❌ Error loading support groups:', error);
      setSupportGroups([]);
    }
  };

  const loadEvents = async () => {
    try {
      const data = persistenceHelpers.loadAllData();
      const events = data.events || [];
      setEvents(events);
      // Sync to public data for all users
      publicDataHelpers.updateEvents(events);
      console.log('📂 Loaded events from storage:', events.length);
    } catch (error) {
      console.error('❌ Error loading events:', error);
      setEvents([]);
    }
  };

  const loadAdminStats = async () => {
    console.log('📊 Loading real admin statistics...');

    // Get real user data from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const adminCredentials = JSON.parse(localStorage.getItem('admin_credentials') || '{}');

    // Calculate total users (registered users + admin)
    const totalUsers = registeredUsers.length + (adminCredentials.email ? 1 : 0);

    // Calculate active users (users who have logged in recently)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // For now, consider all registered users as active since we don't track last login for users yet
    // In a real app, you'd check lastLogin timestamps
    const activeUsers = registeredUsers.length;

    // Calculate monthly growth (new users in last 30 days)
    const recentUsers = registeredUsers.filter((user: any) => {
      const createdDate = new Date(user.createdAt);
      return createdDate >= thirtyDaysAgo;
    });
    const monthlyGrowthCount = recentUsers.length;
    const monthlyGrowthPercentage = totalUsers > 0 ? (monthlyGrowthCount / totalUsers) * 100 : 0;

    // Calculate user engagement (users with posts / total users)
    const usersWithPosts = new Set(communityPosts.map(post => post.userId)).size;
    const userEngagement = totalUsers > 0 ? (usersWithPosts / totalUsers) * 100 : 0;

    const realStats: AdminStats = {
      totalUsers: totalUsers,
      activeUsers: activeUsers,
      totalPosts: communityPosts.length,
      totalResources: resources.length,
      totalPartners: partners.length,
      totalNGOs: ngos.length,
      totalSupportGroups: supportGroups.length,
      totalEvents: events.length,
      monthlyGrowth: Math.round(monthlyGrowthPercentage * 10) / 10, // Round to 1 decimal
      userEngagement: Math.round(userEngagement * 10) / 10 // Round to 1 decimal
    };

    console.log('✅ Real admin stats calculated:', realStats);
    setAdminStats(realStats);
  };

  const clearAdminData = () => {
    setCommunityPosts([]);
    setResources([]);
    setPartners([]);
    setNgos([]);
    setSupportGroups([]);
    setEvents([]);
    setAdminStats({
      totalUsers: 0,
      activeUsers: 0,
      totalPosts: 0,
      totalResources: 0,
      totalPartners: 0,
      totalNGOs: 0,
      totalSupportGroups: 0,
      totalEvents: 0,
      monthlyGrowth: 0,
      userEngagement: 0
    });
  };

  // Community Management Functions
  const addCommunityPost = async (postData: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'replies'>): Promise<boolean> => {
    try {
      const newPost: CommunityPost = {
        ...postData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        replies: 0
      };

      const updatedPosts = [newPost, ...communityPosts];
      setCommunityPosts(updatedPosts);

      // Save to persistent storage
      persistenceHelpers.saveCommunityPosts(updatedPosts);

      // Emit real-time event
      syncHelpers.communityPostCreated(newPost, user?.id);
      if (newPost.isPublished) {
        syncHelpers.communityPostPublished(newPost, user?.id);
      }

      console.log('✅ Community post created and saved:', newPost.title);

      // Refresh stats to reflect new post count
      await loadAdminStats();

      return true;
    } catch (error) {
      console.error('❌ Error adding community post:', error);
      setError('Failed to add community post');
      return false;
    }
  };

  const updateCommunityPost = async (id: string, updates: Partial<CommunityPost>): Promise<boolean> => {
    try {
      let updatedPost: CommunityPost | null = null;

      const updatedPosts = communityPosts.map(post => {
        if (post.id === id) {
          updatedPost = { ...post, ...updates, updatedAt: new Date().toISOString() };
          return updatedPost;
        }
        return post;
      });

      setCommunityPosts(updatedPosts);

      // Save to persistent storage
      persistenceHelpers.saveCommunityPosts(updatedPosts);

      // Emit real-time events
      if (updatedPost) {
        syncHelpers.communityPostUpdated(updatedPost, user?.id);

        // Check if publish status changed
        if (updates.hasOwnProperty('isPublished')) {
          if (updates.isPublished) {
            syncHelpers.communityPostPublished(updatedPost, user?.id);
          }
        }

        console.log('✅ Community post updated and saved:', updatedPost.title);
      }

      return true;
    } catch (error) {
      console.error('❌ Error updating community post:', error);
      setError('Failed to update community post');
      return false;
    }
  };

  const deleteCommunityPost = async (id: string): Promise<boolean> => {
    try {
      const updatedPosts = communityPosts.filter(post => post.id !== id);
      setCommunityPosts(updatedPosts);

      // Save to persistent storage
      persistenceHelpers.saveCommunityPosts(updatedPosts);

      // Emit real-time event
      syncHelpers.communityPostDeleted(id, user?.id);

      console.log('✅ Community post deleted and saved');

      // Refresh stats to reflect updated post count
      await loadAdminStats();

      return true;
    } catch (error) {
      console.error('❌ Error deleting community post:', error);
      setError('Failed to delete community post');
      return false;
    }
  };

  // Resource Management Functions
  const addResource = async (resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'rating'>): Promise<boolean> => {
    try {
      console.log('➕ Adding new resource:', resourceData.title);

      const newResource: Resource = {
        ...resourceData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        rating: 0
      };

      const updatedResources = [newResource, ...resources];
      console.log('📝 Updated resources array length:', updatedResources.length);

      setResources(updatedResources);

      // Save to persistent storage
      persistenceHelpers.saveResources(updatedResources);
      console.log('💾 Resources saved to persistent storage');

      // Verify the save worked
      const verifyData = persistenceHelpers.loadAllData();
      console.log('🔍 Verification - Resources in storage:', verifyData.resources.length);

      // Emit real-time event
      syncHelpers.resourceCreated(newResource, user?.id);
      if (newResource.isPublished) {
        syncHelpers.resourcePublished(newResource, user?.id);
      }

      console.log('✅ Resource created and saved:', newResource.title);
      return true;
    } catch (error) {
      console.error('❌ Error adding resource:', error);
      setError('Failed to add resource');
      return false;
    }
  };

  const updateResource = async (id: string, updates: Partial<Resource>): Promise<boolean> => {
    try {
      setResources(prev => prev.map(resource => 
        resource.id === id 
          ? { ...resource, ...updates, updatedAt: new Date().toISOString() }
          : resource
      ));
      return true;
    } catch (error) {
      setError('Failed to update resource');
      return false;
    }
  };

  const deleteResource = async (id: string): Promise<boolean> => {
    try {
      setResources(prev => prev.filter(resource => resource.id !== id));
      return true;
    } catch (error) {
      setError('Failed to delete resource');
      return false;
    }
  };

  // Partner Management Functions
  const addPartner = async (partnerData: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const newPartner: Partner = {
        ...partnerData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setPartners(prev => [newPartner, ...prev]);
      return true;
    } catch (error) {
      setError('Failed to add partner');
      return false;
    }
  };

  const updatePartner = async (id: string, updates: Partial<Partner>): Promise<boolean> => {
    try {
      setPartners(prev => prev.map(partner =>
        partner.id === id
          ? { ...partner, ...updates, updatedAt: new Date().toISOString() }
          : partner
      ));
      return true;
    } catch (error) {
      setError('Failed to update partner');
      return false;
    }
  };

  const deletePartner = async (id: string): Promise<boolean> => {
    try {
      setPartners(prev => prev.filter(partner => partner.id !== id));
      return true;
    } catch (error) {
      setError('Failed to delete partner');
      return false;
    }
  };

  // NGO Management Functions
  const addNGO = async (ngoData: Omit<NGO, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const newNGO: NGO = {
        ...ngoData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setNgos(prev => {
        const updated = [newNGO, ...prev];
        // Save to persistent storage
        persistenceHelpers.saveNGOs(updated);
        return updated;
      });

      // Emit real-time event for NGO creation
      syncHelpers.ngoCreated(newNGO, user?.id);

      console.log('✅ NGO created and saved:', newNGO.name);
      return true;
    } catch (error) {
      console.error('❌ Error adding NGO:', error);
      setError('Failed to add NGO');
      return false;
    }
  };

  const updateNGO = async (id: string, updates: Partial<NGO>): Promise<boolean> => {
    try {
      setNgos(prev => {
        const updated = prev.map(ngo =>
          ngo.id === id
            ? { ...ngo, ...updates, updatedAt: new Date().toISOString() }
            : ngo
        );
        // Save to persistent storage
        persistenceHelpers.saveNGOs(updated);
        return updated;
      });

      // Find the updated NGO and emit real-time event
      const updatedNGO = ngos.find(ngo => ngo.id === id);
      if (updatedNGO) {
        syncHelpers.ngoUpdated({ ...updatedNGO, ...updates }, user?.id);
      }

      console.log('✅ NGO updated and saved:', id);
      return true;
    } catch (error) {
      console.error('❌ Error updating NGO:', error);
      setError('Failed to update NGO');
      return false;
    }
  };

  const deleteNGO = async (id: string): Promise<boolean> => {
    try {
      setNgos(prev => {
        const updated = prev.filter(ngo => ngo.id !== id);
        // Save to persistent storage
        persistenceHelpers.saveNGOs(updated);
        return updated;
      });

      // Emit real-time event for NGO deletion
      syncHelpers.ngoDeleted(id, user?.id);

      console.log('✅ NGO deleted and saved:', id);
      return true;
    } catch (error) {
      console.error('❌ Error deleting NGO:', error);
      setError('Failed to delete NGO');
      return false;
    }
  };

  // Support Group Management Functions
  const addSupportGroup = async (groupData: Omit<SupportGroup, 'id' | 'createdAt' | 'updatedAt' | 'currentMembers'>): Promise<boolean> => {
    try {
      const newGroup: SupportGroup = {
        ...groupData,
        id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        currentMembers: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setSupportGroups(prev => {
        const updated = [...prev, newGroup];
        // Save to persistent storage
        persistenceHelpers.saveSupportGroups(updated);
        // Sync to public data for all users
        publicDataHelpers.updateSupportGroups(updated);
        return updated;
      });

      console.log('✅ Support group created and saved:', newGroup.name);
      return true;
    } catch (error) {
      console.error('❌ Error adding support group:', error);
      setError('Failed to add support group');
      return false;
    }
  };

  const updateSupportGroup = async (id: string, updates: Partial<SupportGroup>): Promise<boolean> => {
    try {
      setSupportGroups(prev => {
        const updated = prev.map(group =>
          group.id === id
            ? { ...group, ...updates, updatedAt: new Date().toISOString() }
            : group
        );
        // Save to persistent storage
        persistenceHelpers.saveSupportGroups(updated);
        // Sync to public data for all users
        publicDataHelpers.updateSupportGroups(updated);
        return updated;
      });

      console.log('✅ Support group updated and saved:', id);
      return true;
    } catch (error) {
      console.error('❌ Error updating support group:', error);
      setError('Failed to update support group');
      return false;
    }
  };

  const deleteSupportGroup = async (id: string): Promise<boolean> => {
    try {
      setSupportGroups(prev => {
        const updated = prev.filter(group => group.id !== id);
        // Save to persistent storage
        persistenceHelpers.saveSupportGroups(updated);
        // Sync to public data for all users
        publicDataHelpers.updateSupportGroups(updated);
        return updated;
      });

      console.log('✅ Support group deleted and saved:', id);
      return true;
    } catch (error) {
      console.error('❌ Error deleting support group:', error);
      setError('Failed to delete support group');
      return false;
    }
  };

  // Event Management Functions
  const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'currentAttendees'>): Promise<boolean> => {
    try {
      const newEvent: Event = {
        ...eventData,
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        currentAttendees: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setEvents(prev => {
        const updated = [...prev, newEvent];
        // Save to persistent storage
        persistenceHelpers.saveEvents(updated);
        // Sync to public data for all users
        publicDataHelpers.updateEvents(updated);
        return updated;
      });

      console.log('✅ Event created and saved:', newEvent.title);
      return true;
    } catch (error) {
      console.error('❌ Error adding event:', error);
      setError('Failed to add event');
      return false;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>): Promise<boolean> => {
    try {
      setEvents(prev => {
        const updated = prev.map(event =>
          event.id === id
            ? { ...event, ...updates, updatedAt: new Date().toISOString() }
            : event
        );
        // Save to persistent storage
        persistenceHelpers.saveEvents(updated);
        // Sync to public data for all users
        publicDataHelpers.updateEvents(updated);
        return updated;
      });

      console.log('✅ Event updated and saved:', id);
      return true;
    } catch (error) {
      console.error('❌ Error updating event:', error);
      setError('Failed to update event');
      return false;
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    try {
      setEvents(prev => {
        const updated = prev.filter(event => event.id !== id);
        // Save to persistent storage
        persistenceHelpers.saveEvents(updated);
        // Sync to public data for all users
        publicDataHelpers.updateEvents(updated);
        return updated;
      });

      console.log('✅ Event deleted and saved:', id);
      return true;
    } catch (error) {
      console.error('❌ Error deleting event:', error);
      setError('Failed to delete event');
      return false;
    }
  };

  const refreshAdminData = async (): Promise<void> => {
    await loadAdminData();
  };

  const value: AdminContextType = {
    communityPosts,
    resources,
    partners,
    ngos,
    supportGroups,
    events,
    adminStats,
    addCommunityPost,
    updateCommunityPost,
    deleteCommunityPost,
    addResource,
    updateResource,
    deleteResource,
    addPartner,
    updatePartner,
    deletePartner,
    addNGO,
    updateNGO,
    deleteNGO,
    addSupportGroup,
    updateSupportGroup,
    deleteSupportGroup,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshAdminData,
    isLoading,
    error
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
