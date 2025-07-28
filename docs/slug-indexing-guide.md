# Slug Indexing Implementation Guide

This document outlines the necessary changes to implement proper slug indexing in the e-commerce platform to ensure efficient queries and prevent duplicate slugs.

## Overview

Slugs are used throughout the application for SEO-friendly URLs. To ensure optimal performance and data integrity:

1. All models with slug fields should have unique indexes on those fields
2. Pre-save hooks should be implemented to handle slug generation and uniqueness
3. Regular checks should be performed to detect and fix any duplicate slugs

## Required Changes

### 1. Product Model

Ensure the Product model has:

```javascript
// In the schema definition
slug: { 
  type: String, 
  required: true, 
  unique: true, 
  trim: true,
  lowercase: true
}

// After schema definition
ProductSchema.index({ slug: 1 }, { unique: true });

// Pre-save hook for slug generation and uniqueness
ProductSchema.pre('save', async function(next) {
  if (this.isModified('name') && !this.isModified('slug')) {
    // Generate slug from name if not explicitly set
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Check for duplicate slugs
  const slugRegEx = new RegExp(`^${this.slug}(-[0-9]*)?$`, 'i');
  const productsWithSlug = await this.constructor.find({ slug: slugRegEx });
  
  // If we have a duplicate and it's not the current document
  if (productsWithSlug.length > 0) {
    const currentProductId = this._id.toString();
    const duplicates = productsWithSlug.filter(product => 
      product._id.toString() !== currentProductId
    );
    
    if (duplicates.length > 0) {
      // Add a suffix to make the slug unique
      this.slug = `${this.slug}-${duplicates.length}`;
    }
  }
  
  next();
});
```

### 2. Category Model

Ensure the Category model has:

```javascript
// In the schema definition
slug: { 
  type: String, 
  required: true, 
  unique: true, 
  trim: true,
  lowercase: true
}

// After schema definition
CategorySchema.index({ slug: 1 }, { unique: true });

// Pre-save hook for slug generation and uniqueness
CategorySchema.pre('save', async function(next) {
  if (this.isModified('name') && !this.isModified('slug')) {
    // Generate slug from name if not explicitly set
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Check for duplicate slugs
  const slugRegEx = new RegExp(`^${this.slug}(-[0-9]*)?$`, 'i');
  const categoriesWithSlug = await this.constructor.find({ slug: slugRegEx });
  
  // If we have a duplicate and it's not the current document
  if (categoriesWithSlug.length > 0) {
    const currentCategoryId = this._id.toString();
    const duplicates = categoriesWithSlug.filter(category => 
      category._id.toString() !== currentCategoryId
    );
    
    if (duplicates.length > 0) {
      // Add a suffix to make the slug unique
      this.slug = `${this.slug}-${duplicates.length}`;
    }
  }
  
  next();
});
```

### 3. Vendor Model

Ensure the Vendor model has:

```javascript
// In the schema definition
slug: { 
  type: String, 
  required: true, 
  unique: true, 
  trim: true,
  lowercase: true
}

// After schema definition
VendorSchema.index({ slug: 1 }, { unique: true });

// Pre-save hook for slug generation and uniqueness
VendorSchema.pre('save', async function(next) {
  if (this.isModified('name') && !this.isModified('slug')) {
    // Generate slug from name if not explicitly set
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Check for duplicate slugs
  const slugRegEx = new RegExp(`^${this.slug}(-[0-9]*)?$`, 'i');
  const vendorsWithSlug = await this.constructor.find({ slug: slugRegEx });
  
  // If we have a duplicate and it's not the current document
  if (vendorsWithSlug.length > 0) {
    const currentVendorId = this._id.toString();
    const duplicates = vendorsWithSlug.filter(vendor => 
      vendor._id.toString() !== currentVendorId
    );
    
    if (duplicates.length > 0) {
      // Add a suffix to make the slug unique
      this.slug = `${this.slug}-${duplicates.length}`;
    }
  }
  
  next();
});
```

### 4. News Article Model

The News model already has a unique index on `seoMetadata.slug`, but should also include a pre-save hook:

```javascript
// Pre-save hook for slug generation and uniqueness
NewsArticleSchema.pre('save', async function(next) {
  if (this.isModified('title') && !this.isModified('seoMetadata.slug')) {
    // Generate slug from title if not explicitly set
    this.seoMetadata.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Check for duplicate slugs
  const slugRegEx = new RegExp(`^${this.seoMetadata.slug}(-[0-9]*)?$`, 'i');
  const articlesWithSlug = await this.constructor.find({ 'seoMetadata.slug': slugRegEx });
  
  // If we have a duplicate and it's not the current document
  if (articlesWithSlug.length > 0) {
    const currentArticleId = this._id.toString();
    const duplicates = articlesWithSlug.filter(article => 
      article._id.toString() !== currentArticleId
    );
    
    if (duplicates.length > 0) {
      // Add a suffix to make the slug unique
      this.seoMetadata.slug = `${this.seoMetadata.slug}-${duplicates.length}`;
    }
  }
  
  next();
});
```

## Verification Script

Create a utility script to verify and fix any duplicate slugs in the database:

```javascript
// utils/verifySlugIndexes.js

async function checkForDuplicateSlugs() {
  console.log('Checking for duplicate slugs...');
  
  // Check Product slugs
  const productSlugs = await Product.aggregate([
    { $group: { _id: '$slug', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
  ]);
  
  if (productSlugs.length > 0) {
    console.log(`Found ${productSlugs.length} duplicate product slugs`);
    // Fix duplicates by adding numeric suffixes
    for (const dup of productSlugs) {
      const products = await Product.find({ slug: dup._id });
      // Keep the first one as is, update others
      for (let i = 1; i < products.length; i++) {
        const product = products[i];
        product.slug = `${dup._id}-${i}`;
        await product.save();
        console.log(`Updated product slug: ${product.name} -> ${product.slug}`);
      }
    }
  }
  
  // Similar checks for Category, Vendor, and News models
  // ...
}
```

## Implementation Steps

1. Update each model schema to include unique slug indexes
2. Add pre-save hooks to handle slug generation and uniqueness
3. Create a verification script to check for and fix duplicate slugs
4. Run the verification script after deployment to ensure data integrity
5. Add a scheduled task to periodically check for duplicate slugs

## API Endpoints

Ensure all API endpoints that fetch by slug use proper indexes:

```javascript
// Example for products
router.get('/products/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

## Frontend Considerations

When creating or updating items with slugs:

1. Generate slugs on the server side, not client side
2. Validate slugs for uniqueness before saving
3. Handle slug conflicts gracefully with user feedback

## Testing

Test slug generation and uniqueness with:

1. Unit tests for slug generation logic
2. Integration tests for duplicate slug handling
3. API tests for slug-based lookups

## Monitoring

Monitor slug-related issues:

1. Log warnings for duplicate slug attempts
2. Track performance of slug-based queries
3. Alert on high rates of slug conflicts