#!/bin/bash
echo "🌱 SEEDING COMPREHENSIVE GLOBAL CATEGORIES"
echo "=========================================="
echo "Following Amazon, Temu, Alibaba popular categories"

# Following Critical Development Workflows
mongosh --quiet shoppingcart --eval "
const tenantId = ObjectId('6884bf4702e02fe6eb401303');

console.log('🧹 Cleaning existing categories for tenant:', tenantId);
db.categories.deleteMany({ tenantId });

console.log('📂 Seeding Root Categories (Level 0)...');

// Root Categories (Level 0) - Based on Amazon/Temu/Alibaba top categories
const rootCategories = [
  { 
    _id: ObjectId(), 
    name: 'Electronics & Technology', 
    slug: 'electronics-technology', 
    level: 0, 
    path: 'Electronics & Technology', 
    breadcrumbs: [], 
    isFeatured: true, 
    isPopular: true,
    showOnHomepage: true, 
    color: '#007bff', 
    icon: '📱', 
    menuOrder: 1,
    description: 'Latest electronics, gadgets, and technology products',
    keywords: ['electronics', 'technology', 'gadgets', 'smartphones', 'computers'],
    externalMappings: { amazon: 'Electronics', temu: 'Consumer Electronics', alibaba: 'Electronic Components & Supplies' },
    tenantId 
  },
  { 
    _id: ObjectId(), 
    name: 'Fashion & Apparel', 
    slug: 'fashion-apparel', 
    level: 0, 
    path: 'Fashion & Apparel', 
    breadcrumbs: [], 
    isFeatured: true, 
    isPopular: true,
    showOnHomepage: true, 
    color: '#e91e63', 
    icon: '👗', 
    menuOrder: 2,
    description: 'Trendy clothing, shoes, and fashion accessories',
    keywords: ['fashion', 'clothing', 'apparel', 'shoes', 'accessories'],
    externalMappings: { amazon: 'Clothing, Shoes & Jewelry', temu: 'Fashion', alibaba: 'Apparel' },
    tenantId 
  },
  { 
    _id: ObjectId(), 
    name: 'Home & Garden', 
    slug: 'home-garden', 
    level: 0, 
    path: 'Home & Garden', 
    breadcrumbs: [], 
    isFeatured: true, 
    isPopular: true,
    showOnHomepage: true, 
    color: '#4caf50', 
    icon: '🏠', 
    menuOrder: 3,
    description: 'Home improvement, furniture, and garden supplies',
    keywords: ['home', 'garden', 'furniture', 'decor', 'improvement'],
    externalMappings: { amazon: 'Home & Kitchen', temu: 'Home & Garden', alibaba: 'Home & Garden' },
    tenantId 
  },
  { 
    _id: ObjectId(), 
    name: 'Health & Beauty', 
    slug: 'health-beauty', 
    level: 0, 
    path: 'Health & Beauty', 
    breadcrumbs: [], 
    isFeatured: true, 
    isPopular: true,
    showOnHomepage: true, 
    color: '#ff5722', 
    icon: '💄', 
    menuOrder: 4,
    description: 'Beauty products, skincare, and health essentials',
    keywords: ['beauty', 'health', 'skincare', 'cosmetics', 'wellness'],
    externalMappings: { amazon: 'Beauty & Personal Care', temu: 'Beauty & Health', alibaba: 'Beauty & Personal Care' },
    tenantId 
  },
  { 
    _id: ObjectId(), 
    name: 'Sports & Outdoors', 
    slug: 'sports-outdoors', 
    level: 0, 
    path: 'Sports & Outdoors', 
    breadcrumbs: [], 
    isFeatured: true, 
    isPopular: true,
    showOnHomepage: true, 
    color: '#ff9800', 
    icon: '⚽', 
    menuOrder: 5,
    description: 'Sporting goods, outdoor gear, and fitness equipment',
    keywords: ['sports', 'outdoors', 'fitness', 'exercise', 'recreation'],
    externalMappings: { amazon: 'Sports & Outdoors', temu: 'Sports & Entertainment', alibaba: 'Sports & Entertainment' },
    tenantId 
  },
  { 
    _id: ObjectId(), 
    name: 'Automotive & Motorcycles', 
    slug: 'automotive-motorcycles', 
    level: 0, 
    path: 'Automotive & Motorcycles', 
    breadcrumbs: [], 
    isFeatured: false, 
    isPopular: true,
    showOnHomepage: false, 
    color: '#9c27b0', 
    icon: '🚗', 
    menuOrder: 6,
    description: 'Car parts, accessories, and motorcycle gear',
    keywords: ['automotive', 'car', 'motorcycle', 'parts', 'accessories'],
    externalMappings: { amazon: 'Automotive', temu: 'Vehicle Parts & Accessories', alibaba: 'Automobiles & Motorcycles' },
    tenantId 
  },
  { 
    _id: ObjectId(), 
    name: 'Baby & Kids', 
    slug: 'baby-kids', 
    level: 0, 
    path: 'Baby & Kids', 
    breadcrumbs: [], 
    isFeatured: true, 
    isPopular: true,
    showOnHomepage: true, 
    color: '#ffeb3b', 
    icon: '👶', 
    menuOrder: 7,
    description: 'Baby gear, kids clothing, toys, and essentials',
    keywords: ['baby', 'kids', 'children', 'toys', 'gear'],
    externalMappings: { amazon: 'Baby', temu: 'Mother & Kids', alibaba: 'Mother & Kids' },
    tenantId 
  },
  { 
    _id: ObjectId(), 
    name: 'Toys & Games', 
    slug: 'toys-games', 
    level: 0, 
    path: 'Toys & Games', 
    breadcrumbs: [], 
    isFeatured: true, 
    isPopular: true,
    showOnHomepage: true, 
    color: '#f44336', 
    icon: '🧸', 
    menuOrder: 8,
    description: 'Toys, games, puzzles, and entertainment',
    keywords: ['toys', 'games', 'puzzles', 'entertainment', 'fun'],
    externalMappings: { amazon: 'Toys & Games', temu: 'Toys & Hobbies', alibaba: 'Toys & Hobbies' },
    tenantId 
  },
  { 
    _id: ObjectId(), 
    name: 'Tools & Hardware', 
    slug: 'tools-hardware', 
    level: 0, 
    path: 'Tools & Hardware', 
    breadcrumbs: [], 
    isFeatured: false, 
    isPopular: true,
    showOnHomepage: false, 
    color: '#607d8b', 
    icon: '🔧', 
    menuOrder: 9,
    description: 'Power tools, hand tools, and hardware supplies',
    keywords: ['tools', 'hardware', 'construction', 'repair', 'diy'],
    externalMappings: { amazon: 'Tools & Home Improvement', temu: 'Tools & Hardware', alibaba: 'Tools & Hardware' },
    tenantId 
  },
  { 
    _id: ObjectId(), 
    name: 'Office & Business', 
    slug: 'office-business', 
    level: 0, 
    path: 'Office & Business', 
    breadcrumbs: [], 
    isFeatured: false, 
    isPopular: false,
    showOnHomepage: false, 
    color: '#795548', 
    icon: '💼', 
    menuOrder: 10,
    description: 'Office supplies, business equipment, and stationery',
    keywords: ['office', 'business', 'supplies', 'stationery', 'equipment'],
    externalMappings: { amazon: 'Office Products', temu: 'Office & School Supplies', alibaba: 'Office & School Supplies' },
    tenantId 
  },
  { 
    _id: ObjectId(), 
    name: 'Pet Supplies', 
    slug: 'pet-supplies', 
    level: 0, 
    path: 'Pet Supplies', 
    breadcrumbs: [], 
    isFeatured: false, 
    isPopular: true,
    showOnHomepage: false, 
    color: '#3f51b5', 
    icon: '🐕', 
    menuOrder: 11,
    description: 'Pet food, toys, accessories, and care products',
    keywords: ['pets', 'animals', 'food', 'toys', 'care'],
    externalMappings: { amazon: 'Pet Supplies', temu: 'Pet Supplies', alibaba: 'Pet Products' },
    tenantId 
  },
  { 
    _id: ObjectId(), 
    name: 'Food & Beverages', 
    slug: 'food-beverages', 
    level: 0, 
    path: 'Food & Beverages', 
    breadcrumbs: [], 
    isFeatured: false, 
    isPopular: false,
    showOnHomepage: false, 
    color: '#8bc34a', 
    icon: '🍕', 
    menuOrder: 12,
    description: 'Groceries, snacks, beverages, and gourmet foods',
    keywords: ['food', 'beverages', 'grocery', 'snacks', 'drinks'],
    externalMappings: { amazon: 'Grocery & Gourmet Food', temu: 'Food & Beverages', alibaba: 'Food & Beverage' },
    tenantId 
  }
];

