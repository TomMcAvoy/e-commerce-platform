import mongoose from 'mongoose';
import { config } from '../utils/config';

// Import your models here
// import User from '../models/User';
// import Product from '../models/Product';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Clearing existing data...');
      // await User.deleteMany({});
      // await Product.deleteMany({});
    }
    
    // Seed users
    console.log('👥 Seeding users...');
    // Add your user seeding logic here
    
    // Seed products
    console.log('📦 Seeding products...');
    // Add your product seeding logic here
    
    console.log('✅ Database seeding completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
