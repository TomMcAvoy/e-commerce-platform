import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Category from '../models/Category';
import { UserRole } from '../types';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shoppingcart';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@shopcart.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isEmailVerified: true
    });

    // Create sample vendor
    const vendorUser = await User.create({
      email: 'vendor@shopcart.com',
      password: 'vendor123',
      firstName: 'John',
      lastName: 'Vendor',
      role: UserRole.VENDOR,
      isEmailVerified: true
    });

    // Create sample customer
    const customerUser = await User.create({
      email: 'customer@shopcart.com',
      password: 'customer123',
      firstName: 'Jane',
      lastName: 'Customer',
      role: UserRole.CUSTOMER,
      isEmailVerified: true
    });

    console.log('👥 Created sample users:');
    console.log(`   Admin: ${adminUser.email}`);
    console.log(`   Vendor: ${vendorUser.email}`);
    console.log(`   Customer: ${customerUser.email}`);

    // Create categories
    const fashionCategory = await Category.create({
      name: 'Fashion & Apparel',
      slug: 'fashion-apparel',
      description: 'Latest trends in clothing and accessories',
      isActive: true,
      sortOrder: 1
    });

    const beautyCategory = await Category.create({
      name: 'Beauty & Makeup',
      slug: 'beauty-makeup',
      description: 'Premium cosmetics and skincare products',
      isActive: true,
      sortOrder: 2
    });

    const electronicsCategory = await Category.create({
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest gadgets and tech accessories',
      isActive: true,
      sortOrder: 3
    });

    // Create subcategories
    await Category.create({
      name: 'Women\'s Clothing',
      slug: 'womens-clothing',
      description: 'Trendy women\'s fashion',
      parentCategory: fashionCategory._id?.toString(),
      isActive: true,
      sortOrder: 1
    });

    await Category.create({
      name: 'Men\'s Clothing',
      slug: 'mens-clothing',
      description: 'Stylish men\'s fashion',
      parentCategory: fashionCategory._id?.toString(),
      isActive: true,
      sortOrder: 2
    });

    await Category.create({
      name: 'Skincare',
      slug: 'skincare',
      description: 'Premium skincare products',
      parentCategory: beautyCategory._id?.toString(),
      isActive: true,
      sortOrder: 1
    });

    await Category.create({
      name: 'Makeup',
      slug: 'makeup',
      description: 'Professional makeup products',
      parentCategory: beautyCategory._id?.toString(),
      isActive: true,
      sortOrder: 2
    });

    console.log('📂 Created sample categories');

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
