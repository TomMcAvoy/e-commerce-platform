#!/bin/bash
echo "🌱 SEEDING CATEGORIES FOR WHITESTART SYSTEM SECURITY"
echo "=================================================="
echo "Following Database Patterns - Categories Only"

echo ""
echo "1️⃣ Verifying Whitestart tenant exists..."
mongosh --quiet shoppingcart --eval "
const tenantId = ObjectId('6884bf4702e02fe6eb401303');
const tenant = db.tenants.findOne({ _id: tenantId });

if (tenant) {
  console.log('✅ Whitestart tenant confirmed:');
  console.log('  Name:', tenant.name);
  console.log('  Status:', tenant.status);
  console.log('  Plan:', tenant.plan);
  console.log('  Active:', tenant.isActive);
} else {
  console.log('❌ ERROR: Whitestart tenant not found!');
  console.log('Expected ID: 6884bf4702e02fe6eb401303');
  process.exit(1);
}
"

echo ""
echo "2️⃣ Checking existing categories..."
mongosh --quiet shoppingcart --eval "
const tenantId = ObjectId('6884bf4702e02fe6eb401303');
const existingCount = db.categories.countDocuments({ tenantId });
console.log('📂 Existing categories for Whitestart:', existingCount);

if (existingCount > 0) {
  console.log('🔄 Removing existing categories to ensure clean state...');
  const deleteResult = db.categories.deleteMany({ tenantId });
  console.log('🗑️ Removed', deleteResult.deletedCount, 'existing categories');
}
"

echo ""
echo "3️⃣ Seeding comprehensive category structure..."
mongosh --quiet shoppingcart --eval "
const tenantId = ObjectId('6884bf4702e02fe6eb401303');

console.log('🌱 Creating root categories (Level 0) - Amazon/Temu/Alibaba popular...');

