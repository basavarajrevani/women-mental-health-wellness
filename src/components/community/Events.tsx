import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Tag, Search, Filter } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  category: string;
  organizer: string;
  maxParticipants: number;
  currentParticipants: number;
  tags: string[];
  isRegistered: boolean;
  price: number | 'Free';
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('communityEvents');
    return saved ? JSON.parse(saved) : defaultEvents;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true);
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  useEffect(() => {
    localStorage.setItem('communityEvents', JSON.stringify(events));
  }, [events]);

  const categories = [
    'all',
    'Workshop',
    'Seminar',
    'Support Group',
    'Webinar',
    'Training',
    'Social Event',
    'Meditation',
    'Fitness'
  ];

  const handleRegister = (eventId: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          isRegistered: !event.isRegistered,
          currentParticipants: event.isRegistered
            ? event.currentParticipants - 1
            : event.currentParticipants + 1
        };
      }
      return event;
    }));
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesUpcoming = !showUpcomingOnly || new Date(event.date) >= new Date();
    const matchesFree = !showFreeOnly || event.price === 'Free';

    return matchesSearch && matchesCategory && matchesUpcoming && matchesFree;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showUpcomingOnly}
                onChange={(e) => setShowUpcomingOnly(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Upcoming only</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showFreeOnly}
                onChange={(e) => setShowFreeOnly(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Free events only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{event.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                event.isOnline ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {event.isOnline ? 'Online' : 'In-Person'}
              </span>
            </div>
            <p className="mt-2 text-gray-600 text-sm line-clamp-2">{event.description}</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={16} className="mr-2" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-2" />
                {event.time}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin size={16} className="mr-2" />
                {event.location}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users size={16} className="mr-2" />
                {event.currentParticipants}/{event.maxParticipants} participants
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Tag size={16} className="mr-2" />
                {typeof event.price === 'number' ? `$${event.price}` : event.price}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleRegister(event.id)}
                disabled={!event.isRegistered && event.currentParticipants >= event.maxParticipants}
                className={`w-full py-2 rounded-lg transition-colors ${
                  event.isRegistered
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : event.currentParticipants >= event.maxParticipants
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {event.isRegistered
                  ? 'Cancel Registration'
                  : event.currentParticipants >= event.maxParticipants
                  ? 'Event Full'
                  : 'Register Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const defaultEvents: Event[] = [
  {
    id: '1',
    title: 'Mental Health Awareness Workshop',
    description: 'Join us for an interactive workshop on understanding and managing mental health.',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    time: '2:00 PM - 4:00 PM',
    location: 'Zoom Meeting',
    isOnline: true,
    category: 'Workshop',
    organizer: 'Mental Health Foundation',
    maxParticipants: 50,
    currentParticipants: 32,
    tags: ['Mental Health', 'Workshop', 'Education'],
    isRegistered: false,
    price: 'Free'
  },
  {
    id: '2',
    title: 'Stress Management Seminar',
    description: 'Learn effective techniques for managing stress in daily life.',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: '6:00 PM - 8:00 PM',
    location: 'Community Center',
    isOnline: false,
    category: 'Seminar',
    organizer: 'Wellness Institute',
    maxParticipants: 30,
    currentParticipants: 25,
    tags: ['Stress Relief', 'Mental Health', 'Wellness'],
    isRegistered: false,
    price: 25
  },
  {
    id: '3',
    title: 'Mindfulness Meditation Session',
    description: 'A guided meditation session focusing on mindfulness and inner peace.',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: '7:00 AM - 8:00 AM',
    location: 'Zoom Meeting',
    isOnline: true,
    category: 'Meditation',
    organizer: 'Mindful Living',
    maxParticipants: 100,
    currentParticipants: 45,
    tags: ['Meditation', 'Mindfulness', 'Morning Session'],
    isRegistered: false,
    price: 'Free'
  }
];

export default Events;
