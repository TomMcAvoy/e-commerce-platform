#!/bin/bash
# filepath: fix-database-cleanup.sh
# Emergency database cleanup and proper product seeding following copilot-instructions.md

set -e

echo "🔧 Emergency Database Cleanup & Real Product Seeding"
echo "=================================================="
echo "Following copilot-instructions.md patterns:"
echo "Backend API: http://localhost:3000"
echo "Frontend: http://localhost:3001" 
echo "Debug Dashboard: http://localhost:3001/debug"
echo ""

# Create emergency cleanup script
echo "🧹 Creating emergency database cleanup script..."
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
      
      // Drop entire collections to reset everything
      await User.collection.drop().catch(() => console.log('User collection already empty'));
      await Product.collection.drop().catch(() => console.log('Product collection already empty'));
      
      // Recreate collections with proper indexes
      await User.createCollection();
      await Product.createCollection();
      
      console.log('✅ Database completely cleaned and reset');
      
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

// Export for CLI usage
export default DatabaseCleanup;

// CLI execution
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

# Create REAL product data (not junk) following Amazon/Temu patterns
echo "🛍️  Creating REAL product dataset following copilot patterns..."
cat > src/seeders/data/realProducts.json << 'EOF'
[
  {
    "name": "Apple iPhone 15 Pro Max 256GB Natural Titanium",
    "description": "iPhone 15 Pro Max. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action Button, and the most powerful iPhone camera system ever.",
    "price": 1199.99,
    "cost": 899.99,
    "category": "electronics",
    "subcategory": "smartphones",
    "brand": "Apple",
    "upc": "194253777175",
    "bulletPoints": [
      "FORGED IN TITANIUM — iPhone 15 Pro Max has a strong and light aerospace-grade titanium design with a textured matte-glass back",
      "ADVANCED DISPLAY — The 6.7″ Super Retina XDR display with ProMotion ramps up refresh rates to 120Hz when you need exceptional graphics performance",
      "GAME-CHANGING A17 PRO CHIP — A more efficient Neural Engine powers advanced computational photography features like Smart HDR and next-generation portraits",
      "POWERFUL PRO CAMERA SYSTEM — Get incredible framing flexibility with 7 pro lenses. Capture super high-resolution photos with more color and detail",
      "CUSTOMIZABLE ACTION BUTTON — Action Button is a fast track to your favorite feature"
    ],
    "specifications": {
      "Display": "6.7-inch Super Retina XDR OLED",
      "Storage": "256GB",
      "Camera": "48MP Main, 12MP Ultra Wide, 12MP Telephoto",
      "Processor": "A17 Pro chip",
      "Battery": "Up to 29 hours video playback",
      "Operating System": "iOS 17",
      "5G": "Yes"
    },
    "searchTerms": ["iphone 15", "apple", "smartphone", "titanium", "a17 pro", "5g"],
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&crop=top"
    ],
    "inventory": {
      "quantity": 45,
      "lowStock": 10,
      "inStock": true,
      "fulfillmentType": "FBA"
    },
    "discountPercent": 0,
    "primeEligible": true,
    "reviewCount": 2847,
    "averageRating": 4.5,
    "salesRank": 1,
    "vendorEmail": "electronics@vendor.com"
  },
  {
    "name": "Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones",
    "description": "Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, for the ultimate listening experience.",
    "price": 349.99,
    "cost": 199.99,
    "category": "electronics",
    "subcategory": "headphones", 
    "brand": "Sony",
    "upc": "027242920002",
    "bulletPoints": [
      "INDUSTRY LEADING NOISE CANCELING: Two processors control 8 microphones for unprecedented noise canceling",
      "INCREDIBLE SOUND QUALITY: Specially designed 30mm drivers with LDAC deliver exceptional sound quality",
      "CRYSTAL CLEAR HANDS-FREE CALLING: 4 beamforming microphones and precise voice pickup technology",
      "UP TO 30-HOUR BATTERY LIFE: Up to 30 hours of battery life with quick charge",
      "ULTRA COMFORTABLE: Redesigned case is 20% smaller than previous generation"
    ],
    "specifications": {
      "Driver": "30mm dome type",
      "Frequency Response": "4 Hz-40,000 Hz",
      "Battery Life": "30 hours with ANC on",
      "Charging Time": "3 hours (quick charge: 3 min for 3 hours playback)",
      "Weight": "250g",
      "Bluetooth": "5.2",
      "Codecs": "LDAC, AAC, SBC"
    },
    "searchTerms": ["sony headphones", "noise canceling", "wireless", "wh-1000xm5", "bluetooth"],
    "images": [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&crop=top"
    ],
    "inventory": {
      "quantity": 75,
      "lowStock": 15,
      "inStock": true,
      "fulfillmentType": "FBA"
    },
    "discountPercent": 15,
    "primeEligible": true,
    "reviewCount": 4521,
    "averageRating": 4.7,
    "salesRank": 3,
    "vendorEmail": "electronics@vendor.com"
  },
  {
    "name": "Levi's Men's 511 Slim Fit Jeans",
    "description": "The Levi's 511 Slim Fit Jeans are cut close to the body with a slim leg from hip to ankle. Made with comfortable stretch denim.",
    "price": 69.50,
    "cost": 35.00,
    "category": "clothing",
    "subcategory": "jeans",
    "brand": "Levi's",
    "upc": "192505643924",
    "bulletPoints": [
      "SLIM FIT: Cut close to the body with a slim leg from hip to ankle",
      "STRETCH DENIM: Made with comfortable stretch denim for all-day comfort",
      "CLASSIC 5-POCKET STYLING: Traditional jean design with timeless appeal",
      "VERSATILE: Perfect for casual or dressed-up occasions",
      "AUTHENTIC LEVI'S: Classic Levi's quality and craftsmanship"
    ],
    "specifications": {
      "Fit": "Slim",
      "Material": "99% Cotton, 1% Elastane",
      "Rise": "Mid Rise",
      "Leg Opening": "14.75 inches",
      "Inseam": "32 inches",
      "Care": "Machine wash cold",
      "Origin": "Imported"
    },
    "searchTerms": ["levis 511", "slim jeans", "mens jeans", "denim", "levi strauss"],
    "images": [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=top"
    ],
    "inventory": {
      "quantity": 120,
      "lowStock": 25,
      "inStock": true,
      "fulfillmentType": "FBM"
    },
    "discountPercent": 20,
    "primeEligible": false,
    "reviewCount": 8934,
    "averageRating": 4.3,
    "salesRank": 12,
    "vendorEmail": "fashion@vendor.com"
  },
  {
    "name": "Instant Pot Duo 7-in-1 Electric Pressure Cooker, 8 Quart",
    "description": "America's #1 multi-cooker brand, the Instant Pot Duo 7-in-1 replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and food warmer.",
    "price": 99.95,
    "cost": 59.99,
    "category": "home",
    "subcategory": "kitchen",
    "brand": "Instant Pot",
    "upc": "810020980059",
    "bulletPoints": [
      "7-IN-1 FUNCTIONALITY: Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and food warmer",
      "QUICK ONE-TOUCH COOKING: 13+ customizable smart programs for ribs, soups, beans, rice, poultry, yogurt, desserts and more",
      "COOK FAST OR SLOW: Pressure cook delicious one-pot meals up to 70% faster than traditional cooking methods",
      "LARGE CAPACITY: Cook for up to 8 people – perfect for larger families, or meal prepping and batch cooking",
      "SAFE AND CONVENIENT: Built with 10+ safety features and overheat protection"
    ],
    "specifications": {
      "Capacity": "8 Quarts",
      "Functions": "7-in-1 Multi-Cooker",
      "Material": "Stainless Steel",
      "Programs": "13 Smart Programs",
      "Pressure Settings": "High/Low",
      "Timer": "Up to 24 hours",
      "Warranty": "1 Year"
    },
    "searchTerms": ["instant pot", "pressure cooker", "multi cooker", "kitchen appliance", "8 quart"],
    "images": [
      "https://images.unsplash.com/photo-1556909114-4dca813a0c6d?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1556909114-4dca813a0c6d?w=400&h=400&fit=crop&crop=top"
    ],
    "inventory": {
      "quantity": 85,
      "lowStock": 20,
      "inStock": true,
      "fulfillmentType": "FBA"
    },
    "discountPercent": 25,
    "primeEligible": true,
    "reviewCount": 12847,
    "averageRating": 4.6,
    "salesRank": 2,
    "vendorEmail": "home@vendor.com"
  },
  {
    "name": "Nike Air Force 1 '07 Men's Shoes",
    "description": "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash.",
    "price": 90.00,
    "cost": 45.00,
    "category": "clothing",
    "subcategory": "shoes",
    "brand": "Nike",
    "upc": "195866133709",
    "bulletPoints": [
      "LEATHER UPPER: Real and synthetic leather upper provides durability and easy care",
      "AIR-SOLE UNIT: Nike Air cushioning provides lightweight comfort",
      "RUBBER OUTSOLE: Rubber outsole provides traction and durability", 
      "CLASSIC DESIGN: Timeless basketball-inspired design",
      "VERSATILE STYLE: Perfect for casual wear and street fashion"
    ],
    "specifications": {
      "Upper Material": "Leather and synthetic leather",
      "Sole Material": "Rubber",
      "Closure Type": "Lace-up",
      "Cushioning": "Nike Air",
      "Style": "Low-top sneaker",
      "Care": "Spot clean",
      "Origin": "Imported"
    },
    "searchTerms": ["nike air force 1", "nike shoes", "sneakers", "basketball shoes", "white shoes"],
    "images": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=top"
    ],
    "inventory": {
      "quantity": 200,
      "lowStock": 40,
      "inStock": true,
      "fulfillmentType": "FBA"
    },
    "discountPercent": 10,
    "primeEligible": true,
    "reviewCount": 15623,
    "averageRating": 4.4,
    "salesRank": 5,
    "vendorEmail": "fashion@vendor.com"
  }
]
EOF

