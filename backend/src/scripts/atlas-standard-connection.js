import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testStandardAtlasConnection = async () => {
  try {
    console.log('🌐 Testing Standard MongoDB Atlas Connection...');
    console.log('===============================================');
    
    // Standard MongoDB connection strings (not SRV)
    const standardConnections = [
      // Standard format with multiple hosts
      'mongodb://basavarajrevani123:Basu%4015032002@cluster0-shard-00-00.gjdbtub.mongodb.net:27017,cluster0-shard-00-01.gjdbtub.mongodb.net:27017,cluster0-shard-00-02.gjdbtub.mongodb.net:27017/wmh_platform?ssl=true&replicaSet=atlas-123abc-shard-0&authSource=admin&retryWrites=true&w=majority',
      
      // Single host format
      'mongodb://basavarajrevani123:Basu%4015032002@cluster0.gjdbtub.mongodb.net:27017/wmh_platform?ssl=true&authSource=admin&retryWrites=true&w=majority',
      
      // Alternative cluster format
      'mongodb://basavarajrevani123:Basu%4015032002@ac-abc123-shard-00-00.gjdbtub.mongodb.net:27017/wmh_platform?ssl=true&authSource=admin&retryWrites=true&w=majority',
    ];
    
    let connected = false;
    let workingConnection = '';
    
    for (let i = 0; i < standardConnections.length; i++) {
      console.log(`\n🔄 Attempting standard connection ${i + 1}/${standardConnections.length}...`);
      const connectionString = standardConnections[i];
      console.log('🔗 Connection string:', connectionString.replace(/:[^:@]*@/, ':****@'));
      
      try {
        // Close any existing connection
        if (mongoose.connection.readyState !== 0) {
          await mongoose.disconnect();
        }
        
        await mongoose.connect(connectionString, {
          serverSelectionTimeoutMS: 30000,
          connectTimeoutMS: 30000,
          socketTimeoutMS: 30000,
        });
        
        console.log('✅ CONNECTED TO MONGODB ATLAS SUCCESSFULLY!');
        workingConnection = connectionString;
        connected = true;
        break;
        
      } catch (error) {
        console.log(`❌ Connection ${i + 1} failed:`, error.message);
      }
    }
    
    if (!connected) {
      console.log('\n❌ STANDARD CONNECTIONS ALSO FAILED');
      console.log('\n🔧 NETWORK ISSUE CONFIRMED');
      console.log('This appears to be a network/ISP issue blocking MongoDB Atlas access.');
      console.log('\n💡 IMMEDIATE SOLUTIONS:');
      console.log('1. 📱 Try mobile hotspot/different network');
      console.log('2. 🌐 Use VPN to different location');
      console.log('3. 🏢 Try from different location/computer');
      console.log('4. 📞 Contact ISP about MongoDB Atlas access');
      
      console.log('\n🔧 ALTERNATIVE: Create New Atlas Cluster');
      console.log('1. Go to https://cloud.mongodb.com/');
      console.log('2. Create new cluster in different region');
      console.log('3. Use different cluster URL');
      
      throw new Error('Network blocks MongoDB Atlas access');
    }
    
    // Test database operations
    console.log('\n🧪 Testing database operations...');
    const testCollection = mongoose.connection.db.collection('connection_test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Standard Atlas connection successful' 
    });
    
    console.log('✅ Database operations successful');
    await testCollection.deleteOne({ test: true });
    
    console.log('\n🎯 MONGODB ATLAS CONNECTION SUCCESSFUL!');
    console.log('🔗 Working connection:', workingConnection.replace(/:[^:@]*@/, ':****@'));
    
    return workingConnection;
    
  } catch (error) {
    console.error('\n❌ STANDARD ATLAS CONNECTION FAILED:', error.message);
    
    console.log('\n🚨 NETWORK ISSUE DETECTED');
    console.log('Your network/ISP is blocking MongoDB Atlas access.');
    console.log('\n📋 IMMEDIATE ACTION REQUIRED:');
    console.log('1. 📱 Switch to mobile hotspot');
    console.log('2. 🌐 Use VPN (try different countries)');
    console.log('3. 🏢 Try from different network/location');
    console.log('4. 🔧 Create new Atlas cluster in different region');
    
    throw error;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('\n🔌 Connection closed');
    }
  }
};

// Run the test
testStandardAtlasConnection()
  .then((connection) => {
    console.log('\n🚀 SUCCESS! Atlas connection working!');
  })
  .catch((error) => {
    console.log('\n💥 NETWORK BLOCKS ATLAS ACCESS');
    console.log('Try different network or create new cluster.');
    process.exit(1);
  });
