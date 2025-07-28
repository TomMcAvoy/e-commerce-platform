import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { parse as csvParse } from 'csv-parse/sync';
import { generateSlug } from '@shoppingcart/shared/src/utils/slugUtils';
import logger from '../utils/logger';

// Import models
import Category from '../features/categories/models/Category';
import Product from '../features/products/models/Product';
import User from '../features/users/models/User';
import Vendor from '../features/vendors/models/Vendor';
import Tenant from '../features/tenants/models/Tenant';
import NewsCategory from '../features/news/models/NewsCategory';
import NewsArticle from '../features/news/models/NewsArticle';

// Import types
import { ObjectId } from '@shoppingcart/shared/src/types/models/common';

/**
 * Comprehensive Database Seeder
 * 
 * This utility populates the database with a comprehensive set of data:
 * - Categories (hierarchical structure with multiple levels)
 * - Products (from various sources including dropshipping feeds)
 * - Vendors (with realistic business information)
 * - Users (admin, vendors, customers)
 * - News categories and articles
 */
export class ComprehensiveSeeder {
  private tenantId: ObjectId | null = null;
  private adminUserId: ObjectId | null = null;
  private vendorIds: ObjectId[] = [];
  private categoryIds: Map<string, ObjectId> = new Map();
  private newsCategoryIds: ObjectId[] = [];
  private dataDir: string;

  constructor(dataDir?: string) {
    this.dataDir = dataDir || path.join(__dirname, 'data');
  }

  /**
   * Run the complete seeding process
   */
  public async seed(): Promise<void> {
    try {
      logger.info('Starting comprehensive database seeding...');
      
      // Create tenant
      await this.createTenant();
      
      // Create users
      await this.createUsers();
      
      // Create vendors
      await this.createVendors();
      
      // Create categories
      await this.createCategories();
      
      // Create news categories
      await this.createNewsCategories();
      
      // Create products from various sources
      await this.createProducts();
      
      // Create news articles
      await this.createNewsArticles();
      
      logger.info('Database seeding completed successfully!');
    } catch (error) {
      logger.error('Error seeding database:', error);
      throw error;
    }
  }

  /**
   * Create a tenant for multi-tenant support
   */
  private async createTenant(): Promise<void> {
    logger.info('Creating tenant...');
    
    // Delete existing tenant
    await Tenant.deleteMany({});
    
    // Create new tenant
    const tenant = await Tenant.create({
      name: 'Default Marketplace',
      domain: 'marketplace.example.com',
      settings: {
        theme: {
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981',
          accentColor: '#F59E0B',
          backgroundColor: '#F9FAFB',
          textColor: '#1F2937'
        },
        features: {
          multiVendor: true,
          blog: true,
          reviews: true,
          wishlist: true,
          compareProducts: true
        },
        payment: {
          providers: ['stripe', 'paypal'],
          currencies: ['USD', 'EUR', 'GBP']
        },
        shipping: {
          providers: ['fedex', 'ups', 'usps']
        }
      },
      status: 'active',
      plan: 'professional'
    });
    
    this.tenantId = tenant._id;
    logger.info(`Tenant created with ID: ${this.tenantId}`);
  }

