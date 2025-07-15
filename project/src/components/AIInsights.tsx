import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Lightbulb, 
  Heart, 
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Star,
  ArrowRight,
  BarChart3,
  Activity,
  Smile,
  Moon,
  Users,
  BookOpen
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'trend' | 'recommendation' | 'achievement' | 'warning' | 'goal_suggestion';
  title: string;
  description: string;
  confidence: number; // 0-100
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  action?: {
    text: string;
    callback: () => void;
  };
  data?: any;
}

interface AIInsightsProps {
  moodData: any[];
  goals: any[];
  activities: any[];
  therapySessions: any[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ 
  moodData, 
  goals, 
  activities, 
  therapySessions 
}) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    generateInsights();
  }, [moodData, goals, activities, therapySessions]);

  const generateInsights = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newInsights: AIInsight[] = [];

    // Mood trend analysis
    if (moodData.length >= 7) {
      const recentMoods = moodData.slice(-7).map(entry => entry.mood);
      const avgRecent = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
      const olderMoods = moodData.slice(-14, -7).map(entry => entry.mood);
      const avgOlder = olderMoods.length > 0 ? olderMoods.reduce((a, b) => a + b, 0) / olderMoods.length : avgRecent;
      
      const trend = avgRecent - avgOlder;
      
      if (trend > 0.5) {
        newInsights.push({
          id: 'mood_improving',
          type: 'trend',
          title: 'Mood Trending Upward! 📈',
          description: `Your mood has improved by ${trend.toFixed(1)} points over the past week. Keep up the great work!`,
          confidence: 85,
          priority: 'medium',
          actionable: true,
          action: {
            text: 'See what\'s working',
            callback: () => setSelectedInsight(insights.find(i => i.id === 'mood_improving') || null)
          }
        });
      } else if (trend < -0.5) {
        newInsights.push({
          id: 'mood_declining',
          type: 'warning',
          title: 'Mood Needs Attention',
          description: `Your mood has declined by ${Math.abs(trend).toFixed(1)} points. Consider reaching out for support.`,
          confidence: 80,
          priority: 'high',
          actionable: true,
          action: {
            text: 'Get support resources',
            callback: () => window.location.hash = '/resources'
          }
        });
      }
    }

    // Goal progress analysis
    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status === 'completed');
    
    if (activeGoals.length > 0) {
      const avgProgress = activeGoals.reduce((sum, goal) => sum + goal.progress, 0) / activeGoals.length;
      
      if (avgProgress > 80) {
        newInsights.push({
          id: 'goals_excelling',
          type: 'achievement',
          title: 'Exceptional Goal Progress! 🎯',
          description: `You're averaging ${avgProgress.toFixed(0)}% progress across your goals. You're on track for success!`,
          confidence: 90,
          priority: 'medium',
          actionable: true,
          action: {
            text: 'Set new challenges',
            callback: () => window.location.hash = '/progress'
          }
        });
      } else if (avgProgress < 30) {
        newInsights.push({
          id: 'goals_struggling',
          type: 'recommendation',
          title: 'Goal Strategy Adjustment',
          description: `Your goal progress is at ${avgProgress.toFixed(0)}%. Consider breaking goals into smaller, manageable steps.`,
          confidence: 75,
          priority: 'medium',
          actionable: true,
          action: {
            text: 'Revise goals',
            callback: () => window.location.hash = '/progress'
          }
        });
      }
    }

    // Activity pattern analysis
    if (activities.length >= 5) {
      const highEffectivenessActivities = activities.filter(a => a.effectiveness >= 8);
      const lowEffectivenessActivities = activities.filter(a => a.effectiveness <= 4);
      
      if (highEffectivenessActivities.length > 0) {
        const topActivity = highEffectivenessActivities.reduce((prev, current) => 
          prev.effectiveness > current.effectiveness ? prev : current
        );
        
        newInsights.push({
          id: 'activity_recommendation',
          type: 'recommendation',
          title: 'Your Most Effective Activity',
          description: `${topActivity.name} has been your most effective wellness activity. Consider doing it more often!`,
          confidence: 88,
          priority: 'medium',
          actionable: true,
          action: {
            text: 'Schedule more',
            callback: () => window.location.hash = '/progress'
          }
        });
      }
    }

    // Therapy session insights
    if (therapySessions.length >= 2) {
      const avgMoodImprovement = therapySessions.reduce((sum, session) => 
        sum + (session.mood_after - session.mood_before), 0
      ) / therapySessions.length;
      
      if (avgMoodImprovement > 1) {
        newInsights.push({
          id: 'therapy_effective',
          type: 'achievement',
          title: 'Therapy is Working! 💪',
          description: `Your therapy sessions show an average mood improvement of ${avgMoodImprovement.toFixed(1)} points. Great progress!`,
          confidence: 92,
          priority: 'medium',
          actionable: false
        });
      }
    }

    // Smart goal suggestions
    if (moodData.length >= 10) {
      const lowEnergyDays = moodData.filter(entry => entry.energy <= 4).length;
      const totalDays = moodData.length;
      
      if (lowEnergyDays / totalDays > 0.4) {
        newInsights.push({
          id: 'energy_goal_suggestion',
          type: 'goal_suggestion',
          title: 'Suggested Goal: Boost Energy Levels',
          description: `You've had low energy on ${Math.round(lowEnergyDays / totalDays * 100)}% of tracked days. Consider setting an energy-focused goal.`,
          confidence: 78,
          priority: 'medium',
          actionable: true,
          action: {
            text: 'Create energy goal',
            callback: () => {
              // This would open the goal creation modal with pre-filled energy goal
              window.location.hash = '/progress';
            }
          }
        });
      }
    }

    // Sleep pattern insights
    if (moodData.length >= 7) {
      const poorSleepDays = moodData.filter(entry => entry.sleep <= 4).length;
      if (poorSleepDays >= 3) {
        newInsights.push({
          id: 'sleep_recommendation',
          type: 'recommendation',
          title: 'Sleep Quality Needs Attention',
          description: `You've had poor sleep on ${poorSleepDays} recent days. Good sleep is crucial for mental health.`,
          confidence: 85,
          priority: 'high',
          actionable: true,
          action: {
            text: 'Sleep improvement tips',
            callback: () => window.location.hash = '/resources'
          }
        });
      }
    }

    // Social connection insights
    if (moodData.length >= 5) {
      const avgSocialConnection = moodData.reduce((sum, entry) => sum + entry.socialConnection, 0) / moodData.length;
      if (avgSocialConnection <= 4) {
        newInsights.push({
          id: 'social_recommendation',
          type: 'recommendation',
          title: 'Strengthen Social Connections',
          description: `Your social connection score is ${avgSocialConnection.toFixed(1)}/10. Building relationships can significantly improve mental health.`,
          confidence: 82,
          priority: 'medium',
          actionable: true,
          action: {
            text: 'Join community',
            callback: () => window.location.hash = '/community'
          }
        });
      }
    }

    setInsights(newInsights);
    setIsAnalyzing(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-5 w-5" />;
      case 'recommendation': return <Lightbulb className="h-5 w-5" />;
      case 'achievement': return <Award className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'goal_suggestion': return <Target className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string, priority: string) => {
    if (priority === 'high') return 'from-red-500 to-red-600';
    
    switch (type) {
      case 'trend': return 'from-blue-500 to-blue-600';
      case 'recommendation': return 'from-purple-500 to-purple-600';
      case 'achievement': return 'from-green-500 to-green-600';
      case 'warning': return 'from-orange-500 to-orange-600';
      case 'goal_suggestion': return 'from-indigo-500 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI Insights</h3>
            <p className="text-gray-600 text-sm">Personalized recommendations based on your data</p>
          </div>
        </div>
        
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-purple-600">
            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Analyzing...</span>
          </div>
        )}
      </div>

      {insights.length > 0 ? (
        <div className="space-y-4">
          {insights.map((insight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${getInsightColor(insight.type, insight.priority)} text-white flex-shrink-0`}>
                  {getInsightIcon(insight.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(insight.priority)}
                      <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-3">{insight.description}</p>
                  
                  {insight.actionable && insight.action && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={insight.action.callback}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r ${getInsightColor(insight.type, insight.priority)} hover:shadow-md transition-all`}
                    >
                      {insight.action.text}
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : !isAnalyzing ? (
        <div className="text-center py-12">
          <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Insights Yet</h4>
          <p className="text-gray-600">Add more data to get personalized AI insights and recommendations.</p>
        </div>
      ) : null}
    </div>
  );
};

export default AIInsights;
