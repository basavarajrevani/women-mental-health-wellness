import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';
import CommunityPost from '../models/CommunityPost.js';
import SupportGroup from '../models/SupportGroup.js';
import Event from '../models/Event.js';
import Resource from '../models/Resource.js';
import Partner from '../models/Partner.js';
import AdminLog from '../models/AdminLog.js';
import SystemSettings from '../models/SystemSettings.js';
import Notification from '../models/Notification.js';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      CommunityPost.deleteMany({}),
      SupportGroup.deleteMany({}),
      Event.deleteMany({}),
      Resource.deleteMany({}),
      Partner.deleteMany({}),
      AdminLog.deleteMany({}),
      SystemSettings.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@wmh-platform.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      profile: {
        avatar: '👩‍💼',
        bio: 'Platform administrator and mental health advocate',
        personalInfo: {
          firstName: 'Admin',
          lastName: 'User',
          gender: 'prefer-not-to-say',
          phoneNumber: '+1-555-0100',
        },
        location: {
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          timezone: 'America/Los_Angeles',
        },
        demographics: {
          languages: ['English'],
          education: 'masters',
          occupation: 'Platform Administrator',
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
                communityUpdates: true,
                systemUpdates: true,
                marketingEmails: false,
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

    // Create sample users
    console.log('👥 Creating sample users...');
    const sampleUsers = await User.create([
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        profile: {
          avatar: '👩',
          bio: 'Mental health advocate and mother of two. Sharing my journey with postpartum depression and anxiety.',
          personalInfo: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            dateOfBirth: new Date('1991-05-15'),
            age: 32,
            gender: 'female',
            pronouns: 'she/her',
            phoneNumber: '+1-555-0101',
          },
          location: {
            city: 'New York',
            state: 'NY',
            country: 'USA',
            timezone: 'America/New_York',
          },
          demographics: {
            ethnicity: ['Caucasian'],
            languages: ['English', 'Spanish'],
            education: 'bachelors',
            occupation: 'Marketing Manager',
            relationshipStatus: 'married',
            hasChildren: true,
            numberOfChildren: 2,
          },
          mentalHealth: {
            conditions: [{
              name: 'postpartum-depression',
              diagnosedBy: 'Dr. Smith',
              diagnosedDate: new Date('2022-03-15'),
              severity: 'moderate',
              currentlyTreated: true,
            }],
            goals: [{
              title: 'Daily Mindfulness Practice',
              description: 'Practice mindfulness meditation for 10 minutes daily',
              category: 'self-care',
              targetDate: new Date('2024-12-31'),
              priority: 'high',
              status: 'in-progress',
              progress: 65,
            }],
            triggers: ['work stress', 'lack of sleep', 'social media'],
            copingStrategies: ['deep breathing', 'journaling', 'walking'],
          },
          preferences: {
            privacy: {
              profileVisibility: 'members-only',
              showRealName: true,
              allowDirectMessages: true,
            },
            notifications: {
              email: {
                enabled: true,
                frequency: 'daily',
                types: {
                  communityUpdates: true,
                  eventReminders: true,
                  groupMessages: true,
                },
              },
            },
          },
        },
        verification: { isEmailVerified: true },
        stats: {
          postsCount: 5,
          commentsCount: 12,
          likesReceived: 23,
          joinedGroupsCount: 2,
          streakDays: 7,
          lastActiveDate: new Date(),
        },
      },
      {
        name: 'Emily Chen',
        email: 'emily@example.com',
        password: 'password123',
        profile: {
          avatar: '👩‍🎓',
          bio: 'Psychology student passionate about wellness and mental health research.',
          personalInfo: {
            firstName: 'Emily',
            lastName: 'Chen',
            dateOfBirth: new Date('1999-08-22'),
            age: 24,
            gender: 'female',
            pronouns: 'she/her',
            phoneNumber: '+1-555-0102',
          },
          location: {
            city: 'Los Angeles',
            state: 'CA',
            country: 'USA',
            timezone: 'America/Los_Angeles',
          },
          demographics: {
            ethnicity: ['Asian'],
            languages: ['English', 'Mandarin'],
            education: 'some-college',
            occupation: 'Student',
            relationshipStatus: 'single',
            hasChildren: false,
          },
          mentalHealth: {
            conditions: [{
              name: 'anxiety',
              diagnosedBy: 'Campus Counselor',
              diagnosedDate: new Date('2023-01-10'),
              severity: 'mild',
              currentlyTreated: true,
            }],
            goals: [{
              title: 'Reduce Social Anxiety',
              description: 'Feel more comfortable in social situations and group settings',
              category: 'social',
              targetDate: new Date('2024-06-30'),
              priority: 'high',
              status: 'in-progress',
              progress: 40,
            }],
            triggers: ['public speaking', 'large crowds', 'academic pressure'],
            copingStrategies: ['breathing exercises', 'positive self-talk', 'grounding techniques'],
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
                frequency: 'weekly',
                types: {
                  communityUpdates: true,
                  eventReminders: true,
                },
              },
            },
          },
        },
        verification: { isEmailVerified: true },
        stats: {
          postsCount: 3,
          commentsCount: 8,
          likesReceived: 15,
          joinedGroupsCount: 1,
          streakDays: 3,
          lastActiveDate: new Date(),
        },
      },
      {
        name: 'Dr. Maria Rodriguez',
        email: 'maria@example.com',
        password: 'password123',
        role: 'moderator',
        profile: {
          avatar: '👩‍⚕️',
          bio: 'Licensed therapist specializing in anxiety and depression. Here to support and guide our community.',
          personalInfo: {
            firstName: 'Maria',
            lastName: 'Rodriguez',
            dateOfBirth: new Date('1978-11-03'),
            age: 45,
            gender: 'female',
            pronouns: 'she/her',
            phoneNumber: '+1-555-0103',
            alternateEmail: 'dr.rodriguez@therapy.com',
          },
          location: {
            city: 'Chicago',
            state: 'IL',
            country: 'USA',
            timezone: 'America/Chicago',
          },
          demographics: {
            ethnicity: ['Hispanic'],
            languages: ['English', 'Spanish'],
            education: 'doctorate',
            occupation: 'Licensed Clinical Therapist',
            relationshipStatus: 'married',
            hasChildren: true,
            numberOfChildren: 1,
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
                  communityUpdates: true,
                  eventReminders: true,
                  groupMessages: true,
                  systemUpdates: true,
                },
              },
            },
          },
        },
        verification: { isEmailVerified: true },
        stats: {
          postsCount: 8,
          commentsCount: 25,
          likesReceived: 45,
          joinedGroupsCount: 3,
          streakDays: 15,
          lastActiveDate: new Date(),
        },
      },
    ]);

    // Create sample community posts
    console.log('📝 Creating sample community posts...');
    await CommunityPost.create([
      {
        content: 'Just wanted to share that I completed my first week of meditation practice! It\'s been challenging but I\'m already feeling more centered. Anyone else trying mindfulness?',
        author: sampleUsers[0]._id,
        category: 'achievement',
        tags: ['meditation', 'mindfulness', 'self-care'],
        likes: [sampleUsers[1]._id, sampleUsers[2]._id],
        comments: [
          {
            content: 'That\'s amazing! I\'ve been wanting to start meditation too. Any tips for beginners?',
            author: sampleUsers[1]._id,
          },
        ],
      },
      {
        content: 'Having a tough day with anxiety. The breathing exercises from our last support group session are really helping though. Grateful for this community.',
        author: sampleUsers[1]._id,
        category: 'support',
        tags: ['anxiety', 'breathing', 'support'],
        likes: [sampleUsers[0]._id],
      },
    ]);

    // Create sample support groups
    console.log('👥 Creating sample support groups...');
    await SupportGroup.create([
      {
        name: 'Anxiety Support Circle',
        description: 'A safe space for women dealing with anxiety to share experiences and coping strategies.',
        category: 'anxiety',
        facilitator: {
          user: sampleUsers[2]._id,
          name: 'Dr. Maria Rodriguez',
          credentials: 'Licensed Clinical Social Worker',
        },
        meetingType: 'online',
        meetingSchedule: 'Every Tuesday at 7:00 PM EST',
        duration: 60,
        startDate: new Date(),
        maxMembers: 12,
        currentMembers: 3,
        members: [
          { user: sampleUsers[0]._id },
          { user: sampleUsers[1]._id },
        ],
        createdBy: adminUser._id,
      },
      {
        name: 'New Mothers Support Group',
        description: 'Support for new mothers navigating postpartum challenges and mental health.',
        category: 'postpartum',
        facilitator: {
          user: sampleUsers[2]._id,
          name: 'Dr. Maria Rodriguez',
          credentials: 'Licensed Clinical Social Worker',
        },
        meetingType: 'hybrid',
        meetingSchedule: 'Every Saturday at 10:00 AM EST',
        duration: 90,
        startDate: new Date(),
        maxMembers: 8,
        currentMembers: 1,
        members: [
          { user: sampleUsers[0]._id },
        ],
        createdBy: adminUser._id,
      },
    ]);

    // Create sample events
    console.log('📅 Creating sample events...');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    
    await Event.create([
      {
        title: 'Mindfulness and Stress Reduction Workshop',
        description: 'Learn practical mindfulness techniques to manage stress and improve mental well-being.',
        category: 'workshop',
        organizer: {
          user: sampleUsers[2]._id,
          name: 'Dr. Maria Rodriguez',
          organization: 'Wellness Center',
        },
        type: 'online',
        startDate: futureDate,
        endDate: new Date(futureDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
        startTime: '14:00',
        endTime: '16:00',
        timezone: 'EST',
        pricing: { isFree: true },
        capacity: { maxAttendees: 50 },
        status: 'published',
        createdBy: adminUser._id,
      },
    ]);

    // Create sample resources
    console.log('📚 Creating sample resources...');
    await Resource.create([
      {
        title: 'National Suicide Prevention Lifeline',
        description: '24/7 free and confidential support for people in distress, prevention and crisis resources.',
        category: 'hotline',
        type: 'crisis',
        content: {
          url: 'https://suicidepreventionlifeline.org',
        },
        contact: {
          phone: '988',
        },
        targetAudience: {
          conditions: ['depression', 'anxiety', 'general'],
          demographics: ['all'],
        },
        accessibility: {
          languages: ['English', 'Spanish'],
          isScreenReaderFriendly: true,
        },
        availability: {
          isAvailable24_7: true,
        },
        verification: {
          isVerified: true,
          verifiedBy: adminUser._id,
          verificationDate: new Date(),
        },
        createdBy: adminUser._id,
      },
      {
        title: 'Headspace: Meditation and Sleep',
        description: 'Guided meditation app with specific programs for anxiety, sleep, and stress management.',
        category: 'app',
        type: 'self-help',
        content: {
          url: 'https://headspace.com',
        },
        cost: {
          isFree: false,
          price: 12.99,
          priceRange: '$12.99/month or $69.99/year',
        },
        targetAudience: {
          conditions: ['anxiety', 'stress', 'general'],
          demographics: ['all'],
        },
        ratings: {
          averageRating: 4.5,
          totalRatings: 1,
          reviews: [
            {
              user: sampleUsers[0]._id,
              rating: 5,
              comment: 'Great app for beginners! The guided meditations are very helpful.',
            },
          ],
        },
        createdBy: adminUser._id,
      },
    ]);

    // Create sample partners
    console.log('🤝 Creating sample partners...');
    await Partner.create([
      {
        name: 'Mental Health America',
        description: 'Leading community-based nonprofit dedicated to addressing the needs of those living with mental illness.',
        type: 'mental-health-organization',
        website: 'https://mhanational.org',
        specialties: ['anxiety', 'depression', 'general', 'advocacy'],
        demographics: ['all'],
        services: [
          {
            name: 'Mental Health Screening',
            description: 'Free, anonymous mental health screening tools',
            cost: 'Free',
          },
        ],
        verificationStatus: {
          isVerified: true,
          verifiedBy: adminUser._id,
          verificationDate: new Date(),
        },
        createdBy: adminUser._id,
      },
    ]);

    // Initialize system settings
    console.log('⚙️ Initializing system settings...');
    await SystemSettings.create({
      platform: {
        name: "Women's Mental Health & Wellness Platform",
        version: '1.0.0',
        description: 'A comprehensive platform supporting women\'s mental health and wellness through community, resources, and professional support.',
        primaryColor: '#8B5CF6',
        secondaryColor: '#EC4899',
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
          lockoutDuration: 15 * 60 * 1000,
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
            flagKeywords: ['spam', 'inappropriate', 'harmful'],
          },
        },
        reporting: {
          enabled: true,
          autoActions: {
            hideAfterReports: 3,
            deleteAfterReports: 10,
          },
        },
      },
      features: {
        community: { enabled: true },
        supportGroups: { enabled: true },
        events: { enabled: true },
        resources: { enabled: true },
        moodTracking: { enabled: true },
      },
      lastUpdatedBy: adminUser._id,
    });

    // Create initial admin log entries
    console.log('📝 Creating initial admin logs...');
    await AdminLog.create([
      {
        admin: adminUser._id,
        action: 'system_settings_changed',
        target: {
          model: 'System',
          name: 'Initial System Setup',
        },
        details: {
          description: 'Initial system configuration during database seeding',
          notes: 'Automated setup during platform initialization',
        },
        category: 'system_admin',
        severity: 'medium',
        tags: ['initialization', 'setup'],
      },
      {
        admin: adminUser._id,
        action: 'user_created',
        target: {
          model: 'User',
          id: adminUser._id,
          name: adminUser.name,
        },
        details: {
          description: 'Created admin user account during system initialization',
          notes: 'Initial admin account setup',
        },
        category: 'user_management',
        severity: 'high',
        affectedUsers: [adminUser._id],
        tags: ['admin', 'initialization'],
      },
    ]);

    // Create welcome notifications for sample users
    console.log('🔔 Creating welcome notifications...');
    const welcomeNotifications = sampleUsers.map(user => ({
      recipient: user._id,
      type: 'system',
      title: 'Welcome to the Platform!',
      message: 'Welcome to our Women\'s Mental Health & Wellness Platform. We\'re here to support you on your journey.',
      priority: 'normal',
      isRead: false,
    }));
    await Notification.insertMany(welcomeNotifications);

    console.log('✅ Database seeding completed successfully!');
    console.log(`👤 Admin user created: ${adminUser.email}`);
    console.log(`👥 Sample users created: ${sampleUsers.length}`);
    console.log(`📊 System settings initialized`);
    console.log(`📝 Admin logs created`);
    console.log(`🔔 Welcome notifications sent`);
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log(`   Admin: ${adminUser.email} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log(`   User: sarah@example.com / password123`);
    console.log(`   User: emily@example.com / password123`);
    console.log(`   Moderator: maria@example.com / password123`);
    console.log('');
    console.log('🌐 Access URLs:');
    console.log(`   Frontend: http://localhost:5173`);
    console.log(`   Backend API: http://localhost:5000/api/v1`);
    console.log(`   Health Check: http://localhost:5000/health`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData();
}

export default seedData;
