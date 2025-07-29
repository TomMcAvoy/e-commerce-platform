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
  isActive: { type: Boolean, default: true },
  isDropship: { type: Boolean, default: false },
  dropshipProvider: { type: String },
  dropshipProductId: { type: String },
  stock: { type: Number, default: 0 },
  tags: [{ type: String }]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Mock dropship product feeds (simulating real API responses)
const DROPSHIP_FEEDS = {
  printful: [
    {
      id: 'pf_001',
      name: 'Premium Cotton T-Shirt',
      description: 'High-quality 100% cotton t-shirt with custom printing options',
      price: 19.99,
      originalPrice: 24.99,
      images: ['https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=T-Shirt'],
      category: 'fashion',
      tags: ['clothing', 'apparel', 'cotton', 'custom']
    },
    {
      id: 'pf_002', 
      name: 'Wireless Bluetooth Headphones',
      description: 'Premium wireless headphones with noise cancellation',
      price: 89.99,
      originalPrice: 129.99,
      images: ['https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Headphones'],
      category: 'electronics',
      tags: ['audio', 'wireless', 'bluetooth', 'headphones']
    }
  ],
  spocket: [
    {
      id: 'sp_001',
      name: 'Smart Home Security Camera',
      description: '1080p HD security camera with night vision and mobile app',
      price: 49.99,
      originalPrice: 79.99,
      images: ['https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Camera'],
      category: 'security',
      tags: ['security', 'camera', 'smart-home', 'surveillance']
    },
    {
      id: 'sp_002',
      name: 'Organic Skincare Set',
      description: 'Complete organic skincare routine with natural ingredients',
      price: 34.99,
      originalPrice: 49.99,
      images: ['https://via.placeholder.com/400x400/96CEB4/FFFFFF?text=Skincare'],
      category: 'beauty',
      tags: ['skincare', 'organic', 'beauty', 'natural']
    }
  ],
  aliexpress: [
    {
      id: 'ae_001',
      name: 'Fitness Resistance Bands Set',
      description: 'Complete resistance bands set for home workouts',
      price: 15.99,
      originalPrice: 29.99,
      images: ['https://via.placeholder.com/400x400/FECA57/FFFFFF?text=Fitness'],
      category: 'sports',
      tags: ['fitness', 'exercise', 'resistance', 'workout']
    },
    {
      id: 'ae_002',
      name: 'LED Desk Lamp with USB Charging',
      description: 'Modern LED desk lamp with wireless charging pad',
      price: 39.99,
      originalPrice: 59.99,
      images: ['https://via.placeholder.com/400x400/FF9FF3/FFFFFF?text=Lamp'],
      category: 'home',
      tags: ['lighting', 'desk', 'led', 'charging']
    }
  ]
};

function generateSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function importDropshipProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const tenantId = '6884bf4702e02fe6eb401303';
    let totalImported = 0;
    
    for (const [provider, products] of Object.entries(DROPSHIP_FEEDS)) {
      console.log(`\n📦 Importing products from ${provider.toUpperCase()}...`);
      
      for (const product of products) {
        const slug = generateSlug(product.name);
        
        const productData = {
          tenantId,
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          images: product.images,
          category: product.category,
          slug,
          sku: `${provider}-${product.id}`,
          isActive: true,
          isDropship: true,
          dropshipProvider: provider,
          dropshipProductId: product.id,
          stock: 999,
          tags: product.tags
        };
        
        try {
          await Product.findOneAndUpdate(
            { slug, tenantId },
            productData,
            { upsert: true, new: true }
          );
          console.log(`   ✅ ${product.name}`);
          totalImported++;
        } catch (error) {
          console.log(`   ❌ Failed to import ${product.name}:`, error.message);
        }
      }
    }
    
    console.log(`\n🎉 Successfully imported ${totalImported} dropship products!`);
    
    // Show summary by category
    const categoryCounts = await Product.aggregate([
      { $match: { tenantId: new mongoose.Types.ObjectId(tenantId), isDropship: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Products by category:');
    categoryCounts.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} products`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing dropship products:', error);
    process.exit(1);
  }
}

importDropshipProducts();