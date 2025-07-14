import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Share2, Flag, MoreHorizontal, Send, Search } from 'lucide-react';

interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  isLiked: boolean;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  likes: number;
  createdAt: string;
}

const DiscussionForum: React.FC = () => {
  // Load posts from localStorage or use default empty array
  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem('forum_posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });
  
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('forum_posts', JSON.stringify(posts));
  }, [posts]);

  const popularTags = [
    'Anxiety', 'Depression', 'Self Care', 'Motivation',
    'Wellness', 'Support', 'Mental Health', 'Stress Relief'
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'You',
      content: newPost,
      tags: selectedTags,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      isLiked: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setSelectedTags([]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string, comment: string) => {
    if (!comment.trim()) return;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            id: Date.now().toString(),
            userId: 'current-user',
            username: 'You',
            content: comment,
            likes: 0,
            createdAt: new Date().toISOString()
          }]
        };
      }
      return post;
    }));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        {/* Popular Tags */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Create Post */}
      <div className="bg-white rounded-lg shadow p-4">
        <form onSubmit={handleCreatePost}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
          <div className="mt-3 flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="ml-1 text-purple-500 hover:text-purple-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              disabled={!newPost.trim()}
            >
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">{post.username}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <p className="mt-2 text-gray-700">{post.content}</p>
            
            {post.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center space-x-4">
              <button
                onClick={() => handleLikePost(post.id)}
                className={`flex items-center space-x-1 ${
                  post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                <MessageCircle size={20} />
                <span>{post.comments.length}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                <Share2 size={20} />
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                <Flag size={20} />
              </button>
            </div>

            {/* Comments */}
            {post.comments.length > 0 && (
              <div className="mt-4 pl-4 border-l-2 border-gray-100">
                {post.comments.map(comment => (
                  <div key={comment.id} className="mt-2">
                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium">{comment.username}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem('comment') as HTMLInputElement;
                handleAddComment(post.id, input.value);
                input.value = '';
              }}
              className="mt-4 flex items-center gap-2"
            >
              <input
                type="text"
                name="comment"
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="p-2 text-purple-600 hover:text-purple-700"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionForum;
