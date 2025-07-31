const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const newsArticleSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId('6884bf4702e02fe6eb401303') },
  title: String,
  slug: String,
  content: String,
  summary: String,
  excerpt: String,
  imageUrl: String,
  url: { type: String, required: true },
  originalUrl: String,
  sourceName: { type: String, required: true },
  sourceId: { type: String, required: true },
  author: String,
  category: mongoose.Schema.Types.Mixed,
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const NewsArticle = mongoose.model('NewsArticle', newsArticleSchema);

const newsCategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  googleNewsCategory: String
});

const NewsCategory = mongoose.model('NewsCategory', newsCategorySchema);

async function fetchNewsFromAPI() {
  if (!process.env.NEWS_API_KEY) {
    console.log('📰 NEWS_API_KEY not configured - using sample data');
    return createSampleNews();
  }

  try {
    const categories = ['world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'];
    let totalProcessed = 0;

    for (const category of categories) {
      try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            apiKey: process.env.NEWS_API_KEY,
            category: category === 'nation' ? 'general' : category,
            country: 'us',
            pageSize: 3
          },
          timeout: 10000
        });

        const articles = response.data.articles.filter(article => 
          article.title && 
          article.description && 
          article.content &&
          !article.title.includes('[Removed]') &&
          article.urlToImage
        );

        const categoryDoc = await NewsCategory.findOne({ 
          $or: [
            { slug: category },
            { googleNewsCategory: category },
            { name: { $regex: new RegExp(category, 'i') } }
          ]
        });

        for (const article of articles) {
          const existing = await NewsArticle.findOne({ originalUrl: article.url });
          if (existing) continue;

          const newsArticle = new NewsArticle({
            title: article.title,
            summary: article.description,
            content: article.content.replace(/\[\+\d+ chars\]$/, '').trim(),
            author: article.author || article.source.name,
            url: article.url,
            originalUrl: article.url,
            sourceName: article.source.name,
            sourceId: article.source.id || 'newsapi',
            category: categoryDoc?._id || category,
            imageUrl: article.urlToImage,
            publishedAt: new Date(article.publishedAt),
            slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 100)
          });

          await newsArticle.save();
          totalProcessed++;
          console.log(`📄 Saved: ${article.title}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to fetch ${category} articles:`, error.message);
      }
    }

    console.log(`✅ Processed ${totalProcessed} articles from NewsAPI`);
  } catch (error) {
    console.error('❌ NewsAPI fetch failed:', error.message);
    return createSampleNews();
  }
}

async function createSampleNews() {
  const sampleArticles = [
    {
      title: 'AI Revolution Transforms Global Industries',
      summary: 'Artificial intelligence continues to reshape industries worldwide with breakthrough applications.',
      content: 'Major corporations are implementing AI solutions across manufacturing, healthcare, and finance sectors, leading to unprecedented efficiency gains and innovation.',
      author: 'Tech Correspondent',
      url: 'https://example.com/ai-revolution-2024',
      originalUrl: 'https://example.com/ai-revolution-2024',
      sourceName: 'Tech Today',
      sourceId: 'tech-today',
      category: 'technology',
      imageUrl: '/placeholder.svg',
      slug: 'ai-revolution-transforms-global-industries'
    },
    {
      title: 'Global Markets Show Strong Recovery Signs',
      summary: 'International stock markets demonstrate resilience amid economic uncertainties.',
      content: 'Financial analysts report positive trends across major global exchanges, with technology and healthcare sectors leading the recovery.',
      author: 'Financial Reporter',
      url: 'https://example.com/markets-recovery-2024',
      originalUrl: 'https://example.com/markets-recovery-2024',
      sourceName: 'Market Watch',
      sourceId: 'market-watch',
      category: 'business',
      imageUrl: '/placeholder.svg',
      slug: 'global-markets-show-strong-recovery-signs'
    },
    {
      title: 'Breakthrough Medical Research Shows Promise',
      summary: 'New clinical trials reveal significant advances in treatment methodologies.',
      content: 'Researchers at leading medical institutions have published findings that could revolutionize patient care and treatment outcomes.',
      author: 'Medical Correspondent',
      url: 'https://example.com/medical-breakthrough-2024',
      originalUrl: 'https://example.com/medical-breakthrough-2024',
      sourceName: 'Health News',
      sourceId: 'health-news',
      category: 'health',
      imageUrl: '/placeholder.svg',
      slug: 'breakthrough-medical-research-shows-promise'
    }
  ];

  let processed = 0;
  for (const article of sampleArticles) {
    const existing = await NewsArticle.findOne({ originalUrl: article.originalUrl });
    if (!existing) {
      await NewsArticle.create(article);
      processed++;
      console.log(`📄 Created sample: ${article.title}`);
    }
  }
  
  console.log(`✅ Created ${processed} sample articles`);
}

async function runComplexNewsScheduler() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB');
    
    console.log('🗞️  Starting complex news fetch...');
    await fetchNewsFromAPI();
    
    console.log('✅ Complex news scheduler completed');
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Complex news scheduler failed:', error);
    process.exit(1);
  }
}

runComplexNewsScheduler();