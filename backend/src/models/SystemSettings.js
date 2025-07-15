import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
  // Platform Configuration
  platform: {
    name: {
      type: String,
      default: "Women's Mental Health & Wellness Platform",
    },
    version: {
      type: String,
      default: '1.0.0',
    },
    description: String,
    logo: String,
    favicon: String,
    primaryColor: {
      type: String,
      default: '#8B5CF6', // Purple
    },
    secondaryColor: {
      type: String,
      default: '#EC4899', // Pink
    },
    maintenanceMode: {
      enabled: {
        type: Boolean,
        default: false,
      },
      message: String,
      allowedRoles: [{
        type: String,
        enum: ['admin', 'moderator'],
      }],
    },
  },

  // User Management Settings
  userManagement: {
    registration: {
      enabled: {
        type: Boolean,
        default: true,
      },
      requireEmailVerification: {
        type: Boolean,
        default: true,
      },
      requireAdminApproval: {
        type: Boolean,
        default: false,
      },
      allowedDomains: [String],
      blockedDomains: [String],
      minimumAge: {
        type: Number,
        default: 13,
      },
    },
    authentication: {
      passwordMinLength: {
        type: Number,
        default: 6,
      },
      passwordRequireUppercase: {
        type: Boolean,
        default: true,
      },
      passwordRequireLowercase: {
        type: Boolean,
        default: true,
      },
      passwordRequireNumbers: {
        type: Boolean,
        default: true,
      },
      passwordRequireSpecialChars: {
        type: Boolean,
        default: false,
      },
      sessionTimeout: {
        type: Number,
        default: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      },
      maxLoginAttempts: {
        type: Number,
        default: 5,
      },
      lockoutDuration: {
        type: Number,
        default: 15 * 60 * 1000, // 15 minutes in milliseconds
      },
      twoFactorAuth: {
        enabled: {
          type: Boolean,
          default: false,
        },
        required: {
          type: Boolean,
          default: false,
        },
      },
    },
    profiles: {
      allowAnonymousPosts: {
        type: Boolean,
        default: true,
      },
      requireProfileCompletion: {
        type: Boolean,
        default: false,
      },
      allowProfilePictures: {
        type: Boolean,
        default: true,
      },
      maxBioLength: {
        type: Number,
        default: 500,
      },
    },
  },

  // Content Moderation Settings
  contentModeration: {
    posts: {
      requireApproval: {
        type: Boolean,
        default: false,
      },
      maxLength: {
        type: Number,
        default: 5000,
      },
      allowImages: {
        type: Boolean,
        default: true,
      },
      allowLinks: {
        type: Boolean,
        default: true,
      },
      autoModeration: {
        enabled: {
          type: Boolean,
          default: true,
        },
        flagKeywords: [String],
        blockKeywords: [String],
      },
    },
    comments: {
      requireApproval: {
        type: Boolean,
        default: false,
      },
      maxLength: {
        type: Number,
        default: 1000,
      },
      allowNested: {
        type: Boolean,
        default: true,
      },
      maxNestingLevel: {
        type: Number,
        default: 3,
      },
    },
    reporting: {
      enabled: {
        type: Boolean,
        default: true,
      },
      categories: [{
        type: String,
        default: ['spam', 'harassment', 'inappropriate-content', 'misinformation', 'other'],
      }],
      autoActions: {
        hideAfterReports: {
          type: Number,
          default: 3,
        },
        deleteAfterReports: {
          type: Number,
          default: 10,
        },
      },
    },
  },

  // Communication Settings
  communication: {
    email: {
      enabled: {
        type: Boolean,
        default: true,
      },
      provider: {
        type: String,
        enum: ['smtp', 'sendgrid', 'mailgun', 'ses'],
        default: 'smtp',
      },
      fromAddress: String,
      fromName: String,
      templates: {
        welcome: String,
        emailVerification: String,
        passwordReset: String,
        notification: String,
      },
    },
    notifications: {
      realTime: {
        type: Boolean,
        default: true,
      },
      push: {
        enabled: {
          type: Boolean,
          default: false,
        },
        vapidKeys: {
          publicKey: String,
          privateKey: String,
        },
      },
      inApp: {
        enabled: {
          type: Boolean,
          default: true,
        },
        maxNotifications: {
          type: Number,
          default: 100,
        },
        retentionDays: {
          type: Number,
          default: 30,
        },
      },
    },
  },

  // Security Settings
  security: {
    rateLimit: {
      enabled: {
        type: Boolean,
        default: true,
      },
      windowMs: {
        type: Number,
        default: 15 * 60 * 1000, // 15 minutes
      },
      maxRequests: {
        type: Number,
        default: 100,
      },
    },
    cors: {
      enabled: {
        type: Boolean,
        default: true,
      },
      allowedOrigins: [String],
      allowCredentials: {
        type: Boolean,
        default: true,
      },
    },
    encryption: {
      algorithm: {
        type: String,
        default: 'aes-256-gcm',
      },
      keyRotationDays: {
        type: Number,
        default: 90,
      },
    },
  },

  // Feature Flags
  features: {
    community: {
      enabled: {
        type: Boolean,
        default: true,
      },
      allowPosts: {
        type: Boolean,
        default: true,
      },
      allowComments: {
        type: Boolean,
        default: true,
      },
      allowLikes: {
        type: Boolean,
        default: true,
      },
    },
    supportGroups: {
      enabled: {
        type: Boolean,
        default: true,
      },
      allowUserCreation: {
        type: Boolean,
        default: false,
      },
      maxMembersPerGroup: {
        type: Number,
        default: 50,
      },
    },
    events: {
      enabled: {
        type: Boolean,
        default: true,
      },
      allowUserCreation: {
        type: Boolean,
        default: false,
      },
      requireApproval: {
        type: Boolean,
        default: true,
      },
    },
    resources: {
      enabled: {
        type: Boolean,
        default: true,
      },
      allowUserSubmissions: {
        type: Boolean,
        default: false,
      },
      requireVerification: {
        type: Boolean,
        default: true,
      },
    },
    moodTracking: {
      enabled: {
        type: Boolean,
        default: true,
      },
      reminderNotifications: {
        type: Boolean,
        default: true,
      },
    },
  },

  // Analytics and Monitoring
  analytics: {
    enabled: {
      type: Boolean,
      default: true,
    },
    provider: {
      type: String,
      enum: ['internal', 'google-analytics', 'mixpanel', 'amplitude'],
      default: 'internal',
    },
    trackingId: String,
    dataRetentionDays: {
      type: Number,
      default: 365,
    },
    anonymizeIPs: {
      type: Boolean,
      default: true,
    },
  },

  // Backup and Maintenance
  backup: {
    enabled: {
      type: Boolean,
      default: true,
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily',
    },
    retentionDays: {
      type: Number,
      default: 30,
    },
    location: {
      type: String,
      enum: ['local', 's3', 'gcs', 'azure'],
      default: 'local',
    },
  },

  // Last updated information
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Ensure only one settings document exists
systemSettingsSchema.index({ _id: 1 }, { unique: true });

// Static method to get current settings
systemSettingsSchema.statics.getCurrentSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Static method to update settings
systemSettingsSchema.statics.updateSettings = async function(updates, updatedBy) {
  const settings = await this.getCurrentSettings();
  Object.assign(settings, updates);
  settings.lastUpdatedBy = updatedBy;
  settings.lastUpdatedAt = new Date();
  await settings.save();
  return settings;
};

export default mongoose.model('SystemSettings', systemSettingsSchema);
