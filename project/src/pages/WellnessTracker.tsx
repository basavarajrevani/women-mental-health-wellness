import React, { useState } from 'react';
import { FaSmile, FaMeh, FaFrown, FaBed, FaUtensils, FaRunning } from 'react-icons/fa';

interface MoodEntry {
  date: string;
  mood: string;
  sleep: number;
  water: number;
  exercise: number;
  notes: string;
}

const WellnessTracker: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<MoodEntry>({
    date: new Date().toISOString().split('T')[0],
    mood: '',
    sleep: 0,
    water: 0,
    exercise: 0,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEntries([...entries, currentEntry]);
    setCurrentEntry({
      date: new Date().toISOString().split('T')[0],
      mood: '',
      sleep: 0,
      water: 0,
      exercise: 0,
      notes: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-pink-600 mb-8">Daily Wellness Tracker</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">How are you feeling today?</label>
          <div className="flex gap-4">
            {['Happy', 'Neutral', 'Sad'].map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => setCurrentEntry({ ...currentEntry, mood })}
                className={`p-4 rounded-full ${
                  currentEntry.mood === mood ? 'bg-pink-100 text-pink-600' : 'bg-gray-100'
                }`}
              >
                {mood === 'Happy' && <FaSmile size={24} />}
                {mood === 'Neutral' && <FaMeh size={24} />}
                {mood === 'Sad' && <FaFrown size={24} />}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">
              <FaBed className="inline mr-2" />
              Hours of Sleep
            </label>
            <input
              type="number"
              min="0"
              max="24"
              value={currentEntry.sleep}
              onChange={(e) => setCurrentEntry({ ...currentEntry, sleep: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              <FaUtensils className="inline mr-2" />
              Glasses of Water
            </label>
            <input
              type="number"
              min="0"
              value={currentEntry.water}
              onChange={(e) => setCurrentEntry({ ...currentEntry, water: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              <FaRunning className="inline mr-2" />
              Exercise Minutes
            </label>
            <input
              type="number"
              min="0"
              value={currentEntry.exercise}
              onChange={(e) => setCurrentEntry({ ...currentEntry, exercise: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Notes</label>
          <textarea
            value={currentEntry.notes}
            onChange={(e) => setCurrentEntry({ ...currentEntry, notes: e.target.value })}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 transition-colors"
        >
          Save Entry
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Entries</h2>
        {entries.length === 0 ? (
          <p className="text-gray-600">No entries yet. Start tracking your wellness journey!</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{entry.date}</span>
                  <span>
                    {entry.mood === 'Happy' && <FaSmile className="text-green-500" />}
                    {entry.mood === 'Neutral' && <FaMeh className="text-yellow-500" />}
                    {entry.mood === 'Sad' && <FaFrown className="text-red-500" />}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>Sleep: {entry.sleep}hrs</div>
                  <div>Water: {entry.water} glasses</div>
                  <div>Exercise: {entry.exercise}min</div>
                </div>
                {entry.notes && <p className="mt-2 text-gray-700">{entry.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessTracker;
