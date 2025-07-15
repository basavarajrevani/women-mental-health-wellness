import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'user_created',
      'user_updated',
      'user_suspended',
      'user_deleted',
      'user_role_changed',
      'post_moderated',
      'post_deleted',
      'comment_moderated',
      'comment_deleted',
      'group_created',
      'group_updated',
      'group_deleted',
      'event_created',
      'event_updated',
      'event_deleted',
      'resource_created',
      'resource_updated',
      'resource_deleted',
      'system_settings_changed',
      'notification_broadcast',
      'data_export',
      'data_import',
      'backup_created',
      'login_attempt',
      'password_reset',
      'security_alert',
      'other'
    ],
  },
  target: {
    model: {
      type: String,
      enum: ['User', 'CommunityPost', 'Comment', 'SupportGroup', 'Event', 'Resource', 'System'],
    },
    id: mongoose.Schema.Types.ObjectId,
    name: String, // For display purposes
  },
  details: {
    description: String,
    oldValues: mongoose.Schema.Types.Mixed,
    newValues: mongoose.Schema.Types.Mixed,
    reason: String,
    notes: String,
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    location: {
      country: String,
      city: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    sessionId: String,
    requestId: String,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  category: {
    type: String,
    enum: ['user_management', 'content_moderation', 'system_admin', 'security', 'data_management'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed',
  },
  affectedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  tags: [String],
  isReversible: {
    type: Boolean,
    default: false,
  },
  reversedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reversedAt: Date,
  reversalReason: String,
}, {
  timestamps: true,
});

// Indexes for performance
adminLogSchema.index({ admin: 1, createdAt: -1 });
adminLogSchema.index({ action: 1, createdAt: -1 });
adminLogSchema.index({ 'target.model': 1, 'target.id': 1 });
adminLogSchema.index({ category: 1, severity: 1 });
adminLogSchema.index({ createdAt: -1 });
adminLogSchema.index({ tags: 1 });

// Virtual for formatted timestamp
adminLogSchema.virtual('formattedTimestamp').get(function() {
  return this.createdAt.toLocaleString();
});

// Static method to log admin action
adminLogSchema.statics.logAction = async function(adminId, action, details = {}) {
  try {
    const logEntry = new this({
      admin: adminId,
      action,
      target: details.target || {},
      details: {
        description: details.description,
        oldValues: details.oldValues,
        newValues: details.newValues,
        reason: details.reason,
        notes: details.notes,
      },
      metadata: details.metadata || {},
      severity: details.severity || 'medium',
      category: details.category,
      affectedUsers: details.affectedUsers || [],
      tags: details.tags || [],
      isReversible: details.isReversible || false,
    });

    await logEntry.save();
    return logEntry;
  } catch (error) {
    console.error('Error logging admin action:', error);
    throw error;
  }
};

// Static method to get admin activity summary
adminLogSchema.statics.getActivitySummary = async function(adminId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const summary = await this.aggregate([
    {
      $match: {
        admin: mongoose.Types.ObjectId(adminId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        lastAction: { $max: '$createdAt' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  return summary;
};

// Static method to get system activity overview
adminLogSchema.statics.getSystemActivity = async function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const activity = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          category: '$category'
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.date': 1 }
    }
  ]);

  return activity;
};

export default mongoose.model('AdminLog', adminLogSchema);
