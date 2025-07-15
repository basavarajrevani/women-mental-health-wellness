import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

// Types for global state
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
  role: 'user' | 'admin' | 'moderator';
  joinDate: string;
  preferences: {
    notifications: boolean;
    publicProfile: boolean;
    shareProgress: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  stats: {
    postsCount: number;
    likesReceived: number;
    helpfulVotes: number;
    daysActive: number;
  };
}

export interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  category: 'support' | 'achievement' | 'question' | 'resource' | 'general';
  tags: string[];
  likes: string[]; // user IDs who liked
  comments: Comment[];
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isReported: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  likes: string[];
  replies: Reply[];
  createdAt: string;
  isHelpful: boolean;
  helpfulVotes: string[];
}

export interface Reply {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  likes: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'reply' | 'achievement' | 'reminder' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  data?: any;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: string;
  isEdited: boolean;
  reactions: { [emoji: string]: string[] }; // emoji -> user IDs
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'support';
  participants: string[];
  messages: ChatMessage[];
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
}

interface GlobalContextType {
  // User state
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  
  // Community state
  communityPosts: CommunityPost[];
  setCommunityPosts: (posts: CommunityPost[]) => void;
  
  // Notifications
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  unreadCount: number;
  
  // Chat system
  chatRooms: ChatRoom[];
  setChatRooms: (rooms: ChatRoom[]) => void;
  activeChatRoom: string | null;
  setActiveChatRoom: (roomId: string | null) => void;
  
  // Backend API functions
  loadCommunityPosts: () => Promise<void>;
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; post?: CommunityPost; message?: string }>;
  likeCommunityPost: (postId: string, userId: string) => Promise<{ success: boolean; message?: string }>;
  addComment: (postId: string, comment: { content: string }) => Promise<{ success: boolean; comment?: Comment; message?: string }>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (notificationId: string) => void;
  sendChatMessage: (roomId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;

  // Utility functions
  generateId: () => string;
  formatTimeAgo: (date: string) => string;
  isLoading: boolean;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  // Get auth context
  const { user: authUser, isAuthenticated } = useAuth();

  // State management
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeChatRoom, setActiveChatRoom] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Utility functions
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const formatTimeAgo = (date: string): string => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return past.toLocaleDateString();
  };

  // Load community posts from backend
  const loadCommunityPosts = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.community.getPosts();
      if (response.success) {
        setCommunityPosts(response.data.posts || []);
      }
    } catch (error) {
      console.error('❌ Error loading community posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time functions
  const addCommunityPost = async (postData: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const response = await apiService.community.createPost({
        content: postData.content,
        category: postData.category,
        tags: postData.tags,
        isAnonymous: postData.isAnonymous
      });

      if (response.success) {
        // Add the new post to the local state
        setCommunityPosts(prev => [response.data.post, ...prev]);
        return { success: true, post: response.data.post };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('❌ Error creating post:', error);
      return { success: false, message: 'Failed to create post' };
    } finally {
      setIsLoading(false);
    }
  };

  const likeCommunityPost = async (postId: string, userId: string) => {
    try {
      const response = await apiService.community.likePost(postId);

      if (response.success) {
        // Update local state
        setCommunityPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return { ...post, likes: response.data.likes };
          }
          return post;
        }));
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('❌ Error liking post:', error);
      return { success: false, message: 'Failed to like post' };
    }
  };

  const addComment = async (postId: string, commentData: { content: string }) => {
    try {
      const response = await apiService.community.addComment(postId, commentData);

      if (response.success) {
        // Update local state
        setCommunityPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return { ...post, comments: response.data.comments };
          }
          return post;
        }));
        return { success: true, comment: response.data.comment };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('❌ Error adding comment:', error);
      return { success: false, message: 'Failed to add comment' };
    }
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Save to localStorage for persistence
      localStorage.setItem('user_notifications', JSON.stringify(updated));
      return updated;
    });

    console.log('🔔 Real-time notification added:', newNotification.title);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      );
      // Save to localStorage for persistence
      localStorage.setItem('user_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const sendChatMessage = (roomId: string, messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };

    setChatRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          messages: [...room.messages, newMessage],
          lastActivity: new Date().toISOString(),
        };
      }
      return room;
    }));
  };

  // Real-time updates would be handled by WebSocket/real-time database in production
  // For now, we only use real user-generated content

  // Calculate unread notifications count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && authUser) {
      // Load community posts from backend
      loadCommunityPosts();

      // Set current user from auth context
      const globalUser: User = {
        id: authUser.id,
        username: authUser.name,
        email: authUser.email,
        avatar: authUser.profile?.avatar || '😊',
        isOnline: true,
        lastSeen: new Date().toISOString(),
        role: authUser.role as 'user' | 'admin' | 'moderator',
        joinDate: authUser.createdAt,
        preferences: {
          notifications: authUser.profile?.preferences?.notifications?.email?.enabled ?? true,
          publicProfile: authUser.profile?.preferences?.privacy?.profileVisibility === 'public',
          shareProgress: false,
          theme: 'light',
        },
        stats: {
          postsCount: authUser.stats?.postsCount || 0,
          likesReceived: authUser.stats?.likesReceived || 0,
          helpfulVotes: 0,
          daysActive: authUser.stats?.streakDays || 1,
        },
      };
      setCurrentUser(globalUser);

      // Initialize empty notifications - will be loaded from backend
      setNotifications([]);

      // Initialize empty chat rooms - will be loaded from backend
      setChatRooms([]);

      console.log('✅ Global context initialized with backend data');
    } else {
      // Clear data when not authenticated
      setCommunityPosts([]);
      setNotifications([]);
      setChatRooms([]);
      setCurrentUser(null);
      console.log('🔄 Global context cleared - user not authenticated');
    }
  }, [isAuthenticated, authUser]);

  const value: GlobalContextType = {
    currentUser,
    setCurrentUser,
    users,
    setUsers,
    communityPosts,
    setCommunityPosts,
    notifications,
    setNotifications,
    unreadCount,
    chatRooms,
    setChatRooms,
    activeChatRoom,
    setActiveChatRoom,
    addCommunityPost,
    likeCommunityPost,
    addComment,
    addNotification,
    markNotificationRead,
    sendChatMessage,
    loadCommunityPosts,
    generateId,
    formatTimeAgo,
    isLoading,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};
