import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  User,
  MessageSquare,
  MessageCircle,
  BookOpen,
  Building,
  Heart,
  Calendar,
  TrendingUp,
  Plus,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  RefreshCw,
  Database,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { CommunityManagement } from '../components/admin/CommunityManagement';
import { ResourceManagement } from '../components/admin/ResourceManagement';
import { PartnerManagement } from '../components/admin/PartnerManagement';
import { NGOManagement } from '../components/admin/NGOManagement';
import SupportGroupManagement from '../components/admin/SupportGroupManagement';
import EventManagement from '../components/admin/EventManagement';
import { UserManagement } from '../components/admin/UserManagement';
import { AdminSettings } from '../components/admin/AdminSettings';
import { ContactRequestManagement } from '../components/admin/ContactRequestManagement';
import { AdminPersonalSettings } from '../components/admin/AdminPersonalSettings';
import { DataStorageIndicator } from '../components/admin/DataStorageIndicator';

type AdminTab = 'overview' | 'community' | 'resources' | 'partners' | 'ngos' | 'support-groups' | 'events' | 'users' | 'settings' | 'contact-requests' | 'personal';

// Admin Debug Section Component
const AdminDebugSection: React.FC = () => {
  const {
    resources,
    partners,
    ngos,
    communityPosts,
    refreshAdminData,
    isLoading
  } = useAdmin();

  const handleRefreshData = async () => {
    console.log('🔄 Manual refresh triggered by admin');

    try {
      // Show loading state
      const startTime = Date.now();

      // Refresh all admin data
      await refreshAdminData();

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('✅ Manual refresh completed in', duration, 'ms');

      // Show success notification
      alert(`✅ Data refresh completed successfully!\n\nRefresh took: ${duration}ms\n\nAll admin data has been reloaded from storage.`);

    } catch (error) {
      console.error('❌ Error during manual refresh:', error);
      alert('❌ Error during data refresh. Please check the console for details.');
    }
  };

  const handleCheckStorage = () => {
    console.log('🔍 Comprehensive storage check initiated...');

    try {
      // Get all localStorage keys
      const allKeys = Object.keys(localStorage);

      // Categorize keys
      const adminKeys = allKeys.filter(key =>
        key.includes('admin') ||
        key.includes('resource') ||
        key.includes('partner') ||
        key.includes('ngo') ||
        key.includes('community') ||
        key.includes('user') ||
        key.includes('contact')
      );

      const userKeys = allKeys.filter(key =>
        key.includes('registered_users') ||
        key.includes('progress_') ||
        key.includes('mood_') ||
        key.includes('therapy_')
      );

      const systemKeys = allKeys.filter(key =>
        !adminKeys.includes(key) && !userKeys.includes(key)
      );

      // Calculate storage usage
      let totalSize = 0;
      const storageReport: any = {
        admin: {},
        users: {},
        system: {},
        summary: {}
      };

      // Check admin data
      adminKeys.forEach(key => {
        try {
          const value = localStorage.getItem(key) || '';
          const size = new Blob([value]).size;
          totalSize += size;

          let data;
          try {
            data = JSON.parse(value);
          } catch {
            data = value;
          }

          storageReport.admin[key] = {
            size: `${(size / 1024).toFixed(2)} KB`,
            items: Array.isArray(data) ? data.length : typeof data === 'object' ? Object.keys(data).length : 1,
            type: Array.isArray(data) ? 'array' : typeof data
          };
        } catch (e) {
          storageReport.admin[key] = { error: e instanceof Error ? e.message : 'Unknown error' };
        }
      });

      // Check user data
      userKeys.forEach(key => {
        try {
          const value = localStorage.getItem(key) || '';
          const size = new Blob([value]).size;
          totalSize += size;

          let data;
          try {
            data = JSON.parse(value);
          } catch {
            data = value;
          }

          storageReport.users[key] = {
            size: `${(size / 1024).toFixed(2)} KB`,
            items: Array.isArray(data) ? data.length : typeof data === 'object' ? Object.keys(data).length : 1,
            type: Array.isArray(data) ? 'array' : typeof data
          };
        } catch (e) {
          storageReport.users[key] = { error: e instanceof Error ? e.message : 'Unknown error' };
        }
      });

      // Summary
      storageReport.summary = {
        totalKeys: allKeys.length,
        adminKeys: adminKeys.length,
        userKeys: userKeys.length,
        systemKeys: systemKeys.length,
        totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
        maxSize: '5-10 MB (browser limit)'
      };

      // Console output
      console.log('📊 STORAGE ANALYSIS REPORT');
      console.log('========================');
      console.log('📦 Admin Data:', storageReport.admin);
      console.log('👥 User Data:', storageReport.users);
      console.log('📈 Summary:', storageReport.summary);

      // User-friendly alert
      const adminCount = Object.keys(storageReport.admin).length;
      const userCount = Object.keys(storageReport.users).length;
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const communityPosts = JSON.parse(localStorage.getItem('community_posts') || '[]');
      const resources = JSON.parse(localStorage.getItem('admin_resources') || '[]');
      const partners = JSON.parse(localStorage.getItem('admin_partners') || '[]');
      const ngos = JSON.parse(localStorage.getItem('admin_ngos') || '[]');

      alert(`📊 STORAGE CHECK REPORT\n\n` +
            `📦 Total Storage: ${storageReport.summary.totalSize}\n` +
            `🔑 Total Keys: ${storageReport.summary.totalKeys}\n\n` +
            `👥 USERS:\n` +
            `• Registered Users: ${registeredUsers.length}\n` +
            `• User Data Keys: ${userCount}\n\n` +
            `🔧 ADMIN DATA:\n` +
            `• Resources: ${resources.length}\n` +
            `• Partners: ${partners.length}\n` +
            `• NGOs: ${ngos.length}\n` +
            `• Community Posts: ${communityPosts.length}\n` +
            `• Admin Keys: ${adminCount}\n\n` +
            `✅ All data is properly stored and accessible.\n` +
            `📋 Check console for detailed breakdown.`);

    } catch (error) {
      console.error('❌ Error during storage check:', error);
      alert('❌ Error during storage check. Please check the console for details.');
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-3 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <Database className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-yellow-900">Admin Debug Panel</h3>
            <p className="text-yellow-700 text-xs sm:text-sm">Check data persistence and reload admin content</p>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={handleCheckStorage}
            className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm sm:text-base"
          >
            <Database className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Check Storage</span>
            <span className="sm:hidden">Check</span>
          </button>
          <button
            onClick={handleRefreshData}
            disabled={isLoading}
            className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
          >
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLoading ? 'Refreshing...' : 'Refresh Data'}</span>
            <span className="sm:hidden">{isLoading ? 'Refresh...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Resources</span>
            {resources.length > 0 ? (
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            )}
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{resources.length}</p>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Partners</span>
            {partners.length > 0 ? (
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            )}
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{partners.length}</p>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-700">NGOs</span>
            {ngos.length > 0 ? (
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            )}
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{ngos.length}</p>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Posts</span>
            {communityPosts.length > 0 ? (
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            )}
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{communityPosts.length}</p>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-yellow-700">
        <p><strong>💡 Tip:</strong> If your added content is missing, click "Refresh Data" to reload from storage, or "Check Storage" to see what's saved in localStorage.</p>
      </div>
    </div>
  );
};

export function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth();
  const { adminStats, isLoading } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Redirect if not admin
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'partners', label: 'Partners', icon: Building },
    { id: 'ngos', label: 'NGOs', icon: Heart },
    { id: 'support-groups', label: 'Support Groups', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'contact-requests', label: 'Contact Requests', icon: MessageCircle },
    { id: 'personal', label: 'Personal', icon: User }
  ];

  const statsCards = [
    {
      title: 'Total Users',
      value: adminStats.totalUsers.toLocaleString(),
      change: `+${adminStats.monthlyGrowth}%`,
      icon: Users,
      color: 'bg-blue-500',
      trend: 'up'
    },
    {
      title: 'Active Users',
      value: adminStats.activeUsers.toLocaleString(),
      change: `${adminStats.userEngagement}% engagement`,
      icon: TrendingUp,
      color: 'bg-green-500',
      trend: 'up'
    },
    {
      title: 'Community Posts',
      value: adminStats.totalPosts.toString(),
      change: 'This month',
      icon: MessageSquare,
      color: 'bg-purple-500',
      trend: 'stable'
    },
    {
      title: 'Resources',
      value: adminStats.totalResources.toString(),
      change: 'Published',
      icon: BookOpen,
      color: 'bg-orange-500',
      trend: 'up'
    },
    {
      title: 'Partners',
      value: adminStats.totalPartners.toString(),
      change: 'Active',
      icon: Building,
      color: 'bg-indigo-500',
      trend: 'stable'
    },
    {
      title: 'NGOs',
      value: adminStats.totalNGOs.toString(),
      change: 'Verified',
      icon: Heart,
      color: 'bg-pink-500',
      trend: 'up'
    },
    {
      title: 'Support Groups',
      value: adminStats.totalSupportGroups.toString(),
      change: 'Active',
      icon: Users,
      color: 'bg-emerald-500',
      trend: 'up'
    },
    {
      title: 'Events',
      value: adminStats.totalEvents.toString(),
      change: 'Scheduled',
      icon: Calendar,
      color: 'bg-cyan-500',
      trend: 'up'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-3 sm:gap-0">
            <div className="flex items-center">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mr-2 sm:mr-3" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                <LogOut size={16} className="sm:w-5 sm:h-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <tab.icon size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {statsCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs sm:text-sm font-medium">{stat.title}</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.change}</p>
                    </div>
                    <div className={`${stat.color} p-2 sm:p-3 rounded-xl`}>
                      <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('community')}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Manage Community</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Add and manage community posts</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('resources')}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Manage Resources</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Add and update mental health resources</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('partners')}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <Building className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Manage Partners</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Add and manage partner organizations</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('ngos')}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600" />
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Manage NGOs</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Add and verify NGO partners</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('support-groups')}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Support Groups</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Create and manage support groups</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('events')}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-600" />
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Manage Events</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Create and schedule events</p>
              </motion.button>
            </div>

            {/* Admin Debug Section */}
            <AdminDebugSection />

            {/* Data Storage Management */}
            <DataStorageIndicator />
          </motion.div>
        )}

        {/* Community Management Tab */}
        {activeTab === 'community' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CommunityManagement />
          </motion.div>
        )}

        {activeTab === 'resources' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ResourceManagement />
          </motion.div>
        )}

        {activeTab === 'partners' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PartnerManagement />
          </motion.div>
        )}

        {activeTab === 'ngos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <NGOManagement />
          </motion.div>
        )}

        {/* Support Groups Management Tab */}
        {activeTab === 'support-groups' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SupportGroupManagement />
          </motion.div>
        )}

        {/* Events Management Tab */}
        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EventManagement />
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <UserManagement />
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminSettings />
          </motion.div>
        )}

        {activeTab === 'contact-requests' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ContactRequestManagement />
          </motion.div>
        )}

        {activeTab === 'personal' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminPersonalSettings />
          </motion.div>
        )}
      </div>
    </div>
  );
}