// Root Categories following API Endpoints Structure
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
    showInMenu: true,
    isActive: true,
    color: '#007bff',
    icon: '📱',
    menuOrder: 1,
    sortOrder: 1,
    productCount: 0,
    commissionRate: 5,
    description: 'Latest electronics, smartphones, computers, and tech gadgets from top brands',
    shortDescription: 'Electronics & Tech',
    keywords: ['electronics', 'technology', 'gadgets', 'smartphones', 'computers', 'audio'],
    metaTitle: 'Electronics & Technology - Latest Gadgets & Devices',
    metaDescription: 'Shop the latest electronics, smartphones, computers, and technology gadgets at Whitestart.',
    externalMappings: {
      amazon: 'Electronics',
      temu: 'Consumer Electronics',
      alibaba: 'Electronic Components & Supplies',
      walmart: 'Electronics',
      ebay: 'Consumer Electronics'
    },
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
    showInMenu: true,
    isActive: true,
    color: '#e91e63',
    icon: '👗',
    menuOrder: 2,
    sortOrder: 2,
    productCount: 0,
    commissionRate: 8,
    description: 'Trendy clothing, shoes, accessories, and fashion for men, women, and kids',
    shortDescription: 'Fashion & Style',
    keywords: ['fashion', 'clothing', 'apparel', 'shoes', 'accessories', 'style'],
    metaTitle: 'Fashion & Apparel - Clothing, Shoes & Accessories',
    metaDescription: 'Discover the latest fashion trends, clothing, shoes, and accessories for all occasions.',
    externalMappings: {
      amazon: 'Clothing, Shoes & Jewelry',
      temu: 'Fashion',
      alibaba: 'Apparel',
      walmart: 'Clothing',
      ebay: 'Clothing, Shoes & Accessories'
    },
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
    showInMenu: true,
    isActive: true,
    color: '#4caf50',
    icon: '🏠',
    menuOrder: 3,
    sortOrder: 3,
    productCount: 0,
    commissionRate: 6,
    description: 'Home improvement, furniture, kitchen appliances, and garden supplies',
    shortDescription: 'Home & Living',
    keywords: ['home', 'garden', 'furniture', 'decor', 'kitchen', 'improvement'],
    metaTitle: 'Home & Garden - Furniture, Decor & Garden Supplies',
    metaDescription: 'Transform your home with furniture, decor, kitchen essentials, and garden supplies.',
    externalMappings: {
      amazon: 'Home & Kitchen',
      temu: 'Home & Garden',
      alibaba: 'Home & Garden',
      walmart: 'Home',
      ebay: 'Home & Garden'
    },
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
    showInMenu: true,
    isActive: true,
    color: '#ff5722',
    icon: '💄',
    menuOrder: 4,
    sortOrder: 4,
    productCount: 0,
    commissionRate: 12,
    description: 'Beauty products, skincare, makeup, health supplements, and wellness',
    shortDescription: 'Beauty & Wellness',
    keywords: ['beauty', 'health', 'skincare', 'cosmetics', 'makeup', 'wellness'],
    metaTitle: 'Health & Beauty - Skincare, Makeup & Wellness Products',
    metaDescription: 'Discover premium beauty products, skincare, makeup, and health supplements.',
    externalMappings: {
      amazon: 'Beauty & Personal Care',
      temu: 'Beauty & Health',
      alibaba: 'Beauty & Personal Care',
      walmart: 'Beauty',
      ebay: 'Health & Beauty'
    },
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
    showInMenu: true,
    isActive: true,
    color: '#ff9800',
    icon: '⚽',
    menuOrder: 5,
    sortOrder: 5,
    productCount: 0,
    commissionRate: 7,
    description: 'Sporting goods, fitness equipment, outdoor gear, and recreation',
    shortDescription: 'Sports & Fitness',
    keywords: ['sports', 'outdoors', 'fitness', 'exercise', 'recreation', 'gear'],
    metaTitle: 'Sports & Outdoors - Fitness Equipment & Outdoor Gear',
    metaDescription: 'Shop sporting goods, fitness equipment, and outdoor gear for all your activities.',
    externalMappings: {
      amazon: 'Sports & Outdoors',
      temu: 'Sports & Entertainment',
      alibaba: 'Sports & Entertainment',
      walmart: 'Sports & Outdoors',
      ebay: 'Sporting Goods'
    },
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
    showInMenu: true,
    isActive: true,
    color: '#ffeb3b',
    icon: '👶',
    menuOrder: 6,
    sortOrder: 6,
    productCount: 0,
    commissionRate: 10,
    description: 'Baby gear, kids clothing, toys, educational products, and essentials',
    shortDescription: 'Baby & Children',
    keywords: ['baby', 'kids', 'children', 'toys', 'gear', 'clothing'],
    metaTitle: 'Baby & Kids - Gear, Clothing, Toys & Essentials',
    metaDescription: 'Everything for babies and kids - gear, clothing, toys, and educational products.',
    externalMappings: {
      amazon: 'Baby',
      temu: 'Mother & Kids',
      alibaba: 'Mother & Kids',
      walmart: 'Baby',
      ebay: 'Baby'
    },
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
    showOnHomepage: false,
    showInMenu: true,
    isActive: true,
    color: '#f44336',
    icon: '🧸',
    menuOrder: 7,
    sortOrder: 7,
    productCount: 0,
    commissionRate: 15,
    description: 'Toys, games, puzzles, and entertainment for all ages',
    shortDescription: 'Toys & Fun',
    keywords: ['toys', 'games', 'puzzles', 'entertainment', 'fun', 'children'],
    metaTitle: 'Toys & Games - Fun for All Ages',
    metaDescription: 'Discover amazing toys, games, puzzles, and entertainment products.',
    externalMappings: {
      amazon: 'Toys & Games',
      temu: 'Toys & Hobbies',
      alibaba: 'Toys & Hobbies',
      walmart: 'Toys',
      ebay: 'Toys & Hobbies'
    },
    tenantId
  },
  {
    _id: ObjectId(),
    name: 'Automotive',
    slug: 'automotive',
    level: 0,
    path: 'Automotive',
    breadcrumbs: [],
    isFeatured: false,
    isPopular: true,
    showOnHomepage: false,
    showInMenu: true,
    isActive: true,
    color: '#9c27b0',
    icon: '🚗',
    menuOrder: 8,
    sortOrder: 8,
    productCount: 0,
    commissionRate: 5,
    description: 'Car parts, motorcycle accessories, tools, and automotive supplies',
    shortDescription: 'Auto & Moto',
    keywords: ['automotive', 'car', 'motorcycle', 'parts', 'accessories', 'tools'],
    metaTitle: 'Automotive - Parts, Accessories & Tools',
    metaDescription: 'Shop car parts, motorcycle accessories, automotive tools and supplies.',
    externalMappings: {
      amazon: 'Automotive',
      temu: 'Vehicle Parts & Accessories',
      alibaba: 'Automobiles & Motorcycles',
      walmart: 'Auto & Tires',
      ebay: 'eBay Motors'
    },
    tenantId
  }
];

