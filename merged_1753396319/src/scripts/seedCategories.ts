import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Category from '../models/Category';
import connectDB from '../config/database';

/**
 * Category seeder with color schemes following Database Patterns from Copilot Instructions
 * Seeds categories with visual theming for multi-vendor e-commerce platform
 */

// Load environment variables from project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const categories = [
  {
    name: 'Sports & Recreation',
    slug: 'sports',
    description: 'Sports equipment, fitness gear, and outdoor recreation products for all skill levels',
    image: '/images/categories/sports.jpg',
    subcategories: ['Fitness Equipment', 'Outdoor Sports', 'Team Sports', 'Water Sports', 'Athletic Wear'],
    isActive: true,
    colorScheme: {
      primary: '#FF6B35',     // Energetic orange
      secondary: '#F7931E',   // Vibrant yellow-orange
      accent: '#FFE66D',      // Bright yellow
      background: '#FFF8F0',  // Light warm background
      text: '#2C3E50',        // Dark blue-gray text
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFE66D 100%)'
    },
    seo: {
      title: 'Sports & Recreation Equipment | Multi-Vendor Marketplace',
      description: 'Discover premium sports equipment, fitness gear, and outdoor recreation products from verified vendors.',
      keywords: 'sports, fitness, outdoor, recreation, equipment, athletic, gear'
    }
  },
  {
    name: 'Hardware & Tools',
    slug: 'hardware',
    description: 'Professional tools, hardware supplies, and home improvement equipment',
    image: '/images/categories/hardware.jpg',
    subcategories: ['Hand Tools', 'Power Tools', 'Hardware Supplies', 'Safety Equipment', 'Measuring Tools'],
    isActive: true,
    colorScheme: {
      primary: '#34495E',     // Steel blue
      secondary: '#5D6D7E',   // Gray-blue
      accent: '#F39C12',      // Construction orange
      background: '#F8F9FA',  // Light gray background
      text: '#2C3E50',        // Dark text
      gradient: 'linear-gradient(135deg, #34495E 0%, #5D6D7E 50%, #F39C12 100%)'
    },
    seo: {
      title: 'Hardware & Tools | Professional Grade Equipment',
      description: 'Find professional tools, hardware supplies, and home improvement equipment from trusted vendors.',
      keywords: 'tools, hardware, home improvement, construction, professional, power tools'
    }
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Consumer electronics, gadgets, and cutting-edge technology products',
    image: '/images/categories/electronics.jpg',
    subcategories: ['Smartphones', 'Computers & Laptops', 'Audio & Video', 'Gaming', 'Smart Home'],
    isActive: true,
    colorScheme: {
      primary: '#3498DB',     // Tech blue
      secondary: '#9B59B6',   // Purple
      accent: '#1ABC9C',      // Teal
      background: '#F4F6F7',  // Very light blue-gray
      text: '#2C3E50',        // Dark text
      gradient: 'linear-gradient(135deg, #3498DB 0%, #9B59B6 50%, #1ABC9C 100%)'
    },
    seo: {
      title: 'Electronics & Technology | Latest Gadgets',
      description: 'Explore the latest electronics, gadgets, and technology products from multiple vendors.',
      keywords: 'electronics, technology, gadgets, smartphones, computers, gaming'
    }
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home decor, furniture, and gardening supplies for beautiful living spaces',
    image: '/images/categories/home-garden.jpg',
    subcategories: ['Furniture', 'Home Decor', 'Kitchen & Dining', 'Garden & Outdoor', 'Storage & Organization'],
    isActive: true,
    colorScheme: {
      primary: '#27AE60',     // Garden green
      secondary: '#F39C12',   // Warm orange
      accent: '#E74C3C',      // Red accent
      background: '#F8FFF8',  // Very light green
      text: '#2C3E50',        // Dark text
      gradient: 'linear-gradient(135deg, #27AE60 0%, #F39C12 50%, #E74C3C 100%)'
    },
    seo: {
      title: 'Home & Garden | Beautiful Living Solutions',
      description: 'Transform your home and garden with furniture, decor, and gardening supplies from various vendors.',
      keywords: 'home, garden, furniture, decor, kitchen, gardening, outdoor living'
    }
  },
  {
    name: 'Fashion & Apparel',
    slug: 'fashion',
    description: 'Trendy clothing, accessories, and fashion items for all styles',
    image: '/images/categories/fashion.jpg',
    subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Jewelry'],
    isActive: true,
    colorScheme: {
      primary: '#E91E63',     // Fashion pink
      secondary: '#9C27B0',   // Purple
      accent: '#FF9800',      // Orange accent
      background: '#FDF2F8',  // Light pink background
      text: '#2C3E50',        // Dark text
      gradient: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 50%, #FF9800 100%)'
    },
    seo: {
      title: 'Fashion & Apparel | Trendy Clothing & Accessories',
      description: 'Discover the latest fashion trends, clothing, and accessories from multiple fashion vendors.',
      keywords: 'fashion, clothing, apparel, accessories, shoes, jewelry, style'
    }
  },
  {
    name: 'Health & Beauty',
    slug: 'health-beauty',
    description: 'Health products, beauty essentials, and wellness items',
    image: '/images/categories/health-beauty.jpg',
    subcategories: ['Skincare', 'Makeup', 'Health Supplements', 'Personal Care', 'Wellness'],
    isActive: true,
    colorScheme: {
      primary: '#FF69B4',     // Beauty pink
      secondary: '#DA70D6',   // Orchid
      accent: '#20B2AA',      // Light sea green
      background: '#FFF5F8',  // Very light pink
      text: '#2C3E50',        // Dark text
      gradient: 'linear-gradient(135deg, #FF69B4 0%, #DA70D6 50%, #20B2AA 100%)'
    },
    seo: {
      title: 'Health & Beauty | Wellness & Beauty Products',
      description: 'Find quality health products, beauty essentials, and wellness items from trusted vendors.',
      keywords: 'health, beauty, skincare, makeup, wellness, supplements, personal care'
    }
  },
  {
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car parts, accessories, and automotive maintenance products',
    image: '/images/categories/automotive.jpg',
    subcategories: ['Car Parts', 'Tools & Equipment', 'Accessories', 'Maintenance', 'Electronics'],
    isActive: true,
    colorScheme: {
      primary: '#2C3E50',     // Dark blue-gray
      secondary: '#E74C3C',   // Red
      accent: '#F39C12',      // Orange
      background: '#F7F9FC',  // Light background
      text: '#2C3E50',        // Dark text
      gradient: 'linear-gradient(135deg, #2C3E50 0%, #E74C3C 50%, #F39C12 100%)'
    },
    seo: {
      title: 'Automotive Parts & Accessories | Car Maintenance',
      description: 'Find quality car parts, accessories, and automotive maintenance products.',
      keywords: 'automotive, car parts, accessories, maintenance, tools, auto'
    }
  }
];

