const mongoose = require('mongoose');
require('dotenv').config();

async function dropIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB');
    
    await mongoose.connection.db.collection('newsarticles').dropIndex('originalUrl_1');
    console.log('🗑️  Dropped originalUrl index');
    
    await mongoose.disconnect();
    console.log('✅ Done');
    
  } catch (error) {
    console.log('Index may not exist, continuing...');
    await mongoose.disconnect();
  }
}

dropIndex();