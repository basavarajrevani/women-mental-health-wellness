import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Calendar,
  Award,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  Clock,
  BarChart3,
  Heart,
  Brain,
  Moon,
  Zap,
  RefreshCw,
  Star,
  Trophy,
  Activity,
  X,
  Save,
  Download,
  FileText,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Users,
  MessageCircle,
  Lightbulb,
  Shield,
  Sunrise,
  Sunset
} from 'lucide-react';
import { Navigation } from '../components/layout/Navigation';
import { useUserData } from '../context/UserDataContext';
import DataExportSystem from '../components/DataExportSystem';
import AIInsights from '../components/AIInsights';

// Mental Health Progress Tracking Interfaces
interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
  anxiety: number; // 1-10 scale (lower is better)
  stress: number; // 1-10 scale (lower is better)
  motivation: number; // 1-10 scale
  socialConnection: number; // 1-10 scale
  selfCare: number; // 1-10 scale
  gratitude: string[]; // Things grateful for
  challenges: string[]; // Daily challenges faced
  wins: string[]; // Daily wins/achievements
  coping: string[]; // Coping strategies used
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface TherapySession {
  id: string;
  date: string;
  type: 'individual' | 'group' | 'family' | 'online' | 'self-help';
  therapistName?: string;
  duration: number; // minutes
  topics: string[];
  mood_before: number;
  mood_after: number;
  insights: string;
  homework: string;
  nextSession?: string;
  rating: number; // 1-5 stars
  cost?: number;
  notes: string;
  createdAt: string;
}

interface MentalHealthGoal {
  id: string;
  title: string;
  description: string;
  category: 'therapy' | 'self-care' | 'social' | 'mindfulness' | 'lifestyle' | 'coping';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  targetDate: string;
  isCompleted: boolean;
  milestones: {
    id: string;
    title: string;
    targetValue: number;
    isCompleted: boolean;
    completedDate?: string;
  }[];
  strategies: string[];
  barriers: string[];
  support: string[];
  createdAt: string;
  updatedAt: string;
}

interface WellnessActivity {
  id: string;
  name: string;
  category: 'mindfulness' | 'exercise' | 'creative' | 'social' | 'learning' | 'nature';
  duration: number; // minutes
  date: string;
  mood_before: number;
  mood_after: number;
  enjoyment: number; // 1-10 scale
  effectiveness: number; // 1-10 scale for mental health
  notes: string;
  location: string;
  withOthers: boolean;
  createdAt: string;
}

interface CopingStrategy {
  id: string;
  name: string;
  category: 'breathing' | 'grounding' | 'cognitive' | 'physical' | 'social' | 'creative';
  description: string;
  effectiveness: number; // 1-10 scale
  timesUsed: number;
  situations: string[]; // When it's most helpful
  instructions: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
}

// Mental Health Achievement System
interface MentalHealthAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'consistency' | 'growth' | 'therapy' | 'self-care' | 'social' | 'mindfulness';
  progress: number;
  target: number;
  completed: boolean;
  unlockedAt?: string;
  requirements: string[];
}

const defaultMentalHealthAchievements: MentalHealthAchievement[] = [
  {
    id: 'mood-tracker-14',
    title: 'Mindful Tracker',
    description: 'Track your mental health for 14 consecutive days',
    icon: '🧠',
    category: 'consistency',
    progress: 0,
    target: 14,
    completed: false,
    requirements: ['Log mood daily for 14 days', 'Include notes and reflections']
  },
  {
    id: 'therapy-sessions-5',
    title: 'Therapy Champion',
    description: 'Complete 5 therapy sessions',
    icon: '💬',
    category: 'therapy',
    progress: 0,
    target: 5,
    completed: false,
    requirements: ['Attend 5 therapy sessions', 'Rate each session', 'Record insights']
  },
  {
    id: 'coping-strategies-10',
    title: 'Coping Master',
    description: 'Learn and practice 10 different coping strategies',
    icon: '🛡️',
    category: 'self-care',
    progress: 0,
    target: 10,
    completed: false,
    requirements: ['Add 10 coping strategies', 'Use each strategy at least once']
  },
  {
    id: 'wellness-activities-20',
    title: 'Wellness Warrior',
    description: 'Complete 20 wellness activities',
    icon: '🌟',
    category: 'growth',
    progress: 0,
    target: 20,
    completed: false,
    requirements: ['Complete 20 wellness activities', 'Track mood before/after']
  },
  {
    id: 'gratitude-streak-30',
    title: 'Gratitude Guardian',
    description: 'Practice gratitude for 30 days',
    icon: '🙏',
    category: 'mindfulness',
    progress: 0,
    target: 30,
    completed: false,
    requirements: ['Record gratitude daily for 30 days', 'Minimum 3 items per day']
  },
  {
    id: 'social-connection-10',
    title: 'Social Butterfly',
    description: 'Maintain social connections for 10 days',
    icon: '🦋',
    category: 'social',
    progress: 0,
    target: 10,
    completed: false,
    requirements: ['Rate social connection 7+ for 10 days', 'Engage in social activities']
  }
];

