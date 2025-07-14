import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Activity,
  Heart,
  Droplet,
  Moon,
  Sun,
  Coffee,
  Apple,
  Trash2,
  Edit2,
  RotateCcw,
  Download,
  FileText,
  BarChart3,
  Plus,
  Target,
  Bell,
  BookOpen,
  TrendingUp,
  Save
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Navigation } from '../components/layout/Navigation';
import { useUserData } from '../context/UserDataContext';

interface Note {
  id: string;
  date: string;
  content: string;
  createdAt: string;
  category: 'general' | 'symptoms' | 'mood' | 'exercise' | 'nutrition';
}

interface HealthData {
  id: string;
  date: string;
  menstrualFlow: 'light' | 'medium' | 'heavy' | 'none';
  mood: 'excellent' | 'good' | 'neutral' | 'low' | 'anxious' | 'depressed';
  moodScore: number; // 1-10 scale
  symptoms: string[];
  sleep: number;
  sleepQuality: 'excellent' | 'good' | 'fair' | 'poor';
  water: number;
  exercise: number;
  exerciseType: string;
  nutrition: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    snacks: number;
    fruits: number;
    vegetables: number;
  };
  vitals: {
    weight?: number;
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
  };
  medications: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface HealthGoal {
  id: string;
  title: string;
  description: string;
  category: 'exercise' | 'nutrition' | 'sleep' | 'mental' | 'medical';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  isCompleted: boolean;
  createdAt: string;
}

interface HealthReminder {
  id: string;
  title: string;
  description: string;
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  category: 'medication' | 'exercise' | 'appointment' | 'checkup';
  createdAt: string;
}

const defaultEntry: HealthData = {
  id: '',
  date: new Date().toISOString().split('T')[0],
  menstrualFlow: 'none',
  mood: 'neutral',
  moodScore: 5,
  symptoms: [],
  sleep: 0,
  sleepQuality: 'good',
  water: 0,
  exercise: 0,
  exerciseType: '',
  nutrition: {
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: 0,
    fruits: 0,
    vegetables: 0
  },
  vitals: {},
  medications: [],
  notes: '',
  createdAt: '',
  updatedAt: ''
};

