import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  Heart, 
  Calendar,
  Tag,
  Save,
  X
} from 'lucide-react';
import { useAdmin, CommunityPost } from '../../context/AdminContext';

interface CommunityManagementProps {
  onClose?: () => void;
}

export const CommunityManagement: React.FC<CommunityManagementProps> = ({ onClose }) => {
  const { 
    communityPosts, 
    addCommunityPost, 
    updateCommunityPost, 
    deleteCommunityPost,
    isLoading 
  } = useAdmin();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Admin',
    category: 'announcement' as CommunityPost['category'],
    tags: '',
    isPublished: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    let success = false;
    if (editingPost) {
      success = await updateCommunityPost(editingPost.id, postData);
    } else {
      success = await addCommunityPost(postData);
    }

    if (success) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: 'Admin',
      category: 'announcement',
      tags: '',
      isPublished: true
    });
    setShowAddForm(false);
    setEditingPost(null);
  };

  const handleEdit = (post: CommunityPost) => {
    setFormData({
      title: post.title,
      content: post.content,
      author: post.author,
      category: post.category,
      tags: post.tags.join(', '),
      isPublished: post.isPublished
    });
    setEditingPost(post);
    setShowAddForm(true);
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deleteCommunityPost(postId);
    }
  };

  const togglePublished = async (post: CommunityPost) => {
    await updateCommunityPost(post.id, { isPublished: !post.isPublished });
  };

  const categories = [
    { value: 'announcement', label: 'Announcement', color: 'bg-blue-100 text-blue-800' },
    { value: 'support', label: 'Support', color: 'bg-green-100 text-green-800' },
    { value: 'discussion', label: 'Discussion', color: 'bg-purple-100 text-purple-800' },
    { value: 'milestone', label: 'Milestone', color: 'bg-yellow-100 text-yellow-800' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Community Management</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage community posts and announcements</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 sm:gap-2 bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 text-sm sm:text-base"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Add Post</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex items-center gap-1 sm:gap-2 bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Close</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
            {editingPost ? 'Edit Post' : 'Add New Post'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as CommunityPost['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                required
                rows={3}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base sm:rows-4"
                placeholder="Enter post content"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 block text-xs sm:text-sm text-gray-700">
                Publish immediately
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1 sm:gap-2 bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm sm:text-base"
              >
                <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{editingPost ? 'Update Post' : 'Create Post'}</span>
                <span className="sm:hidden">{editingPost ? 'Update' : 'Create'}</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={resetForm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1 sm:gap-2 bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Cancel</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Posts List */}
      <div className="space-y-3 sm:space-y-4">
        {communityPosts.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-lg px-4">
            <MessageSquare className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No posts yet</h3>
            <p className="text-gray-600 text-sm sm:text-base">Create your first community post to get started.</p>
          </div>
        ) : (
          communityPosts.map((post) => {
            const category = categories.find(cat => cat.value === post.category);

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{post.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${category?.color}`}>
                          {category?.label}
                        </span>
                        {!post.isPublished && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-2 sm:mb-3 line-clamp-2 text-sm sm:text-base">{post.content}</p>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className="sm:hidden">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                        {post.likes}
                        <span className="hidden sm:inline">likes</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                        {post.replies}
                        <span className="hidden sm:inline">replies</span>
                      </span>
                      {post.tags.length > 0 && (
                        <span className="flex items-center gap-1 max-w-full">
                          <Tag className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{post.tags.join(', ')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-0 sm:ml-0">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => togglePublished(post)}
                      className={`p-1.5 sm:p-2 rounded-lg ${post.isPublished ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                      title={post.isPublished ? 'Published' : 'Unpublished'}
                    >
                      {post.isPublished ? <Eye className="h-3 w-3 sm:h-4 sm:w-4" /> : <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(post)}
                      className="p-1.5 sm:p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                      title="Edit post"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 sm:p-2 rounded-lg text-red-600 hover:bg-red-50"
                      title="Delete post"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
