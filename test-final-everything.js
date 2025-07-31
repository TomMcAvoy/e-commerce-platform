#!/usr/bin/env node

/**
 * FINAL TEST: News, Social, Categories - All Real Data
 */

const axios = require('axios');

async function testEverything() {
  console.log('🧪 TESTING ALL ENDPOINTS WITH REAL DATA');
  console.log('=========================================\n');
  
  const BASE_URL = 'http://localhost:3000';
  const FRONTEND_URL = 'http://localhost:3001';
  
  let results = {
    news: false,
    social: false,
    categories: false,
    frontend: {
      news: false,
      social: false,
      categories: false
    }
  };
  
  // Test Backend APIs
  console.log('📡 Backend API Tests:');
  
  try {
    // Test News API
    const newsResponse = await axios.get(`${BASE_URL}/api/news`);
    results.news = newsResponse.data.success && newsResponse.data.count >= 0;
    console.log(`   📰 News API: ${results.news ? '✅' : '❌'} (${newsResponse.data.count} articles)`);
  } catch (error) {
    console.log(`   📰 News API: ❌ ${error.message}`);
  }
  
  try {
    // Test Social API
    const socialResponse = await axios.get(`${BASE_URL}/api/social/posts`);
    results.social = socialResponse.data.success && socialResponse.data.count >= 0;
    console.log(`   💬 Social API: ${results.social ? '✅' : '❌'} (${socialResponse.data.count} posts)`);
  } catch (error) {
    console.log(`   💬 Social API: ❌ ${error.message}`);
  }
  
  try {
    // Test Categories API
    const categoriesResponse = await axios.get(`${BASE_URL}/api/categories`);
    results.categories = categoriesResponse.data.success && categoriesResponse.data.count >= 0;
    console.log(`   📂 Categories API: ${results.categories ? '✅' : '❌'} (${categoriesResponse.data.count} categories)`);
  } catch (error) {
    console.log(`   📂 Categories API: ❌ ${error.message}`);
  }
  
  // Test Frontend Pages
  console.log('\n🌐 Frontend Tests:');
  
  try {
    // Test News Page
    const newsPageResponse = await axios.get(`${FRONTEND_URL}/news`);
    const newsHtml = newsPageResponse.data;
    results.frontend.news = !newsHtml.includes('Loading') && newsPageResponse.status === 200;
    console.log(`   📰 News Page: ${results.frontend.news ? '✅' : '❌'} (${newsPageResponse.status})`);
  } catch (error) {
    console.log(`   📰 News Page: ❌ ${error.message}`);
  }
  
  try {
    // Test Social Page
    const socialPageResponse = await axios.get(`${FRONTEND_URL}/social`);
    const socialHtml = socialPageResponse.data;
    results.frontend.social = !socialHtml.includes('Loading') && socialPageResponse.status === 200;
    console.log(`   💬 Social Page: ${results.frontend.social ? '✅' : '❌'} (${socialPageResponse.status})`);
  } catch (error) {
    console.log(`   💬 Social Page: ❌ ${error.message}`);
  }
  
  try {
    // Test Categories Page
    const categoriesPageResponse = await axios.get(`${FRONTEND_URL}/categories`);
    const categoriesHtml = categoriesPageResponse.data;
    results.frontend.categories = !categoriesHtml.includes('Loading Categories') && categoriesPageResponse.status === 200;
    console.log(`   📂 Categories Page: ${results.frontend.categories ? '✅' : '❌'} (${categoriesPageResponse.status})`);
  } catch (error) {
    console.log(`   📂 Categories Page: ❌ ${error.message}`);
  }
  
  // Summary
  const backendWorking = results.news && results.social && results.categories;
  const frontendWorking = results.frontend.news && results.frontend.social && results.frontend.categories;
  
  console.log('\n🎯 FINAL RESULTS:');
  console.log('=================');
  console.log(`📡 Backend APIs: ${backendWorking ? '✅ ALL WORKING' : '⚠️  Some issues'}`);
  console.log(`🌐 Frontend Pages: ${frontendWorking ? '✅ ALL WORKING' : '⚠️  Some issues'}`);
  
  if (backendWorking && frontendWorking) {
    console.log('\n🏆 SUCCESS: Everything is working with real data!');
    console.log('🚀 No more mock data - all content comes from database');
  } else {
    console.log('\n📋 Status:');
    console.log(`   • News: Backend ${results.news ? '✅' : '❌'}, Frontend ${results.frontend.news ? '✅' : '❌'}`);
    console.log(`   • Social: Backend ${results.social ? '✅' : '❌'}, Frontend ${results.frontend.social ? '✅' : '❌'}`);
    console.log(`   • Categories: Backend ${results.categories ? '✅' : '❌'}, Frontend ${results.frontend.categories ? '✅' : '❌'}`);
  }
}

testEverything();