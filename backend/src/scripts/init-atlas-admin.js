import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const initAtlasAdmin = async () => {
  try {
    console.log('🌐 Connecting to MongoDB Atlas...');
    console.log('📍 Connection URI:', process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@'));
    
    // Connect to database
    await connectDB();
    
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    // Get admin credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    console.log('👤 Admin Email:', adminEmail);
    console.log('🔑 Admin Password:', adminPassword ? '****' : 'NOT SET');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('✅ Admin user already exists in Atlas database');
      console.log('👤 Name:', existingAdmin.name);
      console.log('📧 Email:', existingAdmin.email);
      console.log('👨‍💼 Role:', existingAdmin.role);
      console.log('📅 Created:', existingAdmin.createdAt);
      
      // Update password if needed
      console.log('🔄 Updating admin password to ensure it matches .env...');
      existingAdmin.password = adminPassword;
      await existingAdmin.save();
      console.log('✅ Admin password updated successfully!');
      
    } else {
      console.log('🔧 Creating new admin user in Atlas database...');
      
      // Create admin user
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
        },
      });
      
      console.log('✅ Admin user created successfully in Atlas!');
      console.log('👤 Name:', adminUser.name);
      console.log('📧 Email:', adminUser.email);
      console.log('👨‍💼 Role:', adminUser.role);
      console.log('🆔 ID:', adminUser._id);
    }
    
    // List all users in Atlas database
    const allUsers = await User.find({}).select('name email role createdAt');
    console.log(`\n📊 Total users in Atlas database: ${allUsers.length}`);
    
    if (allUsers.length > 0) {
      console.log('\n👥 All users in Atlas database:');
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }
    
    console.log('\n🎯 Login Credentials for Atlas Database:');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('🌐 Database: MongoDB Atlas (Cloud)');
    
    console.log('\n💡 Now try logging in at: http://localhost:5174');
    
  } catch (error) {
    console.error('❌ Error initializing Atlas admin:', error);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 MongoDB Atlas Authentication Issue:');
      console.log('1. Check your MongoDB Atlas username and password');
      console.log('2. Make sure your IP is whitelisted in Atlas');
      console.log('3. Verify the connection string is correct');
    }
    
    if (error.message.includes('network')) {
      console.log('\n🌐 Network Issue:');
      console.log('1. Check your internet connection');
      console.log('2. Verify MongoDB Atlas cluster is running');
      console.log('3. Check firewall settings');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
};

// Run the script
initAtlasAdmin();
