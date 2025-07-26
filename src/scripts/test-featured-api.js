// NEW FILE - Test API endpoints for featured products
const axios = require('axios');

async function testFeaturedAPI() {
  const baseURL = 'http://localhost:3000/api';
  
  try {
    console.log('🧪 Testing Featured Products API...\n');
    
    // Test 1: Get all categories
    console.log('1️⃣ Testing categories endpoint:');
    const categoriesResponse = await axios.get(`${baseURL}/categories`);
    const categories = categoriesResponse.data.data || categoriesResponse.data;
    console.log(`   Found ${categories.length} categories`);
    
    const alarmCategory = categories.find(cat => 
      cat.name.toLowerCase().includes('alarm') || 
      cat.slug.includes('alarm')
    );
    
    if (alarmCategory) {
      console.log(`   ✅ Alarm category: ${alarmCategory.name} (${alarmCategory.slug})\n`);
      
      // Test 2: Get featured products for alarm category
      console.log('2️⃣ Testing featured alarm products:');
      const featuredResponse = await axios.get(`${baseURL}/products?featured=true&category=${alarmCategory.slug}`);
      const featuredProducts = featuredResponse.data.data || featuredResponse.data;
      console.log(`   Found ${featuredProducts.length} featured alarm products`);
      
      featuredProducts.forEach(product => {
        console.log(`   - ${product.name} ($${product.price})`);
      });
      
      // Test 3: Get all alarm products
      console.log('\n3️⃣ Testing all alarm products:');
      const allAlarmResponse = await axios.get(`${baseURL}/products?category=${alarmCategory.slug}`);
      const allAlarmProducts = allAlarmResponse.data.data || allAlarmResponse.data;
      console.log(`   Found ${allAlarmProducts.length} total alarm products\n`);
      
    } else {
      console.log('   ❌ No alarm category found\n');
    }
    
    // Test 4: Get all featured products
    console.log('4️⃣ Testing all featured products:');
    const allFeaturedResponse = await axios.get(`${baseURL}/products?featured=true`);
    const allFeatured = allFeaturedResponse.data.data || allFeaturedResponse.data;
    console.log(`   Found ${allFeatured.length} total featured products`);
    
    console.log('\n✅ API tests completed successfully');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

if (require.main === module) {
  testFeaturedAPI();
}

module.exports = { testFeaturedAPI };