import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useRealTimeData } from '../../hooks/useRealTimeData';

interface RealTimeStatusProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RealTimeStatus: React.FC<RealTimeStatusProps> = ({
  showText = true,
  size = 'md',
  className = ''
}) => {
  const { 
    connectionStatus, 
    lastUpdateText, 
    isOnline, 
    isLoading, 
    forceRefresh,
    updateCount 
  } = useRealTimeData();

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'updating': return 'text-blue-500';
      case 'error': return 'text-red-500';
      case 'offline': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className={`${getSizeClass()} ${getStatusColor()}`} />;
      case 'updating': return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className={`${getSizeClass()} ${getStatusColor()}`} />
        </motion.div>
      );
      case 'error': return <AlertCircle className={`${getSizeClass()} ${getStatusColor()}`} />;
      case 'offline': return <WifiOff className={`${getSizeClass()} ${getStatusColor()}`} />;
      default: return <WifiOff className={`${getSizeClass()} ${getStatusColor()}`} />;
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3';
      case 'md': return 'h-4 w-4';
      case 'lg': return 'h-5 w-5';
      default: return 'h-4 w-4';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Live';
      case 'updating': return 'Updating...';
      case 'error': return 'Error';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={forceRefresh}
        disabled={!isOnline || isLoading}
        className="flex items-center gap-1 transition-opacity hover:opacity-80 disabled:opacity-50"
        title={`Status: ${getStatusText()} | Last update: ${lastUpdateText} | Click to refresh`}
      >
        {getStatusIcon()}
        {showText && (
          <span className={`text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        )}
      </motion.button>
      
      {showText && (
        <span className="text-xs text-gray-500">
          {lastUpdateText}
        </span>
      )}
      
      {/* Update counter for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <span className="text-xs text-gray-400">
          ({updateCount})
        </span>
      )}
    </div>
  );
};

// Notification badge component for real-time updates
export const RealTimeNotificationBadge: React.FC<{
  count: number;
  className?: string;
}> = ({ count, className = '' }) => {
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ${className}`}
    >
      {count > 99 ? '99+' : count}
    </motion.div>
  );
};

// Real-time data pulse indicator
export const RealTimePulse: React.FC<{
  isActive: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ isActive, color = 'bg-green-500', size = 'md' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-2 w-2';
      case 'md': return 'h-3 w-3';
      case 'lg': return 'h-4 w-4';
      default: return 'h-3 w-3';
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <div className={`${getSizeClass()} ${color} rounded-full`} />
      {isActive && (
        <motion.div
          className={`absolute ${getSizeClass()} ${color} rounded-full opacity-75`}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.75, 0, 0.75],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
};

// Connection quality indicator
export const ConnectionQuality: React.FC<{
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  showText?: boolean;
}> = ({ quality, showText = false }) => {
  const getQualityConfig = () => {
    switch (quality) {
      case 'excellent':
        return { color: 'bg-green-500', bars: 4, text: 'Excellent' };
      case 'good':
        return { color: 'bg-green-400', bars: 3, text: 'Good' };
      case 'fair':
        return { color: 'bg-yellow-500', bars: 2, text: 'Fair' };
      case 'poor':
        return { color: 'bg-red-500', bars: 1, text: 'Poor' };
      default:
        return { color: 'bg-gray-400', bars: 0, text: 'Unknown' };
    }
  };

  const config = getQualityConfig();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-0.5">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`w-1 transition-all duration-300 ${
              bar <= config.bars ? config.color : 'bg-gray-300'
            }`}
            style={{ height: `${bar * 3 + 2}px` }}
          />
        ))}
      </div>
      {showText && (
        <span className="text-xs text-gray-600">{config.text}</span>
      )}
    </div>
  );
};

export default RealTimeStatus;
