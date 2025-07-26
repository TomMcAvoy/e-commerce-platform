import mongoose from 'mongoose';
import User from '../models/User';
import { config } from './config';

const seedUsers = async (): Promise<void> => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create admin user
    await User.create({
      name: 'Admin User',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@ecommerce.com',
      password: 'password123',
      role: 'admin', // Use string value directly
      isEmailVerified: true
    });

    // Create vendor user
    await User.create({
      name: 'Vendor User',
      firstName: 'Vendor',
      lastName: 'User',
      email: 'vendor@ecommerce.com',
      password: 'password123',
      role: 'vendor', // Use string value directly
      isEmailVerified: true
    });

    // Create customer user
    await User.create({
      name: 'Customer User',
      firstName: 'Customer',
      lastName: 'User',
      email: 'customer@ecommerce.com',
      password: 'password123',
      role: 'user', // Use string value directly
      isEmailVerified: true
    });

    console.log('✅ Users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

const connectAndSeed = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB for seeding');
    
    await seedUsers();
    
    await mongoose.disconnect();
    console.log('✅ Seeding completed and disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  connectAndSeed();
}

export { seedUsers, connectAndSeed };
