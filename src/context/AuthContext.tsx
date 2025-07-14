import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'user' | 'admin';

interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, name: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isUser: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Default admin credentials
const DEFAULT_ADMIN = {
  email: 'basavarajrevani123@gmail.com',
  password: 'Basu@15032002',
  name: 'Admin'
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Initialize admin credentials if not exists
  useEffect(() => {
    const adminCredentials = localStorage.getItem('admin_credentials');
    if (!adminCredentials) {
      localStorage.setItem('admin_credentials', JSON.stringify(DEFAULT_ADMIN));
      console.log('🔐 Admin credentials initialized');
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 Login attempt:', email);

    // Check admin credentials first
    const adminCredentials = JSON.parse(localStorage.getItem('admin_credentials') || '{}');

    if (email === adminCredentials.email && password === adminCredentials.password) {
      // Update admin last login time
      const currentTime = new Date().toISOString();
      const updatedAdminCredentials = {
        ...adminCredentials,
        lastLogin: currentTime
      };
      localStorage.setItem('admin_credentials', JSON.stringify(updatedAdminCredentials));

      // Admin login
      const adminUser: User = {
        id: 'admin-001',
        email: adminCredentials.email,
        name: adminCredentials.name || 'Admin',
        role: 'admin',
        createdAt: '2024-01-01',
        lastLogin: currentTime
      };

      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      console.log('✅ Admin login successful - Last login updated');
      return true;
    }

    // Check registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const foundUserIndex = registeredUsers.findIndex((u: any) => u.email === email && u.password === password);

    if (foundUserIndex !== -1) {
      const foundUser = registeredUsers[foundUserIndex];

      // Update user's last login time
      const currentTime = new Date().toISOString();
      foundUser.lastLogin = currentTime;
      registeredUsers[foundUserIndex] = foundUser;
      localStorage.setItem('registered_users', JSON.stringify(registeredUsers));

      // User login
      const userLogin: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: 'user',
        createdAt: foundUser.createdAt,
        lastLogin: currentTime
      };

      setUser(userLogin);
      localStorage.setItem('user', JSON.stringify(userLogin));
      console.log('✅ User login successful - Last login updated');
      return true;
    }

    console.log('❌ Login failed - invalid credentials');
    return false;
  };

  const signup = async (email: string, name: string, password: string, role: UserRole = 'user'): Promise<boolean> => {
    console.log('📝 Signup attempt:', email, name);

    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const adminCredentials = JSON.parse(localStorage.getItem('admin_credentials') || '{}');

    // Check if email is already taken
    if (email === adminCredentials.email) {
      console.log('❌ Signup failed - admin email cannot be used');
      return false;
    }

    const existingUser = registeredUsers.find((u: any) => u.email === email);
    if (existingUser) {
      console.log('❌ Signup failed - email already exists');
      return false;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password, // In real app, this would be hashed
      role: 'user', // Only users can signup, admin is predefined
      createdAt: new Date().toISOString(),
      lastLogin: null // Will be set on first login
    };

    // Save to registered users
    registeredUsers.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(registeredUsers));

    console.log('✅ User registered successfully:', email);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isUser = (): boolean => {
    return user?.role === 'user';
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAdmin, isUser }}>
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