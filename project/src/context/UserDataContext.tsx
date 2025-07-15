import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { persistenceHelpers } from '../services/DataPersistence';
import { useGlobalData } from './GlobalDataContext';

// Types for user data
export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-10 scale
  notes?: string;
  timestamp: number;
}

export interface SessionData {
  id: string;
  type: 'therapy' | 'group' | 'mindfulness' | 'chat';
  title: string;
  date: string;
  duration: number; // in minutes
  completed: boolean;
  rating?: number; // 1-5 stars
}

export interface ProgressMetrics {
  daysActive: number;
  currentStreak: number;
  totalSessions: number;
  averageMood: number;
  lastActivity: string;
  weeklyGoalProgress: number; // percentage
}

export interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  preferences: {
    notifications: boolean;
    reminderTime: string;
    privacyLevel: 'public' | 'friends' | 'private';
  };
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
}

export interface CommunityActivity {
  id: string;
  type: 'post' | 'comment' | 'support' | 'milestone';
  title: string;
  content: string;
  author: string;
  timestamp: number;
  likes: number;
  replies: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  type: 'group_session' | 'therapy' | 'workshop' | 'webinar';
  date: string;
  time: string;
  duration: number;
  participants: number;
  maxParticipants: number;
  description: string;
}

export interface UserDataContextType {
  // User Profile
  profile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // Mood Tracking
  moodEntries: MoodEntry[];
  addMoodEntry: (mood: number, notes?: string) => void;
  
  // Sessions
  sessions: SessionData[];
  addSession: (session: Omit<SessionData, 'id'>) => void;
  completeSession: (sessionId: string, rating?: number) => void;
  
  // Progress Metrics
  progressMetrics: ProgressMetrics;
  updateProgress: () => void;
  
  // Community
  communityActivity: CommunityActivity[];
  addCommunityPost: (title: string, content: string) => void;
  
  // Upcoming Events
  upcomingEvents: UpcomingEvent[];
  joinEvent: (eventId: string) => void;
  
  // Real-time updates
  isLoading: boolean;
  lastUpdated: Date | null;
  refreshData: () => void;
}

