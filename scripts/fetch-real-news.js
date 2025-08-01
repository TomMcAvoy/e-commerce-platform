const mongoose = require('mongoose');
require('dotenv').config();

async function fetchRealNews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB');
    
    // Import and run both news services
    const { newsAPIService } = require('../dist/services/news/NewsAPIService');
    const { mediaStackService } = require('../dist/services/news/MediaStackService');
    
    console.log('🗞️ Fetching from NewsAPI...');
    await newsAPIService.fetchAndSaveNews();
    
    console.log('📰 Fetching from MediaStack...');
    await mediaStackService.fetchNews();
    
    console.log('✅ Multi-source news fetch completed');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Real news fetch failed:', error);
    process.exit(1);
  }
}

fetchRealNews();