import mongoose from 'mongoose';
import { CategoryImporter } from '../services/dropshipping/CategoryImporter';
import connectDB from '../config/db';

async function importAlibabaData() {
  try {
    console.log('🚀 Starting Alibaba data import...');
    
    // Connect to database
    await connectDB();
    
    const tenantId = process.env.TENANT_ID || '6884bf4702e02fe6eb401303';
    const importer = new CategoryImporter(tenantId);
    
    // Import categories first
    console.log('📂 Importing categories...');
    await importer.importCategoriesFromAlibaba();
    
    // Import products for each category
    console.log('📦 Importing products...');
    await importer.importProductsFromAlibaba(undefined, 100); // Import 100 products total
    
    console.log('✅ Alibaba data import completed successfully!');
    
    // Show summary
    const Category = require('../models/Category').default;
    const Product = require('../models/Product').default;
    
    const categoryCount = await Category.countDocuments({ tenantId });
    const productCount = await Product.countDocuments({ tenantId, isDropship: true });
    
    console.log(`📊 Summary:`);
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Products: ${productCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing Alibaba data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  importAlibabaData();
}

export { importAlibabaData };