import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Partner name is required'],
    trim: true,
    maxlength: [100, 'Partner name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Partner description is required'],
    trim: true,
    maxlength: [2000, 'Partner description cannot exceed 2000 characters'],
  },
  type: {
    type: String,
    enum: [
      'healthcare-provider',
      'mental-health-organization',
      'nonprofit',
      'government',
      'educational',
      'corporate',
      'community',
      'research',
      'technology',
      'other'
    ],
    required: true,
  },
  logo: {
    url: String,
    altText: String,
  },
  website: {
    type: String,
    required: true,
    match: [
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      'Please enter a valid URL',
    ],
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String,
  },
  contact: {
    name: String,
    email: {
      type: String,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
  },
  services: [{
    name: {
      type: String,
      required: true,
    },
    description: String,
    cost: String,
    availability: String,
    eligibility: String,
  }],
  specialties: [{
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
      'general',
      'crisis-intervention',
      'family-therapy',
      'couples-therapy',
      'child-psychology',
      'geriatric',
      'lgbtq+',
      'cultural-competence',
      'holistic',
      'medication-management',
      'research',
      'education',
      'advocacy',
      'support-groups',
      'other'
    ],
  }],
  demographics: [{
    type: String,
    enum: [
      'women',
      'men',
      'lgbtq+',
      'teens',
      'young-adults',
      'adults',
      'seniors',
      'parents',
      'veterans',
      'students',
      'professionals',
      'low-income',
      'immigrants',
      'refugees',
      'all'
    ],
  }],
  languages: [{
    type: String,
  }],
  acceptsInsurance: {
    type: Boolean,
    default: false,
  },
  insuranceProviders: [{
    type: String,
  }],
  slidingScale: {
    type: Boolean,
    default: false,
  },
  verificationStatus: {
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
  },
  partnership: {
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    level: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum', 'custom'],
    },
    agreementUrl: String,
    notes: String,
  },
  resources: [{
    title: String,
    description: String,
    url: String,
    type: {
      type: String,
      enum: ['document', 'video', 'link', 'other'],
    },
  }],
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
  supportGroups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportGroup',
  }],
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
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'archived'],
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
partnerSchema.index({ name: 1 });
partnerSchema.index({ type: 1 });
partnerSchema.index({ specialties: 1 });
partnerSchema.index({ demographics: 1 });
partnerSchema.index({ status: 1, isPublic: 1 });
partnerSchema.index({ isFeatured: -1 });
partnerSchema.index({ 'ratings.averageRating': -1 });
partnerSchema.index({ 
  name: 'text', 
  description: 'text', 
  'services.name': 'text', 
  'services.description': 'text' 
}, {
  weights: {
    name: 10,
    description: 5,
    'services.name': 3,
    'services.description': 2
  },
  name: 'partner_text_search'
});

// Virtual for review count
partnerSchema.virtual('reviewCount').get(function() {
  return this.ratings.reviews.length;
});

// Method to calculate average rating
partnerSchema.methods.calculateAverageRating = function() {
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
partnerSchema.pre('save', function(next) {
  if (this.isModified('ratings.reviews')) {
    this.calculateAverageRating();
  }
  next();
});

export default mongoose.model('Partner', partnerSchema);
