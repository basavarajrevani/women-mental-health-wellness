import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';
import CommunityPost from '../models/CommunityPost.js';
import SupportGroup from '../models/SupportGroup.js';
import Event from '../models/Event.js';
import Resource from '../models/Resource.js';
import Partner from '../models/Partner.js';

// Load environment variables
dotenv.config();

// Migration script to convert localStorage data to MongoDB
const migrateFromLocalStorage = async () => {
  try {
    console.log('🔄 Starting data migration from localStorage to MongoDB...');
    
    // Connect to database
    await connectDB();

    // This would typically read from a JSON file exported from localStorage
    // For now, we'll create a sample migration structure
    
    console.log('📊 Migration completed successfully!');
    console.log('Note: This is a template migration script.');
    console.log('To migrate real data:');
    console.log('1. Export localStorage data from the frontend');
    console.log('2. Save it as a JSON file');
    console.log('3. Update this script to read and process that data');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
};

// Sample function to migrate user data
const migrateUsers = async (localStorageUsers) => {
  console.log('👥 Migrating users...');
  
  for (const userData of localStorageUsers) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        await User.create({
          name: userData.name,
          email: userData.email,
          password: userData.password || 'tempPassword123', // Set temporary password
          role: userData.role || 'user',
          profile: userData.profile || {},
          stats: userData.stats || {},
          verification: {
            isEmailVerified: true, // Assume existing users are verified
          },
        });
        console.log(`✅ Migrated user: ${userData.email}`);
      } else {
        console.log(`⚠️  User already exists: ${userData.email}`);
      }
    } catch (error) {
      console.error(`❌ Error migrating user ${userData.email}:`, error.message);
    }
  }
};

// Sample function to migrate community posts
const migrateCommunityPosts = async (localStoragePosts, userMapping) => {
  console.log('📝 Migrating community posts...');
  
  for (const postData of localStoragePosts) {
    try {
      // Find the author in the new system
      const authorId = userMapping[postData.userId] || userMapping[postData.author];
      
      if (!authorId) {
        console.log(`⚠️  Skipping post - author not found: ${postData.userId || postData.author}`);
        continue;
      }

      await CommunityPost.create({
        content: postData.content,
        title: postData.title,
        author: authorId,
        category: postData.category || 'general',
        tags: postData.tags || [],
        isAnonymous: postData.isAnonymous || false,
        likes: [], // Reset likes - will need to be remapped
        comments: [], // Reset comments - will need to be remapped
        createdAt: postData.createdAt ? new Date(postData.createdAt) : new Date(),
        status: 'published',
      });
      
      console.log(`✅ Migrated post: ${postData.content.substring(0, 50)}...`);
    } catch (error) {
      console.error(`❌ Error migrating post:`, error.message);
    }
  }
};

// Sample function to migrate support groups
const migrateSupportGroups = async (localStorageGroups, userMapping) => {
  console.log('👥 Migrating support groups...');
  
  for (const groupData of localStorageGroups) {
    try {
      // Find the facilitator in the new system
      const facilitatorId = userMapping[groupData.facilitator] || userMapping[groupData.createdBy];
      
      if (!facilitatorId) {
        console.log(`⚠️  Skipping group - facilitator not found: ${groupData.facilitator}`);
        continue;
      }

      await SupportGroup.create({
        name: groupData.name,
        description: groupData.description,
        category: groupData.category || 'general',
        facilitator: {
          user: facilitatorId,
          name: groupData.facilitatorName || 'Facilitator',
        },
        meetingType: groupData.meetingType || 'online',
        meetingSchedule: groupData.meetingSchedule || 'TBD',
        duration: groupData.duration || 60,
        startDate: groupData.startDate ? new Date(groupData.startDate) : new Date(),
        maxMembers: groupData.maxMembers || 20,
        currentMembers: groupData.currentMembers || 0,
        isPublic: groupData.isPublic !== false,
        isActive: groupData.isActive !== false,
        createdBy: facilitatorId,
        createdAt: groupData.createdAt ? new Date(groupData.createdAt) : new Date(),
      });
      
      console.log(`✅ Migrated support group: ${groupData.name}`);
    } catch (error) {
      console.error(`❌ Error migrating support group ${groupData.name}:`, error.message);
    }
  }
};

// Sample function to migrate events
const migrateEvents = async (localStorageEvents, userMapping) => {
  console.log('📅 Migrating events...');
  
  for (const eventData of localStorageEvents) {
    try {
      // Find the organizer in the new system
      const organizerId = userMapping[eventData.organizer] || userMapping[eventData.createdBy];
      
      if (!organizerId) {
        console.log(`⚠️  Skipping event - organizer not found: ${eventData.organizer}`);
        continue;
      }

      await Event.create({
        title: eventData.title,
        description: eventData.description,
        category: eventData.category || 'other',
        organizer: {
          user: organizerId,
          name: eventData.organizerName || 'Organizer',
        },
        type: eventData.type || 'online',
        startDate: eventData.startDate ? new Date(eventData.startDate) : new Date(),
        endDate: eventData.endDate ? new Date(eventData.endDate) : new Date(),
        startTime: eventData.startTime || '12:00',
        endTime: eventData.endTime || '13:00',
        timezone: eventData.timezone || 'UTC',
        pricing: {
          isFree: eventData.isFree !== false,
          price: eventData.price || 0,
        },
        isPublic: eventData.isPublic !== false,
        isActive: eventData.isActive !== false,
        status: 'published',
        createdBy: organizerId,
        createdAt: eventData.createdAt ? new Date(eventData.createdAt) : new Date(),
      });
      
      console.log(`✅ Migrated event: ${eventData.title}`);
    } catch (error) {
      console.error(`❌ Error migrating event ${eventData.title}:`, error.message);
    }
  }
};

// Helper function to create user mapping
const createUserMapping = async (localStorageUsers) => {
  const mapping = {};
  
  for (const userData of localStorageUsers) {
    const user = await User.findOne({ email: userData.email });
    if (user) {
      mapping[userData.id || userData.email] = user._id;
    }
  }
  
  return mapping;
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateFromLocalStorage();
}

export { 
  migrateFromLocalStorage,
  migrateUsers,
  migrateCommunityPosts,
  migrateSupportGroups,
  migrateEvents,
  createUserMapping
};
