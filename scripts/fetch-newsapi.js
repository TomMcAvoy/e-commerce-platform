const mongoose = require('mongoose');
require('dotenv').config();

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

const NEWS_SOURCES = {
  usa: 'cnn,fox-news,abc-news,nbc-news,cbs-news,usa-today,the-washington-post,the-new-york-times,associated-press,reuters',
  uk: 'bbc-news,the-guardian-uk,independent,daily-mail,the-telegraph,sky-news',
  scotland: 'bbc-news',
  canada: 'the-globe-and-mail,cbc-news,ctv-news,national-post'
};

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
  country: { type: String },
  category: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);

function getCountryFromSource(sourceId) {
  for (const [country, sources] of Object.entries(NEWS_SOURCES)) {
    if (sources.includes(sourceId)) return country;
  }
  return 'international';
}

function categorizeNews(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.match(/business|economy|finance|market|stock|trade|company/)) return 'business';
  if (text.match(/sport|football|basketball|soccer|tennis|game|match/)) return 'sports';
  if (text.match(/tech|technology|ai|software|computer|digital|internet/)) return 'technology';
  if (text.match(/health|medical|hospital|doctor|disease|medicine/)) return 'health';
  if (text.match(/science|research|study|discovery|scientist/)) return 'science';
  if (text.match(/entertainment|movie|music|celebrity|hollywood|tv/)) return 'entertainment';
  
  return 'general';
}

async function fetchNewsForCountry(country) {
  try {
    const sources = NEWS_SOURCES[country];
    const response = await fetch(`${BASE_URL}?sources=${sources}&apiKey=${API_KEY}`);
    
    if (!response.ok) {
      console.log(`    ❌ API error for ${country}: ${response.status}`);
      return 0;
    }
    
    const data = await response.json();
    
    if (data.articles && data.articles.length > 0) {
      const tenantId = '6884bf4702e02fe6eb401303';
      const operations = data.articles.map((article) => ({
        updateOne: {
          filter: { title: article.title, tenantId },
          update: {
            $set: {
              tenantId,
              sourceId: article.source.id,
              sourceName: article.source.name,
              author: article.author,
              title: article.title,
              description: article.description,
              url: article.url,
              urlToImage: article.urlToImage,
              publishedAt: new Date(article.publishedAt),
              content: article.content,
              country,
              category: categorizeNews(article.title, article.description),
              isActive: true
            }
          },
          upsert: true
        }
      }));
      
      const result = await News.bulkWrite(operations);
      const imported = result.upsertedCount + result.modifiedCount;
      console.log(`    ✅ ${imported} articles imported`);
      return imported;
    }
    
    return 0;
  } catch (error) {
    console.log(`    ❌ Error fetching ${country}:`, error.message);
    return 0;
  }
}

async function fetchNewsAPI() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    if (!API_KEY || API_KEY === 'YOUR_NEWS_API_KEY_HERE') {
      console.error('❌ NEWS_API_KEY not configured properly');
      process.exit(1);
    }
    
    console.log('📰 Fetching news from NewsAPI...\n');
    
    const countries = ['usa', 'canada', 'uk', 'scotland'];
    let totalImported = 0;
    
    for (const country of countries) {
      console.log(`📍 Processing ${country.toUpperCase()}:`);
      const imported = await fetchNewsForCountry(country);
      totalImported += imported;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('');
    }
    
    console.log(`🎉 Successfully imported ${totalImported} articles from NewsAPI!`);
    
    // Show summary
    const countryCounts = await News.aggregate([
      { $match: { tenantId: new mongoose.Types.ObjectId('6884bf4702e02fe6eb401303') } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n🌍 Articles by country:');
    countryCounts.forEach(country => {
      console.log(`   ${country._id.toUpperCase()}: ${country.count} articles`);
    });
    
    const categoryCounts = await News.aggregate([
      { $match: { tenantId: new mongoose.Types.ObjectId('6884bf4702e02fe6eb401303') } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📂 Articles by category:');
    categoryCounts.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} articles`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fetchNewsAPI();