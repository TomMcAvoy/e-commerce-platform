import mongoose from 'mongoose';
import User from '../models/User';
import Product from '../models/Product';
import Category from '../models/Category';
import Vendor from '../models/Vendor';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Tenant from '../models/Tenant';

export class DatabaseSeeder {
  private tenantId: string;

  constructor(tenantId: string = '6884bf4702e02fe6eb401303') {
    this.tenantId = tenantId;
  }

  async seedAll() {
    console.log('🌱 Starting comprehensive database seeding...');
    
    await this.seedTenant();
    await this.seedUsers();
    await this.seedCategories();
    await this.seedVendors();
    await this.seedProducts();
    
    console.log('✅ Database seeding completed successfully!');
  }

  async seedTenant() {
    const tenantData = {
      _id: this.tenantId,
      slug: this.tenantId,
      name: 'Whitestart System Security Inc.',
      domain: 'localhost',
      plan: 'enterprise',
      status: 'active',
      settings: { currency: 'USD', timezone: 'UTC', features: ['all'] },
      limits: { users: 999, products: 9999, storage: 102400 },
      isActive: true,
    };

    await Tenant.findOneAndUpdate(
      { _id: this.tenantId },
      { $set: tenantData },
      { upsert: true, new: true }
    );
    console.log('✅ Tenant seeded');
  }

  async seedUsers() {
    const users = [
      {
        firstName: 'Thomas',
        lastName: 'McAvoy',
        email: 'thomas.mcavoy@whitestartups.com',
        password: 'AshenP3131m!',
        role: 'admin',
        tenantId: this.tenantId,
        isActive: true,
        isEmailVerified: true,
        addresses: [{
          street: '123 Main St',
          city: 'Toronto',
          state: 'ON',
          zip: 'M5V 3A8',
          country: 'CA',
          isPrimary: true
        }]
      },
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        password: 'password123',
        role: 'vendor',
        tenantId: this.tenantId,
        isActive: true,
        isEmailVerified: true
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        password: 'password123',
        role: 'customer',
        tenantId: this.tenantId,
        isActive: true,
        isEmailVerified: true
      }
    ];

    for (const userData of users) {
      await User.findOneAndUpdate(
        { email: userData.email, tenantId: this.tenantId },
        { $set: userData },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Users seeded');
  }

  async seedCategories() {
    const categories = [
      {
        name: 'Security Systems',
        slug: 'security-systems',
        description: 'Complete security system solutions',
        level: 0,
        path: 'security-systems',
        breadcrumbs: [],
        isActive: true,
        isFeatured: true,
        showInMenu: true,
        tenantId: this.tenantId
      },
      {
        name: 'CCTV Cameras',
        slug: 'cctv-cameras',
        description: 'Professional surveillance cameras',
        level: 1,
        path: 'security-systems/cctv-cameras',
        breadcrumbs: ['Security Systems'],
        isActive: true,
        showInMenu: true,
        tenantId: this.tenantId
      },
      {
        name: 'Access Control',
        slug: 'access-control',
        description: 'Door locks and access management',
        level: 1,
        path: 'security-systems/access-control',
        breadcrumbs: ['Security Systems'],
        isActive: true,
        showInMenu: true,
        tenantId: this.tenantId
      }
    ];

    for (const categoryData of categories) {
      await Category.findOneAndUpdate(
        { slug: categoryData.slug, tenantId: this.tenantId },
        { $set: categoryData },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Categories seeded');
  }

  async seedVendors() {
    const vendor = await User.findOne({ role: 'vendor', tenantId: this.tenantId });
    if (!vendor) return;

    const vendorData = {
      tenantId: this.tenantId,
      userId: vendor._id,
      businessName: 'Security Pro Solutions',
      slug: 'security-pro-solutions',
      businessEmail: 'business@securitypro.com',
      businessPhone: '555-123-4567',
      businessAddress: {
        firstName: 'John',
        lastName: 'Smith',
        address1: '456 Business Ave',
        city: 'Toronto',
        state: 'ON',
        postalCode: 'M5V 3B9',
        country: 'CA',
        isDefault: true
      },
      isVerified: true,
      rating: 4.8,
      commission: 15
    };

    await Vendor.findOneAndUpdate(
      { userId: vendor._id, tenantId: this.tenantId },
      { $set: vendorData },
      { upsert: true, new: true }
    );
    console.log('✅ Vendors seeded');
  }

  async seedProducts() {
    const vendor = await Vendor.findOne({ tenantId: this.tenantId });
    if (!vendor) return;

    const products = [
      {
        tenantId: this.tenantId,
        name: 'Professional Security Camera HD',
        slug: 'professional-security-camera-hd',
        description: 'High-definition security camera with night vision and motion detection',
        price: 299.99,
        originalPrice: 399.99,
        category: 'cctv-cameras',
        brand: 'SecurityPro',
        vendorId: vendor.userId,
        sku: 'CAM-HD-001',
        asin: 'B08XYZ123',
        images: ['/images/camera-hd.jpg'],
        inventory: {
          quantity: 50,
          lowStock: 10,
          inStock: true
        },
        features: ['1080p HD', 'Night Vision', 'Motion Detection', 'Weather Resistant'],
        isActive: true
      },
      {
        tenantId: this.tenantId,
        name: 'Smart Door Lock Pro',
        slug: 'smart-door-lock-pro',
        description: 'Keyless entry smart lock with mobile app control',
        price: 199.99,
        category: 'access-control',
        brand: 'SmartLock',
        vendorId: vendor.userId,
        sku: 'LOCK-PRO-001',
        asin: 'B08ABC456',
        images: ['/images/smart-lock.jpg'],
        inventory: {
          quantity: 25,
          lowStock: 5,
          inStock: true
        },
        features: ['Keyless Entry', 'Mobile App', 'Fingerprint Scanner', 'Auto Lock'],
        isActive: true
      }
    ];

    for (const productData of products) {
      await Product.findOneAndUpdate(
        { slug: productData.slug, tenantId: this.tenantId },
        { $set: productData },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Products seeded');
  }

  async clearAll() {
    console.log('🗑️ Clearing all database collections...');
    
    await User.deleteMany({ tenantId: this.tenantId });
    await Product.deleteMany({ tenantId: this.tenantId });
    await Category.deleteMany({ tenantId: this.tenantId });
    await Vendor.deleteMany({ tenantId: this.tenantId });
    await Order.deleteMany({ tenantId: this.tenantId });
    await Cart.deleteMany({ tenantId: this.tenantId });
    
    console.log('✅ Database cleared successfully!');
  }

  async resetAll() {
    await this.clearAll();
    await this.seedAll();
  }
}