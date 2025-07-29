const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  images: [{ type: String }],
  category: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isDropship: { type: Boolean, default: false },
  dropshipProvider: { type: String },
  dropshipProductId: { type: String },
  stock: { type: Number, default: 0 },
  tags: [{ type: String }]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Sample products that simulate real dropship feeds
const SAMPLE_PRODUCTS = [
  // Fashion
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt perfect for everyday wear',
    price: 19.99,
    originalPrice: 29.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
    category: 'fashion',
    provider: 'printful',
    tags: ['clothing', 'cotton', 'casual']
  },
  {
    name: 'Designer Sunglasses',
    description: 'Stylish UV protection sunglasses with premium frames',
    price: 45.99,
    originalPrice: 79.99,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'],
    category: 'fashion',
    provider: 'spocket',
    tags: ['accessories', 'sunglasses', 'fashion']
  },
  
  // Electronics
  {
    name: 'Wireless Bluetooth Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation',
    price: 79.99,
    originalPrice: 129.99,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'],
    category: 'electronics',
    provider: 'spocket',
    tags: ['audio', 'wireless', 'bluetooth']
  },
  {
    name: 'Smart Phone Stand',
    description: 'Adjustable phone stand for desk and bedside use',
    price: 24.99,
    originalPrice: 39.99,
    images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400'],
    category: 'electronics',
    provider: 'wholesale2b',
    tags: ['phone', 'stand', 'desk']
  },
  
  // Home & Garden
  {
    name: 'LED String Lights',
    description: 'Warm white LED string lights perfect for home decoration',
    price: 16.99,
    originalPrice: 24.99,
    images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'],
    category: 'home',
    provider: 'spocket',
    tags: ['lighting', 'decoration', 'led']
  },
  {
    name: 'Ceramic Plant Pot Set',
    description: 'Set of 3 modern ceramic plant pots with drainage',
    price: 32.99,
    originalPrice: 49.99,
    images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400'],
    category: 'home',
    provider: 'modalyst',
    tags: ['plants', 'ceramic', 'home-decor']
  },
  
  // Sports & Fitness
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with carrying strap',
    price: 29.99,
    originalPrice: 49.99,
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'],
    category: 'sports',
    provider: 'spocket',
    tags: ['yoga', 'fitness', 'exercise']
  },
  {
    name: 'Resistance Bands Set',
    description: 'Complete resistance bands set for home workouts',
    price: 19.99,
    originalPrice: 34.99,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    category: 'sports',
    provider: 'wholesale2b',
    tags: ['fitness', 'resistance', 'workout']
  },
  
  // Beauty
  {
    name: 'Organic Face Serum',
    description: 'Anti-aging face serum with natural ingredients',
    price: 39.99,
    originalPrice: 59.99,
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'],
    category: 'beauty',
    provider: 'modalyst',
    tags: ['skincare', 'organic', 'anti-aging']
  },
  {
    name: 'Makeup Brush Set',
    description: 'Professional makeup brush set with case',
    price: 24.99,
    originalPrice: 39.99,
    images: ['https://images.unsplash.com/photo-1583241800698-9c2e0c4b8e8e?w=400'],
    category: 'beauty',
    provider: 'spocket',
    tags: ['makeup', 'brushes', 'beauty']
  }
];

function generateSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function importSampleProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const tenantId = '6884bf4702e02fe6eb401303';
    let totalImported = 0;
    
    console.log('📦 Importing sample dropship products...\n');
    
    for (const product of SAMPLE_PRODUCTS) {
      const slug = generateSlug(product.name);
      const sku = `${product.provider}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      
      const productData = {
        tenantId,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        category: product.category,
        slug,
        sku,
        isActive: true,
        isDropship: true,
        dropshipProvider: product.provider,
        dropshipProductId: sku,
        stock: 999,
        tags: product.tags
      };
      
      try {
        await Product.findOneAndUpdate(
          { slug, tenantId },
          productData,
          { upsert: true, new: true }
        );
        console.log(`✅ [${product.provider.toUpperCase()}] ${product.name} - $${product.price}`);
        totalImported++;
      } catch (error) {
        console.log(`❌ Failed to import ${product.name}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Successfully imported ${totalImported} sample products!`);
    
    // Show summary
    const categoryCounts = await Product.aggregate([
      { $match: { tenantId: new mongoose.Types.ObjectId(tenantId), isDropship: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Products by category:');
    categoryCounts.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} products`);
    });
    
    const providerCounts = await Product.aggregate([
      { $match: { tenantId: new mongoose.Types.ObjectId(tenantId), isDropship: true } },
      { $group: { _id: '$dropshipProvider', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n🏪 Products by provider:');
    providerCounts.forEach(prov => {
      console.log(`   ${prov._id}: ${prov.count} products`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing products:', error);
    process.exit(1);
  }
}

importSampleProducts();