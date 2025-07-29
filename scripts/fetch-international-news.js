const mongoose = require('mongoose');
require('dotenv').config();

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

// Priority order: USA, UK, Scotland, Canada, then others
const PRIORITY_SOURCES = {
  usa: 'cnn,fox-news,abc-news,nbc-news,cbs-news,usa-today,associated-press,reuters',
  uk: 'bbc-news,the-guardian-uk,independent,daily-mail,the-telegraph',
  scotland: 'bbc-scottish-news',
  canada: 'the-globe-and-mail,cbc-news,ctv-news',
  australia: 'abc-news-au,news-com-au',
  germany: 'der-spiegel,bild',
  france: 'le-monde,le-figaro',
  italy: 'la-repubblica',
  spain: 'el-pais',
  netherlands: 'nu-nl',
  ireland: 'rte',
  india: 'the-times-of-india',
  japan: 'japan-today'
};

const ALL_SOURCES = Object.values(PRIORITY_SOURCES).join(',').substring(0, 500);

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
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);

async function fetchInternationalNews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    if (!API_KEY || API_KEY === 'YOUR_NEWS_API_KEY_HERE') {
      console.error('❌ NEWS_API_KEY not configured properly');
      process.exit(1);
    }
    
    console.log('🌍 Fetching international news from multiple countries...');
    console.log('📡 API Key:', API_KEY.substring(0, 8) + '...');
    console.log('🗞️  Sources:', ALL_SOURCES.substring(0, 100) + '...');
    
    const response = await fetch(`${BASE_URL}?sources=${ALL_SOURCES}&apiKey=${API_KEY}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ News API request failed with status ${response.status}:`, errorText);
      process.exit(1);
    }
    
    const data = await response.json();
    console.log('📰 API Response status:', data.status);
    console.log('📰 Total articles received:', data.totalResults);
    
    if (data.articles && data.articles.length > 0) {
      console.log('🔄 Processing articles from multiple countries...');
      
      const getCountryFromSource = (sourceId) => {
        for (const [country, sources] of Object.entries(PRIORITY_SOURCES)) {
          if (sources.includes(sourceId)) return country;
        }
        return 'international';
      };
      
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
              country: getCountryFromSource(article.source.id),
              isActive: true
            }
          },
          upsert: true
        }
      }));
      
      const result = await News.bulkWrite(operations);
      console.log('✅ Successfully cached international news articles:');
      console.log('   - Inserted:', result.insertedCount);
      console.log('   - Modified:', result.modifiedCount);
      console.log('   - Upserted:', result.upsertedCount);
      
      // Show articles by country
      const countryCounts = {};
      const sampleArticles = await News.find({}).limit(20).sort({ publishedAt: -1 });
      sampleArticles.forEach(article => {
        countryCounts[article.country] = (countryCounts[article.country] || 0) + 1;
      });
      
      console.log('\n🌍 Articles by country:');
      Object.entries(countryCounts).forEach(([country, count]) => {
        console.log(`   ${country.toUpperCase()}: ${count} articles`);
      });
      
      console.log('\n📰 Sample articles:');
      sampleArticles.slice(0, 5).forEach((article, i) => {
        console.log(`   ${i + 1}. [${article.country.toUpperCase()}] [${article.sourceName}] ${article.title.substring(0, 60)}...`);
      });
      
    } else {
      console.log('⚠️  No articles received from API');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fetching international news:', error.message);
    process.exit(1);
  }
}

fetchInternationalNews();