import mongoose from 'mongoose';
import { config } from '../../utils/config';
import User from '../../models/User';
import Product from '../../models/Product';

class DatabaseCleanup {
  async connectDatabase() {
    try {
      await mongoose.connect(config.mongoUri);
      console.log('💾 Connected to database for cleanup');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  async emergencyCleanup() {
    try {
      console.log('🧹 EMERGENCY CLEANUP: Removing all data...');
      
      // Drop entire collections to reset everything
      await User.collection.drop().catch(() => console.log('User collection already empty'));
      await Product.collection.drop().catch(() => console.log('Product collection already empty'));
      
      // Recreate collections with proper indexes
      await User.createCollection();
      await Product.createCollection();
      
      console.log('✅ Database completely cleaned and reset');
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      throw error;
    }
  }

  async cleanup() {
    try {
      await this.connectDatabase();
      await this.emergencyCleanup();
      console.log('🎉 Emergency cleanup completed successfully!');
    } catch (error) {
      console.error('❌ Emergency cleanup failed:', error);
      process.exit(1);
    } finally {
      await mongoose.connection.close();
    }
  }
}

// Export for CLI usage
export default DatabaseCleanup;

// CLI execution
if (require.main === module) {
  const cleanup = new DatabaseCleanup();
  console.log('🚨 EMERGENCY DATABASE CLEANUP');
  console.log('============================');
  console.log('⚠️  This will COMPLETELY WIPE the database');
  console.log('Press Ctrl+C to cancel, or wait 3 seconds...\n');
  
  setTimeout(() => {
    cleanup.cleanup();
  }, 3000);
}
