import mongoose from 'mongoose';
import colors from 'colors';
import databaseManager from './databaseManager';

const connectDB = async () => {
  // Skip connection in test environment (jest handles it)
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  
  try {
    console.log(colors.blue.bold('🚀 Initializing Database System...'));
    
    // Step 1: Connect to persistent MongoDB and seed if needed
    await databaseManager.connectPersistent();
    
    // Step 2: Load all data into in-memory database
    await databaseManager.loadIntoMemory();
    
    // Display final stats
    const stats = await databaseManager.getStats();
    console.log(colors.green.bold('📊 Final Database Statistics:'));
    console.log(colors.cyan(`   Categories: ${stats.categories}`));
    console.log(colors.cyan(`   Products: ${stats.products}`));
    console.log(colors.cyan(`   Users: ${stats.users}`));
    console.log(colors.cyan(`   News Categories: ${stats.newsCategories}`));
    console.log(colors.cyan(`   News Articles: ${stats.newsArticles}`));
    console.log(colors.cyan(`   Featured Categories: ${stats.featuredCategories}`));
    console.log(colors.cyan(`   Active Products: ${stats.activeProducts}`));
    
    console.log(colors.green.bold('✅ Database system ready!'));
    
  } catch (error: any) {
    console.error(colors.red(`❌ Database initialization failed: ${error.message}`));
    process.exit(1);
  }
};

// Cleanup on process exit
process.on('SIGINT', async () => {
  console.log(colors.yellow('\n🛑 Shutting down gracefully...'));
  await databaseManager.cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log(colors.yellow('\n🛑 Shutting down gracefully...'));
  await databaseManager.cleanup();
  process.exit(0);
});

export default connectDB;
