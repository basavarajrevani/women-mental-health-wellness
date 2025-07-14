import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Download, 
  Upload,
  Camera,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Award,
  Calendar,
  MessageCircle,
  Heart,
  TrendingUp,
  Target,
  Activity
} from 'lucide-react';
import { useGlobalContext } from '../contexts/GlobalContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser } = useGlobalContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'privacy' | 'stats'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    avatar: currentUser?.avatar || '😊',
  });

  const avatarOptions = [
    '😊', '😎', '🤗', '😌', '🌟', '💪', '🧘‍♀️', '🧘‍♂️', '🌈', '🦋', 
    '🌸', '🌺', '🍀', '🌙', '☀️', '⭐', '💫', '🎨', '📚', '🎵',
    '🏃‍♀️', '🏃‍♂️', '🧠', '❤️', '💚', '💙', '💜', '🧡', '💛', '🤍'
  ];

  const handleSaveProfile = () => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      username: editForm.username,
      email: editForm.email,
      avatar: editForm.avatar,
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('current_user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handlePreferenceChange = (key: string, value: any) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        [key]: value,
      },
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('current_user', JSON.stringify(updatedUser));
  };

  const exportUserData = () => {
    if (!currentUser) return;

    const userData = {
      profile: currentUser,
      exportDate: new Date().toISOString(),
      dataTypes: ['profile', 'preferences', 'stats'],
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-profile-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Debug logging - must be before any early returns
  React.useEffect(() => {
    if (isOpen) {
      console.log('👤 UserProfile modal opened');
    } else {
      console.log('👤 UserProfile modal closed');
    }
  }, [isOpen]);

  if (!currentUser) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg sm:text-2xl flex-shrink-0">
                    {currentUser.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-2xl font-bold truncate">{currentUser.username}</h2>
                    <p className="text-blue-100 text-sm sm:text-base truncate">{currentUser.email}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                      <span className="text-xs sm:text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full self-start">
                        {currentUser.role}
                      </span>
                      <span className="text-xs sm:text-sm text-blue-100">
                        Member since {new Date(currentUser.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors self-start sm:self-auto"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                {[
                  { key: 'profile', label: 'Profile', icon: User },
                  { key: 'preferences', label: 'Preferences', icon: Settings },
                  { key: 'privacy', label: 'Privacy', icon: Shield },
                  { key: 'stats', label: 'Statistics', icon: TrendingUp },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center gap-1 sm:gap-2 px-3 py-3 sm:px-6 sm:py-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                        activeTab === tab.key
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.charAt(0)}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 max-h-80 sm:max-h-96 overflow-y-auto">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Profile Information</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Avatar
                        </label>
                        <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-2">
                          {avatarOptions.map((avatar) => (
                            <button
                              key={avatar}
                              onClick={() => setEditForm({ ...editForm, avatar })}
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm sm:text-lg transition-colors ${
                                editForm.avatar === avatar
                                  ? 'bg-blue-100 border-2 border-blue-600'
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                            >
                              {avatar}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Username</label>
                          <p className="text-lg text-gray-900">{currentUser.username}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-lg text-gray-900">{currentUser.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Role</label>
                          <p className="text-lg text-gray-900 capitalize">{currentUser.role}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Member Since</label>
                          <p className="text-lg text-gray-900">
                            {new Date(currentUser.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Last Seen</label>
                          <p className="text-lg text-gray-900">
                            {new Date(currentUser.lastSeen).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              currentUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                            <span className="text-lg text-gray-900">
                              {currentUser.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications for community activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentUser.preferences.notifications}
                          onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Public Profile</h4>
                        <p className="text-sm text-gray-600">Allow others to see your profile information</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentUser.preferences.publicProfile}
                          onChange={(e) => handlePreferenceChange('publicProfile', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Share Progress</h4>
                        <p className="text-sm text-gray-600">Share your mental health progress with the community</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentUser.preferences.shareProgress}
                          onChange={(e) => handlePreferenceChange('shareProgress', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Theme</h4>
                      <div className="flex gap-2">
                        {['light', 'dark', 'auto'].map((theme) => (
                          <button
                            key={theme}
                            onClick={() => handlePreferenceChange('theme', theme)}
                            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                              currentUser.preferences.theme === theme
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Privacy & Security</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Data Export</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Download all your data including profile, preferences, and activity history.
                      </p>
                      <button
                        onClick={exportUserData}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Export Data
                      </button>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
                      <p className="text-sm text-red-700 mb-4">
                        These actions cannot be undone. Please be careful.
                      </p>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Delete All Data
                        </button>
                        <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Statistics Tab */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Your Statistics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{currentUser.stats.postsCount}</p>
                          <p className="text-sm text-blue-700">Posts Created</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Heart className="h-8 w-8 text-red-600" />
                        <div>
                          <p className="text-2xl font-bold text-red-600">{currentUser.stats.likesReceived}</p>
                          <p className="text-sm text-red-700">Likes Received</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Award className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold text-green-600">{currentUser.stats.helpfulVotes}</p>
                          <p className="text-sm text-green-700">Helpful Votes</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-purple-600" />
                        <div>
                          <p className="text-2xl font-bold text-purple-600">{currentUser.stats.daysActive}</p>
                          <p className="text-sm text-purple-700">Days Active</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Community Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">
                          {Math.round((currentUser.stats.likesReceived / Math.max(currentUser.stats.postsCount, 1)) * 10) / 10}
                        </p>
                        <p className="text-sm text-gray-600">Avg Likes per Post</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">
                          {currentUser.stats.helpfulVotes > 50 ? 'Expert' : 
                           currentUser.stats.helpfulVotes > 20 ? 'Helper' : 
                           currentUser.stats.helpfulVotes > 5 ? 'Contributor' : 'Newcomer'}
                        </p>
                        <p className="text-sm text-gray-600">Community Level</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">
                          {Math.round((currentUser.stats.daysActive / Math.max(1, Math.floor((Date.now() - new Date(currentUser.joinDate).getTime()) / (1000 * 60 * 60 * 24)))) * 100)}%
                        </p>
                        <p className="text-sm text-gray-600">Activity Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserProfile;
