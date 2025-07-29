const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  sku: { type: String, required: true },
  asin: { type: String, required: true },
  images: [String],
  inventory: {
    quantity: { type: Number, default: 0 },
    lowStock: { type: Number, default: 10 },
    inStock: { type: Boolean, default: true }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const sampleProducts = [
  {
    tenantId: '6884bf4702e02fe6eb401303',
    name: 'Security Camera System',
    slug: 'security-camera-system',
    description: 'Professional 4K security camera system with night vision',
    price: 299.99,
    originalPrice: 399.99,
    category: 'security',
    brand: 'SecureTech',
    vendorId: '6884bf4702e02fe6eb401304',
    sku: 'SEC-CAM-001',
    asin: 'B123456789',
    images: ['/placeholder.svg'],
    inventory: { quantity: 50, inStock: true }
  },
  {
    tenantId: '6884bf4702e02fe6eb401303',
    name: 'Smart Door Lock',
    slug: 'smart-door-lock',
    description: 'WiFi enabled smart door lock with mobile app control',
    price: 199.99,
    category: 'security',
    brand: 'SmartHome',
    vendorId: '6884bf4702e02fe6eb401304',
    sku: 'LOCK-001',
    asin: 'B987654321',
    images: ['/placeholder.svg'],
    inventory: { quantity: 25, inStock: true }
  },
  {
    tenantId: '6884bf4702e02fe6eb401303',
    name: 'Motion Sensor Light',
    slug: 'motion-sensor-light',
    description: 'Solar powered motion sensor security light',
    price: 49.99,
    category: 'security',
    brand: 'BrightGuard',
    vendorId: '6884bf4702e02fe6eb401304',
    sku: 'LIGHT-001',
    asin: 'B456789123',
    images: ['/placeholder.svg'],
    inventory: { quantity: 100, inStock: true }
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    await Product.insertMany(sampleProducts);
    console.log('Seeded sample products');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();