const rootResult = db.categories.insertMany(rootCategories);
console.log('✅ Inserted', Object.keys(rootResult.insertedIds).length, 'root categories');

// Get inserted root categories for references
const electronics = db.categories.findOne({ slug: 'electronics-technology', tenantId });
const fashion = db.categories.findOne({ slug: 'fashion-apparel', tenantId });
const home = db.categories.findOne({ slug: 'home-garden', tenantId });
const health = db.categories.findOne({ slug: 'health-beauty', tenantId });
const sports = db.categories.findOne({ slug: 'sports-outdoors', tenantId });
const automotive = db.categories.findOne({ slug: 'automotive-motorcycles', tenantId });
const baby = db.categories.findOne({ slug: 'baby-kids', tenantId });
const toys = db.categories.findOne({ slug: 'toys-games', tenantId });
const tools = db.categories.findOne({ slug: 'tools-hardware', tenantId });
const office = db.categories.findOne({ slug: 'office-business', tenantId });
const pets = db.categories.findOne({ slug: 'pet-supplies', tenantId });
const food = db.categories.findOne({ slug: 'food-beverages', tenantId });

console.log('📱 Seeding Electronics & Technology (Level 1)...');

// Electronics & Technology Main Categories (Most Popular from Amazon/Temu/Alibaba)
const electronicsCategories = [
  { _id: ObjectId(), name: 'Smartphones & Tablets', slug: 'smartphones-tablets', parentCategory: electronics._id, level: 1, path: 'Electronics & Technology/Smartphones & Tablets', breadcrumbs: ['Electronics & Technology'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 1, description: 'Latest smartphones, tablets, and mobile accessories', keywords: ['smartphone', 'tablet', 'mobile', 'iphone', 'android'], externalMappings: { amazon: 'Cell Phones & Accessories', temu: 'Mobile Phones', alibaba: 'Mobile Phones' }, tenantId },
  { _id: ObjectId(), name: 'Computers & Laptops', slug: 'computers-laptops', parentCategory: electronics._id, level: 1, path: 'Electronics & Technology/Computers & Laptops', breadcrumbs: ['Electronics & Technology'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 2, description: 'Desktop computers, laptops, and computer accessories', keywords: ['computer', 'laptop', 'desktop', 'pc', 'mac'], externalMappings: { amazon: 'Computers & Tablets', temu: 'Computer & Office', alibaba: 'Computer & Office' }, tenantId },
  { _id: ObjectId(), name: 'Audio & Headphones', slug: 'audio-headphones', parentCategory: electronics._id, level: 1, path: 'Electronics & Technology/Audio & Headphones', breadcrumbs: ['Electronics & Technology'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 3, description: 'Headphones, speakers, and audio equipment', keywords: ['headphones', 'speakers', 'audio', 'music', 'sound'], externalMappings: { amazon: 'Headphones', temu: 'Consumer Electronics', alibaba: 'Consumer Electronics' }, tenantId },
  { _id: ObjectId(), name: 'TV & Home Theater', slug: 'tv-home-theater', parentCategory: electronics._id, level: 1, path: 'Electronics & Technology/TV & Home Theater', breadcrumbs: ['Electronics & Technology'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 4, description: 'Televisions, projectors, and home theater systems', keywords: ['tv', 'television', 'projector', 'theater', 'entertainment'], externalMappings: { amazon: 'TV & Video', temu: 'Consumer Electronics', alibaba: 'Consumer Electronics' }, tenantId },
  { _id: ObjectId(), name: 'Gaming & Consoles', slug: 'gaming-consoles', parentCategory: electronics._id, level: 1, path: 'Electronics & Technology/Gaming & Consoles', breadcrumbs: ['Electronics & Technology'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 5, description: 'Gaming consoles, PC gaming, and gaming accessories', keywords: ['gaming', 'console', 'playstation', 'xbox', 'nintendo'], externalMappings: { amazon: 'Video Games', temu: 'Consumer Electronics', alibaba: 'Consumer Electronics' }, tenantId },
  { _id: ObjectId(), name: 'Cameras & Photography', slug: 'cameras-photography', parentCategory: electronics._id, level: 1, path: 'Electronics & Technology/Cameras & Photography', breadcrumbs: ['Electronics & Technology'], isFeatured: false, isPopular: false, showInMenu: true, menuOrder: 6, description: 'Digital cameras, lenses, and photography equipment', keywords: ['camera', 'photography', 'lens', 'dslr', 'mirrorless'], externalMappings: { amazon: 'Camera & Photo', temu: 'Consumer Electronics', alibaba: 'Consumer Electronics' }, tenantId },
  { _id: ObjectId(), name: 'Smart Home & IoT', slug: 'smart-home-iot', parentCategory: electronics._id, level: 1, path: 'Electronics & Technology/Smart Home & IoT', breadcrumbs: ['Electronics & Technology'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 7, description: 'Smart home devices, IoT gadgets, and automation', keywords: ['smart home', 'iot', 'automation', 'alexa', 'google'], externalMappings: { amazon: 'Smart Home', temu: 'Consumer Electronics', alibaba: 'Electronic Components & Supplies' }, tenantId },
  { _id: ObjectId(), name: 'Wearable Technology', slug: 'wearable-technology', parentCategory: electronics._id, level: 1, path: 'Electronics & Technology/Wearable Technology', breadcrumbs: ['Electronics & Technology'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 8, description: 'Smartwatches, fitness trackers, and wearable devices', keywords: ['smartwatch', 'fitness tracker', 'wearable', 'apple watch', 'fitbit'], externalMappings: { amazon: 'Wearable Technology', temu: 'Consumer Electronics', alibaba: 'Consumer Electronics' }, tenantId }
];

db.categories.insertMany(electronicsCategories);

console.log('👗 Seeding Fashion & Apparel (Level 1)...');

// Fashion & Apparel Main Categories
const fashionCategories = [
  { _id: ObjectId(), name: 'Mens Clothing', slug: 'mens-clothing', parentCategory: fashion._id, level: 1, path: 'Fashion & Apparel/Mens Clothing', breadcrumbs: ['Fashion & Apparel'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 1, description: 'Mens shirts, pants, suits, and casual wear', keywords: ['mens', 'clothing', 'shirts', 'pants', 'suits'], externalMappings: { amazon: 'Mens Clothing', temu: 'Mens Clothing', alibaba: 'Mens Clothing' }, tenantId },
  { _id: ObjectId(), name: 'Womens Clothing', slug: 'womens-clothing', parentCategory: fashion._id, level: 1, path: 'Fashion & Apparel/Womens Clothing', breadcrumbs: ['Fashion & Apparel'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 2, description: 'Womens dresses, tops, bottoms, and formal wear', keywords: ['womens', 'clothing', 'dresses', 'tops', 'fashion'], externalMappings: { amazon: 'Womens Clothing', temu: 'Womens Clothing', alibaba: 'Womens Clothing' }, tenantId },
  { _id: ObjectId(), name: 'Shoes & Footwear', slug: 'shoes-footwear', parentCategory: fashion._id, level: 1, path: 'Fashion & Apparel/Shoes & Footwear', breadcrumbs: ['Fashion & Apparel'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 3, description: 'Athletic shoes, dress shoes, boots, and sandals', keywords: ['shoes', 'footwear', 'sneakers', 'boots', 'sandals'], externalMappings: { amazon: 'Shoes', temu: 'Shoes', alibaba: 'Shoes' }, tenantId },
  { _id: ObjectId(), name: 'Bags & Accessories', slug: 'bags-accessories', parentCategory: fashion._id, level: 1, path: 'Fashion & Apparel/Bags & Accessories', breadcrumbs: ['Fashion & Apparel'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 4, description: 'Handbags, backpacks, wallets, and fashion accessories', keywords: ['bags', 'accessories', 'handbags', 'backpacks', 'wallets'], externalMappings: { amazon: 'Handbags & Wallets', temu: 'Bags & Shoes', alibaba: 'Luggage, Bags & Cases' }, tenantId },
  { _id: ObjectId(), name: 'Jewelry & Watches', slug: 'jewelry-watches', parentCategory: fashion._id, level: 1, path: 'Fashion & Apparel/Jewelry & Watches', breadcrumbs: ['Fashion & Apparel'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 5, description: 'Fine jewelry, fashion jewelry, and watches', keywords: ['jewelry', 'watches', 'necklaces', 'rings', 'bracelets'], externalMappings: { amazon: 'Jewelry', temu: 'Jewelry & Accessories', alibaba: 'Jewelry & Accessories' }, tenantId },
  { _id: ObjectId(), name: 'Underwear & Sleepwear', slug: 'underwear-sleepwear', parentCategory: fashion._id, level: 1, path: 'Fashion & Apparel/Underwear & Sleepwear', breadcrumbs: ['Fashion & Apparel'], isFeatured: false, isPopular: false, showInMenu: true, menuOrder: 6, description: 'Undergarments, lingerie, and sleepwear', keywords: ['underwear', 'lingerie', 'sleepwear', 'pajamas', 'intimates'], externalMappings: { amazon: 'Underwear & Intimates', temu: 'Underwear & Sleepwears', alibaba: 'Underwear & Sleepwears' }, tenantId }
];

db.categories.insertMany(fashionCategories);

console.log('🏠 Seeding Home & Garden (Level 1)...');

// Home & Garden Main Categories
const homeCategories = [
  { _id: ObjectId(), name: 'Furniture', slug: 'furniture', parentCategory: home._id, level: 1, path: 'Home & Garden/Furniture', breadcrumbs: ['Home & Garden'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 1, description: 'Living room, bedroom, dining, and office furniture', keywords: ['furniture', 'sofa', 'bed', 'table', 'chair'], externalMappings: { amazon: 'Furniture', temu: 'Furniture', alibaba: 'Furniture' }, tenantId },
  { _id: ObjectId(), name: 'Kitchen & Dining', slug: 'kitchen-dining', parentCategory: home._id, level: 1, path: 'Home & Garden/Kitchen & Dining', breadcrumbs: ['Home & Garden'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 2, description: 'Kitchen appliances, cookware, and dining accessories', keywords: ['kitchen', 'dining', 'cookware', 'appliances', 'utensils'], externalMappings: { amazon: 'Kitchen & Dining', temu: 'Kitchen, Dining & Bar', alibaba: 'Home Appliances' }, tenantId },
  { _id: ObjectId(), name: 'Home Decor', slug: 'home-decor', parentCategory: home._id, level: 1, path: 'Home & Garden/Home Decor', breadcrumbs: ['Home & Garden'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 3, description: 'Wall art, decorations, and home styling', keywords: ['decor', 'decoration', 'art', 'styling', 'ornaments'], externalMappings: { amazon: 'Home Décor', temu: 'Home Decor', alibaba: 'Home Decor' }, tenantId },
  { _id: ObjectId(), name: 'Bedding & Bath', slug: 'bedding-bath', parentCategory: home._id, level: 1, path: 'Home & Garden/Bedding & Bath', breadcrumbs: ['Home & Garden'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 4, description: 'Sheets, towels, and bathroom accessories', keywords: ['bedding', 'bath', 'sheets', 'towels', 'bathroom'], externalMappings: { amazon: 'Bedding', temu: 'Home Textiles', alibaba: 'Home Textile' }, tenantId },
  { _id: ObjectId(), name: 'Garden & Outdoor', slug: 'garden-outdoor', parentCategory: home._id, level: 1, path: 'Home & Garden/Garden & Outdoor', breadcrumbs: ['Home & Garden'], isFeatured: false, isPopular: false, showInMenu: true, menuOrder: 5, description: 'Gardening tools, outdoor furniture, and patio accessories', keywords: ['garden', 'outdoor', 'patio', 'plants', 'landscaping'], externalMappings: { amazon: 'Patio, Lawn & Garden', temu: 'Home & Garden', alibaba: 'Home & Garden' }, tenantId },
  { _id: ObjectId(), name: 'Storage & Organization', slug: 'storage-organization', parentCategory: home._id, level: 1, path: 'Home & Garden/Storage & Organization', breadcrumbs: ['Home & Garden'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 6, description: 'Storage solutions, organizers, and space-saving products', keywords: ['storage', 'organization', 'containers', 'shelving', 'closet'], externalMappings: { amazon: 'Storage & Organization', temu: 'Home & Garden', alibaba: 'Home Storage & Organization' }, tenantId }
];

db.categories.insertMany(homeCategories);

console.log('💄 Seeding Health & Beauty (Level 1)...');

// Health & Beauty Main Categories
const healthBeautyCategories = [
  { _id: ObjectId(), name: 'Skincare', slug: 'skincare', parentCategory: health._id, level: 1, path: 'Health & Beauty/Skincare', breadcrumbs: ['Health & Beauty'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 1, description: 'Face care, moisturizers, serums, and treatments', keywords: ['skincare', 'moisturizer', 'serum', 'cleanser', 'antiaging'], externalMappings: { amazon: 'Skin Care', temu: 'Beauty & Health', alibaba: 'Beauty & Personal Care' }, tenantId },
  { _id: ObjectId(), name: 'Makeup & Cosmetics', slug: 'makeup-cosmetics', parentCategory: health._id, level: 1, path: 'Health & Beauty/Makeup & Cosmetics', breadcrumbs: ['Health & Beauty'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 2, description: 'Foundation, lipstick, eyeshadow, and makeup tools', keywords: ['makeup', 'cosmetics', 'foundation', 'lipstick', 'eyeshadow'], externalMappings: { amazon: 'Makeup', temu: 'Beauty & Health', alibaba: 'Beauty & Personal Care' }, tenantId },
  { _id: ObjectId(), name: 'Hair Care', slug: 'hair-care', parentCategory: health._id, level: 1, path: 'Health & Beauty/Hair Care', breadcrumbs: ['Health & Beauty'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 3, description: 'Shampoo, conditioner, styling products, and hair tools', keywords: ['hair care', 'shampoo', 'conditioner', 'styling', 'treatment'], externalMappings: { amazon: 'Hair Care', temu: 'Beauty & Health', alibaba: 'Beauty & Personal Care' }, tenantId },
  { _id: ObjectId(), name: 'Personal Care', slug: 'personal-care', parentCategory: health._id, level: 1, path: 'Health & Beauty/Personal Care', breadcrumbs: ['Health & Beauty'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 4, description: 'Body care, hygiene products, and grooming essentials', keywords: ['personal care', 'body care', 'hygiene', 'grooming', 'deodorant'], externalMappings: { amazon: 'Personal Care', temu: 'Beauty & Health', alibaba: 'Beauty & Personal Care' }, tenantId },
  { _id: ObjectId(), name: 'Vitamins & Supplements', slug: 'vitamins-supplements', parentCategory: health._id, level: 1, path: 'Health & Beauty/Vitamins & Supplements', breadcrumbs: ['Health & Beauty'], isFeatured: false, isPopular: false, showInMenu: true, menuOrder: 5, description: 'Vitamins, minerals, protein, and health supplements', keywords: ['vitamins', 'supplements', 'protein', 'minerals', 'nutrition'], externalMappings: { amazon: 'Vitamins & Dietary Supplements', temu: 'Beauty & Health', alibaba: 'Beauty & Personal Care' }, tenantId },
  { _id: ObjectId(), name: 'Fragrance', slug: 'fragrance', parentCategory: health._id, level: 1, path: 'Health & Beauty/Fragrance', breadcrumbs: ['Health & Beauty'], isFeatured: false, isPopular: false, showInMenu: true, menuOrder: 6, description: 'Perfumes, colognes, and body sprays', keywords: ['fragrance', 'perfume', 'cologne', 'body spray', 'scent'], externalMappings: { amazon: 'Fragrance', temu: 'Beauty & Health', alibaba: 'Beauty & Personal Care' }, tenantId }
];

db.categories.insertMany(healthBeautyCategories);

console.log('⚽ Seeding Sports & Outdoors (Level 1)...');

// Sports & Outdoors Main Categories
const sportsCategories = [
  { _id: ObjectId(), name: 'Exercise & Fitness', slug: 'exercise-fitness', parentCategory: sports._id, level: 1, path: 'Sports & Outdoors/Exercise & Fitness', breadcrumbs: ['Sports & Outdoors'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 1, description: 'Gym equipment, weights, yoga, and fitness accessories', keywords: ['fitness', 'exercise', 'gym', 'weights', 'yoga'], externalMappings: { amazon: 'Exercise & Fitness', temu: 'Sports & Entertainment', alibaba: 'Sports & Entertainment' }, tenantId },
  { _id: ObjectId(), name: 'Team Sports', slug: 'team-sports', parentCategory: sports._id, level: 1, path: 'Sports & Outdoors/Team Sports', breadcrumbs: ['Sports & Outdoors'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 2, description: 'Football, basketball, soccer, and team sport equipment', keywords: ['team sports', 'football', 'basketball', 'soccer', 'baseball'], externalMappings: { amazon: 'Team Sports', temu: 'Sports & Entertainment', alibaba: 'Sports & Entertainment' }, tenantId },
  { _id: ObjectId(), name: 'Outdoor Recreation', slug: 'outdoor-recreation', parentCategory: sports._id, level: 1, path: 'Sports & Outdoors/Outdoor Recreation', breadcrumbs: ['Sports & Outdoors'], isFeatured: false, isPopular: false, showInMenu: true, menuOrder: 3, description: 'Camping, hiking, fishing, and outdoor adventure gear', keywords: ['outdoor', 'camping', 'hiking', 'fishing', 'adventure'], externalMappings: { amazon: 'Outdoor Recreation', temu: 'Sports & Entertainment', alibaba: 'Sports & Entertainment' }, tenantId },
  { _id: ObjectId(), name: 'Water Sports', slug: 'water-sports', parentCategory: sports._id, level: 1, path: 'Sports & Outdoors/Water Sports', breadcrumbs: ['Sports & Outdoors'], isFeatured: false, isPopular: false, showInMenu: true, menuOrder: 4, description: 'Swimming, surfing, diving, and water sport equipment', keywords: ['water sports', 'swimming', 'surfing', 'diving', 'boating'], externalMappings: { amazon: 'Water Sports', temu: 'Sports & Entertainment', alibaba: 'Sports & Entertainment' }, tenantId },
  { _id: ObjectId(), name: 'Athletic Apparel', slug: 'athletic-apparel', parentCategory: sports._id, level: 1, path: 'Sports & Outdoors/Athletic Apparel', breadcrumbs: ['Sports & Outdoors'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 5, description: 'Sports clothing, activewear, and athletic shoes', keywords: ['athletic wear', 'sportswear', 'activewear', 'athletic shoes', 'performance'], externalMappings: { amazon: 'Sports & Outdoors', temu: 'Sports & Entertainment', alibaba: 'Sports & Entertainment' }, tenantId }
];

db.categories.insertMany(sportsCategories);

console.log('👶 Seeding Baby & Kids (Level 1)...');

// Baby & Kids Main Categories
const babyKidsCategories = [
  { _id: ObjectId(), name: 'Baby Gear', slug: 'baby-gear', parentCategory: baby._id, level: 1, path: 'Baby & Kids/Baby Gear', breadcrumbs: ['Baby & Kids'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 1, description: 'Strollers, car seats, high chairs, and baby equipment', keywords: ['baby gear', 'stroller', 'car seat', 'high chair', 'crib'], externalMappings: { amazon: 'Baby Products', temu: 'Mother & Kids', alibaba: 'Mother & Kids' }, tenantId },
  { _id: ObjectId(), name: 'Kids Clothing', slug: 'kids-clothing', parentCategory: baby._id, level: 1, path: 'Baby & Kids/Kids Clothing', breadcrumbs: ['Baby & Kids'], isFeatured: true, isPopular: true, showInMenu: true, menuOrder: 2, description: 'Baby and childrens clothing, shoes, and accessories', keywords: ['kids clothing', 'baby clothes', 'children wear', 'kids shoes', 'infant'], externalMappings: { amazon: 'Baby Products', temu: 'Mother & Kids', alibaba: 'Mother & Kids' }, tenantId },
  { _id: ObjectId(), name: 'Baby Care & Health', slug: 'baby-care-health', parentCategory: baby._id, level: 1, path: 'Baby & Kids/Baby Care & Health', breadcrumbs: ['Baby & Kids'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 3, description: 'Diapers, baby food, health products, and care essentials', keywords: ['baby care', 'diapers', 'baby food', 'health', 'feeding'], externalMappings: { amazon: 'Baby Products', temu: 'Mother & Kids', alibaba: 'Mother & Kids' }, tenantId },
  { _id: ObjectId(), name: 'Educational Toys', slug: 'educational-toys', parentCategory: baby._id, level: 1, path: 'Baby & Kids/Educational Toys', breadcrumbs: ['Baby & Kids'], isFeatured: false, isPopular: false, showInMenu: true, menuOrder: 4, description: 'Learning toys, books, and educational games for children', keywords: ['educational toys', 'learning', 'books', 'games', 'development'], externalMappings: { amazon: 'Toys & Games', temu: 'Toys & Hobbies', alibaba: 'Toys & Hobbies' }, tenantId }
];

db.categories.insertMany(babyKidsCategories);

console.log('🧸 Seeding Toys & Games (Level 1)...');

// Toys & Games Main Categories
const toysCategories = [
  { _id: ObjectId(), name: 'Action Figures & Collectibles', slug: 'action-figures-collectibles', parentCategory: toys._id, level: 1, path: 'Toys & Games/Action Figures & Collectibles', breadcrumbs: ['Toys & Games'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 1, description: 'Action figures, collectibles, and character toys', keywords: ['action figures', 'collectibles', 'toys', 'characters', 'figures'], externalMappings: { amazon: 'Toys & Games', temu: 'Toys & Hobbies', alibaba: 'Toys & Hobbies' }, tenantId },
  { _id: ObjectId(), name: 'Board Games & Puzzles', slug: 'board-games-puzzles', parentCategory: toys._id, level: 1, path: 'Toys & Games/Board Games & Puzzles', breadcrumbs: ['Toys & Games'], isFeatured: false, isPopular: false, showInMenu: true, menuOrder: 2, description: 'Board games, card games, and jigsaw puzzles', keywords: ['board games', 'puzzles', 'card games', 'family games', 'strategy'], externalMappings: { amazon: 'Toys & Games', temu: 'Toys & Hobbies', alibaba: 'Toys & Hobbies' }, tenantId },
  { _id: ObjectId(), name: 'Building Sets', slug: 'building-sets', parentCategory: toys._id, level: 1, path: 'Toys & Games/Building Sets', breadcrumbs: ['Toys & Games'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 3, description: 'LEGO, building blocks, and construction toys', keywords: ['building sets', 'lego', 'blocks', 'construction', 'creativity'], externalMappings: { amazon: 'Toys & Games', temu: 'Toys & Hobbies', alibaba: 'Toys & Hobbies' }, tenantId },
  { _id: ObjectId(), name: 'Dolls & Plush Toys', slug: 'dolls-plush-toys', parentCategory: toys._id, level: 1, path: 'Toys & Games/Dolls & Plush Toys', breadcrumbs: ['Toys & Games'], isFeatured: false, isPopular: true, showInMenu: true, menuOrder: 4, description: 'Dolls, stuffed animals, and plush toys', keywords: ['dolls', 'plush', 'stuffed animals', 'teddy bears', 'soft toys'], externalMappings: { amazon: 'Toys & Games', temu: 'Toys & Hobbies', alibaba: 'Toys & Hobbies' }, tenantId }
];

db.categories.insertMany(toysCategories);

// Update root categories with children references
const allLevel1Categories = db.categories.find({ tenantId, level: 1 });

allLevel1Categories.forEach(function(cat) {
  db.categories.updateOne(
    { _id: cat.parentCategory }, 
    { \$addToSet: { children: cat._id } }
  );
});

console.log('📊 SEEDING SUMMARY:');
const totalCategories = db.categories.countDocuments({ tenantId });
const rootCount = db.categories.countDocuments({ tenantId, level: 0 });
const mainCount = db.categories.countDocuments({ tenantId, level: 1 });
const featuredCount = db.categories.countDocuments({ tenantId, isFeatured: true });
const popularCount = db.categories.countDocuments({ tenantId, isPopular: true });
const homepageCount = db.categories.countDocuments({ tenantId, showOnHomepage: true });

console.log('✅ Total Categories:', totalCategories);
console.log('�� Root Categories (Level 0):', rootCount);
console.log('📱 Main Categories (Level 1):', mainCount);
console.log('⭐ Featured Categories:', featuredCount);
console.log('🔥 Popular Categories:', popularCount);
console.log('🏠 Homepage Categories:', homepageCount);
console.log('');
console.log('🎯 Sample Categories:');
db.categories.find({ tenantId, isFeatured: true }).limit(5).forEach(function(cat) {
  console.log('  ✓', cat.name, '(' + cat.slug + ')');
});
console.log('');
console.log('✅ COMPREHENSIVE GLOBAL CATEGORY SEEDING COMPLETE!');
"

echo ""
echo "🧪 TESTING SEEDED CATEGORIES"
echo "============================"

echo "1️⃣ Testing categories endpoint..."
curl -s "http://localhost:3000/api/categories?limit=5" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success, (.data | length), .data[0].name // "No data"'

echo ""
echo "2️⃣ Testing featured categories..."
curl -s "http://localhost:3000/api/categories?featured=true&limit=3" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success, (.data | length), .data[0].name // "No data"'

echo ""
echo "3️⃣ Testing homepage categories..."
curl -s "http://localhost:3000/api/categories?homepage=true" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success, (.data | length)'

echo ""
echo "🔗 ACCESS POINTS:"
echo "Primary Debug Dashboard: http://localhost:3001/debug"
echo "API Health: http://localhost:3000/health"
echo "Categories API: http://localhost:3000/api/categories"
echo ""
echo "✅ GLOBAL CATEGORY SEEDING COMPLETED!"
echo "Following Amazon, Temu, and Alibaba popular categories"
