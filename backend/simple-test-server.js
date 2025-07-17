import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

// Simple JSON parser middleware
app.use((req, res, next) => {
  if (req.method === 'POST' && req.headers['content-type'] === 'application/json') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(body);
        next();
      } catch (error) {
        console.error('JSON parse error:', error);
        res.status(400).json({ success: false, message: 'Invalid JSON' });
      }
    });
  } else {
    req.body = {};
    next();
  }
});

// Simple auth middleware for Socket.IO
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, 'test-secret-key');
    socket.userId = decoded.id;
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.user.email} (${socket.userId})`);

  // Join community room
  socket.join('community');
  console.log(`🌐 User ${socket.userId} joined community room`);

  // Send connection confirmation
  socket.emit('connected', {
    userId: socket.userId,
    userName: socket.user.name,
    message: 'Successfully connected to real-time server'
  });

  socket.on('disconnect', (reason) => {
    console.log(`🔌 User disconnected: ${socket.user.email} - Reason: ${reason}`);
  });
});

// Test login endpoint
app.post('/api/v1/auth/test-login', (req, res) => {
  try {
    console.log('🧪 Test login request received');
    console.log('🧪 Request body:', req.body);
    
    const { email, password } = req.body || {};
    
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Simple mock authentication
    if (password === '123456') {
      const mockUser = {
        _id: email === 'basu@gmail.com' ? '6876b161f270b709a4ff566a' : '6878f15abbd43cf983ff6d32',
        id: email === 'basu@gmail.com' ? '6876b161f270b709a4ff566a' : '6878f15abbd43cf983ff6d32',
        name: email === 'basu@gmail.com' ? 'Basu' : 'Bassu',
        email: email,
        role: 'user',
        profile: {
          avatar: '👤',
          bio: 'Test user for Socket.IO development'
        },
        stats: { postsCount: 0, likesReceived: 0, commentsCount: 0 },
        status: 'active',
        createdAt: new Date()
      };

      const token = jwt.sign(
        { 
          id: mockUser._id,
          email: mockUser.email,
          role: mockUser.role,
          name: mockUser.name
        },
        'test-secret-key',
        { expiresIn: '7d' }
      );

      console.log('✅ Test login successful for:', email);

      return res.status(200).json({
        success: true,
        message: 'Login successful (test mode)',
        data: {
          token,
          user: mockUser
        }
      });
    } else {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials (use password: 123456 for testing)'
      });
    }
  } catch (error) {
    console.error('❌ Test login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Test login failed',
      error: error.message
    });
  }
});

// Test auth middleware
const testAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, 'test-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Get user profile endpoint
app.get('/api/v1/auth/me', testAuth, (req, res) => {
  console.log('👤 /auth/me request received from user:', req.user.email);

  const mockUser = {
    _id: req.user.id,
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    profile: {
      avatar: '👤',
      bio: 'Test user for Socket.IO development'
    },
    stats: { postsCount: 0, likesReceived: 0, commentsCount: 0 },
    status: 'active',
    createdAt: new Date()
  };

  console.log('👤 Sending user profile response for:', req.user.email);

  res.status(200).json({
    success: true,
    data: {
      user: mockUser
    }
  });
});

// Mock community posts endpoint
app.get('/api/v1/community/posts', testAuth, (req, res) => {
  const mockPosts = [
    {
      _id: '6878ae85bbd43cf983ff6cc5',
      id: '6878ae85bbd43cf983ff6cc5',
      content: 'Welcome to the real-time community! This is a test post to verify Socket.IO functionality. Try creating new posts and see them appear in real-time!',
      category: 'general',
      tags: ['test', 'welcome', 'realtime'],
      author: {
        _id: '6876b161f270b709a4ff566a',
        id: '6876b161f270b709a4ff566a',
        name: 'System',
        profile: { avatar: '🤖' }
      },
      likes: [],
      comments: [],
      isAnonymous: false,
      isPinned: true,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
      isLikedByUser: false
    }
  ];

  res.status(200).json({
    success: true,
    data: {
      posts: mockPosts,
      pagination: {
        current: 1,
        pages: 1,
        total: mockPosts.length,
        hasNext: false,
        hasPrev: false
      }
    }
  });
});

// Create post endpoint
app.post('/api/v1/community/posts', testAuth, (req, res) => {
  try {
    const { content, category, tags, isAnonymous } = req.body;
    
    const newPost = {
      _id: Date.now().toString(),
      id: Date.now().toString(),
      content,
      category: category || 'general',
      tags: tags || [],
      author: {
        _id: req.user.id,
        id: req.user.id,
        name: isAnonymous ? 'Anonymous' : req.user.name,
        profile: { avatar: isAnonymous ? '🎭' : '👤' }
      },
      likes: [],
      comments: [],
      isAnonymous: isAnonymous || false,
      isPinned: false,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Broadcast to all connected users
    io.to('community').emit('post_created', {
      post: newPost
    });

    console.log('📝 New post created and broadcasted:', newPost._id);

    res.status(201).json({
      success: true,
      data: {
        post: newPost
      }
    });
  } catch (error) {
    console.error('❌ Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
});

// Add comment to post endpoint
app.post('/api/v1/community/posts/:postId/comments', testAuth, (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const newComment = {
      _id: Date.now().toString(),
      id: Date.now().toString(),
      content: content.trim(),
      author: {
        _id: req.user.id,
        id: req.user.id,
        name: req.user.name,
        profile: { avatar: '👤' }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Broadcast comment to all connected users
    console.log('📡 Broadcasting comment to community room...');
    console.log('📡 Connected sockets in community room:', io.sockets.adapter.rooms.get('community')?.size || 0);

    io.to('community').emit('comment_added', {
      postId: postId,
      comment: newComment
    });

    console.log('💬 New comment created and broadcasted:', newComment._id);

    res.status(201).json({
      success: true,
      data: {
        comment: newComment
      }
    });
  } catch (error) {
    console.error('❌ Error creating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create comment'
    });
  }
});

// Like/Unlike post endpoint
app.post('/api/v1/community/posts/:postId/like', testAuth, (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // For simplicity, we'll just broadcast the like event
    // In a real app, you'd update the database
    const isLiked = Math.random() > 0.5; // Random like/unlike for testing

    console.log('📡 Broadcasting like update to community room...');
    console.log('📡 Connected sockets in community room:', io.sockets.adapter.rooms.get('community')?.size || 0);

    io.to('community').emit('post_like_updated', {
      postId: postId,
      userId: userId,
      isLiked: isLiked
    });

    console.log('👍 Post like updated and broadcasted:', postId);

    res.status(200).json({
      success: true,
      data: {
        postId: postId,
        isLiked: isLiked
      }
    });
  } catch (error) {
    console.error('❌ Error updating like:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update like'
    });
  }
});

// Test Socket.IO endpoint
app.post('/api/v1/community/test-socket', testAuth, (req, res) => {
  try {
    const { message } = req.body;
    console.log('🧪 Testing Socket.IO broadcast');
    io.to('community').emit('test_message', {
      message: message || 'Socket.IO is working!',
      timestamp: new Date().toISOString(),
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: 'Test message broadcasted to community',
    });
  } catch (error) {
    console.error('❌ Socket.IO test error:', error);
    res.status(500).json({
      success: false,
      message: 'Socket.IO test failed',
      error: error.message,
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Simple test server is running',
    timestamp: new Date().toISOString()
  });
});

const PORT = 5001;
server.listen(PORT, () => {
  console.log('🚀 Simple Test Server running on port', PORT);
  console.log('🔗 API Base URL: http://localhost:5001/api/v1');
  console.log('🏥 Health Check: http://localhost:5001/health');
  console.log('🔌 Socket.IO server ready for real-time connections');
  console.log('🧪 Test login: POST /api/v1/auth/test-login with {"email":"basu@gmail.com","password":"123456"}');
});