const rootResult = db.categories.insertMany(rootCategories);
console.log('✅ Seeded', Object.keys(rootResult.insertedIds).length, 'root categories');

// Get root category references for subcategories
const electronics = db.categories.findOne({ slug: 'electronics-technology', tenantId });
const fashion = db.categories.findOne({ slug: 'fashion-apparel', tenantId });
const home = db.categories.findOne({ slug: 'home-garden', tenantId });

console.log('📱 Creating Electronics subcategories (Level 1)...');

// Electronics Subcategories - Most Popular
const electronicsSubcategories = [
  {
    _id: ObjectId(),
    name: 'Smartphones & Tablets',
    slug: 'smartphones-tablets',
    parentCategory: electronics._id,
    level: 1,
    path: 'Electronics & Technology/Smartphones & Tablets',
    breadcrumbs: ['Electronics & Technology'],
    isFeatured: true,
    isPopular: true,
    showInMenu: true,
    isActive: true,
    menuOrder: 1,
    productCount: 0,
    commissionRate: 3,
    description: 'Latest smartphones, tablets, and mobile accessories from top brands',
    keywords: ['smartphone', 'tablet', 'mobile', 'iphone', 'android', 'accessories'],
    externalMappings: {
      amazon: 'Cell Phones & Accessories',
      temu: 'Mobile Phones',
      alibaba: 'Mobile Phones'
    },
    tenantId
  },
  {
    _id: ObjectId(),
    name: 'Computers & Laptops',
    slug: 'computers-laptops',
    parentCategory: electronics._id,
    level: 1,
    path: 'Electronics & Technology/Computers & Laptops',
    breadcrumbs: ['Electronics & Technology'],
    isFeatured: true,
    isPopular: true,
    showInMenu: true,
    isActive: true,
    menuOrder: 2,
    productCount: 0,
    commissionRate: 2,
    description: 'Desktop computers, laptops, gaming PCs, and computer accessories',
    keywords: ['computer', 'laptop', 'desktop', 'pc', 'mac', 'gaming'],
    externalMappings: {
      amazon: 'Computers & Tablets',
      temu: 'Computer & Office',
      alibaba: 'Computer & Office'
    },
    tenantId
  },
  {
    _id: ObjectId(),
    name: 'Audio & Headphones',
    slug: 'audio-headphones',
    parentCategory: electronics._id,
    level: 1,
    path: 'Electronics & Technology/Audio & Headphones',
    breadcrumbs: ['Electronics & Technology'],
    isFeatured: true,
    isPopular: true,
    showInMenu: true,
    isActive: true,
    menuOrder: 3,
    productCount: 0,
    commissionRate: 8,
    description: 'Headphones, speakers, earbuds, and professional audio equipment',
    keywords: ['headphones', 'speakers', 'audio', 'earbuds', 'wireless', 'bluetooth'],
    externalMappings: {
      amazon: 'Headphones',
      temu: 'Consumer Electronics',
      alibaba: 'Consumer Electronics'
    },
    tenantId
  }
];

db.categories.insertMany(electronicsSubcategories);

console.log('👗 Creating Fashion subcategories (Level 1)...');

// Fashion Subcategories
const fashionSubcategories = [
  {
    _id: ObjectId(),
    name: 'Mens Clothing',
    slug: 'mens-clothing',
    parentCategory: fashion._id,
    level: 1,
    path: 'Fashion & Apparel/Mens Clothing',
    breadcrumbs: ['Fashion & Apparel'],
    isFeatured: true,
    isPopular: true,
    showInMenu: true,
    isActive: true,
    menuOrder: 1,
    productCount: 0,
    commissionRate: 15,
    description: 'Mens shirts, pants, suits, jackets, and casual wear',
    keywords: ['mens', 'clothing', 'shirts', 'pants', 'suits', 'jackets'],
    externalMappings: {
      amazon: 'Mens Clothing',
      temu: 'Mens Clothing',
      alibaba: 'Mens Clothing'
    },
    tenantId
  },
  {
    _id: ObjectId(),
    name: 'Womens Clothing',
    slug: 'womens-clothing',
    parentCategory: fashion._id,
    level: 1,
    path: 'Fashion & Apparel/Womens Clothing',
    breadcrumbs: ['Fashion & Apparel'],
    isFeatured: true,
    isPopular: true,
    showInMenu: true,
    isActive: true,
    menuOrder: 2,
    productCount: 0,
    commissionRate: 18,
    description: 'Womens dresses, tops, bottoms, and formal wear',
    keywords: ['womens', 'clothing', 'dresses', 'tops', 'fashion', 'formal'],
    externalMappings: {
      amazon: 'Womens Clothing',
      temu: 'Womens Clothing',
      alibaba: 'Womens Clothing'
    },
    tenantId
  },
  {
    _id: ObjectId(),
    name: 'Shoes & Footwear',
    slug: 'shoes-footwear',
    parentCategory: fashion._id,
    level: 1,
    path: 'Fashion & Apparel/Shoes & Footwear',
    breadcrumbs: ['Fashion & Apparel'],
    isFeatured: true,
    isPopular: true,
    showInMenu: true,
    isActive: true,
    menuOrder: 3,
    productCount: 0,
    commissionRate: 12,
    description: 'Athletic shoes, dress shoes, boots, sandals, and footwear',
    keywords: ['shoes', 'footwear', 'sneakers', 'boots', 'sandals', 'athletic'],
    externalMappings: {
      amazon: 'Shoes',
      temu: 'Shoes',
      alibaba: 'Shoes'
    },
    tenantId
  }
];

db.categories.insertMany(fashionSubcategories);

console.log('🏠 Creating Home & Garden subcategories (Level 1)...');

// Home & Garden Subcategories
const homeSubcategories = [
  {
    _id: ObjectId(),
    name: 'Kitchen & Dining',
    slug: 'kitchen-dining',
    parentCategory: home._id,
    level: 1,
    path: 'Home & Garden/Kitchen & Dining',
    breadcrumbs: ['Home & Garden'],
    isFeatured: true,
    isPopular: true,
    showInMenu: true,
    isActive: true,
    menuOrder: 1,
    productCount: 0,
    commissionRate: 8,
    description: 'Kitchen appliances, cookware, dining accessories, and utensils',
    keywords: ['kitchen', 'dining', 'cookware', 'appliances', 'utensils', 'tableware'],
    externalMappings: {
      amazon: 'Kitchen & Dining',
      temu: 'Kitchen, Dining & Bar',
      alibaba: 'Home Appliances'
    },
    tenantId
  },
  {
    _id: ObjectId(),
    name: 'Furniture',
    slug: 'furniture',
    parentCategory: home._id,
    level: 1,
    path: 'Home & Garden/Furniture',
    breadcrumbs: ['Home & Garden'],
    isFeatured: true,
    isPopular: true,
    showInMenu: true,
    isActive: true,
    menuOrder: 2,
    productCount: 0,
    commissionRate: 6,
    description: 'Living room, bedroom, office, and outdoor furniture',
    keywords: ['furniture', 'sofa', 'bed', 'table', 'chair', 'storage'],
    externalMappings: {
      amazon: 'Furniture',
      temu: 'Furniture',
      alibaba: 'Furniture'
    },
    tenantId
  }
];

db.categories.insertMany(homeSubcategories);

// Update parent categories with children references following Backend Structure
console.log('🔗 Updating parent-child relationships...');
const allSubcategories = db.categories.find({ tenantId, level: 1 });
allSubcategories.forEach(function(subcat) {
  db.categories.updateOne(
    { _id: subcat.parentCategory },
    { \$addToSet: { children: subcat._id } }
  );
});

console.log('📊 WHITESTART CATEGORIES SEEDING COMPLETE!');
const totalCategories = db.categories.countDocuments({ tenantId });
const rootCount = db.categories.countDocuments({ tenantId, level: 0 });
const subCount = db.categories.countDocuments({ tenantId, level: 1 });
const featuredCount = db.categories.countDocuments({ tenantId, isFeatured: true });
const popularCount = db.categories.countDocuments({ tenantId, isPopular: true });
const homepageCount = db.categories.countDocuments({ tenantId, showOnHomepage: true });

console.log('✅ Total Categories:', totalCategories);
console.log('📂 Root Categories (Level 0):', rootCount);
console.log('📱 Subcategories (Level 1):', subCount);
console.log('⭐ Featured Categories:', featuredCount);
console.log('🔥 Popular Categories:', popularCount);
console.log('🏠 Homepage Categories:', homepageCount);
"

echo ""
echo "4️⃣ Testing Whitestart categories API..."
curl -s "http://localhost:3000/api/categories?limit=5" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '{
    success: .success,
    total: .total,
    structure: .structure,
    categories: (.data | map(.name))
  }'

echo ""
echo "⭐ Testing featured categories..."
curl -s "http://localhost:3000/api/categories/featured?limit=8" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '{
    success: .success,
    featuredCount: .total,
    featuredCategories: (.data | map(.name))
  }'

echo ""
echo "🔥 Testing popular categories..."
curl -s "http://localhost:3000/api/categories/popular?limit=10" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '{
    success: .success,
    popularCount: .total,
    popularCategories: (.data | map(.name))
  }'

echo ""
echo "🌳 Testing category tree structure..."
curl -s "http://localhost:3000/api/categories?tree=true&limit=3" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '{
    success: .success,
    structure: .structure,
    rootCategories: .total
  }'

echo ""
echo "✅ WHITESTART CATEGORIES READY!"
echo "============================="
echo ""
echo "🎯 SUMMARY:"
echo "  Tenant: Whitestart System Security (preserved)"
echo "  Admin: Preserved (not touched)"
echo "  Categories: 16 total (8 root + 8 subcategories)"
echo "  Structure: Amazon/Temu/Alibaba popular categories"
echo "  External Mappings: Ready for dropshipping integration"
echo ""
echo "🔗 ACCESS POINTS:"
echo "  Categories API: http://localhost:3000/api/categories"
echo "  Featured: http://localhost:3000/api/categories/featured"
echo "  Primary Debug Dashboard: http://localhost:3001/debug"
echo ""
echo "🧪 QUICK TEST COMMANDS:"
echo 'curl -s "http://localhost:3000/api/categories" -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq "."'
echo 'curl -s "http://localhost:3000/api/categories/featured" -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq "."'
