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

async function fetchNews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    if (!API_KEY || API_KEY === 'YOUR_NEWS_API_KEY_HERE') {
      console.log('⚠️  Using mock data - NEWS_API_KEY not configured');
      
      // Create mock news articles from major sources
      const mockArticles = [
        {
          tenantId: '6884bf4702e02fe6eb401303',
          sourceId: 'cnn',
          sourceName: 'CNN',
          author: 'CNN Staff',
          title: 'Breaking: Technology Advances in E-commerce',
          description: 'Latest developments in online shopping technology are transforming the retail landscape.',
          url: 'https://cnn.com/tech-ecommerce',
          urlToImage: '/placeholder.svg',
          publishedAt: new Date(),
          content: 'Technology continues to reshape how consumers shop online, with new innovations emerging daily.',
          isActive: true
        },
        {
          tenantId: '6884bf4702e02fe6eb401303',
          sourceId: 'bbc-news',
          sourceName: 'BBC News',
          author: 'BBC Technology',
          title: 'UK Retail Market Shows Strong Growth',
          description: 'British retailers report significant increases in online sales across multiple sectors.',
          url: 'https://bbc.com/uk-retail-growth',
          urlToImage: '/placeholder.svg',
          publishedAt: new Date(Date.now() - 3600000), // 1 hour ago
          content: 'The UK retail sector demonstrates resilience with strong digital transformation initiatives.',
          isActive: true
        },
        {
          tenantId: '6884bf4702e02fe6eb401303',
          sourceId: 'fox-news',
          sourceName: 'Fox News',
          author: 'Fox Business',
          title: 'US Markets React to Consumer Spending Data',
          description: 'Consumer spending patterns show shift toward online platforms and digital services.',
          url: 'https://foxnews.com/consumer-spending',
          urlToImage: '/placeholder.svg',
          publishedAt: new Date(Date.now() - 7200000), // 2 hours ago
          content: 'American consumers increasingly favor digital shopping experiences over traditional retail.',
          isActive: true
        },
        {
          tenantId: '6884bf4702e02fe6eb401303',
          sourceId: 'the-globe-and-mail',
          sourceName: 'The Globe and Mail',
          author: 'Globe Business',
          title: 'Canadian E-commerce Sector Expands Rapidly',
          description: 'Canadian online retailers see unprecedented growth in cross-border sales.',
          url: 'https://theglobeandmail.com/canadian-ecommerce',
          urlToImage: '/placeholder.svg',
          publishedAt: new Date(Date.now() - 10800000), // 3 hours ago
          content: 'Canada\'s digital economy shows strong performance with international expansion opportunities.',
          isActive: true
        }
      ];
      
      await News.deleteMany({});
      await News.insertMany(mockArticles);
      console.log(`✅ Created ${mockArticles.length} mock news articles from major sources`);
      
    } else {
      console.log('🗞️  Fetching real news from API...');
      
      const response = await fetch(`${BASE_URL}?sources=${SOURCES}&apiKey=${API_KEY}`);
      if (!response.ok) {
        throw new Error(`News API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
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
        
        await News.bulkWrite(operations);
        console.log(`✅ Successfully cached ${operations.length} real news articles`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error fetching news:', error);
    process.exit(1);
  }
}

fetchNews();