  /**
   * Create users (admin, vendors, customers)
   */
  private async createUsers(): Promise<void> {
    logger.info('Creating users...');
    
    // Delete existing users
    await User.deleteMany({});
    
    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'Password123!',
      role: 'admin',
      tenantId: this.tenantId,
      isVerified: true
    });
    
    this.adminUserId = admin._id;
    logger.info(`Admin user created with ID: ${this.adminUserId}`);
    
    // Create vendor users
    const vendorData = this.loadJsonFile('vendors.json');
    
    for (const vendor of vendorData) {
      const vendorUser = await User.create({
        firstName: vendor.firstName,
        lastName: vendor.lastName,
        email: vendor.email,
        password: 'Password123!',
        role: 'vendor',
        tenantId: this.tenantId,
        isVerified: true
      });
      
      this.vendorIds.push(vendorUser._id);
    }
    
    logger.info(`Created ${this.vendorIds.length} vendor users`);
    
    // Create customer users
    const customerData = this.loadJsonFile('customers.json');
    
    for (const customer of customerData) {
      await User.create({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        password: 'Password123!',
        role: 'customer',
        tenantId: this.tenantId,
        isVerified: Math.random() > 0.2 // 80% verified
      });
    }
    
    logger.info(`Created ${customerData.length} customer users`);
  }

  /**
   * Create vendors with business information
   */
  private async createVendors(): Promise<void> {
    logger.info('Creating vendors...');
    
    // Delete existing vendors
    await Vendor.deleteMany({});
    
    // Create vendors
    const vendorData = this.loadJsonFile('vendors.json');
    
    for (let i = 0; i < vendorData.length; i++) {
      const vendor = vendorData[i];
      const userId = this.vendorIds[i];
      
      await Vendor.create({
        userId,
        tenantId: this.tenantId,
        businessName: vendor.businessName,
        businessEmail: vendor.email,
        businessPhone: vendor.phone,
        businessAddress: {
          firstName: vendor.firstName,
          lastName: vendor.lastName,
          company: vendor.businessName,
          address1: vendor.address.address1,
          address2: vendor.address.address2,
          city: vendor.address.city,
          state: vendor.address.state,
          postalCode: vendor.address.postalCode,
          country: vendor.address.country,
          phone: vendor.phone,
          isDefault: true
        },
        taxId: vendor.taxId,
        isVerified: Math.random() > 0.3, // 70% verified
        rating: (Math.random() * 3 + 2).toFixed(1), // Rating between 2.0 and 5.0
        totalSales: Math.floor(Math.random() * 1000),
        commission: Math.floor(Math.random() * 15) + 5 // Commission between 5% and 20%
      });
    }
    
    logger.info(`Created ${vendorData.length} vendors`);
  }

  /**
   * Create hierarchical category structure
   */
  private async createCategories(): Promise<void> {
    logger.info('Creating categories...');
    
    // Delete existing categories
    await Category.deleteMany({});
    
    // Create categories
    const categoryData = this.loadJsonFile('categories.json');
    
    // First pass: create all categories
    for (const category of categoryData) {
      const newCategory = await Category.create({
        name: category.name,
        description: category.description,
        slug: generateSlug(category.name),
        tenantId: this.tenantId,
        image: category.image || null,
        icon: category.icon || null,
        isActive: true,
        parent: null // Will update in second pass
      });
      
      this.categoryIds.set(category.name, newCategory._id);
    }
    
    // Second pass: update parent references
    for (const category of categoryData) {
      if (category.parent) {
        const parentId = this.categoryIds.get(category.parent);
        
        if (parentId) {
          await Category.findByIdAndUpdate(
            this.categoryIds.get(category.name),
            { parent: parentId }
          );
        }
      }
    }
    
    logger.info(`Created ${categoryData.length} categories`);
  }

  /**
   * Create news categories
   */
  private async createNewsCategories(): Promise<void> {
    logger.info('Creating news categories...');
    
    // Delete existing news categories
    await NewsCategory.deleteMany({});
    
    // Create news categories
    const newsCategoryData = this.loadJsonFile('newsCategories.json');
    
    for (const category of newsCategoryData) {
      const newsCategory = await NewsCategory.create({
        name: category.name,
        description: category.description,
        slug: generateSlug(category.name),
        tenantId: this.tenantId,
        image: category.image || null,
        isActive: true
      });
      
      this.newsCategoryIds.push(newsCategory._id);
    }
    
    logger.info(`Created ${newsCategoryData.length} news categories`);
  }

  /**
   * Create products from various sources
   */
  private async createProducts(): Promise<void> {
    logger.info('Creating products...');
    
    // Delete existing products
    await Product.deleteMany({});
    
    // Create products from local JSON
    await this.createLocalProducts();
    
    // Create products from dropshipping feeds
    await this.createDropshippingProducts();
    
    logger.info('Products created successfully');
  }

  /**
   * Create products from local JSON data
   */
  private async createLocalProducts(): Promise<void> {
    const productData = this.loadJsonFile('products.json');
    
    for (const product of productData) {
      // Get random vendor
      const vendorIndex = Math.floor(Math.random() * this.vendorIds.length);
      const vendorId = this.vendorIds[vendorIndex];
      
      // Get category
      const categoryId = this.categoryIds.get(product.category);
      
      if (!categoryId) {
        logger.warn(`Category not found for product: ${product.name}`);
        continue;
      }
      
      // Create product
      await Product.create({
        name: product.name,
        description: product.description,
        slug: generateSlug(product.name),
        price: product.price,
        compareAtPrice: product.compareAtPrice || null,
        sku: product.sku || `SKU-${Math.floor(Math.random() * 100000)}`,
        barcode: product.barcode || null,
        vendor: vendorId,
        category: categoryId,
        tenantId: this.tenantId,
        images: product.images || [],
        variants: product.variants || [],
        options: product.options || [],
        tags: product.tags || [],
        isActive: true,
        isFeatured: Math.random() > 0.8, // 20% featured
        inventory: {
          quantity: Math.floor(Math.random() * 100),
          allowBackorder: Math.random() > 0.7,
          trackInventory: true
        },
        seo: {
          title: product.name,
          description: product.description.substring(0, 160),
          keywords: product.tags?.join(', ') || ''
        },
        shipping: {
          weight: Math.random() * 10,
          dimensions: {
            length: Math.random() * 30,
            width: Math.random() * 20,
            height: Math.random() * 10
          },
          freeShipping: Math.random() > 0.7
        }
      });
    }
    
    logger.info(`Created ${productData.length} products from local data`);
  }

  /**
   * Create products from dropshipping feeds
   */
  private async createDropshippingProducts(): Promise<void> {
    try {
      // Fetch products from dropshipping feeds
      const dropshippingProducts = await this.fetchDropshippingProducts();
      
      if (!dropshippingProducts || dropshippingProducts.length === 0) {
        logger.warn('No dropshipping products fetched');
        return;
      }
      
      // Process and save products
      for (const product of dropshippingProducts) {
        // Get random vendor
        const vendorIndex = Math.floor(Math.random() * this.vendorIds.length);
        const vendorId = this.vendorIds[vendorIndex];
        
        // Get random category
        const categoryKeys = Array.from(this.categoryIds.keys());
        const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        const categoryId = this.categoryIds.get(randomCategoryKey);
        
        if (!categoryId) {
          logger.warn(`Category not found for dropshipping product: ${product.name}`);
          continue;
        }
        
        // Create product
        await Product.create({
          name: product.name,
          description: product.description,
          slug: generateSlug(product.name),
          price: product.price,
          compareAtPrice: product.compareAtPrice || null,
          sku: product.sku || `DS-${Math.floor(Math.random() * 100000)}`,
          barcode: product.barcode || null,
          vendor: vendorId,
          category: categoryId,
          tenantId: this.tenantId,
          images: product.images || [],
          variants: product.variants || [],
          options: product.options || [],
          tags: product.tags || [],
          isActive: true,
          isFeatured: Math.random() > 0.9, // 10% featured
          inventory: {
            quantity: Math.floor(Math.random() * 100),
            allowBackorder: true,
            trackInventory: false
          },
          seo: {
            title: product.name,
            description: product.description?.substring(0, 160) || '',
            keywords: product.tags?.join(', ') || ''
          },
          shipping: {
            weight: product.weight || Math.random() * 5,
            dimensions: product.dimensions || {
              length: Math.random() * 20,
              width: Math.random() * 15,
              height: Math.random() * 8
            },
            freeShipping: Math.random() > 0.6
          },
          metadata: {
            source: 'dropshipping',
            sourceId: product.id || null,
            sourceUrl: product.sourceUrl || null
          }
        });
      }
      
      logger.info(`Created ${dropshippingProducts.length} products from dropshipping feeds`);
    } catch (error) {
      logger.error('Error creating dropshipping products:', error);
    }
  }

  /**
   * Fetch products from dropshipping feeds
   */
  private async fetchDropshippingProducts(): Promise<any[]> {
    try {
      // Try to load from cached file first
      const cachedFilePath = path.join(this.dataDir, 'dropshipping-products.json');
      
      if (fs.existsSync(cachedFilePath)) {
        logger.info('Loading dropshipping products from cache...');
        const cachedData = JSON.parse(fs.readFileSync(cachedFilePath, 'utf8'));
        return cachedData;
      }
      
      // If no cache, fetch from APIs
      logger.info('Fetching dropshipping products from APIs...');
      
      // Fetch from multiple sources and combine
      const products = await this.fetchFromMultipleSources();
      
      // Cache the results
      fs.writeFileSync(cachedFilePath, JSON.stringify(products, null, 2));
      
      return products;
    } catch (error) {
      logger.error('Error fetching dropshipping products:', error);
      return [];
    }
  }

  /**
   * Fetch products from multiple dropshipping sources
   */
  private async fetchFromMultipleSources(): Promise<any[]> {
    const allProducts: any[] = [];
    
    try {
      // Fetch from mock API (for demo purposes)
      const mockProducts = await this.fetchMockProducts();
      allProducts.push(...mockProducts);
      
      // Fetch from CSV file (simulating a dropshipping feed)
      const csvProducts = await this.fetchProductsFromCsv();
      allProducts.push(...csvProducts);
      
      // Limit to 500 products to avoid overwhelming the database
      return allProducts.slice(0, 500);
    } catch (error) {
      logger.error('Error fetching from multiple sources:', error);
      return allProducts;
    }
  }

  /**
   * Fetch mock products (for demo purposes)
   */
  private async fetchMockProducts(): Promise<any[]> {
    try {
      // In a real implementation, this would call actual dropshipping APIs
      // For demo purposes, we'll use a public API
      const response = await axios.get('https://fakestoreapi.com/products');
      
      // Transform to our product format
      return response.data.map((item: any) => ({
        name: item.title,
        description: item.description,
        price: item.price,
        compareAtPrice: item.price * 1.2,
        images: [item.image],
        tags: [item.category],
        id: item.id.toString(),
        sourceUrl: `https://fakestoreapi.com/products/${item.id}`,
        weight: Math.random() * 2 + 0.1,
        dimensions: {
          length: Math.random() * 10 + 5,
          width: Math.random() * 8 + 3,
          height: Math.random() * 4 + 1
        }
      }));
    } catch (error) {
      logger.error('Error fetching mock products:', error);
      return [];
    }
  }

  /**
   * Fetch products from CSV file (simulating a dropshipping feed)
   */
  private async fetchProductsFromCsv(): Promise<any[]> {
    try {
      const csvFilePath = path.join(this.dataDir, 'dropshipping-feed.csv');
      
      // If CSV doesn't exist, return empty array
      if (!fs.existsSync(csvFilePath)) {
        logger.warn('Dropshipping CSV feed not found');
        return [];
      }
      
      // Read and parse CSV
      const csvContent = fs.readFileSync(csvFilePath, 'utf8');
      const records = csvParse(csvContent, {
        columns: true,
        skip_empty_lines: true
      });
      
      // Transform to our product format
      return records.map((record: any) => ({
        name: record.title || record.name,
        description: record.description || '',
        price: parseFloat(record.price) || 9.99,
        compareAtPrice: record.compare_at_price ? parseFloat(record.compare_at_price) : null,
        sku: record.sku || '',
        barcode: record.barcode || record.upc || '',
        images: record.image_url ? [record.image_url] : [],
        tags: record.tags ? record.tags.split(',').map((tag: string) => tag.trim()) : [],
        id: record.id || record.product_id || '',
        sourceUrl: record.product_url || '',
        weight: parseFloat(record.weight) || null,
        variants: this.parseVariants(record)
      }));
    } catch (error) {
      logger.error('Error fetching products from CSV:', error);
      return [];
    }
  }

  /**
   * Parse variants from CSV record
   */
  private parseVariants(record: any): any[] {
    // This is a simplified implementation
    // In a real scenario, you would parse variant data from the CSV
    if (!record.variants) {
      return [];
    }
    
    try {
      // If variants is a JSON string, parse it
      if (typeof record.variants === 'string') {
        return JSON.parse(record.variants);
      }
      
      // If variants is already an object, return as array
      if (typeof record.variants === 'object') {
        return [record.variants];
      }
    } catch (error) {
      // If parsing fails, return empty array
      return [];
    }
    
    return [];
  }

  /**
   * Create news articles
   */
  private async createNewsArticles(): Promise<void> {
    logger.info('Creating news articles...');
    
    // Delete existing news articles
    await NewsArticle.deleteMany({});
    
    // Create news articles
    const newsArticleData = this.loadJsonFile('newsArticles.json');
    
    for (const article of newsArticleData) {
      // Get random category
      const categoryIndex = Math.floor(Math.random() * this.newsCategoryIds.length);
      const categoryId = this.newsCategoryIds[categoryIndex];
      
      await NewsArticle.create({
        title: article.title,
        content: article.content,
        summary: article.summary,
        slug: generateSlug(article.title),
        category: categoryId,
        tenantId: this.tenantId,
        author: this.adminUserId,
        image: article.image || null,
        isPublished: true,
        publishedAt: new Date(article.publishedAt || new Date()),
        tags: article.tags || []
      });
    }
    
    logger.info(`Created ${newsArticleData.length} news articles`);
  }

  /**
   * Load JSON file from data directory
   */
  private loadJsonFile(filename: string): any[] {
    try {
      const filePath = path.join(this.dataDir, filename);
      
      if (!fs.existsSync(filePath)) {
        logger.warn(`File not found: ${filePath}`);
        return [];
      }
      
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return Array.isArray(data) ? data : [];
    } catch (error) {
      logger.error(`Error loading JSON file ${filename}:`, error);
      return [];
    }
  }
}

/**
 * Run seeder directly if called from command line
 */
if (require.main === module) {
  // Connect to database (using 127.0.0.1 instead of localhost to avoid IPv6 issues)
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shoppingcart')
    .then(async () => {
      const seeder = new ComprehensiveSeeder();
      await seeder.seed();
      process.exit(0);
    })
    .catch(error => {
      console.error('Error connecting to database:', error);
      process.exit(1);
    });
}

export default ComprehensiveSeeder;