export default function Progress() {
  const { profile } = useUserData();

  // Mental Health Progress State
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('mental_health_mood_entries');
    return saved ? JSON.parse(saved) : [];
  });

  const [therapySessions, setTherapySessions] = useState<TherapySession[]>(() => {
    const saved = localStorage.getItem('mental_health_therapy_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [mentalHealthGoals, setMentalHealthGoals] = useState<MentalHealthGoal[]>(() => {
    const saved = localStorage.getItem('mental_health_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [wellnessActivities, setWellnessActivities] = useState<WellnessActivity[]>(() => {
    const saved = localStorage.getItem('mental_health_wellness_activities');
    return saved ? JSON.parse(saved) : [];
  });

  const [copingStrategies, setCopingStrategies] = useState<CopingStrategy[]>(() => {
    const saved = localStorage.getItem('mental_health_coping_strategies');
    return saved ? JSON.parse(saved) : [];
  });

  const [achievements, setAchievements] = useState<MentalHealthAchievement[]>(() => {
    const saved = localStorage.getItem('mental_health_achievements');
    return saved ? JSON.parse(saved) : defaultMentalHealthAchievements;
  });

  // UI State
  const [activeTab, setActiveTab] = useState<'overview' | 'mood' | 'therapy' | 'goals' | 'wellness' | 'coping' | 'achievements'>('overview');
  const [showMoodEntry, setShowMoodEntry] = useState(false);
  const [showTherapySession, setShowTherapySession] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showWellnessActivity, setShowWellnessActivity] = useState(false);
  const [showCopingStrategy, setShowCopingStrategy] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);

  // Form state for mood entry
  const [newMoodEntry, setNewMoodEntry] = useState({
    mood: 5,
    energy: 5,
    anxiety: 5,
    stress: 5,
    motivation: 5,
    socialConnection: 5,
    selfCare: 5,
    gratitude: [] as string[],
    challenges: [] as string[],
    wins: [] as string[],
    coping: [] as string[],
    notes: ''
  });

  // Form state for therapy session
  const [newTherapySession, setNewTherapySession] = useState({
    type: 'individual' as const,
    therapistName: '',
    duration: 60,
    topics: [] as string[],
    mood_before: 5,
    mood_after: 5,
    insights: '',
    homework: '',
    rating: 5,
    notes: ''
  });

  // Form state for mental health goal
  const [newMentalHealthGoal, setNewMentalHealthGoal] = useState({
    title: '',
    description: '',
    category: 'self-care' as const,
    targetValue: 1,
    unit: 'times',
    targetDate: '',
    strategies: [] as string[],
    barriers: [] as string[],
    support: [] as string[]
  });

  // Form state for wellness activity
  const [newWellnessActivity, setNewWellnessActivity] = useState({
    name: '',
    category: 'mindfulness' as const,
    duration: 30,
    mood_before: 5,
    mood_after: 5,
    enjoyment: 5,
    effectiveness: 5,
    notes: '',
    location: '',
    withOthers: false
  });

  // Form state for coping strategy
  const [newCopingStrategy, setNewCopingStrategy] = useState({
    name: '',
    category: 'breathing' as const,
    description: '',
    effectiveness: 5,
    situations: [] as string[],
    instructions: ''
  });

  // Data persistence
  useEffect(() => {
    localStorage.setItem('mental_health_mood_entries', JSON.stringify(moodEntries));
  }, [moodEntries]);

  useEffect(() => {
    localStorage.setItem('mental_health_therapy_sessions', JSON.stringify(therapySessions));
  }, [therapySessions]);

  useEffect(() => {
    localStorage.setItem('mental_health_goals', JSON.stringify(mentalHealthGoals));
  }, [mentalHealthGoals]);

  useEffect(() => {
    localStorage.setItem('mental_health_wellness_activities', JSON.stringify(wellnessActivities));
  }, [wellnessActivities]);

  useEffect(() => {
    localStorage.setItem('mental_health_coping_strategies', JSON.stringify(copingStrategies));
  }, [copingStrategies]);

  useEffect(() => {
    localStorage.setItem('mental_health_achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Download functionality
  const downloadMentalHealthReport = () => {
    const report = generateMentalHealthReport();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mental-health-progress-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Mental health progress report downloaded successfully!');
  };

  const generateMentalHealthReport = (): string => {
    const today = new Date();
    const reportDate = today.toLocaleDateString();

    let report = `MENTAL HEALTH PROGRESS REPORT\n`;
    report += `Generated on: ${reportDate}\n`;
    report += `User: ${profile?.name || 'Unknown'}\n`;
    report += `Email: ${profile?.email || 'Unknown'}\n`;
    report += `\n${'='.repeat(60)}\n\n`;

    // Summary Statistics
    report += `SUMMARY STATISTICS\n`;
    report += `${'='.repeat(20)}\n`;
    report += `Total Mood Entries: ${moodEntries.length}\n`;
    report += `Therapy Sessions: ${therapySessions.length}\n`;
    report += `Active Mental Health Goals: ${mentalHealthGoals.filter(g => !g.isCompleted).length}\n`;
    report += `Completed Goals: ${mentalHealthGoals.filter(g => g.isCompleted).length}\n`;
    report += `Wellness Activities: ${wellnessActivities.length}\n`;
    report += `Coping Strategies: ${copingStrategies.length}\n`;
    report += `Achievements Unlocked: ${achievements.filter(a => a.completed).length}/${achievements.length}\n\n`;

    // Recent Mood Data
    if (moodEntries.length > 0) {
      report += `RECENT MOOD TRACKING (Last 7 entries)\n`;
      report += `${'='.repeat(40)}\n`;

      moodEntries.slice(0, 7).forEach(entry => {
        report += `Date: ${entry.date}\n`;
        report += `Mood: ${entry.mood}/10\n`;
        report += `Energy: ${entry.energy}/10\n`;
        report += `Anxiety: ${entry.anxiety}/10\n`;
        report += `Stress: ${entry.stress}/10\n`;
        report += `Motivation: ${entry.motivation}/10\n`;
        report += `Social Connection: ${entry.socialConnection}/10\n`;
        report += `Self Care: ${entry.selfCare}/10\n`;
        if (entry.gratitude.length > 0) {
          report += `Gratitude: ${entry.gratitude.join(', ')}\n`;
        }
        if (entry.wins.length > 0) {
          report += `Daily Wins: ${entry.wins.join(', ')}\n`;
        }
        if (entry.notes) {
          report += `Notes: ${entry.notes}\n`;
        }
        report += `\n`;
      });
    }

    // Therapy Progress
    if (therapySessions.length > 0) {
      report += `THERAPY PROGRESS\n`;
      report += `${'='.repeat(17)}\n`;

      therapySessions.slice(0, 5).forEach(session => {
        report += `Date: ${session.date}\n`;
        report += `Type: ${session.type}\n`;
        report += `Duration: ${session.duration} minutes\n`;
        report += `Mood Before: ${session.mood_before}/10\n`;
        report += `Mood After: ${session.mood_after}/10\n`;
        report += `Rating: ${session.rating}/5 stars\n`;
        if (session.insights) {
          report += `Insights: ${session.insights}\n`;
        }
        report += `\n`;
      });
    }

    report += `\nReport generated by Women's Mental Health Progress Tracker\n`;
    report += `Export Date: ${new Date().toISOString()}\n`;

    return report;
  };

  // Mental Health Helper Functions
  const addMoodEntry = (moodData: Partial<MoodEntry>) => {
    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: moodData.mood || 5,
      energy: moodData.energy || 5,
      anxiety: moodData.anxiety || 5,
      stress: moodData.stress || 5,
      motivation: moodData.motivation || 5,
      socialConnection: moodData.socialConnection || 5,
      selfCare: moodData.selfCare || 5,
      gratitude: moodData.gratitude || [],
      challenges: moodData.challenges || [],
      wins: moodData.wins || [],
      coping: moodData.coping || [],
      notes: moodData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMoodEntries(prev => [entry, ...prev]);
    setShowMoodEntry(false);
    updateAchievements();
    alert('Mood entry added successfully!');
  };

  const addTherapySession = (sessionData: Partial<TherapySession>) => {
    const session: TherapySession = {
      id: Date.now().toString(),
      date: sessionData.date || new Date().toISOString().split('T')[0],
      type: sessionData.type || 'individual',
      therapistName: sessionData.therapistName,
      duration: sessionData.duration || 60,
      topics: sessionData.topics || [],
      mood_before: sessionData.mood_before || 5,
      mood_after: sessionData.mood_after || 5,
      insights: sessionData.insights || '',
      homework: sessionData.homework || '',
      nextSession: sessionData.nextSession,
      rating: sessionData.rating || 5,
      cost: sessionData.cost,
      notes: sessionData.notes || '',
      createdAt: new Date().toISOString()
    };

    setTherapySessions(prev => [session, ...prev]);
    setShowTherapySession(false);
    updateAchievements();
    alert('Therapy session recorded successfully!');
  };

  const addMentalHealthGoal = (goalData: Partial<MentalHealthGoal>) => {
    const goal: MentalHealthGoal = {
      id: Date.now().toString(),
      title: goalData.title || '',
      description: goalData.description || '',
      category: goalData.category || 'self-care',
      targetValue: goalData.targetValue || 1,
      currentValue: 0,
      unit: goalData.unit || 'times',
      startDate: new Date().toISOString().split('T')[0],
      targetDate: goalData.targetDate || '',
      isCompleted: false,
      milestones: goalData.milestones || [],
      strategies: goalData.strategies || [],
      barriers: goalData.barriers || [],
      support: goalData.support || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMentalHealthGoals(prev => [goal, ...prev]);
    setShowGoalForm(false);
    alert('Mental health goal added successfully!');
  };

  const addWellnessActivity = (activityData: Partial<WellnessActivity>) => {
    const activity: WellnessActivity = {
      id: Date.now().toString(),
      name: activityData.name || '',
      category: activityData.category || 'mindfulness',
      duration: activityData.duration || 30,
      date: new Date().toISOString().split('T')[0],
      mood_before: activityData.mood_before || 5,
      mood_after: activityData.mood_after || 5,
      enjoyment: activityData.enjoyment || 5,
      effectiveness: activityData.effectiveness || 5,
      notes: activityData.notes || '',
      location: activityData.location || '',
      withOthers: activityData.withOthers || false,
      createdAt: new Date().toISOString()
    };

    setWellnessActivities(prev => [activity, ...prev]);
    setShowWellnessActivity(false);
    updateAchievements();
    alert('Wellness activity recorded successfully!');
  };

  const addCopingStrategy = (strategyData: Partial<CopingStrategy>) => {
    const strategy: CopingStrategy = {
      id: Date.now().toString(),
      name: strategyData.name || '',
      category: strategyData.category || 'breathing',
      description: strategyData.description || '',
      effectiveness: strategyData.effectiveness || 5,
      timesUsed: 0,
      situations: strategyData.situations || [],
      instructions: strategyData.instructions || '',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setCopingStrategies(prev => [strategy, ...prev]);
    setShowCopingStrategy(false);
    updateAchievements();
    alert('Coping strategy added successfully!');
  };

  const updateAchievements = () => {
    setAchievements(prev => prev.map(achievement => {
      let progress = achievement.progress;
      let completed = achievement.completed;

      switch (achievement.id) {
        case 'mood-tracker-14':
          progress = Math.min(moodEntries.length, 14);
          completed = progress >= 14;
          break;
        case 'therapy-sessions-5':
          progress = Math.min(therapySessions.length, 5);
          completed = progress >= 5;
          break;
        case 'coping-strategies-10':
          progress = Math.min(copingStrategies.length, 10);
          completed = progress >= 10;
          break;
        case 'wellness-activities-20':
          progress = Math.min(wellnessActivities.length, 20);
          completed = progress >= 20;
          break;
        case 'gratitude-streak-30':
          const gratitudeDays = moodEntries.filter(entry => entry.gratitude.length >= 3).length;
          progress = Math.min(gratitudeDays, 30);
          completed = progress >= 30;
          break;
        case 'social-connection-10':
          const socialDays = moodEntries.filter(entry => entry.socialConnection >= 7).length;
          progress = Math.min(socialDays, 10);
          completed = progress >= 10;
          break;
      }

      return {
        ...achievement,
        progress,
        completed,
        unlockedAt: completed && !achievement.completed ? new Date().toISOString() : achievement.unlockedAt
      };
    }));
  };

  // Update achievements when data changes
  useEffect(() => {
    updateAchievements();
  }, [moodEntries, therapySessions, mentalHealthGoals, wellnessActivities, copingStrategies]);

  // Handler for mood entry form
  const handleMoodEntrySubmit = () => {
    addMoodEntry(newMoodEntry);
    setNewMoodEntry({
      mood: 5,
      energy: 5,
      anxiety: 5,
      stress: 5,
      motivation: 5,
      socialConnection: 5,
      selfCare: 5,
      gratitude: [],
      challenges: [],
      wins: [],
      coping: [],
      notes: ''
    });
  };

  // Goal management functions
  const toggleGoalComplete = (goalId: string) => {
    setMentalHealthGoals(prev => prev.map(goal =>
      goal.id === goalId
        ? { ...goal, isCompleted: !goal.isCompleted, updatedAt: new Date().toISOString() }
        : goal
    ));
  };

  const updateGoalProgress = (goalId: string, newValue: number) => {
    setMentalHealthGoals(prev => prev.map(goal =>
      goal.id === goalId
        ? {
            ...goal,
            currentValue: Math.min(newValue, goal.targetValue),
            isCompleted: newValue >= goal.targetValue,
            updatedAt: new Date().toISOString()
          }
        : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setMentalHealthGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navigation />

      <main className="lg:ml-64 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Mental Health Progress
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2">
                Track your mental wellness journey and celebrate your growth
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadMentalHealthReport}
                className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:shadow-lg transition-all text-sm sm:text-base"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Quick Download</span>
                <span className="sm:hidden">Download</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDataExport(true)}
                className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-xl hover:shadow-lg transition-all text-sm sm:text-base"
              >
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Advanced Export</span>
                <span className="sm:hidden">Export</span>
              </motion.button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6 sm:mb-8">
            <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto pb-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'mood', label: 'Mood Tracking', icon: Heart },
                { id: 'therapy', label: 'Therapy Sessions', icon: MessageCircle },
                { id: 'goals', label: 'Mental Health Goals', icon: Target },
                { id: 'wellness', label: 'Wellness Activities', icon: Sunrise },
                { id: 'coping', label: 'Coping Strategies', icon: Shield },
                { id: 'achievements', label: 'Achievements', icon: Trophy }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-3 rounded-xl font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <tab.icon size={16} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Content based on active tab */}
          <div className="space-y-6 sm:space-y-8">
            <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6 sm:space-y-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-xs sm:text-sm font-medium">Mood Entries</p>
                          <p className="text-2xl sm:text-3xl font-bold text-purple-500 mt-1">{moodEntries.length}</p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">Days tracked</p>
                        </div>
                        <Heart className="h-8 w-8 sm:h-12 sm:w-12 text-purple-500 opacity-20" />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-xs sm:text-sm font-medium">Therapy Sessions</p>
                          <p className="text-2xl sm:text-3xl font-bold text-blue-500 mt-1">{therapySessions.length}</p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">Completed</p>
                        </div>
                        <MessageCircle className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 opacity-20" />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-xs sm:text-sm font-medium">Active Goals</p>
                          <p className="text-2xl sm:text-3xl font-bold text-green-500 mt-1">{mentalHealthGoals.filter(g => !g.isCompleted).length}</p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">In progress</p>
                        </div>
                        <Target className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 opacity-20" />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-xs sm:text-sm font-medium">Achievements</p>
                          <p className="text-2xl sm:text-3xl font-bold text-orange-500 mt-1">{achievements.filter(a => a.completed).length}</p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">Unlocked</p>
                        </div>
                        <Trophy className="h-8 w-8 sm:h-12 sm:w-12 text-orange-500 opacity-20" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Progress Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {/* Mood Trends */}
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Mood Trends</h3>
                      {moodEntries.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px]">
                          <LineChart data={moodEntries.slice(-7).reverse()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis domain={[1, 10]} fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="mood" stroke="#8b5cf6" name="Mood" strokeWidth={2} />
                            <Line type="monotone" dataKey="energy" stroke="#3b82f6" name="Energy" strokeWidth={2} />
                            <Line type="monotone" dataKey="motivation" stroke="#10b981" name="Motivation" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-center py-6 sm:py-8 text-gray-500">
                          <Heart className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm sm:text-base">No mood data yet. Start tracking!</p>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
                      <div className="space-y-2 sm:space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowMoodEntry(true)}
                          className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm sm:text-base"
                        >
                          <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Track Today's Mood</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowTherapySession(true)}
                          className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm sm:text-base"
                        >
                          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Log Therapy Session</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowGoalForm(true)}
                          className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm sm:text-base"
                        >
                          <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Set Mental Health Goal</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowWellnessActivity(true)}
                          className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm sm:text-base"
                        >
                          <Sunrise className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Record Wellness Activity</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <AIInsights
                    moodData={moodEntries}
                    goals={mentalHealthGoals}
                    activities={wellnessActivities}
                    therapySessions={therapySessions}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'mood' && (
              <motion.div
                key="mood"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mood Tracking</h2>
                    <div className="flex gap-2 sm:gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (confirm('Are you sure you want to reset all mood tracking data? This action cannot be undone.')) {
                            setMoodEntries([]);
                            localStorage.removeItem('mental_health_mood_entries');
                            alert('All mood tracking data has been reset.');
                          }
                        }}
                        className="flex items-center gap-1 sm:gap-2 bg-gray-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-700 text-sm sm:text-base"
                      >
                        <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Reset</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowMoodEntry(true)}
                        className="flex items-center gap-1 sm:gap-2 bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 text-sm sm:text-base"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Add Entry</span>
                        <span className="sm:hidden">Add</span>
                      </motion.button>
                    </div>
                  </div>

                  {moodEntries.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Mood Trends</h3>
                        <ResponsiveContainer width="100%" height={250} className="sm:!h-[300px]">
                          <LineChart data={moodEntries.slice(-14).reverse()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis domain={[1, 10]} fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="mood" stroke="#ef4444" name="Mood" />
                            <Line type="monotone" dataKey="energy" stroke="#3b82f6" name="Energy" />
                            <Line type="monotone" dataKey="anxiety" stroke="#f59e0b" name="Anxiety" />
                            <Line type="monotone" dataKey="stress" stroke="#ef4444" name="Stress" />
                            <Line type="monotone" dataKey="motivation" stroke="#10b981" name="Motivation" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {moodEntries.slice(-10).reverse().map((entry) => (
                            <div key={entry.id} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">{entry.date}</span>
                                <span className="text-lg font-bold text-red-500">{entry.mood}/10</span>
                              </div>
                              {entry.notes && (
                                <p className="text-sm text-gray-700">{entry.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                      <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Tracking Your Mood</h3>
                      <p className="text-gray-600 mb-6">Begin your mental health journey by recording your daily mood</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowMoodEntry(true)}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
                      >
                        Add First Entry
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'goals' && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Goals</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowGoalForm(true)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Goal
                    </motion.button>
                  </div>

                  {mentalHealthGoals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mentalHealthGoals.map((goal) => (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">{goal.title}</h3>
                              <p className="text-gray-600 text-sm mb-3">{goal.description}</p>

                              <div className="flex items-center gap-2 mb-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  goal.category === 'therapy' ? 'bg-blue-100 text-blue-800' :
                                  goal.category === 'self-care' ? 'bg-green-100 text-green-800' :
                                  goal.category === 'social' ? 'bg-purple-100 text-purple-800' :
                                  goal.category === 'mindfulness' ? 'bg-indigo-100 text-indigo-800' :
                                  goal.category === 'lifestyle' ? 'bg-yellow-100 text-yellow-800' :
                                  goal.category === 'coping' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {goal.category}
                                </span>
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleGoalComplete(goal.id)}
                              className={`p-2 rounded-full ${
                                goal.isCompleted
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                              }`}
                            >
                              <CheckCircle className="h-5 w-5" />
                            </motion.button>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{goal.currentValue}/{goal.targetValue}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  goal.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
                              />
                            </div>

                            {!goal.isCompleted && (
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => updateGoalProgress(goal.id, goal.currentValue + 1)}
                                  disabled={goal.currentValue >= goal.targetValue}
                                  className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  +1 Progress
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => deleteGoal(goal.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </motion.button>
                              </div>
                            )}
                          </div>

                          {goal.targetDate && (
                            <div className="mt-3 text-xs text-gray-500">
                              Due: {new Date(goal.targetDate).toLocaleDateString()}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                      <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Set Your First Goal</h3>
                      <p className="text-gray-600 mb-6">Create meaningful goals to track your progress and stay motivated</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowGoalForm(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                      >
                        Create First Goal
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'therapy' && (
              <motion.div
                key="therapy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Therapy Sessions</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowTherapySession(true)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Session
                    </motion.button>
                  </div>

                  {therapySessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {therapySessions.map((session) => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">{session.type} Session</h3>
                              <p className="text-gray-600 text-sm mb-2">{session.date}</p>
                              {session.therapistName && (
                                <p className="text-gray-600 text-sm mb-2">Therapist: {session.therapistName}</p>
                              )}
                              <p className="text-gray-600 text-sm mb-3">Duration: {session.duration} minutes</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < session.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Mood Before</span>
                              <span className="font-medium text-red-500">{session.mood_before}/10</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Mood After</span>
                              <span className="font-medium text-green-500">{session.mood_after}/10</span>
                            </div>

                            {session.insights && (
                              <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-1">Key Insights:</p>
                                <p className="text-sm text-gray-700">{session.insights}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                      <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Record Your First Session</h3>
                      <p className="text-gray-600 mb-6">Track your therapy progress and insights</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowTherapySession(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                      >
                        Add First Session
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'wellness' && (
              <motion.div
                key="wellness"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Wellness Activities</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowWellnessActivity(true)}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Activity
                    </motion.button>
                  </div>

                  {wellnessActivities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wellnessActivities.map((activity) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">{activity.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                activity.category === 'mindfulness' ? 'bg-purple-100 text-purple-800' :
                                activity.category === 'exercise' ? 'bg-blue-100 text-blue-800' :
                                activity.category === 'creative' ? 'bg-pink-100 text-pink-800' :
                                activity.category === 'social' ? 'bg-green-100 text-green-800' :
                                activity.category === 'learning' ? 'bg-yellow-100 text-yellow-800' :
                                activity.category === 'nature' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {activity.category}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Duration</span>
                              <span className="font-medium">{activity.duration} min</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Mood Before</span>
                              <span className="font-medium text-red-500">{activity.mood_before}/10</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Mood After</span>
                              <span className="font-medium text-green-500">{activity.mood_after}/10</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Enjoyment</span>
                              <span className="font-medium text-blue-500">{activity.enjoyment}/10</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Effectiveness</span>
                              <span className="font-medium text-purple-500">{activity.effectiveness}/10</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                      <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Wellness Journey</h3>
                      <p className="text-gray-600 mb-6">Track activities that boost your mental health</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowWellnessActivity(true)}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                      >
                        Add First Activity
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'coping' && (
              <motion.div
                key="coping"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Coping Strategies</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCopingStrategy(true)}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Strategy
                    </motion.button>
                  </div>

                  {copingStrategies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {copingStrategies.map((strategy) => (
                        <motion.div
                          key={strategy.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">{strategy.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                strategy.category === 'breathing' ? 'bg-blue-100 text-blue-800' :
                                strategy.category === 'grounding' ? 'bg-green-100 text-green-800' :
                                strategy.category === 'cognitive' ? 'bg-purple-100 text-purple-800' :
                                strategy.category === 'physical' ? 'bg-red-100 text-red-800' :
                                strategy.category === 'social' ? 'bg-yellow-100 text-yellow-800' :
                                strategy.category === 'creative' ? 'bg-pink-100 text-pink-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {strategy.category}
                              </span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setCopingStrategies(prev => prev.map(s =>
                                  s.id === strategy.id
                                    ? { ...s, timesUsed: s.timesUsed + 1 }
                                    : s
                                ));
                              }}
                              className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </motion.button>
                          </div>

                          <div className="space-y-3">
                            <p className="text-sm text-gray-700">{strategy.description}</p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Effectiveness</span>
                              <span className="font-medium text-purple-500">{strategy.effectiveness}/10</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Times Used</span>
                              <span className="font-medium text-blue-500">{strategy.timesUsed}</span>
                            </div>
                            {strategy.instructions && (
                              <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-1">Instructions:</p>
                                <p className="text-sm text-gray-700">{strategy.instructions}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                      <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Your Coping Toolkit</h3>
                      <p className="text-gray-600 mb-6">Add strategies to help manage difficult moments</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCopingStrategy(true)}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
                      >
                        Add First Strategy
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Achievements</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm text-gray-600">
                        {achievements.filter(a => a.completed).length} of {achievements.length} unlocked
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          updateAchievements();
                          alert('Achievements updated based on your current progress!');
                        }}
                        className="flex items-center gap-1 sm:gap-2 bg-yellow-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-yellow-700 text-sm sm:text-base self-start sm:self-auto"
                      >
                        <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Check Progress</span>
                        <span className="sm:hidden">Check</span>
                      </motion.button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {achievements.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all ${
                          achievement.completed
                            ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200'
                            : 'bg-white border-2 border-gray-200'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 ${achievement.completed ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                            {achievement.icon}
                          </div>

                          <h3 className={`font-semibold mb-1 sm:mb-2 text-sm sm:text-base ${
                            achievement.completed ? 'text-yellow-800' : 'text-gray-900'
                          }`}>
                            {achievement.title}
                          </h3>

                          <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${
                            achievement.completed ? 'text-yellow-700' : 'text-gray-600'
                          }`}>
                            {achievement.description}
                          </p>

                          <div className="space-y-1.5 sm:space-y-2">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{achievement.progress}/{achievement.target}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                              <div
                                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                                  achievement.completed ? 'bg-yellow-500' : 'bg-gray-400'
                                }`}
                                style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                              />
                            </div>
                          </div>

                          {achievement.completed && achievement.unlockedAt && (
                            <div className="mt-2 sm:mt-3 text-xs text-yellow-700">
                              Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </div>
                          )}

                          {!achievement.completed && (
                            <div className="mt-2 sm:mt-3">
                              <div className="text-xs text-gray-500 mb-1 sm:mb-2">Requirements:</div>
                              <ul className="text-xs text-gray-600 space-y-0.5 sm:space-y-1">
                                {achievement.requirements.map((req, index) => (
                                  <li key={index} className="flex items-start gap-1 text-left">
                                    <div className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                                    <span className="leading-tight">{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Modals */}
      {/* Mood Entry Modal */}
      {showMoodEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Mood Entry</h3>
              <button
                onClick={() => setShowMoodEntry(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {['mood', 'energy', 'anxiety', 'stress', 'motivation', 'socialConnection', 'selfCare'].map((metric) => (
                <div key={metric}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1')} (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newMoodEntry[metric as keyof typeof newMoodEntry] as number}
                    onChange={(e) =>
                      setNewMoodEntry({
                        ...newMoodEntry,
                        [metric]: parseInt(e.target.value)
                      })
                    }
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">
                    {newMoodEntry[metric as keyof typeof newMoodEntry]}
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={newMoodEntry.notes}
                  onChange={(e) =>
                    setNewMoodEntry({ ...newMoodEntry, notes: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="How are you feeling today?"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowMoodEntry(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMoodEntrySubmit}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Mental Health Goal</h3>
              <button
                onClick={() => setShowGoalForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={newMentalHealthGoal.title}
                  onChange={(e) => setNewMentalHealthGoal({ ...newMentalHealthGoal, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Practice meditation daily"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newMentalHealthGoal.description}
                  onChange={(e) => setNewMentalHealthGoal({ ...newMentalHealthGoal, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your goal..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={newMentalHealthGoal.targetValue}
                    onChange={(e) => setNewMentalHealthGoal({ ...newMentalHealthGoal, targetValue: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newMentalHealthGoal.category}
                    onChange={(e) => setNewMentalHealthGoal({ ...newMentalHealthGoal, category: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="therapy">Therapy</option>
                    <option value="self-care">Self-Care</option>
                    <option value="social">Social</option>
                    <option value="mindfulness">Mindfulness</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="coping">Coping</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newMentalHealthGoal.targetDate}
                  onChange={(e) => setNewMentalHealthGoal({ ...newMentalHealthGoal, targetDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowGoalForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addMentalHealthGoal(newMentalHealthGoal);
                    setNewMentalHealthGoal({
                      title: '',
                      description: '',
                      category: 'self-care',
                      targetValue: 1,
                      unit: 'times',
                      targetDate: '',
                      strategies: [],
                      barriers: [],
                      support: []
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Therapy Session Modal */}
      {showTherapySession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Therapy Session</h3>
              <button
                onClick={() => setShowTherapySession(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Type
                </label>
                <select
                  value={newTherapySession.type}
                  onChange={(e) => setNewTherapySession({ ...newTherapySession, type: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="family">Family</option>
                  <option value="online">Online</option>
                  <option value="self-help">Self-Help</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Therapist Name (optional)
                </label>
                <input
                  type="text"
                  value={newTherapySession.therapistName}
                  onChange={(e) => setNewTherapySession({ ...newTherapySession, therapistName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dr. Smith"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newTherapySession.duration}
                    onChange={(e) => setNewTherapySession({ ...newTherapySession, duration: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="15"
                    max="180"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating (1-5)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newTherapySession.rating}
                    onChange={(e) => setNewTherapySession({ ...newTherapySession, rating: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">{newTherapySession.rating}/5</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mood Before (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newTherapySession.mood_before}
                    onChange={(e) => setNewTherapySession({ ...newTherapySession, mood_before: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">{newTherapySession.mood_before}/10</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mood After (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newTherapySession.mood_after}
                    onChange={(e) => setNewTherapySession({ ...newTherapySession, mood_after: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">{newTherapySession.mood_after}/10</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Insights
                </label>
                <textarea
                  value={newTherapySession.insights}
                  onChange={(e) => setNewTherapySession({ ...newTherapySession, insights: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="What did you learn or discover?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newTherapySession.notes}
                  onChange={(e) => setNewTherapySession({ ...newTherapySession, notes: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowTherapySession(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addTherapySession(newTherapySession);
                    setNewTherapySession({
                      type: 'individual',
                      therapistName: '',
                      duration: 60,
                      topics: [],
                      mood_before: 5,
                      mood_after: 5,
                      insights: '',
                      homework: '',
                      rating: 5,
                      notes: ''
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Session
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Wellness Activity Modal */}
      {showWellnessActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Wellness Activity</h3>
              <button
                onClick={() => setShowWellnessActivity(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Name
                </label>
                <input
                  type="text"
                  value={newWellnessActivity.name}
                  onChange={(e) => setNewWellnessActivity({ ...newWellnessActivity, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Morning meditation"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newWellnessActivity.category}
                    onChange={(e) => setNewWellnessActivity({ ...newWellnessActivity, category: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="mindfulness">Mindfulness</option>
                    <option value="exercise">Exercise</option>
                    <option value="creative">Creative</option>
                    <option value="social">Social</option>
                    <option value="learning">Learning</option>
                    <option value="nature">Nature</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newWellnessActivity.duration}
                    onChange={(e) => setNewWellnessActivity({ ...newWellnessActivity, duration: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="5"
                    max="300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mood Before (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newWellnessActivity.mood_before}
                    onChange={(e) => setNewWellnessActivity({ ...newWellnessActivity, mood_before: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">{newWellnessActivity.mood_before}/10</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mood After (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newWellnessActivity.mood_after}
                    onChange={(e) => setNewWellnessActivity({ ...newWellnessActivity, mood_after: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">{newWellnessActivity.mood_after}/10</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enjoyment (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newWellnessActivity.enjoyment}
                    onChange={(e) => setNewWellnessActivity({ ...newWellnessActivity, enjoyment: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">{newWellnessActivity.enjoyment}/10</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effectiveness (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newWellnessActivity.effectiveness}
                    onChange={(e) => setNewWellnessActivity({ ...newWellnessActivity, effectiveness: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">{newWellnessActivity.effectiveness}/10</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newWellnessActivity.notes}
                  onChange={(e) => setNewWellnessActivity({ ...newWellnessActivity, notes: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="How did this activity make you feel?"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWellnessActivity(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addWellnessActivity(newWellnessActivity);
                    setNewWellnessActivity({
                      name: '',
                      category: 'mindfulness',
                      duration: 30,
                      mood_before: 5,
                      mood_after: 5,
                      enjoyment: 5,
                      effectiveness: 5,
                      notes: '',
                      location: '',
                      withOthers: false
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Activity
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Coping Strategy Modal */}
      {showCopingStrategy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Coping Strategy</h3>
              <button
                onClick={() => setShowCopingStrategy(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strategy Name
                </label>
                <input
                  type="text"
                  value={newCopingStrategy.name}
                  onChange={(e) => setNewCopingStrategy({ ...newCopingStrategy, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Deep breathing exercise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newCopingStrategy.category}
                  onChange={(e) => setNewCopingStrategy({ ...newCopingStrategy, category: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="breathing">Breathing</option>
                  <option value="grounding">Grounding</option>
                  <option value="cognitive">Cognitive</option>
                  <option value="physical">Physical</option>
                  <option value="social">Social</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newCopingStrategy.description}
                  onChange={(e) => setNewCopingStrategy({ ...newCopingStrategy, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe this coping strategy..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  value={newCopingStrategy.instructions}
                  onChange={(e) => setNewCopingStrategy({ ...newCopingStrategy, instructions: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Step-by-step instructions..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Effectiveness (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newCopingStrategy.effectiveness}
                  onChange={(e) => setNewCopingStrategy({ ...newCopingStrategy, effectiveness: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{newCopingStrategy.effectiveness}/10</div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCopingStrategy(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addCopingStrategy(newCopingStrategy);
                    setNewCopingStrategy({
                      name: '',
                      category: 'breathing',
                      description: '',
                      effectiveness: 5,
                      situations: [],
                      instructions: ''
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save Strategy
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Data Export System */}
      <DataExportSystem isOpen={showDataExport} onClose={() => setShowDataExport(false)} />

    </div>
  );
}
