import mongoose from 'mongoose';
import User from '../../models/User';
import Product from '../../models/Product';
import Category from '../../models/Category';

/**
 * Database Cleanup following Database Patterns from Copilot Instructions
 * Emergency cleanup for complete database reset
 */
class DatabaseCleanup {
  private async connectDatabase(): Promise<void> {
    try {
      const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-dev';
      await mongoose.connect(MONGODB_URI);
      console.log('💾 Connected to database for emergency cleanup');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  private async emergencyCleanup(): Promise<void> {
    try {
      console.log('🧹 EMERGENCY CLEANUP: Removing all data...');
      
      // Drop all collections following your Database Patterns
      const collections = [
        { model: User, name: 'users' },
        { model: Product, name: 'products' },
        { model: Category, name: 'categories' }
      ];

      // Clear collections in parallel for performance
      await Promise.all(
        collections.map(async ({ model, name }) => {
          try {
            await model.collection.drop();
            console.log(`✅ Dropped ${name} collection`);
          } catch (error) {
            console.log(`ℹ️  ${name} collection was already empty`);
          }
        })
      );

      // Recreate collections with proper indexes following Database Patterns
      console.log('🔄 Recreating collections with indexes...');
      await Promise.all([
        User.createCollection(),
        Product.createCollection(), 
        Category.createCollection()
      ]);
      
      console.log('✅ Database completely cleaned and reset with proper indexes');
      
    } catch (error) {
      console.error('❌ Emergency cleanup failed:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    try {
      await this.connectDatabase();
      await this.emergencyCleanup();
      
      // Database stats following your Debugging & Testing Ecosystem pattern
      const stats = await this.getDatabaseStats();
      console.log('📊 Post-cleanup database stats:', stats);
      
      console.log('🎉 Emergency cleanup completed successfully!');
      console.log('💡 Ready for fresh seeding with: npm run seed:real');
      
    } catch (error) {
      console.error('❌ Emergency cleanup failed:', error);
      process.exit(1);
    } finally {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed');
    }
  }

  private async getDatabaseStats(): Promise<object> {
    try {
      const [userCount, productCount, categoryCount] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Category.countDocuments()
      ]);

      return {
        users: userCount,
        products: productCount,
        categories: categoryCount,
        total: userCount + productCount + categoryCount
      };
    } catch (error) {
      return { error: 'Could not retrieve stats' };
    }
  }

  // Additional cleanup methods following your Service Architecture pattern
  async selectiveCleanup(collections: string[] = []): Promise<void> {
    try {
      await this.connectDatabase();
      
      if (collections.includes('users')) {
        await User.deleteMany({});
        console.log('✅ Cleared users collection');
      }
      
      if (collections.includes('products')) {
        await Product.deleteMany({});
        console.log('✅ Cleared products collection');
      }
      
      if (collections.includes('categories')) {
        await Category.deleteMany({});
        console.log('✅ Cleared categories collection');
      }
      
    } catch (error) {
      console.error('❌ Selective cleanup failed:', error);
      throw error;
    } finally {
      await mongoose.connection.close();
    }
  }
}

// Export following your Project-Specific Conventions
export default DatabaseCleanup;

// CLI execution following your Critical Development Workflows
if (require.main === module) {
  const cleanup = new DatabaseCleanup();
  
  // Check for selective cleanup flags
  const args = process.argv.slice(2);
  const isSelective = args.includes('--selective');
  const collections = args.filter(arg => !arg.startsWith('--'));
  
  if (isSelective && collections.length > 0) {
    console.log('🎯 SELECTIVE DATABASE CLEANUP');
    console.log('=============================');
    console.log(`⚠️  This will clear: ${collections.join(', ')}`);
    console.log('Press Ctrl+C to cancel, or wait 3 seconds...\n');
    
    setTimeout(() => {
      cleanup.selectiveCleanup(collections);
    }, 3000);
  } else {
    console.log('🚨 EMERGENCY DATABASE CLEANUP');
    console.log('============================');
    console.log('⚠️  This will COMPLETELY WIPE the database');
    console.log('💡 Use --selective users products categories for partial cleanup');
    console.log('Press Ctrl+C to cancel, or wait 3 seconds...\n');
    
    setTimeout(() => {
      cleanup.cleanup();
    }, 3000);
  }
}
