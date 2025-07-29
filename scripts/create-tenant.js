const mongoose = require('mongoose');
require('dotenv').config();

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Tenant = mongoose.model('Tenant', tenantSchema);

async function createTenant() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const tenant = {
      _id: '6884bf4702e02fe6eb401303',
      name: 'Whitestart E-Commerce',
      domain: 'localhost:3001',
      isActive: true
    };
    
    await Tenant.deleteOne({ _id: '6884bf4702e02fe6eb401303' });
    await Tenant.create(tenant);
    console.log('Created tenant:', tenant.name);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating tenant:', error);
    process.exit(1);
  }
}

createTenant();