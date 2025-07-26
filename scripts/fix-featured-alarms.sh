// NEW FILE - Add featured alarm products
#!/bin/bash

echo "🚨 Adding featured products to Alarm Systems category..."

cd "$(dirname "$0")/.."

# Create debug helper
mkdir -p frontend/lib
cat > frontend/lib/debug-featured.ts << 'EOF'
export async function debugFeaturedProducts() {
  try {
    const categoriesResponse = await fetch('http://localhost:3000/api/categories');
    const categories = await categoriesResponse.json();
    
    const featuredResponse = await fetch('http://localhost:3000/api/products?featured=true&category=alarm-systems');
    const featuredProducts = await featuredResponse.json();
    
    const allAlarmResponse = await fetch('http://localhost:3000/api/products?category=alarm-systems');
    const allAlarmProducts = await allAlarmResponse.json();
    
    console.log('Categories:', categories);
    console.log('Featured Alarm Products:', featuredProducts);
    console.log('All Alarm Products:', allAlarmProducts);
    
    return { categories, featuredProducts, allAlarmProducts };
  } catch (error) {
    console.error('Debug API Error:', error);
    return null;
  }
}
EOF

# Create seed script for featured alarm products
mkdir -p src/scripts
cat > src/scripts/seed-featured-alarms.js << 'EOF'
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

async function seedFeaturedAlarmProducts() {
  try {
    const alarmCategory = await Category.findOne({ slug: 'alarm-systems' });
    
    if (!alarmCategory) {
      console.log('❌ Alarm Systems category not found');
      return;
    }
    
    const featuredAlarmProducts = [
      {
        name: 'Wireless Home Security Alarm System',
        slug: 'wireless-home-security-alarm',
        description: 'Complete wireless security system with door/window sensors and smartphone app control.',
        price: 299.99,
        compareAtPrice: 399.99,
        featured: true,
        category: alarmCategory._id,
        vendor: alarmCategory._id,
        image: '/images/wireless-alarm-system.jpg',
        stock: 50,
        isActive: true
      },
      {
        name: 'Smart Smoke & CO Detector',
        slug: 'smart-smoke-co-detector',
        description: 'Intelligent smoke and carbon monoxide detector with smartphone alerts.',
        price: 89.99,
        compareAtPrice: 129.99,
        featured: true,
        category: alarmCategory._id,
        vendor: alarmCategory._id,
        image: '/images/smart-smoke-detector.jpg',
        stock: 75,
        isActive: true
      }
    ];
    
    for (const productData of featuredAlarmProducts) {
      const existingProduct = await Product.findOne({ slug: productData.slug });
      
      if (!existingProduct) {
        await Product.create(productData);
        console.log(`✅ Created featured product: ${productData.name}`);
      } else {
        await Product.findByIdAndUpdate(existingProduct._id, { featured: true });
        console.log(`✅ Updated to featured: ${productData.name}`);
      }
    }
    
    console.log('🎯 Featured alarm products seeded successfully');
    
  } catch (error) {
    console.error('❌ Error seeding featured alarm products:', error);
  }
}

if (require.main === module) {
  require('dotenv').config();
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    seedFeaturedAlarmProducts().then(() => {
      mongoose.connection.close();
    });
  });
}

module.exports = { seedFeaturedAlarmProducts };
EOF

echo "✅ Created debug helper: frontend/lib/debug-featured.ts"
echo "✅ Created seed script: src/scripts/seed-featured-alarms.js"
echo ""
echo "🎯 Next steps:"
echo "1. Run: node src/scripts/seed-featured-alarms.js"
echo "2. Test API: curl http://localhost:3000/api/products?featured=true&category=alarm-systems"
echo "3. Check debug dashboard: http://localhost:3001/debug"

chmod +x scripts/fix-featured-alarms.sh
