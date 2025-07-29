const mongoose = require('mongoose');
require('dotenv').config();

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/top-headlines';
const SOURCES = 'cnn,fox-news,bbc-news,the-globe-and-mail';

const newsSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, required: true },
  sourceId: { type: String, required: true },
  sourceName: { type: String, required: true },
  author: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  urlToImage: { type: String },
  publishedAt: { type: Date, required: true },
  content: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);

async function fetchRealNews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    if (!API_KEY || API_KEY === 'YOUR_NEWS_API_KEY_HERE') {
      console.error('❌ NEWS_API_KEY not configured properly');
      process.exit(1);
    }
    
    console.log('🗞️  Fetching real news from BBC, CNN, Fox News, Globe and Mail...');
    console.log('📡 API Key:', API_KEY.substring(0, 8) + '...');
    
    const response = await fetch(`${BASE_URL}?sources=${SOURCES}&apiKey=${API_KEY}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ News API request failed with status ${response.status}:`, errorText);
      process.exit(1);
    }
    
    const data = await response.json();
    console.log('📰 API Response status:', data.status);
    console.log('📰 Total articles received:', data.totalResults);
    
    if (data.articles && data.articles.length > 0) {
      console.log('🔄 Processing articles...');
      
      const operations = data.articles.map((article) => ({
        updateOne: {
          filter: { title: article.title, tenantId: '6884bf4702e02fe6eb401303' },
          update: {
            $set: {
              tenantId: '6884bf4702e02fe6eb401303',
              sourceId: article.source.id,
              sourceName: article.source.name,
              author: article.author,
              description: article.description,
              url: article.url,
              urlToImage: article.urlToImage,
              publishedAt: new Date(article.publishedAt),
              content: article.content,
              isActive: true
            }
          },
          upsert: true
        }
      }));
      
      const result = await News.bulkWrite(operations);
      console.log('✅ Successfully cached news articles:');
      console.log('   - Inserted:', result.insertedCount);
      console.log('   - Modified:', result.modifiedCount);
      console.log('   - Upserted:', result.upsertedCount);
      
      // Show sample articles
      const sampleArticles = await News.find({}).limit(3).sort({ publishedAt: -1 });
      console.log('\\n📰 Sample articles:');
      sampleArticles.forEach((article, i) => {
        console.log(`   ${i + 1}. [${article.sourceName}] ${article.title}`);
      });
      
    } else {
      console.log('⚠️  No articles received from API');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fetching real news:', error.message);
    process.exit(1);
  }
}

fetchRealNews();