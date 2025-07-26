/**
 * Comprehensive test import updater
 * Following e-commerce platform testing infrastructure patterns
 */

const fs = require('fs');
const path = require('path');

function updateTestFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Calculate relative path to test-app-setup
    const fileDir = path.dirname(filePath);
    const testSetupPath = path.join('src', '__tests__', 'test-app-setup');
    let relativePath = path.relative(fileDir, testSetupPath);
    
    // Ensure proper format for imports
    if (!relativePath.startsWith('.')) {
      relativePath = `./${relativePath}`;
    }
    relativePath = relativePath.replace(/\\/g, '/'); // Convert Windows paths
    
    // Check if already has correct import
    const hasCorrectImport = content.includes(`from '${relativePath}'`) ||
                            content.includes(`from "${relativePath}"`);
    
    if (hasCorrectImport) {
      return false;
    }
    
    // Replace various import patterns
    const patterns = [
      /import\s+(?:{\s*app\s*}|app)\s+from\s+['"][^'"]*index['"];?\s*$/gm,
      /const\s+(?:{\s*app\s*}|app)\s*=\s*require\(['"][^'"]*index['"]\);?\s*$/gm,
      /import\s+(?:{\s*app\s*}|app)\s+from\s+['"][^'"]*app['"];?\s*$/gm
    ];
    
    patterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, `import app from '${relativePath}';`);
        updated = true;
      }
    });
    
    // Add import if app is used but no import exists
    if (!updated && /request\(app\)/.test(content)) {
      const firstImport = content.match(/^import.*$/m);
      if (firstImport) {
        content = content.replace(firstImport[0], `import app from '${relativePath}';\n${firstImport[0]}`);
        updated = true;
      } else {
        content = `import app from '${relativePath}';\n${content}`;
        updated = true;
      }
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Find all test files
function findTestFiles() {
  const testFiles = [];
  
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    fs.readdirSync(dir).forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (item.endsWith('.test.ts') || item.endsWith('.test.js')) {
        testFiles.push(fullPath);
      }
    });
  }
  
  scanDir('src');
  return testFiles;
}

// Main execution
const testFiles = findTestFiles();
let updated = 0;

console.log('🧪 Processing test files...');
testFiles.forEach(file => {
  if (updateTestFile(file)) {
    updated++;
  }
});

console.log(`\n📊 Summary: ${updated} files updated out of ${testFiles.length} total`);
