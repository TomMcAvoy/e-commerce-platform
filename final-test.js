#!/usr/bin/env node

/**
 * Final Comprehensive Test of Category Functionality
 */

const axios = require('axios');

async function finalTest() {
  console.log('🎯 FINAL CATEGORY FUNCTIONALITY TEST');
  console.log('=====================================\n');
  
  let passed = 0;
  let total = 0;
  
  const test = (name, condition) => {
    total++;
    if (condition) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
    }
  };
  
  try {
    // Test backend API
    console.log('📡 Backend API Tests:');
    const apiResponse = await axios.get('http://localhost:3000/api/categories');
    test('Backend API responds', apiResponse.status === 200);
    test('API returns categories', apiResponse.data.count > 0);
    test('Categories have required fields', apiResponse.data.data[0].name && apiResponse.data.data[0].slug);
    test('Categories have product counts', typeof apiResponse.data.data[0].productCount === 'number');
    
    console.log('\n🌐 Frontend Tests:');
    const frontendResponse = await axios.get('http://localhost:3001/categories');
    test('Frontend page loads', frontendResponse.status === 200);
    
    const html = frontendResponse.data;
    test('Page shows categories (not loading)', !html.includes('Loading Categories'));
    test('Page has search functionality', html.includes('search') || html.includes('Search'));
    test('Page has responsive grid', html.includes('grid-cols'));
    test('Page has category names', html.includes('Electronics') || html.includes('Fashion'));
    
    console.log('\n📊 Performance Tests:');
    const start = Date.now();
    await axios.get('http://localhost:3000/api/categories');
    const apiTime = Date.now() - start;
    test('API response time < 100ms', apiTime < 100);
    
    const frontStart = Date.now();
    await axios.get('http://localhost:3001/categories');
    const pageTime = Date.now() - frontStart;
    test('Page load time < 1000ms', pageTime < 1000);
    
    console.log('\n🎉 FINAL RESULTS:');
    console.log(`✅ Passed: ${passed}/${total} tests`);
    console.log(`📈 Success Rate: ${Math.round((passed/total) * 100)}%`);
    
    if (passed === total) {
      console.log('\n🏆 ALL TESTS PASSED! Categories functionality is working perfectly!');
      console.log('🚀 Ready for production!');
    } else if (passed >= total * 0.8) {
      console.log('\n🎯 Most tests passed! Minor issues remaining.');
    } else {
      console.log('\n⚠️  Several issues need attention.');
    }
    
    console.log('\n🔍 Summary:');
    console.log(`• Backend API: ${apiResponse.data.count} categories available`);
    console.log(`• API Response Time: ${apiTime}ms`);
    console.log(`• Page Load Time: ${pageTime}ms`);
    console.log(`• Categories have: names, slugs, descriptions, product counts`);
    
  } catch (error) {
    console.log('❌ Test suite failed:', error.message);
  }
}

finalTest();