const UserDataContext = createContext<UserDataContextType | null>(null);

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // State for all user data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics>({
    daysActive: 0,
    currentStreak: 0,
    totalSessions: 0,
    averageMood: 0,
    lastActivity: '',
    weeklyGoalProgress: 0
  });
  const [communityActivity, setCommunityActivity] = useState<CommunityActivity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  // Initialize user data when user logs in
  useEffect(() => {
    if (user) {
      initializeUserData();
      // Set up real-time updates every 30 seconds
      const interval = setInterval(refreshData, 30000);
      return () => clearInterval(interval);
    } else {
      // Clear data when user logs out
      clearUserData();
    }
  }, [user]);

  const initializeUserData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls - replace with real API endpoints
      await loadUserProfile();
      await loadMoodEntries();
      await loadSessions();
      await loadCommunityActivity();
      await loadUpcomingEvents();
      updateProgress();
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error initializing user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      // Load profile from localStorage or create default
      const savedProfile = localStorage.getItem(`user_profile_${user?.id || user?.email}`);

      let userProfile: UserProfile;
      if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
      } else {
        // Create default profile for new users
        userProfile = {
          name: user?.name || 'Friend',
          email: user?.email || '',
          joinDate: new Date().toISOString().split('T')[0],
          preferences: {
            notifications: true,
            reminderTime: '09:00',
            privacyLevel: 'friends'
          },
          emergencyContacts: []
        };
        // Save default profile
        localStorage.setItem(`user_profile_${user?.id || user?.email}`, JSON.stringify(userProfile));
      }

      setProfile(userProfile);
      console.log('✅ User profile loaded:', userProfile.name);
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      // Fallback profile
      setProfile({
        name: user?.name || 'Friend',
        email: user?.email || '',
        joinDate: new Date().toISOString().split('T')[0],
        preferences: {
          notifications: true,
          reminderTime: '09:00',
          privacyLevel: 'friends'
        },
        emergencyContacts: []
      });
    }
  };

  const loadMoodEntries = async () => {
    try {
      // Load mood entries from Progress page storage
      const savedMoodData = localStorage.getItem('progress_mood_data');

      if (savedMoodData) {
        const moodData = JSON.parse(savedMoodData);
        // Convert Progress page format to UserData format
        const userMoodEntries: MoodEntry[] = moodData.map((entry: any) => ({
          id: entry.id,
          date: entry.date,
          mood: entry.mood,
          notes: entry.notes || '',
          timestamp: new Date(entry.createdAt || entry.date).getTime()
        }));

        setMoodEntries(userMoodEntries);
        console.log('✅ Mood entries loaded from Progress page:', userMoodEntries.length);
      } else {
        // No mood data yet
        setMoodEntries([]);
        console.log('📝 No mood entries found - user can start tracking in Progress page');
      }
    } catch (error) {
      console.error('❌ Error loading mood entries:', error);
      setMoodEntries([]);
    }
  };

  const loadSessions = async () => {
    try {
      // Load sessions from user-specific storage
      const savedSessions = localStorage.getItem(`user_sessions_${user?.id || user?.email}`);

      if (savedSessions) {
        const sessions = JSON.parse(savedSessions);
        setSessions(sessions);
        console.log('✅ Sessions loaded:', sessions.length);
      } else {
        // Create some initial sessions for new users
        const initialSessions: SessionData[] = [];
        setSessions(initialSessions);
        localStorage.setItem(`user_sessions_${user?.id || user?.email}`, JSON.stringify(initialSessions));
        console.log('📝 No sessions found - user can book sessions');
      }
    } catch (error) {
      console.error('❌ Error loading sessions:', error);
      setSessions([]);
    }
  };

  const loadCommunityActivity = async () => {
    try {
      // Load real community activity from persistent storage
      const data = persistenceHelpers.loadAllData();
      const publishedPosts = data.communityPosts.filter(post => post.isPublished);

      // Convert community posts to activity format
      const activity: CommunityActivity[] = publishedPosts.slice(0, 10).map(post => ({
        id: post.id,
        type: 'post' as const,
        title: post.title,
        content: post.content.substring(0, 150) + (post.content.length > 150 ? '...' : ''),
        author: post.author,
        timestamp: new Date(post.createdAt).getTime(),
        likes: post.likes || 0,
        replies: post.replies || 0
      }));

      setCommunityActivity(activity);
      console.log('✅ Community activity loaded:', activity.length, 'posts');
    } catch (error) {
      console.error('❌ Error loading community activity:', error);
      // Fallback to empty array
      setCommunityActivity([]);
    }
  };

  const loadUpcomingEvents = async () => {
    try {
      // Load upcoming events from user-specific storage
      const savedEvents = localStorage.getItem(`user_events_${user?.id || user?.email}`);

      if (savedEvents) {
        const events = JSON.parse(savedEvents);
        // Filter for future events only
        const futureEvents = events.filter((event: UpcomingEvent) =>
          new Date(event.date) >= new Date()
        );
        setUpcomingEvents(futureEvents);
        console.log('✅ Upcoming events loaded:', futureEvents.length);
      } else {
        // No events yet
        setUpcomingEvents([]);
        console.log('📅 No upcoming events found');
      }
    } catch (error) {
      console.error('❌ Error loading upcoming events:', error);
      setUpcomingEvents([]);
    }
  };

  const updateProgress = () => {
    try {
      // Load real progress data from Progress page
      const savedMoodData = localStorage.getItem('progress_mood_data');
      const savedGoals = localStorage.getItem('progress_goals');
      const savedHabits = localStorage.getItem('progress_habits');

      const now = new Date();
      const completedSessions = sessions.filter(s => s.completed);

      let currentStreak = 0;
      let averageMood = 0;
      let daysActive = 0;

      if (savedMoodData) {
        const moodData = JSON.parse(savedMoodData);

        // Calculate streak
        const sortedEntries = [...moodData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        for (let i = 0; i < sortedEntries.length; i++) {
          const entryDate = new Date(sortedEntries[i].date);
          const expectedDate = new Date(now);
          expectedDate.setDate(expectedDate.getDate() - i);

          if (entryDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
            currentStreak++;
          } else {
            break;
          }
        }

        // Calculate average mood from recent entries
        const recentMoods = moodData.filter((m: any) =>
          new Date(m.date) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        );

        averageMood = recentMoods.length > 0
          ? recentMoods.reduce((sum: number, entry: any) => sum + entry.mood, 0) / recentMoods.length
          : 0;

        daysActive = moodData.length;
      }

      // Calculate weekly goal progress from goals
      let weeklyGoalProgress = 0;
      if (savedGoals) {
        const goals = JSON.parse(savedGoals);
        const completedGoals = goals.filter((g: any) => g.completed).length;
        weeklyGoalProgress = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;
      }

      const metrics: ProgressMetrics = {
        daysActive,
        currentStreak,
        totalSessions: completedSessions.length,
        averageMood: Math.round(averageMood * 10) / 10,
        lastActivity: now.toISOString(),
        weeklyGoalProgress: Math.round(weeklyGoalProgress)
      };

      setProgressMetrics(metrics);
      console.log('✅ Progress metrics updated from real data:', metrics);
    } catch (error) {
      console.error('❌ Error updating progress metrics:', error);
      // Fallback to basic calculation
      const now = new Date();
      const completedSessions = sessions.filter(s => s.completed);
      const recentMoods = moodEntries.filter(m =>
        new Date(m.timestamp) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      );

      setProgressMetrics({
        daysActive: moodEntries.length,
        currentStreak: 0,
        totalSessions: completedSessions.length,
        averageMood: recentMoods.length > 0
          ? recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length
          : 0,
        lastActivity: now.toISOString(),
        weeklyGoalProgress: 0
      });
    }
  };

  const clearUserData = () => {
    setProfile(null);
    setMoodEntries([]);
    setSessions([]);
    setProgressMetrics({
      daysActive: 0,
      currentStreak: 0,
      totalSessions: 0,
      averageMood: 0,
      lastActivity: '',
      weeklyGoalProgress: 0
    });
    setCommunityActivity([]);
    setUpcomingEvents([]);
    setLastUpdated(null);
  };

  const refreshData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await Promise.all([
        loadUserProfile(),
        loadMoodEntries(),
        loadSessions(),
        loadCommunityActivity(),
        loadUpcomingEvents()
      ]);
      updateProgress();
      setLastUpdated(new Date());
      console.log('✅ All user data refreshed from real-time sources');
    } catch (error) {
      console.error('❌ Error refreshing user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      // Save to persistent storage
      localStorage.setItem(`user_profile_${user?.id || user?.email}`, JSON.stringify(updatedProfile));
      console.log('✅ Profile updated and saved:', updatedProfile);
    }
  };

  const addMoodEntry = (mood: number, notes?: string) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood,
      notes: notes || '',
      timestamp: Date.now()
    };

    // Update local state
    setMoodEntries(prev => [newEntry, ...prev]);

    // Also sync with Progress page storage
    try {
      const savedMoodData = localStorage.getItem('progress_mood_data');
      const moodData = savedMoodData ? JSON.parse(savedMoodData) : [];

      const progressEntry = {
        id: newEntry.id,
        date: newEntry.date,
        mood: newEntry.mood,
        energy: 5, // Default values for Progress page
        sleep: 5,
        anxiety: 5,
        stress: 5,
        notes: newEntry.notes,
        createdAt: new Date().toISOString()
      };

      moodData.push(progressEntry);
      localStorage.setItem('progress_mood_data', JSON.stringify(moodData));
      console.log('✅ Mood entry added and synced with Progress page');
    } catch (error) {
      console.error('❌ Error syncing mood entry with Progress page:', error);
    }

    updateProgress();
  };

  const addSession = (sessionData: Omit<SessionData, 'id'>) => {
    const newSession: SessionData = {
      ...sessionData,
      id: Date.now().toString()
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);

    // Save to persistent storage
    localStorage.setItem(`user_sessions_${user?.id || user?.email}`, JSON.stringify(updatedSessions));
    console.log('✅ Session added and saved:', newSession);

    updateProgress();
  };

  const completeSession = (sessionId: string, rating?: number) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, completed: true, rating }
        : session
    ));
    updateProgress();
  };

  const addCommunityPost = (title: string, content: string) => {
    const newPost: CommunityActivity = {
      id: Date.now().toString(),
      type: 'post',
      title,
      content,
      author: profile?.name || 'You',
      timestamp: Date.now(),
      likes: 0,
      replies: 0
    };
    setCommunityActivity(prev => [newPost, ...prev]);
  };

  const joinEvent = (eventId: string) => {
    setUpcomingEvents(prev => prev.map(event =>
      event.id === eventId
        ? { ...event, participants: event.participants + 1 }
        : event
    ));
  };

  const value: UserDataContextType = {
    profile,
    updateProfile,
    moodEntries,
    addMoodEntry,
    sessions,
    addSession,
    completeSession,
    progressMetrics,
    updateProgress,
    communityActivity,
    addCommunityPost,
    upcomingEvents,
    joinEvent,
    isLoading,
    lastUpdated,
    refreshData
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
