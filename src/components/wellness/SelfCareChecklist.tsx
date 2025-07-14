import React, { useState, useEffect } from 'react';
import { Check, Plus, Trash2, Star } from 'lucide-react';

interface SelfCareItem {
  id: string;
  text: string;
  category: string;
  isCompleted: boolean;
  isFavorite: boolean;
}

const SelfCareChecklist: React.FC = () => {
  const [items, setItems] = useState<SelfCareItem[]>(() => {
    const saved = localStorage.getItem('selfcare_checklist');
    return saved ? JSON.parse(saved) : defaultItems;
  });
  
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    localStorage.setItem('selfcare_checklist', JSON.stringify(items));
  }, [items]);

  const categories = [
    'Physical',
    'Mental',
    'Emotional',
    'Social',
    'Spiritual',
    'Professional'
  ];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: SelfCareItem = {
      id: Date.now().toString(),
      text: newItemText,
      category: selectedCategory === 'all' ? 'Physical' : selectedCategory,
      isCompleted: false,
      isFavorite: false
    };

    setItems(prev => [...prev, newItem]);
    setNewItemText('');
  };

  const toggleComplete = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isCompleted: !item.isCompleted };
      }
      return item;
    }));
  };

  const toggleFavorite = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    }));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCompletion = showCompleted || !item.isCompleted;
    return matchesCategory && matchesCompletion;
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Self-Care Checklist</h2>
      <p className="text-gray-600 mb-8">
        Take care of yourself by maintaining a daily self-care routine. Check off items as you complete them.
      </p>

      {/* Add New Item Form */}
      <form onSubmit={handleAddItem} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add a new self-care activity..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {['all', ...categories].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="mr-2"
          />
          Show Completed
        </label>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`flex items-center p-4 rounded-lg ${
              item.isCompleted ? 'bg-gray-50' : 'bg-white'
            } border border-gray-200`}
          >
            <button
              onClick={() => toggleComplete(item.id)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                item.isCompleted
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'border-gray-300'
              }`}
            >
              {item.isCompleted && <Check className="w-4 h-4" />}
            </button>
            <span className={`flex-1 ${item.isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
              {item.text}
            </span>
            <span className="px-2 py-1 text-sm rounded-full bg-purple-100 text-purple-600 mr-4">
              {item.category}
            </span>
            <button
              onClick={() => toggleFavorite(item.id)}
              className={`p-1 mr-2 ${
                item.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
              }`}
            >
              <Star className={`w-5 h-5 ${item.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => deleteItem(item.id)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No items to display. Add some self-care activities to get started!
        </div>
      )}
    </div>
  );
};

const defaultItems: SelfCareItem[] = [
  {
    id: '1',
    text: 'Take a 10-minute walk outside',
    category: 'Physical',
    isCompleted: false,
    isFavorite: false
  },
  {
    id: '2',
    text: 'Practice deep breathing for 5 minutes',
    category: 'Mental',
    isCompleted: false,
    isFavorite: false
  },
  {
    id: '3',
    text: 'Write in your journal',
    category: 'Emotional',
    isCompleted: false,
    isFavorite: false
  },
  {
    id: '4',
    text: 'Call a friend or family member',
    category: 'Social',
    isCompleted: false,
    isFavorite: false
  },
  {
    id: '5',
    text: 'Meditate for 10 minutes',
    category: 'Spiritual',
    isCompleted: false,
    isFavorite: false
  }
];

export default SelfCareChecklist;
