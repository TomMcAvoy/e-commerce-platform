import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Tenant from '../models/Tenant';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const TENANT_ID = '6884bf4702e02fe6eb401303';
const DEFAULT_PASSWORD = 'AshenP3131m!';

const seedUsers = async () => {
  try {
    console.log('🌱 Starting user seeding...');

    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if tenant exists
    let tenant = await Tenant.findById(TENANT_ID);
    if (!tenant) {
      console.log('🏢 Creating default tenant...');
      tenant = await Tenant.create({
        _id: TENANT_ID,
        name: 'Default Tenant',
        domain: 'localhost',
        isActive: true,
        settings: {
          allowRegistration: true,
          requireEmailVerification: false,
          defaultRole: 'customer'
        }
      });
      console.log('✅ Default tenant created');
    }

    // Check if test user already exists
    const existingUser = await User.findOne({
      email: 'thomas.mcavoy@whitestartups.com',
      tenantId: TENANT_ID
    });

    if (existingUser) {
      console.log('👤 Test user already exists, updating password...');
      
      // Update password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);
      
      await User.findByIdAndUpdate(existingUser._id, {
        password: hashedPassword,
        isActive: true
      });
      
      console.log('✅ Test user password updated');
    } else {
      console.log('👤 Creating test user...');
      
      const testUser = await User.create({
        tenantId: TENANT_ID,
        name: 'Thomas McAvoy',
        email: 'thomas.mcavoy@whitestartups.com',
        password: DEFAULT_PASSWORD,
        role: 'admin',
        isActive: true,
        preferences: {
          newsletter: true,
          notifications: true,
          language: 'en'
        }
      });
      
      console.log('✅ Test user created:', {
        id: testUser._id,
        email: testUser.email,
        role: testUser.role
      });
    }

    // Create additional test users
    const testUsers = [
      {
        name: 'Customer User',
        email: 'customer@test.com',
        role: 'customer'
      },
      {
        name: 'Vendor User',
        email: 'vendor@test.com',
        role: 'vendor'
      }
    ];

    for (const userData of testUsers) {
      const existingTestUser = await User.findOne({
        email: userData.email,
        tenantId: TENANT_ID
      });

      if (!existingTestUser) {
        await User.create({
          tenantId: TENANT_ID,
          name: userData.name,
          email: userData.email,
          password: DEFAULT_PASSWORD,
          role: userData.role as 'admin' | 'vendor' | 'customer',
          isActive: true
        });
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      }
    }

    console.log('🎉 User seeding completed successfully!');
    
    // Verify users
    const userCount = await User.countDocuments({ tenantId: TENANT_ID });
    console.log(`📊 Total users in tenant: ${userCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding
seedUsers();