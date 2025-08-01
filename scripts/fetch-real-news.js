const mongoose = require('mongoose');
require('dotenv').config();

async function fetchRealNews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB');
    
    // Import and run news services
    const { newsAPIService } = require('../dist/services/news/NewsAPIService');
    const { mediaStackService } = require('../dist/services/news/MediaStackService');
    const { newsEventsService } = require('../dist/services/news/NewsEventsService');
    const { googleNewsRSSService } = require('../dist/services/news/GoogleNewsRSSService');
    const { guardianService } = require('../dist/services/news/GuardianService');
    const { bbcService } = require('../dist/services/news/BBCService');
    
    console.log('🗞️ Fetching from NewsAPI...');
    await newsAPIService.fetchAndSaveNews();
    
    console.log('🎪 Fetching events from NewsAPI...');
    await newsEventsService.fetchEvents();
    
    console.log('🌍 Fetching from Google News RSS...');
    await googleNewsRSSService.fetchGoogleNewsRSS();
    
    console.log('🇬🇧 Fetching from The Guardian...');
    await guardianService.fetchGuardianNews();
    
    console.log('📺 Fetching from BBC RSS...');
    await bbcService.fetchBBCNews();
    
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