import React, { useState } from 'react';
import { Smile, Heart, Star, RefreshCw, ThumbsUp, Music, Coffee, Sun } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  icon: keyof typeof icons;
}

const icons = {
  Smile,
  Heart,
  Star,
  ThumbsUp,
  Music,
  Coffee,
  Sun
};

const MoodBooster: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

  const categories = [
    'all',
    'quick',
    'creative',
    'physical',
    'social',
    'relaxing'
  ];

  const activities: Activity[] = [
    {
      id: '1',
      title: 'Dance Break',
      description: "Put on your favorite upbeat song and dance like nobody's watching! Movement and music are natural mood boosters.",
      duration: '5 minutes',
      category: 'physical',
      icon: 'Music'
    },
    {
      id: '2',
      title: 'Gratitude List',
      description: "Write down three things you're grateful for right now. They can be big or small!",
      duration: '3 minutes',
      category: 'quick',
      icon: 'Heart'
    },
    {
      id: '3',
      title: 'Mindful Walking',
      description: 'Take a short walk and focus on your surroundings. Notice the sounds, smells, and sights around you.',
      duration: '10 minutes',
      category: 'physical',
      icon: 'Sun'
    },
    {
      id: '4',
      title: 'Random Act of Kindness',
      description: 'Do something nice for someone else. Send a supportive message, give a compliment, or help with a task.',
      duration: '5 minutes',
      category: 'social',
      icon: 'ThumbsUp'
    },
    {
      id: '5',
      title: 'Quick Sketch',
      description: "Draw something simple that makes you happy. Don't worry about perfection!",
      duration: '5 minutes',
      category: 'creative',
      icon: 'Star'
    },
    {
      id: '6',
      title: 'Comfort Break',
      description: 'Make your favorite warm drink and take a moment to enjoy it mindfully.',
      duration: '10 minutes',
      category: 'relaxing',
      icon: 'Coffee'
    }
  ];

  const filteredActivities = activities.filter(activity =>
    selectedCategory === 'all' || activity.category === selectedCategory
  );

  const getRandomActivity = () => {
    const filtered = selectedCategory === 'all'
      ? activities
      : activities.filter(a => a.category === selectedCategory);
    const randomIndex = Math.floor(Math.random() * filtered.length);
    setCurrentActivity(filtered[randomIndex]);
  };

  const IconComponent = currentActivity ? icons[currentActivity.icon] : Smile;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mood Booster</h2>
      <p className="text-gray-600 mb-8">
        Need a quick pick-me-up? Try one of these mood-boosting activities to help you feel better.
      </p>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentActivity(null);
            }}
            className={`px-4 py-2 rounded-lg capitalize ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Activity Display */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        {currentActivity ? (
          <div className="text-center">
            <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
              <IconComponent className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {currentActivity.title}
            </h3>
            <p className="text-gray-600 mb-4">{currentActivity.description}</p>
            <div className="flex items-center justify-center space-x-2 text-purple-600 mb-6">
              <span>{currentActivity.duration}</span>
            </div>
            <button
              onClick={getRandomActivity}
              className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mx-auto"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Another
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Smile className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Ready to boost your mood?
            </h3>
            <button
              onClick={getRandomActivity}
              className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mx-auto"
            >
              Get Random Activity
            </button>
          </div>
        )}
      </div>

      {/* Activity List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActivities.map(activity => (
          <div
            key={activity.id}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setCurrentActivity(activity)}
          >
            <div className="flex items-start">
              {React.createElement(icons[activity.icon], {
                className: 'w-6 h-6 text-purple-600 mr-3 flex-shrink-0'
              })}
              <div>
                <h4 className="font-medium text-gray-800">{activity.title}</h4>
                <p className="text-sm text-gray-500">{activity.duration}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodBooster;
