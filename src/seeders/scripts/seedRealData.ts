import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../../utils/config';
import User from '../../models/User';
import Product from '../../models/Product';

import realUsersData from '../data/realUsers.json';
import realProductsData from '../data/realProducts.json';

class RealDataSeeder {
  private users: any[] = [];

  async connectDatabase() {
    try {
      await mongoose.connect(config.mongoUri);
      console.log('💾 Connected to database for seeding REAL data');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  async seedRealUsers() {
    try {
      console.log('👥 Seeding REAL user accounts...');
      
      const processedUsers = await Promise.all(
        realUsersData.map(async (userData) => {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(userData.password, salt);
          
          return {
            ...userData,
            password: hashedPassword
          };
        })
      );

      this.users = await User.insertMany(processedUsers);
      
      console.log(`✅ Created ${this.users.length} REAL user accounts:`);
      this.users.forEach(user => {
        console.log(`   • ${user.name} (${user.role}) - ${user.email}`);
      });
      
    } catch (error) {
      console.error('❌ Real user seeding failed:', error);
      throw error;
    }
  }

  async seedRealProducts() {
    try {
      console.log('🛍️  Seeding REAL products following Amazon/Temu patterns...');
      
      const processedProducts = realProductsData.map((productData) => {
        const vendor = this.users.find(user => user.email === productData.vendorEmail);
        if (!vendor) {
          console.warn(`⚠️  Vendor not found: ${productData.vendorEmail}`);
          return null;
        }

        // Generate proper ASIN following Amazon pattern
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let asin = '';
        for (let i = 0; i < 10; i++) {
          asin += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Generate proper SKU
        const brandPrefix = productData.brand?.substring(0, 3).toUpperCase() || 'GEN';
        const categoryPrefix = productData.category.substring(0, 3).toUpperCase();
        const timestamp = Date.now().toString().slice(-6);
        const sku = `${brandPrefix}-${categoryPrefix}-${timestamp}`;

        const { vendorEmail, ...productWithoutEmail } = productData;
        
        return {
          ...productWithoutEmail,
          asin,
          sku,
          vendorId: vendor._id,
          isActive: true
        };
      }).filter(Boolean);

      const products = await Product.insertMany(processedProducts);
      
      console.log(`✅ Created ${products.length} REAL products:`);
      products.forEach(product => {
        console.log(`   • ${product.name} - $${product.price} (ASIN: ${product.asin})`);
      });
      
    } catch (error) {
      console.error('❌ Real product seeding failed:', error);
      throw error;
    }
  }

  async generateRealReport() {
    try {
      const userCount = await User.countDocuments();
      const productCount = await Product.countDocuments();
      const totalValue = await Product.aggregate([
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]);

      console.log('\n📊 REAL Database Seeding Complete');
      console.log('=================================');
      console.log(`👥 Users: ${userCount} (real accounts)`);
      console.log(`🛍️  Products: ${productCount} (real products)`);
      console.log(`💰 Total Catalog Value: $${totalValue[0]?.total?.toLocaleString() || '0'}`);
      console.log('\n🔐 Test Accounts (REAL):');
      console.log('• Admin: admin@ecommerce.com / Admin123!');
      console.log('• Vendor: electronics@vendor.com / Vendor123!');
      console.log('• Customer: john@customer.com / Customer123!');
      console.log('\n✅ Ready for development with REAL data!');
      console.log('🚀 Backend: http://localhost:3000');
      console.log('🎨 Frontend: http://localhost:3001');
      console.log('🔍 Debug Dashboard: http://localhost:3001/debug');
      
    } catch (error) {
      console.error('❌ Real report failed:', error);
    }
  }

  async seed() {
    try {
      await this.connectDatabase();
      await this.seedRealUsers();
      await this.seedRealProducts();
      await this.generateRealReport();
      console.log('\n🎉 REAL data seeding completed successfully!');
    } catch (error) {
      console.error('❌ Real data seeding failed:', error);
      process.exit(1);
    } finally {
      await mongoose.connection.close();
    }
  }
}

export default RealDataSeeder;

if (require.main === module) {
  const seeder = new RealDataSeeder();
  console.log('🌱 Seeding Database with REAL Product Data');
  console.log('==========================================');
  seeder.seed();
}
