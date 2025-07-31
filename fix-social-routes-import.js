#!/usr/bin/env node

/**
 * FIX SOCIAL ROUTES IMPORT ISSUE
 * The routes are there but not loading properly - fix the import/export
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Debugging and fixing social routes import...');

const routesPath = '/Users/thomasmcavoy/GitHub/shoppingcart/src/routes';
const socialRoutesPath = path.join(routesPath, 'socialRoutes.ts');

// Check if socialRoutes.ts exists and is readable
if (!fs.existsSync(socialRoutesPath)) {
  console.log('❌ socialRoutes.ts does not exist!');
  process.exit(1);
}

// Read the social routes file
const socialRoutesContent = fs.readFileSync(socialRoutesPath, 'utf8');

// Check the export
if (!socialRoutesContent.includes('export default router')) {
  console.log('❌ Missing default export in socialRoutes.ts');
  
  // Add default export if missing
  const fixedContent = socialRoutesContent + '\n\nexport default router;\n';
  fs.writeFileSync(socialRoutesPath, fixedContent);
  console.log('✅ Added default export to socialRoutes.ts');
} else {
  console.log('✅ socialRoutes.ts has default export');
}

// Check the routes index file
const indexPath = path.join(routesPath, 'index.ts');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Check if socialRoutes is being loaded correctly
if (indexContent.includes("safeRequire('./socialRoutes', '/social')")) {
  console.log('✅ socialRoutes import line exists in index.ts');
} else {
  console.log('❌ Missing socialRoutes import in index.ts');
}

// Try a simple Node.js require test
console.log('\n🧪 Testing TypeScript compilation...');

// Create a simple test file to check compilation
const testCode = `
import express from 'express';
const router = express.Router();

try {
  const socialRoutes = require('./socialRoutes');
  console.log('Social routes loaded:', typeof socialRoutes);
  console.log('Default export:', typeof socialRoutes.default);
} catch (error) {
  console.log('Error loading social routes:', error.message);
  console.log('Error code:', error.code);
}
`;

const testPath = path.join(routesPath, 'test-social.js');
fs.writeFileSync(testPath, testCode);

console.log('✅ Created test file for debugging');
console.log('\n🎯 Next steps:');
console.log('   1. Restart the backend server');
console.log('   2. Check if social routes load properly');
console.log('   3. Test the endpoints');