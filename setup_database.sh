#!/bin/bash
# This script automates the setup of the database cleanup and seeding system
# as defined in the project's copilot-instructions.md and fix-database-cleanup.sh.

set -e

echo "🚀 Starting Full Database System Setup..."
echo "========================================="

# --- Create Directory Structure ---
echo "1. Creating directory structure..."
mkdir -p src/seeders/scripts
mkdir -p src/seeders/data
echo "   ✅ Directories created: src/seeders/scripts, src/seeders/data"

# --- Create Core Logic Scripts ---
echo "2. Creating core logic scripts..."

# Create emergency cleanup script
cat > src/seeders/scripts/cleanupDatabase.ts << 'EOF'
import mongoose from 'mongoose';
import { config } from '../../utils/config';
import User from '../../models/User';
import Product from '../../models/Product';

class DatabaseCleanup {
  async connectDatabase() {
    try {
      await mongoose.connect(config.mongoUri);
      console.log('💾 Connected to database for cleanup');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  async emergencyCleanup() {
    try {
      console.log('🧹 EMERGENCY CLEANUP: Removing all data...');
      
      await User.collection.drop().catch(() => console.log('   - User collection already empty'));
      await Product.collection.drop().catch(() => console.log('   - Product collection already empty'));
      
      await User.createCollection();
      await Product.createCollection();
      
      console.log('✅ Database completely cleaned and indexes reset');
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      throw error;
    }
  }

  async cleanup() {
    try {
      await this.connectDatabase();
      await this.emergencyCleanup();
      console.log('🎉 Emergency cleanup completed successfully!');
    } catch (error) {
      console.error('❌ Emergency cleanup failed:', error);
      process.exit(1);
    } finally {
      await mongoose.connection.close();
    }
  }
}

export default DatabaseCleanup;

if (require.main === module) {
  const cleanup = new DatabaseCleanup();
  console.log('🚨 EMERGENCY DATABASE CLEANUP');
  console.log('============================');
  console.log('⚠️  This will COMPLETELY WIPE the database');
  console.log('Press Ctrl+C to cancel, or wait 3 seconds...\n');
  
  setTimeout(() => {
    cleanup.cleanup();
  }, 3000);
}
EOF
echo "   ✅ Created: src/seeders/scripts/cleanupDatabase.ts"

# Create proper seeding script
cat > src/seeders/scripts/seedRealData.ts << 'EOF'
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../../utils/config';
import User from '../../models/User';
import Product from '../../models/Product';

import realUsersData from '../data/realUsers.json';
import realProductsData from '../data/realProducts.json';

class RealDataSeeder {
  private users: any[] = [];

  async connectDatabase() {
    try {
      await mongoose.connect(config.mongoUri);
      console.log('💾 Connected to database for seeding REAL data');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  async seedRealUsers() {
    try {
      console.log('👥 Seeding REAL user accounts...');
      
      const processedUsers = await Promise.all(
        realUsersData.map(async (userData) => {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(userData.password, salt);
          
          return { ...userData, password: hashedPassword };
        })
      );

      this.users = await User.insertMany(processedUsers);
      
      console.log(`✅ Created ${this.users.length} REAL user accounts.`);
      
    } catch (error) {
      console.error('❌ Real user seeding failed:', error);
      throw error;
    }
  }

  async seedRealProducts() {
    try {
      console.log('🛍️  Seeding REAL products following Amazon/Temu patterns...');
      
      const processedProducts = realProductsData.map((productData: any) => {
        const vendor = this.users.find(user => user.email === productData.vendorEmail);
        if (!vendor) {
          console.warn(`⚠️  Vendor not found for product: ${productData.name}`);
          return null;
        }

        const chars = 'B0' + '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').sort(() => 0.5 - Math.random()).join('').substring(0,8);
        const asin = chars;

        const brandPrefix = productData.brand?.substring(0, 3).toUpperCase() || 'GEN';
        const sku = `${brandPrefix}-${Date.now().toString().slice(-6)}`;

        const { vendorEmail, ...productWithoutEmail } = productData;
        
        return { ...productWithoutEmail, asin, sku, vendorId: vendor._id, isActive: true };
      }).filter(Boolean);

      const products = await Product.insertMany(processedProducts);
      
      console.log(`✅ Created ${products.length} REAL products.`);
      
    } catch (error) {
      console.error('❌ Real product seeding failed:', error);
      throw error;
    }
  }

  async generateRealReport() {
    console.log('\n📊 REAL Database Seeding Complete');
    console.log('=================================');
    console.log('\n🔐 Test Accounts (REAL):');
    console.log('• Admin: admin@ecommerce.com / Admin123!');
    console.log('• Vendor: electronics@vendor.com / Vendor123!');
    console.log('• Customer: john@customer.com / Customer123!');
  }

  async seed() {
    try {
      await this.connectDatabase();
      await this.seedRealUsers();
      await this.seedRealProducts();
      await this.generateRealReport();
      console.log('\n🎉 REAL data seeding completed successfully!');
    } catch (error) {
      console.error('❌ Real data seeding failed:', error);
      process.exit(1);
    } finally {
      await mongoose.connection.close();
    }
  }
}

export default RealDataSeeder;

if (require.main === module) {
  const seeder = new RealDataSeeder();
  seeder.seed();
}
EOF
echo "   ✅ Created: src/seeders/scripts/seedRealData.ts"

# --- Create Data Files ---
echo "3. Creating high-quality data files..."

# Create REAL product data
cat > src/seeders/data/realProducts.json << 'EOF'
[
  {
    "name": "Apple iPhone 15 Pro Max 256GB Natural Titanium",
    "description": "iPhone 15 Pro Max. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action Button, and the most powerful iPhone camera system ever.",
    "price": 1199.99, "cost": 899.99, "category": "electronics", "brand": "Apple",
    "searchTerms": ["iphone 15", "apple", "smartphone", "titanium"],
    "inventory": { "quantity": 45, "inStock": true }, "vendorEmail": "electronics@vendor.com"
  },
  {
    "name": "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    "description": "Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, for the ultimate listening experience.",
    "price": 349.99, "cost": 199.99, "category": "electronics", "brand": "Sony",
    "searchTerms": ["sony headphones", "noise canceling", "wireless", "wh-1000xm5"],
    "inventory": { "quantity": 75, "inStock": true }, "vendorEmail": "electronics@vendor.com"
  },
  {
    "name": "Levi's Men's 511 Slim Fit Jeans",
    "description": "The Levi's 511 Slim Fit Jeans are cut close to the body with a slim leg from hip to ankle. Made with comfortable stretch denim.",
    "price": 69.50, "cost": 35.00, "category": "clothing", "brand": "Levi's",
    "searchTerms": ["levis 511", "slim jeans", "mens jeans", "denim"],
    "inventory": { "quantity": 120, "inStock": true }, "vendorEmail": "fashion@vendor.com"
  },
  {
    "name": "Instant Pot Duo 7-in-1 Electric Pressure Cooker, 8 Quart",
    "description": "America's #1 multi-cooker brand, the Instant Pot Duo 7-in-1 replaces 7 kitchen appliances.",
    "price": 99.95, "cost": 59.99, "category": "home", "brand": "Instant Pot",
    "searchTerms": ["instant pot", "pressure cooker", "multi cooker", "kitchen"],
    "inventory": { "quantity": 85, "inStock": true }, "vendorEmail": "home@vendor.com"
  },
  {
    "name": "Nike Air Force 1 '07 Men's Shoes",
    "description": "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best.",
    "price": 90.00, "cost": 45.00, "category": "clothing", "brand": "Nike",
    "searchTerms": ["nike air force 1", "nike shoes", "sneakers", "basketball shoes"],
    "inventory": { "quantity": 200, "inStock": true }, "vendorEmail": "fashion@vendor.com"
  }
]
EOF
echo "   ✅ Created: src/seeders/data/realProducts.json"

# Create REAL users
cat > src/seeders/data/realUsers.json << 'EOF'
[
  { "name": "Platform Admin", "email": "admin@ecommerce.com", "password": "Admin123!", "role": "admin", "isEmailVerified": true },
  { "name": "TechGear Electronics", "email": "electronics@vendor.com", "password": "Vendor123!", "role": "vendor", "isEmailVerified": true },
  { "name": "Fashion Forward Store", "email": "fashion@vendor.com", "password": "Vendor123!", "role": "vendor", "isEmailVerified": true },
  { "name": "Home Essentials Co", "email": "home@vendor.com", "password": "Vendor123!", "role": "vendor", "isEmailVerified": true },
  { "name": "John Smith", "email": "john@customer.com", "password": "Customer123!", "role": "user", "isEmailVerified": true }
]
EOF
echo "   ✅ Created: src/seeders/data/realUsers.json"

# --- Create CLI Entry Points ---
echo "4. Creating CLI entry points..."

# Create cleanup command
cat > src/seeders/cleanup.ts << 'EOF'
import DatabaseCleanup from './scripts/cleanupDatabase';
const cleanup = new DatabaseCleanup();
cleanup.cleanup();
EOF
echo "   ✅ Created: src/seeders/cleanup.ts"

# Create real seeding command  
cat > src/seeders/seedReal.ts << 'EOF'
import RealDataSeeder from './scripts/seedRealData';
const seeder = new RealDataSeeder();
seeder.seed();
EOF
echo "   ✅ Created: src/seeders/seedReal.ts"

# --- Final Instructions ---
echo ""
echo "✅ System Setup Complete!"
echo "========================"
echo ""
echo "ACTION REQUIRED: Please add the following scripts to your package.json file:"
echo ""
echo '  "scripts": {'
echo '    ...existing scripts...'
echo '    "cleanup": "echo ''🧹  Wiping database completely...'' && ts-node src/seeders/cleanup.ts",'
echo '    "seed:real": "echo ''🌱  Seeding database with REAL data...'' && ts-node src/seeders/seedReal.ts",'
echo '    "reset:real": "echo ''🔄  Resetting database with REAL data...'' && npm run cleanup && npm run seed:real"'
echo '  },'
echo ""
echo "After updating package.json, you can run 'npm run reset:real' to fix your database."
echo ""
