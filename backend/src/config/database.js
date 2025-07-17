import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'test' 
      ? process.env.MONGODB_TEST_URI 
      : process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    console.log('🔄 Attempting to connect to MongoDB...');
    console.log(`📍 Connection URI: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`);

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });

    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📦 MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('📦 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);

    // Provide helpful error messages
    if (error.message.includes('EREFUSED') || error.message.includes('querySrv') || error.message.includes('ENOTFOUND')) {
      console.error('💡 Network/DNS issues detected. Possible solutions:');
      console.error('   1. Check your internet connection');
      console.error('   2. Verify MongoDB Atlas cluster is running');
      console.error('   3. Check if your IP address is whitelisted in MongoDB Atlas');
      console.error('   4. Try using a different network or VPN');
      console.error('   5. Verify the connection string is correct');
    }

    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('💡 Authentication issue detected:');
      console.error('   1. Check username and password in connection string');
      console.error('   2. Verify database user permissions in MongoDB Atlas');
      console.error('   3. Ensure the user has read/write access to the database');
    }

    if (error.message.includes('timeout')) {
      console.error('💡 Connection timeout detected:');
      console.error('   1. Check your internet connection speed');
      console.error('   2. Try increasing the timeout values');
      console.error('   3. Check if there are firewall restrictions');
    }

    console.error('🔧 Alternative: You can use a local MongoDB instance:');
    console.error('   1. Install MongoDB locally');
    console.error('   2. Set MONGODB_URI=mongodb://localhost:27017/wmh_platform');
    console.error('   3. Start MongoDB with: mongod');

    // For development/testing, allow server to continue without MongoDB
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  DEVELOPMENT MODE: Continuing without MongoDB for Socket.IO testing');
      console.log('🔌 Socket.IO functionality will still work for real-time features');
      return;
    }

    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('📦 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
};
