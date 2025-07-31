const mongoose = require('mongoose');
require('dotenv').config();

const newsArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  url: String,
  sourceName: String,
  sourceId: String,
  tenantId: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId('6884bf4702e02fe6eb401303') },
  category: String,
  publishedAt: Date,
  originalUrl: String
}, { timestamps: true });

const NewsArticle = mongoose.model('NewsArticle', newsArticleSchema);

async function fetchNews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB');
    
    // Create sample news articles
    const sampleArticles = [
      {
        title: 'Breaking: Tech Giants Report Strong Q3 Earnings',
        content: 'Major technology companies have reported stronger than expected earnings for the third quarter, driven by AI investments and cloud services growth.',
        author: 'Tech Reporter',
        url: 'https://example.com/tech-earnings',
        sourceName: 'Tech News',
        sourceId: 'tech-news-1',
        category: 'technology',
        publishedAt: new Date(),
        seoMetadata: { slug: 'tech-earnings-q3-2024' }
      },
      {
        title: 'Global Markets Rally on Economic Data',
        content: 'Stock markets worldwide surged following positive economic indicators and strong employment data from major economies.',
        author: 'Business Correspondent',
        url: 'https://example.com/markets-rally',
        sourceName: 'Business Wire',
        sourceId: 'business-1',
        category: 'business',
        publishedAt: new Date(),
        seoMetadata: { slug: 'markets-rally-economic-data' }
      },
      {
        title: 'New Health Study Shows Benefits of Mediterranean Diet',
        content: 'A comprehensive study involving 50,000 participants confirms the long-term health benefits of following a Mediterranean diet.',
        author: 'Health Writer',
        url: 'https://example.com/health-study',
        sourceName: 'Health Today',
        sourceId: 'health-1',
        category: 'health',
        publishedAt: new Date(),
        seoMetadata: { slug: 'mediterranean-diet-health-study' }
      }
    ];
    
    for (const article of sampleArticles) {
      const existing = await NewsArticle.findOne({ url: article.url });
      if (!existing) {
        await NewsArticle.create(article);
        console.log(`📄 Created: ${article.title}`);
      }
    }
    
    console.log('✅ News fetch completed');
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ News fetch failed:', error);
    process.exit(1);
  }
}

fetchNews();