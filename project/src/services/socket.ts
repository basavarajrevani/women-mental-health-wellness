// Socket.IO client service for real-time features
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  // Event listeners storage
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.connect();
  }

  // Connect to Socket.IO server
  connect(): void {
    const token = localStorage.getItem('wmh_auth_token');
    
    if (!token) {
      console.log('🔌 No auth token found, skipping socket connection');
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(socketUrl, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.setupEventListeners();
  }

  // Setup default event listeners
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔌 Connected to Socket.IO server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000; // Reset delay
      
      // Join community room for real-time updates
      this.joinRoom('community');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from Socket.IO server:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error);
      this.isConnected = false;
      
      // Exponential backoff for reconnection
      this.reconnectAttempts++;
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000); // Max 30 seconds
        console.log(`🔌 Retrying connection in ${this.reconnectDelay}ms (attempt ${this.reconnectAttempts})`);
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔌 Reconnected to Socket.IO server (attempt ${attemptNumber})`);
      this.isConnected = true;
    });

    // Real-time event handlers
    this.socket.on('post_created', (data) => {
      this.emit('post_created', data);
    });

    this.socket.on('comment_added', (data) => {
      this.emit('comment_added', data);
    });

    this.socket.on('post_like_updated', (data) => {
      this.emit('post_like_updated', data);
    });

    this.socket.on('user_typing', (data) => {
      this.emit('user_typing', data);
    });

    this.socket.on('user_status_changed', (data) => {
      this.emit('user_status_changed', data);
    });

    this.socket.on('notification_received', (data) => {
      this.emit('notification_received', data);
    });

    this.socket.on('system_notification', (data) => {
      this.emit('system_notification', data);
    });
  }

  // Disconnect from server
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Manually disconnected from Socket.IO server');
    }
  }

  // Check if connected
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Join a room
  joinRoom(roomId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', roomId);
      console.log(`🔌 Joined room: ${roomId}`);
    }
  }

  // Leave a room
  leaveRoom(roomId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_room', roomId);
      console.log(`🔌 Left room: ${roomId}`);
    }
  }

  // Send new post event
  sendNewPost(postData: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('new_post', postData);
    }
  }

  // Send new comment event
  sendNewComment(commentData: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('new_comment', commentData);
    }
  }

  // Send post liked event
  sendPostLiked(likeData: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('post_liked', likeData);
    }
  }

  // Send typing start event
  sendTypingStart(roomId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_start', { roomId });
    }
  }

  // Send typing stop event
  sendTypingStop(roomId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_stop', { roomId });
    }
  }

  // Send status update
  sendStatusUpdate(status: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('status_update', status);
    }
  }

  // Generic event listener registration
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  // Remove event listener
  off(event: string, callback?: Function): void {
    if (!this.eventListeners.has(event)) return;

    if (callback) {
      const listeners = this.eventListeners.get(event)!;
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    } else {
      this.eventListeners.delete(event);
    }
  }

  // Emit event to registered listeners
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in socket event listener for ${event}:`, error);
        }
      });
    }
  }

  // Reconnect manually
  reconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.connect();
  }

  // Update auth token (when user logs in/out)
  updateAuthToken(token: string | null): void {
    if (token) {
      // Reconnect with new token
      this.disconnect();
      this.connect();
    } else {
      // Disconnect when logging out
      this.disconnect();
    }
  }

  // Get connection status
  getConnectionStatus(): {
    connected: boolean;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  } {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
    };
  }
}

// Create singleton instance
const socketService = new SocketService();

// Export specific methods for easier use
export const {
  connect,
  disconnect,
  isSocketConnected,
  joinRoom,
  leaveRoom,
  sendNewPost,
  sendNewComment,
  sendPostLiked,
  sendTypingStart,
  sendTypingStop,
  sendStatusUpdate,
  on,
  off,
  reconnect,
  updateAuthToken,
  getConnectionStatus,
} = socketService;

export default socketService;
