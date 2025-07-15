import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { syncHelpers } from '../../services/RealTimeSync';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Mail,
  Lock,
  Users,
  MessageSquare,
  Heart,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface AdminSettings {
  // Site Settings
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  
  // Feature Settings
  enableRegistration: boolean;
  enableCommunityPosts: boolean;
  enableMoodTracking: boolean;
  enableNotifications: boolean;
  enableCrisisSupport: boolean;
  
  // Moderation Settings
  requirePostApproval: boolean;
  enableProfanityFilter: boolean;
  maxPostLength: number;
  maxCommentsPerPost: number;
  
  // Notification Settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  notificationFrequency: 'immediate' | 'hourly' | 'daily';
  
  // Privacy Settings
  allowDataExport: boolean;
  dataRetentionDays: number;
  requirePrivacyConsent: boolean;
  
  // Theme Settings
  primaryColor: string;
  secondaryColor: string;
  darkModeEnabled: boolean;
  customCSS: string;
}

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AdminSettings>({
    // Site Settings
    siteName: 'Mental Health Wellness Platform',
    siteDescription: 'A comprehensive platform for mental health support and wellness tracking',
    siteUrl: 'https://mental-wellness.app',
    adminEmail: 'admin@mental-wellness.app',
    
    // Feature Settings
    enableRegistration: true,
    enableCommunityPosts: true,
    enableMoodTracking: true,
    enableNotifications: true,
    enableCrisisSupport: true,
    
    // Moderation Settings
    requirePostApproval: false,
    enableProfanityFilter: true,
    maxPostLength: 1000,
    maxCommentsPerPost: 50,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    notificationFrequency: 'immediate',
    
    // Privacy Settings
    allowDataExport: true,
    dataRetentionDays: 365,
    requirePrivacyConsent: true,
    
    // Theme Settings
    primaryColor: '#7c3aed',
    secondaryColor: '#ec4899',
    darkModeEnabled: true,
    customCSS: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
        console.log('📋 Admin settings loaded from storage');
      } catch (error) {
        console.error('❌ Error loading admin settings:', error);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Save to localStorage
      localStorage.setItem('admin_settings', JSON.stringify(settings));

      // Apply theme changes immediately
      applyThemeSettings();

      // Emit real-time event for settings update
      syncHelpers.settingsUpdated(settings, user?.id);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSaveStatus('success');
      console.log('✅ Admin settings saved successfully');

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('❌ Error saving admin settings:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const applyThemeSettings = () => {
    // Apply CSS custom properties for theme colors
    const root = document.documentElement;
    root.style.setProperty('--primary-color', settings.primaryColor);
    root.style.setProperty('--secondary-color', settings.secondaryColor);
    
    // Apply custom CSS if provided
    if (settings.customCSS) {
      let customStyleElement = document.getElementById('admin-custom-styles');
      if (!customStyleElement) {
        customStyleElement = document.createElement('style');
        customStyleElement.id = 'admin-custom-styles';
        document.head.appendChild(customStyleElement);
      }
      customStyleElement.textContent = settings.customCSS;
    }
    
    console.log('🎨 Theme settings applied');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      localStorage.removeItem('admin_settings');
      window.location.reload();
    }
  };

  const updateSetting = (key: keyof AdminSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Settings</h2>
          <p className="text-gray-600 text-sm sm:text-base">Configure platform settings and preferences</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
          >
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Reset</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
          >
            <Save className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Settings'}</span>
            <span className="sm:hidden">{isSaving ? 'Save...' : 'Save'}</span>
          </motion.button>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 p-3 sm:p-4 rounded-lg ${
            saveStatus === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {saveStatus === 'success' ? (
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
          <span className="text-sm sm:text-base">
            {saveStatus === 'success'
              ? 'Settings saved successfully!'
              : 'Error saving settings. Please try again.'
            }
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Site Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Site Settings</h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Site Description
              </label>
              <textarea
                rows={3}
                value={settings.siteDescription}
                onChange={(e) => updateSetting('siteDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site URL
              </label>
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => updateSetting('siteUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => updateSetting('adminEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Feature Settings</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.enableRegistration}
                onChange={(e) => updateSetting('enableRegistration', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Enable User Registration</span>
                <p className="text-xs text-gray-600">Allow new users to create accounts</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.enableCommunityPosts}
                onChange={(e) => updateSetting('enableCommunityPosts', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Enable Community Posts</span>
                <p className="text-xs text-gray-600">Allow users to create and share posts</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.enableMoodTracking}
                onChange={(e) => updateSetting('enableMoodTracking', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Enable Mood Tracking</span>
                <p className="text-xs text-gray-600">Allow users to track their mood and wellness</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => updateSetting('enableNotifications', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Enable Notifications</span>
                <p className="text-xs text-gray-600">Send notifications to users</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.enableCrisisSupport}
                onChange={(e) => updateSetting('enableCrisisSupport', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Enable Crisis Support</span>
                <p className="text-xs text-gray-600">Provide crisis intervention resources</p>
              </div>
            </label>
          </div>
        </div>

        {/* Moderation Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Moderation Settings</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requirePostApproval}
                onChange={(e) => updateSetting('requirePostApproval', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Require Post Approval</span>
                <p className="text-xs text-gray-600">All posts must be approved before publishing</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.enableProfanityFilter}
                onChange={(e) => updateSetting('enableProfanityFilter', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Enable Profanity Filter</span>
                <p className="text-xs text-gray-600">Automatically filter inappropriate content</p>
              </div>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Post Length (characters)
              </label>
              <input
                type="number"
                min="100"
                max="5000"
                value={settings.maxPostLength}
                onChange={(e) => updateSetting('maxPostLength', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Comments Per Post
              </label>
              <input
                type="number"
                min="10"
                max="200"
                value={settings.maxCommentsPerPost}
                onChange={(e) => updateSetting('maxCommentsPerPost', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                <p className="text-xs text-gray-600">Send notifications via email</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Push Notifications</span>
                <p className="text-xs text-gray-600">Send browser push notifications</p>
              </div>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Frequency
              </label>
              <select
                value={settings.notificationFrequency}
                onChange={(e) => updateSetting('notificationFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="immediate">Immediate</option>
                <option value="hourly">Hourly Digest</option>
                <option value="daily">Daily Digest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.allowDataExport}
                onChange={(e) => updateSetting('allowDataExport', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Allow Data Export</span>
                <p className="text-xs text-gray-600">Users can export their data</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requirePrivacyConsent}
                onChange={(e) => updateSetting('requirePrivacyConsent', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Require Privacy Consent</span>
                <p className="text-xs text-gray-600">Users must consent to privacy policy</p>
              </div>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Retention (days)
              </label>
              <input
                type="number"
                min="30"
                max="3650"
                value={settings.dataRetentionDays}
                onChange={(e) => updateSetting('dataRetentionDays', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-600 mt-1">How long to keep user data after account deletion</p>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-5 w-5 text-pink-600" />
            <h3 className="text-lg font-semibold text-gray-900">Theme Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => updateSetting('primaryColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => updateSetting('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.darkModeEnabled}
                onChange={(e) => updateSetting('darkModeEnabled', e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Enable Dark Mode</span>
                <p className="text-xs text-gray-600">Allow users to switch to dark theme</p>
              </div>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom CSS
              </label>
              <textarea
                rows={4}
                value={settings.customCSS}
                onChange={(e) => updateSetting('customCSS', e.target.value)}
                placeholder="/* Add custom CSS styles here */"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-600 mt-1">Custom CSS will be applied site-wide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
