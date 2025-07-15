import { saveAs } from 'file-saver';

export interface HealthData {
  date: string;
  menstrualFlow: 'light' | 'medium' | 'heavy' | 'none';
  mood: 'happy' | 'neutral' | 'sad' | 'anxious';
  symptoms: string[];
  sleep: number;
  water: number;
  exercise: number;
  nutrition: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    snacks: number;
  };
  medications: {
    name: string;
    taken: boolean;
    time?: string;
  }[];
  vitals: {
    bloodPressure?: string;
    temperature?: number;
    heartRate?: number;
  };
  stressLevel: 1 | 2 | 3 | 4 | 5;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  notes: string;
  tags: string[];
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  time: string;
  type: 'medication' | 'water' | 'exercise' | 'sleep' | 'other';
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  enabled: boolean;
}

// Data Export
export const exportHealthData = (data: HealthData[]) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, `health-tracker-export-${new Date().toISOString().split('T')[0]}.json`);
};

// Data Import
export const importHealthData = async (file: File): Promise<HealthData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid file format'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

// Calculate cycle predictions
export const predictNextPeriod = (data: HealthData[]): Date | null => {
  const periodDates = data
    .filter(entry => entry.menstrualFlow !== 'none')
    .map(entry => new Date(entry.date))
    .sort((a, b) => b.getTime() - a.getTime());

  if (periodDates.length < 2) return null;

  const cycles = [];
  for (let i = 1; i < periodDates.length; i++) {
    cycles.push(periodDates[i - 1].getTime() - periodDates[i].getTime());
  }

  const averageCycle = cycles.reduce((a, b) => a + b, 0) / cycles.length;
  const lastPeriod = periodDates[0];
  return new Date(lastPeriod.getTime() + averageCycle);
};

// Generate health insights
export const generateInsights = (data: HealthData[]) => {
  const insights = [];
  
  // Sleep patterns
  const avgSleep = data.reduce((acc, entry) => acc + entry.sleep, 0) / data.length;
  if (avgSleep < 7) {
    insights.push({
      type: 'warning',
      message: 'Your average sleep is below recommended levels. Aim for 7-9 hours per night.',
    });
  }

  // Exercise consistency
  const exerciseDays = data.filter(entry => entry.exercise > 0).length;
  const exerciseRate = exerciseDays / data.length;
  if (exerciseRate < 0.5) {
    insights.push({
      type: 'suggestion',
      message: 'Try to increase your exercise frequency. Aim for at least 30 minutes of activity most days.',
    });
  }

  // Water intake
  const avgWater = data.reduce((acc, entry) => acc + entry.water, 0) / data.length;
  if (avgWater < 8) {
    insights.push({
      type: 'suggestion',
      message: 'Consider increasing your water intake to reach the recommended 8 glasses per day.',
    });
  }

  // Stress patterns
  const highStressDays = data.filter(entry => entry.stressLevel > 3).length;
  if (highStressDays / data.length > 0.3) {
    insights.push({
      type: 'warning',
      message: 'You\'re experiencing frequent high stress. Consider stress management techniques or consulting a professional.',
    });
  }

  return insights;
};

// Notification Management
export const scheduleNotification = async (reminder: Reminder) => {
  if (!('Notification' in window)) {
    throw new Error('This browser does not support notifications');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  // Schedule notification based on reminder time and frequency
  const now = new Date();
  const reminderTime = new Date(reminder.time);

  if (reminderTime > now) {
    setTimeout(() => {
      new Notification(reminder.title, {
        body: reminder.description,
        icon: '/notification-icon.png',
      });
    }, reminderTime.getTime() - now.getTime());
  }
};

// Data visualization helpers
export const generateChartData = (data: HealthData[], metric: keyof HealthData) => {
  return data.map(entry => ({
    date: entry.date,
    value: entry[metric],
  }));
};

export const calculateCorrelations = (data: HealthData[]) => {
  const correlations = [];

  // Check correlation between sleep and mood
  const sleepMoodCorr = calculateCorrelation(
    data.map(d => d.sleep),
    data.map(d => moodToNumber(d.mood))
  );
  if (Math.abs(sleepMoodCorr) > 0.5) {
    correlations.push({
      type: 'correlation',
      message: `There appears to be a ${sleepMoodCorr > 0 ? 'positive' : 'negative'} correlation between your sleep and mood.`,
    });
  }

  // Check correlation between exercise and energy level
  const exerciseEnergyCorr = calculateCorrelation(
    data.map(d => d.exercise),
    data.map(d => d.energyLevel)
  );
  if (Math.abs(exerciseEnergyCorr) > 0.5) {
    correlations.push({
      type: 'correlation',
      message: `Exercise appears to ${exerciseEnergyCorr > 0 ? 'improve' : 'decrease'} your energy levels.`,
    });
  }

  return correlations;
};

// Helper function to convert mood to number for correlation calculation
const moodToNumber = (mood: string): number => {
  const moodMap = {
    happy: 4,
    neutral: 3,
    sad: 2,
    anxious: 1,
  };
  return moodMap[mood as keyof typeof moodMap] || 0;
};

// Helper function to calculate correlation coefficient
const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  const sum1 = x.reduce((a, b) => a + b, 0);
  const sum2 = y.reduce((a, b) => a + b, 0);
  const sum1Sq = x.reduce((a, b) => a + b * b, 0);
  const sum2Sq = y.reduce((a, b) => a + b * b, 0);
  const pSum = x.map((x, i) => x * y[i]).reduce((a, b) => a + b, 0);
  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  return num / den;
};
