import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true,
    maxlength: [200, 'Resource title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Resource description is required'],
    trim: true,
    maxlength: [2000, 'Resource description cannot exceed 2000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Resource category is required'],
    enum: [
      'article',
      'video',
      'podcast',
      'book',
      'app',
      'website',
      'tool',
      'worksheet',
      'guide',
      'course',
      'therapy',
      'hotline',
      'emergency',
      'medication',
      'exercise',
      'meditation',
      'other'
    ],
  },
  type: {
    type: String,
    required: [true, 'Resource type is required'],
    enum: [
      'educational',
      'therapeutic',
      'emergency',
      'self-help',
      'professional',
      'community',
      'crisis',
      'wellness',
      'medical',
      'legal',
      'financial'
    ],
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters'],
  }],
  content: {
    url: {
      type: String,
      required: function() {
        return ['website', 'video', 'podcast', 'app'].includes(this.category);
      },
    },
    fileUrl: String,
    embedCode: String,
    text: String,
  },
  author: {
    name: String,
    credentials: String,
    organization: String,
    contactInfo: String,
  },
  publisher: {
    name: String,
    website: String,
    contactInfo: String,
  },
  accessibility: {
    languages: [{
      type: String,
      default: ['English'],
    }],
    hasAudioVersion: {
      type: Boolean,
      default: false,
    },
    hasVideoVersion: {
      type: Boolean,
      default: false,
    },
    hasTranscript: {
      type: Boolean,
      default: false,
    },
    isScreenReaderFriendly: {
      type: Boolean,
      default: false,
    },
    hasClosedCaptions: {
      type: Boolean,
      default: false,
    },
  },
  targetAudience: {
    ageGroups: [{
      type: String,
      enum: ['teens', 'young-adults', 'adults', 'seniors', 'all'],
    }],
    conditions: [{
      type: String,
      enum: [
        'anxiety',
        'depression',
        'trauma',
        'grief',
        'stress',
        'eating-disorders',
        'addiction',
        'bipolar',
        'ocd',
        'ptsd',
        'postpartum',
        'general'
      ],
    }],
    demographics: [{
      type: String,
      enum: ['women', 'men', 'lgbtq+', 'parents', 'students', 'professionals', 'all'],
    }],
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
    default: 'all-levels',
  },
  duration: {
    estimatedTime: String, // e.g., "15 minutes", "1 hour", "ongoing"
    isOngoing: {
      type: Boolean,
      default: false,
    },
  },
  cost: {
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
    priceRange: String, // e.g., "$50-$100", "Free with insurance"
  },
  availability: {
    isAvailable24_7: {
      type: Boolean,
      default: false,
    },
    businessHours: String,
    timezone: String,
    regions: [String], // Geographic availability
  },
  contact: {
    phone: String,
    email: String,
    website: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
  },
  ratings: {
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    reviews: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
      },
      isAnonymous: {
        type: Boolean,
        default: false,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      helpfulVotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  usage: {
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    bookmarks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    shares: {
      type: Number,
      default: 0,
    },
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verificationDate: Date,
    verificationNotes: String,
    lastReviewed: Date,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending-review', 'archived'],
    default: 'active',
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better performance
resourceSchema.index({ category: 1 });
resourceSchema.index({ type: 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ 'targetAudience.conditions': 1 });
resourceSchema.index({ 'targetAudience.demographics': 1 });
resourceSchema.index({ status: 1, isPublic: 1 });
resourceSchema.index({ isFeatured: -1, createdAt: -1 });
resourceSchema.index({ 'ratings.averageRating': -1 });
resourceSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text' 
}, {
  weights: {
    title: 10,
    description: 5,
    tags: 3
  },
  name: 'resource_text_search'
});

// Virtual for bookmark count
resourceSchema.virtual('bookmarkCount').get(function() {
  return this.usage.bookmarks.length;
});

// Virtual for review count
resourceSchema.virtual('reviewCount').get(function() {
  return this.ratings.reviews.length;
});

// Method to calculate average rating
resourceSchema.methods.calculateAverageRating = function() {
  if (this.ratings.reviews.length === 0) {
    this.ratings.averageRating = 0;
    this.ratings.totalRatings = 0;
    return;
  }

  const sum = this.ratings.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.ratings.averageRating = sum / this.ratings.reviews.length;
  this.ratings.totalRatings = this.ratings.reviews.length;
};

// Pre-save middleware to calculate ratings
resourceSchema.pre('save', function(next) {
  if (this.isModified('ratings.reviews')) {
    this.calculateAverageRating();
  }
  next();
});

export default mongoose.model('Resource', resourceSchema);
