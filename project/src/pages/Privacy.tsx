import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Bell, Settings, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Data Protection",
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      content: "We employ industry-standard encryption and security measures to protect your personal information. Your data is stored securely and is never shared without your explicit consent."
    },
    {
      title: "Confidentiality",
      icon: <Lock className="w-6 h-6 text-purple-600" />,
      content: "All conversations and interactions within our platform are strictly confidential. Our mental health professionals adhere to professional ethics and privacy standards."
    },
    {
      title: "Privacy Controls",
      icon: <Eye className="w-6 h-6 text-purple-600" />,
      content: "You have full control over your privacy settings. Choose what information to share and who can see your activity within the community."
    },
    {
      title: "Terms of Service",
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      content: "Our terms of service are designed to protect both users and mental health professionals. We maintain transparent policies about data usage and user rights."
    }
  ];

  const privacySettings = [
    {
      title: "Profile Visibility",
      description: "Control who can see your profile and activity",
      options: ["Public", "Friends Only", "Private"],
      currentSetting: "Friends Only"
    },
    {
      title: "Notifications",
      description: "Manage your notification preferences",
      options: ["All", "Important Only", "None"],
      currentSetting: "Important Only"
    },
    {
      title: "Data Sharing",
      description: "Choose what data to share with our partners",
      options: ["Full Access", "Limited", "None"],
      currentSetting: "Limited"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy & Security</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy and security are our top priorities. Learn about how we protect your data and manage your privacy settings.
            </p>
          </motion.div>
        </div>

        {/* Privacy Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center gap-3 mb-4">
                {section.icon}
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              </div>
              <p className="text-gray-600">{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
            </div>
          </div>
          <div className="divide-y">
            {privacySettings.map((setting, index) => (
              <div key={index} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{setting.title}</h3>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <select
                    className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    defaultValue={setting.currentSetting}
                  >
                    {setting.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                "Email notifications for new messages",
                "Push notifications for community updates",
                "Weekly progress report emails",
                "Important announcements",
                "Newsletter and updates"
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={index < 3} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
