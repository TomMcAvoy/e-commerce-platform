const mongoose = require('mongoose');
require('dotenv').config();

async function testNews() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const News = mongoose.model('News', new mongoose.Schema({}, { strict: false }));
  const articles = await News.find({}).limit(5);
  
  console.log('Found articles:', articles.length);
  if (articles.length > 0) {
    console.log('First article:', articles[0].title);
  }
  
  await mongoose.disconnect();
}

testNews();