const mongoose = require('mongoose');
require('dotenv').config();

// REAL DROPSHIPPING PROVIDERS WITH APIs:

// 1. SPOCKET - European/US suppliers
const SPOCKET_CONFIG = {
  baseUrl: 'https://api.spocket.co/v1',
  // Get free API key at: https://www.spocket.co/integrations/api
  apiKey: process.env.SPOCKET_API_KEY || 'YOUR_SPOCKET_API_KEY',
  endpoints: {
    products: '/products',
    orders: '/orders'
  }
};

// 2. PRINTFUL - Print-on-demand
const PRINTFUL_CONFIG = {
  baseUrl: 'https://api.printful.com',
  // Get API key at: https://www.printful.com/dashboard/store
  apiKey: process.env.PRINTFUL_API_KEY || 'YOUR_PRINTFUL_API_KEY',
  endpoints: {
    products: '/products',
    orders: '/orders'
  }
};

// 3. OBERLO/ALIEXPRESS - Now part of Shopify
const OBERLO_CONFIG = {
  baseUrl: 'https://api.oberlo.com/v1.5',
  apiKey: process.env.OBERLO_API_KEY || 'YOUR_OBERLO_API_KEY'
};

// 4. MODALYST - Fashion dropshipping
const MODALYST_CONFIG = {
  baseUrl: 'https://api.modalyst.co/v1',
  apiKey: process.env.MODALYST_API_KEY || 'YOUR_MODALYST_API_KEY'
};

// 5. WHOLESALE2B - Multi-supplier
const WHOLESALE2B_CONFIG = {
  baseUrl: 'https://www.wholesale2b.com/api',
  apiKey: process.env.WHOLESALE2B_API_KEY || 'YOUR_WHOLESALE2B_API_KEY'
};

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

// SPOCKET API Integration
async function fetchSpocketProducts() {
  if (!SPOCKET_CONFIG.apiKey || SPOCKET_CONFIG.apiKey === 'YOUR_SPOCKET_API_KEY') {
    console.log('⚠️  SPOCKET_API_KEY not configured. Get one at: https://www.spocket.co/integrations/api');
    return [];
  }

  try {
    const response = await fetch(`${SPOCKET_CONFIG.baseUrl}${SPOCKET_CONFIG.endpoints.products}`, {
      headers: {
        'Authorization': `Bearer ${SPOCKET_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Spocket API error: ${response.status}`);
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('❌ Spocket API error:', error.message);
    return [];
  }
}

// PRINTFUL API Integration  
async function fetchPrintfulProducts() {
  if (!PRINTFUL_CONFIG.apiKey || PRINTFUL_CONFIG.apiKey === 'YOUR_PRINTFUL_API_KEY') {
    console.log('⚠️  PRINTFUL_API_KEY not configured. Get one at: https://www.printful.com/dashboard/store');
    return [];
  }

  try {
    const response = await fetch(`${PRINTFUL_CONFIG.baseUrl}${PRINTFUL_CONFIG.endpoints.products}`, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status}`);
    }

    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error('❌ Printful API error:', error.message);
    return [];
  }
}

function generateSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function importRealDropshipProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const tenantId = '6884bf4702e02fe6eb401303';
    let totalImported = 0;

    console.log('\n🌍 REAL DROPSHIPPING PROVIDERS AVAILABLE:');
    console.log('1. SPOCKET - European/US suppliers (Fashion, Electronics, Home)');
    console.log('2. PRINTFUL - Print-on-demand (T-shirts, Mugs, Posters)');
    console.log('3. MODALYST - Fashion dropshipping');
    console.log('4. WHOLESALE2B - Multi-supplier platform');
    console.log('5. OBERLO - AliExpress integration (now Shopify)');

    // Try Spocket first
    console.log('\n📦 Attempting to fetch from SPOCKET...');
    const spocketProducts = await fetchSpocketProducts();
    
    if (spocketProducts.length > 0) {
      console.log(`Found ${spocketProducts.length} products from Spocket`);
      // Process Spocket products...
    }

    // Try Printful
    console.log('\n📦 Attempting to fetch from PRINTFUL...');
    const printfulProducts = await fetchPrintfulProducts();
    
    if (printfulProducts.length > 0) {
      console.log(`Found ${printfulProducts.length} products from Printful`);
      // Process Printful products...
    }

    if (totalImported === 0) {
      console.log('\n⚠️  No API keys configured. To get real products:');
      console.log('\n1. SPOCKET (Recommended for beginners):');
      console.log('   - Sign up: https://www.spocket.co');
      console.log('   - Get API key: https://www.spocket.co/integrations/api');
      console.log('   - Add to .env: SPOCKET_API_KEY=your_key_here');
      
      console.log('\n2. PRINTFUL (Print-on-demand):');
      console.log('   - Sign up: https://www.printful.com');
      console.log('   - Get API key: https://www.printful.com/dashboard/store');
      console.log('   - Add to .env: PRINTFUL_API_KEY=your_key_here');
      
      console.log('\n3. MODALYST (Fashion):');
      console.log('   - Sign up: https://modalyst.co');
      console.log('   - Contact for API access');
      
      console.log('\n4. WHOLESALE2B (Multi-supplier):');
      console.log('   - Sign up: https://www.wholesale2b.com');
      console.log('   - Get API access in dashboard');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

importRealDropshipProducts();