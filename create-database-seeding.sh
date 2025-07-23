#!/bin/bash
# filepath: create-database-seeding.sh
# Create comprehensive database seeding system following copilot-instructions.md patterns

set -e

echo "🌱 Creating Database Seeding System - Multi-Vendor E-Commerce Platform"
echo "===================================================================="
echo "Following copilot-instructions.md architecture:"
echo "Backend API: http://localhost:3000"
echo "Frontend: http://localhost:3001"
echo "Debug Dashboard: http://localhost:3001/debug"
echo "Database: MongoDB with performance indexes"
echo ""

# Create seeders directory following copilot patterns
echo "📁 Creating database seeding structure..."
mkdir -p src/seeders/data
mkdir -p src/seeders/scripts

# Create User seeder with vendors and admins
echo "🔧 Creating User seeder with multi-vendor support..."
cat > src/seeders/data/users.json << 'EOF'
[
  {
    "name": "Platform Administrator",
    "email": "admin@ecommerce.com",
    "password": "admin123",
    "role": "admin",
    "isEmailVerified": true,
    "avatar": "https://via.placeholder.com/150x150?text=Admin"
  },
  {
    "name": "Electronics Vendor",
    "email": "electronics@vendor.com", 
    "password": "vendor123",
    "role": "vendor",
    "isEmailVerified": true,
    "avatar": "https://via.placeholder.com/150x150?text=Electronics"
  },
  {
    "name": "Fashion Boutique",
    "email": "fashion@vendor.com",
    "password": "vendor123", 
    "role": "vendor",
    "isEmailVerified": true,
    "avatar": "https://via.placeholder.com/150x150?text=Fashion"
  },
  {
    "name": "Home & Garden Store",
    "email": "home@vendor.com",
    "password": "vendor123",
    "role": "vendor", 
    "isEmailVerified": true,
    "avatar": "https://via.placeholder.com/150x150?text=Home"
  },
  {
    "name": "Sports Equipment Co",
    "email": "sports@vendor.com",
    "password": "vendor123",
    "role": "vendor",
    "isEmailVerified": true,
    "avatar": "https://via.placeholder.com/150x150?text=Sports"
  },
  {
    "name": "Book Publishers",
    "email": "books@vendor.com", 
    "password": "vendor123",
    "role": "vendor",
    "isEmailVerified": true,
    "avatar": "https://via.placeholder.com/150x150?text=Books"
  },
  {
    "name": "John Customer",
    "email": "john@customer.com",
    "password": "customer123",
    "role": "user",
    "isEmailVerified": true
  },
  {
    "name": "Sarah Buyer",
    "email": "sarah@customer.com", 
    "password": "customer123",
    "role": "user",
    "isEmailVerified": true
  }
]
EOF

