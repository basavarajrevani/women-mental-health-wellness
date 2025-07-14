import React, { useState, useEffect } from 'react';
import { Calendar, Smile, Frown, Meh, Edit2, Trash2, Heart } from 'lucide-react';

interface MoodEntry {
  id: string;
  date: string;
  mood: 'happy' | 'neutral' | 'sad' | 'anxious' | 'excited' | 'tired' | 'stressed';
  energy: number;
  activities: string[];
  journal: string;
  tags: string[];
}

const moodEmojis = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
  anxious: '😰',
  excited: '🤗',
  tired: '😴',
  stressed: '😫'
};

const activityOptions = [
  'Exercise', 'Reading', 'Meditation', 'Socializing', 'Work',
  'Shopping', 'Cooking', 'Cleaning', 'TV/Movies', 'Music',
  'Nature', 'Family Time', 'Self-Care', 'Hobby', 'Travel'
];

const MoodJournal: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('moodJournal');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Omit<MoodEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    mood: 'neutral',
    energy: 5,
    activities: [],
    journal: '',
    tags: []
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    localStorage.setItem('moodJournal', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setEntries(prev =>
        prev.map(entry =>
          entry.id === editingId
            ? { ...currentEntry, id: editingId }
            : entry
        )
      );
      setEditingId(null);
    } else {
      const id = Date.now().toString();
      setEntries(prev => [...prev, { ...currentEntry, id }]);
    }
    setShowForm(false);
    setCurrentEntry({
      date: new Date().toISOString().split('T')[0],
      mood: 'neutral',
      energy: 5,
      activities: [],
      journal: '',
      tags: []
    });
  };

  const handleEdit = (entry: MoodEntry) => {
    setCurrentEntry({
      date: entry.date,
      mood: entry.mood,
      energy: entry.energy,
      activities: entry.activities,
      journal: entry.journal,
      tags: entry.tags
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const toggleActivity = (activity: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      setCurrentEntry(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Mood Journal</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
        >
          New Entry
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {editingId ? 'Edit Entry' : 'New Entry'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={currentEntry.date}
                  onChange={e => setCurrentEntry(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(moodEmojis).map(([mood, emoji]) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setCurrentEntry(prev => ({ ...prev, mood: mood as MoodEntry['mood'] }))}
                      className={`p-3 rounded-full text-2xl transition-transform hover:scale-110 ${
                        currentEntry.mood === mood ? 'bg-purple-100 scale-110' : 'bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Energy Level</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEntry.energy}
                  onChange={e => setCurrentEntry(prev => ({ ...prev, energy: Number(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activities</label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.map(activity => (
                    <button
                      key={activity}
                      type="button"
                      onClick={() => toggleActivity(activity)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        currentEntry.activities.includes(activity)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Journal</label>
                <textarea
                  value={currentEntry.journal}
                  onChange={e => setCurrentEntry(prev => ({ ...prev, journal: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  rows={4}
                  placeholder="How are you feeling today?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentEntry.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-purple-500 hover:text-purple-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={addTag}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Add tags (press Enter)"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                  {editingId ? 'Save Changes' : 'Add Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {entries.length === 0 ? (
          <p className="text-center text-gray-500">No entries yet. Start journaling your mood!</p>
        ) : (
          entries
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(entry => (
              <div
                key={entry.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                    <div>
                      <h3 className="font-medium">
                        {new Date(entry.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Energy Level: {entry.energy}/10
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {entry.activities.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {entry.activities.map(activity => (
                        <span
                          key={activity}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {entry.journal && (
                  <p className="mt-3 text-gray-700 whitespace-pre-wrap">{entry.journal}</p>
                )}

                {entry.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MoodJournal;
