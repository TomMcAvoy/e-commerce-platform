import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../../utils/config';
import User from '../../models/User';
import Product from '../../models/Product';

// Import seed data
import usersData from '../data/users.json';
import productsData from '../data/products.json';

// Database seeder following copilot-instructions.md patterns
class DatabaseSeeder {
  private users: any[] = [];

  async connectDatabase() {
    try {
      await mongoose.connect(config.mongoUri);
      console.log('💾 Database connected for seeding');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  async clearDatabase() {
    try {
      await User.deleteMany({});
      await Product.deleteMany({});
      console.log('🧹 Database cleared successfully');
    } catch (error) {
      console.error('❌ Database clearing failed:', error);
      throw error;
    }
  }

  async seedUsers() {
    try {
      console.log('👥 Seeding users with multi-vendor roles...');
      
      const processedUsers = await Promise.all(
        usersData.map(async (userData) => {
          // Hash password before storing
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(userData.password, salt);
          
          return {
            ...userData,
            password: hashedPassword
          };
        })
      );

      this.users = await User.insertMany(processedUsers);
      
      console.log(`✅ Created ${this.users.length} users:`);
      this.users.forEach(user => {
        console.log(`   • ${user.name} (${user.role}) - ${user.email}`);
      });
      
    } catch (error) {
      console.error('❌ User seeding failed:', error);
      throw error;
    }
  }

  async seedProducts() {
    try {
      console.log('🛍️  Seeding products with vendor relationships...');
      
      const processedProducts = productsData.map((productData) => {
        // Find vendor by email
        const vendor = this.users.find(user => user.email === productData.vendorEmail);
        if (!vendor) {
          console.warn(`⚠️  Vendor not found for email: ${productData.vendorEmail}`);
          return null;
        }

        // Generate unique SKU following copilot patterns
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        const sku = `${productData.category.toUpperCase()}-${timestamp}-${random}`;

        // Remove vendorEmail and add vendorId
        const { vendorEmail, ...productWithoutEmail } = productData;
        
        return {
          ...productWithoutEmail,
          vendorId: vendor._id,
          sku,
          isActive: true
        };
      }).filter(Boolean); // Remove null entries

      const products = await Product.insertMany(processedProducts);
      
      console.log(`✅ Created ${products.length} products:`);
      
      // Group by vendor for better display
      const productsByVendor = products.reduce((acc: any, product) => {
        const vendor = this.users.find(u => u._id.toString() === product.vendorId.toString());
        const vendorName = vendor?.name || 'Unknown Vendor';
        
        if (!acc[vendorName]) {
          acc[vendorName] = [];
        }
        acc[vendorName].push(product);
        return acc;
      }, {});

      Object.entries(productsByVendor).forEach(([vendorName, vendorProducts]: [string, any]) => {
        console.log(`   📦 ${vendorName}: ${vendorProducts.length} products`);
        vendorProducts.forEach((product: any) => {
          console.log(`      • ${product.name} ($${product.price}) - ${product.category}`);
        });
      });
      
    } catch (error) {
      console.error('❌ Product seeding failed:', error);
      throw error;
    }
  }

  async createIndexes() {
    try {
      console.log('🔍 Creating database indexes for performance...');
      
      // User indexes
      await User.createIndexes();
      
      // Product indexes (compound indexes following copilot patterns)
      await Product.createIndexes();
      
      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Index creation failed:', error);
      throw error;
    }
  }

  async generateSummaryReport() {
    try {
      const userCount = await User.countDocuments();
      const productCount = await Product.countDocuments();
      const vendorCount = await User.countDocuments({ role: 'vendor' });
      const adminCount = await User.countDocuments({ role: 'admin' });
      const customerCount = await User.countDocuments({ role: 'user' });
      
      // Category distribution
      const categories = await Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, totalValue: { $sum: '$price' } } },
        { $sort: { count: -1 } }
      ]);

      console.log('\n📊 Database Seeding Summary Report');
      console.log('=====================================');
      console.log(`👥 Users: ${userCount} total`);
      console.log(`   • Administrators: ${adminCount}`);
      console.log(`   • Vendors: ${vendorCount}`);
      console.log(`   • Customers: ${customerCount}`);
      console.log(`🛍️  Products: ${productCount} total`);
      console.log('\n📈 Product Distribution by Category:');
      categories.forEach(cat => {
        console.log(`   • ${cat._id}: ${cat.count} products ($${cat.totalValue.toLocaleString()} total value)`);
      });
      
      console.log('\n🚀 Ready for Development & Testing!');
      console.log('===================================');
      console.log('Backend API: http://localhost:3000');
      console.log('Frontend: http://localhost:3001');
      console.log('Debug Dashboard: http://localhost:3001/debug');
      console.log('\nTest Accounts:');
      console.log('• Admin: admin@ecommerce.com / admin123');
      console.log('• Vendor: electronics@vendor.com / vendor123');
      console.log('• Customer: john@customer.com / customer123');
      
    } catch (error) {
      console.error('❌ Summary report failed:', error);
    }
  }

  async seed(clearFirst = false) {
    try {
      await this.connectDatabase();
      
      if (clearFirst) {
        await this.clearDatabase();
      }
      
      await this.seedUsers();
      await this.seedProducts();
      await this.createIndexes();
      await this.generateSummaryReport();
      
      console.log('\n🎉 Database seeding completed successfully!');
      
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      process.exit(1);
    } finally {
      await mongoose.connection.close();
    }
  }
}

// Export seeder for use in npm scripts
export default DatabaseSeeder;

// CLI execution
if (require.main === module) {
  const seeder = new DatabaseSeeder();
  const clearFirst = process.argv.includes('--clear');
  
  console.log('🌱 Starting Database Seeding Process...');
  console.log('======================================');
  if (clearFirst) {
    console.log('⚠️  Clear mode enabled - existing data will be removed');
  }
  
  seeder.seed(clearFirst);
}
