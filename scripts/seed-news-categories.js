const mongoose = require('mongoose');
require('dotenv').config();

const newsCategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  color: String,
  icon: String,
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  tenantId: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId('6884bf4702e02fe6eb401303') },
  googleNewsCategory: String,
  keywords: [String]
}, { timestamps: true });

const NewsCategory = mongoose.model('NewsCategory', newsCategorySchema);

const googleNewsCategories = [
  { name: 'World', slug: 'world', description: 'International news and global events', color: '#1976d2', icon: '🌍', googleNewsCategory: 'world', keywords: ['international', 'global', 'world news'], sortOrder: 1 },
  { name: 'Nation', slug: 'nation', description: 'National news and domestic affairs', color: '#d32f2f', icon: '🏛️', googleNewsCategory: 'nation', keywords: ['national', 'domestic', 'politics'], sortOrder: 2 },
  { name: 'Business', slug: 'business', description: 'Business news, markets, and economy', color: '#388e3c', icon: '💼', googleNewsCategory: 'business', keywords: ['business', 'economy', 'markets', 'finance'], sortOrder: 3 },
  { name: 'Technology', slug: 'technology', description: 'Tech news, gadgets, and innovation', color: '#7b1fa2', icon: '💻', googleNewsCategory: 'technology', keywords: ['technology', 'tech', 'innovation', 'gadgets'], sortOrder: 4 },
  { name: 'Entertainment', slug: 'entertainment', description: 'Movies, TV, music, and celebrity news', color: '#f57c00', icon: '🎬', googleNewsCategory: 'entertainment', keywords: ['entertainment', 'movies', 'music', 'celebrity'], sortOrder: 5 },
  { name: 'Sports', slug: 'sports', description: 'Sports news, scores, and updates', color: '#0288d1', icon: '⚽', googleNewsCategory: 'sports', keywords: ['sports', 'games', 'scores', 'athletics'], sortOrder: 6 },
  { name: 'Science', slug: 'science', description: 'Scientific discoveries and research', color: '#00796b', icon: '🔬', googleNewsCategory: 'science', keywords: ['science', 'research', 'discovery', 'study'], sortOrder: 7 },
  { name: 'Health', slug: 'health', description: 'Health news, medical breakthroughs', color: '#c2185b', icon: '🏥', googleNewsCategory: 'health', keywords: ['health', 'medical', 'wellness', 'medicine'], sortOrder: 8 },
  { name: 'Top Stories', slug: 'top-stories', description: 'Breaking news and top headlines', color: '#d84315', icon: '📰', googleNewsCategory: 'top-stories', keywords: ['breaking', 'headlines', 'top news'], sortOrder: 0 },
  { name: 'Local', slug: 'local', description: 'Local news and community events', color: '#5d4037', icon: '🏘️', googleNewsCategory: 'local', keywords: ['local', 'community', 'regional'], sortOrder: 9 },
  { name: 'Politics', slug: 'politics', description: 'Political news and government affairs', color: '#303f9f', icon: '🗳️', googleNewsCategory: 'politics', keywords: ['politics', 'government', 'election', 'policy'], sortOrder: 10 },
  { name: 'Opinion', slug: 'opinion', description: 'Opinion pieces and editorial content', color: '#616161', icon: '💭', googleNewsCategory: 'opinion', keywords: ['opinion', 'editorial', 'commentary'], sortOrder: 11 }
];

async function seedNewsCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB');
    
    await NewsCategory.deleteMany({});
    console.log('🗑️  Cleared existing news categories');
    
    const createdCategories = await NewsCategory.insertMany(googleNewsCategories);
    console.log(`✅ Created ${createdCategories.length} Google News categories`);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ News category seeding failed:', error);
    process.exit(1);
  }
}

seedNewsCategories();