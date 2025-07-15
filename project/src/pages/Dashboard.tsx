import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '../components/layout/Navigation';
import { ResourceCard } from '../components/dashboard/ResourceCard';
import { ProgressTracker } from '../components/dashboard/ProgressTracker';
import {
  LogOut,
  Heart,
  TrendingUp,
  Calendar,
  Users,
  BookOpen,
  Shield,
  Award,
  RefreshCw
} from 'lucide-react';
import EmergencyCard from '../components/dashboard/EmergencyCard';
import SafetyPlanCard from '../components/dashboard/SafetyPlanCard';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { useNavigate } from 'react-router-dom';
import { RealTimeCommunityFeed } from '../components/user/RealTimeCommunityFeed';


export function Dashboard() {
  console.log('📊 Dashboard component loading...');
  const { user, logout } = useAuth();
  console.log('👤 Dashboard user:', user?.email);
  const {
    profile,
    progressMetrics,
    moodEntries,
    sessions,
    communityActivity,
    upcomingEvents,
    isLoading,
    lastUpdated,
    refreshData,
    addMoodEntry
  } = useUserData();
  const navigate = useNavigate();



  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleQuickMoodEntry = (mood: number) => {
    addMoodEntry(mood, `Quick mood check: ${mood}/10`);
  };

  const resources = [
    {
      title: "Mindfulness Meditation",
      description: "Guided meditation sessions tailored for stress relief and anxiety management.",
      imageUrl: "https://i.pinimg.com/736x/12/29/15/1229152f0c674df114d92cfe2bcbcc30.jpg",
      tag: "Self-Care"
    },
    {
      title: "Professional Counseling",
      description: "Connect with licensed therapists specializing in women's mental health.",
      imageUrl: "https://i.pinimg.com/736x/95/3d/6d/953d6d0c48de448247870ed5740e4b7e.jpg",
      tag: "Therapy"
    },
    {
      title: "Support Groups",
      description: "Join moderated group sessions with women facing similar challenges.",
      imageUrl: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&q=80",
      tag: "Community"
    }
  ];

  const getCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return lastUpdated.toLocaleDateString();
  };

  // Real-time stats from user data
  const stats = [
    {
      label: 'Days Active',
      value: progressMetrics.daysActive.toString(),
      icon: Calendar,
      color: 'bg-blue-500',
      trend: '+2 this week'
    },
    {
      label: 'Mood Score',
      value: progressMetrics.averageMood.toFixed(1),
      icon: Heart,
      color: 'bg-pink-500',
      trend: moodEntries.length > 1 ?
        (moodEntries[0].mood > moodEntries[1].mood ? '+0.3 today' : '-0.1 today') :
        'First entry'
    },
    {
      label: 'Sessions',
      value: progressMetrics.totalSessions.toString(),
      icon: Users,
      color: 'bg-purple-500',
      trend: `${Math.round(progressMetrics.weeklyGoalProgress)}% weekly goal`
    },
    {
      label: 'Streak',
      value: progressMetrics.currentStreak.toString(),
      icon: Award,
      color: 'bg-green-500',
      trend: 'Keep it up!'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navigation />

      <main className="lg:ml-64 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white relative overflow-hidden"
          >
            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
                <div className="h-full bg-white/60 animate-pulse"></div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    {getCurrentTime()}, {profile?.name || user?.name || 'Friend'}! 🌸
                  </h1>
                  {!isLoading && (
                    <motion.button
                      whileHover={{ rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={refreshData}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"
                      title="Refresh data"
                    >
                      <RefreshCw size={16} />
                    </motion.button>
                  )}
                </div>
                <p className="text-purple-100 text-sm sm:text-base lg:text-lg mb-2">
                  You're doing amazing on your wellness journey. Here's your personalized dashboard.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-purple-200">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
                    <span>{isLoading ? 'Updating...' : 'Live data'}</span>
                  </div>
                  <span>•</span>
                  <span>Last updated: {formatLastUpdated()}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all cursor-pointer group"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium">{stat.label}</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
                  </div>
                  <div className={`${stat.color} p-2 sm:p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                {/* Progress bar for visual feedback */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${stat.color} transition-all duration-1000`}
                    style={{
                      width: stat.label === 'Mood Score' ? `${(parseFloat(stat.value) / 10) * 100}%` :
                             stat.label === 'Sessions' ? `${progressMetrics.weeklyGoalProgress}%` :
                             stat.label === 'Streak' ? `${Math.min(100, (parseInt(stat.value) / 30) * 100)}%` :
                             `${Math.min(100, (parseInt(stat.value) / 50) * 100)}%`
                    }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Resources Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mr-2" />
                Recommended for You
              </h2>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base self-start sm:self-auto">
                View All Resources →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <ResourceCard {...resource} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Emergency Support & Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Safety & Progress</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <EmergencyCard />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <SafetyPlanCard />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="lg:col-span-1"
              >
                <ProgressTracker />
              </motion.div>
            </div>
          </motion.div>

          {/* Real-Time Community Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <RealTimeCommunityFeed />
          </motion.div>

          {/* Quick Mood Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Heart className="h-5 w-5 text-pink-600 mr-2" />
                  Quick Mood Check
                </h3>
                <p className="text-gray-600">How are you feeling right now?</p>
              </div>
              {moodEntries.length > 0 && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last entry</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {moodEntries[0].mood}/10
                  </p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                <motion.button
                  key={mood}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuickMoodEntry(mood)}
                  className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                    mood <= 3 ? 'border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600' :
                    mood <= 6 ? 'border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50 text-yellow-600' :
                    'border-green-200 hover:border-green-400 hover:bg-green-50 text-green-600'
                  }`}
                >
                  {mood}
                </motion.button>
              ))}
            </div>
            {moodEntries.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Recent trend:</strong> {
                    moodEntries.slice(0, 3).reduce((sum, entry) => sum + entry.mood, 0) / Math.min(3, moodEntries.length)
                  }/10 average over last 3 entries
                </p>
              </div>
            )}
          </motion.div>



          {/* Real-time Community Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {/* Recent Community Posts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  Community Activity
                </h3>
                <span className="text-sm text-gray-500">Live updates</span>
              </div>
              <div className="space-y-4">
                {communityActivity.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-800">{activity.title}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{activity.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>by {activity.author}</span>
                      <span>❤️ {activity.likes}</span>
                      <span>💬 {activity.replies}</span>
                    </div>
                  </div>
                ))}
                {communityActivity.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>

            {/* Recent Sessions Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                Recent Sessions
              </h3>
              <div className="space-y-3">
                {sessions.slice(0, 4).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">{session.title}</h4>
                      <p className="text-sm text-gray-600">{session.date} • {session.duration}min</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.completed && (
                        <>
                          <span className="text-green-600 text-sm">✓</span>
                          {session.rating && (
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < session.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No sessions yet</p>
                )}
              </div>
            </div>
          </motion.div>





          {/* Motivational Quote Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Daily Inspiration</h3>
            <blockquote className="text-lg italic mb-4">
              "You are braver than you believe, stronger than you seem, and more loved than you know."
            </blockquote>
            <p className="text-purple-100">— A.A. Milne</p>
            <div className="mt-4 text-sm text-purple-200">
              Keep going, {profile?.name || 'friend'}. Every step forward is progress! 🌟
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}