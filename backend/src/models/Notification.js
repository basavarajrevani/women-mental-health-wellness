import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'like',
      'comment',
      'mention',
      'follow',
      'group-invite',
      'group-join',
      'event-reminder',
      'event-update',
      'achievement',
      'system',
      'message',
      'resource',
      'admin',
      'safety-plan',
      'mood-reminder',
      'streak',
      'milestone',
      'welcome',
      'verification',
      'password-reset',
      'support-response'
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Notification title cannot exceed 100 characters'],
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Notification message cannot exceed 500 characters'],
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reference: {
    model: {
      type: String,
      enum: ['CommunityPost', 'Comment', 'SupportGroup', 'Event', 'Resource', 'User', 'Message'],
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: Date,
  isClicked: {
    type: Boolean,
    default: false,
  },
  clickedAt: Date,
  isDismissed: {
    type: Boolean,
    default: false,
  },
  dismissedAt: Date,
  expiresAt: Date,
  deliveryStatus: {
    inApp: {
      type: String,
      enum: ['pending', 'delivered', 'failed'],
      default: 'pending',
    },
    email: {
      type: String,
      enum: ['not-applicable', 'pending', 'sent', 'delivered', 'opened', 'clicked', 'failed'],
      default: 'not-applicable',
    },
    push: {
      type: String,
      enum: ['not-applicable', 'pending', 'sent', 'delivered', 'opened', 'failed'],
      default: 'not-applicable',
    },
  },
  actionUrl: String,
  actionLabel: String,
  icon: String,
  color: String,
}, {
  timestamps: true,
});

// Indexes for better performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-deletion

// Virtual for age of notification
notificationSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Virtual for formatted time
notificationSchema.virtual('timeAgo').get(function() {
  const seconds = Math.floor((Date.now() - this.createdAt.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? '1 year ago' : `${interval} years ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? '1 month ago' : `${interval} months ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? '1 day ago' : `${interval} days ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
  }
  
  return seconds < 10 ? 'just now' : `${seconds} seconds ago`;
});

// Static method to mark all notifications as read for a user
notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { recipient: userId, isRead: false },
    { 
      isRead: true,
      readAt: new Date()
    }
  );
};

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ recipient: userId, isRead: false });
};

// Static method to get recent notifications for a user
notificationSchema.statics.getRecent = function(userId, limit = 10) {
  return this.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('sender', 'name avatar')
    .exec();
};

export default mongoose.model('Notification', notificationSchema);