const HealthTracker: React.FC = () => {
  const { profile, moodEntries, addMoodEntry } = useUserData();

  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'calendar' | 'insights' | 'notes' | 'goals' | 'reminders'>('overview');
  const [healthData, setHealthData] = useState<HealthData[]>(() => {
    const saved = localStorage.getItem('health_tracker_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentEntry, setCurrentEntry] = useState<HealthData>(defaultEntry);
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('health_tracker_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [goals, setGoals] = useState<HealthGoal[]>(() => {
    const saved = localStorage.getItem('health_tracker_goals');
    return saved ? JSON.parse(saved) : [];
  });
  const [reminders, setReminders] = useState<HealthReminder[]>(() => {
    const saved = localStorage.getItem('health_tracker_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  // UI state
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('health_tracker_data', JSON.stringify(healthData));
  }, [healthData]);

  useEffect(() => {
    localStorage.setItem('health_tracker_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('health_tracker_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('health_tracker_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Sync with Progress page mood data
  useEffect(() => {
    if (moodEntries && moodEntries.length > 0) {
      // Sync latest mood entry if not already in health data
      const latestMood = moodEntries[0];
      const existingEntry = healthData.find(entry => entry.date === latestMood.date);

      if (!existingEntry && latestMood.date === new Date().toISOString().split('T')[0]) {
        // Create health entry from mood data
        const healthEntry: HealthData = {
          ...defaultEntry,
          id: Date.now().toString(),
          date: latestMood.date,
          moodScore: latestMood.mood,
          mood: latestMood.mood >= 8 ? 'excellent' :
                latestMood.mood >= 6 ? 'good' :
                latestMood.mood >= 4 ? 'neutral' : 'low',
          notes: latestMood.notes || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setHealthData(prev => [healthEntry, ...prev]);
      }
    }
  }, [moodEntries]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all fields? Your note will be saved.')) {
      const noteToSave = currentEntry.notes.trim();
      if (noteToSave) {
        const newNote: Note = {
          id: Date.now().toString(),
          date: currentEntry.date,
          content: noteToSave,
          createdAt: new Date().toISOString()
        };
        setNotes(prev => [newNote, ...prev]);
      }
      setCurrentEntry(defaultEntry);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleSaveEdit = (noteId: string, newContent: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, content: newContent }
        : note
    ));
    setEditingNote(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = healthData.findIndex(entry => entry.date === today);

    const entryToSave: HealthData = {
      ...currentEntry,
      id: existingIndex >= 0 ? healthData[existingIndex].id : Date.now().toString(),
      date: today,
      createdAt: existingIndex >= 0 ? healthData[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      const updatedData = [...healthData];
      updatedData[existingIndex] = entryToSave;
      setHealthData(updatedData);
    } else {
      setHealthData([entryToSave, ...healthData]);
    }

    // Sync with Progress page if mood data exists
    if (entryToSave.moodScore > 0) {
      addMoodEntry(entryToSave.moodScore, entryToSave.notes);
    }

    if (currentEntry.notes.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        date: currentEntry.date,
        content: currentEntry.notes,
        category: 'general',
        createdAt: new Date().toISOString()
      };
      setNotes(prev => [newNote, ...prev]);
    }

    setCurrentEntry(defaultEntry);
    alert('Health data saved successfully!');
  };

  const handleDeleteEntry = (date: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setHealthData(prev => prev.filter(entry => entry.date !== date));
    }
  };

  const handleResetInsights = () => {
    if (window.confirm('Are you sure you want to reset all health data? This cannot be undone.')) {
      setHealthData([]);
      setNotes([]);
      setGoals([]);
      setReminders([]);
      localStorage.removeItem('health_tracker_data');
      localStorage.removeItem('health_tracker_notes');
      localStorage.removeItem('health_tracker_goals');
      localStorage.removeItem('health_tracker_reminders');
    }
  };

  // Download functionality
  const downloadHealthData = () => {
    const dataToDownload = {
      healthData,
      notes,
      goals,
      reminders,
      profile: {
        name: profile?.name,
        email: profile?.email
      },
      exportDate: new Date().toISOString(),
      summary: {
        totalEntries: healthData.length,
        totalNotes: notes.length,
        totalGoals: goals.length,
        activeReminders: reminders.filter(r => r.isActive).length,
        dateRange: healthData.length > 0 ? {
          from: healthData[healthData.length - 1]?.date,
          to: healthData[0]?.date
        } : null
      }
    };

    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Health data downloaded successfully!');
  };

  const downloadHealthReport = () => {
    const report = generateHealthReport();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Health report downloaded successfully!');
  };

  const generateHealthReport = (): string => {
    const today = new Date();
    const reportDate = today.toLocaleDateString();

    let report = `HEALTH TRACKER REPORT\n`;
    report += `Generated on: ${reportDate}\n`;
    report += `User: ${profile?.name || 'Unknown'}\n`;
    report += `Email: ${profile?.email || 'Unknown'}\n`;
    report += `\n${'='.repeat(50)}\n\n`;

    // Summary Statistics
    report += `SUMMARY STATISTICS\n`;
    report += `${'='.repeat(20)}\n`;
    report += `Total Health Entries: ${healthData.length}\n`;
    report += `Total Notes: ${notes.length}\n`;
    report += `Active Goals: ${goals.filter(g => !g.isCompleted).length}\n`;
    report += `Completed Goals: ${goals.filter(g => g.isCompleted).length}\n`;
    report += `Active Reminders: ${reminders.filter(r => r.isActive).length}\n\n`;

    // Recent Health Data
    if (healthData.length > 0) {
      report += `RECENT HEALTH DATA (Last 7 entries)\n`;
      report += `${'='.repeat(35)}\n`;

      healthData.slice(0, 7).forEach(entry => {
        report += `Date: ${entry.date}\n`;
        report += `Mood: ${entry.mood} (Score: ${entry.moodScore}/10)\n`;
        report += `Sleep: ${entry.sleep} hours (Quality: ${entry.sleepQuality})\n`;
        report += `Water: ${entry.water} glasses\n`;
        report += `Exercise: ${entry.exercise} minutes\n`;
        if (entry.symptoms.length > 0) {
          report += `Symptoms: ${entry.symptoms.join(', ')}\n`;
        }
        if (entry.notes) {
          report += `Notes: ${entry.notes}\n`;
        }
        report += `\n`;
      });
    }

    report += `\nReport generated by Women's Mental Health Tracker\n`;
    report += `Export Date: ${new Date().toISOString()}\n`;

    return report;
  };

  // Helper functions for goals and reminders
  const addGoal = (goalData: Omit<HealthGoal, 'id' | 'createdAt'>) => {
    const newGoal: HealthGoal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setGoals(prev => [newGoal, ...prev]);
    setShowAddGoal(false);
    alert('Health goal added successfully!');
  };

  const updateGoalProgress = (id: string, progress: number) => {
    setGoals(prev => prev.map(goal =>
      goal.id === id
        ? { ...goal, current: progress, isCompleted: progress >= goal.target }
        : goal
    ));
  };

  const deleteGoal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(prev => prev.filter(goal => goal.id !== id));
    }
  };

  const addReminder = (reminderData: Omit<HealthReminder, 'id' | 'createdAt'>) => {
    const newReminder: HealthReminder = {
      ...reminderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setReminders(prev => [newReminder, ...prev]);
    setShowAddReminder(false);
    alert('Health reminder added successfully!');
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder =>
      reminder.id === id
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      setReminders(prev => prev.filter(reminder => reminder.id !== id));
    }
  };

  // Note management functions
  const addNote = (content: string, category: Note['category'] = 'general') => {
    const newNote: Note = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content,
      category,
      createdAt: new Date().toISOString()
    };

    setNotes(prev => [newNote, ...prev]);
    alert('Note added successfully!');
  };

  const updateNote = (id: string, content: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, content } : note
    ));
    setEditingNote(null);
    alert('Note updated successfully!');
  };

  const deleteNote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== id));
    }
  };

  const symptoms = [
    'Cramps', 'Headache', 'Fatigue', 'Bloating', 'Backache',
    'Breast Tenderness', 'Mood Swings', 'Acne', 'Insomnia'
  ];

  const getChartData = (): { date: string; sleep: number; water: number; exercise: number; }[] => {
    return healthData.slice(-7).map(entry => ({
      date: entry.date,
      sleep: entry.sleep,
      water: entry.water,
      exercise: entry.exercise
    }));
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
                Health Tracker
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2">
                Comprehensive health monitoring and wellness tracking
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadHealthReport}
                className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-xl hover:shadow-lg transition-all text-sm sm:text-base"
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Download Health Data</span>
                <span className="sm:hidden">Download</span>
              </motion.button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6 sm:mb-8">
            <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto pb-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'daily', label: 'Daily Log', icon: Calendar },
                { id: 'insights', label: 'Insights', icon: TrendingUp },
                { id: 'goals', label: 'Goals', icon: Target },
                { id: 'reminders', label: 'Reminders', icon: Bell },
                { id: 'notes', label: 'Notes', icon: BookOpen }
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
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Health Entries</p>
                          <p className="text-3xl font-bold text-purple-500 mt-1">{healthData.length}</p>
                          <p className="text-sm text-gray-500 mt-1">Total logged</p>
                        </div>
                        <Activity className="h-12 w-12 text-purple-500 opacity-20" />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Active Goals</p>
                          <p className="text-3xl font-bold text-blue-500 mt-1">{goals.filter(g => !g.isCompleted).length}</p>
                          <p className="text-sm text-gray-500 mt-1">In progress</p>
                        </div>
                        <Target className="h-12 w-12 text-blue-500 opacity-20" />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Notes</p>
                          <p className="text-3xl font-bold text-green-500 mt-1">{notes.length}</p>
                          <p className="text-sm text-gray-500 mt-1">Recorded</p>
                        </div>
                        <BookOpen className="h-12 w-12 text-green-500 opacity-20" />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Reminders</p>
                          <p className="text-3xl font-bold text-orange-500 mt-1">{reminders.filter(r => r.isActive).length}</p>
                          <p className="text-sm text-gray-500 mt-1">Active</p>
                        </div>
                        <Bell className="h-12 w-12 text-orange-500 opacity-20" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Health Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Health Trends</h3>
                      {healthData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={healthData.slice(-7).reverse()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="moodScore" stroke="#8b5cf6" name="Mood" />
                            <Line type="monotone" dataKey="sleep" stroke="#3b82f6" name="Sleep" />
                            <Line type="monotone" dataKey="water" stroke="#10b981" name="Water" />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No health data yet. Start logging!</p>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab('daily')}
                          className="w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          <Calendar className="h-5 w-5" />
                          <span>Log Today's Health</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowAddGoal(true)}
                          className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Target className="h-5 w-5" />
                          <span>Add Health Goal</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab('notes')}
                          className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <BookOpen className="h-5 w-5" />
                          <span>Add Note</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'daily' && (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Menstrual Flow</h2>
            <div className="grid grid-cols-2 sm:flex sm:space-x-4 gap-2 sm:gap-0">
              {['none', 'light', 'medium', 'heavy'].map((flow) => (
                <button
                  key={flow}
                  type="button"
                  onClick={() => setCurrentEntry({ ...currentEntry, menstrualFlow: flow as any })}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base transition-colors ${
                    currentEntry.menstrualFlow === flow
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {flow.charAt(0).toUpperCase() + flow.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Mood</h2>
            <div className="grid grid-cols-2 sm:flex sm:space-x-4 gap-2 sm:gap-0">
              {['happy', 'neutral', 'sad', 'anxious'].map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setCurrentEntry({ ...currentEntry, mood: mood as any })}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base transition-colors ${
                    currentEntry.mood === mood
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Symptoms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {symptoms.map((symptom) => (
                <label
                  key={symptom}
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={currentEntry.symptoms.includes(symptom)}
                    onChange={(e) => {
                      const newSymptoms = e.target.checked
                        ? [...currentEntry.symptoms, symptom]
                        : currentEntry.symptoms.filter(s => s !== symptom);
                      setCurrentEntry({ ...currentEntry, symptoms: newSymptoms });
                    }}
                    className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-purple-600"
                  />
                  <span className="text-sm sm:text-base">{symptom}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Sleep</h2>
              <div className="flex items-center space-x-2">
                <Moon className="text-purple-600 h-5 w-5 sm:h-6 sm:w-6" />
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={currentEntry.sleep}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, sleep: Number(e.target.value) })}
                  className="form-input w-full rounded-lg text-sm sm:text-base"
                  placeholder="Hours of sleep"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Water Intake</h2>
              <div className="flex items-center space-x-2">
                <Droplet className="text-blue-600 h-5 w-5 sm:h-6 sm:w-6" />
                <input
                  type="number"
                  min="0"
                  value={currentEntry.water}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, water: Number(e.target.value) })}
                  className="form-input w-full rounded-lg text-sm sm:text-base"
                  placeholder="Glasses of water"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Exercise</h2>
              <div className="flex items-center space-x-2">
                <Activity className="text-green-600 h-5 w-5 sm:h-6 sm:w-6" />
                <input
                  type="number"
                  min="0"
                  value={currentEntry.exercise}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, exercise: Number(e.target.value) })}
                  className="form-input w-full rounded-lg text-sm sm:text-base"
                  placeholder="Minutes of exercise"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Nutrition</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={currentEntry.nutrition.breakfast}
                  onChange={(e) => setCurrentEntry({
                    ...currentEntry,
                    nutrition: { ...currentEntry.nutrition, breakfast: e.target.checked }
                  })}
                  className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-purple-600"
                />
                <span className="text-sm sm:text-base">Breakfast</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={currentEntry.nutrition.lunch}
                  onChange={(e) => setCurrentEntry({
                    ...currentEntry,
                    nutrition: { ...currentEntry.nutrition, lunch: e.target.checked }
                  })}
                  className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-purple-600"
                />
                <span className="text-sm sm:text-base">Lunch</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={currentEntry.nutrition.dinner}
                  onChange={(e) => setCurrentEntry({
                    ...currentEntry,
                    nutrition: { ...currentEntry.nutrition, dinner: e.target.checked }
                  })}
                  className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-purple-600"
                />
                <span className="text-sm sm:text-base">Dinner</span>
              </label>
              <div className="flex items-center space-x-2 p-2">
                <label className="text-sm sm:text-base">Snacks:</label>
                <input
                  type="number"
                  min="0"
                  value={currentEntry.nutrition.snacks}
                  onChange={(e) => setCurrentEntry({
                    ...currentEntry,
                    nutrition: { ...currentEntry.nutrition, snacks: Number(e.target.value) }
                  })}
                  className="form-input w-16 sm:w-20 rounded-lg text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-semibold">Notes</h2>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center space-x-1 sm:space-x-2 text-purple-600 hover:text-purple-700 self-start sm:self-auto text-sm sm:text-base"
              >
                <RotateCcw size={16} className="sm:w-5 sm:h-5" />
                <span>Reset Form</span>
              </button>
            </div>
            <textarea
              value={currentEntry.notes}
              onChange={(e) => setCurrentEntry({ ...currentEntry, notes: e.target.value })}
              className="form-textarea w-full rounded-lg text-sm sm:text-base"
              rows={3}
              placeholder="Add any additional notes about your day..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base font-medium"
          >
            Save Entry
          </button>
        </form>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthData.map((entry) => (
              <div
                key={entry.date}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow relative group"
              >
                <button
                  onClick={() => handleDeleteEntry(entry.date)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
                <div className="font-semibold">{new Date(entry.date).toLocaleDateString()}</div>
                <div className={`text-sm ${
                  entry.menstrualFlow === 'none' ? 'text-gray-400' : 'text-pink-600'
                }`}>
                  Flow: {entry.menstrualFlow.charAt(0).toUpperCase() + entry.menstrualFlow.slice(1)}
                </div>
                <div className="text-sm text-purple-600">Mood: {entry.mood}</div>
                {entry.symptoms.length > 0 && (
                  <div className="text-sm text-gray-600 mt-2">
                    Symptoms: {entry.symptoms.join(', ')}
                  </div>
                )}
                <div className="mt-2 text-sm">
                  <div>Sleep: {entry.sleep}hrs</div>
                  <div>Water: {entry.water} glasses</div>
                  <div>Exercise: {entry.exercise}min</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Health Insights</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResetInsights}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100"
                    >
                      <RotateCcw size={20} />
                      <span>Reset All Data</span>
                    </motion.button>
                  </div>

                  {healthData.length > 0 ? (
                    <>
                      {/* Health Trends Chart */}
                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Trends Over Time</h3>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={healthData.slice(-14).reverse()}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="moodScore" stroke="#8b5cf6" name="Mood Score" strokeWidth={2} />
                              <Line type="monotone" dataKey="sleep" stroke="#3b82f6" name="Sleep (hours)" strokeWidth={2} />
                              <Line type="monotone" dataKey="water" stroke="#10b981" name="Water (glasses)" strokeWidth={2} />
                              <Line type="monotone" dataKey="exercise" stroke="#f59e0b" name="Exercise (minutes)" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Summary Statistics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <h4 className="font-semibold text-gray-600 mb-2">Average Mood</h4>
                          <p className="text-3xl font-bold text-purple-600">
                            {(healthData.reduce((acc, entry) => acc + entry.moodScore, 0) / healthData.length).toFixed(1)}/10
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Overall wellbeing</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <h4 className="font-semibold text-gray-600 mb-2">Average Sleep</h4>
                          <p className="text-3xl font-bold text-blue-600">
                            {(healthData.reduce((acc, entry) => acc + entry.sleep, 0) / healthData.length).toFixed(1)}h
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Per night</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <h4 className="font-semibold text-gray-600 mb-2">Water Intake</h4>
                          <p className="text-3xl font-bold text-green-600">
                            {(healthData.reduce((acc, entry) => acc + entry.water, 0) / healthData.length).toFixed(1)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Glasses per day</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <h4 className="font-semibold text-gray-600 mb-2">Exercise Days</h4>
                          <p className="text-3xl font-bold text-orange-600">
                            {((healthData.filter(entry => entry.exercise > 0).length / healthData.length) * 100).toFixed(0)}%
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Active days</p>
                        </div>
                      </div>

                      {/* Detailed Analysis */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Symptoms Analysis */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <h4 className="font-semibold text-gray-900 mb-4">Most Common Symptoms</h4>
                          {Object.entries(
                            healthData.reduce((acc, entry) => {
                              entry.symptoms.forEach(symptom => {
                                acc[symptom] = (acc[symptom] || 0) + 1;
                              });
                              return acc;
                            }, {} as Record<string, number>)
                          ).length > 0 ? (
                            <div className="space-y-3">
                              {Object.entries(
                                healthData.reduce((acc, entry) => {
                                  entry.symptoms.forEach(symptom => {
                                    acc[symptom] = (acc[symptom] || 0) + 1;
                                  });
                                  return acc;
                                }, {} as Record<string, number>)
                              )
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 5)
                                .map(([symptom, count]) => (
                                  <div key={symptom} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">{symptom}</span>
                                    <div className="flex items-center gap-2">
                                      <div className="w-20 bg-gray-200 rounded-full h-2">
                                        <div
                                          className="bg-red-500 h-2 rounded-full"
                                          style={{ width: `${(count / healthData.length) * 100}%` }}
                                        />
                                      </div>
                                      <span className="text-sm font-medium text-gray-600">{count}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No symptoms recorded yet</p>
                          )}
                        </div>

                        {/* Health Goals Progress */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <h4 className="font-semibold text-gray-900 mb-4">Goals Progress</h4>
                          {goals.length > 0 ? (
                            <div className="space-y-3">
                              {goals.slice(0, 5).map(goal => (
                                <div key={goal.id} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-700 truncate">{goal.title}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full ${goal.isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                      {((goal.current / goal.target) * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No goals set yet</p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                      <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
                      <p className="text-gray-600 mb-6">Start tracking your health to see detailed insights and trends</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('daily')}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
                      >
                        Start Tracking
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Health Notes</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const content = prompt('Enter your health note:');
                        if (content) {
                          addNote(content, 'general');
                        }
                      }}
                      className="flex items-center gap-1 sm:gap-2 bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 text-sm sm:text-base self-start sm:self-auto"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add Note</span>
                      <span className="sm:hidden">Add</span>
                    </motion.button>
                  </div>

                  {notes.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {notes.map(note => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2 sm:gap-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
                              <span className="font-semibold text-gray-900 text-sm sm:text-base">
                                {new Date(note.date).toLocaleDateString()}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500">
                                {new Date(note.createdAt).toLocaleTimeString()}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium self-start ${
                                note.category === 'symptoms' ? 'bg-red-100 text-red-800' :
                                note.category === 'mood' ? 'bg-purple-100 text-purple-800' :
                                note.category === 'exercise' ? 'bg-blue-100 text-blue-800' :
                                note.category === 'nutrition' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {note.category}
                              </span>
                            </div>
                            <div className="flex gap-1 sm:gap-2 self-start sm:self-auto">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditNote(note)}
                                className="p-1.5 sm:p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                              >
                                <Edit2 size={14} className="sm:w-4 sm:h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => deleteNote(note.id)}
                                className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 size={14} className="sm:w-4 sm:h-4" />
                              </motion.button>
                            </div>
                          </div>

                          {editingNote?.id === note.id ? (
                            <div className="space-y-3">
                              <textarea
                                value={editingNote.content}
                                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                                rows={4}
                              />
                              <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                  onClick={() => updateNote(note.id, editingNote.content)}
                                  className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingNote(null)}
                                  className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{note.content}</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 sm:py-20 bg-white rounded-xl shadow-lg px-4">
                      <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Start Your Health Journal</h3>
                      <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Record your thoughts, symptoms, and health observations</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const content = prompt('Enter your first health note:');
                          if (content) {
                            addNote(content, 'general');
                          }
                        }}
                        className="bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-700 text-sm sm:text-base"
                      >
                        Add First Note
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
                    <h2 className="text-2xl font-bold text-gray-900">Health Goals</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddGoal(true)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Goal
                    </motion.button>
                  </div>

                  {goals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {goals.map((goal) => (
                        <div key={goal.id} className="bg-white rounded-xl shadow-lg p-6">
                          <h3 className="font-semibold text-gray-900 mb-2">{goal.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{goal.description}</p>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{goal.current}/{goal.target} {goal.unit}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  goal.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              goal.category === 'exercise' ? 'bg-blue-100 text-blue-800' :
                              goal.category === 'nutrition' ? 'bg-green-100 text-green-800' :
                              goal.category === 'sleep' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {goal.category}
                            </span>

                            {goal.deadline && (
                              <span className="text-xs text-gray-500">
                                Due: {new Date(goal.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                      <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Set Your Health Goals</h3>
                      <p className="text-gray-600 mb-6">Create goals to track your health and wellness progress</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddGoal(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                      >
                        Create First Goal
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'reminders' && (
              <motion.div
                key="reminders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Health Reminders</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddReminder(true)}
                      className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Reminder
                    </motion.button>
                  </div>

                  {reminders.length > 0 ? (
                    <div className="space-y-4">
                      {reminders.map((reminder) => (
                        <div key={reminder.id} className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                          reminder.isActive ? 'border-green-500' : 'border-gray-300'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{reminder.title}</h3>
                              <p className="text-gray-600 text-sm mb-2">{reminder.description}</p>

                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>⏰ {reminder.time}</span>
                                <span>🔄 {reminder.frequency}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  reminder.category === 'medication' ? 'bg-red-100 text-red-800' :
                                  reminder.category === 'exercise' ? 'bg-blue-100 text-blue-800' :
                                  reminder.category === 'appointment' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {reminder.category}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleReminder(reminder.id)}
                                className={`p-2 rounded-full ${
                                  reminder.isActive
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                <Bell className="h-4 w-4" />
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => deleteReminder(reminder.id)}
                                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                      <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Set Health Reminders</h3>
                      <p className="text-gray-600 mb-6">Never miss important health activities with custom reminders</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddReminder(true)}
                        className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
                      >
                        Create First Reminder
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Add Health Goal</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const goalData = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as HealthGoal['category'],
                target: Number(formData.get('target')),
                current: 0,
                unit: formData.get('unit') as string,
                deadline: formData.get('deadline') as string,
                isCompleted: false
              };
              addGoal(goalData);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Exercise 30 minutes daily"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your health goal..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="exercise">Exercise</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="sleep">Sleep</option>
                    <option value="mental">Mental Health</option>
                    <option value="medical">Medical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                  <input
                    type="number"
                    name="target"
                    required
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="minutes, days, glasses"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (Optional)</label>
                  <input
                    type="date"
                    name="deadline"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Reminder Modal */}
      {showAddReminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Add Health Reminder</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const reminderData = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                time: formData.get('time') as string,
                frequency: formData.get('frequency') as HealthReminder['frequency'],
                category: formData.get('category') as HealthReminder['category'],
                isActive: true
              };
              addReminder(reminderData);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Take vitamins"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Additional details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    name="time"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    name="frequency"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="medication">Medication</option>
                  <option value="exercise">Exercise</option>
                  <option value="appointment">Appointment</option>
                  <option value="checkup">Health Checkup</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddReminder(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Add Reminder
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default HealthTracker;