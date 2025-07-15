import React, { useState, useEffect } from 'react';
import { Target, Award, Trash2, Check, Plus, ChevronRight, Star } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  target: number;
  unit: string;
  deadline: string;
  progress: number;
  completed: boolean;
  category: 'exercise' | 'nutrition' | 'sleep' | 'water' | 'wellness' | 'custom';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'milestone' | 'streak' | 'goal' | 'special';
  icon: string;
}

const HealthGoals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('healthGoals');
    return saved ? JSON.parse(saved) : [];
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('healthAchievements');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id' | 'progress' | 'completed'>>({
    title: '',
    target: 0,
    unit: '',
    deadline: '',
    category: 'custom'
  });

  useEffect(() => {
    localStorage.setItem('healthGoals', JSON.stringify(goals));
    localStorage.setItem('healthAchievements', JSON.stringify(achievements));
  }, [goals, achievements]);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();
    setGoals(prev => [...prev, { ...newGoal, id, progress: 0, completed: false }]);
    setNewGoal({
      title: '',
      target: 0,
      unit: '',
      deadline: '',
      category: 'custom'
    });
    setShowAddGoal(false);
  };

  const updateProgress = (goalId: string, newProgress: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const completed = newProgress >= goal.target;
        if (completed && !goal.completed) {
          // Add achievement when goal is completed
          const achievement: Achievement = {
            id: Date.now().toString(),
            title: `Goal Achieved: ${goal.title}`,
            description: `Reached target of ${goal.target} ${goal.unit}`,
            date: new Date().toISOString(),
            type: 'goal',
            icon: '🎯'
          };
          setAchievements(prev => [...prev, achievement]);
        }
        return { ...goal, progress: newProgress, completed };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    }
  };

  const calculateProgress = (goal: Goal) => {
    return Math.min((goal.progress / goal.target) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Health Goals</h2>
          <button
            onClick={() => setShowAddGoal(true)}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
          >
            <Plus size={20} />
            <span>Add Goal</span>
          </button>
        </div>

        {showAddGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Goal Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={e => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Target</label>
                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={e => setNewGoal(prev => ({ ...prev, target: Number(e.target.value) }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                    <input
                      type="text"
                      value={newGoal.unit}
                      onChange={e => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      placeholder="steps, mins, etc."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Deadline</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={e => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={e => setNewGoal(prev => ({ ...prev, category: e.target.value as Goal['category'] }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="exercise">Exercise</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="sleep">Sleep</option>
                    <option value="water">Water</option>
                    <option value="wellness">Wellness</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddGoal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  >
                    Add Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {goals.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No goals set. Add one to get started!</p>
          ) : (
            goals.map(goal => (
              <div
                key={goal.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-sm text-gray-500">
                      Target: {goal.target} {goal.unit} · Due: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {goal.completed && (
                      <span className="text-green-600">
                        <Check size={20} />
                      </span>
                    )}
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-500">
                      {goal.progress} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress(goal)}%` }}
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      type="range"
                      min="0"
                      max={goal.target}
                      value={goal.progress}
                      onChange={e => updateProgress(goal.id, Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(achievement.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthGoals;
