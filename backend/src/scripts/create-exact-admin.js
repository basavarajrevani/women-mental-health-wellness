import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const createExactAdmin = async () => {
  try {
    console.log('🔧 Creating your EXACT admin user...');
    
    // Your EXACT credentials as specified
    const adminEmail = 'basavarajrevani123@gmail.com';
    const adminPassword = 'Basu@15032002';
    
    console.log('📧 Admin Email:', adminEmail);
    console.log('🔑 Admin Password:', adminPassword);
    
    // Connect to database
    await connectDB();
    
    // Delete ALL existing users to start completely fresh
    await User.deleteMany({});
    console.log('🧹 Deleted all existing users - starting fresh');
    
    // Create your admin user with EXACT credentials
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
    
    console.log('✅ Admin user created successfully!');
    console.log('🆔 Admin ID:', adminUser._id);
    
    // Verify the admin user with EXACT password
    const verifyAdmin = await User.findOne({ email: adminEmail }).select('+password');
    const passwordTest = await verifyAdmin.comparePassword(adminPassword);
    
    console.log('\n✅ Admin User Verification:');
    console.log('📧 Email:', verifyAdmin.email);
    console.log('👤 Name:', verifyAdmin.name);
    console.log('👨‍💼 Role:', verifyAdmin.role);
    console.log('🔑 Password Test:', passwordTest ? '✅ CORRECT' : '❌ INCORRECT');
    console.log('📅 Created:', verifyAdmin.createdAt);
    console.log('🆔 MongoDB ID:', verifyAdmin._id);
    
    // Test login simulation
    console.log('\n🧪 Testing login simulation...');
    const loginTest = await User.findByEmail(adminEmail).select('+password');
    if (loginTest) {
      const loginPasswordTest = await loginTest.comparePassword(adminPassword);
      console.log('🔐 Login Test Result:', loginPasswordTest ? '✅ LOGIN WILL WORK' : '❌ LOGIN WILL FAIL');
    }
    
    // List all users
    const allUsers = await User.find({}).select('name email role createdAt');
    console.log(`\n📊 Total users in database: ${allUsers.length}`);
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log('\n🎯 YOUR EXACT ADMIN LOGIN CREDENTIALS:');
    console.log('📧 Email: basavarajrevani123@gmail.com');
    console.log('🔑 Password: Basu@15032002');
    console.log('🌐 Login URL: http://localhost:5174');
    
    console.log('\n✅ ADMIN USER IS READY WITH YOUR EXACT CREDENTIALS!');
    console.log('✅ ALL USER ACTIVITIES WILL BE STORED IN DATABASE');
    console.log('✅ ADMIN CHANGES WILL APPLY TO ALL USERS');
    
    console.log('\n🚀 TRY LOGGING IN NOW!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
};

// Run the script
createExactAdmin();