const seedCategories = async (): Promise<void> => {
  try {
    console.log('🔄 Starting category seeding with color schemes...');
    console.log(`📁 Working directory: ${process.cwd()}`);
    
    // Connect to database following Database Patterns
    await connectDB();
    console.log('✅ Database connection established');
    
    console.log('🌱 Seeding categories with color schemes...');
    
    // Clear existing categories
    const existingCount = await Category.countDocuments();
    console.log(`📊 Found ${existingCount} existing categories`);
    
    if (existingCount > 0) {
      console.log('🗑️  Clearing existing categories...');
      await Category.deleteMany({});
      console.log('✅ Existing categories cleared');
    }
    
    // Insert new categories with color validation
    console.log('📝 Inserting categories with color schemes...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Successfully created ${createdCategories.length} categories with color schemes`);
    
    // Display created categories with color info
    console.log('\n🎨 Created Categories with Color Schemes:');
    createdCategories.forEach((cat, index) => {
      console.log(`   ${index + 1}. 📁 ${cat.name} (slug: ${cat.slug})`);
      console.log(`      🎨 Colors: Primary(${cat.colorScheme.primary}) | Secondary(${cat.colorScheme.secondary}) | Accent(${cat.colorScheme.accent})`);
      console.log(`      📝 ${cat.description}`);
      console.log(`      🏷️  Subcategories: ${cat.subcategories.length}`);
      console.log('');
    });
    
    // Verify seeding was successful
    const finalCount = await Category.countDocuments();
    console.log(`🎯 Final category count: ${finalCount}`);
    
    console.log('🎉 Category seeding with color schemes completed successfully!');
    console.log('\n🚀 Next steps:');
    console.log('   • Start your servers: npm run dev:all');
    console.log('   • Test API: curl http://localhost:3000/api/categories');
    console.log('   • Visit themed category: http://localhost:3001/category/sports');
    console.log('   • Check color schemes in category data');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during category seeding:');
    console.error(error);
    
    if (error instanceof Error) {
      console.error(`📝 Error message: ${error.message}`);
      if (error.message.includes('validation')) {
        console.error('💡 Tip: Check color hex values are valid (e.g., #FF0000)');
      }
    }
    
    console.log('\n💡 Troubleshooting tips:');
    console.log('   • Ensure all color values are valid hex codes');
    console.log('   • Check gradient syntax is correct');
    console.log('   • Verify MongoDB is running');
    
    process.exit(1);
  }
};

// Self-executing seeder when run directly
if (require.main === module) {
  console.log('🚀 Running category seeder with color schemes...');
  seedCategories();
}

export default seedCategories;