import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tenant from '../models/Tenant';
import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';
import Vendor from '../models/Vendor';
import { CategorySeeder } from './CategorySeeder'; // Assuming you have this from before

dotenv.config();

/**
 * Master Database Seeder following Database Patterns from Copilot Instructions
 * Clears and reseeds all collections with previously mocked data
 */
export class MasterSeeder {
  private async connectDatabase(): Promise<void> {
    try {
      const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-dev';
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Connected to MongoDB for database reset');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  private async clearAllCollections(): Promise<void> {
    try {
      console.log('🗑️  Clearing all existing data...');
      
      // Clear all collections in parallel following performance patterns
      await Promise.all([
        mongoose.connection.db.dropCollection('categories').catch(() => {}),
        mongoose.connection.db.dropCollection('products').catch(() => {}),
        mongoose.connection.db.dropCollection('users').catch(() => {}),
        mongoose.connection.db.dropCollection('orders').catch(() => {}),
        mongoose.connection.db.dropCollection('carts').catch(() => {})
      ]);
      
      console.log('✅ Database cleared successfully');
    } catch (error) {
      console.error('❌ Database clearing failed:', error);
      throw error;
    }
  }

  async seedEverything(): Promise<void> {
    try {
      console.log('🌱 Starting complete database reseed...');
      
      await this.connectDatabase();
      await this.clearAllCollections();
      
      // Seed in dependency order (users → categories → products)
      console.log('👥 Seeding users and vendors...');
      const userSeeder = new UserSeeder();
      await userSeeder.seed();
      
      console.log('📂 Seeding categories...');
      const categorySeeder = new CategorySeeder();
      await categorySeeder.seed();
      
      console.log('📦 Seeding products...');
      const productSeeder = new ProductSeeder();
      await productSeeder.seed();
      
      console.log('🎉 Database seeding completed successfully!');
      console.log('🔗 API endpoints ready:');
      console.log('   • GET /api/categories');
      console.log('   • GET /api/products');
      console.log('   • GET /api/users');
      
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    } finally {
      await mongoose.connection.close();
    }
  }

  async disconnect() {
    await mongoose.disconnect();
    console.log("✅ Database disconnected.");
  }

  async clearDatabase() {
    console.log("🗑️ Clearing database...");
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    console.log("✅ Database cleared.");
  }

  async seed() {
    try {
      await this.connectDatabase();
      await this.clearDatabase();

      console.log("🌱 Starting master seeding process...");

      // 1. Create a Tenant
      const tenant = await Tenant.create({
        name: 'Whitestart Systems',
        slug: 'whitestart',
        plan: 'enterprise',
      });
      console.log(`✅ Tenant created: ${tenant.name}`);

      // 2. Seed Categories using the existing seeder
      const categorySeeder = new CategorySeeder();
      await categorySeeder.seedCategories(); // This will seed all categories
      const categories = await Category.find({});
      console.log(`✅ Seeded ${categories.length} categories.`);

      // 3. Create a Vendor
      const vendor = await Vendor.create({
        tenantId: tenant._id,
        name: 'SecureTech Supplies',
        contactEmail: 'sales@securetech.com',
        isActive: true,
      });
      console.log(`✅ Vendor created: ${vendor.name}`);

      // 4. Create Products
      const productsData = [
        {
          tenantId: tenant._id,
          vendorId: vendor._id,
          name: 'MK-IV Surveillance Drone',
          description: 'Advanced surveillance drone with 4K camera and thermal imaging.',
          price: 4999.99,
          category: 'electronics',
          stock: 50,
          sku: 'ST-DRONE-MK4',
        },
        {
          tenantId: tenant._id,
          vendorId: vendor._id,
          name: 'Tactical Entry Kit',
          description: 'Complete kit for law enforcement and security professionals.',
          price: 899.99,
          category: 'fashion', // Example, should be a more specific category
          stock: 100,
          sku: 'ST-TEK-01',
        }
      ];
      await Product.insertMany(productsData);
      console.log(`✅ Seeded ${productsData.length} products.`);
      
      console.log("🎉 Master seeding completed successfully!");

    } catch (error) {
      console.error("❌ Seeding failed:", error);
    } finally {
      await this.disconnect();
    }
  }
}

// Command line execution
if (require.main === module) {
  const seeder = new MasterSeeder();
  seeder.seedEverything().then(() => process.exit(0));
}