# Create comprehensive product dataset following copilot multi-vendor patterns
echo "🔧 Creating comprehensive product dataset with vendor relationships..."
cat > src/seeders/data/products.json << 'EOF'
[
  {
    "name": "iPhone 15 Pro Max",
    "description": "Latest flagship iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for professionals and tech enthusiasts.",
    "price": 1199,
    "cost": 899,
    "category": "electronics",
    "images": [
      "https://via.placeholder.com/400x400?text=iPhone+15+Pro+Max",
      "https://via.placeholder.com/400x400?text=iPhone+Camera",
      "https://via.placeholder.com/400x400?text=iPhone+Display"
    ],
    "inventory": {
      "quantity": 50,
      "lowStock": 10,
      "inStock": true
    },
    "seo": {
      "title": "iPhone 15 Pro Max - Latest Flagship Smartphone",
      "description": "Buy the newest iPhone 15 Pro Max with A17 Pro chip and titanium design. Free shipping and warranty included.",
      "keywords": ["iphone", "smartphone", "apple", "flagship", "mobile"]
    },
    "discountPercent": 5,
    "vendorEmail": "electronics@vendor.com"
  },
  {
    "name": "MacBook Air M3",
    "description": "Ultra-thin laptop powered by M3 chip. Perfect for students, professionals, and creative work with all-day battery life.",
    "price": 1299,
    "cost": 999,
    "category": "electronics",
    "images": [
      "https://via.placeholder.com/400x400?text=MacBook+Air+M3",
      "https://via.placeholder.com/400x400?text=MacBook+Keyboard",
      "https://via.placeholder.com/400x400?text=MacBook+Screen"
    ],
    "inventory": {
      "quantity": 25,
      "lowStock": 5,
      "inStock": true
    },
    "seo": {
      "title": "MacBook Air M3 - Ultra-Thin Laptop Computer",
      "description": "Experience the power of M3 chip in ultra-portable MacBook Air. Perfect for work and creativity.",
      "keywords": ["macbook", "laptop", "apple", "m3", "ultrabook"]
    },
    "discountPercent": 10,
    "vendorEmail": "electronics@vendor.com"
  },
  {
    "name": "Wireless Noise-Canceling Headphones",
    "description": "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and studio-quality sound.",
    "price": 349,
    "cost": 199,
    "category": "electronics",
    "images": [
      "https://via.placeholder.com/400x400?text=Wireless+Headphones",
      "https://via.placeholder.com/400x400?text=Headphone+Case"
    ],
    "inventory": {
      "quantity": 100,
      "lowStock": 20,
      "inStock": true
    },
    "seo": {
      "title": "Premium Wireless Noise-Canceling Headphones",
      "description": "Enjoy crystal-clear audio with active noise cancellation. 30-hour battery and premium comfort.",
      "keywords": ["headphones", "wireless", "noise-canceling", "audio", "bluetooth"]
    },
    "discountPercent": 15,
    "vendorEmail": "electronics@vendor.com"
  },
  {
    "name": "Designer Leather Jacket",
    "description": "Genuine leather jacket with modern cut and premium finish. Perfect for casual and semi-formal occasions.",
    "price": 299,
    "cost": 149,
    "category": "clothing",
    "images": [
      "https://via.placeholder.com/400x400?text=Leather+Jacket",
      "https://via.placeholder.com/400x400?text=Jacket+Details",
      "https://via.placeholder.com/400x400?text=Jacket+Back"
    ],
    "inventory": {
      "quantity": 40,
      "lowStock": 8,
      "inStock": true
    },
    "seo": {
      "title": "Premium Designer Leather Jacket - Genuine Leather",
      "description": "Stylish genuine leather jacket with modern design. Perfect for fashion-forward individuals.",
      "keywords": ["leather", "jacket", "fashion", "designer", "clothing"]
    },
    "discountPercent": 20,
    "vendorEmail": "fashion@vendor.com"
  },
  {
    "name": "Organic Cotton T-Shirt Collection",
    "description": "Set of 3 premium organic cotton t-shirts in various colors. Soft, comfortable, and environmentally friendly.",
    "price": 89,
    "cost": 35,
    "category": "clothing",
    "images": [
      "https://via.placeholder.com/400x400?text=Cotton+T-Shirts",
      "https://via.placeholder.com/400x400?text=T-Shirt+Colors"
    ],
    "inventory": {
      "quantity": 200,
      "lowStock": 50,
      "inStock": true
    },
    "seo": {
      "title": "Organic Cotton T-Shirt Collection - 3-Pack",
      "description": "Premium organic cotton t-shirts. Comfortable, sustainable, and stylish for everyday wear.",
      "keywords": ["t-shirt", "organic", "cotton", "clothing", "sustainable"]
    },
    "discountPercent": 0,
    "vendorEmail": "fashion@vendor.com"
  },
  {
    "name": "Smart Home Security System",
    "description": "Complete wireless security system with cameras, sensors, and mobile app control. Easy DIY installation.",
    "price": 499,
    "cost": 299,
    "category": "home",
    "images": [
      "https://via.placeholder.com/400x400?text=Security+System",
      "https://via.placeholder.com/400x400?text=Security+Camera",
      "https://via.placeholder.com/400x400?text=Mobile+App"
    ],
    "inventory": {
      "quantity": 30,
      "lowStock": 5,
      "inStock": true
    },
    "seo": {
      "title": "Smart Home Security System - Wireless & Easy Setup",
      "description": "Protect your home with our complete wireless security system. Mobile app control and professional monitoring.",
      "keywords": ["security", "home", "smart", "camera", "wireless"]
    },
    "discountPercent": 25,
    "vendorEmail": "home@vendor.com"
  },
  {
    "name": "Ergonomic Office Chair",
    "description": "Professional ergonomic chair with lumbar support, adjustable height, and breathable mesh fabric. Perfect for long work hours.",
    "price": 399,
    "cost": 199,
    "category": "home",
    "images": [
      "https://via.placeholder.com/400x400?text=Office+Chair",
      "https://via.placeholder.com/400x400?text=Chair+Features"
    ],
    "inventory": {
      "quantity": 60,
      "lowStock": 10,
      "inStock": true
    },
    "seo": {
      "title": "Ergonomic Office Chair - Professional Comfort",
      "description": "Work comfortably with our ergonomic office chair. Lumbar support and adjustable features for all-day comfort.",
      "keywords": ["office", "chair", "ergonomic", "furniture", "workspace"]
    },
    "discountPercent": 30,
    "vendorEmail": "home@vendor.com"
  },
  {
    "name": "Professional Tennis Racket",
    "description": "High-performance tennis racket used by professionals. Perfect balance of power and control for competitive players.",
    "price": 249,
    "cost": 124,
    "category": "sports",
    "images": [
      "https://via.placeholder.com/400x400?text=Tennis+Racket",
      "https://via.placeholder.com/400x400?text=Racket+Details"
    ],
    "inventory": {
      "quantity": 35,
      "lowStock": 7,
      "inStock": true
    },
    "seo": {
      "title": "Professional Tennis Racket - Tournament Quality",
      "description": "Elevate your game with our professional tennis racket. Perfect balance and control for serious players.",
      "keywords": ["tennis", "racket", "sports", "professional", "equipment"]
    },
    "discountPercent": 12,
    "vendorEmail": "sports@vendor.com"
  },
  {
    "name": "Fitness Tracking Smartwatch",
    "description": "Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life.",
    "price": 299,
    "cost": 149,
    "category": "sports",
    "images": [
      "https://via.placeholder.com/400x400?text=Fitness+Watch",
      "https://via.placeholder.com/400x400?text=Watch+Features",
      "https://via.placeholder.com/400x400?text=Health+Metrics"
    ],
    "inventory": {
      "quantity": 80,
      "lowStock": 15,
      "inStock": true
    },
    "seo": {
      "title": "Fitness Tracking Smartwatch - Advanced Health Monitoring",
      "description": "Track your fitness goals with our advanced smartwatch. Heart rate, GPS, and comprehensive health metrics.",
      "keywords": ["smartwatch", "fitness", "tracker", "health", "sports"]
    },
    "discountPercent": 18,
    "vendorEmail": "sports@vendor.com"
  },
  {
    "name": "Programming Fundamentals: Complete Guide",
    "description": "Comprehensive guide to programming covering multiple languages, algorithms, and best practices. Perfect for beginners and professionals.",
    "price": 89,
    "cost": 35,
    "category": "books",
    "images": [
      "https://via.placeholder.com/400x400?text=Programming+Book",
      "https://via.placeholder.com/400x400?text=Book+Contents"
    ],
    "inventory": {
      "quantity": 150,
      "lowStock": 30,
      "inStock": true
    },
    "seo": {
      "title": "Programming Fundamentals Complete Guide - Learn to Code",
      "description": "Master programming with our comprehensive guide. Covers multiple languages and industry best practices.",
      "keywords": ["programming", "book", "coding", "software", "development"]
    },
    "discountPercent": 0,
    "vendorEmail": "books@vendor.com"
  },
  {
    "name": "Entrepreneurship Success Stories",
    "description": "Inspiring collection of successful entrepreneur stories and business strategies. Learn from industry leaders and innovators.",
    "price": 59,
    "cost": 25,
    "category": "books",
    "images": [
      "https://via.placeholder.com/400x400?text=Business+Book",
      "https://via.placeholder.com/400x400?text=Success+Stories"
    ],
    "inventory": {
      "quantity": 120,
      "lowStock": 25,
      "inStock": true
    },
    "seo": {
      "title": "Entrepreneurship Success Stories - Business Inspiration",
      "description": "Get inspired by successful entrepreneur stories. Learn winning strategies and business insights.",
      "keywords": ["entrepreneurship", "business", "success", "startup", "leadership"]
    },
    "discountPercent": 15,
    "vendorEmail": "books@vendor.com"
  }
]
EOF

