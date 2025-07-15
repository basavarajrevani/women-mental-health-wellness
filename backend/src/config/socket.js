import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const setupSocketIO = (io) => {
  // Middleware for socket authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`👤 User connected: ${socket.user.name} (${socket.userId})`);

    // Join user to their personal room for notifications
    socket.join(`user_${socket.userId}`);

    // Join community room for real-time updates
    socket.join('community');

    // Handle joining specific rooms
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`👤 User ${socket.userId} joined room: ${roomId}`);
    });

    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      console.log(`👤 User ${socket.userId} left room: ${roomId}`);
    });

    // Handle real-time community post creation
    socket.on('new_post', (postData) => {
      // Broadcast to all users in community room
      socket.to('community').emit('post_created', {
        ...postData,
        author: socket.user.name,
        authorId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle real-time comments
    socket.on('new_comment', (commentData) => {
      socket.to('community').emit('comment_added', {
        ...commentData,
        author: socket.user.name,
        authorId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle real-time likes
    socket.on('post_liked', (likeData) => {
      socket.to('community').emit('post_like_updated', {
        ...likeData,
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle typing indicators for chat
    socket.on('typing_start', (data) => {
      socket.to(data.roomId).emit('user_typing', {
        userId: socket.userId,
        userName: socket.user.name,
        isTyping: true,
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(data.roomId).emit('user_typing', {
        userId: socket.userId,
        userName: socket.user.name,
        isTyping: false,
      });
    });

    // Handle user status updates
    socket.on('status_update', (status) => {
      socket.to('community').emit('user_status_changed', {
        userId: socket.userId,
        status: status,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`👤 User disconnected: ${socket.user.name} (${socket.userId}) - Reason: ${reason}`);
      
      // Notify community that user went offline
      socket.to('community').emit('user_status_changed', {
        userId: socket.userId,
        status: 'offline',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`❌ Socket error for user ${socket.userId}:`, error);
    });
  });

  // Helper functions for emitting events from routes
  io.sendToUser = (userId, event, data) => {
    io.to(`user_${userId}`).emit(event, data);
  };

  io.sendToCommunity = (event, data) => {
    io.to('community').emit(event, data);
  };

  io.sendToRoom = (roomId, event, data) => {
    io.to(roomId).emit(event, data);
  };

  console.log('🔌 Socket.IO server configured and ready');
};
