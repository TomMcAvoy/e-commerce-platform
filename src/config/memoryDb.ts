import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import colors from 'colors';

let mongoServer: MongoMemoryServer;

export const connectMemoryDB = async () => {
  try {
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'shoppingcart_memory',
        port: 27018, // Use different port from main MongoDB
      },
    });

    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(colors.green.bold('✅ In-Memory MongoDB Connected'));
    console.log(colors.cyan(`📍 Memory DB URI: ${mongoUri}`));
    
    return mongoUri;
  } catch (error: any) {
    console.error(colors.red(`❌ Memory DB Connection Error: ${error.message}`));
    throw error;
  }
};

export const disconnectMemoryDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log(colors.yellow('🔌 Memory DB Disconnected'));
  } catch (error: any) {
    console.error(colors.red(`❌ Memory DB Disconnect Error: ${error.message}`));
  }
};

export const clearMemoryDB = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    console.log(colors.blue('🧹 Memory DB Cleared'));
  } catch (error: any) {
    console.error(colors.red(`❌ Memory DB Clear Error: ${error.message}`));
  }
};