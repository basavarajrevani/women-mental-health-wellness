import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import socketService from '../services/socket';
import { useAuth } from '../context/AuthContext';

const SocketTest: React.FC = () => {
  const { user, logout } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    console.log('🧪 Starting Socket.IO test for user:', user.email);

    // Connect to socket
    socketService.connect();

    // Listen for connection status
    socketService.on('connected', (data) => {
      console.log('✅ Socket connected:', data);
      setIsConnected(true);
      setMessages(prev => [...prev, {
        type: 'system',
        message: `Connected as ${data.userName}`,
        timestamp: new Date().toISOString()
      }]);
    });

    // Listen for test messages
    socketService.on('test_message', (data) => {
      console.log('📨 Test message received:', data);
      setMessages(prev => [...prev, {
        type: 'test',
        message: data.message,
        timestamp: data.timestamp,
        userId: data.userId
      }]);
    });

    // Listen for post creation
    socketService.on('post_created', (data) => {
      console.log('📝 Post created event received:', data);
      setMessages(prev => [...prev, {
        type: 'post',
        message: `New post: ${data.post.content.substring(0, 50)}...`,
        timestamp: new Date().toISOString(),
        author: data.post.author.name
      }]);
    });

    return () => {
      socketService.off('connected');
      socketService.off('test_message');
      socketService.off('post_created');
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Socket.IO Test</h1>
          <p className="text-gray-600">Please log in to test Socket.IO functionality</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Socket.IO Real-Time Test</h1>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isConnected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                <div className="text-sm text-gray-600">
                  <p><strong>User:</strong> {user.email}</p>
                  <p><strong>Socket Status:</strong> {isConnected ? 'Connected' : 'Disconnected'}</p>
                </div>

                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/login';
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Logout & Test Another Account
                </button>
              </div>
            </div>

            {/* Message Log */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Real-Time Messages</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center">No messages yet...</p>
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
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        <div className="font-medium">
                          {msg.type === 'system' && '🔌 System'}
                          {msg.type === 'test' && '🧪 Test'}
                          {msg.type === 'post' && `📝 ${msg.author}`}
                        </div>
                        <div>{msg.message}</div>
                        <div className="text-xs opacity-75">
                          {new Date(msg.timestamp).toLocaleTimeString()}
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
              <li>2. Log in with different accounts in each tab</li>
              <li>3. Send test messages and see them appear in real-time</li>
              <li>4. Go to Community page and create posts to see real-time updates</li>
              <li>5. Like and comment on posts to test real-time interactions</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SocketTest;