# Create database seeder script following copilot patterns
echo "🔧 Creating database seeder script with User/Product relationships..."
cat > src/seeders/scripts/seedDatabase.ts << 'EOF'
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../../utils/config';
import User from '../../models/User';
import Product from '../../models/Product';

// Import seed data
import usersData from '../data/users.json';
import productsData from '../data/products.json';

// Database seeder following copilot-instructions.md patterns
class DatabaseSeeder {
  private users: any[] = [];

  async connectDatabase() {
    try {
      await mongoose.connect(config.mongoUri);
      console.log('💾 Database connected for seeding');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  async clearDatabase() {
    try {
      await User.deleteMany({});
      await Product.deleteMany({});
      console.log('🧹 Database cleared successfully');
    } catch (error) {
      console.error('❌ Database clearing failed:', error);
      throw error;
    }
  }

  async seedUsers() {
    try {
      console.log('👥 Seeding users with multi-vendor roles...');
      
      const processedUsers = await Promise.all(
        usersData.map(async (userData) => {
          // Hash password before storing
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(userData.password, salt);
          
          return {
            ...userData,
            password: hashedPassword
          };
        })
      );

      this.users = await User.insertMany(processedUsers);
      
      console.log(`✅ Created ${this.users.length} users:`);
      this.users.forEach(user => {
        console.log(`   • ${user.name} (${user.role}) - ${user.email}`);
      });
      
    } catch (error) {
      console.error('❌ User seeding failed:', error);
      throw error;
    }
  }

  async seedProducts() {
    try {
      console.log('🛍️  Seeding products with vendor relationships...');
      
      const processedProducts = productsData.map((productData) => {
        // Find vendor by email
        const vendor = this.users.find(user => user.email === productData.vendorEmail);
        if (!vendor) {
          console.warn(`⚠️  Vendor not found for email: ${productData.vendorEmail}`);
          return null;
        }

        // Generate unique SKU following copilot patterns
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        const sku = `${productData.category.toUpperCase()}-${timestamp}-${random}`;

        // Remove vendorEmail and add vendorId
        const { vendorEmail, ...productWithoutEmail } = productData;
        
        return {
          ...productWithoutEmail,
          vendorId: vendor._id,
          sku,
          isActive: true
        };
      }).filter(Boolean); // Remove null entries

      const products = await Product.insertMany(processedProducts);
      
      console.log(`✅ Created ${products.length} products:`);
      
      // Group by vendor for better display
      const productsByVendor = products.reduce((acc: any, product) => {
        const vendor = this.users.find(u => u._id.toString() === product.vendorId.toString());
        const vendorName = vendor?.name || 'Unknown Vendor';
        
        if (!acc[vendorName]) {
          acc[vendorName] = [];
        }
        acc[vendorName].push(product);
        return acc;
      }, {});

      Object.entries(productsByVendor).forEach(([vendorName, vendorProducts]: [string, any]) => {
        console.log(`   📦 ${vendorName}: ${vendorProducts.length} products`);
        vendorProducts.forEach((product: any) => {
          console.log(`      • ${product.name} ($${product.price}) - ${product.category}`);
        });
      });
      
    } catch (error) {
      console.error('❌ Product seeding failed:', error);
      throw error;
    }
  }

  async createIndexes() {
    try {
      console.log('🔍 Creating database indexes for performance...');
      
      // User indexes
      await User.createIndexes();
      
      // Product indexes (compound indexes following copilot patterns)
      await Product.createIndexes();
      
      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Index creation failed:', error);
      throw error;
    }
  }

  async generateSummaryReport() {
    try {
      const userCount = await User.countDocuments();
      const productCount = await Product.countDocuments();
      const vendorCount = await User.countDocuments({ role: 'vendor' });
      const adminCount = await User.countDocuments({ role: 'admin' });
      const customerCount = await User.countDocuments({ role: 'user' });
      
      // Category distribution
      const categories = await Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, totalValue: { $sum: '$price' } } },
        { $sort: { count: -1 } }
      ]);

