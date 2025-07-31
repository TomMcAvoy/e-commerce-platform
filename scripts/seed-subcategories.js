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

async function seedSubcategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB');
    
    const electronics = await Category.findOne({ slug: 'electronics-technology' });
    const fashion = await Category.findOne({ slug: 'fashion-apparel' });
    const home = await Category.findOne({ slug: 'home-garden' });
    const health = await Category.findOne({ slug: 'health-beauty' });
    
    const subcategories = [
      // Electronics subcategories
      { name: 'Smartphones & Tablets', slug: 'smartphones-tablets', parentCategory: electronics._id, level: 1, path: 'Electronics & Technology/Smartphones & Tablets', breadcrumbs: ['Electronics & Technology'], isFeatured: true, isPopular: true, menuOrder: 1, commissionRate: 3, description: 'Latest smartphones, tablets, and mobile accessories', keywords: ['smartphone', 'tablet', 'mobile', 'iphone', 'android'], externalMappings: { amazon: 'Cell Phones & Accessories', temu: 'Phones & Telecommunications', alibaba: 'Telecommunications' }},
      
      { name: 'Computers & Laptops', slug: 'computers-laptops', parentCategory: electronics._id, level: 1, path: 'Electronics & Technology/Computers & Laptops', breadcrumbs: ['Electronics & Technology'], isFeatured: true, isPopular: true, menuOrder: 2, commissionRate: 2, description: 'Desktop computers, laptops, gaming PCs, accessories', keywords: ['computer', 'laptop', 'desktop', 'pc', 'mac'], externalMappings: { amazon: 'Computers & Tablets', temu: 'Computer & Office', alibaba: 'Computer & Office' }},
      
      { name: 'Audio & Headphones', slug: 'audio-headphones', parentCategory: electronics._id, level: 1, path: 'Electronics & Technology/Audio & Headphones', breadcrumbs: ['Electronics & Technology'], isFeatured: true, isPopular: true, menuOrder: 3, commissionRate: 8, description: 'Headphones, speakers, earbuds, audio equipment', keywords: ['headphones', 'speakers', 'audio', 'earbuds', 'wireless'], externalMappings: { amazon: 'Headphones', temu: 'Consumer Electronics', alibaba: 'Consumer Electronics' }},
      
      // Fashion subcategories  
      { name: 'Women\'s Clothing', slug: 'womens-clothing', parentCategory: fashion._id, level: 1, path: 'Fashion & Apparel/Women\'s Clothing', breadcrumbs: ['Fashion & Apparel'], isFeatured: true, isPopular: true, menuOrder: 1, commissionRate: 10, description: 'Dresses, tops, pants, outerwear for women', keywords: ['women', 'clothing', 'dresses', 'tops', 'fashion'], externalMappings: { amazon: 'Women\'s Clothing', temu: 'Women\'s Clothing', alibaba: 'Women\'s Clothing' }},
      
      { name: 'Men\'s Clothing', slug: 'mens-clothing', parentCategory: fashion._id, level: 1, path: 'Fashion & Apparel/Men\'s Clothing', breadcrumbs: ['Fashion & Apparel'], isFeatured: true, isPopular: true, menuOrder: 2, commissionRate: 8, description: 'Shirts, pants, suits, casual wear for men', keywords: ['men', 'clothing', 'shirts', 'pants', 'suits'], externalMappings: { amazon: 'Men\'s Clothing', temu: 'Men\'s Clothing', alibaba: 'Men\'s Clothing' }},
      
      { name: 'Shoes & Footwear', slug: 'shoes-footwear', parentCategory: fashion._id, level: 1, path: 'Fashion & Apparel/Shoes & Footwear', breadcrumbs: ['Fashion & Apparel'], isFeatured: true, isPopular: true, menuOrder: 3, commissionRate: 12, description: 'Sneakers, boots, heels, sandals, athletic shoes', keywords: ['shoes', 'footwear', 'sneakers', 'boots', 'heels'], externalMappings: { amazon: 'Shoes', temu: 'Shoes', alibaba: 'Shoes' }},
      
      // Home & Garden subcategories
      { name: 'Furniture', slug: 'furniture', parentCategory: home._id, level: 1, path: 'Home & Garden/Furniture', breadcrumbs: ['Home & Garden'], isFeatured: true, isPopular: true, menuOrder: 1, commissionRate: 6, description: 'Living room, bedroom, office, outdoor furniture', keywords: ['furniture', 'sofa', 'bed', 'table', 'chair'], externalMappings: { amazon: 'Furniture', temu: 'Furniture', alibaba: 'Furniture' }},
      
      { name: 'Home Decor', slug: 'home-decor', parentCategory: home._id, level: 1, path: 'Home & Garden/Home Decor', breadcrumbs: ['Home & Garden'], isFeatured: true, isPopular: true, menuOrder: 2, commissionRate: 8, description: 'Wall art, lighting, rugs, decorative accessories', keywords: ['decor', 'decoration', 'wall art', 'lighting', 'rugs'], externalMappings: { amazon: 'Home Decor', temu: 'Home Decor', alibaba: 'Home Decor' }},
      
      { name: 'Kitchen & Dining', slug: 'kitchen-dining', parentCategory: home._id, level: 1, path: 'Home & Garden/Kitchen & Dining', breadcrumbs: ['Home & Garden'], isFeatured: true, isPopular: true, menuOrder: 3, commissionRate: 7, description: 'Cookware, appliances, dinnerware, kitchen tools', keywords: ['kitchen', 'dining', 'cookware', 'appliances', 'utensils'], externalMappings: { amazon: 'Kitchen & Dining', temu: 'Kitchen & Dining', alibaba: 'Home Appliances' }},
      
      // Health & Beauty subcategories
      { name: 'Skincare', slug: 'skincare', parentCategory: health._id, level: 1, path: 'Health & Beauty/Skincare', breadcrumbs: ['Health & Beauty'], isFeatured: true, isPopular: true, menuOrder: 1, commissionRate: 15, description: 'Face care, moisturizers, serums, anti-aging products', keywords: ['skincare', 'face care', 'moisturizer', 'serum', 'anti-aging'], externalMappings: { amazon: 'Skin Care', temu: 'Beauty & Health', alibaba: 'Beauty & Personal Care' }},
      
      { name: 'Makeup & Cosmetics', slug: 'makeup-cosmetics', parentCategory: health._id, level: 1, path: 'Health & Beauty/Makeup & Cosmetics', breadcrumbs: ['Health & Beauty'], isFeatured: true, isPopular: true, menuOrder: 2, commissionRate: 18, description: 'Foundation, lipstick, eyeshadow, makeup tools', keywords: ['makeup', 'cosmetics', 'foundation', 'lipstick', 'eyeshadow'], externalMappings: { amazon: 'Makeup', temu: 'Beauty & Health', alibaba: 'Beauty & Personal Care' }},
      
      { name: 'Hair Care', slug: 'hair-care', parentCategory: health._id, level: 1, path: 'Health & Beauty/Hair Care', breadcrumbs: ['Health & Beauty'], isFeatured: true, isPopular: true, menuOrder: 3, commissionRate: 12, description: 'Shampoo, conditioner, styling products, hair tools', keywords: ['hair care', 'shampoo', 'conditioner', 'styling', 'hair tools'], externalMappings: { amazon: 'Hair Care', temu: 'Beauty & Health', alibaba: 'Beauty & Personal Care' }}
    ];
    
    const createdSubs = await Category.insertMany(subcategories);
    console.log(`✅ Created ${createdSubs.length} subcategories`);
    
    // Update parent categories with children
    await Category.findByIdAndUpdate(electronics._id, { 
      children: createdSubs.filter(c => c.parentCategory.equals(electronics._id)).map(c => c._id) 
    });
    await Category.findByIdAndUpdate(fashion._id, { 
      children: createdSubs.filter(c => c.parentCategory.equals(fashion._id)).map(c => c._id) 
    });
    await Category.findByIdAndUpdate(home._id, { 
      children: createdSubs.filter(c => c.parentCategory.equals(home._id)).map(c => c._id) 
    });
    await Category.findByIdAndUpdate(health._id, { 
      children: createdSubs.filter(c => c.parentCategory.equals(health._id)).map(c => c._id) 
    });
    
    console.log('✅ Updated parent categories with children');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Subcategory seeding failed:', error);
    process.exit(1);
  }
}

seedSubcategories();