import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '../components/layout/Navigation';
import NotificationCenter from '../components/NotificationCenter';
import { useGlobalContext } from '../contexts/GlobalContext';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import socketService from '../services/socket';
import {
  MessageCircle,
  Users,
  Calendar,
  Heart,
  Plus,
  Search,
  Award,
  Lightbulb,
  Send,
  ThumbsUp,
  Eye,
  Clock,
  X,
  MoreHorizontal,
  Share2,
  TrendingUp,
  MapPin,
  Star,
  Target,
  Coffee,
  Flag,
  Pin,
  Hash,
  Edit3,
  Bookmark,
  Filter
} from 'lucide-react';

const Community: React.FC = () => {
  const {
    formatTimeAgo,
    addNotification
  } = useGlobalContext();

  const { user: authUser } = useAuth();

  // State declarations
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'events'>('feed');
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [supportGroups, setSupportGroups] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load community posts from backend
  const loadCommunityPosts = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get('/community/posts');
      if (response.success) {
        setCommunityPosts(response.data.posts);
      }
    } catch (error) {
      console.error('❌ Error loading community posts:', error);
      addNotification('Failed to load community posts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Load support groups from backend
  const loadSupportGroups = async () => {
    try {
      const response = await apiService.get('/support-groups');
      if (response.success) {
        setSupportGroups(response.data.supportGroups);
      }
    } catch (error) {
      console.error('❌ Error loading support groups:', error);
      addNotification('Failed to load support groups', 'error');
    }
  };

  // Load events from backend
  const loadEvents = async () => {
    try {
      const response = await apiService.get('/events');
      if (response.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('❌ Error loading events:', error);
      addNotification('Failed to load events', 'error');
    }
  };

  // Initialize data on first load
  useEffect(() => {
    const initializeData = async () => {
      console.log('🚀 Initializing Community page data...');

      try {
        await Promise.all([
          loadCommunityPosts(),
          loadSupportGroups(),
          loadEvents()
        ]);

        setIsInitialized(true);
        console.log('✅ Community page initialized');
      } catch (error) {
        console.error('❌ Error initializing community data:', error);
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeData();
    }
  }, [isInitialized]);

  // Setup real-time Socket.IO listeners
  useEffect(() => {
    if (!authUser || !isInitialized) return;

    console.log('🔌 Setting up Socket.IO listeners for community user:', authUser.email);

    // Force reconnect to ensure proper user context
    socketService.disconnect();
    setTimeout(() => {
      socketService.connect();
    }, 100);

    // Listen for real-time post updates
    socketService.on('post_created', (data: any) => {
      console.log('📝 New post received by user', authUser.email, ':', data);

      if (data.post) {
        setCommunityPosts(prev => {
          // Check if post already exists to avoid duplicates
          const exists = prev.find(p => p._id === data.post._id || p.id === data.post.id);
          if (exists) {
            console.log('📝 Post already exists, skipping duplicate');
            return prev;
          }

          console.log('📝 Adding new post to feed');
          return [data.post, ...prev];
        });

        // Show notification if it's not from current user
        if (data.post.author && data.post.author.id !== authUser.id) {
          addNotification({
            type: 'system',
            title: 'New Post',
            message: `New post by ${data.post.author.name}`,
            userId: authUser.id,
            isRead: false
          });
        }
      }
    });

    socketService.on('post_like_updated', (data: any) => {
      console.log('👍 Post like updated:', data);
      setCommunityPosts(prev => prev.map(post =>
        post.id === data.postId
          ? { ...post, likes: data.isLiked
              ? [...post.likes, data.userId]
              : post.likes.filter((id: string) => id !== data.userId),
              likesCount: data.likesCount
            }
          : post
      ));

      // Show notification if someone liked current user's post
      const post = communityPosts.find(p => p.id === data.postId);
      if (post && post.author.id === authUser.id && data.userId !== authUser.id && data.isLiked) {
        addNotification({
          type: 'like',
          title: 'Post Liked',
          message: 'Someone liked your post!',
          userId: authUser.id,
          isRead: false
        });
      }
    });

    socketService.on('comment_added', (data: any) => {
      console.log('💬 New comment received:', data);
      setCommunityPosts(prev => prev.map(post =>
        post.id === data.postId
          ? { ...post, comments: [...post.comments, data.comment] }
          : post
      ));

      // Show notification if someone commented on current user's post
      const post = communityPosts.find(p => p.id === data.postId);
      if (post && post.author.id === authUser.id && data.comment.author.id !== authUser.id) {
        addNotification({
          type: 'comment',
          title: 'New Comment',
          message: `${data.comment.author.name} commented on your post`,
          userId: authUser.id,
          isRead: false
        });
      }
    });

    // Cleanup on unmount
    return () => {
      socketService.off('post_created');
      socketService.off('post_like_updated');
      socketService.off('comment_added');
    };
  }, [authUser, isInitialized, addNotification]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'support' | 'achievement' | 'question' | 'general'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');

  // New post form state
  const [newPost, setNewPost] = useState({
    content: '',
    category: 'general' as const,
    tags: [] as string[],
    isAnonymous: false,
  });

  // Comment state
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const categories = [
    { key: 'all', label: 'All Posts', icon: Users, color: 'gray' },
    { key: 'support', label: 'Support', icon: Heart, color: 'red' },
    { key: 'achievement', label: 'Achievements', icon: Award, color: 'yellow' },
    { key: 'question', label: 'Questions', icon: Lightbulb, color: 'blue' },
    { key: 'general', label: 'General', icon: MessageCircle, color: 'purple' },
  ];

  const handleCreatePost = async () => {
    if (!newPost.content.trim() || !authUser) return;

    try {
      setIsLoading(true);
      const response = await apiService.post('/community/posts', {
        content: newPost.content,
        category: newPost.category,
        tags: newPost.tags,
        isAnonymous: newPost.isAnonymous
      });

      if (response.success) {
        // Post will be added via Socket.IO real-time update
        setNewPost({ content: '', category: 'general', tags: [], isAnonymous: false });
        setShowCreatePost(false);

        addNotification({
          userId: authUser.id,
          type: 'achievement',
          title: 'Post Created!',
          message: 'You shared your thoughts with the community. Keep engaging!',
          isRead: false,
        });
      }
    } catch (error) {
      console.error('❌ Error creating post:', error);
      addNotification({
        userId: authUser.id,
        type: 'system',
        title: 'Error',
        message: 'Failed to create post. Please try again.',
        isRead: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!authUser) return;

    try {
      const response = await apiService.post(`/community/posts/${postId}/like`);

      if (response.success) {
        // Like update will be handled via Socket.IO real-time update
        console.log('✅ Post like toggled successfully');
      }
    } catch (error) {
      console.error('❌ Error toggling like:', error);
      addNotification({
        userId: authUser.id,
        type: 'system',
        title: 'Error',
        message: 'Failed to like post. Please try again.',
        isRead: false,
      });
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim() || !authUser) return;

    try {
      const response = await apiService.post(`/community/posts/${postId}/comments`, {
        content: newComment,
        isAnonymous: false
      });

      if (response.success) {
        // Comment will be added via Socket.IO real-time update
        setNewComment('');
        console.log('✅ Comment added successfully');
      }
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      addNotification({
        userId: authUser.id,
        type: 'system',
        title: 'Error',
        message: 'Failed to add comment. Please try again.',
        isRead: false,
      });
    }
  };

  const filteredPosts = communityPosts
    .filter(post => {
      if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
      if (searchQuery && !post.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !post.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length);
        case 'trending':
          const aScore = (b.likes.length * 2 + b.comments.length * 3) / Math.max(1, (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60));
          const bScore = (a.likes.length * 2 + a.comments.length * 3) / Math.max(1, (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60));
          return bScore - aScore;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.key === category);
    return cat?.color || 'gray';
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.key === category);
    return cat?.icon || MessageCircle;
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation />

      <main className="lg:ml-64 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">


          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Community</h1>
              <p className="text-gray-600 text-sm sm:text-base">Connect, share, and support each other on your mental health journey</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <NotificationCenter />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreatePost(true)}
                className="flex items-center gap-1 sm:gap-2 bg-blue-600 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Create Post</span>
                <span className="sm:hidden">Post</span>
              </motion.button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mb-4 sm:mb-6 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
            {[
              { key: 'feed', label: 'Community Feed', icon: MessageCircle },
              { key: 'groups', label: 'Support Groups', icon: Users },
              { key: 'events', label: 'Events', icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Community Feed */}
          {activeTab === 'feed' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                {/* Search */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                  <div className="relative mb-3 sm:mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search posts..."
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>

                  {/* Sort Options */}
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Sort by</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="popular">Most Popular</option>
                      <option value="trending">Trending</option>
                    </select>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Categories</h3>
                  <div className="space-y-1 sm:space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <motion.button
                          key={category.key}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedCategory(category.key as any)}
                          className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors text-sm sm:text-base ${
                            selectedCategory === category.key
                              ? `bg-${category.color}-100 text-${category.color}-700 border border-${category.color}-200`
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="font-medium">{category.label}</span>
                          <span className="ml-auto text-xs sm:text-sm">
                            {category.key === 'all'
                              ? communityPosts.length
                              : communityPosts.filter(p => p.category === category.key).length}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Community Stats */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Community Stats</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs sm:text-sm">Total Posts</span>
                      <span className="font-semibold text-blue-600 text-sm sm:text-base">{communityPosts.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs sm:text-sm">Total Likes</span>
                      <span className="font-semibold text-red-600 text-sm sm:text-base">
                        {communityPosts.reduce((sum, post) => sum + post.likes.length, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs sm:text-sm">Total Comments</span>
                      <span className="font-semibold text-green-600 text-sm sm:text-base">
                        {communityPosts.reduce((sum, post) => sum + post.comments.length, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-xs sm:text-sm">Active Users</span>
                      <span className="font-semibold text-purple-600 text-sm sm:text-base">24</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Feed */}
              <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => {
                    const CategoryIcon = getCategoryIcon(post.category);
                    const isLiked = authUser && post.likes.includes(authUser.id);

                    return (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
                      >
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm sm:text-lg flex-shrink-0">
                              {post.userAvatar}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{post.username}</h4>
                                {post.isAnonymous && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                                    Anonymous
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                                <CategoryIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="capitalize">{post.category}</span>
                                <span>•</span>
                                <span className="truncate">{formatTimeAgo(post.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 flex-shrink-0">
                            <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </div>

                        {/* Post Content */}
                        <div className="mb-3 sm:mb-4">
                          <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{post.content}</p>
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                              {post.tags.map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="text-xs bg-blue-100 text-blue-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleLikePost(post.id)}
                              className={`flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
                                isLiked
                                  ? 'bg-red-100 text-red-600'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked ? 'fill-current' : ''}`} />
                              <span className="font-medium">{post.likes.length}</span>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                              className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
                            >
                              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                              <span className="font-medium">{post.comments.length}</span>
                            </motion.button>

                            <button className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base">
                              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                              <span className="font-medium hidden sm:inline">Share</span>
                            </button>
                          </div>

                          <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                            <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </div>

                        {/* Comments Section */}
                        <AnimatePresence>
                          {showComments === post.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100"
                            >
                              {/* Add Comment */}
                              <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                                  👤
                                </div>
                                <div className="flex-1 flex gap-1.5 sm:gap-2">
                                  <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleAddComment(post.id);
                                      }
                                    }}
                                  />
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAddComment(post.id)}
                                    disabled={!newComment.trim()}
                                    className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </motion.button>
                                </div>
                              </div>

                              {/* Comments List */}
                              <div className="space-y-3">
                                {post.comments.map((comment) => (
                                  <div key={comment.id} className="flex gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                                      {comment.userAvatar}
                                    </div>
                                    <div className="flex-1">
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-medium text-sm text-gray-900">
                                            {comment.username}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {formatTimeAgo(comment.createdAt)}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{comment.content}</p>
                                      </div>
                                      <div className="flex items-center gap-4 mt-2">
                                        <button className="text-xs text-gray-500 hover:text-blue-600 font-medium">
                                          Like ({comment.likes.length})
                                        </button>
                                        <button className="text-xs text-gray-500 hover:text-blue-600 font-medium">
                                          Reply
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-6">Be the first to share something with the community!</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCreatePost(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create First Post
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Support Groups Tab */}
          {activeTab === 'groups' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Support Groups</h2>
                <p className="text-gray-600 mb-4 sm:mb-6">Join our supportive community groups led by qualified facilitators</p>

                {supportGroups.filter(group => group.isActive && group.isPublic).length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Support Groups Available</h3>
                    <p className="text-gray-600">Check back soon for new support groups!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {supportGroups
                      .filter(group => group.isActive && group.isPublic)
                      .map((group) => (
                        <motion.div
                          key={group.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                              {group.category.charAt(0).toUpperCase() + group.category.slice(1)}
                            </span>
                          </div>

                          <p className="text-gray-600 mb-4 text-sm sm:text-base">{group.description}</p>

                          <div className="space-y-2 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>Facilitator: {group.facilitator}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{group.meetingSchedule}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {group.meetingType === 'online' ? (
                                <MessageCircle className="h-4 w-4" />
                              ) : (
                                <Users className="h-4 w-4" />
                              )}
                              <span className="capitalize">{group.meetingType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{group.currentMembers}/{group.maxMembers} members</span>
                            </div>
                          </div>

                          {group.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {group.tags.map((tag: string, index: number) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
                          >
                            Join Group
                          </motion.button>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Upcoming Events</h2>
                <p className="text-gray-600 mb-4 sm:mb-6">Join our workshops, webinars, and community events</p>

                {events.filter(event => event.isActive && event.isPublic && new Date(event.startDate) >= new Date()).length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
                    <p className="text-gray-600">Check back soon for new events and workshops!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {events
                      .filter(event => event.isActive && event.isPublic && new Date(event.startDate) >= new Date())
                      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                      .map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                              </span>
                              {!event.isFree && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                  ${event.price}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4 text-sm sm:text-base">{event.description}</p>

                          <div className="space-y-2 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>Organizer: {event.organizer}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(event.startDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4" />
                              <span>
                                {event.startTime} - {event.endTime} {event.timezone}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {event.type === 'online' ? (
                                <MessageCircle className="h-4 w-4" />
                              ) : (
                                <Users className="h-4 w-4" />
                              )}
                              <span className="capitalize">{event.type}</span>
                            </div>
                            {event.maxAttendees && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>{event.currentAttendees}/{event.maxAttendees} attendees</span>
                              </div>
                            )}
                          </div>

                          {event.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {event.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                          >
                            {event.isFree ? 'Register Free' : `Register - $${event.price}`}
                          </motion.button>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create Post</h3>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.filter(c => c.key !== 'all').map((category) => (
                      <option key={category.key} value={category.key}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's on your mind?
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Share your thoughts, experiences, or ask for support..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={newPost.isAnonymous}
                    onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    Post anonymously
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.content.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Community;
