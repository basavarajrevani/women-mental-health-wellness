import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const createYourAdmin = async () => {
  try {
    console.log('🔧 Creating your admin user...');
    
    // Connect to database
    await connectDB();
    
    const adminEmail = 'basavarajrevani123@gmail.com';
    const adminPassword = 'Basu@15032002';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('🔄 Updating password to ensure it matches...');
      
      // Update password to ensure it's correct
      existingAdmin.password = adminPassword;
      await existingAdmin.save();
      
      console.log('✅ Admin password updated successfully!');
    } else {
      console.log('🔧 Creating new admin user...');
      
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
      
      console.log('✅ Admin user created successfully!');
    }
    
    // Verify the admin user
    const verifyAdmin = await User.findOne({ email: adminEmail }).select('+password');
    console.log('\n✅ Admin User Verification:');
    console.log('📧 Email:', verifyAdmin.email);
    console.log('👤 Name:', verifyAdmin.name);
    console.log('👨‍💼 Role:', verifyAdmin.role);
    console.log('🔑 Password Hash Length:', verifyAdmin.password ? verifyAdmin.password.length : 'NO PASSWORD');
    console.log('📅 Created:', verifyAdmin.createdAt);
    
    // Test password comparison
    const isPasswordCorrect = await verifyAdmin.comparePassword(adminPassword);
    console.log('🔑 Password Test:', isPasswordCorrect ? '✅ CORRECT' : '❌ INCORRECT');
    
    console.log('\n🎯 Your Admin Login Credentials:');
    console.log('📧 Email: basavarajrevani123@gmail.com');
    console.log('🔑 Password: Basu@15032002');
    console.log('🌐 Login URL: http://localhost:5174');
    
    console.log('\n💡 The admin user is ready! Try logging in now.');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
};

// Run the script
createYourAdmin();
