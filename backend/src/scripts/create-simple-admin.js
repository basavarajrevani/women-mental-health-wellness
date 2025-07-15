import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const createSimpleAdmin = async () => {
  try {
    console.log('🔧 Creating simple admin user...');
    
    // Connect to database
    await connectDB();
    
    // Check if simple admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@test.com' });
    if (existingAdmin) {
      console.log('❌ Admin user admin@test.com already exists');
      console.log('🎯 Use credentials: admin@test.com / admin123');
      return;
    }
    
    // Create simple admin user
    const adminUser = await User.create({
      name: 'Test Administrator',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin',
      profile: {
        avatar: '👨‍💼',
        bio: 'Test administrator account',
        personalInfo: {
          firstName: 'Test',
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
    
    console.log('✅ Simple admin user created successfully!');
    console.log('📧 Email: admin@test.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    
    console.log('\n🎯 Available Admin Accounts:');
    console.log('   1. admin@test.com / admin123 (NEW - SIMPLE)');
    console.log('   2. admin@wmh-platform.com / admin123');
    console.log('   3. basavarajrevani123@gmail.com / Basu@15032002');
    
    console.log('\n💡 Try logging in with: admin@test.com / admin123');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
};

// Run the script
createSimpleAdmin();
