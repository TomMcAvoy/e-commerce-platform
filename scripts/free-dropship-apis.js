const mongoose = require('mongoose');
require('dotenv').config();

// FREE DROPSHIPPING APIs FOR TESTING:

console.log('🆓 FREE DROPSHIPPING APIs FOR TESTING:\n');

console.log('1. PRINTFUL (FREE TIER):');
console.log('   - 🆓 Free API access');
console.log('   - 📦 Print-on-demand products');
console.log('   - 🔗 Sign up: https://www.printful.com');
console.log('   - 📋 Get API key: Dashboard > Settings > API');
console.log('   - 💡 Products: T-shirts, mugs, posters, phone cases\n');

console.log('2. FAKE STORE API (FREE TESTING):');
console.log('   - 🆓 Completely free');
console.log('   - 🔗 URL: https://fakestoreapi.com');
console.log('   - 📋 No API key needed');
console.log('   - 💡 Perfect for testing and development\n');

console.log('3. DUMMY JSON API (FREE):');
console.log('   - 🆓 Free with rate limits');
console.log('   - 🔗 URL: https://dummyjson.com');
console.log('   - 📋 No API key needed');
console.log('   - 💡 Mock e-commerce data\n');

console.log('4. SPOCKET (FREE TRIAL):');
console.log('   - 🆓 14-day free trial');
console.log('   - 🔗 Sign up: https://www.spocket.co');
console.log('   - 📋 API access in trial');
console.log('   - 💡 Real EU/US suppliers\n');

console.log('5. MODALYST (FREE PLAN):');
console.log('   - 🆓 Free plan available');
console.log('   - 🔗 Sign up: https://modalyst.co');
console.log('   - 📋 Limited API calls');
console.log('   - 💡 Fashion dropshipping\n');

// FAKE STORE API Integration (Completely Free)
async function fetchFakeStoreProducts() {
  try {
    console.log('📦 Fetching from FAKE STORE API (Free)...');
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    
    console.log(`✅ Found ${products.length} products from Fake Store API`);
    return products.map(product => ({
      id: product.id,
      name: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      provider: 'fakestoreapi'
    }));
  } catch (error) {
    console.error('❌ Fake Store API error:', error.message);
    return [];
  }
}

// DUMMY JSON API Integration (Free)
async function fetchDummyJsonProducts() {
  try {
    console.log('📦 Fetching from DUMMY JSON API (Free)...');
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    
    console.log(`✅ Found ${data.products.length} products from Dummy JSON API`);
    return data.products.map(product => ({
      id: product.id,
      name: product.title,
      description: product.description,
      price: product.price,
      image: product.thumbnail,
      category: product.category,
      provider: 'dummyjson'
    }));
  } catch (error) {
    console.error('❌ Dummy JSON API error:', error.message);
    return [];
  }
}

// PRINTFUL API (Free tier)
async function fetchPrintfulProducts() {
  const apiKey = process.env.PRINTFUL_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️  PRINTFUL_API_KEY not set. Get free API key at: https://www.printful.com');
    return [];
  }

  try {
    console.log('📦 Fetching from PRINTFUL API (Free tier)...');
    const response = await fetch('https://api.printful.com/products', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Found ${data.result.length} products from Printful`);
    
    return data.result.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || 'Print-on-demand product',
      price: 19.99, // Printful doesn't provide prices in product list
      image: product.image,
      category: 'fashion',
      provider: 'printful'
    }));
  } catch (error) {
    console.error('❌ Printful API error:', error.message);
    return [];
  }
}

async function testFreeApis() {
  console.log('\n🧪 TESTING FREE APIs...\n');
  
  // Test Fake Store API
  const fakeStoreProducts = await fetchFakeStoreProducts();
  
  // Test Dummy JSON API  
  const dummyJsonProducts = await fetchDummyJsonProducts();
  
  // Test Printful (if API key available)
  const printfulProducts = await fetchPrintfulProducts();
  
  const totalProducts = fakeStoreProducts.length + dummyJsonProducts.length + printfulProducts.length;
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`   Fake Store API: ${fakeStoreProducts.length} products`);
  console.log(`   Dummy JSON API: ${dummyJsonProducts.length} products`);
  console.log(`   Printful API: ${printfulProducts.length} products`);
  console.log(`   TOTAL: ${totalProducts} products available for free!\n`);
  
  if (totalProducts > 0) {
    console.log('🎉 You can use these APIs to populate your store with real product data!');
    console.log('\n💡 RECOMMENDATION:');
    console.log('   1. Start with Fake Store API (completely free, no signup)');
    console.log('   2. Add Dummy JSON API for more variety');
    console.log('   3. Get Printful API key for print-on-demand products');
  }
}

testFreeApis();