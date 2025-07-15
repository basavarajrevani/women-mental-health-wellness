import React, { useState, useEffect } from 'react';
import { Users, Calendar, MapPin, Clock, Plus, Search, ExternalLink } from 'lucide-react';

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  meetingTime: string;
  location: string;
  isOnline: boolean;
  memberCount: number;
  topics: string[];
  nextMeeting: string;
  isJoined: boolean;
}

const SupportGroups: React.FC = () => {
  const [groups, setGroups] = useState<SupportGroup[]>(() => {
    const saved = localStorage.getItem('supportGroups');
    return saved ? JSON.parse(saved) : defaultGroups;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    localStorage.setItem('supportGroups', JSON.stringify(groups));
  }, [groups]);

  const categories = [
    'all',
    'Anxiety',
    'Depression',
    'Stress Management',
    'Work-Life Balance',
    'Relationship Issues',
    'Self-Care',
    'Trauma Recovery',
    'Mindfulness'
  ];

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          isJoined: !group.isJoined,
          memberCount: group.isJoined ? group.memberCount - 1 : group.memberCount + 1
        };
      }
      return group;
    }));
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    const matchesOnline = !showOnlineOnly || group.isOnline;

    return matchesSearch && matchesCategory && matchesOnline;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search support groups..."
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
          <div className="flex items-center">
            <input
              type="checkbox"
              id="onlineOnly"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="onlineOnly" className="ml-2 text-sm text-gray-700">
              Show online groups only
            </label>
          </div>
        </div>
      </div>

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map(group => (
          <div key={group.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{group.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                group.isOnline ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {group.isOnline ? 'Online' : 'In-Person'}
              </span>
            </div>
            <p className="mt-2 text-gray-600 text-sm line-clamp-2">{group.description}</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={16} className="mr-2" />
                Next meeting: {new Date(group.nextMeeting).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-2" />
                {group.meetingTime}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin size={16} className="mr-2" />
                {group.location}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users size={16} className="mr-2" />
                {group.memberCount} members
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {group.topics.map(topic => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleJoinGroup(group.id)}
                className={`w-full py-2 rounded-lg transition-colors ${
                  group.isJoined
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {group.isJoined ? 'Leave Group' : 'Join Group'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const defaultGroups: SupportGroup[] = [
  {
    id: '1',
    name: 'Anxiety Support Circle',
    description: 'A safe space to share experiences and coping strategies for anxiety.',
    category: 'Anxiety',
    meetingTime: 'Every Tuesday at 7:00 PM',
    location: 'Zoom Meeting',
    isOnline: true,
    memberCount: 45,
    topics: ['Anxiety', 'Panic Attacks', 'Coping Strategies'],
    nextMeeting: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isJoined: false
  },
  {
    id: '2',
    name: 'Mindful Living Group',
    description: 'Learn and practice mindfulness techniques for better mental health.',
    category: 'Mindfulness',
    meetingTime: 'Every Wednesday at 6:30 PM',
    location: 'Community Center, Downtown',
    isOnline: false,
    memberCount: 32,
    topics: ['Meditation', 'Mindfulness', 'Stress Relief'],
    nextMeeting: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    isJoined: false
  },
  {
    id: '3',
    name: 'Work-Life Balance Workshop',
    description: 'Weekly discussions on maintaining a healthy work-life balance.',
    category: 'Work-Life Balance',
    meetingTime: 'Every Thursday at 8:00 PM',
    location: 'Zoom Meeting',
    isOnline: true,
    memberCount: 28,
    topics: ['Time Management', 'Stress Management', 'Career'],
    nextMeeting: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    isJoined: false
  }
];

export default SupportGroups;
