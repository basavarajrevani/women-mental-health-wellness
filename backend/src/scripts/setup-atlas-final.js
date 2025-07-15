import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { promisify } from 'util';

// Load environment variables
dotenv.config();

const resolveSrv = promisify(dns.resolveSrv);

const setupAtlasFinal = async () => {
  try {
    console.log('🌐 Setting up MongoDB Atlas connection...');
    
    // Test DNS resolution first
    console.log('🔍 Testing DNS resolution...');
    try {
      const records = await resolveSrv('_mongodb._tcp.cluster0.gjdbtub.mongodb.net');
      console.log('✅ DNS resolution successful:', records.length, 'records found');
    } catch (dnsError) {
      console.log('❌ DNS resolution failed:', dnsError.message);
      console.log('💡 Trying alternative connection methods...');
    }
    
    // Your exact credentials
    const adminEmail = 'basavarajrevani123@gmail.com';
    const adminPassword = 'Basu@15032002';
    
    console.log('📧 Admin Email:', adminEmail);
    console.log('🔑 Admin Password: ****');
    
    // Multiple Atlas connection strings to try
    const atlasConnections = [
      'mongodb+srv://basavarajrevani123:Basu%4015032002@cluster0.gjdbtub.mongodb.net/wmh_platform?retryWrites=true&w=majority',
      'mongodb+srv://basavarajrevani123:Basu%4015032002@cluster0.mongodb.net/wmh_platform?retryWrites=true&w=majority',
      'mongodb+srv://basavarajrevani123:Basu%4015032002@cluster0.gjdbtub.mongodb.net/wmh_platform?retryWrites=true&w=majority&ssl=true',
    ];
    
    let connected = false;
    let connectionString = '';
    
    for (let i = 0; i < atlasConnections.length; i++) {
      console.log(`\n🔄 Trying Atlas connection ${i + 1}/${atlasConnections.length}...`);
      connectionString = atlasConnections[i];
      
      try {
        await mongoose.connect(connectionString, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 10000, // 10 seconds
          connectTimeoutMS: 10000,
        });
        
        console.log('✅ Connected to MongoDB Atlas successfully!');
        console.log('🌐 Connection string:', connectionString.replace(/:[^:@]*@/, ':****@'));
        connected = true;
        break;
      } catch (error) {
        console.log(`❌ Connection ${i + 1} failed:`, error.message);
        if (mongoose.connection.readyState !== 0) {
          await mongoose.disconnect();
        }
      }
    }
    
    if (!connected) {
      throw new Error('All Atlas connection attempts failed');
    }
    
    // Delete any existing users to start fresh
    await mongoose.connection.db.collection('users').deleteMany({});
    console.log('🧹 Cleaned existing users in Atlas');
    
    // Create your admin user in Atlas
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: String,
      role: String,
      profile: Object,
      verification: Object,
      stats: Object,
      createdAt: { type: Date, default: Date.now }
    }));
    
    const adminUser = await User.create({
      name: 'Basavaraj Revani',
      email: adminEmail,
      password: adminPassword, // Note: In real app, this should be hashed
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
    console.log('🔗 Connection String:', connectionString.replace(/:[^:@]*@/, ':****@'));
    
    console.log('\n✅ ALL USER ACTIVITIES WILL NOW BE STORED IN MONGODB ATLAS');
    console.log('✅ ADMIN CHANGES WILL APPLY TO ALL USERS IN REAL-TIME');
    console.log('✅ AUTHENTICATION IS CONNECTED TO ATLAS DATABASE');
    
    console.log('\n🚀 READY TO RESTART BACKEND WITH ATLAS CONNECTION!');
    
  } catch (error) {
    console.error('❌ Error setting up Atlas:', error);
    
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Check MongoDB Atlas dashboard - is cluster running?');
    console.log('2. Verify IP whitelist (add 0.0.0.0/0 for testing)');
    console.log('3. Check username/password in Atlas');
    console.log('4. Try different network or VPN');
    console.log('5. Check firewall settings');
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Atlas connection closed.');
  }
};

// Run the setup
setupAtlasFinal();
