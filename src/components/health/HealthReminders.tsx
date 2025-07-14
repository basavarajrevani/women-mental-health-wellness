import React, { useState, useEffect } from 'react';
import { Bell, Plus, X, Check, Calendar } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  time: string;
  days: string[];
  type: 'medication' | 'water' | 'exercise' | 'period' | 'appointment' | 'custom';
  enabled: boolean;
}

const HealthReminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('healthReminders');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState<Omit<Reminder, 'id'>>({
    title: '',
    time: '',
    days: [],
    type: 'custom',
    enabled: true
  });

  useEffect(() => {
    localStorage.setItem('healthReminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5);
      const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];

      reminders.forEach(reminder => {
        if (
          reminder.enabled &&
          reminder.time === currentTime &&
          reminder.days.includes(currentDay)
        ) {
          new Notification(reminder.title, {
            body: `Time for your ${reminder.type} reminder!`,
            icon: '/reminder-icon.png'
          });
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders]);

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();
    setReminders(prev => [...prev, { ...newReminder, id }]);
    setNewReminder({
      title: '',
      time: '',
      days: [],
      type: 'custom',
      enabled: true
    });
    setShowAddForm(false);
  };

  const toggleDay = (day: string) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? { ...reminder, enabled: !reminder.enabled }
          : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      setReminders(prev => prev.filter(reminder => reminder.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Health Reminders</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
        >
          <Plus size={20} />
          <span>Add Reminder</span>
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">New Reminder</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={e => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={e => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={newReminder.type}
                  onChange={e => setNewReminder(prev => ({ ...prev, type: e.target.value as Reminder['type'] }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="medication">Medication</option>
                  <option value="water">Water Intake</option>
                  <option value="exercise">Exercise</option>
                  <option value="period">Period Tracking</option>
                  <option value="appointment">Appointment</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Repeat Days</label>
                <div className="flex flex-wrap gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        newReminder.days.includes(day)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                  Add Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reminders.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No reminders set. Add one to get started!</p>
        ) : (
          reminders.map(reminder => (
            <div
              key={reminder.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`p-2 rounded-full ${
                    reminder.enabled ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Bell size={20} />
                </button>
                <div>
                  <h3 className="font-medium">{reminder.title}</h3>
                  <div className="text-sm text-gray-500">
                    {reminder.time} · {reminder.days.join(', ')}
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteReminder(reminder.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HealthReminders;
