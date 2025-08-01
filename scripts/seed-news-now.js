const mongoose = require('mongoose');
require('dotenv').config();

async function seedNews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB');
    
    const NewsArticle = require('../dist/models/NewsArticle').default;
    const NewsCategory = require('../dist/models/NewsCategory').default;
    
    const tenantId = '6884bf4702e02fe6eb401303';
    
    // Create categories
    const categoryNames = ['Technology', 'Business', 'Sports', 'Entertainment', 'Health', 'Science', 'Politics'];
    const categories = [];
    
    for (const name of categoryNames) {
      let category = await NewsCategory.findOne({ name, tenantId });
      if (!category) {
        category = await NewsCategory.create({
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          tenantId
        });
      }
      categories.push(category);
    }
    
    // Create articles for all countries and categories
    const countries = ['usa', 'canada', 'uk', 'scotland'];
    const sampleNews = [];
    
    const headlines = {
      technology: ['AI Revolution Transforms Industry', 'Quantum Computing Breakthrough', 'Tech Giants Announce Major Updates'],
      business: ['Markets Surge on Economic News', 'Major Corporate Merger Announced', 'Startup Raises $100M Funding'],
      sports: ['Championship Finals This Weekend', 'Record-Breaking Performance', 'New Stadium Opens'],
      entertainment: ['Blockbuster Movie Breaks Records', 'Celebrity Wedding Announcement', 'Award Show Highlights'],
      health: ['Medical Breakthrough Announced', 'New Treatment Shows Promise', 'Health Study Results Released'],
      science: ['Space Mission Success', 'Climate Research Findings', 'Scientific Discovery Made'],
      politics: ['Election Results Announced', 'New Policy Changes', 'International Summit Held']
    };
    
    const images = [
      'https://picsum.photos/400/300?random=1',
      'https://picsum.photos/400/300?random=2', 
      'https://picsum.photos/400/300?random=3',
      'https://picsum.photos/400/300?random=4',
      'https://picsum.photos/400/300?random=5'
    ];
    
    countries.forEach((country, countryIndex) => {
      categories.forEach((category, catIndex) => {
        const headline = headlines[category.slug] ? headlines[category.slug][catIndex % headlines[category.slug].length] : `${category.name} News`;
        sampleNews.push({
          tenantId,
          title: `${headline} - ${country.toUpperCase()}`,
          slug: `${category.slug}-news-${country}-${Date.now()}-${catIndex}`,
          content: `${headline}. Latest ${category.name.toLowerCase()} developments in ${country.toUpperCase()} with detailed coverage and analysis.`,
          excerpt: `${headline} - ${category.name} updates from ${country.toUpperCase()}.`,
          imageUrl: images[catIndex % images.length],
          author: `${country.toUpperCase()} Reporter`,
          category: category._id,
          publishedAt: new Date(Date.now() - (countryIndex * catIndex * 60000)),
          url: `https://example.com/${country}-${category.slug}`,
          sourceName: `${country.toUpperCase()} News`,
          sourceId: `${country}-${catIndex}`
        });
      });
    });
    
    await NewsArticle.deleteMany({});
    const articles = await NewsArticle.insertMany(sampleNews);
    console.log(`✅ Seeded ${articles.length} news articles`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedNews();