const mongoose = require('mongoose');
require('dotenv').config();

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  level: { type: Number, default: 0 },
  path: String,
  breadcrumbs: [String],
  isFeatured: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  showOnHomepage: { type: Boolean, default: false },
  showInMenu: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  color: String,
  icon: String,
  menuOrder: { type: Number, default: 0 },
  sortOrder: { type: Number, default: 0 },
  productCount: { type: Number, default: 0 },
  commissionRate: { type: Number, default: 5 },
  shortDescription: String,
  keywords: [String],
  metaTitle: String,
  metaDescription: String,
  tenantId: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId('6884bf4702e02fe6eb401303') },
  externalMappings: {
    amazon: String,
    ebay: String,
    walmart: String,
    temu: String,
    alibaba: String,
    shopify: String
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

const comprehensiveCategories = [
  // Electronics & Technology
  { name: 'Electronics & Technology', slug: 'electronics-technology', level: 0, isFeatured: true, isPopular: true, showOnHomepage: true, color: '#007bff', icon: '📱', menuOrder: 1, commissionRate: 5, description: 'Latest electronics, smartphones, computers, and tech gadgets', keywords: ['electronics', 'technology', 'gadgets', 'smartphones'], externalMappings: { amazon: 'Electronics', ebay: 'Consumer Electronics', walmart: 'Electronics', temu: 'Consumer Electronics', alibaba: 'Electronic Components & Supplies' }},
  
  // Fashion & Apparel
  { name: 'Fashion & Apparel', slug: 'fashion-apparel', level: 0, isFeatured: true, isPopular: true, showOnHomepage: true, color: '#e91e63', icon: '👗', menuOrder: 2, commissionRate: 8, description: 'Trendy clothing, shoes, accessories for men, women, and kids', keywords: ['fashion', 'clothing', 'apparel', 'shoes'], externalMappings: { amazon: 'Clothing, Shoes & Jewelry', ebay: 'Clothing, Shoes & Accessories', walmart: 'Clothing', temu: 'Fashion', alibaba: 'Apparel' }},
  
  // Home & Garden
  { name: 'Home & Garden', slug: 'home-garden', level: 0, isFeatured: true, isPopular: true, showOnHomepage: true, color: '#4caf50', icon: '🏠', menuOrder: 3, commissionRate: 6, description: 'Home decor, furniture, garden tools, and household essentials', keywords: ['home', 'garden', 'furniture', 'decor'], externalMappings: { amazon: 'Home & Kitchen', ebay: 'Home & Garden', walmart: 'Home', temu: 'Home & Garden', alibaba: 'Home & Garden' }},
  
  // Health & Beauty
  { name: 'Health & Beauty', slug: 'health-beauty', level: 0, isFeatured: true, isPopular: true, showOnHomepage: true, color: '#ff5722', icon: '💄', menuOrder: 4, commissionRate: 12, description: 'Beauty products, skincare, makeup, health supplements', keywords: ['beauty', 'health', 'skincare', 'cosmetics'], externalMappings: { amazon: 'Beauty & Personal Care', ebay: 'Health & Beauty', walmart: 'Beauty', temu: 'Beauty & Health', alibaba: 'Beauty & Personal Care' }},
  
  // Sports & Outdoors
  { name: 'Sports & Outdoors', slug: 'sports-outdoors', level: 0, isFeatured: true, isPopular: true, showOnHomepage: true, color: '#ff9800', icon: '⚽', menuOrder: 5, commissionRate: 7, description: 'Sports equipment, outdoor gear, fitness accessories', keywords: ['sports', 'outdoors', 'fitness', 'equipment'], externalMappings: { amazon: 'Sports & Outdoors', ebay: 'Sporting Goods', walmart: 'Sports & Outdoors', temu: 'Sports & Entertainment', alibaba: 'Sports & Entertainment' }},
  
  // Baby & Kids
  { name: 'Baby & Kids', slug: 'baby-kids', level: 0, isFeatured: true, isPopular: true, showOnHomepage: true, color: '#ffeb3b', icon: '👶', menuOrder: 6, commissionRate: 10, description: 'Baby gear, kids clothing, toys, educational products', keywords: ['baby', 'kids', 'children', 'toys'], externalMappings: { amazon: 'Baby', ebay: 'Baby', walmart: 'Baby', temu: 'Mother & Kids', alibaba: 'Mother & Kids' }},
  
  // Automotive
  { name: 'Automotive', slug: 'automotive', level: 0, isPopular: true, color: '#9c27b0', icon: '🚗', menuOrder: 7, commissionRate: 5, description: 'Car parts, motorcycle accessories, tools, automotive supplies', keywords: ['automotive', 'car', 'motorcycle', 'parts'], externalMappings: { amazon: 'Automotive', ebay: 'eBay Motors', walmart: 'Auto & Tires', temu: 'Vehicle Parts & Accessories', alibaba: 'Automobiles & Motorcycles' }},
  
  // Books & Media
  { name: 'Books & Media', slug: 'books-media', level: 0, color: '#795548', icon: '📚', menuOrder: 8, commissionRate: 4, description: 'Books, movies, music, games, educational materials', keywords: ['books', 'media', 'movies', 'music'], externalMappings: { amazon: 'Books', ebay: 'Books', walmart: 'Books', temu: 'Books & Audible', alibaba: 'Office & School Supplies' }},
  
  // Toys & Games
  { name: 'Toys & Games', slug: 'toys-games', level: 0, isFeatured: true, isPopular: true, color: '#f44336', icon: '🎮', menuOrder: 9, commissionRate: 9, description: 'Toys, board games, video games, puzzles, collectibles', keywords: ['toys', 'games', 'video games', 'puzzles'], externalMappings: { amazon: 'Toys & Games', ebay: 'Toys & Hobbies', walmart: 'Toys', temu: 'Toys & Games', alibaba: 'Toys & Hobbies' }},
  
  // Jewelry & Watches
  { name: 'Jewelry & Watches', slug: 'jewelry-watches', level: 0, color: '#ffc107', icon: '💎', menuOrder: 10, commissionRate: 15, description: 'Fine jewelry, watches, accessories, precious metals', keywords: ['jewelry', 'watches', 'accessories', 'luxury'], externalMappings: { amazon: 'Jewelry', ebay: 'Jewelry & Watches', walmart: 'Jewelry', temu: 'Jewelry & Accessories', alibaba: 'Jewelry, Eyewear, Watches & Accessories' }},
  
  // Pet Supplies
  { name: 'Pet Supplies', slug: 'pet-supplies', level: 0, isPopular: true, color: '#8bc34a', icon: '🐕', menuOrder: 11, commissionRate: 8, description: 'Pet food, toys, accessories, health products for all pets', keywords: ['pets', 'pet supplies', 'pet food', 'pet toys'], externalMappings: { amazon: 'Pet Supplies', ebay: 'Pet Supplies', walmart: 'Pets', temu: 'Pet Supplies', alibaba: 'Pet Products' }},
  
  // Office & Business
  { name: 'Office & Business', slug: 'office-business', level: 0, color: '#607d8b', icon: '💼', menuOrder: 12, commissionRate: 6, description: 'Office supplies, business equipment, stationery, furniture', keywords: ['office', 'business', 'supplies', 'stationery'], externalMappings: { amazon: 'Office Products', ebay: 'Business & Industrial', walmart: 'Office', temu: 'Computer & Office', alibaba: 'Computer & Office' }},
  
  // Food & Beverages
  { name: 'Food & Beverages', slug: 'food-beverages', level: 0, color: '#ff6f00', icon: '🍕', menuOrder: 13, commissionRate: 3, description: 'Gourmet food, beverages, snacks, cooking ingredients', keywords: ['food', 'beverages', 'snacks', 'gourmet'], externalMappings: { amazon: 'Grocery & Gourmet Food', ebay: 'Food & Beverages', walmart: 'Food', temu: 'Food & Beverages', alibaba: 'Food & Beverage' }},
  
  // Arts & Crafts
  { name: 'Arts & Crafts', slug: 'arts-crafts', level: 0, color: '#e1bee7', icon: '🎨', menuOrder: 14, commissionRate: 7, description: 'Art supplies, craft materials, DIY projects, creative tools', keywords: ['arts', 'crafts', 'DIY', 'creative'], externalMappings: { amazon: 'Arts, Crafts & Sewing', ebay: 'Crafts', walmart: 'Arts & Crafts', temu: 'Arts, Crafts & Sewing', alibaba: 'Arts & Crafts' }},
  
  // Musical Instruments
  { name: 'Musical Instruments', slug: 'musical-instruments', level: 0, color: '#9c27b0', icon: '🎸', menuOrder: 15, commissionRate: 8, description: 'Guitars, keyboards, drums, audio equipment, accessories', keywords: ['music', 'instruments', 'guitar', 'piano'], externalMappings: { amazon: 'Musical Instruments', ebay: 'Musical Instruments & Gear', walmart: 'Musical Instruments', temu: 'Musical Instruments', alibaba: 'Musical Instruments' }},
  
  // Industrial & Scientific
  { name: 'Industrial & Scientific', slug: 'industrial-scientific', level: 0, color: '#455a64', icon: '🔧', menuOrder: 16, commissionRate: 4, description: 'Industrial equipment, scientific instruments, lab supplies', keywords: ['industrial', 'scientific', 'equipment', 'tools'], externalMappings: { amazon: 'Industrial & Scientific', ebay: 'Business & Industrial', walmart: 'Industrial', temu: 'Tools & Hardware', alibaba: 'Machinery' }},
  
  // Collectibles & Antiques
  { name: 'Collectibles & Antiques', slug: 'collectibles-antiques', level: 0, color: '#8d6e63', icon: '🏺', menuOrder: 17, commissionRate: 12, description: 'Rare collectibles, vintage items, antiques, memorabilia', keywords: ['collectibles', 'antiques', 'vintage', 'rare'], externalMappings: { amazon: 'Collectibles & Fine Art', ebay: 'Collectibles', walmart: 'Collectibles', temu: 'Collectibles & Art', alibaba: 'Gifts & Crafts' }}
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB');
    
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');
    
    const createdCategories = await Category.insertMany(comprehensiveCategories.map(cat => ({
      ...cat,
      path: cat.name,
      breadcrumbs: []
    })));
    
    console.log(`✅ Created ${createdCategories.length} comprehensive e-commerce categories`);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedCategories();