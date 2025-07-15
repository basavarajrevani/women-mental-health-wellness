import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const checkUsers = async () => {
  try {
    console.log('🔍 Checking users in database...');
    
    // Connect to database
    await connectDB();
    
    // Find all users
    const allUsers = await User.find({}).select('name email role createdAt');
    console.log(`📊 Total users found: ${allUsers.length}`);
    
    if (allUsers.length === 0) {
      console.log('❌ No users found in database');
    } else {
      console.log('\n👥 Users in database:');
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Created: ${user.createdAt}`);
      });
    }
    
    // Check for admin users specifically
    const adminUsers = await User.find({ role: 'admin' }).select('name email role');
    console.log(`\n👨‍💼 Admin users found: ${adminUsers.length}`);
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found');
      console.log('🔧 Creating admin user...');
      
      // Create admin user
      const adminUser = await User.create({
        name: 'Platform Administrator',
        email: 'admin@wmh-platform.com',
        password: 'admin123',
        role: 'admin',
        profile: {
          avatar: '👩‍💼',
          bio: 'Platform administrator',
          personalInfo: {
            firstName: 'Platform',
            lastName: 'Administrator',
          },
        },
        verification: {
          isEmailVerified: true,
        },
        stats: {
          lastActiveDate: new Date(),
        },
      });
      
      console.log('✅ Admin user created successfully!');
      console.log(`📧 Email: ${adminUser.email}`);
      console.log(`🔑 Password: admin123`);
    } else {
      console.log('\n👨‍💼 Admin users:');
      adminUsers.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name} (${admin.email})`);
      });
    }
    
    // Check for the specific user trying to login
    const specificUser = await User.findOne({ email: 'basavarajrevani123@gmail.com' });
    if (specificUser) {
      console.log(`\n✅ User basavarajrevani123@gmail.com exists with role: ${specificUser.role}`);
    } else {
      console.log('\n❌ User basavarajrevani123@gmail.com does not exist');
      console.log('💡 You can either:');
      console.log('   1. Register this email as a new user');
      console.log('   2. Use the admin account: admin@wmh-platform.com / admin123');
      console.log('   3. Create this user as admin (see below)');
      
      // Optionally create the user as admin
      console.log('\n🔧 Creating basavarajrevani123@gmail.com as admin user...');
      
      const newAdminUser = await User.create({
        name: 'Basavaraj Revani',
        email: 'basavarajrevani123@gmail.com',
        password: 'Basu@15032002',
        role: 'admin',
        profile: {
          avatar: '👨‍💼',
          bio: 'Platform administrator',
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
      
      console.log('✅ Admin user basavarajrevani123@gmail.com created successfully!');
      console.log(`📧 Email: ${newAdminUser.email}`);
      console.log(`🔑 Password: Basu@15032002`);
    }
    
    console.log('\n🎯 Login Credentials Available:');
    console.log('   Admin 1: admin@wmh-platform.com / admin123');
    console.log('   Admin 2: basavarajrevani123@gmail.com / Basu@15032002');
    console.log('   User: basu@gmail.com / 123456');
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
};

// Run the check
checkUsers();
