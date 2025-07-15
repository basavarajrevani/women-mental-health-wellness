import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Eye, 
  Star, 
  Calendar, 
  Tag, 
  ExternalLink,
  Play,
  Download,
  Sparkles,
  Filter
} from 'lucide-react';
import { useGlobalData } from '../../context/GlobalDataContext';
import { useRealTimeSync } from '../../services/RealTimeSync';

export const RealTimeResources: React.FC = () => {
  const { 
    publishedResources, 
    viewResource, 
    lastUpdated,
    updateCount 
  } = useGlobalData();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newResourcesCount, setNewResourcesCount] = useState(0);
  const [showNewResourcesAlert, setShowNewResourcesAlert] = useState(false);

  // Subscribe to real-time updates
  const { eventCount } = useRealTimeSync(['resource'], (event) => {
    if (event.action === 'create' || event.action === 'publish') {
      setNewResourcesCount(prev => prev + 1);
      setShowNewResourcesAlert(true);
      
      setTimeout(() => {
        setShowNewResourcesAlert(false);
      }, 5000);
    }
  });

  const categories = [
    { value: 'all', label: 'All Resources', color: 'bg-gray-100 text-gray-800' },
    { value: 'self-care', label: 'Self Care', color: 'bg-green-100 text-green-800' },
    { value: 'therapy', label: 'Therapy', color: 'bg-blue-100 text-blue-800' },
    { value: 'crisis', label: 'Crisis Support', color: 'bg-red-100 text-red-800' },
    { value: 'education', label: 'Education', color: 'bg-purple-100 text-purple-800' },
    { value: 'tools', label: 'Tools', color: 'bg-orange-100 text-orange-800' }
  ];

  const filteredResources = selectedCategory === 'all' 
    ? publishedResources 
    : publishedResources.filter(resource => resource.category === selectedCategory);

  const handleViewResource = async (resourceId: string) => {
    await viewResource(resourceId);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'audio': return <Play className="h-4 w-4" />;
      case 'pdf': return <Download className="h-4 w-4" />;
      case 'external-link': return <ExternalLink className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || 'bg-gray-100 text-gray-800';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleViewNewResources = () => {
    setNewResourcesCount(0);
    setShowNewResourcesAlert(false);
    setSelectedCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            Mental Health Resources
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">Curated resources to support your wellness journey</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live updates</span>
          </div>
        </div>
      </div>

      {/* New resources alert */}
      <AnimatePresence>
        {showNewResourcesAlert && newResourcesCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">New Resources Available!</h3>
                  <p className="text-sm opacity-90">
                    {newResourcesCount} new {newResourcesCount === 1 ? 'resource' : 'resources'} added
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewNewResources}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                View Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
        {categories.map((category) => (
          <motion.button
            key={category.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === category.value
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </motion.button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredResources.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-lg">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedCategory === 'all' ? 'No resources yet' : `No ${selectedCategory} resources`}
            </h3>
            <p className="text-gray-600">Check back later for new resources!</p>
          </div>
        ) : (
          filteredResources.map((resource, index) => (
            <motion.div
              key={`${resource.id}-${updateCount}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleViewResource(resource.id)}
            >
              {resource.imageUrl && (
                <div className="relative">
                  <img 
                    src={resource.imageUrl} 
                    alt={resource.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                      {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 text-orange-600">
                    {getTypeIcon(resource.type)}
                    <span className="text-xs font-medium capitalize">{resource.type.replace('-', ' ')}</span>
                  </div>
                  
                  {!resource.imageUrl && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                      {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resource.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {resource.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      {resource.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatTimeAgo(resource.createdAt)}
                    </span>
                  </div>
                </div>
                
                {resource.tags.length > 0 && (
                  <div className="flex items-center gap-1 mb-4">
                    <Tag className="h-3 w-3 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {resource.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{resource.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  {resource.url ? 'Open Resource' : 'Read More'}
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>📚 {filteredResources.length} resources</span>
            <span>🔄 {eventCount} live updates</span>
            <span>👁️ {filteredResources.reduce((sum, resource) => sum + resource.views, 0)} total views</span>
          </div>
          
          <div className="text-xs text-gray-500">
            {lastUpdated && `Last updated ${formatTimeAgo(lastUpdated.toISOString())}`}
          </div>
        </div>
      </div>
    </div>
  );
};