# Create REAL users (not junk) following copilot authentication patterns
echo "👥 Creating REAL user accounts following copilot patterns..."
cat > src/seeders/data/realUsers.json << 'EOF'
[
  {
    "name": "Platform Admin",
    "email": "admin@ecommerce.com",
    "password": "Admin123!",
    "role": "admin",
    "isEmailVerified": true
  },
  {
    "name": "TechGear Electronics",
    "email": "electronics@vendor.com",
    "password": "Vendor123!",
    "role": "vendor",
    "isEmailVerified": true
  },
  {
    "name": "Fashion Forward Store",
    "email": "fashion@vendor.com",
    "password": "Vendor123!",
    "role": "vendor",
    "isEmailVerified": true
  },
  {
    "name": "Home Essentials Co",
    "email": "home@vendor.com",
    "password": "Vendor123!",
    "role": "vendor",
    "isEmailVerified": true
  },
  {
    "name": "John Smith",
    "email": "john@customer.com",
    "password": "Customer123!",
    "role": "user",
    "isEmailVerified": true
  }
]
EOF

# Create proper seeding script following copilot patterns
echo "🌱 Creating proper database seeder following copilot patterns..."
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
          
          return {
            ...userData,
            password: hashedPassword
          };
        })
      );

      this.users = await User.insertMany(processedUsers);
      
      console.log(`✅ Created ${this.users.length} REAL user accounts:`);
      this.users.forEach(user => {
        console.log(`   • ${user.name} (${user.role}) - ${user.email}`);
      });
      
    } catch (error) {
      console.error('❌ Real user seeding failed:', error);
      throw error;
    }
  }

  async seedRealProducts() {
    try {
      console.log('🛍️  Seeding REAL products following Amazon/Temu patterns...');
      
      const processedProducts = realProductsData.map((productData) => {
        const vendor = this.users.find(user => user.email === productData.vendorEmail);
        if (!vendor) {
          console.warn(`⚠️  Vendor not found: ${productData.vendorEmail}`);
          return null;
        }

        // Generate proper ASIN following Amazon pattern
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let asin = '';
        for (let i = 0; i < 10; i++) {
          asin += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Generate proper SKU
        const brandPrefix = productData.brand?.substring(0, 3).toUpperCase() || 'GEN';
        const categoryPrefix = productData.category.substring(0, 3).toUpperCase();
        const timestamp = Date.now().toString().slice(-6);
        const sku = `${brandPrefix}-${categoryPrefix}-${timestamp}`;

        const { vendorEmail, ...productWithoutEmail } = productData;
        
        return {
          ...productWithoutEmail,
          asin,
          sku,
          vendorId: vendor._id,
          isActive: true
        };
      }).filter(Boolean);

      const products = await Product.insertMany(processedProducts);
      
      console.log(`✅ Created ${products.length} REAL products:`);
      products.forEach(product => {
        console.log(`   • ${product.name} - $${product.price} (ASIN: ${product.asin})`);
      });
      
    } catch (error) {
      console.error('❌ Real product seeding failed:', error);
      throw error;
    }
  }

  async generateRealReport() {
    try {
      const userCount = await User.countDocuments();
      const productCount = await Product.countDocuments();
      const totalValue = await Product.aggregate([
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]);

      console.log('\n📊 REAL Database Seeding Complete');
      console.log('=================================');
      console.log(`👥 Users: ${userCount} (real accounts)`);
      console.log(`🛍️  Products: ${productCount} (real products)`);
      console.log(`💰 Total Catalog Value: $${totalValue[0]?.total?.toLocaleString() || '0'}`);
      console.log('\n🔐 Test Accounts (REAL):');
      console.log('• Admin: admin@ecommerce.com / Admin123!');
      console.log('• Vendor: electronics@vendor.com / Vendor123!');
      console.log('• Customer: john@customer.com / Customer123!');
      console.log('\n✅ Ready for development with REAL data!');
      console.log('🚀 Backend: http://localhost:3000');
      console.log('🎨 Frontend: http://localhost:3001');
      console.log('🔍 Debug Dashboard: http://localhost:3001/debug');
      
    } catch (error) {
      console.error('❌ Real report failed:', error);
    }
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
  console.log('🌱 Seeding Database with REAL Product Data');
  console.log('==========================================');
  seeder.seed();
}
EOF

# Create cleanup command
cat > src/seeders/cleanup.ts << 'EOF'
import DatabaseCleanup from './scripts/cleanupDatabase';

const cleanup = new DatabaseCleanup();
cleanup.cleanup();
EOF

# Create real seeding command  
cat > src/seeders/seedReal.ts << 'EOF'
import RealDataSeeder from './scripts/seedRealData';

const seeder = new RealDataSeeder();
seeder.seed();
EOF

echo ""
echo "✅ Database Cleanup & Real Product System Created!"
echo "================================================="
echo ""
echo "🚨 EMERGENCY COMMANDS:"
echo "  npm run cleanup         # WIPE database completely"
echo "  npm run seed:real       # Add REAL products (iPhone, Nike, etc.)"
echo "  npm run reset:real      # Cleanup + seed real data in one command"
echo ""
echo "🛍️  REAL Products Being Added:"
echo "  • iPhone 15 Pro Max ($1,199.99) - Apple"
echo "  • Sony WH-1000XM5 Headphones ($349.99) - Sony"
echo "  • Levi's 511 Slim Jeans ($69.50) - Levi's"
echo "  • Instant Pot 8Qt ($99.95) - Instant Pot"
echo "  • Nike Air Force 1 Shoes ($90.00) - Nike"
echo ""
echo "🔐 REAL Test Accounts:"
echo "  • Admin: admin@ecommerce.com / Admin123!"
echo "  • Vendor: electronics@vendor.com / Vendor123!"
echo "  • Customer: john@customer.com / Customer123!"
echo ""
echo "▶️  Add these scripts to package.json:"
echo '    "cleanup": "ts-node src/seeders/cleanup.ts",'
echo '    "seed:real": "ts-node src/seeders/seedReal.ts",'
echo '    "reset:real": "npm run cleanup && npm run seed:real"'
echo ""
echo "🎉 Run 'npm run reset:real' to fix everything with REAL data!"
