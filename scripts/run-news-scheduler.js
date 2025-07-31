const mongoose = require('mongoose');
require('dotenv').config();

async function runNewsScheduler() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB');
    
    // Import and run the news service directly
    const { newsAPIService } = require('../dist/services/news/NewsAPIService');
    
    console.log('🗞️  Starting news fetch...');
    await newsAPIService.fetchAndSaveNews();
    console.log('✅ News fetch completed');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ News scheduler failed:', error);
    process.exit(1);
  }
}

runNewsScheduler();