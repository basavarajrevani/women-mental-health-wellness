import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
  },
  profile: {
    avatar: {
      type: String,
      default: '👤',
    },
    coverImage: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    personalInfo: {
      firstName: String,
      lastName: String,
      dateOfBirth: Date,
      age: {
        type: Number,
        min: [13, 'Age must be at least 13'],
        max: [120, 'Age cannot exceed 120'],
      },
      gender: {
        type: String,
        enum: ['female', 'male', 'non-binary', 'prefer-not-to-say', 'other'],
      },
      pronouns: String,
      phoneNumber: {
        type: String,
        match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'],
      },
      alternateEmail: {
        type: String,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
      },
    },
    location: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      timezone: {
        type: String,
        default: 'UTC',
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    demographics: {
      ethnicity: [String],
      languages: [String],
      education: {
        type: String,
        enum: ['high-school', 'some-college', 'bachelors', 'masters', 'doctorate', 'other'],
      },
      occupation: String,
      income: {
        type: String,
        enum: ['under-25k', '25k-50k', '50k-75k', '75k-100k', '100k-150k', 'over-150k', 'prefer-not-to-say'],
      },
      relationshipStatus: {
        type: String,
        enum: ['single', 'dating', 'married', 'divorced', 'widowed', 'prefer-not-to-say'],
      },
      hasChildren: Boolean,
      numberOfChildren: Number,
    },
    preferences: {
      privacy: {
        profileVisibility: {
          type: String,
          enum: ['public', 'members-only', 'private'],
          default: 'members-only',
        },
        showRealName: {
          type: Boolean,
          default: true,
        },
        allowDirectMessages: {
          type: Boolean,
          default: true,
        },
        showOnlineStatus: {
          type: Boolean,
          default: true,
        },
        shareLocation: {
          type: Boolean,
          default: false,
        },
        anonymousPosting: {
          type: Boolean,
          default: false,
        },
      },
      notifications: {
        email: {
          enabled: {
            type: Boolean,
            default: true,
          },
          frequency: {
            type: String,
            enum: ['immediate', 'daily', 'weekly', 'never'],
            default: 'daily',
          },
          types: {
            communityUpdates: {
              type: Boolean,
              default: true,
            },
            eventReminders: {
              type: Boolean,
              default: true,
            },
            groupMessages: {
              type: Boolean,
              default: true,
            },
            likes: {
              type: Boolean,
              default: true,
            },
            comments: {
              type: Boolean,
              default: true,
            },
            mentions: {
              type: Boolean,
              default: true,
            },
            systemUpdates: {
              type: Boolean,
              default: true,
            },
            marketingEmails: {
              type: Boolean,
              default: false,
            },
          },
        },
        push: {
          enabled: {
            type: Boolean,
            default: true,
          },
          types: {
            messages: {
              type: Boolean,
              default: true,
            },
            reminders: {
              type: Boolean,
              default: true,
            },
            emergencyAlerts: {
              type: Boolean,
              default: true,
            },
          },
        },
        inApp: {
          enabled: {
            type: Boolean,
            default: true,
          },
          sound: {
            type: Boolean,
            default: true,
          },
        },
      },
      accessibility: {
        fontSize: {
          type: String,
          enum: ['small', 'medium', 'large', 'extra-large'],
          default: 'medium',
        },
        highContrast: {
          type: Boolean,
          default: false,
        },
        screenReader: {
          type: Boolean,
          default: false,
        },
        reducedMotion: {
          type: Boolean,
          default: false,
        },
        colorBlindFriendly: {
          type: Boolean,
          default: false,
        },
      },
      communication: {
        preferredLanguage: {
          type: String,
          default: 'en',
        },
        timeFormat: {
          type: String,
          enum: ['12h', '24h'],
          default: '12h',
        },
        dateFormat: {
          type: String,
          enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
          default: 'MM/DD/YYYY',
        },
      },
    },
    mentalHealth: {
      conditions: [{
        name: {
          type: String,
          enum: [
            'anxiety', 'depression', 'bipolar', 'ptsd', 'ocd', 'adhd',
            'eating-disorder', 'substance-abuse', 'grief', 'trauma',
            'postpartum-depression', 'seasonal-affective-disorder',
            'panic-disorder', 'social-anxiety', 'generalized-anxiety',
            'other'
          ],
        },
        diagnosedBy: String,
        diagnosedDate: Date,
        severity: {
          type: String,
          enum: ['mild', 'moderate', 'severe'],
        },
        currentlyTreated: {
          type: Boolean,
          default: false,
        },
        notes: String,
      }],
      medications: [{
        name: String,
        dosage: String,
        frequency: String,
        prescribedBy: String,
        startDate: Date,
        endDate: Date,
        sideEffects: [String],
        effectiveness: {
          type: Number,
          min: 1,
          max: 10,
        },
        notes: String,
      }],
      therapy: {
        currentlyInTherapy: {
          type: Boolean,
          default: false,
        },
        therapistName: String,
        therapyType: {
          type: String,
          enum: ['cbt', 'dbt', 'psychodynamic', 'humanistic', 'family', 'group', 'other'],
        },
        frequency: String,
        startDate: Date,
        notes: String,
      },
      goals: [{
        title: String,
        description: String,
        category: {
          type: String,
          enum: ['mood', 'anxiety', 'sleep', 'exercise', 'social', 'work', 'self-care', 'other'],
        },
        targetDate: Date,
        priority: {
          type: String,
          enum: ['low', 'medium', 'high'],
          default: 'medium',
        },
        status: {
          type: String,
          enum: ['not-started', 'in-progress', 'completed', 'paused'],
          default: 'not-started',
        },
        progress: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },
        milestones: [{
          title: String,
          completed: {
            type: Boolean,
            default: false,
          },
          completedDate: Date,
        }],
        createdDate: {
          type: Date,
          default: Date.now,
        },
        completedDate: Date,
        notes: String,
      }],
      triggers: [{
        name: String,
        severity: {
          type: String,
          enum: ['mild', 'moderate', 'severe'],
        },
        copingStrategies: [String],
        notes: String,
      }],
      copingStrategies: [{
        name: String,
        effectiveness: {
          type: Number,
          min: 1,
          max: 10,
        },
        category: {
          type: String,
          enum: ['breathing', 'mindfulness', 'exercise', 'social', 'creative', 'other'],
        },
        notes: String,
      }],
      crisisContacts: [{
        name: String,
        relationship: String,
        phone: String,
        email: String,
        available24_7: {
          type: Boolean,
          default: false,
        },
        notes: String,
      }],
      safetyPlan: {
        warningSignsPersonal: [String],
        warningSignsEnvironmental: [String],
        copingStrategiesPersonal: [String],
        socialContacts: [String],
        professionalContacts: [String],
        environmentSafety: [String],
        lastUpdated: Date,
      },
    },
    emergencyContacts: [{
      name: String,
      phone: String,
      relationship: String,
    }],
  },
  stats: {
    postsCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    likesReceived: {
      type: Number,
      default: 0,
    },
    joinedGroupsCount: {
      type: Number,
      default: 0,
    },
    attendedEventsCount: {
      type: Number,
      default: 0,
    },
    streakDays: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
  },
  verification: {
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
  },
  security: {
    passwordResetToken: String,
    passwordResetExpires: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    lastLogin: Date,
    ipAddresses: [String],
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'deleted'],
    default: 'active',
  },
  joinedGroups: [{
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SupportGroup',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ['member', 'moderator'],
      default: 'member',
    },
  }],
  registeredEvents: [{
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    attended: {
      type: Boolean,
      default: false,
    },
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ 'stats.lastActiveDate': -1 });

// Virtual for user's full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { 'security.lockUntil': 1 },
      $set: { 'security.loginAttempts': 1 }
    });
  }
  
  const updates = { $inc: { 'security.loginAttempts': 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.security.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { 'security.lockUntil': Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { 'security.loginAttempts': 1, 'security.lockUntil': 1 }
  });
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to get active users
userSchema.statics.getActiveUsers = function() {
  return this.find({ status: 'active' });
};

export default mongoose.model('User', userSchema);
