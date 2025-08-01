#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🗞️ Starting news scheduler...');

// Initial fetch
console.log('📰 Running initial news fetch...');
const initialFetch = spawn('node', ['scripts/fetch-real-news.js'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit'
});

initialFetch.on('close', (code) => {
  console.log(`Initial fetch completed with code ${code}`);
  
  // Schedule recurring fetches every 30 minutes
  console.log('⏰ Scheduling news updates every 30 minutes...');
  setInterval(() => {
    console.log('🔄 Running scheduled news fetch...');
    const fetch = spawn('node', ['scripts/fetch-real-news.js'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    fetch.on('close', (code) => {
      console.log(`Scheduled fetch completed with code ${code}`);
    });
  }, 30 * 60 * 1000); // 30 minutes
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('📰 News scheduler stopped');
  process.exit(0);
});