import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const createAtlasAdmin = async () => {
  try {
    console.log('🌐 Creating admin user in MongoDB Atlas...');
    
    // Your admin credentials
    const adminEmail = 'basavarajrevani123@gmail.com';
    const adminPassword = 'Basu@15032002';
    
    console.log('📧 Admin Email:', adminEmail);
    console.log('🔑 Admin Password: ****');
    
    // Connect to Atlas
    await connectDB();
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    // Delete any existing admin to start fresh
    await User.deleteMany({ email: adminEmail });
    console.log('🧹 Cleaned existing admin user in Atlas');
    
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
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
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
    console.error('❌ Error creating Atlas admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Atlas connection closed.');
  }
};

// Run the script
createAtlasAdmin();
