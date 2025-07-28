/**
 * Script to check for duplicate slugs in the database
 * 
 * This script can be run without modifying the existing models
 * to identify any duplicate slugs that need to be fixed.
 * 
 * Usage: node check-duplicate-slugs.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shoppingcart';
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Check for duplicate slugs in a collection
async function checkDuplicateSlugs(collectionName, slugField) {
  console.log(`\nChecking for duplicate slugs in ${collectionName}...`);
  
  try {
    const collection = mongoose.connection.collection(collectionName);
    
    // Create aggregation pipeline to find duplicates
    const pipeline = [
      { $group: { _id: `$${slugField}`, count: { $sum: 1 }, ids: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } },
      { $sort: { count: -1 } }
    ];
    
    const duplicates = await collection.aggregate(pipeline).toArray();
    
    if (duplicates.length > 0) {
      console.log(`⚠️ Found ${duplicates.length} duplicate slugs in ${collectionName}:`);
      
      for (const dup of duplicates) {
        console.log(`  - "${dup._id}" appears ${dup.count} times (IDs: ${dup.ids.join(', ')})`);
        
        // Get the actual documents to show more details
        const docs = await collection.find({ [slugField]: dup._id }).toArray();
        docs.forEach((doc, index) => {
          console.log(`    ${index + 1}. ${doc.name || doc.title || 'Unnamed'} (${doc._id})`);
        });
      }
      
      console.log(`\nTo fix these duplicates, you can update the slugs manually or implement the pre-save hooks`);
      console.log(`described in the slug-indexing-guide.md document.`);
    } else {
      console.log(`✅ No duplicate slugs found in ${collectionName}`);
    }
  } catch (error) {
    console.error(`Error checking ${collectionName}:`, error);
  }
}

// Check for indexes on slug fields
async function checkSlugIndexes(collectionName, slugField) {
  console.log(`\nChecking for slug indexes in ${collectionName}...`);
  
  try {
    const collection = mongoose.connection.collection(collectionName);
    const indexes = await collection.indexes();
    
    const slugIndex = indexes.find(index => 
      index.key && index.key[slugField] === 1
    );
    
    if (slugIndex) {
      console.log(`✅ Found index on ${slugField} field`);
      if (slugIndex.unique) {
        console.log(`✅ Index is unique`);
      } else {
        console.log(`⚠️ Index is NOT unique - consider adding a unique constraint`);
      }
    } else {
      console.log(`❌ No index found on ${slugField} field`);
      console.log(`   Consider adding an index: collection.createIndex({ ${slugField}: 1 }, { unique: true })`);
    }
  } catch (error) {
    console.error(`Error checking indexes for ${collectionName}:`, error);
  }
}

// Main function
async function main() {
  await connectToDatabase();
  
  console.log('=== Slug Verification Tool ===');
  
  // Check collections that might have slugs
  const collections = [
    { name: 'products', slugField: 'slug' },
    { name: 'categories', slugField: 'slug' },
    { name: 'vendors', slugField: 'slug' },
    { name: 'newsarticles', slugField: 'seoMetadata.slug' }
  ];
  
  // Get list of actual collections in the database
  const dbCollections = await mongoose.connection.db.listCollections().toArray();
  const dbCollectionNames = dbCollections.map(c => c.name);
  
  for (const collection of collections) {
    if (dbCollectionNames.includes(collection.name)) {
      // Check for duplicate slugs
      await checkDuplicateSlugs(collection.name, collection.slugField);
      
      // Check for indexes
      await checkSlugIndexes(collection.name, collection.slugField);
    } else {
      console.log(`\nCollection "${collection.name}" not found in database`);
    }
  }
  
  console.log('\nSlug verification complete!');
  
  // Close the database connection
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  mongoose.disconnect();
  process.exit(1);
});