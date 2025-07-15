import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: Number,
    required: [true, 'Mood rating is required'],
    min: [1, 'Mood rating must be between 1 and 10'],
    max: [10, 'Mood rating must be between 1 and 10'],
  },
  emotions: [{
    type: String,
    enum: [
      'happy',
      'sad',
      'anxious',
      'angry',
      'excited',
      'calm',
      'stressed',
      'grateful',
      'lonely',
      'confident',
      'overwhelmed',
      'hopeful',
      'frustrated',
      'content',
      'worried',
      'energetic',
      'tired',
      'peaceful',
      'irritated',
      'optimistic',
      'depressed',
      'motivated',
      'confused',
      'proud',
      'scared'
    ],
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
  triggers: [{
    type: String,
    enum: [
      'work',
      'relationships',
      'family',
      'health',
      'finances',
      'social-media',
      'news',
      'weather',
      'sleep',
      'exercise',
      'diet',
      'medication',
      'therapy',
      'social-events',
      'deadlines',
      'conflict',
      'change',
      'isolation',
      'physical-pain',
      'hormones',
      'anniversary',
      'other'
    ],
  }],
  activities: [{
    type: String,
    enum: [
      'meditation',
      'exercise',
      'therapy',
      'journaling',
      'socializing',
      'reading',
      'music',
      'art',
      'cooking',
      'walking',
      'breathing-exercises',
      'yoga',
      'sleep',
      'work',
      'hobbies',
      'volunteering',
      'prayer',
      'nature',
      'self-care',
      'learning',
      'cleaning',
      'gaming',
      'movies',
      'shopping',
      'other'
    ],
  }],
  symptoms: [{
    type: String,
    enum: [
      'headache',
      'fatigue',
      'insomnia',
      'appetite-changes',
      'concentration-issues',
      'restlessness',
      'muscle-tension',
      'nausea',
      'dizziness',
      'heart-palpitations',
      'sweating',
      'trembling',
      'shortness-of-breath',
      'chest-pain',
      'stomach-issues',
      'back-pain',
      'joint-pain',
      'skin-issues',
      'vision-changes',
      'memory-issues',
      'none'
    ],
  }],
  sleepHours: {
    type: Number,
    min: [0, 'Sleep hours cannot be negative'],
    max: [24, 'Sleep hours cannot exceed 24'],
  },
  sleepQuality: {
    type: Number,
    min: [1, 'Sleep quality must be between 1 and 5'],
    max: [5, 'Sleep quality must be between 1 and 5'],
  },
  energyLevel: {
    type: Number,
    min: [1, 'Energy level must be between 1 and 10'],
    max: [10, 'Energy level must be between 1 and 10'],
  },
  stressLevel: {
    type: Number,
    min: [1, 'Stress level must be between 1 and 10'],
    max: [10, 'Stress level must be between 1 and 10'],
  },
  socialInteraction: {
    type: String,
    enum: ['none', 'minimal', 'moderate', 'high'],
  },
  medicationTaken: {
    type: Boolean,
    default: false,
  },
  medicationNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Medication notes cannot exceed 500 characters'],
  },
  weather: {
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy', 'foggy', 'windy'],
  },
  location: {
    type: String,
    enum: ['home', 'work', 'school', 'outdoors', 'social-setting', 'healthcare', 'travel', 'other'],
  },
  isPrivate: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters'],
  }],
  entryDate: {
    type: Date,
    default: Date.now,
  },
  reminderSet: {
    type: Boolean,
    default: false,
  },
  reminderTime: String, // Format: "HH:MM"
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better performance
moodEntrySchema.index({ user: 1, entryDate: -1 });
moodEntrySchema.index({ user: 1, mood: 1 });
moodEntrySchema.index({ user: 1, createdAt: -1 });
moodEntrySchema.index({ entryDate: 1 });

// Virtual for mood category
moodEntrySchema.virtual('moodCategory').get(function() {
  if (this.mood >= 8) return 'excellent';
  if (this.mood >= 6) return 'good';
  if (this.mood >= 4) return 'okay';
  if (this.mood >= 2) return 'poor';
  return 'very-poor';
});

// Virtual for mood emoji
moodEntrySchema.virtual('moodEmoji').get(function() {
  const emojiMap = {
    1: '😢', 2: '😞', 3: '😕', 4: '😐', 5: '😊',
    6: '😊', 7: '😄', 8: '😁', 9: '🤗', 10: '🥳'
  };
  return emojiMap[this.mood] || '😐';
});

// Static method to get mood trends for a user
moodEntrySchema.statics.getMoodTrends = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    user: userId,
    entryDate: { $gte: startDate }
  }).sort({ entryDate: 1 });
};

// Static method to get average mood for a user
moodEntrySchema.statics.getAverageMood = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        entryDate: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        averageMood: { $avg: '$mood' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get mood streak for a user
moodEntrySchema.statics.getMoodStreak = function(userId) {
  return this.find({ user: userId })
    .sort({ entryDate: -1 })
    .limit(365) // Check last year
    .then(entries => {
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < entries.length; i++) {
        const entryDate = new Date(entries[i].entryDate);
        entryDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        
        if (entryDate.getTime() === expectedDate.getTime()) {
          streak++;
        } else {
          break;
        }
      }
      
      return streak;
    });
};

export default mongoose.model('MoodEntry', moodEntrySchema);
