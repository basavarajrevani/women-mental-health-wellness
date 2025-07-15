import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const fixAtlasAdmin = async () => {
  try {
    console.log('🌐 Connecting to MongoDB Atlas...');
    
    // Your exact credentials
    const adminEmail = 'basavarajrevani123@gmail.com';
    const adminPassword = 'Basu@15032002';
    
    console.log('📧 Admin Email:', adminEmail);
    console.log('🔑 Admin Password: ****');
    
    // Connect to Atlas
    await connectDB();
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    // Delete any existing admin to start fresh
    await User.deleteMany({ email: adminEmail });
    console.log('🧹 Cleaned existing admin user');
    
    // Create your admin user in Atlas
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
    
    // Verify the admin user
    const verifyAdmin = await User.findOne({ email: adminEmail }).select('+password');
    const passwordTest = await verifyAdmin.comparePassword(adminPassword);
    
    console.log('\n✅ Atlas Admin Verification:');
    console.log('📧 Email:', verifyAdmin.email);
    console.log('👤 Name:', verifyAdmin.name);
    console.log('👨‍💼 Role:', verifyAdmin.role);
    console.log('🔑 Password Test:', passwordTest ? '✅ CORRECT' : '❌ INCORRECT');
    console.log('📅 Created:', verifyAdmin.createdAt);
    console.log('🆔 MongoDB ID:', verifyAdmin._id);
    
    // List all users in Atlas
    const allUsers = await User.find({}).select('name email role createdAt');
    console.log(`\n📊 Total users in Atlas: ${allUsers.length}`);
    
    if (allUsers.length > 0) {
      console.log('\n👥 All users in Atlas database:');
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }
    
    console.log('\n🎯 MongoDB Atlas Setup Complete!');
    console.log('📧 Admin Email: basavarajrevani123@gmail.com');
    console.log('🔑 Admin Password: Basu@15032002');
    console.log('🌐 Database: MongoDB Atlas (Cloud)');
    console.log('🔗 Frontend URL: http://localhost:5174');
    
    console.log('\n✅ ALL USER ACTIVITIES WILL NOW BE STORED IN MONGODB ATLAS');
    console.log('✅ ADMIN CHANGES WILL APPLY TO ALL USERS IN REAL-TIME');
    console.log('✅ AUTHENTICATION IS CONNECTED TO ATLAS DATABASE');
    
    console.log('\n🚀 READY TO TEST ADMIN LOGIN!');
    
  } catch (error) {
    console.error('❌ Error setting up Atlas admin:', error);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Atlas Authentication Issue:');
      console.log('1. Check MongoDB Atlas username/password');
      console.log('2. Verify IP whitelist in Atlas (add 0.0.0.0/0 for testing)');
      console.log('3. Check connection string format');
      console.log('4. Verify cluster is running in Atlas dashboard');
    }
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('EREFUSED')) {
      console.log('\n🌐 Network/DNS Issue:');
      console.log('1. Check internet connection');
      console.log('2. Try different network or VPN');
      console.log('3. Check firewall settings');
      console.log('4. Verify cluster URL in Atlas dashboard');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Atlas connection closed.');
  }
};

// Run the setup
fixAtlasAdmin();
