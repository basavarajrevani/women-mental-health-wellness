import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { promisify } from 'util';

// Load environment variables
dotenv.config();

const resolveSrv = promisify(dns.resolveSrv);
const lookup = promisify(dns.lookup);

const forceAtlasConnection = async () => {
  try {
    console.log('🌐 FORCING MongoDB Atlas Connection...');
    console.log('=====================================');
    
    // Test basic DNS resolution
    console.log('\n🔍 Testing DNS resolution...');
    try {
      const ip = await lookup('google.com');
      console.log('✅ Basic DNS working:', ip.address);
    } catch (error) {
      console.log('❌ Basic DNS failed:', error.message);
      throw new Error('No internet connection');
    }
    
    // Test MongoDB Atlas specific DNS
    console.log('\n🔍 Testing MongoDB Atlas DNS...');
    try {
      const records = await resolveSrv('_mongodb._tcp.cluster0.gjdbtub.mongodb.net');
      console.log('✅ Atlas DNS resolution successful:', records.length, 'records');
      records.forEach((record, i) => {
        console.log(`   ${i + 1}. ${record.name}:${record.port} (priority: ${record.priority})`);
      });
    } catch (dnsError) {
      console.log('❌ Atlas DNS failed:', dnsError.message);
      console.log('💡 Trying alternative connection methods...');
    }
    
    // Multiple Atlas connection strings to try
    const atlasConnections = [
      // Original format
      'mongodb+srv://basavarajrevani123:Basu%4015032002@cluster0.gjdbtub.mongodb.net/wmh_platform?retryWrites=true&w=majority&appName=Cluster0',
      
      // Without app name
      'mongodb+srv://basavarajrevani123:Basu%4015032002@cluster0.gjdbtub.mongodb.net/wmh_platform?retryWrites=true&w=majority',
      
      // With SSL explicit
      'mongodb+srv://basavarajrevani123:Basu%4015032002@cluster0.gjdbtub.mongodb.net/wmh_platform?retryWrites=true&w=majority&ssl=true',
      
      // Different cluster format
      'mongodb+srv://basavarajrevani123:Basu%4015032002@cluster0.mongodb.net/wmh_platform?retryWrites=true&w=majority',
      
      // With timeout settings
      'mongodb+srv://basavarajrevani123:Basu%4015032002@cluster0.gjdbtub.mongodb.net/wmh_platform?retryWrites=true&w=majority&serverSelectionTimeoutMS=30000&connectTimeoutMS=30000',
    ];
    
    let connected = false;
    let workingConnection = '';
    
    for (let i = 0; i < atlasConnections.length; i++) {
      console.log(`\n🔄 Attempting Atlas connection ${i + 1}/${atlasConnections.length}...`);
      const connectionString = atlasConnections[i];
      console.log('🔗 Connection string:', connectionString.replace(/:[^:@]*@/, ':****@'));
      
      try {
        // Close any existing connection
        if (mongoose.connection.readyState !== 0) {
          await mongoose.disconnect();
        }
        
        await mongoose.connect(connectionString, {
          serverSelectionTimeoutMS: 30000, // 30 seconds
          connectTimeoutMS: 30000,
          socketTimeoutMS: 30000,
          maxPoolSize: 10,
          minPoolSize: 1,
        });
        
        console.log('✅ CONNECTED TO MONGODB ATLAS SUCCESSFULLY!');
        console.log('🌐 Atlas cluster is reachable');
        workingConnection = connectionString;
        connected = true;
        break;
        
      } catch (error) {
        console.log(`❌ Connection ${i + 1} failed:`, error.message);
        
        if (error.message.includes('EREFUSED')) {
          console.log('   💡 DNS/Network issue detected');
        } else if (error.message.includes('authentication')) {
          console.log('   💡 Authentication issue - check username/password');
        } else if (error.message.includes('timeout')) {
          console.log('   💡 Timeout issue - network may be slow');
        }
      }
    }
    
    if (!connected) {
      console.log('\n❌ ALL ATLAS CONNECTION ATTEMPTS FAILED');
      console.log('\n🔧 TROUBLESHOOTING STEPS:');
      console.log('1. 🌐 Check MongoDB Atlas Dashboard:');
      console.log('   - Go to https://cloud.mongodb.com/');
      console.log('   - Verify cluster is running (not paused)');
      console.log('   - Check cluster region and name');
      
      console.log('\n2. 🔑 Verify Database Access:');
      console.log('   - Username: basavarajrevani123');
      console.log('   - Password: Basu@15032002');
      console.log('   - Permissions: readWrite to wmh_platform database');
      
      console.log('\n3. 🌐 Check Network Access:');
      console.log('   - Add IP: 0.0.0.0/0 (allow all IPs for testing)');
      console.log('   - Or add your current IP address');
      
      console.log('\n4. 🔧 Network Issues:');
      console.log('   - Try different network (mobile hotspot)');
      console.log('   - Disable VPN if using one');
      console.log('   - Check firewall settings');
      console.log('   - Contact ISP about MongoDB Atlas access');
      
      throw new Error('Cannot connect to MongoDB Atlas');
    }
    
    // Test database operations
    console.log('\n🧪 Testing database operations...');
    
    // Create a simple test collection
    const testCollection = mongoose.connection.db.collection('connection_test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Atlas connection successful' 
    });
    
    const testDoc = await testCollection.findOne({ test: true });
    console.log('✅ Database write/read test successful:', testDoc._id);
    
    // Clean up test
    await testCollection.deleteOne({ _id: testDoc._id });
    console.log('✅ Database cleanup successful');
    
    console.log('\n🎯 MONGODB ATLAS CONNECTION SUCCESSFUL!');
    console.log('🔗 Working connection:', workingConnection.replace(/:[^:@]*@/, ':****@'));
    console.log('🗄️ Database: wmh_platform');
    console.log('✅ Ready to create admin user in Atlas');
    
    return workingConnection;
    
  } catch (error) {
    console.error('\n❌ ATLAS CONNECTION FAILED:', error.message);
    throw error;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('\n🔌 Atlas connection closed');
    }
  }
};

// Run the connection test
forceAtlasConnection()
  .then((connection) => {
    console.log('\n🚀 SUCCESS! Use this connection string in .env:');
    console.log(connection.replace(/:[^:@]*@/, ':****@'));
  })
  .catch((error) => {
    console.log('\n💥 FAILED! Atlas connection not possible at this time.');
    process.exit(1);
  });
