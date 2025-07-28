/**
 * Simple script to check if MongoDB is running
 * This can be run directly from VS Code without using the terminal
 */

const { MongoClient } = require('mongodb');

// Connection URI (using 127.0.0.1 instead of localhost to avoid IPv6 issues)
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shoppingcart';

async function checkMongoDBConnection() {
  console.log(`Attempting to connect to MongoDB at: ${uri}`);
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  });

  try {
    // Connect to the MongoDB server
    await client.connect();
    
    // Ping the database
    await client.db().admin().ping();
    
    console.log('✅ MongoDB connection successful!');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('\nPlease make sure MongoDB is running and accessible.');
    console.error('You can start MongoDB using:');
    console.error('  - macOS: brew services start mongodb-community');
    console.error('  - Linux: sudo systemctl start mongod');
    console.error('  - Windows: Start MongoDB service from Services');
    return false;
  } finally {
    // Close the connection
    await client.close();
  }
}

// Run the check
checkMongoDBConnection()
  .then(isConnected => {
    if (isConnected) {
      process.exit(0); // Success
    } else {
      process.exit(1); // Failure
    }
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });