// Sample data generator for testing real-time functionality
// This creates realistic sample data that users can interact with

export const generateSampleUserData = (userId: string) => {
  const today = new Date();
  const userKey = `user_${userId}`;

  // Generate sample mood entries for the last 7 days
  const sampleMoodEntries = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    sampleMoodEntries.push({
      id: `mood_${Date.now()}_${i}`,
      date: date.toISOString().split('T')[0],
      mood: Math.floor(Math.random() * 4) + 6, // 6-9 range for positive mood
      energy: Math.floor(Math.random() * 3) + 6, // 6-8 range
      sleep: Math.floor(Math.random() * 3) + 7, // 7-9 range
      anxiety: Math.floor(Math.random() * 3) + 3, // 3-5 range (lower is better)
      stress: Math.floor(Math.random() * 3) + 3, // 3-5 range
      notes: i === 0 ? 'Feeling great today!' : i === 3 ? 'Had a challenging day but pushed through' : '',
      createdAt: date.toISOString()
    });
  }

  // Generate sample goals
  const sampleGoals = [
    {
      id: `goal_${Date.now()}_1`,
      title: 'Daily Meditation Practice',
      description: 'Meditate for 10 minutes every morning to start the day with mindfulness',
      progress: 5,
      target: 21,
      category: 'wellness',
      completed: false,
      dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      priority: 'high'
    },
    {
      id: `goal_${Date.now()}_2`,
      title: 'Weekly Therapy Sessions',
      description: 'Attend therapy sessions consistently to work on personal growth',
      progress: 3,
      target: 8,
      category: 'mental',
      completed: false,
      dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      priority: 'high'
    },
    {
      id: `goal_${Date.now()}_3`,
      title: 'Exercise Routine',
      description: 'Establish a regular exercise routine to improve physical and mental health',
      progress: 10,
      target: 10,
      category: 'fitness',
      completed: true,
      dueDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      priority: 'medium'
    }
  ];

  // Generate sample habits
  const sampleHabits = [
    {
      id: `habit_${Date.now()}_1`,
      name: 'Morning Gratitude Journal',
      description: 'Write down 3 things I\'m grateful for each morning',
      streak: 7,
      totalDays: 12,
      lastChecked: today.toISOString().split('T')[0],
      category: 'mindfulness',
      targetDays: 21,
      isActive: true,
      createdAt: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: `habit_${Date.now()}_2`,
      name: 'Evening Walk',
      description: 'Take a 20-minute walk in the evening for fresh air and reflection',
      streak: 3,
      totalDays: 8,
      lastChecked: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: 'health',
      targetDays: 30,
      isActive: true,
      createdAt: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: `habit_${Date.now()}_3`,
      name: 'Digital Detox Hour',
      description: 'One hour before bed without any screens or digital devices',
      streak: 14,
      totalDays: 20,
      lastChecked: today.toISOString().split('T')[0],
      category: 'self-care',
      targetDays: 21,
      isActive: true,
      createdAt: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Generate sample sessions
  const sampleSessions = [
    {
      id: `session_${Date.now()}_1`,
      type: 'therapy' as const,
      title: 'Individual Therapy Session',
      date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duration: 60,
      completed: false,
      rating: undefined
    },
    {
      id: `session_${Date.now()}_2`,
      type: 'group' as const,
      title: 'Women Support Group',
      date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duration: 90,
      completed: true,
      rating: 5
    },
    {
      id: `session_${Date.now()}_3`,
      type: 'mindfulness' as const,
      title: 'Guided Meditation Session',
      date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duration: 30,
      completed: true,
      rating: 4
    }
  ];

  // Generate sample events
  const sampleEvents = [
    {
      id: `event_${Date.now()}_1`,
      title: 'Weekly Support Group',
      type: 'group_session' as const,
      date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '14:00',
      duration: 90,
      participants: 8,
      maxParticipants: 12,
      description: 'A safe space to share experiences and support each other'
    },
    {
      id: `event_${Date.now()}_2`,
      title: 'Mindfulness Workshop',
      type: 'workshop' as const,
      date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00',
      duration: 120,
      participants: 15,
      maxParticipants: 20,
      description: 'Learn advanced mindfulness techniques for stress management'
    }
  ];

  // Generate sample profile
  const sampleProfile = {
    name: 'Sarah',
    email: userId,
    joinDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    preferences: {
      notifications: true,
      reminderTime: '09:00',
      privacyLevel: 'friends' as const
    },
    emergencyContacts: [
      { name: 'Dr. Emily Chen', phone: '+1-555-0123', relationship: 'Therapist' },
      { name: 'Mom', phone: '+1-555-0456', relationship: 'Family' }
    ]
  };

  return {
    moodEntries: sampleMoodEntries,
    goals: sampleGoals,
    habits: sampleHabits,
    sessions: sampleSessions,
    events: sampleEvents,
    profile: sampleProfile
  };
};

export const initializeSampleData = (userId: string) => {
  const sampleData = generateSampleUserData(userId);
  
  // Save to localStorage
  localStorage.setItem('progress_mood_data', JSON.stringify(sampleData.moodEntries));
  localStorage.setItem('progress_goals', JSON.stringify(sampleData.goals));
  localStorage.setItem('progress_habits', JSON.stringify(sampleData.habits));
  localStorage.setItem(`user_sessions_${userId}`, JSON.stringify(sampleData.sessions));
  localStorage.setItem(`user_events_${userId}`, JSON.stringify(sampleData.events));
  localStorage.setItem(`user_profile_${userId}`, JSON.stringify(sampleData.profile));
  
  console.log('✅ Sample data initialized for user:', userId);
  return sampleData;
};

export const clearAllUserData = (userId: string) => {
  localStorage.removeItem('progress_mood_data');
  localStorage.removeItem('progress_goals');
  localStorage.removeItem('progress_habits');
  localStorage.removeItem('progress_achievements');
  localStorage.removeItem(`user_sessions_${userId}`);
  localStorage.removeItem(`user_events_${userId}`);
  localStorage.removeItem(`user_profile_${userId}`);
  
  console.log('🗑️ All user data cleared for:', userId);
};

export const hasExistingUserData = (userId: string): boolean => {
  const moodData = localStorage.getItem('progress_mood_data');
  const profile = localStorage.getItem(`user_profile_${userId}`);
  
  return !!(moodData && JSON.parse(moodData).length > 0) || !!profile;
};
