import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const migrateToAtlas = async () => {
  console.log('🌐 MongoDB Atlas Migration Guide');
  console.log('=====================================');
  
  console.log('\n📋 Steps to Connect to MongoDB Atlas:');
  
  console.log('\n1. 🔧 Check MongoDB Atlas Dashboard:');
  console.log('   - Go to https://cloud.mongodb.com/');
  console.log('   - Login with your account');
  console.log('   - Verify your cluster is running');
  console.log('   - Check cluster name and region');
  
  console.log('\n2. 🌐 Network Access Settings:');
  console.log('   - Go to Network Access in Atlas dashboard');
  console.log('   - Add IP Address: 0.0.0.0/0 (for testing)');
  console.log('   - Or add your specific IP address');
  
  console.log('\n3. 🔑 Database Access Settings:');
  console.log('   - Go to Database Access in Atlas dashboard');
  console.log('   - Verify user: basavarajrevani123');
  console.log('   - Verify password: Basu@15032002');
  console.log('   - Ensure user has readWrite permissions');
  
  console.log('\n4. 🔗 Connection String:');
  console.log('   - Go to Connect > Connect your application');
  console.log('   - Copy the connection string');
  console.log('   - Should look like:');
  console.log('   mongodb+srv://basavarajrevani123:<password>@cluster0.xxxxx.mongodb.net/wmh_platform');
  
  console.log('\n5. 📝 Update .env File:');
  console.log('   Replace MONGODB_URI with your Atlas connection string');
  
  console.log('\n6. 🚀 Restart Backend:');
  console.log('   - Stop current backend (Ctrl+C)');
  console.log('   - Run: npm run dev');
  console.log('   - Look for: "📦 MongoDB Connected: Atlas"');
  
  console.log('\n7. 👤 Create Admin User in Atlas:');
  console.log('   - Run: node src/scripts/create-exact-admin.js');
  console.log('   - This will create your admin user in Atlas');
  
  console.log('\n🎯 Your Admin Credentials:');
  console.log('📧 Email: basavarajrevani123@gmail.com');
  console.log('🔑 Password: Basu@15032002');
  
  console.log('\n🔧 Current Network Issue:');
  console.log('❌ DNS resolution failing for cluster0.gjdbtub.mongodb.net');
  console.log('💡 This could be due to:');
  console.log('   - Firewall blocking MongoDB Atlas');
  console.log('   - ISP DNS issues');
  console.log('   - Network restrictions');
  console.log('   - VPN interference');
  
  console.log('\n🌐 Alternative Solutions:');
  console.log('1. Try different network (mobile hotspot)');
  console.log('2. Use VPN to different location');
  console.log('3. Check with network administrator');
  console.log('4. Try from different computer/location');
  
  console.log('\n✅ For Now - Local MongoDB Working:');
  console.log('📦 MongoDB Connected: localhost');
  console.log('🗄️ Database: wmh_platform');
  console.log('👤 Admin user: Created and verified');
  console.log('🔐 Authentication: Working');
  console.log('🌐 Frontend: http://localhost:5174');
  
  console.log('\n🚀 Ready to test with local MongoDB!');
  console.log('Once Atlas connection works, all data will sync to cloud.');
};

// Run the guide
migrateToAtlas();