      console.log('\n📊 Database Seeding Summary Report');
      console.log('=====================================');
      console.log(`👥 Users: ${userCount} total`);
      console.log(`   • Administrators: ${adminCount}`);
      console.log(`   • Vendors: ${vendorCount}`);
      console.log(`   • Customers: ${customerCount}`);
      console.log(`🛍️  Products: ${productCount} total`);
      console.log('\n📈 Product Distribution by Category:');
      categories.forEach(cat => {
        console.log(`   • ${cat._id}: ${cat.count} products ($${cat.totalValue.toLocaleString()} total value)`);
      });
      
      console.log('\n🚀 Ready for Development & Testing!');
      console.log('===================================');
      console.log('Backend API: http://localhost:3000');
      console.log('Frontend: http://localhost:3001');
      console.log('Debug Dashboard: http://localhost:3001/debug');
      console.log('\nTest Accounts:');
      console.log('• Admin: admin@ecommerce.com / admin123');
      console.log('• Vendor: electronics@vendor.com / vendor123');
      console.log('• Customer: john@customer.com / customer123');
      
    } catch (error) {
      console.error('❌ Summary report failed:', error);
    }
  }

  async seed(clearFirst = false) {
    try {
      await this.connectDatabase();
      
      if (clearFirst) {
        await this.clearDatabase();
      }
      
      await this.seedUsers();
      await this.seedProducts();
      await this.createIndexes();
      await this.generateSummaryReport();
      
      console.log('\n🎉 Database seeding completed successfully!');
      
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      process.exit(1);
    } finally {
      await mongoose.connection.close();
    }
  }
}

