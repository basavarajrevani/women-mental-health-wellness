import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import socketService from '../services/socket';
import { useAuth } from '../context/AuthContext';

const RealTimeTest: React.FC = () => {
  const { user, logout } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [testMessage, setTestMessage] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    if (!user) return;

    console.log('🧪 Starting Real-Time Test for user:', user.email);

    // Clear previous messages
    setMessages([]);
    setPosts([]);

    // Connect to socket
    socketService.connect();

    // Listen for connection status
    socketService.on('connected', (data) => {
      console.log('✅ Socket connected:', data);
      setIsConnected(true);
      setMessages(prev => [...prev, {
        type: 'system',
        message: `Connected as ${data.userName}`,
        timestamp: new Date().toISOString(),
        user: user.email
      }]);
    });

    // Listen for test messages
    socketService.on('test_message', (data) => {
      console.log('📨 Test message received:', data);
      setMessages(prev => [...prev, {
        type: 'test',
        message: data.message,
        timestamp: data.timestamp,
        userId: data.userId,
        user: user.email
      }]);
    });

    // Listen for post creation
    socketService.on('post_created', (data) => {
      console.log('📝 Post created event received:', data);
      if (data.post) {
        setPosts(prev => {
          const exists = prev.find(p => p._id === data.post._id || p.id === data.post.id);
          if (exists) return prev;
          return [data.post, ...prev];
        });
        
        setMessages(prev => [...prev, {
          type: 'post',
          message: `New post: ${data.post.content.substring(0, 50)}...`,
          timestamp: new Date().toISOString(),
          author: data.post.author.name,
          user: user.email
        }]);
      }
    });

    // Listen for comments
    socketService.on('comment_added', (data) => {
      console.log('💬 Comment added event received:', data);
      if (data.comment) {
        setMessages(prev => [...prev, {
          type: 'comment',
          message: `Comment: ${data.comment.content.substring(0, 50)}...`,
          timestamp: new Date().toISOString(),
          author: data.comment.author.name,
          user: user.email
        }]);
      }
    });

    return () => {
      socketService.off('connected');
      socketService.off('test_message');
      socketService.off('post_created');
      socketService.off('comment_added');
    };
  }, [user]);

  const sendTestMessage = async () => {
    if (!testMessage.trim()) return;

    try {
      const response = await fetch('http://localhost:5001/api/v1/community/test-socket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('wmh_auth_token')}`
        },
        body: JSON.stringify({
          message: testMessage
        })
      });

      const result = await response.json();
      console.log('📤 Test message sent:', result);
      setTestMessage('');
    } catch (error) {
      console.error('❌ Error sending test message:', error);
    }
  };

  const createTestPost = async () => {
    if (!newPostContent.trim()) return;

    try {
      const response = await fetch('http://localhost:5001/api/v1/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('wmh_auth_token')}`
        },
        body: JSON.stringify({
          content: newPostContent,
          category: 'general',
          tags: ['test'],
          isAnonymous: false
        })
      });

      const result = await response.json();
      console.log('📤 Test post created:', result);
      setNewPostContent('');
    } catch (error) {
      console.error('❌ Error creating test post:', error);
    }
  };

  const addTestComment = async () => {
    if (!commentContent.trim() || posts.length === 0) return;

    const firstPost = posts[0];
    try {
      const response = await fetch(`http://localhost:5001/api/v1/community/posts/${firstPost._id || firstPost.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('wmh_auth_token')}`
        },
        body: JSON.stringify({
          content: commentContent
        })
      });

      const result = await response.json();
      console.log('📤 Test comment added:', result);
      setCommentContent('');
    } catch (error) {
      console.error('❌ Error adding test comment:', error);
    }
  };

  const clearData = () => {
    setMessages([]);
    setPosts([]);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Test</h1>
          <p className="text-gray-600">Please log in to test real-time functionality</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Real-Time Functionality Test</h1>
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </div>
              <button
                onClick={() => {
                  logout();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Switch Account
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Test Controls */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Test Controls</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send Test Message
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      placeholder="Enter test message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
                    />
                    <button
                      onClick={sendTestMessage}
                      disabled={!testMessage.trim() || !isConnected}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Create Test Post
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Enter post content..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && createTestPost()}
                    />
                    <button
                      onClick={createTestPost}
                      disabled={!newPostContent.trim() || !isConnected}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Test Comment
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Enter comment..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && addTestComment()}
                    />
                    <button
                      onClick={addTestComment}
                      disabled={!commentContent.trim() || !isConnected || posts.length === 0}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Comment
                    </button>
                  </div>
                  {posts.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">Create a post first to add comments</p>
                  )}
                </div>

                <button
                  onClick={clearData}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Clear Data
                </button>

                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  <p><strong>User:</strong> {user.email}</p>
                  <p><strong>Socket Status:</strong> {isConnected ? 'Connected' : 'Disconnected'}</p>
                  <p><strong>Messages:</strong> {messages.length}</p>
                  <p><strong>Posts:</strong> {posts.length}</p>
                </div>
              </div>
            </div>

            {/* Real-Time Messages */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Real-Time Events</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center">No events yet...</p>
                ) : (
                  <div className="space-y-2">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-sm ${
                          msg.type === 'system' 
                            ? 'bg-blue-100 text-blue-800'
                            : msg.type === 'test'
                            ? 'bg-green-100 text-green-800'
                            : msg.type === 'post'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        <div className="font-medium">
                          {msg.type === 'system' && '🔌 System'}
                          {msg.type === 'test' && '🧪 Test'}
                          {msg.type === 'post' && `📝 ${msg.author}`}
                          {msg.type === 'comment' && `💬 ${msg.author}`}
                        </div>
                        <div>{msg.message}</div>
                        <div className="text-xs opacity-75">
                          {new Date(msg.timestamp).toLocaleTimeString()} - {msg.user}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Real-Time Posts */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Real-Time Posts</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
                {posts.length === 0 ? (
                  <p className="text-gray-500 text-center">No posts yet...</p>
                ) : (
                  <div className="space-y-3">
                    {posts.map((post, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white rounded border"
                      >
                        <div className="font-medium text-sm text-gray-800">
                          {post.author.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {post.content}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          {new Date(post.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">How to Test Real-Time Functionality:</h3>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. Open this page in multiple browser tabs/windows</li>
              <li>2. Log in with different accounts in each tab (basu@gmail.com, bassu@gmail.com)</li>
              <li>3. Send test messages, create posts, and add comments in one tab</li>
              <li>4. Watch them appear instantly in all other tabs</li>
              <li>5. Use "Switch Account" to test different users</li>
              <li>6. Test comments by creating a post first, then adding comments</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RealTimeTest;
