const mongoose = require('mongoose');
require('dotenv').config();

async function clearNews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB');
    
    await mongoose.connection.db.collection('newsarticles').deleteMany({});
    console.log('🗑️  Cleared all news articles');
    
    await mongoose.disconnect();
    console.log('✅ Done');
    
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

clearNews();