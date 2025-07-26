const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

async function seedFeaturedAlarmProducts() {
  try {
    console.log('🔍 Looking for Alarm Systems category...');
    
    // Find alarm systems category (try multiple possible slugs)
    const alarmCategory = await Category.findOne({ 
      $or: [
        { slug: 'alarm-systems' },
        { slug: 'alarms' },
        { name: /alarm/i }
      ]
    });
    
    if (!alarmCategory) {
      console.log('❌ Alarm Systems category not found');
      console.log('Available categories:');
      const allCategories = await Category.find({}, 'name slug');
      allCategories.forEach(cat => console.log(`  - ${cat.name} (${cat.slug})`));
      return;
    }
    
    console.log(`✅ Found category: ${alarmCategory.name} (${alarmCategory.slug})`);
    
    // Get a vendor for the products
    const Vendor = require('../models/Vendor');
    let vendor = await Vendor.findOne();
    
    if (!vendor) {
      // Create a default vendor if none exists
      vendor = await Vendor.create({
        name: 'Security Solutions Inc',
        slug: 'security-solutions-inc',
        email: 'contact@securitysolutions.com',
        description: 'Professional security equipment supplier',
        isActive: true
      });
      console.log('✅ Created default vendor');
    }
    
    const featuredAlarmProducts = [
      {
        name: 'Wireless Home Security Alarm System',
        slug: 'wireless-home-security-alarm',
        description: 'Complete wireless security system with door/window sensors, motion detectors, and smartphone app control. Professional monitoring ready with 24/7 alerts.',
        price: 299.99,
        compareAtPrice: 399.99,
        featured: true,
        category: alarmCategory._id,
        vendor: vendor._id,
        image: '/images/products/wireless-alarm-system.jpg',
        gallery: [
          '/images/products/wireless-alarm-1.jpg', 
          '/images/products/wireless-alarm-2.jpg'
        ],
        specifications: {
          'Detection Range': '30 feet',
          'Battery Life': '2 years',
          'Connectivity': 'WiFi + Cellular backup',
          'Zones': '8 wireless zones',
          'Sensors Included': '4 door/window, 2 motion'
        },
        features: [
          'Smartphone app control',
          'Professional monitoring ready',
          'Battery backup included',
          'Easy DIY installation',
          'Real-time alerts'
        ],
        stock: 50,
        isActive: true,
        tags: ['wireless', 'security', 'alarm', 'smart-home']
      },
      {
        name: 'Smart Smoke & Carbon Monoxide Detector',
        slug: 'smart-smoke-co-detector',
        description: 'Intelligent smoke and carbon monoxide detector with smartphone alerts, voice announcements, and self-testing capability.',
        price: 89.99,
        compareAtPrice: 129.99,
        featured: true,
        category: alarmCategory._id,
        vendor: vendor._id,
        image: '/images/products/smart-smoke-detector.jpg',
        gallery: ['/images/products/smoke-detector-1.jpg'],
        specifications: {
          'Sensor Type': 'Photoelectric + Electrochemical',
          'Battery Life': '10 years sealed',
          'Connectivity': 'WiFi 2.4GHz',
          'Dimensions': '5.3" diameter x 1.5" height',
          'Operating Temperature': '40°F to 100°F'
        },
        features: [
          'Real-time smartphone alerts',
          'Voice location announcements',
          'Self-testing technology',
          '10-year warranty',
          'Split-spectrum sensor'
        ],
        stock: 75,
        isActive: true,
        tags: ['smoke-detector', 'carbon-monoxide', 'smart', 'safety']
      },
      {
        name: 'Professional Motion Sensor Alarm',
        slug: 'professional-motion-sensor-alarm',
        description: 'Commercial-grade PIR motion sensor with adjustable sensitivity, pet immunity up to 40lbs, and anti-masking protection.',
        price: 149.99,
        compareAtPrice: 199.99,
        featured: true,
        category: alarmCategory._id,
        vendor: vendor._id,
        image: '/images/products/motion-sensor.jpg',
        specifications: {
          'Detection Pattern': '90° coverage angle',
          'Range': '40 feet maximum',
          'Pet Immunity': 'Up to 40lbs',
          'Power': '12V DC',
          'Installation': 'Wall or corner mount'
        },
        features: [
          'Digital signal processing',
          'Anti-masking protection',
          'Temperature compensation',
          'LED walk test mode',
          'Adjustable sensitivity'
        ],
        stock: 25,
        isActive: true,
        tags: ['motion-sensor', 'pir', 'commercial-grade', 'security']
      }
    ];
    
    console.log('📦 Creating featured alarm products...');
    
    for (const productData of featuredAlarmProducts) {
      const existingProduct = await Product.findOne({ slug: productData.slug });
      
      if (!existingProduct) {
        const newProduct = await Product.create(productData);
        console.log(`✅ Created: ${newProduct.name} (${newProduct.slug})`);
      } else {
        await Product.findByIdAndUpdate(existingProduct._id, { 
          featured: true,
          price: productData.price,
          compareAtPrice: productData.compareAtPrice 
        });
        console.log(`🔄 Updated to featured: ${productData.name}`);
      }
    }
    
    // Verify results
    const featuredCount = await Product.countDocuments({ 
      category: alarmCategory._id, 
      featured: true 
    });
    
    console.log(`🎯 Successfully seeded ${featuredCount} featured alarm products`);
    console.log('📊 Test API: curl "http://localhost:3000/api/products?featured=true&category=' + alarmCategory.slug + '"');
    
  } catch (error) {
    console.error('❌ Error seeding featured alarm products:', error);
    throw error;
  }
}

// Connect to database and run if called directly
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(async () => {
    console.log('🔗 Connected to MongoDB');
    await seedFeaturedAlarmProducts();
    console.log('✅ Seeding completed');
    mongoose.connection.close();
  }).catch(error => {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  });
}

module.exports = { seedFeaturedAlarmProducts };
