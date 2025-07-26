import mongoose from 'mongoose';

/**
 * Database connection following Database Patterns from Copilot Instructions
 * Uses environment variables for configuration with connection pooling
 */

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI environment variable is not defined');
      process.exit(1);
    }

    // Connection options following Database Patterns for performance
    // Updated for latest MongoDB driver compatibility
    const options = {
      // Connection pooling for performance
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      
      // Indexes and performance optimization
      autoIndex: process.env.NODE_ENV === 'development', // Only auto-create indexes in dev
    };

    // Connect to MongoDB following Environment & Configuration patterns
    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);

    // Connection event handlers for Debugging & Testing Ecosystem
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown following Server Management patterns
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('📴 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    // Enhanced error handling following Error Handling Pattern
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.error('💡 Tip: Make sure MongoDB is running locally or check your MONGODB_URI');
        console.error('   • Local: brew services start mongodb-community');
        console.error('   • Docker: docker run -d -p 27017:27017 mongo');
      } else if (error.message.includes('authentication')) {
        console.error('💡 Tip: Check your MongoDB username/password in MONGODB_URI');
      } else if (error.message.includes('network')) {
        console.error('💡 Tip: Check your network connection and MongoDB Atlas settings');
      } else if (error.message.includes('option') && error.message.includes('not supported')) {
        console.error('💡 Tip: MongoDB driver option compatibility issue - check connection options');
      }
    }
    
    // Don't exit in development to allow for hot reload fixes
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('🔄 Continuing in development mode - fix database connection when ready');
    }
  }
};

export default connectDB;
