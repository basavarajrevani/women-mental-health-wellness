import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const setupAtlasComplete = async () => {
  try {
    console.log('🌐 Setting up complete MongoDB Atlas integration...');
    console.log('📍 Connecting to Atlas...');
    
    // Connect to Atlas database
    await connectDB();
    
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    // Admin credentials from .env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    console.log('👤 Setting up admin user:', adminEmail);
    
    // Remove any existing admin users to start fresh
    await User.deleteMany({ email: adminEmail });
    console.log('🧹 Cleaned existing admin user');
    
    // Create fresh admin user in Atlas
    const adminUser = await User.create({
      name: 'Basavaraj Revani',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      profile: {
        avatar: '👨‍💼',
        bio: 'Platform Administrator',
        personalInfo: {
          firstName: 'Basavaraj',
          lastName: 'Revani',
        },
      },
      verification: {
        isEmailVerified: true,
      },
      stats: {
        lastActiveDate: new Date(),
        postsCount: 0,
        likesReceived: 0,
        streakDays: 1,
      },
    });
    
    console.log('✅ Admin user created in Atlas!');
    console.log('🆔 Admin ID:', adminUser._id);
    
    // Verify admin user
    const verifyAdmin = await User.findOne({ email: adminEmail }).select('+password');
    const passwordTest = await verifyAdmin.comparePassword(adminPassword);
    
    console.log('\n✅ Atlas Admin Verification:');
    console.log('📧 Email:', verifyAdmin.email);
    console.log('👤 Name:', verifyAdmin.name);
    console.log('👨‍💼 Role:', verifyAdmin.role);
    console.log('🔑 Password Test:', passwordTest ? '✅ CORRECT' : '❌ INCORRECT');
    console.log('📅 Created:', verifyAdmin.createdAt);
    
    // Create sample data for testing
    console.log('\n🔧 Creating sample data...');
    
    // Create a test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpass123',
      role: 'user',
      profile: {
        avatar: '👤',
        bio: 'Test user account',
      },
      verification: {
        isEmailVerified: true,
      },
      stats: {
        lastActiveDate: new Date(),
      },
    });
    
    console.log('✅ Test user created:', testUser.email);
    
    // List all users in Atlas
    const allUsers = await User.find({}).select('name email role createdAt');
    console.log(`\n📊 Total users in Atlas: ${allUsers.length}`);
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log('\n🎯 MongoDB Atlas Setup Complete!');
    console.log('📧 Admin Email:', adminEmail);
    console.log('🔑 Admin Password:', adminPassword);
    console.log('🌐 Database: MongoDB Atlas (Cloud)');
    console.log('🔗 Frontend URL: http://localhost:5174');
    
    console.log('\n✅ All user activities will now be stored in MongoDB Atlas');
    console.log('✅ Admin changes will apply to all users in real-time');
    console.log('✅ Authentication is connected to Atlas database');
    
    console.log('\n🚀 Ready to test admin login!');
    
  } catch (error) {
    console.error('❌ Error setting up Atlas:', error);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Atlas Authentication Issue:');
      console.log('1. Check MongoDB Atlas username/password');
      console.log('2. Verify IP whitelist in Atlas');
      console.log('3. Check connection string format');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Atlas connection closed.');
  }
};

// Run the setup
setupAtlasComplete();
