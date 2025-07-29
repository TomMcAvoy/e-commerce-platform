const mongoose = require('mongoose');
require('dotenv').config();

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/everything';

// News sources by country with category specialization
const NEWS_SOURCES_BY_CATEGORY = {
  usa: {
    general: 'cnn,fox-news,abc-news,nbc-news,cbs-news,usa-today,associated-press,reuters',
    sports: 'espn,fox-sports,cbs-sports,nbc-sports',
    entertainment: 'entertainment-weekly,people-magazine,variety,hollywood-reporter',
    politics: 'politico,the-hill,washington-post,new-york-times',
    business: 'bloomberg,cnbc,wall-street-journal,forbes',
    technology: 'techcrunch,the-verge,wired,ars-technica'
  },
  uk: {
    general: 'bbc-news,the-guardian-uk,independent,daily-mail,the-telegraph,sky-news',
    sports: 'bbc-sport,sky-sports-news,talksport',
    entertainment: 'daily-mail,the-sun,mirror',
    politics: 'bbc-news,the-guardian-uk,independent',
    business: 'financial-times,the-economist',
    technology: 'bbc-news,the-guardian-uk'
  },
  scotland: {
    general: 'bbc-scottish-news',
    sports: 'bbc-sport',
    politics: 'bbc-scottish-news'
  },
  canada: {
    general: 'the-globe-and-mail,cbc-news,ctv-news,national-post',
    sports: 'cbc-news,ctv-news',
    politics: 'the-globe-and-mail,cbc-news'
  },
  australia: {
    general: 'abc-news-au,news-com-au,the-australian',
    sports: 'abc-news-au,news-com-au'
  }
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
  for (const [country, categories] of Object.entries(NEWS_SOURCES_BY_CATEGORY)) {
    for (const [category, sources] of Object.entries(categories)) {
      if (sources.includes(sourceId)) {
        return { country, category };
      }
    }
  }
  return { country: 'international', category: 'general' };
}

async function fetchNewsByCountryAndCategory() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    if (!API_KEY || API_KEY === 'YOUR_NEWS_API_KEY_HERE') {
      console.error('❌ NEWS_API_KEY not configured properly');
      process.exit(1);
    }
    
    const tenantId = '6884bf4702e02fe6eb401303';
    let totalImported = 0;
    
    console.log('🌍 Fetching international news by country and category...\n');
    
    for (const [country, categories] of Object.entries(NEWS_SOURCES_BY_CATEGORY)) {
      console.log(`📍 Processing ${country.toUpperCase()}:`);
      
      for (const [category, sources] of Object.entries(categories)) {
        console.log(`  📰 ${category}: ${sources.split(',').length} sources`);
        
        try {
          // Use different queries for different categories
          let query = '';
          switch (category) {
            case 'sports':
              query = 'sports OR football OR basketball OR soccer OR tennis OR olympics';
              break;
            case 'entertainment':
              query = 'entertainment OR celebrity OR movies OR music OR hollywood';
              break;
            case 'politics':
              query = 'politics OR government OR election OR policy OR parliament';
              break;
            case 'business':
              query = 'business OR economy OR finance OR market OR stocks';
              break;
            case 'technology':
              query = 'technology OR tech OR AI OR software OR innovation';
              break;
            default:
              query = 'news';
          }
          
          const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}&sources=${sources}&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`);
          
          if (!response.ok) {
            console.log(`    ⚠️  API error for ${category}: ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          
          if (data.articles && data.articles.length > 0) {
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
                    category,
                    isActive: true
                  }
                },
                upsert: true
              }
            }));
            
            const result = await News.bulkWrite(operations);
            const imported = result.upsertedCount + result.modifiedCount;
            totalImported += imported;
            console.log(`    ✅ ${imported} articles imported`);
          } else {
            console.log(`    ⚠️  No articles found for ${category}`);
          }
          
          // Rate limiting delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.log(`    ❌ Error fetching ${category}:`, error.message);
        }
      }
      
      console.log(''); // Empty line between countries
    }
    
    console.log(`🎉 Successfully imported ${totalImported} categorized news articles!`);
    
    // Show summary
    const countryCounts = await News.aggregate([
      { $match: { tenantId: new mongoose.Types.ObjectId(tenantId) } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n🌍 Articles by country:');
    countryCounts.forEach(country => {
      console.log(`   ${country._id.toUpperCase()}: ${country.count} articles`);
    });
    
    const categoryCounts = await News.aggregate([
      { $match: { tenantId: new mongoose.Types.ObjectId(tenantId) } },
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

fetchNewsByCountryAndCategory();