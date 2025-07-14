import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react';
import { useRealTimeSync } from '../../services/RealTimeSync';
import { useGlobalData } from '../../context/GlobalDataContext';

interface RealTimeSyncIndicatorProps {
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  showDetails?: boolean;
  className?: string;
}

export const RealTimeSyncIndicator: React.FC<RealTimeSyncIndicatorProps> = ({
  position = 'bottom-right',
  showDetails = false,
  className = ''
}) => {
  const { lastUpdated, updateCount } = useGlobalData();
  const { isConnected, eventCount, lastEvent } = useRealTimeSync();
  const [showTooltip, setShowTooltip] = useState(false);
  const [recentActivity, setRecentActivity] = useState(false);

  // Show activity indicator when new events arrive
  useEffect(() => {
    if (lastEvent) {
      setRecentActivity(true);
      const timer = setTimeout(() => setRecentActivity(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastEvent]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      case 'bottom-left': return 'bottom-4 left-4';
      default: return 'bottom-4 right-4';
    }
  };

  const getStatusColor = () => {
    if (!isConnected) return 'text-red-500 bg-red-50';
    if (recentActivity) return 'text-green-500 bg-green-50';
    return 'text-blue-500 bg-blue-50';
  };

  const getStatusIcon = () => {
    if (!isConnected) return <WifiOff className="h-4 w-4" />;
    if (recentActivity) return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <RefreshCw className="h-4 w-4" />
      </motion.div>
    );
    return <Wifi className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (!isConnected) return 'Offline';
    if (recentActivity) return 'Syncing...';
    return 'Live';
  };

  const formatLastUpdate = () => {
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

  const getEventTypeEmoji = (type: string) => {
    switch (type) {
      case 'community_post': return '💬';
      case 'resource': return '📚';
      case 'partner': return '🏢';
      case 'ngo': return '❤️';
      default: return '📡';
    }
  };

  return (
    <div className={`fixed z-50 ${getPositionClasses()} ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Main Indicator */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border backdrop-blur-sm cursor-pointer ${getStatusColor()}`}
        >
          {getStatusIcon()}
          {showDetails && (
            <span className="text-xs font-medium">{getStatusText()}</span>
          )}
          
          {/* Activity Pulse */}
          {recentActivity && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          
          {/* Event Count Badge */}
          {eventCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              {eventCount > 99 ? '99+' : eventCount}
            </motion.div>
          )}
        </motion.div>

        {/* Detailed Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={`absolute ${
                position.includes('bottom') ? 'bottom-full mb-2' : 'top-full mt-2'
              } ${
                position.includes('right') ? 'right-0' : 'left-0'
              } bg-white rounded-lg shadow-xl border p-4 min-w-64 z-10`}
            >
              <div className="space-y-3">
                {/* Status Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon()}
                    <span className="font-semibold text-gray-900">{getStatusText()}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                    Real-time
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    <span className="text-gray-600">Events: {eventCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-3 w-3 text-blue-500" />
                    <span className="text-gray-600">Updates: {updateCount}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">Last update: {formatLastUpdate()}</span>
                  </div>
                </div>

                {/* Recent Activity */}
                {lastEvent && (
                  <div className="border-t pt-3">
                    <div className="text-xs font-medium text-gray-700 mb-2">Recent Activity:</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{getEventTypeEmoji(lastEvent.type)}</span>
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {lastEvent.type.replace('_', ' ')} {lastEvent.action}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(lastEvent.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Connection Status */}
                <div className="border-t pt-3">
                  <div className="flex items-center gap-2 text-sm">
                    {isConnected ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-700">Connected to live updates</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-700">Connection lost</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Compact version for navigation bars
export const CompactSyncIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isConnected, eventCount } = useRealTimeSync();
  const [recentActivity, setRecentActivity] = useState(false);

  useEffect(() => {
    if (eventCount > 0) {
      setRecentActivity(true);
      const timer = setTimeout(() => setRecentActivity(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [eventCount]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <motion.div
          animate={recentActivity ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5 }}
          className={`w-2 h-2 rounded-full ${
            isConnected 
              ? recentActivity 
                ? 'bg-green-400' 
                : 'bg-blue-400'
              : 'bg-red-400'
          }`}
        />
        {recentActivity && (
          <motion.div
            className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 opacity-75"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.75, 0, 0.75]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
      <span className="text-xs text-gray-600">
        {isConnected ? 'Live' : 'Offline'}
      </span>
      {eventCount > 0 && (
        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">
          {eventCount}
        </span>
      )}
    </div>
  );
};

export default RealTimeSyncIndicator;
