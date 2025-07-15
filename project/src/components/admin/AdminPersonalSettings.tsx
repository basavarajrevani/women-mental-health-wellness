import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Save,
  Edit3,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Camera,
  MapPin,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminPersonalInfo {
  name: string;
  email: string;
  phone: string;
  contactEmail: string; // Email shown to users in Contact Us page
  contactPhone: string; // Phone shown to users in Contact Us page
  location: string;
  bio: string;
  avatar: string;
}

interface AdminCredentials {
  email: string;
  password: string;
  name: string;
}

export const AdminPersonalSettings: React.FC = () => {
  console.log('👨‍💼 AdminPersonalSettings component loaded');
  const { user } = useAuth();
  console.log('👤 User in AdminPersonalSettings:', user);
  const [personalInfo, setPersonalInfo] = useState<AdminPersonalInfo>({
    name: user?.name || 'Admin',
    email: user?.email || 'admin@mental-wellness.app',
    phone: '',
    contactEmail: 'admin@mental-wellness.app',
    contactPhone: '+1 (555) 123-HELP',
    location: 'Mental Health Wellness Center',
    bio: 'Dedicated to providing comprehensive mental health support and resources.',
    avatar: '👨‍💼'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>({
    email: 'basavarajrevani123@gmail.com',
    password: 'Basu@15032002',
    name: 'Admin'
  });

  const [isEditingCredentials, setIsEditingCredentials] = useState(false);

  const avatarOptions = [
    '👨‍💼', '👩‍💼', '🧑‍💼', '👨‍⚕️', '👩‍⚕️', '🧑‍⚕️', 
    '👨‍🏫', '👩‍🏫', '🧑‍🏫', '🧠', '💼', '🏥', '❤️', '🌟'
  ];

  useEffect(() => {
    // Load saved admin personal info
    const savedInfo = localStorage.getItem('admin_personal_info');
    if (savedInfo) {
      setPersonalInfo(JSON.parse(savedInfo));
    }

    // Load admin credentials
    const savedCredentials = localStorage.getItem('admin_credentials');
    if (savedCredentials) {
      setAdminCredentials(JSON.parse(savedCredentials));
    }
  }, []);

  const handleInputChange = (field: keyof AdminPersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');

    try {
      // Save to localStorage
      localStorage.setItem('admin_personal_info', JSON.stringify(personalInfo));

      // Update contact info for users (this will reflect in Contact Us page)
      const contactInfo = {
        adminEmail: personalInfo.contactEmail,
        adminPhone: personalInfo.contactPhone,
        adminName: personalInfo.name,
        location: personalInfo.location,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('admin_contact_info', JSON.stringify(contactInfo));

      // Sync personal email with admin credentials if they match
      const currentCredentials = JSON.parse(localStorage.getItem('admin_credentials') || '{}');
      if (personalInfo.email !== currentCredentials.email) {
        const updatedCredentials = {
          ...currentCredentials,
          email: personalInfo.email,
          name: personalInfo.name
        };
        localStorage.setItem('admin_credentials', JSON.stringify(updatedCredentials));
        setAdminCredentials(updatedCredentials);
        console.log('🔄 Admin login credentials synced with personal info');
      }

      console.log('✅ Admin personal settings saved:', personalInfo);
      console.log('📧 Contact info updated for users:', contactInfo);

      setSaveStatus('success');
      setIsEditing(false);

      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);

    } catch (error) {
      console.error('❌ Error saving admin settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleCredentialsChange = (field: keyof AdminCredentials, value: string) => {
    setAdminCredentials(prev => ({ ...prev, [field]: value }));
  };

  const saveAdminCredentials = async () => {
    setSaveStatus('saving');

    try {
      // Save admin credentials
      localStorage.setItem('admin_credentials', JSON.stringify(adminCredentials));

      console.log('🔐 Admin credentials updated:', {
        email: adminCredentials.email,
        name: adminCredentials.name
      });

      setSaveStatus('success');
      setIsEditingCredentials(false);

      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);

    } catch (error) {
      console.error('❌ Error saving admin credentials:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    // Update admin credentials with new password
    const updatedCredentials = {
      ...adminCredentials,
      password: passwordForm.newPassword
    };

    setAdminCredentials(updatedCredentials);
    localStorage.setItem('admin_credentials', JSON.stringify(updatedCredentials));

    console.log('🔐 Admin password updated successfully');
    alert('Password updated successfully! Use the new password for future logins.');

    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Settings</h2>
          <p className="text-gray-600">Manage your personal information and contact details</p>
        </div>
        
        {saveStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-green-600 bg-green-100 px-4 py-2 rounded-lg"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Settings saved successfully!</span>
          </motion.div>
        )}
        
        {saveStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-red-600 bg-red-100 px-4 py-2 rounded-lg"
          >
            <AlertCircle className="h-4 w-4" />
            <span>Error saving settings</span>
          </motion.div>
        )}
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Avatar Selection */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                {personalInfo.avatar}
              </div>
              {isEditing && (
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => handleInputChange('avatar', avatar)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors ${
                        personalInfo.avatar === avatar
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={personalInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-gray-900 py-2">{personalInfo.name}</p>
            )}
          </div>

          {/* Personal Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Personal Email</label>
            {isEditing ? (
              <input
                type="email"
                value={personalInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            ) : (
              <p className="text-gray-900 py-2">{personalInfo.email}</p>
            )}
          </div>

          {/* Personal Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Personal Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            ) : (
              <p className="text-gray-900 py-2">{personalInfo.phone || 'Not provided'}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            {isEditing ? (
              <input
                type="text"
                value={personalInfo.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="City, State/Country"
              />
            ) : (
              <p className="text-gray-900 py-2">{personalInfo.location}</p>
            )}
          </div>

          {/* Bio */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            {isEditing ? (
              <textarea
                value={personalInfo.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Brief description about yourself and your role"
              />
            ) : (
              <p className="text-gray-900 py-2">{personalInfo.bio}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Public Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Public Contact Information</h3>
            <p className="text-sm text-gray-600 mt-1">
              This information will be displayed to users on the Contact Us page
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            {isEditing ? 'Cancel' : 'Edit Contact Info'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email (Public)
            </label>
            {isEditing ? (
              <input
                type="email"
                value={personalInfo.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="admin@mental-wellness.app"
              />
            ) : (
              <div className="flex items-center gap-2 py-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-900">{personalInfo.contactEmail}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Users will see this email address when they need to contact support
            </p>
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone (Public)
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={personalInfo.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+1 (555) 123-HELP"
              />
            ) : (
              <div className="flex items-center gap-2 py-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-900">{personalInfo.contactPhone}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Users will see this phone number for direct support calls
            </p>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Contact Info
                </>
              )}
            </button>
          </div>
        )}

        {/* Preview */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Preview - How users will see this:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">Email Us</p>
                <p className="text-sm">{personalInfo.contactEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">Call Us</p>
                <p className="text-sm">{personalInfo.contactPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handlePasswordChange}
            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            Change Password
          </button>
        </div>
      </div>

      {/* Admin Login Credentials */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Admin Login Credentials</h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage your admin login email and password. Changes apply immediately to login.
            </p>
          </div>
          <button
            onClick={() => setIsEditingCredentials(!isEditingCredentials)}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            {isEditingCredentials ? 'Cancel' : 'Edit Credentials'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admin Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
            {isEditingCredentials ? (
              <input
                type="email"
                value={adminCredentials.email}
                onChange={(e) => handleCredentialsChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            ) : (
              <div className="flex items-center gap-2 py-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-900 font-mono">{adminCredentials.email}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              This email is used for admin login access
            </p>
          </div>

          {/* Admin Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name</label>
            {isEditingCredentials ? (
              <input
                type="text"
                value={adminCredentials.name}
                onChange={(e) => handleCredentialsChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Admin Name"
              />
            ) : (
              <div className="flex items-center gap-2 py-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-900">{adminCredentials.name}</span>
              </div>
            )}
          </div>

          {/* Current Password Display */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="flex items-center gap-2 py-2">
              <Lock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-900 font-mono">{'•'.repeat(adminCredentials.password.length)}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({adminCredentials.password.length} characters)
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use the password change section below to update your password
            </p>
          </div>
        </div>

        {isEditingCredentials && (
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              onClick={() => setIsEditingCredentials(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveAdminCredentials}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Credentials
                </>
              )}
            </button>
          </div>
        )}

        {/* Current Credentials Display */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">Current Login Credentials:</h4>
          <div className="text-sm text-yellow-800 space-y-1 font-mono">
            <p><strong>Email:</strong> {adminCredentials.email}</p>
            <p><strong>Password:</strong> {adminCredentials.password}</p>
          </div>
          <p className="text-xs text-yellow-700 mt-2">
            These credentials are displayed on the login page for admin access.
          </p>
        </div>
      </div>
    </div>
  );
};
