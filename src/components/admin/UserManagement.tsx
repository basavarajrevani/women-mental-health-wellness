import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  ShieldOff,
  Mail,
  Calendar,
  Activity,
  TrendingUp,
  UserCheck,
  UserX,
  Crown,
  Eye,
  Ban
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { syncHelpers } from '../../services/RealTimeSync';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  isActive: boolean;
  lastLogin: string;
  joinDate: string;
  postsCount: number;
  likesReceived: number;
  commentsCount: number;
  moodEntries: number;
  progressScore: number;
}

export const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Load users from localStorage and set up real-time monitoring
  useEffect(() => {
    loadUsers();

    // Refresh user list every 10 seconds to catch new registrations/logins
    const interval = setInterval(loadUsers, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadUsers = () => {
    console.log('👥 Loading real user data...');

    // Get real registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const adminCredentials = JSON.parse(localStorage.getItem('admin_credentials') || '{}');
    const communityPosts = JSON.parse(localStorage.getItem('community_posts') || '[]');

    // Convert registered users to User format
    const realUsers: User[] = registeredUsers.map((user: any) => {
      // Calculate real user activity
      const userPosts = communityPosts.filter((post: any) => post.userId === user.id);
      const userLikes = communityPosts.reduce((total: number, post: any) => {
        return total + (post.likes?.filter((like: any) => like.userId === user.id).length || 0);
      }, 0);
      const userComments = communityPosts.reduce((total: number, post: any) => {
        return total + (post.comments?.filter((comment: any) => comment.userId === user.id).length || 0);
      }, 0);

      // Get mood entries for this user
      const moodData = JSON.parse(localStorage.getItem(`progress_mood_data_${user.id}`) || '[]');

      // Calculate progress score based on activity
      const activityScore = Math.min(100, (userPosts.length * 10) + (userComments.length * 5) + (moodData.length * 2));

      return {
        id: user.id,
        username: user.name || user.email.split('@')[0],
        email: user.email,
        avatar: '👤', // Default avatar for now
        role: 'user' as const,
        isActive: true, // All registered users are considered active
        lastLogin: user.lastLogin || user.createdAt,
        joinDate: user.createdAt,
        postsCount: userPosts.length,
        likesReceived: userLikes,
        commentsCount: userComments,
        moodEntries: moodData.length,
        progressScore: activityScore
      };
    });

    // Add admin user if exists
    if (adminCredentials.email) {
      const adminPosts = communityPosts.filter((post: any) => post.userId === 'admin-001');
      const adminUser: User = {
        id: 'admin-001',
        username: adminCredentials.name || 'Admin',
        email: adminCredentials.email,
        avatar: '👨‍💼',
        role: 'admin' as const,
        isActive: true,
        lastLogin: new Date().toISOString(), // Admin is currently logged in
        joinDate: '2024-01-01T00:00:00.000Z',
        postsCount: adminPosts.length,
        likesReceived: 0,
        commentsCount: 0,
        moodEntries: 0,
        progressScore: 100 // Admin always has full access
      };
      realUsers.unshift(adminUser); // Add admin at the beginning
    }

    console.log('✅ Real users loaded:', realUsers.length);
    setUsers(realUsers);
  };

  const handleRoleChange = (userId: string, newRole: 'user' | 'admin') => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));

    // Update in localStorage if it's a real user
    const savedUsers = localStorage.getItem('app_users');
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      const updatedUsers = parsedUsers.map((user: any) =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    }

    // Emit real-time event
    syncHelpers.userRoleChanged(userId, newRole, currentUser?.id);

    console.log(`✅ User role updated: ${userId} -> ${newRole}`);
  };

  const handleStatusChange = (userId: string, isActive: boolean) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, isActive } : user
    ));

    // Update in localStorage if it's a real user
    const savedUsers = localStorage.getItem('app_users');
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      const updatedUsers = parsedUsers.map((user: any) =>
        user.id === userId ? { ...user, isActive } : user
      );
      localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    }

    // Emit real-time event
    syncHelpers.userStatusChanged(userId, isActive, currentUser?.id);

    console.log(`✅ User status updated: ${userId} -> ${isActive ? 'active' : 'inactive'}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('You cannot delete your own account!');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(user => user.id !== userId));

      // Remove from localStorage if it's a real user
      const savedUsers = localStorage.getItem('app_users');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        const updatedUsers = parsedUsers.filter((user: any) => user.id !== userId);
        localStorage.setItem('app_users', JSON.stringify(updatedUsers));
      }

      // Emit real-time event
      syncHelpers.userDeleted(userId, currentUser?.id);

      console.log(`✅ User deleted: ${userId}`);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    newThisMonth: users.filter(u => {
      const joinDate = new Date(u.joinDate);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return joinDate > monthAgo;
    }).length
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Administrators</p>
              <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
            </div>
            <Crown className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.newThisMonth}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                          {user.avatar}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                      disabled={user.id === currentUser?.id}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleStatusChange(user.id, !user.isActive)}
                        disabled={user.id === currentUser?.id}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-4">
                      <span title="Posts">{user.postsCount} posts</span>
                      <span title="Progress Score" className="text-blue-600">{user.progressScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.id === currentUser?.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No users have registered yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showUserDetails && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowUserDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">User Details</h3>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                    {selectedUser.avatar}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedUser.username}</h4>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedUser.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedUser.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedUser.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.isActive ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedUser.postsCount}</div>
                    <div className="text-sm text-gray-600">Posts</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedUser.likesReceived}</div>
                    <div className="text-sm text-gray-600">Likes</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedUser.commentsCount}</div>
                    <div className="text-sm text-gray-600">Comments</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{selectedUser.moodEntries}</div>
                    <div className="text-sm text-gray-600">Mood Entries</div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                    <div className="text-sm text-gray-900">
                      {new Date(selectedUser.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                    <div className="text-sm text-gray-900">
                      {new Date(selectedUser.lastLogin).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Progress Score</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${selectedUser.progressScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{selectedUser.progressScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
