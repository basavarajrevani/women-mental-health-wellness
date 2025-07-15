import React, { useState } from 'react';
import BreathingExercise from '../components/wellness/BreathingExercise';
import MeditationTimer from '../components/wellness/MeditationTimer';
import GratitudeJournal from '../components/wellness/GratitudeJournal';
import SelfCareChecklist from '../components/wellness/SelfCareChecklist';
import MoodBooster from '../components/wellness/MoodBooster';
import SleepSounds from '../components/wellness/SleepSounds';

const MentalWellness: React.FC = () => {
  const [activeTab, setActiveTab] = useState('breathing');

  const tabs = [
    { id: 'breathing', label: 'Breathing Exercise' },
    { id: 'meditation', label: 'Meditation Timer' },
    { id: 'gratitude', label: 'Gratitude Journal' },
    { id: 'selfcare', label: 'Self-Care Checklist' },
    { id: 'moodbooster', label: 'Mood Booster' },
    { id: 'sleep', label: 'Sleep Sounds' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mental Wellness</h1>
      <p className="text-gray-600 mb-8">
        Take care of your mental health with these interactive tools and exercises.
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'breathing' && <BreathingExercise />}
        {activeTab === 'meditation' && <MeditationTimer />}
        {activeTab === 'gratitude' && <GratitudeJournal />}
        {activeTab === 'selfcare' && <SelfCareChecklist />}
        {activeTab === 'moodbooster' && <MoodBooster />}
        {activeTab === 'sleep' && <SleepSounds />}
      </div>
    </div>
  );
};

export default MentalWellness;
