const mongoose = require('mongoose');
require('dotenv').config();

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

async function seedNews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const articles = [
      {
        tenantId: '6884bf4702e02fe6eb401303',
        sourceId: 'tech-news-1',
        sourceName: 'Tech News',
        author: 'Tech Writer',
        title: 'Latest Technology Trends in E-commerce',
        description: 'Discover the latest technology trends that are shaping the future of e-commerce.',
        url: 'https://example.com/tech-trends-ecommerce',
        urlToImage: '/placeholder.svg',
        publishedAt: new Date(),
        content: 'Discover the latest technology trends that are shaping the future of e-commerce and online shopping experiences.'
      },
      {
        tenantId: '6884bf4702e02fe6eb401303',
        sourceId: 'business-news-1',
        sourceName: 'Business News',
        author: 'Business Writer',
        title: 'Business Growth Strategies for 2024',
        description: 'Learn about effective business growth strategies for your company.',
        url: 'https://example.com/business-growth-2024',
        urlToImage: '/placeholder.svg',
        publishedAt: new Date(),
        content: 'Learn about effective business growth strategies that can help your company succeed in the competitive market.'
      },
      {
        tenantId: '6884bf4702e02fe6eb401303',
        sourceId: 'security-news-1',
        sourceName: 'Security News',
        author: 'Security Expert',
        title: 'Security Best Practices for Online Stores',
        description: 'Essential security measures for online stores.',
        url: 'https://example.com/security-best-practices',
        urlToImage: '/placeholder.svg',
        publishedAt: new Date(),
        content: 'Essential security measures every online store should implement to protect customer data and transactions.'
      }
    ];
    
    await News.deleteMany({});
    await News.insertMany(articles);
    console.log('Created news articles:', articles.length);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding news:', error);
    process.exit(1);
  }
}

seedNews();