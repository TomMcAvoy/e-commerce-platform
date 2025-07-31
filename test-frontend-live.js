#!/usr/bin/env node

/**
 * Live Frontend Category Functionality Test
 * Tests the actual running frontend page
 */

const axios = require('axios');

const FRONTEND_URL = 'http://localhost:3001';
const BACKEND_URL = 'http://localhost:3000';

async function testLivePage() {
  console.log('🔍 TESTING LIVE CATEGORIES PAGE...\n');
  
  try {
    // Test if page loads
    console.log('📄 Testing page load...');
    const response = await axios.get(`${FRONTEND_URL}/categories`);
    console.log(`✅ Page loads: ${response.status}`);
    
    const html = response.data;
    
    // Check for loading vs loaded state
    if (html.includes('Loading Categories')) {
      console.log('⚠️  Page is stuck in loading state');
      
      // Check if API is accessible from frontend
      console.log('\n🔗 Testing API connectivity...');
      try {
        const apiTest = await axios.get(`${BACKEND_URL}/api/categories`);
        console.log(`✅ Backend API works: ${apiTest.data.count} categories`);
        
        // The issue might be CORS or frontend not calling API properly
        console.log('❌ Issue: Frontend not loading API data properly');
        
      } catch (apiError) {
        console.log('❌ Backend API connection failed:', apiError.message);
      }
      
    } else {
      // Check for actual categories
      console.log('🎯 Checking for real category data...');
      
      const categoryChecks = [
        { name: 'Electronics', found: html.includes('Electronics') },
        { name: 'Fashion', found: html.includes('Fashion') },  
        { name: 'Home & Garden', found: html.includes('Home') },
        { name: 'Health & Beauty', found: html.includes('Beauty') },
        { name: 'Sports', found: html.includes('Sports') }
      ];
      
      let foundCategories = 0;
      categoryChecks.forEach(check => {
        if (check.found) {
          console.log(`✅ Found: ${check.name}`);
          foundCategories++;
        } else {
          console.log(`❌ Missing: ${check.name}`);
        }
      });
      
      console.log(`\n📊 Categories found: ${foundCategories}/5`);
      
      if (foundCategories >= 3) {
        console.log('🎉 SUCCESS: Categories are loading properly!');
      } else {
        console.log('⚠️  Limited category data found');
      }
    }
    
    // Check for UI elements
    console.log('\n🎨 Testing UI elements...');
    const uiChecks = [
      { element: 'Search box', found: html.includes('search') || html.includes('Search') },
      { element: 'Grid layout', found: html.includes('grid') },
      { element: 'Category cards', found: html.includes('card') || html.includes('bg-white') },
      { element: 'Responsive design', found: html.includes('md:') || html.includes('sm:') }
    ];
    
    uiChecks.forEach(check => {
      console.log(`   ${check.found ? '✅' : '❌'} ${check.element}: ${check.found ? 'Present' : 'Missing'}`);
    });
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Frontend server not running on port 3001');
    }
  }
}

// Run the test
testLivePage();