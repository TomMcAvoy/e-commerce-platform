const mongoose = require('mongoose');
require('dotenv').config();

// Import the Google News Service
const { default: GoogleNewsService } = require('../src/services/GoogleNewsService');

async function fetchGoogleNews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const newsService = new GoogleNewsService();
    
    console.log('🌍 Fetching news from Google News RSS feeds...\n');
    
    const countries = ['usa', 'canada', 'uk', 'scotland'];
    const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
    
    for (const country of countries) {
      console.log(`📍 Processing ${country.toUpperCase()}:`);
      
      for (const category of categories) {
        console.log(`  📰 Fetching ${category}...`);
        await newsService.fetchNewsByCountryAndCategory(country, category);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      console.log(''); // Empty line between countries
    }
    
    console.log('🎉 Successfully fetched news from Google News!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fetchGoogleNews();