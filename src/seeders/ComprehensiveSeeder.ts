import mongoose from 'mongoose';
import Category from '../models/Category';
import Product from '../models/Product';
import User from '../models/User';
import Vendor from '../models/Vendor';
import Tenant from '../models/Tenant';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { IUser } from '../models/User';
import { ICategory } from '../models/Category';
import { IProduct } from '../models/Product';
import AppError from '../utils/AppError';
import { SchemaInspector } from '../utils/schemaInspector';

dotenv.config();

/**
 * Comprehensive Database Seeder following Copilot Instructions
 * Creates real marketplace data eliminating ALL mocks
 */
class ComprehensiveSeeder {
  private tenant: any;
  private users: any = {};
  private categories: any = {};
  private vendors: any = {};

  private async connectDatabase(): Promise<void> {
    try {
      const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-dev';
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Database connection established');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw new AppError('Database connection failed', 500);
    }
  }

  private async clearDatabase(): Promise<void> {
    console.log('🧹 Wiping database completely...');
    
    try {
      if (!mongoose.connection.db) {
        throw new AppError('Database connection not available for clearing.', 500);
      }
      // Drop collections completely (including indexes)
      const collections = await mongoose.connection.db.listCollections().toArray();
      
      for (const collection of collections) {
        const collectionName = collection.name;
        if (['users', 'products', 'categories', 'vendors', 'tenants'].includes(collectionName)) {
          console.log(`🗑️  Dropping collection: ${collectionName}`);
          await mongoose.connection.db.dropCollection(collectionName);
        }
      }
      
      console.log('✅ Database wiped clean (including all indexes)');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      throw new AppError('Database cleanup failed', 500);
    }
  }

  private async seedTenant(): Promise<void> {
    console.log('🏢 Creating tenant...');
    
    // Fix: Include ALL required fields for Tenant model
    this.tenant = await Tenant.create({
      name: 'Whitestart System Security',
      slug: 'whitestart-system-security', // REQUIRED field that was missing
      hostname: 'localhost',
      domain: 'localhost:3001',
      settings: {
        currency: 'USD',
        timezone: 'America/New_York',
        language: 'en',
        features: ['multi-vendor', 'dropshipping', 'affiliate-marketing'],
        theme: {
          primaryColor: '#1f2937',
          secondaryColor: '#3b82f6',
          logoUrl: '/logos/whitestart-logo.png'
        }
      },
      isActive: true,
      subscription: {
        plan: 'enterprise',
        status: 'active',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      }
    });
    
    console.log(`✅ Tenant created: ${this.tenant.name} (${this.tenant.slug})`);
  }

  private async seedUsers(): Promise<void> {
    console.log('👥 Seeding comprehensive user base...');
    
    // Admin users following your Authentication Flow
    this.users.admin = await User.create({
      firstName: 'Thomas',
      lastName: 'McAvoy',
      email: 'thomas.mcavoy@whitestartups.com',
      password: 'AhenP3131m!',
      role: 'admin',
      isEmailVerified: true,
      tenantId: this.tenant._id
    });

    // Professional vendors following multi-vendor pattern
    const vendorUsers = await User.create([
      {
        firstName: 'TechSec',
        lastName: 'Solutions',
        email: 'vendor@techsec.com',
        password: 'VendorSecure123!',
        role: 'vendor',
        isEmailVerified: true,
        tenantId: this.tenant._id
      },
      {
        firstName: 'Security',
        lastName: 'Systems',
        email: 'vendor@secsys.com',
        password: 'VendorSecure123!',
        role: 'vendor',
        isEmailVerified: true,
        tenantId: this.tenant._id
      },
      {
        firstName: 'Pro',
        lastName: 'Electronics',
        email: 'vendor@proelec.com',
        password: 'VendorSecure123!',
        role: 'vendor',
        isEmailVerified: true,
        tenantId: this.tenant._id
      }
    ]);

    this.users.vendors = vendorUsers;

    // Customer accounts
    this.users.customers = await User.create([
      {
        firstName: 'John',
        lastName: 'Security',
        email: 'john@customer.com',
        password: 'Customer123!',
        role: 'customer',
        isEmailVerified: true,
        tenantId: this.tenant._id
      },
      {
        firstName: 'Sarah',
        lastName: 'Manager',
        email: 'sarah@business.com',
        password: 'Customer123!',
        role: 'customer',
        isEmailVerified: true,
        tenantId: this.tenant._id
      }
    ]);

    console.log(`✅ Created admin, ${this.users.vendors.length} vendors, ${this.users.customers.length} customers`);
  }

  private async seedVendors(): Promise<void> {
    console.log('🏪 Creating vendor profiles...');
    
    this.vendors.techsec = await Vendor.create({
      userId: this.users.vendors[0]._id,
      businessName: 'TechSec Solutions LLC',
      businessEmail: 'vendor@techsec.com',
      businessPhone: '+1-555-TECH-SEC',
      businessAddress: {
        firstName: 'Michael',           // Principal's first name
        lastName: 'TechSec',           // Principal's last name
        address1: '123 Security Boulevard',  // Use address1 not street
        address2: 'Suite 100',
        city: 'Austin',
        state: 'Texas',
        postalCode: '78701',          // Use postalCode not zipCode
        country: 'United States'
      },
      description: 'Professional security equipment and surveillance systems',
      contactEmail: 'vendor@techsec.com',
      website: 'https://techsec.com',
      businessType: 'manufacturer',
      verificationStatus: 'verified',
      tenantId: this.tenant._id
    });

    this.vendors.secsys = await Vendor.create({
      userId: this.users.vendors[1]._id,
      businessName: 'Security Systems International',
      businessEmail: 'vendor@secsys.com',
      businessPhone: '+1-555-SEC-SYS',
      businessAddress: {
        firstName: 'David',            // Principal's first name
        lastName: 'Security',          // Principal's last name
        address1: '456 Enterprise Drive',    // Use address1 not street
        address2: 'Building B',
        city: 'Dallas',
        state: 'Texas',
        postalCode: '75201',          // Use postalCode not zipCode
        country: 'United States'
      },
      description: 'Enterprise security solutions and access control',
      contactEmail: 'vendor@secsys.com',
      website: 'https://secsys.com',
      businessType: 'distributor',
      verificationStatus: 'verified',
      tenantId: this.tenant._id
    });

    this.vendors.proelec = await Vendor.create({
      userId: this.users.vendors[2]._id,
      businessName: 'Pro Electronics Supply',
      businessEmail: 'vendor@proelec.com',
      businessPhone: '+1-555-PRO-ELEC',
      businessAddress: {
        firstName: 'Jennifer',         // Principal's first name
        lastName: 'Electronics',       // Principal's last name
        address1: '789 Technology Way',      // Use address1 not street
        address2: 'Floor 3',
        city: 'Houston',
        state: 'Texas',
        postalCode: '77001',          // Use postalCode not zipCode
        country: 'United States'
      },
      description: 'Consumer and professional electronics',
      contactEmail: 'vendor@proelec.com',
      website: 'https://proelec.com',
      businessType: 'retailer',
      verificationStatus: 'pending',
      tenantId: this.tenant._id
    });

    console.log('✅ Vendor profiles created with business principal information');
  }

  private async seedCategories(): Promise<void> {
    console.log('📂 Seeding comprehensive category hierarchy...');
    
    // Main Categories following Amazon/Temu structure
    const mainCategories = [
      {
        name: 'Security & Surveillance',
        slug: 'security-surveillance',
        description: 'Professional security equipment and surveillance systems',
        level: 0,
        path: 'security-surveillance',
        categoryType: 'main',
        isFeatured: true,
        order: 1,
        affiliateCode: 'SEC-MAIN-001',
        affiliateUrl: 'https://amazon.com/security?tag=whitestart-20',
        isActive: true,
        tenantId: this.tenant._id
      },
      {
        name: 'Electronics & Technology',
        slug: 'electronics-technology',
        description: 'Consumer electronics, gadgets, and technology products',
        level: 0,
        path: 'electronics-technology',
        categoryType: 'main',
        isFeatured: true,
        order: 2,
        affiliateCode: 'ELEC-MAIN-001',
        affiliateUrl: 'https://amazon.com/electronics?tag=whitestart-20',
        isActive: true,
        tenantId: this.tenant._id
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement, furniture, and garden supplies',
        level: 0,
        path: 'home-garden',
        categoryType: 'main',
        isFeatured: true,
        order: 3,
        affiliateCode: 'HOME-MAIN-001',
        affiliateUrl: 'https://amazon.com/home-garden?tag=whitestart-20',
        isActive: true,
        tenantId: this.tenant._id
      },
      {
        name: 'Fashion & Apparel',
        slug: 'fashion-apparel',
        description: 'Clothing, accessories, and fashion items',
        level: 0,
        path: 'fashion-apparel',
        categoryType: 'main',
        isFeatured: true,
        order: 4,
        affiliateCode: 'FASH-MAIN-001',
        affiliateUrl: 'https://amazon.com/fashion?tag=whitestart-20',
        isActive: true,
        tenantId: this.tenant._id
      }
    ];

    const createdMainCategories = await Category.create(mainCategories);
    
    // Store main categories for reference
    this.categories.security = createdMainCategories[0];
    this.categories.electronics = createdMainCategories[1];
    this.categories.home = createdMainCategories[2];
    this.categories.fashion = createdMainCategories[3];

    // Subcategories with proper parent references
    const subCategories = [
      {
        name: 'Surveillance Cameras',
        slug: 'surveillance-cameras',
        description: 'IP cameras, CCTV systems, and monitoring equipment',
        level: 1,
        path: 'security-surveillance/surveillance-cameras',
        parentCategory: this.categories.security._id,
        categoryType: 'sub',
        isFeatured: true,
        order: 1,
        affiliateCode: 'CAM-SUB-001',
        isActive: true,
        tenantId: this.tenant._id
      },
      {
        name: 'Access Control',
        slug: 'access-control',
        description: 'Door locks, card readers, and access management systems',
        level: 1,
        path: 'security-surveillance/access-control',
        parentCategory: this.categories.security._id,
        categoryType: 'sub',
        isFeatured: true,
        order: 2,
        affiliateCode: 'ACC-SUB-001',
        isActive: true,
        tenantId: this.tenant._id
      },
      {
        name: 'Alarm Systems',
        slug: 'alarm-systems',
        description: 'Security alarms, motion detectors, and alert systems',
        level: 1,
        path: 'security-surveillance/alarm-systems',
        parentCategory: this.categories.security._id,
        categoryType: 'sub',
        isFeatured: false,
        order: 3,
        affiliateCode: 'ALM-SUB-001',
        isActive: true,
        tenantId: this.tenant._id
      },
      {
        name: 'Smart Home Security',
        slug: 'smart-home-security',
        description: 'Connected security devices and home automation',
        level: 1,
        path: 'electronics-technology/smart-home-security',
        parentCategory: this.categories.electronics._id,
        categoryType: 'sub',
        isFeatured: true,
        order: 1,
        affiliateCode: 'SMRT-SUB-001',
        isActive: true,
        tenantId: this.tenant._id
      }
    ];

    const createdSubCategories = await Category.create(subCategories);
    
    // Store subcategories for products
    this.categories.cameras = createdSubCategories[0];
    this.categories.access = createdSubCategories[1];
    this.categories.alarms = createdSubCategories[2];
    this.categories.smartHome = createdSubCategories[3];

    console.log(`✅ Created ${mainCategories.length} main categories and ${subCategories.length} subcategories`);
  }

  private async validateSchemas(): Promise<void> {
    console.log('🔍 Validating model schemas before seeding...');
    await SchemaInspector.inspectAllModels();
  }

  private async seedProducts(): Promise<void> {
    console.log('📦 Seeding professional security products...');
    
    const products = [
      {
        name: 'Professional 4K Security Camera System',
        description: 'Complete 8-channel 4K PoE security camera system with night vision, motion detection, and mobile app control. Perfect for business and residential security.',
        price: 899.99,
        originalPrice: 1299.99,
        category: this.categories.cameras._id,
        vendor: this.vendors.techsec._id,
        vendorId: this.vendors.techsec._id,        // Required by Product schema
        asin: 'B09TECH4KCAM001',                   // Required by Product schema
        sku: 'TSEC-4KCAM-001',
        stock: 25,
        images: ['/api/placeholder/600/400'],
        isFeatured: true,
        isActive: true,
        brand: 'TechSec Pro',
        specifications: {
          resolution: '4K (3840x2160)',
          nightVision: 'Up to 100ft',
          storage: '2TB HDD included',
          connectivity: 'PoE, WiFi, Ethernet'
        },
        tenantId: this.tenant._id
      },
      {
        name: 'Enterprise Biometric Access Control',
        description: 'Advanced biometric access control system with fingerprint and facial recognition. Supports up to 10,000 users with audit trail.',
        price: 2499.99,
        originalPrice: 3199.99,
        category: this.categories.access._id,
        vendor: this.vendors.secsys._id,
        vendorId: this.vendors.secsys._id,         // Required by Product schema
        asin: 'B09SECSYSBIO001',                   // Required by Product schema
        sku: 'SSYS-BIO-001',
        stock: 15,
        images: ['/api/placeholder/600/400'],
        isFeatured: true,
        isActive: true,
        brand: 'SecSys Enterprise',
        specifications: {
          recognition: 'Fingerprint + Facial',
          capacity: '10,000 users',
          connectivity: 'TCP/IP, RS485',
          power: '12V DC'
        },
        tenantId: this.tenant._id
      },
      {
        name: 'Smart Home Security Hub',
        description: 'Central control hub for smart home security with voice assistant integration, mobile app, and 24/7 monitoring support.',
        price: 299.99,
        originalPrice: 449.99,
        category: this.categories.smartHome._id,
        vendor: this.vendors.proelec._id,
        vendorId: this.vendors.proelec._id,        // Required by Product schema
        asin: 'B09PROELECUHB001',                  // Required by Product schema
        sku: 'PELEC-HUB-001',
        stock: 50,
        images: ['/api/placeholder/600/400'],
        isFeatured: true,
        isActive: true,
        brand: 'ProElec Smart',
        specifications: {
          connectivity: 'WiFi, Zigbee, Z-Wave',
          compatibility: 'Alexa, Google, Apple',
          monitoring: '24/7 Professional',
          backup: 'Cellular backup included'
        },
        tenantId: this.tenant._id
      },
      {
        name: 'Wireless Alarm System Kit',
        description: 'Complete wireless alarm system with door/window sensors, motion detectors, and smartphone alerts. Easy DIY installation.',
        price: 199.99,
        originalPrice: 299.99,
        category: this.categories.alarms._id,
        vendor: this.vendors.techsec._id,
        vendorId: this.vendors.techsec._id,        // Required by Product schema
        asin: 'B09TECHSECALM001',                  // Required by Product schema
        sku: 'TSEC-ALARM-001',
        stock: 40,
        images: ['/api/placeholder/600/400'],
        isFeatured: false,
        isActive: true,
        brand: 'TechSec Home',
        specifications: {
          sensors: '10x door/window, 2x motion',
          range: 'Up to 500ft',
          battery: '2-year battery life',
          alerts: 'SMS, Email, Push notifications'
        },
        tenantId: this.tenant._id
      }
    ];

    await Product.create(products);
    console.log(`✅ Created ${products.length} professional products with Amazon integration`);
  }

  private async createIndexes(): Promise<void> {
    console.log('🗂️  Creating performance indexes...');
    
    try {
      // Check existing indexes before creating new ones
      await this.checkAndCreateIndexes();
      console.log('✅ All indexes created successfully');
    } catch (error) {
      console.error('❌ Index creation failed:', error);
      throw new AppError('Index creation failed', 500);
    }
  }

  private async checkAndCreateIndexes(): Promise<void> {
    // Product indexes - check existing before creating
    const productIndexes = await Product.collection.getIndexes();
    console.log('📋 Existing Product indexes:', Object.keys(productIndexes));
    
    // Only create if doesn't exist
    if (!productIndexes['category_1_vendor_1']) {
      await Product.collection.createIndex(
        { category: 1, vendor: 1 },
        { name: 'category_1_vendor_1', background: true }
      );
      console.log('✅ Created Product compound index: category + vendor');
    }

    if (!productIndexes['price_1']) {
      await Product.collection.createIndex(
        { price: 1 },
        { name: 'price_1', background: true }
      );
      console.log('✅ Created Product price index');
    }

    if (!productIndexes['isFeatured_1_isActive_1']) {
      await Product.collection.createIndex(
        { isFeatured: 1, isActive: 1 },
        { name: 'isFeatured_1_isActive_1', background: true }
      );
      console.log('✅ Created Product featured + active index');
    }

    // Category indexes
    const categoryIndexes = await Category.collection.getIndexes();
    console.log('📋 Existing Category indexes:', Object.keys(categoryIndexes));
    
    if (!categoryIndexes['slug_1']) {
      await Category.collection.createIndex(
        { slug: 1 },
        { name: 'slug_1', unique: true, background: true }
      );
      console.log('✅ Created Category slug index');
    }

    if (!categoryIndexes['parentCategory_1_level_1']) {
      await Category.collection.createIndex(
        { parentCategory: 1, level: 1 },
        { name: 'parentCategory_1_level_1', background: true }
      );
      console.log('✅ Created Category hierarchy index');
    }

    // Vendor indexes - handle the conflicting userId index
    const vendorIndexes = await Vendor.collection.getIndexes();
    console.log('📋 Existing Vendor indexes:', Object.keys(vendorIndexes));
    
    // Check if userId index exists and handle conflict
    if (vendorIndexes['userId_1']) {
      console.log('⚠️  Vendor userId index already exists, checking specifications...');
      const existingIndex = vendorIndexes['userId_1'];
      
      // If existing index doesn't have unique constraint, drop and recreate
      if (!existingIndex.unique) {
        console.log('🔄 Dropping non-unique userId index to recreate with unique constraint...');
        await Vendor.collection.dropIndex('userId_1');
        await Vendor.collection.createIndex(
          { userId: 1 },
          { name: 'userId_1_unique', unique: true, background: true }
        );
        console.log('✅ Recreated Vendor userId index with unique constraint');
      } else {
        console.log('✅ Vendor userId index already exists with correct specifications');
      }
    } else {
      await Vendor.collection.createIndex(
        { userId: 1 },
        { name: 'userId_1_unique', unique: true, background: true }
      );
      console.log('✅ Created Vendor userId unique index');
    }

    if (!vendorIndexes['businessEmail_1']) {
      await Vendor.collection.createIndex(
        { businessEmail: 1 },
        { name: 'businessEmail_1', unique: true, background: true }
      );
      console.log('✅ Created Vendor businessEmail index');
    }

    if (!vendorIndexes['verificationStatus_1_tenantId_1']) {
      await Vendor.collection.createIndex(
        { verificationStatus: 1, tenantId: 1 },
        { name: 'verificationStatus_1_tenantId_1', background: true }
      );
      console.log('✅ Created Vendor verification status index');
    }

    // User indexes
    const userIndexes = await User.collection.getIndexes();
    console.log('📋 Existing User indexes:', Object.keys(userIndexes));
    
    if (!userIndexes['email_1']) {
      await User.collection.createIndex(
        { email: 1 },
        { name: 'email_1', unique: true, background: true }
      );
      console.log('✅ Created User email index');
    }

    if (!userIndexes['role_1_isActive_1']) {
      await User.collection.createIndex(
        { role: 1, isActive: 1 },
        { name: 'role_1_isActive_1', background: true }
      );
      console.log('✅ Created User role + active index');
    }

    // Tenant indexes
    const tenantIndexes = await Tenant.collection.getIndexes();
    console.log('📋 Existing Tenant indexes:', Object.keys(tenantIndexes));
    
    if (!tenantIndexes['slug_1']) {
      await Tenant.collection.createIndex(
        { slug: 1 },
        { name: 'slug_1', unique: true, background: true }
      );
      console.log('✅ Created Tenant slug index');
    }

    if (!tenantIndexes['hostname_1']) {
      await Tenant.collection.createIndex(
        { hostname: 1 },
        { name: 'hostname_1', unique: true, background: true }
      );
      console.log('✅ Created Tenant hostname index');
    }
  }

  private async generateReport(): Promise<void> {
    const [userCount, vendorCount, categoryCount, productCount] = await Promise.all([
      User.countDocuments(),
      Vendor.countDocuments(),
      Category.countDocuments(),
      Product.countDocuments()
    ]);

    console.log('\n🎉 Comprehensive Database Seeding Complete');
    console.log('==========================================');
    console.log(`🏢 Tenant: ${this.tenant.name} (${this.tenant.slug})`);
    console.log(`👥 Users: ${userCount} (Admin + Vendors + Customers)`);
    console.log(`🏪 Vendors: ${vendorCount} verified businesses`);
    console.log(`📂 Categories: ${categoryCount} (4 main + subcategories)`);
    console.log(`📦 Products: ${productCount} professional security items`);
    
    console.log('\n🔐 Test Accounts:');
    console.log('• Admin: thomas.mcavoy@whitestartups.com / AhenP3131m!');
    console.log('• Vendor: vendor@techsec.com / VendorSecure123!');
    console.log('• Customer: john@customer.com / Customer123!');

    console.log('\n🚀 API Endpoints Ready:');
    console.log('• GET /api/categories - All categories');
    console.log('• GET /api/products - All products');
    console.log('• POST /api/auth/login - Authentication');
    console.log('• GET /health - Backend health check');

    console.log('\n🎯 Frontend URLs:');
    console.log('• http://localhost:3001/ - Homepage');
    console.log('• http://localhost:3001/categories - Browse categories');
    console.log('• http://localhost:3001/debug - Debug dashboard');
    console.log('• http://localhost:3001/security-surveillance - Security products');
  }

  public async seedEverything(): Promise<void> {
    try {
      console.log('🌱 Starting Comprehensive Database Seeding');
      console.log('===========================================');
      console.log('Following Copilot Instructions - Real Data Only');
      
      await this.connectDatabase();
      await this.clearDatabase();
      await this.seedTenant();
      await this.seedUsers();
      await this.seedVendors();
      await this.seedCategories();
      await this.seedProducts();
      await this.createIndexes();
      await this.generateReport();
      
      console.log('\n✅ All systems ready for development!');
      console.log('💡 Run: npm run dev:all');
      
    } catch (error: unknown) {
      console.error(`❌ Seeding failed.`);
      if (error instanceof Error) {
        console.error(`Error message: ${error.message}`);
        if ('name' in error && error.name === 'ValidationError' && 'errors' in error) {
          const validationError = error as any; // Cast to access specific properties
          Object.keys(validationError.errors).forEach(field => {
            console.error(`  - ${field}: ${validationError.errors[field].message}`);
          });
        }
      } else {
        console.error('An unknown error object was thrown:', error);
      }
    } finally {
      await mongoose.connection.close();
    }
  }
}

// CLI execution following Critical Development Workflows
if (require.main === module) {
  const seeder = new ComprehensiveSeeder();
  seeder.seedEverything()
    .then(() => {
      console.log('\n🚀 Ready to start servers:');
      console.log('npm run dev:all');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seeding failed. Check your Tenant model schema.');
      console.error('Error:', error.message);
      process.exit(1);
    });
}

export default ComprehensiveSeeder;
