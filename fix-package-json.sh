#!/bin/bash
# filepath: /Users/thomasmcavoy/GitHub/shoppingcart/fix-package-json.sh

echo "🔧 Fixing package.json duplicate scripts following Copilot Instructions..."

# Backup current package.json
cp package.json package.json.backup.$(date +%s)
echo "✅ Created backup of package.json"

# Create clean scripts section (removing duplicates)
cat > temp-package-scripts.json << 'EOF'
{
  "scripts": {
    "setup": "npm install && cd frontend && npm install --legacy-peer-deps && echo '✅ Setup complete'",
    "dev:all": "concurrently \"npm run dev:server\" \"npm run dev:frontend\" --names \"Backend,Frontend\" --prefix-colors \"blue,green\"",
    "dev:server": "echo '🔥 Starting backend server on port 3000...' && nodemon src/index.ts",
    "dev:frontend": "echo '🎨 Starting frontend server on port 3001...' && cd frontend && npm run dev",
    "stop": "pkill -f 'nodemon|next' || true",
    "kill": "lsof -ti:3000,3001 | xargs kill -9 || true",
    
    "seed": "ts-node src/scripts/seed.ts",
    "seed:categories": "ts-node src/scripts/seedCategories.ts",
    "seed:products": "ts-node src/scripts/seedProducts.ts", 
    "seed:vendors": "ts-node src/scripts/seedVendors.ts",
    "seed:all": "npm run seed:categories && npm run seed:vendors && npm run seed:products",
    "seed:real": "echo '🌱 Seeding database with REAL data...' && ts-node src/seeders/seedReal.ts",
    "cleanup": "echo '🧹 Wiping database completely...' && ts-node src/scripts/cleanup.ts",
    "reset": "echo '🔄 Resetting database...' && npm run cleanup && npm run seed:all",
    "reset:real": "echo '🔄 Resetting database with REAL data...' && npm run cleanup && npm run seed:real",
    
    "build": "tsc",
    "start": "node dist/index.js",
    
    "test": "jest --detectOpenHandles --forceExit",
    "test:comprehensive": "chmod +x run-all-tests.sh && ./run-all-tests.sh",
    "test:api": "npm run test:fix-imports && npm test -- --testPathPattern=\"api|health\"",
    "test:e2e": "node tests/e2e/run-tests.js",
    "test:unit": "jest --testPathPattern=unit --detectOpenHandles --forceExit",
    "test:watch": "jest --watch --detectOpenHandles",
    "test:coverage": "jest --coverage --detectOpenHandles --forceExit",
    "test:backend": "jest --config jest.config.ts --testPathPattern=src/",
    "test:frontend": "cd frontend && npm test",
    "test:all": "npm run test:backend && npm run test:frontend",
    "test:integration": "jest --testPathPattern=integration --detectOpenHandles --forceExit",
    "test:dropshipping": "jest --config jest.config.ts --testPathPattern=DropshippingService.test.ts",
    "test:debug": "npm run test:fix-imports && npm test -- --verbose --detectOpenHandles",
    "test:clear": "jest --clearCache",
    "test:setup": "npm run test:fix-imports && npm test",
    "test:categories": "./tests/run-category-tests.sh",
    "test:electronics": "jest --config jest.config.ts --testPathPattern=electronics.test.ts",
    "test:fashion": "jest --config jest.config.ts --testPathPattern=fashion.test.ts",
    "test:home": "jest --config jest.config.ts --testPathPattern=home-garden.test.ts",
    "test:beauty": "jest --config jest.config.ts --testPathPattern=beauty-health.test.ts",
    "test:sports": "jest --config jest.config.ts --testPathPattern=sports-fitness.test.ts",
    "test:automotive": "jest --config jest.config.ts --testPathPattern=automotive.test.ts",
    "test:books": "jest --config jest.config.ts --testPathPattern=books-media.test.ts",
    "test:toys": "jest --config jest.config.ts --testPathPattern=toys-games.test.ts",
    "fix:frontend": "cd frontend && rm -rf node_modules package-lock.json && npm install",
    "cleanup:frontend": "rm -f frontend/package-lock.json && echo '✅ Cleaned frontend lockfile'",
    "test:fix-imports": "node scripts/update-test-imports.js"
  }
}
EOF

echo "🔄 Rebuilding package.json with clean scripts..."

# Extract everything except scripts from current package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const newScripts = JSON.parse(fs.readFileSync('temp-package-scripts.json', 'utf8'));

// Remove duplicate scripts and merge
delete pkg.scripts;
const cleanPkg = { ...pkg, ...newScripts };

fs.writeFileSync('package.json', JSON.stringify(cleanPkg, null, 2));
console.log('✅ Package.json rebuilt successfully');
"

# Clean up temp file
rm temp-package-scripts.json

echo "🎉 Package.json fixed! Following Critical Development Workflows:"
echo "   • No more duplicate scripts"
echo "   • Proper Server Management commands"  
echo "   • Clean Database Patterns seeding"
echo "   • Organized Testing Infrastructure"
echo ""
echo "🚀 Test your fixed setup:"
echo "   npm run seed:categories"
echo "   npm run dev:all"
echo "   npm run test:api"
