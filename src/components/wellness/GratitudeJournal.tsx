import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Edit2, Save, Plus } from 'lucide-react';

interface GratitudeEntry {
  id: string;
  date: string;
  entries: string[];
  mood: number;
}

const GratitudeJournal: React.FC = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>(() => {
    const saved = localStorage.getItem('gratitude_journal');
    return saved ? JSON.parse(saved) : [];
  });
  const [newEntries, setNewEntries] = useState<string[]>(['', '', '']);
  const [mood, setMood] = useState(3);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('gratitude_journal', JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const filledEntries = newEntries.filter(entry => entry.trim() !== '');
    if (filledEntries.length === 0) return;

    const newEntry: GratitudeEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      entries: filledEntries,
      mood
    };

    setEntries(prev => [newEntry, ...prev]);
    setNewEntries(['', '', '']);
    setMood(3);
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleEdit = (entry: GratitudeEntry) => {
    setEditingId(entry.id);
    setNewEntries([...entry.entries, ...Array(3 - entry.entries.length).fill('')]);
    setMood(entry.mood);
  };

  const handleSaveEdit = (id: string) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        return {
          ...entry,
          entries: newEntries.filter(e => e.trim() !== ''),
          mood
        };
      }
      return entry;
    }));
    setEditingId(null);
    setNewEntries(['', '', '']);
    setMood(3);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gratitude Journal</h2>
      <p className="text-gray-600 mb-8">
        Write down three things you're grateful for today. This simple practice can help shift your focus to the positive aspects of your life.
      </p>

      {/* Entry Form */}
      <form onSubmit={handleAddEntry} className="bg-white rounded-lg p-6 mb-8 shadow-sm">
        <div className="space-y-4 mb-6">
          {newEntries.map((entry, index) => (
            <div key={index} className="flex items-center">
              <span className="mr-4 text-purple-600 font-medium">{index + 1}.</span>
              <input
                type="text"
                value={entry}
                onChange={(e) => {
                  const updated = [...newEntries];
                  updated[index] = e.target.value;
                  setNewEntries(updated);
                }}
                placeholder="I'm grateful for..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
        </div>

        {/* Mood Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling today?</label>
          <div className="flex justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMood(value)}
                className={`p-2 rounded-full transition-colors ${
                  mood === value ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-purple-600'
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${
                    mood === value ? 'fill-current' : ''
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Entry
        </button>
      </form>

      {/* Entries List */}
      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-500">
                  {new Date(entry.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center mt-1">
                  <Heart className={`w-5 h-5 text-purple-600 ${
                    entry.mood > 0 ? 'fill-current' : ''
                  }`} />
                  <span className="ml-2 text-sm text-gray-600">Mood Level: {entry.mood}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(entry)}
                  className="p-1 text-gray-400 hover:text-purple-600"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {editingId === entry.id ? (
              <div className="space-y-2">
                {newEntries.map((text, index) => (
                  <input
                    key={index}
                    type="text"
                    value={text}
                    onChange={(e) => {
                      const updated = [...newEntries];
                      updated[index] = e.target.value;
                      setNewEntries(updated);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ))}
                <button
                  onClick={() => handleSaveEdit(entry.id)}
                  className="mt-2 flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            ) : (
              <ul className="list-disc list-inside space-y-2">
                {entry.entries.map((text, index) => (
                  <li key={index} className="text-gray-700">{text}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GratitudeJournal;
