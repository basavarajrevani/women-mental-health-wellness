import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Calendar, 
  Tag, 
  Sparkles,
  Bell,
  Users
} from 'lucide-react';
import { useGlobalData } from '../../context/GlobalDataContext';
import { useRealTimeSync } from '../../services/RealTimeSync';

export const RealTimeCommunityFeed: React.FC = () => {
  const { 
    publishedCommunityPosts, 
    likePost, 
    lastUpdated,
    updateCount 
  } = useGlobalData();
  
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [showNewPostsAlert, setShowNewPostsAlert] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Subscribe to real-time updates
  const { eventCount, lastEvent } = useRealTimeSync(['community_post'], (event) => {
    if (event.action === 'create' || event.action === 'publish') {
      setNewPostsCount(prev => prev + 1);
      setShowNewPostsAlert(true);
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => {
        setShowNewPostsAlert(false);
      }, 5000);
    }
  });

  const handleLikePost = async (postId: string) => {
    if (likedPosts.has(postId)) return; // Prevent double-liking
    
    setLikedPosts(prev => new Set(prev).add(postId));
    await likePost(postId);
  };

  const handleViewNewPosts = () => {
    setNewPostsCount(0);
    setShowNewPostsAlert(false);
    // Scroll to top to see new posts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'support': return 'bg-green-100 text-green-800';
      case 'discussion': return 'bg-purple-100 text-purple-800';
      case 'milestone': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  return (
    <div className="space-y-6">
      {/* Header with real-time indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            Community Feed
          </h2>
          <p className="text-gray-600">Stay connected with our supportive community</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live updates</span>
          </div>
          
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              Updated {formatTimeAgo(lastUpdated.toISOString())}
            </span>
          )}
        </div>
      </div>

      {/* New posts alert */}
      <AnimatePresence>
        {showNewPostsAlert && newPostsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">New Posts Available!</h3>
                  <p className="text-sm opacity-90">
                    {newPostsCount} new {newPostsCount === 1 ? 'post' : 'posts'} from the community
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewNewPosts}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                View Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts feed */}
      <div className="space-y-4">
        {publishedCommunityPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">Be the first to share something with the community!</p>
          </div>
        ) : (
          publishedCommunityPosts.map((post, index) => (
            <motion.div
              key={`${post.id}-${updateCount}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.author}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatTimeAgo(post.createdAt)}
                    </div>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                  {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                </span>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3">{post.title}</h4>
              <p className="text-gray-600 mb-4 leading-relaxed">{post.content}</p>
              
              {post.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLikePost(post.id)}
                    disabled={likedPosts.has(post.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      likedPosts.has(post.id)
                        ? 'bg-pink-100 text-pink-600'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Heart 
                      className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} 
                    />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </motion.button>
                  
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{post.replies}</span>
                  </button>
                </div>
                
                <div className="text-xs text-gray-400">
                  {post.createdAt !== post.updatedAt && (
                    <span>Edited {formatTimeAgo(post.updatedAt)}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Real-time stats footer */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>📊 {publishedCommunityPosts.length} posts</span>
            <span>🔄 {eventCount} live updates</span>
            <span>💬 {publishedCommunityPosts.reduce((sum, post) => sum + post.replies, 0)} total replies</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Real-time notifications enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
