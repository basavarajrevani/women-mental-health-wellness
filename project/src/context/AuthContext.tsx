import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

export type UserRole = 'user' | 'moderator' | 'admin';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profile?: {
    avatar?: string;
    bio?: string;
    personalInfo?: {
      firstName?: string;
      lastName?: string;
      age?: number;
      gender?: string;
      phoneNumber?: string;
    };
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
    preferences?: {
      privacy?: {
        profileVisibility?: string;
        showRealName?: boolean;
      };
      notifications?: {
        email?: {
          enabled?: boolean;
          frequency?: string;
        };
      };
    };
  };
  verification?: {
    isEmailVerified?: boolean;
  };
  stats?: {
    postsCount?: number;
    commentsCount?: number;
    likesReceived?: number;
    streakDays?: number;
    lastActiveDate?: string;
  };
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (email: string, name: string, password: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  refreshUser: () => Promise<void>;
  isAdmin: () => boolean;
  isUser: () => boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Debug logging for state changes
  useEffect(() => {
    console.log('🔍 Auth state changed:', {
      hasUser: !!user,
      userEmail: user?.email,
      isLoading
    });
  }, [user, isLoading]);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Initializing authentication...');

      const token = localStorage.getItem('token');
      console.log('🔍 Token found:', token ? 'YES' : 'NO');

      if (token) {
        try {
          // Set token in API service
          apiService.setAuthToken(token);
          localStorage.setItem('wmh_auth_token', token); // Ensure Socket.IO token is set
          console.log('🔑 Token set in API service');

          // Verify token and get user data
          console.log('📡 Verifying token with server...');
          const response = await apiService.get('/auth/me');
          console.log('📡 Server response:', response);

          if (response.success && response.data && response.data.user) {
            setUser(response.data.user);
            console.log('✅ User authenticated successfully:', response.data.user.email);

            // Connect to Socket.IO for authenticated user
            import('../services/socket').then(({ default: socketService }) => {
              console.log('🔌 Connecting to Socket.IO...');
              socketService.connect();
            });
          } else {
            // Invalid token, remove it
            console.log('❌ Invalid token response, clearing data');
            localStorage.removeItem('token');
            localStorage.removeItem('wmh_auth_token');
            apiService.setAuthToken(null);
          }
        } catch (error) {
          console.error('❌ Auth initialization error:', error);
          console.log('🧹 Clearing tokens due to error');
          localStorage.removeItem('token');
          localStorage.removeItem('wmh_auth_token');
          apiService.setAuthToken(null);
        }
      } else {
        console.log('ℹ️ No token found, user needs to login');
      }

      setIsLoading(false);
      console.log('✅ Auth initialization complete');
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string; user?: any }> => {
    try {
      setIsLoading(true);
      console.log('🔐 Login attempt:', email);

      const response = await apiService.post('/auth/test-login', {
        email,
        password
      });

      if (response.success) {
        console.log('📦 Full login response:', response);
        const { token, user } = response.data;

        console.log('🔍 Extracted data:', { token: token ? 'EXISTS' : 'MISSING', user });

        // Store token and set in API service
        localStorage.setItem('token', token);
        localStorage.setItem('wmh_auth_token', token); // For Socket.IO
        apiService.setAuthToken(token);

        // Set user data
        setUser(user);

        // Connect to Socket.IO after successful login
        import('../services/socket').then(({ default: socketService }) => {
          socketService.disconnect(); // Disconnect any existing connection
          setTimeout(() => {
            socketService.connect(); // Connect with new user context
          }, 100);
        });

        console.log('✅ Login successful:', user.email, 'Role:', user.role);
        console.log('👤 User object:', user);
        console.log('🔍 User role check:', user.role === 'admin' ? 'IS ADMIN' : 'NOT ADMIN');

        return { success: true, message: 'Login successful', user };
      } else {
        console.log('❌ Login failed:', response.message);
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Network error. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string, password: string, role: UserRole = 'user'): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      console.log('📝 Signup attempt:', email, name);

      const response = await apiService.post('/auth/register', {
        email,
        name,
        password,
        role
      });

      if (response.success) {
        console.log('✅ User registered successfully:', email);
        return { success: true, message: 'Registration successful! Please login.' };
      } else {
        console.log('❌ Signup failed:', response.message);
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Network error. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('👋 Logging out user...');

    // Clear user state
    setUser(null);

    // Clear only authentication-related localStorage data
    localStorage.removeItem('token');
    localStorage.removeItem('wmh_auth_token');

    // Clear API service token
    apiService.setAuthToken(null);

    // Disconnect Socket.IO
    import('../services/socket').then(({ default: socketService }) => {
      socketService.disconnect();
      console.log('🔌 Socket.IO disconnected');
    });

    console.log('👋 User logged out successfully');
  };

  const updateProfile = async (profileData: Partial<User>): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);

      const response = await apiService.put('/auth/profile', profileData);

      if (response.success) {
        setUser(response.data.user);
        return { success: true, message: 'Profile updated successfully' };
      } else {
        return { success: false, message: response.message || 'Profile update failed' };
      }
    } catch (error: any) {
      console.error('❌ Profile update error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Network error. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await apiService.get('/auth/me');
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('❌ Error refreshing user:', error);
    }
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isUser = (): boolean => {
    return user?.role === 'user';
  };

  const isAuthenticated = !!user;

  // Monitor user state changes for debugging
  useEffect(() => {
    if (user) {
      console.log('👤 User state updated:', {
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin'
      });
    }
  }, [user]);

  // Initialize auth state on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('🔑 Found token on mount, refreshing user...');
      apiService.setAuthToken(token);
      refreshUser();
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateProfile,
      refreshUser,
      isAdmin,
      isUser,
      isLoading,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};