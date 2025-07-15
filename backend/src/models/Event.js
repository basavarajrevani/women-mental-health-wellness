import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Event title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [3000, 'Event description cannot exceed 3000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: [
      'workshop',
      'webinar',
      'support-session',
      'therapy-group',
      'mindfulness',
      'fitness',
      'social',
      'educational',
      'fundraising',
      'awareness',
      'conference',
      'retreat',
      'other'
    ],
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters'],
  }],
  organizer: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    organization: String,
    contactEmail: String,
    contactPhone: String,
  },
  speakers: [{
    name: {
      type: String,
      required: true,
    },
    title: String,
    bio: String,
    credentials: String,
    photo: String,
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String,
    },
  }],
  type: {
    type: String,
    enum: ['online', 'in-person', 'hybrid'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
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
    required: true,
    default: 'UTC',
  },
  location: {
    venue: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    virtualLink: String,
    accessInstructions: String,
  },
  capacity: {
    maxAttendees: {
      type: Number,
      min: [1, 'Event must allow at least 1 attendee'],
    },
    currentAttendees: {
      type: Number,
      default: 0,
    },
    waitlistEnabled: {
      type: Boolean,
      default: false,
    },
  },
  pricing: {
    isFree: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    earlyBirdPrice: Number,
    earlyBirdDeadline: Date,
    scholarshipsAvailable: {
      type: Boolean,
      default: false,
    },
  },
  registration: {
    isRequired: {
      type: Boolean,
      default: true,
    },
    deadline: Date,
    requiresApproval: {
      type: Boolean,
      default: false,
    },
    customFields: [{
      name: String,
      type: {
        type: String,
        enum: ['text', 'email', 'phone', 'select', 'checkbox', 'textarea'],
      },
      required: Boolean,
      options: [String], // For select fields
    }],
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['registered', 'confirmed', 'attended', 'no-show', 'cancelled'],
      default: 'registered',
    },
    customResponses: [{
      field: String,
      value: String,
    }],
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comments: String,
      submittedAt: Date,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
  }],
  waitlist: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    notified: {
      type: Boolean,
      default: false,
    },
  }],
  agenda: [{
    time: String,
    title: String,
    description: String,
    speaker: String,
    duration: Number, // in minutes
  }],
  resources: [{
    title: String,
    description: String,
    url: String,
    type: {
      type: String,
      enum: ['document', 'video', 'audio', 'link', 'presentation'],
    },
    availableAt: {
      type: String,
      enum: ['before', 'during', 'after'],
      default: 'during',
    },
  }],
  requirements: {
    prerequisites: [String],
    materials: [String],
    technicalRequirements: [String],
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft',
  },
  visibility: {
    type: String,
    enum: ['public', 'members-only', 'invite-only'],
    default: 'public',
  },
  notifications: {
    reminderSent: {
      type: Boolean,
      default: false,
    },
    followUpSent: {
      type: Boolean,
      default: false,
    },
  },
  analytics: {
    views: {
      type: Number,
      default: 0,
    },
    registrationClicks: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
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
eventSchema.index({ category: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ isPublic: 1, isActive: 1 });
eventSchema.index({ 'organizer.user': 1 });
eventSchema.index({ 'attendees.user': 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text' 
}, {
  weights: {
    title: 10,
    description: 5,
    tags: 3
  },
  name: 'event_text_search'
});

// Virtual for event status based on dates
eventSchema.virtual('eventStatus').get(function() {
  const now = new Date();
  if (this.status === 'cancelled') return 'cancelled';
  if (this.status === 'completed') return 'completed';
  if (this.endDate < now) return 'past';
  if (this.startDate <= now && this.endDate >= now) return 'ongoing';
  return 'upcoming';
});

// Virtual for availability
eventSchema.virtual('isAvailable').get(function() {
  if (!this.isActive || this.status !== 'published') return false;
  if (this.capacity.maxAttendees && this.capacity.currentAttendees >= this.capacity.maxAttendees) {
    return this.capacity.waitlistEnabled;
  }
  if (this.registration.deadline && new Date() > this.registration.deadline) return false;
  return true;
});

// Virtual for spots remaining
eventSchema.virtual('spotsRemaining').get(function() {
  if (!this.capacity.maxAttendees) return null;
  return Math.max(0, this.capacity.maxAttendees - this.capacity.currentAttendees);
});

// Pre-save middleware to validate dates
eventSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    return next(new Error('End date must be after start date'));
  }
  
  if (this.registration.deadline && this.registration.deadline > this.startDate) {
    return next(new Error('Registration deadline must be before event start date'));
  }
  
  next();
});

export default mongoose.model('Event', eventSchema);
