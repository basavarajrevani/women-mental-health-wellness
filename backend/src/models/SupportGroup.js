import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  location: {
    type: String,
    required: function() {
      return this.parent().meetingType === 'in-person';
    },
  },
  virtualLink: {
    type: String,
    required: function() {
      return this.parent().meetingType === 'online';
    },
  },
  agenda: {
    type: String,
    maxlength: [1000, 'Agenda cannot exceed 1000 characters'],
  },
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    attended: {
      type: Boolean,
      default: false,
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comments: String,
    },
  }],
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  recordingUrl: String,
  resources: [{
    title: String,
    description: String,
    url: String,
    type: {
      type: String,
      enum: ['document', 'video', 'audio', 'link'],
    },
  }],
}, {
  timestamps: true,
});

const supportGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: [100, 'Group name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Group description is required'],
    trim: true,
    maxlength: [2000, 'Group description cannot exceed 2000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Group category is required'],
    enum: [
      'anxiety', 
      'depression', 
      'trauma', 
      'grief', 
      'stress', 
      'parenting', 
      'relationships', 
      'self-care', 
      'workplace', 
      'general',
      'eating-disorders',
      'addiction',
      'bipolar',
      'ocd',
      'ptsd',
      'postpartum',
      'lgbtq+',
      'teens',
      'seniors',
      'other'
    ],
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters'],
  }],
  facilitator: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    credentials: String,
    bio: String,
    contactEmail: String,
  },
  coFacilitators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: String,
    credentials: String,
  }],
  meetingType: {
    type: String,
    enum: ['online', 'in-person', 'hybrid'],
    required: true,
  },
  meetingSchedule: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'bi-weekly', 'monthly', 'custom'],
    default: 'weekly',
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: [15, 'Duration must be at least 15 minutes'],
    max: [240, 'Duration cannot exceed 4 hours'],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: Date, // Optional end date
  maxMembers: {
    type: Number,
    required: true,
    min: [2, 'Group must allow at least 2 members'],
    max: [100, 'Group cannot exceed 100 members'],
  },
  currentMembers: {
    type: Number,
    default: 0,
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    status: {
      type: String,
      enum: ['active', 'inactive', 'removed'],
      default: 'active',
    },
  }],
  waitlist: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  }],
  meetings: [meetingSchema],
  isPublic: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  requiresApproval: {
    type: Boolean,
    default: false,
  },
  guidelines: {
    type: String,
    maxlength: [3000, 'Guidelines cannot exceed 3000 characters'],
  },
  resources: [{
    title: String,
    description: String,
    url: String,
    type: {
      type: String,
      enum: ['document', 'video', 'audio', 'link'],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better performance
supportGroupSchema.index({ category: 1 });
supportGroupSchema.index({ tags: 1 });
supportGroupSchema.index({ isPublic: 1, isActive: 1 });
supportGroupSchema.index({ 'facilitator.user': 1 });
supportGroupSchema.index({ 'members.user': 1 });
supportGroupSchema.index({ startDate: 1 });
supportGroupSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text' 
}, {
  weights: {
    name: 10,
    description: 5,
    tags: 3
  },
  name: 'group_text_search'
});

// Virtual for upcoming meetings
supportGroupSchema.virtual('upcomingMeetings').get(function() {
  const now = new Date();
  return this.meetings
    .filter(meeting => meeting.date > now && meeting.status !== 'cancelled')
    .sort((a, b) => a.date - b.date);
});

// Virtual for past meetings
supportGroupSchema.virtual('pastMeetings').get(function() {
  const now = new Date();
  return this.meetings
    .filter(meeting => meeting.date < now || meeting.status === 'completed')
    .sort((a, b) => b.date - a.date);
});

// Virtual for availability status
supportGroupSchema.virtual('availabilityStatus').get(function() {
  if (!this.isActive) return 'inactive';
  if (this.currentMembers >= this.maxMembers) return 'full';
  if (this.requiresApproval) return 'approval-required';
  return 'available';
});

export default mongoose.model('SupportGroup', supportGroupSchema);
