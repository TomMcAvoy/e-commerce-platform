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

// Category mapping
const CATEGORY_MAP = {
  "men's clothing": "fashion",
  "women's clothing": "fashion", 
  "jewelery": "fashion",
  "electronics": "electronics",
  "smartphones": "electronics",
  "laptops": "electronics",
  "fragrances": "beauty",
  "skincare": "beauty",
  "groceries": "home",
  "home-decoration": "home",
  "furniture": "home",
  "tops": "fashion",
  "womens-dresses": "fashion",
  "womens-shoes": "fashion",
  "mens-shirts": "fashion",
  "mens-shoes": "fashion",
  "mens-watches": "fashion",
  "womens-watches": "fashion",
  "womens-bags": "fashion",
  "womens-jewellery": "fashion",
  "sunglasses": "fashion",
  "automotive": "electronics",
  "motorcycle": "sports",
  "lighting": "home"
};

function generateSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function mapCategory(originalCategory) {
  return CATEGORY_MAP[originalCategory] || 'electronics';
}

async function fetchFakeStoreProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    
    return products.map(product => ({
      id: `fs-${product.id}`,
      name: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.price * 1.5,
      image: product.image,
      category: mapCategory(product.category),
      provider: 'fakestoreapi',
      rating: product.rating
    }));
  } catch (error) {
    console.error('❌ Fake Store API error:', error.message);
    return [];
  }
}

async function fetchDummyJsonProducts() {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=30');
    const data = await response.json();
    
    return data.products.map(product => ({
      id: `dj-${product.id}`,
      name: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.price * 1.3,
      image: product.thumbnail,
      category: mapCategory(product.category),
      provider: 'dummyjson',
      rating: product.rating
    }));
  } catch (error) {
    console.error('❌ Dummy JSON API error:', error.message);
    return [];
  }
}

async function importFreeProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const tenantId = '6884bf4702e02fe6eb401303';
    let totalImported = 0;
    
    console.log('🆓 Importing FREE products from APIs...\n');
    
    // Fetch from both free APIs
    const [fakeStoreProducts, dummyJsonProducts] = await Promise.all([
      fetchFakeStoreProducts(),
      fetchDummyJsonProducts()
    ]);
    
    const allProducts = [...fakeStoreProducts, ...dummyJsonProducts];
    console.log(`📦 Found ${allProducts.length} total products\n`);
    
    for (const product of allProducts) {
      const slug = generateSlug(product.name);
      const sku = `${product.provider}-${product.id}`;
      
      const productData = {
        tenantId,
        name: product.name.substring(0, 100), // Limit name length
        description: product.description.substring(0, 500), // Limit description
        price: Math.round(product.price * 100) / 100, // Round to 2 decimals
        originalPrice: Math.round(product.originalPrice * 100) / 100,
        images: [product.image],
        category: product.category,
        slug: `${slug}-${Math.random().toString(36).substr(2, 5)}`, // Make unique
        sku,
        isActive: true,
        isDropship: true,
        dropshipProvider: product.provider,
        dropshipProductId: product.id,
        stock: 999,
        tags: [product.category, product.provider]
      };
      
      try {
        await Product.create(productData);
        console.log(`✅ [${product.provider.toUpperCase()}] ${product.name.substring(0, 50)}... - $${product.price}`);
        totalImported++;
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  Skipped duplicate: ${product.name.substring(0, 30)}...`);
        } else {
          console.log(`❌ Failed: ${product.name.substring(0, 30)}... - ${error.message}`);
        }
      }
    }
    
    console.log(`\n🎉 Successfully imported ${totalImported} FREE products!`);
    
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
    
    console.log('\n💡 These are REAL products from free APIs!');
    console.log('   - Fake Store API: Realistic e-commerce data');
    console.log('   - Dummy JSON API: More product variety');
    console.log('   - All products marked as dropship items');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing products:', error);
    process.exit(1);
  }
}

importFreeProducts();