const mongoose = require('mongoose');
require('dotenv').config();

// Import the NewsService
const NewsService = require('../dist/services/NewsService').default;
const Tenant = require('../dist/models/Tenant').default;

async function triggerNewsFetch() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const tenant = await Tenant.findOne();
    if (!tenant) {
      console.error('No tenant found');
      process.exit(1);
    }
    
    console.log('🗞️  Triggering news fetch for tenant:', tenant.name);
    const newsService = new NewsService(tenant._id.toString());
    await newsService.fetchAndCacheNews();
    
    console.log('✅ News fetch completed');
    process.exit(0);
  } catch (error) {
    console.error('Error triggering news fetch:', error);
    process.exit(1);
  }
}

triggerNewsFetch();