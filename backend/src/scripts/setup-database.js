import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';
import SystemSettings from '../models/SystemSettings.js';
import AdminLog from '../models/AdminLog.js';

// Load environment variables
dotenv.config();

const setupDatabase = async () => {
  try {
    console.log('🚀 Starting Complete Database Setup...');
    console.log('=====================================');
    
    // Test connection first
    console.log('🔍 Testing database connection...');
    await connectDB();
    
    console.log('✅ Database connection successful!');
    
    // Create indexes for better performance
    console.log('📊 Creating database indexes...');
    
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ 'profile.personalInfo.phoneNumber': 1 }, { sparse: true });
    await User.collection.createIndex({ status: 1 });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ createdAt: -1 });
    await User.collection.createIndex({ 'stats.lastActiveDate': -1 });
    await User.collection.createIndex({ 'verification.isEmailVerified': 1 });
    
    console.log('✅ User indexes created');
    
    // Check if admin user exists
    console.log('👤 Checking for admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@wmh-platform.com';
    let adminUser = await User.findOne({ email: adminEmail });
    
    if (!adminUser) {
      console.log('🔧 Creating admin user...');
      adminUser = await User.create({
        name: 'Platform Administrator',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
        profile: {
          avatar: '👩‍💼',
          bio: 'Platform administrator and mental health advocate',
          personalInfo: {
            firstName: 'Platform',
            lastName: 'Administrator',
            gender: 'prefer-not-to-say',
          },
          location: {
            city: 'Global',
            country: 'Worldwide',
            timezone: 'UTC',
          },
          preferences: {
            privacy: {
              profileVisibility: 'public',
              showRealName: true,
              allowDirectMessages: true,
            },
            notifications: {
              email: {
                enabled: true,
                frequency: 'immediate',
                types: {
                  systemUpdates: true,
                  communityUpdates: true,
                },
              },
            },
          },
        },
        verification: {
          isEmailVerified: true,
        },
        stats: {
          lastActiveDate: new Date(),
        },
      });
      console.log(`✅ Admin user created: ${adminUser.email}`);
    } else {
      console.log(`✅ Admin user already exists: ${adminUser.email}`);
    }
    
    // Initialize system settings
    console.log('⚙️ Initializing system settings...');
    let settings = await SystemSettings.findOne();
    
    if (!settings) {
      settings = await SystemSettings.create({
        platform: {
          name: "Women's Mental Health & Wellness Platform",
          version: '1.0.0',
          description: 'A comprehensive platform supporting women\'s mental health and wellness through community, resources, and professional support.',
          primaryColor: '#8B5CF6',
          secondaryColor: '#EC4899',
          maintenanceMode: {
            enabled: false,
            message: 'Platform is under maintenance. Please check back soon.',
          },
        },
        userManagement: {
          registration: {
            enabled: true,
            requireEmailVerification: true,
            requireAdminApproval: false,
            minimumAge: 13,
          },
          authentication: {
            passwordMinLength: 6,
            passwordRequireUppercase: true,
            passwordRequireLowercase: true,
            passwordRequireNumbers: true,
            maxLoginAttempts: 5,
            lockoutDuration: 15 * 60 * 1000, // 15 minutes
            sessionTimeout: 7 * 24 * 60 * 60 * 1000, // 7 days
          },
        },
        contentModeration: {
          posts: {
            requireApproval: false,
            maxLength: 5000,
            allowImages: true,
            allowLinks: true,
            autoModeration: {
              enabled: true,
              flagKeywords: ['spam', 'inappropriate', 'harmful', 'abuse'],
              blockKeywords: ['hate', 'violence', 'illegal'],
            },
          },
          reporting: {
            enabled: true,
            categories: ['spam', 'harassment', 'inappropriate-content', 'misinformation', 'other'],
            autoActions: {
              hideAfterReports: 3,
              deleteAfterReports: 10,
            },
          },
        },
        communication: {
          email: {
            enabled: true,
            provider: 'smtp',
            fromAddress: 'noreply@wmh-platform.com',
            fromName: 'WMH Platform',
          },
          notifications: {
            realTime: true,
            inApp: {
              enabled: true,
              maxNotifications: 100,
              retentionDays: 30,
            },
          },
        },
        features: {
          community: { enabled: true, allowPosts: true, allowComments: true, allowLikes: true },
          supportGroups: { enabled: true, allowUserCreation: false, maxMembersPerGroup: 50 },
          events: { enabled: true, allowUserCreation: false, requireApproval: true },
          resources: { enabled: true, allowUserSubmissions: false, requireVerification: true },
          moodTracking: { enabled: true, reminderNotifications: true },
        },
        analytics: {
          enabled: true,
          provider: 'internal',
          dataRetentionDays: 365,
          anonymizeIPs: true,
        },
        backup: {
          enabled: true,
          frequency: 'daily',
          retentionDays: 30,
          location: 'local',
        },
        lastUpdatedBy: adminUser._id,
      });
      console.log('✅ System settings initialized');
    } else {
      console.log('✅ System settings already exist');
    }
    
    // Log the setup
    await AdminLog.create({
      admin: adminUser._id,
      action: 'system_settings_changed',
      target: {
        model: 'System',
        name: 'Database Setup',
      },
      details: {
        description: 'Complete database setup and initialization',
        notes: 'Automated database setup with indexes, admin user, and system settings',
      },
      category: 'system_admin',
      severity: 'medium',
      tags: ['setup', 'initialization', 'database'],
      metadata: {
        setupDate: new Date(),
        version: '1.0.0',
      },
    });
    
    // Database statistics
    console.log('\n📊 Database Setup Complete!');
    console.log('============================');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Collections created: ${collections.length}`);
    collections.forEach(col => {
      console.log(`   • ${col.name}`);
    });
    
    const userCount = await User.countDocuments();
    console.log(`👥 Total users: ${userCount}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log(`   Admin: ${adminUser.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    
    console.log('\n🌐 Access URLs:');
    console.log(`   Frontend: http://localhost:5173`);
    console.log(`   Backend API: http://localhost:5000/api/v1`);
    console.log(`   Health Check: http://localhost:5000/health`);
    console.log(`   Admin Dashboard: http://localhost:5173/admin`);
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('🚀 You can now start the application with: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Database setup failed!');
    console.error('==========================');
    console.error(`Error: ${error.message}`);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.error('\n🔧 MongoDB Atlas Connection Issues:');
      console.error('   1. Check your internet connection');
      console.error('   2. Verify MongoDB Atlas cluster is running');
      console.error('   3. Add your IP to MongoDB Atlas whitelist');
      console.error('   4. Try using a local MongoDB instance instead:');
      console.error('      • Install MongoDB locally');
      console.error('      • Set MONGODB_URI=mongodb://localhost:27017/wmh_platform');
      console.error('      • Start MongoDB: mongod');
    }
    
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
};

// Run setup
setupDatabase();
