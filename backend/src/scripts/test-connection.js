import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    console.log('🧪 Testing MongoDB Connection...');
    console.log('================================');
    
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log(`📍 Connection URI: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`);
    console.log('🔄 Attempting connection...');
    
    const startTime = Date.now();
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000, // 15 seconds for testing
      socketTimeoutMS: 45000,
      maxPoolSize: 5,
    });
    
    const connectionTime = Date.now() - startTime;
    
    console.log('✅ Connection Successful!');
    console.log(`⏱️  Connection time: ${connectionTime}ms`);
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Ready State: ${conn.connection.readyState}`);
    console.log(`📡 Port: ${conn.connection.port || 'Default'}`);
    
    // Test basic operations
    console.log('\n🧪 Testing Basic Operations...');
    
    // Test collection creation
    const testCollection = conn.connection.db.collection('connection_test');
    
    // Insert test document
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Connection test successful'
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log(`✅ Insert test: ${insertResult.acknowledged ? 'SUCCESS' : 'FAILED'}`);
    
    // Read test document
    const findResult = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log(`✅ Read test: ${findResult ? 'SUCCESS' : 'FAILED'}`);
    
    // Update test document
    const updateResult = await testCollection.updateOne(
      { _id: insertResult.insertedId },
      { $set: { updated: true } }
    );
    console.log(`✅ Update test: ${updateResult.modifiedCount > 0 ? 'SUCCESS' : 'FAILED'}`);
    
    // Delete test document
    const deleteResult = await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log(`✅ Delete test: ${deleteResult.deletedCount > 0 ? 'SUCCESS' : 'FAILED'}`);
    
    // Test indexes
    console.log('\n📊 Testing Index Operations...');
    const indexResult = await testCollection.createIndex({ test: 1 });
    console.log(`✅ Index creation: ${indexResult ? 'SUCCESS' : 'FAILED'}`);
    
    // List collections
    console.log('\n📋 Existing Collections:');
    const collections = await conn.connection.db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`   📁 ${col.name}`);
    });
    
    // Database stats
    console.log('\n📈 Database Statistics:');
    try {
      const stats = await conn.connection.db.stats();
      console.log(`   📊 Collections: ${stats.collections}`);
      console.log(`   📄 Documents: ${stats.objects}`);
      console.log(`   💾 Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   🗃️  Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   📇 Indexes: ${stats.indexes}`);
      console.log(`   🔍 Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
    } catch (error) {
      console.log(`   ⚠️  Could not retrieve stats: ${error.message}`);
    }
    
    // Connection info
    console.log('\n🔗 Connection Details:');
    console.log(`   🌐 MongoDB Version: ${conn.connection.db.serverConfig?.s?.serverDescription?.version || 'Unknown'}`);
    console.log(`   🏷️  Connection Name: ${conn.connection.name}`);
    console.log(`   🔢 Connection ID: ${conn.connection.id}`);
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ Your MongoDB Atlas connection is working perfectly.');
    
  } catch (error) {
    console.error('\n❌ Connection Test Failed!');
    console.error('================================');
    console.error(`Error: ${error.message}`);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.error('\n🔍 DNS/Network Issue Detected:');
      console.error('   • Check your internet connection');
      console.error('   • Verify the MongoDB Atlas cluster URL');
      console.error('   • Try using a different network or VPN');
      console.error('   • Check if your ISP blocks MongoDB Atlas');
    }
    
    if (error.message.includes('authentication failed')) {
      console.error('\n🔐 Authentication Issue Detected:');
      console.error('   • Verify username and password in connection string');
      console.error('   • Check database user permissions in MongoDB Atlas');
      console.error('   • Ensure the user has read/write access');
    }
    
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('\n🛡️  IP Whitelist Issue Detected:');
      console.error('   • Add your IP address to MongoDB Atlas whitelist');
      console.error('   • Or allow access from anywhere (0.0.0.0/0) for testing');
    }
    
    if (error.message.includes('timeout')) {
      console.error('\n⏱️  Timeout Issue Detected:');
      console.error('   • Check your internet connection speed');
      console.error('   • Try increasing timeout values');
      console.error('   • Check for firewall restrictions');
    }
    
    console.error('\n💡 Quick Fixes:');
    console.error('   1. Go to MongoDB Atlas Dashboard');
    console.error('   2. Navigate to Network Access');
    console.error('   3. Add your current IP address');
    console.error('   4. Or add 0.0.0.0/0 to allow all IPs (for testing only)');
    console.error('   5. Ensure your cluster is running (not paused)');
    
    process.exit(1);
  } finally {
    try {
      await mongoose.connection.close();
      console.log('\n🔌 Connection closed.');
    } catch (error) {
      console.error('Error closing connection:', error.message);
    }
  }
};

// Run the test
testConnection();
