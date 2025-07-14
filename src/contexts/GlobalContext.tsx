import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  
  // Real-time functions
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  likeCommunityPost: (postId: string, userId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (notificationId: string) => void;
  sendChatMessage: (roomId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  
  // Utility functions
  generateId: () => string;
  formatTimeAgo: (date: string) => string;
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
  // State management
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeChatRoom, setActiveChatRoom] = useState<string | null>(null);

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

  // Real-time functions
  const addCommunityPost = (postData: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: CommunityPost = {
      ...postData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setCommunityPosts(prev => [newPost, ...prev]);
    
    // Save to localStorage for persistence
    const updatedPosts = [newPost, ...communityPosts];
    localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
  };

  const likeCommunityPost = (postId: string, userId: string) => {
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(userId);
        const likes = isLiked
          ? post.likes.filter(id => id !== userId)
          : [...post.likes, userId];

        // Send real-time notification to post author when someone likes their post
        if (!isLiked && post.userId !== userId && currentUser) {
          addNotification({
            userId: post.userId,
            type: 'like',
            title: 'Someone liked your post! ❤️',
            message: `${currentUser.username} liked your post: "${post.content.substring(0, 50)}${post.content.length > 50 ? '...' : ''}"`,
            isRead: false,
          });
        }

        return { ...post, likes };
      }
      return post;
    }));
  };

  const addComment = (postId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        // Send real-time notification to post author when someone comments
        if (post.userId !== commentData.userId && currentUser) {
          addNotification({
            userId: post.userId,
            type: 'comment',
            title: 'New comment on your post! 💬',
            message: `${currentUser.username} commented: "${newComment.content.substring(0, 50)}${newComment.content.length > 50 ? '...' : ''}"`,
            isRead: false,
          });
        }

        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
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

  // Initialize data on mount
  useEffect(() => {
    // Load data from localStorage
    const savedPosts = localStorage.getItem('community_posts');
    if (savedPosts) {
      setCommunityPosts(JSON.parse(savedPosts));
    }

    // Clear any existing dummy notifications and start fresh
    console.log('🧹 Clearing any existing dummy notifications...');
    localStorage.removeItem('user_notifications');

    // Clear ALL notification-related localStorage keys more aggressively
    const allKeys = Object.keys(localStorage);
    const notificationKeys = allKeys.filter(key =>
      key.includes('notification') ||
      key.includes('mood') ||
      key.includes('last_sent') ||
      key.includes('reminder') ||
      key.includes('last_mood_track') ||
      key.includes('breathing') ||
      key.includes('wellness') ||
      key.includes('smart_')
    );
    notificationKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log('🗑️ Removed notification key:', key);
    });

    // Start with empty notifications - only real-time events will add notifications
    setNotifications([]);
    console.log('✅ Notification system completely reset - only real-time events will trigger notifications');

    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      // Create default user if none exists
      const defaultUser: User = {
        id: generateId(),
        username: 'You',
        email: 'user@example.com',
        avatar: '😊',
        isOnline: true,
        lastSeen: new Date().toISOString(),
        role: 'user',
        joinDate: new Date().toISOString(),
        preferences: {
          notifications: true,
          publicProfile: true,
          shareProgress: false,
          theme: 'light',
        },
        stats: {
          postsCount: 0,
          likesReceived: 0,
          helpfulVotes: 0,
          daysActive: 1,
        },
      };
      setCurrentUser(defaultUser);
      localStorage.setItem('current_user', JSON.stringify(defaultUser));
    }

    // Initialize empty chat rooms - admins can create them as needed
    const savedChatRooms = localStorage.getItem('chat_rooms');
    if (savedChatRooms) {
      setChatRooms(JSON.parse(savedChatRooms));
    } else {
      setChatRooms([]);
    }
  }, []);

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
    generateId,
    formatTimeAgo,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};
