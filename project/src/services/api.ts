// API service to replace localStorage with backend calls
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const API_TIMEOUT = 10000; // 10 seconds

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      // Don't redirect automatically, let the app handle it
      console.log('🔐 Authentication required');
    }
    return Promise.reject(error);
  }
);

// API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

interface PaginationResponse<T = any> extends ApiResponse<T> {
  data: {
    [key: string]: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Auth API
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse> => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.token) {
      localStorage.setItem('wmh_auth_token', response.data.token);
      localStorage.setItem('wmh_user_data', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await api.post('/auth/logout');
      localStorage.removeItem('wmh_auth_token');
      localStorage.removeItem('wmh_user_data');
      return response.data;
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('wmh_auth_token');
      localStorage.removeItem('wmh_user_data');
      throw error;
    }
  },

  getMe: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData: any): Promise<ApiResponse> => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },
};

// Community API
export const communityAPI = {
  getPosts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
  }): Promise<PaginationResponse> => {
    const response = await api.get('/community/posts', { params });
    return response.data;
  },

  getPost: async (postId: string): Promise<ApiResponse> => {
    const response = await api.get(`/community/posts/${postId}`);
    return response.data;
  },

  createPost: async (postData: {
    content: string;
    title?: string;
    category: string;
    tags?: string[];
    isAnonymous?: boolean;
  }): Promise<ApiResponse> => {
    const response = await api.post('/community/posts', postData);
    return response.data;
  },

  updatePost: async (postId: string, postData: any): Promise<ApiResponse> => {
    const response = await api.put(`/community/posts/${postId}`, postData);
    return response.data;
  },

  deletePost: async (postId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/community/posts/${postId}`);
    return response.data;
  },

  toggleLike: async (postId: string): Promise<ApiResponse> => {
    const response = await api.post(`/community/posts/${postId}/like`);
    return response.data;
  },

  addComment: async (postId: string, commentData: {
    content: string;
    isAnonymous?: boolean;
  }): Promise<ApiResponse> => {
    const response = await api.post(`/community/posts/${postId}/comments`, commentData);
    return response.data;
  },
};

// Support Groups API
export const supportGroupsAPI = {
  getSupportGroups: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    meetingType?: string;
    search?: string;
  }): Promise<PaginationResponse> => {
    const response = await api.get('/support-groups', { params });
    return response.data;
  },

  getSupportGroup: async (groupId: string): Promise<ApiResponse> => {
    const response = await api.get(`/support-groups/${groupId}`);
    return response.data;
  },

  createSupportGroup: async (groupData: any): Promise<ApiResponse> => {
    const response = await api.post('/support-groups', groupData);
    return response.data;
  },

  updateSupportGroup: async (groupId: string, groupData: any): Promise<ApiResponse> => {
    const response = await api.put(`/support-groups/${groupId}`, groupData);
    return response.data;
  },

  joinGroup: async (groupId: string, notes?: string): Promise<ApiResponse> => {
    const response = await api.post(`/support-groups/${groupId}/join`, { notes });
    return response.data;
  },

  leaveGroup: async (groupId: string): Promise<ApiResponse> => {
    const response = await api.post(`/support-groups/${groupId}/leave`);
    return response.data;
  },
};

// Events API
export const eventsAPI = {
  getEvents: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    upcoming?: boolean;
    search?: string;
  }): Promise<PaginationResponse> => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  getEvent: async (eventId: string): Promise<ApiResponse> => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  createEvent: async (eventData: any): Promise<ApiResponse> => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  registerForEvent: async (eventId: string, customResponses?: any[]): Promise<ApiResponse> => {
    const response = await api.post(`/events/${eventId}/register`, { customResponses });
    return response.data;
  },

  unregisterFromEvent: async (eventId: string): Promise<ApiResponse> => {
    const response = await api.post(`/events/${eventId}/unregister`);
    return response.data;
  },
};

// Resources API
export const resourcesAPI = {
  getResources: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    search?: string;
    targetCondition?: string;
    isFree?: boolean;
    featured?: boolean;
  }): Promise<PaginationResponse> => {
    const response = await api.get('/resources', { params });
    return response.data;
  },

  getResource: async (resourceId: string): Promise<ApiResponse> => {
    const response = await api.get(`/resources/${resourceId}`);
    return response.data;
  },

  createResource: async (resourceData: any): Promise<ApiResponse> => {
    const response = await api.post('/resources', resourceData);
    return response.data;
  },

  toggleBookmark: async (resourceId: string): Promise<ApiResponse> => {
    const response = await api.post(`/resources/${resourceId}/bookmark`);
    return response.data;
  },

  addReview: async (resourceId: string, reviewData: {
    rating: number;
    comment?: string;
    isAnonymous?: boolean;
  }): Promise<ApiResponse> => {
    const response = await api.post(`/resources/${resourceId}/reviews`, reviewData);
    return response.data;
  },

  trackClick: async (resourceId: string): Promise<ApiResponse> => {
    const response = await api.post(`/resources/${resourceId}/click`);
    return response.data;
  },

  getCategories: async (): Promise<ApiResponse> => {
    const response = await api.get('/resources/categories');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getUserProfile: async (userId: string): Promise<ApiResponse> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId: string, userData: any): Promise<ApiResponse> => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  getUserMoodEntries: async (userId: string, params?: {
    page?: number;
    limit?: number;
    days?: number;
  }): Promise<ApiResponse> => {
    const response = await api.get(`/users/${userId}/mood-entries`, { params });
    return response.data;
  },

  createMoodEntry: async (userId: string, moodData: {
    mood: number;
    notes?: string;
    emotions?: string[];
    triggers?: string[];
    activities?: string[];
    sleepHours?: number;
    energyLevel?: number;
    stressLevel?: number;
  }): Promise<ApiResponse> => {
    const response = await api.post(`/users/${userId}/mood-entries`, moodData);
    return response.data;
  },

  getNotifications: async (userId: string, params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<ApiResponse> => {
    const response = await api.get(`/users/${userId}/notifications`, { params });
    return response.data;
  },

  markNotificationAsRead: async (userId: string, notificationId: string): Promise<ApiResponse> => {
    const response = await api.put(`/users/${userId}/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async (userId: string): Promise<ApiResponse> => {
    const response = await api.put(`/users/${userId}/notifications/mark-all-read`);
    return response.data;
  },

  getDashboard: async (userId: string): Promise<ApiResponse> => {
    const response = await api.get(`/users/${userId}/dashboard`);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getDashboardStats: async (): Promise<ApiResponse> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<PaginationResponse> => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUser: async (userId: string, userData: {
    status?: string;
    role?: string;
  }): Promise<ApiResponse> => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  getPosts: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    reported?: boolean;
  }): Promise<PaginationResponse> => {
    const response = await api.get('/admin/posts', { params });
    return response.data;
  },

  moderatePost: async (postId: string, moderationData: {
    action: 'approve' | 'reject' | 'remove';
    notes?: string;
  }): Promise<ApiResponse> => {
    const response = await api.put(`/admin/posts/${postId}/moderate`, moderationData);
    return response.data;
  },

  getAnalytics: async (period?: string): Promise<ApiResponse> => {
    const response = await api.get('/admin/analytics', { params: { period } });
    return response.data;
  },

  broadcastNotification: async (notificationData: {
    title: string;
    message: string;
    type?: string;
    priority?: string;
  }): Promise<ApiResponse> => {
    const response = await api.post('/admin/notifications/broadcast', notificationData);
    return response.data;
  },
};

// Health API
export const healthAPI = {
  checkHealth: async (): Promise<ApiResponse> => {
    const response = await api.get('/health');
    return response.data;
  },

  checkDatabaseHealth: async (): Promise<ApiResponse> => {
    const response = await api.get('/health/db');
    return response.data;
  },
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.response?.data?.errors) {
    return error.response.data.errors.map((err: any) => err.message).join(', ');
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred';
  }
};

// Export the axios instance for custom requests
export { api };

// Auth token management
const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Generic API methods
const get = async (url: string, params?: any): Promise<ApiResponse> => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const post = async (url: string, data?: any): Promise<ApiResponse> => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const put = async (url: string, data?: any): Promise<ApiResponse> => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const del = async (url: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export default {
  // Generic methods
  get,
  post,
  put,
  delete: del,
  setAuthToken,

  // Specific API modules
  auth: authAPI,
  community: communityAPI,
  supportGroups: supportGroupsAPI,
  events: eventsAPI,
  resources: resourcesAPI,
  users: usersAPI,
  admin: adminAPI,
  health: healthAPI,
  handleApiError,
};