// Export seeder for use in npm scripts
export default DatabaseSeeder;

// CLI execution
if (require.main === module) {
  const seeder = new DatabaseSeeder();
  const clearFirst = process.argv.includes('--clear');
  
  console.log('🌱 Starting Database Seeding Process...');
  console.log('======================================');
  if (clearFirst) {
    console.log('⚠️  Clear mode enabled - existing data will be removed');
  }
  
  seeder.seed(clearFirst);
}
EOF

# Create CLI script for easy seeding
echo "🔧 Creating CLI seeding script..."
cat > src/seeders/seed.ts << 'EOF'
import DatabaseSeeder from './scripts/seedDatabase';

const seeder = new DatabaseSeeder();
const clearFirst = process.argv.includes('--clear') || process.argv.includes('-c');

console.log('🌱 E-Commerce Platform Database Seeder');
console.log('======================================');

if (clearFirst) {
  console.log('⚠️  WARNING: This will clear existing database data');
  console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');
  
  setTimeout(() => {
    seeder.seed(true);
  }, 3000);
} else {
  console.log('ℹ️  Adding seed data to existing database');
  console.log('Use --clear or -c to clear database first\n');
  seeder.seed(false);
}
EOF

echo ""
echo "✅ Database Seeding System Created!"
echo "=================================="
echo ""
echo "📁 Created Files Following Copilot Instructions:"
echo "  ✓ src/seeders/data/users.json           # Multi-vendor user dataset"
echo "  ✓ src/seeders/data/products.json        # Comprehensive product catalog"
echo "  ✓ src/seeders/scripts/seedDatabase.ts   # Main seeding logic with relationships"
echo "  ✓ src/seeders/seed.ts                   # CLI interface for seeding"
echo ""
echo "🌱 Seeding Features:"
echo "  ✓ Multi-vendor user structure (admins, vendors, customers)"
echo "  ✓ Real product data across all categories (electronics, clothing, etc.)"
echo "  ✓ Vendor-product relationships with proper foreign keys"
echo "  ✓ Performance indexes creation (compound indexes on vendor + category)"
echo "  ✓ SKU generation following copilot patterns"
echo "  ✓ Password hashing for all user accounts"
echo "  ✓ Virtual fields support for calculated prices"
echo "  ✓ Comprehensive reporting with category distribution"
echo ""
echo "📊 Database Contents (After Seeding):"
echo "  • 8 Users (1 admin, 5 vendors, 2 customers)"
echo "  • 11+ Products across all categories"
echo "  • Performance indexes on frequently queried fields"
echo "  • Test accounts ready for development"
echo ""
echo "▶️  Seeding Commands:"
echo "    npm run seed                    # Add data to existing database"
echo "    npm run seed:clear             # Clear database and add fresh data"
echo "    npm run seed -- --clear        # Alternative clear syntax"
echo ""
echo "🧪 Test Accounts (Ready to Use):"
echo "  Admin:    admin@ecommerce.com / admin123"
echo "  Vendor:   electronics@vendor.com / vendor123"  
echo "  Customer: john@customer.com / customer123"
echo ""
echo "🚀 Debug Ecosystem (Post-Seeding):"
echo "  http://localhost:3001/debug          # Primary debug dashboard"
echo "  http://localhost:3000/api/products   # Browse seeded products"
echo "  http://localhost:3000/api/auth/login # Test authentication"
echo ""
echo "▶️  Add these scripts to package.json:"
echo '    "seed": "ts-node src/seeders/seed.ts",'
echo '    "seed:clear": "ts-node src/seeders/seed.ts --clear"'
echo ""
echo "🎉 Ready to populate your real product database!"
