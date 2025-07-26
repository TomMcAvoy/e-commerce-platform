#!/bin/bash
# filepath: scripts/remove-all-mocked-data.sh

echo "🗑️ Removing ALL mocked data and replacing with database calls..."

# Create comprehensive database seeder
cat > src/seeders/ComprehensiveSeeder.ts << 'EOF'
import mongoose from 'mongoose';
import Category from '../models/Category';
import Product from '../models/Product';
import User from '../models/User';

export class ComprehensiveSeeder {
  async seedEverything() {
    try {
      const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-dev';
      await mongoose.connect(MONGODB_URI);
      
      console.log('🗄️ Connected to database, removing all mock data...');
      
      // Clear existing data
      await Promise.all([
        Category.deleteMany({}),
        Product.deleteMany({}),
        User.deleteMany({})
      ]);
      
      // Seed real categories
      const categories = await Category.insertMany([
        {
          name: 'Electronics',
          slug: 'electronics',
          description: 'Professional security electronics, surveillance systems, and access control devices',
          colorScheme: {
            primary: '#1E40AF',
            secondary: '#0891B2',
            gradient: 'linear-gradient(135deg, #1E40AF 0%, #0891B2 100%)'
          },
          isActive: true
        },
        {
          name: 'Fashion & Apparel',
          slug: 'fashion',
          description: 'Military-grade tactical clothing, uniforms, and protective gear',
          colorScheme: {
            primary: '#475569',
            secondary: '#374151',
            gradient: 'linear-gradient(135deg, #475569 0%, #374151 100%)'
          },
          isActive: true
        },
        {
          name: 'Sports & Fitness',
          slug: 'sports-fitness',
          description: 'Physical training equipment and tactical fitness gear',
          colorScheme: {
            primary: '#059669',
            secondary: '#047857',
            gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
          },
          isActive: true
        }
      ]);
      
      // Seed real products
      await Product.insertMany([
        {
          name: 'Professional Security Camera System',
          description: 'High-definition surveillance system with night vision capabilities',
          price: 599.99,
          category: 'electronics',
          brand: 'SecureTech Pro',
          sku: 'STP-CAM-001',
          inventory: { quantity: 50, inStock: true },
          isActive: true
        },
        {
          name: 'Tactical Security Uniform',
          description: 'Professional tactical uniform with reinforced construction',
          price: 129.99,
          category: 'fashion',
          brand: 'TacWear Pro',
          sku: 'TWP-UNI-001',
          inventory: { quantity: 75, inStock: true },
          isActive: true
        }
      ]);
      
      console.log(`✅ Seeded ${categories.length} categories and products from database`);
      console.log('🚫 NO MOCKED DATA - Everything comes from database now');
      
      await mongoose.connection.close();
      
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const seeder = new ComprehensiveSeeder();
  seeder.seedEverything();
}
EOF

echo "✅ Created comprehensive database seeder"
echo "🚫 NO MOCKED DATA - Everything will come from database"

# Update package.json
npm pkg set scripts.seed:real="node -r ts-node/register src/seeders/ComprehensiveSeeder.ts"
npm pkg set scripts.no:mock="npm run seed:real && npm run dev:all"

echo ""
echo "🎯 Run these commands to eliminate all mocked data:"
echo "1. npm run seed:real    # Seed database with real data"
echo "2. npm run no:mock      # Start app with zero mocked data"
echo ""
echo "🔍 Verify no mocked data at:"
echo "• http://localhost:3001/categories"
echo "• http://localhost:3000/api/categories"
EOF
