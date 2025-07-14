import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Calendar, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { useUserData } from '../../context/UserDataContext';
import { RealTimeStatus, RealTimePulse } from '../common/RealTimeStatus';
import { useComponentRealTime } from '../../hooks/useRealTimeData';

export function ProgressTracker() {
  const { progressMetrics, moodEntries, sessions } = useUserData();
  const { componentUpdateCount } = useComponentRealTime('ProgressTracker');

  // Calculate mood trend
  const getMoodTrend = () => {
    if (moodEntries.length < 2) return { direction: 'stable', text: 'Not enough data', color: 'text-gray-600' };

    const recent = moodEntries.slice(0, 3);
    const older = moodEntries.slice(3, 6);

    if (recent.length === 0 || older.length === 0) return { direction: 'stable', text: 'Not enough data', color: 'text-gray-600' };

    const recentAvg = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
    const olderAvg = older.reduce((sum, entry) => sum + entry.mood, 0) / older.length;

    const diff = recentAvg - olderAvg;

    if (diff > 0.5) return { direction: 'up', text: '↑ Improving', color: 'text-green-600' };
    if (diff < -0.5) return { direction: 'down', text: '↓ Declining', color: 'text-red-600' };
    return { direction: 'stable', text: '→ Stable', color: 'text-blue-600' };
  };

  const moodTrend = getMoodTrend();
  const completedSessions = sessions.filter(s => s.completed).length;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Progress</h2>
        <div className="flex items-center gap-2">
          <RealTimePulse isActive={true} size="sm" />
          <RealTimeStatus showText={false} size="sm" />
        </div>
      </div>

      <div className="space-y-4">
        <motion.div
          className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
          whileHover={{ scale: 1.02 }}
          key={`streak-${componentUpdateCount}`}
        >
          <div className="flex items-center space-x-2">
            <Calendar className="text-purple-600" size={20} />
            <span className="font-medium">Current Streak</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg text-purple-600">
              {progressMetrics.currentStreak} days
            </span>
            <p className="text-xs text-gray-500">Keep it up!</p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
          whileHover={{ scale: 1.02 }}
          key={`sessions-${componentUpdateCount}`}
        >
          <div className="flex items-center space-x-2">
            <Trophy className="text-green-600" size={20} />
            <span className="font-medium">Completed Sessions</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg text-green-600">
              {completedSessions}
            </span>
            <p className="text-xs text-gray-500">
              {Math.round(progressMetrics.weeklyGoalProgress)}% weekly goal
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
          whileHover={{ scale: 1.02 }}
          key={`mood-${componentUpdateCount}`}
        >
          <div className="flex items-center space-x-2">
            {moodTrend.direction === 'up' ? (
              <TrendingUp className="text-green-600" size={20} />
            ) : moodTrend.direction === 'down' ? (
              <TrendingDown className="text-red-600" size={20} />
            ) : (
              <LineChart className="text-blue-600" size={20} />
            )}
            <span className="font-medium">Mood Trend</span>
          </div>
          <div className="text-right">
            <span className={`font-semibold ${moodTrend.color}`}>
              {moodTrend.text}
            </span>
            <p className="text-xs text-gray-500">
              Avg: {progressMetrics.averageMood.toFixed(1)}/10
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
          whileHover={{ scale: 1.02 }}
          key={`active-${componentUpdateCount}`}
        >
          <div className="flex items-center space-x-2">
            <Calendar className="text-yellow-600" size={20} />
            <span className="font-medium">Days Active</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg text-yellow-600">
              {progressMetrics.daysActive}
            </span>
            <p className="text-xs text-gray-500">Total days</p>
          </div>
        </motion.div>
      </div>

      {/* Real-time update indicator */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Live tracking enabled</span>
          <RealTimeStatus showText={true} size="sm" />
        </div>
      </div>
    </motion.div>
  );
}