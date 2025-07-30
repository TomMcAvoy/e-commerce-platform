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
      // Electronics & Technology
      {
        tenantId: this.tenantId,
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        description: 'Latest iPhone with advanced camera system and A17 Pro chip',
        price: 1199.99,
        originalPrice: 1299.99,
        category: 'smartphones-tablets',
        brand: 'Apple',
        vendorId: vendor.userId,
        sku: 'IPHONE-15-PRO',
        images: ['/images/iphone-15.jpg'],
        inventory: { quantity: 25, lowStock: 5, inStock: true },
        features: ['A17 Pro Chip', '48MP Camera', '5G Ready', 'Face ID'],
        isActive: true
      },
      {
        tenantId: this.tenantId,
        name: 'MacBook Pro 16-inch',
        slug: 'macbook-pro-16',
        description: 'Professional laptop with M3 Pro chip for creative professionals',
        price: 2499.99,
        category: 'computers-laptops',
        brand: 'Apple',
        vendorId: vendor.userId,
        sku: 'MBP-16-M3',
        images: ['/images/macbook-pro.jpg'],
        inventory: { quantity: 15, lowStock: 3, inStock: true },
        features: ['M3 Pro Chip', '16GB RAM', '512GB SSD', 'Liquid Retina Display'],
        isActive: true
      },
      {
        tenantId: this.tenantId,
        name: 'Sony WH-1000XM5 Headphones',
        slug: 'sony-wh1000xm5',
        description: 'Premium noise-canceling wireless headphones',
        price: 399.99,
        category: 'audio-headphones',
        brand: 'Sony',
        vendorId: vendor.userId,
        sku: 'SONY-WH1000XM5',
        images: ['/images/sony-headphones.jpg'],
        inventory: { quantity: 40, lowStock: 8, inStock: true },
        features: ['Noise Canceling', '30hr Battery', 'Quick Charge', 'Touch Controls'],
        isActive: true
      },
      // Fashion & Apparel
      {
        tenantId: this.tenantId,
        name: 'Premium Cotton T-Shirt',
        slug: 'premium-cotton-tshirt',
        description: 'Comfortable 100% organic cotton t-shirt for everyday wear',
        price: 29.99,
        category: 'mens-clothing',
        brand: 'EcoWear',
        vendorId: vendor.userId,
        sku: 'TSHIRT-COTTON-M',
        images: ['/images/cotton-tshirt.jpg'],
        inventory: { quantity: 100, lowStock: 20, inStock: true },
        features: ['100% Organic Cotton', 'Pre-shrunk', 'Machine Washable', 'Various Colors'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Navy', 'Gray'],
        isActive: true
      },
      {
        tenantId: this.tenantId,
        name: 'Designer Running Shoes',
        slug: 'designer-running-shoes',
        description: 'Lightweight running shoes with advanced cushioning technology',
        price: 149.99,
        category: 'shoes-footwear',
        brand: 'RunTech',
        vendorId: vendor.userId,
        sku: 'SHOES-RUN-001',
        images: ['/images/running-shoes.jpg'],
        inventory: { quantity: 60, lowStock: 12, inStock: true },
        features: ['Lightweight Design', 'Advanced Cushioning', 'Breathable Mesh', 'Durable Sole'],
        sizes: ['7', '8', '9', '10', '11', '12'],
        isActive: true
      },
      // Home & Garden
      {
        tenantId: this.tenantId,
        name: 'Smart Coffee Maker',
        slug: 'smart-coffee-maker',
        description: 'WiFi-enabled coffee maker with app control and scheduling',
        price: 199.99,
        category: 'kitchen-dining',
        brand: 'BrewSmart',
        vendorId: vendor.userId,
        sku: 'COFFEE-SMART-001',
        images: ['/images/coffee-maker.jpg'],
        inventory: { quantity: 30, lowStock: 6, inStock: true },
        features: ['WiFi Enabled', 'App Control', 'Programmable', '12-Cup Capacity'],
        isActive: true
      },
      {
        tenantId: this.tenantId,
        name: 'Ergonomic Office Chair',
        slug: 'ergonomic-office-chair',
        description: 'Professional office chair with lumbar support and adjustable height',
        price: 299.99,
        category: 'furniture',
        brand: 'ComfortWork',
        vendorId: vendor.userId,
        sku: 'CHAIR-OFFICE-001',
        images: ['/images/office-chair.jpg'],
        inventory: { quantity: 20, lowStock: 4, inStock: true },
        features: ['Lumbar Support', 'Adjustable Height', 'Breathable Mesh', '360° Swivel'],
        isActive: true
      },
      // Health & Beauty
      {
        tenantId: this.tenantId,
        name: 'Vitamin C Serum',
        slug: 'vitamin-c-serum',
        description: 'Anti-aging vitamin C serum for brighter, healthier skin',
        price: 49.99,
        category: 'health-beauty',
        brand: 'GlowSkin',
        vendorId: vendor.userId,
        sku: 'SERUM-VITC-001',
        images: ['/images/vitamin-c-serum.jpg'],
        inventory: { quantity: 80, lowStock: 15, inStock: true },
        features: ['20% Vitamin C', 'Anti-aging', 'Brightening', 'Dermatologist Tested'],
        isActive: true
      },
      // Sports & Outdoors
      {
        tenantId: this.tenantId,
        name: 'Yoga Mat Premium',
        slug: 'yoga-mat-premium',
        description: 'Non-slip premium yoga mat with alignment guides',
        price: 79.99,
        category: 'sports-outdoors',
        brand: 'ZenFit',
        vendorId: vendor.userId,
        sku: 'YOGA-MAT-PREM',
        images: ['/images/yoga-mat.jpg'],
        inventory: { quantity: 50, lowStock: 10, inStock: true },
        features: ['Non-slip Surface', 'Alignment Guides', 'Eco-friendly', '6mm Thickness'],
        isActive: true
      },
      // Toys & Games
      {
        tenantId: this.tenantId,
        name: 'Educational Building Blocks',
        slug: 'educational-building-blocks',
        description: 'STEM learning building blocks set for kids aged 3-8',
        price: 39.99,
        category: 'toys-games',
        brand: 'LearnPlay',
        vendorId: vendor.userId,
        sku: 'BLOCKS-STEM-001',
        images: ['/images/building-blocks.jpg'],
        inventory: { quantity: 75, lowStock: 15, inStock: true },
        features: ['STEM Learning', 'Safe Materials', 'Age 3-8', '100 Pieces'],
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
    
    // Update category product counts
    await this.updateCategoryProductCounts();
    console.log('✅ Products seeded with category counts updated');
  }

  async updateCategoryProductCounts() {
    const categories = await Category.find({ tenantId: this.tenantId });
    
    for (const category of categories) {
      const productCount = await Product.countDocuments({ 
        category: category.slug, 
        tenantId: this.tenantId,
        isActive: true 
      });
      
      await Category.findByIdAndUpdate(category._id, { 
        productCount 
      });
    }
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