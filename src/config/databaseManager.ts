import mongoose from 'mongoose';
import colors from 'colors';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Category from '../models/Category';
import Product from '../models/Product';
import User from '../models/User';
import NewsArticle from '../models/NewsArticle';
import NewsCategory from '../models/NewsCategory';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private memoryServer: MongoMemoryServer | null = null;
  private persistentConnection: mongoose.Connection | null = null;
  private memoryConnection: mongoose.Connection | null = null;

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Step 1: Connect to persistent MongoDB and seed if needed
   */
  async connectPersistent(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shoppingcart';
      
      console.log(colors.blue('🔗 Connecting to persistent MongoDB...'));
      await mongoose.connect(mongoUri);
      this.persistentConnection = mongoose.connection;
      
      console.log(colors.green(`✅ Persistent MongoDB Connected: ${this.persistentConnection.host}`));
      
      // Check if database needs seeding
      await this.seedIfEmpty();
      
    } catch (error: any) {
      console.error(colors.red(`❌ Persistent DB Connection Error: ${error.message}`));
      throw error;
    }
  }

  /**
   * Step 2: Create in-memory database and load all data from persistent DB
   */
  async loadIntoMemory(): Promise<void> {
    try {
      console.log(colors.blue('🧠 Setting up in-memory database...'));
      
      // Create in-memory MongoDB instance with dynamic port
      this.memoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'shoppingcart_memory',
        },
      });

      const memoryUri = this.memoryServer.getUri();
      
      // Create new connection for memory database
      this.memoryConnection = mongoose.createConnection(memoryUri);
      
      console.log(colors.green('✅ In-Memory MongoDB Created'));
      
      // Load all data from persistent DB to memory DB
      await this.transferDataToMemory();
      
      // Switch mongoose to use memory connection
      await this.switchToMemoryConnection();
      
      console.log(colors.green.bold('🚀 System now running on in-memory database!'));
      
    } catch (error: any) {
      console.error(colors.red(`❌ Memory DB Setup Error: ${error.message}`));
      throw error;
    }
  }

  /**
   * Seed persistent database if it's empty
   */
  private async seedIfEmpty(): Promise<void> {
    const categoryCount = await Category.countDocuments({});
    const productCount = await Product.countDocuments({});
    
    if (categoryCount === 0 || productCount === 0) {
      console.log(colors.yellow('📦 Database appears empty, seeding...'));
      await this.seedDatabase();
    } else {
      console.log(colors.green(`📊 Database has ${categoryCount} categories and ${productCount} products`));
    }
  }

  /**
   * Seed the persistent database with initial data
   */
  private async seedDatabase(): Promise<void> {
    const DEFAULT_TENANT_ID = new mongoose.Types.ObjectId('6884bf4702e02fe6eb401303');
    
    try {
      // Create default vendor
      const defaultVendor = await User.findOneAndUpdate(
        { email: 'vendor@example.com' },
        {
          name: 'Default Vendor',
          email: 'vendor@example.com',
          role: 'vendor',
          tenantId: DEFAULT_TENANT_ID,
          isActive: true
        },
        { upsert: true, new: true }
      );

      // Seed categories
      const categories = [
        {
          name: 'Electronics',
          slug: 'electronics',
          description: 'Electronic devices and gadgets',
          icon: 'cpu-chip',
          color: '#3B82F6',
          isFeatured: true,
          showOnHomepage: true,
          level: 0,
          path: 'electronics',
          breadcrumbs: [],
          isActive: true,
          showInMenu: true,
          sortOrder: 1,
          menuOrder: 1,
          productCount: 0,
          commissionRate: 5,
          keywords: ['electronics', 'gadgets', 'tech'],
          tenantId: DEFAULT_TENANT_ID
        },
        {
          name: 'Clothing',
          slug: 'clothing',
          description: 'Fashion and apparel for all',
          icon: 'sparkles',
          color: '#EC4899',
          isFeatured: true,
          showOnHomepage: true,
          level: 0,
          path: 'clothing',
          breadcrumbs: [],
          isActive: true,
          showInMenu: true,
          sortOrder: 2,
          menuOrder: 2,
          productCount: 0,
          commissionRate: 5,
          keywords: ['clothing', 'fashion', 'apparel'],
          tenantId: DEFAULT_TENANT_ID
        },
        {
          name: 'Home & Garden',
          slug: 'home-garden',
          description: 'Home improvement and garden supplies',
          icon: 'home',
          color: '#10B981',
          isFeatured: true,
          showOnHomepage: true,
          level: 0,
          path: 'home-garden',
          breadcrumbs: [],
          isActive: true,
          showInMenu: true,
          sortOrder: 3,
          menuOrder: 3,
          productCount: 0,
          commissionRate: 5,
          keywords: ['home', 'garden', 'furniture'],
          tenantId: DEFAULT_TENANT_ID
        }
      ];

      for (const catData of categories) {
        await Category.findOneAndUpdate(
          { slug: catData.slug, tenantId: DEFAULT_TENANT_ID },
          catData,
          { upsert: true, new: true }
        );
      }

      // Seed products
      const products = [
        {
          name: 'iPhone 15 Pro',
          slug: 'iphone-15-pro',
          category: 'electronics',
          brand: 'Apple',
          price: 999.99,
          originalPrice: 1099.99,
          description: 'Latest iPhone with advanced camera system and A17 Pro chip',
          sku: 'IPHONE15PRO001',
          asin: 'B0CHX1W5Y9',
          images: ['/placeholder.svg'],
          inventory: { quantity: 50, lowStock: 10, inStock: true },
          tenantId: DEFAULT_TENANT_ID,
          vendorId: defaultVendor._id,
          isActive: true
        },
        {
          name: 'MacBook Air M3',
          slug: 'macbook-air-m3',
          category: 'electronics',
          brand: 'Apple',
          price: 1299.99,
          description: 'Ultra-thin laptop with M3 chip and all-day battery life',
          sku: 'MACBOOKAIRM3001',
          asin: 'B0CX23V2ZK',
          images: ['/placeholder.svg'],
          inventory: { quantity: 25, lowStock: 5, inStock: true },
          tenantId: DEFAULT_TENANT_ID,
          vendorId: defaultVendor._id,
          isActive: true
        },
        {
          name: 'Nike Air Max 270',
          slug: 'nike-air-max-270',
          category: 'clothing',
          brand: 'Nike',
          price: 129.99,
          description: 'Comfortable running shoes with Max Air cushioning',
          sku: 'NIKEAIRMAX270001',
          asin: 'B07KDQX5TR',
          images: ['/placeholder.svg'],
          inventory: { quantity: 100, lowStock: 20, inStock: true },
          sizes: ['7', '8', '9', '10', '11', '12'],
          colors: ['Black', 'White', 'Blue'],
          tenantId: DEFAULT_TENANT_ID,
          vendorId: defaultVendor._id,
          isActive: true
        }
      ];

      for (const prodData of products) {
        await Product.findOneAndUpdate(
          { sku: prodData.sku, tenantId: DEFAULT_TENANT_ID },
          prodData,
          { upsert: true, new: true }
        );
      }

      // Seed news categories
      const newsCategories = [
        { name: 'Technology', slug: 'technology', tenantId: DEFAULT_TENANT_ID },
        { name: 'Entertainment', slug: 'entertainment', tenantId: DEFAULT_TENANT_ID },
        { name: 'Business', slug: 'business', tenantId: DEFAULT_TENANT_ID },
        { name: 'Sports', slug: 'sports', tenantId: DEFAULT_TENANT_ID }
      ];

      for (const newsCat of newsCategories) {
        await NewsCategory.findOneAndUpdate(
          { slug: newsCat.slug, tenantId: DEFAULT_TENANT_ID },
          newsCat,
          { upsert: true, new: true }
        );
      }

      // Seed news articles with country/category combinations
      const newsArticles = [
        {
          title: 'Scottish Entertainment Industry Sees Major Growth',
          description: 'Scotland\'s entertainment sector experiences unprecedented expansion',
          content: 'The Scottish entertainment industry has seen remarkable growth this year...',
          country: 'scotland',
          category: 'entertainment',
          author: 'Scottish News Network',
          sourceName: 'Scotland Today',
          sourceId: 'scotland-today',
          publishedAt: new Date(),
          tenantId: DEFAULT_TENANT_ID
        },
        {
          title: 'UK Technology Sector Leads Innovation',
          description: 'British tech companies at forefront of global innovation',
          content: 'The United Kingdom continues to be a leader in technological innovation...',
          country: 'uk',
          category: 'technology',
          author: 'Tech UK Reporter',
          sourceName: 'UK Tech News',
          sourceId: 'uk-tech-news',
          publishedAt: new Date(),
          tenantId: DEFAULT_TENANT_ID
        },
        {
          title: 'Canadian Business Markets Show Strong Performance',
          description: 'Canadian markets demonstrate resilience and growth',
          content: 'Canadian business markets have shown exceptional performance...',
          country: 'canada',
          category: 'business',
          author: 'Canadian Business Reporter',
          sourceName: 'Canada Business Today',
          sourceId: 'canada-business',
          publishedAt: new Date(),
          tenantId: DEFAULT_TENANT_ID
        },
        {
          title: 'USA Sports Championships Draw Global Attention',
          description: 'American sports events capture worldwide audience',
          content: 'Major sporting events in the United States continue to attract...',
          country: 'usa',
          category: 'sports',
          author: 'Sports USA',
          sourceName: 'American Sports Network',
          sourceId: 'usa-sports',
          publishedAt: new Date(),
          tenantId: DEFAULT_TENANT_ID
        }
      ];

      // Import News model for seeding
      const News = require('../models/News').default;
      
      for (const article of newsArticles) {
        await News.findOneAndUpdate(
          { title: article.title, tenantId: DEFAULT_TENANT_ID },
          article,
          { upsert: true, new: true }
        );
      }

      console.log(colors.green('✅ Database seeded successfully'));
      
    } catch (error: any) {
      console.error(colors.red(`❌ Seeding Error: ${error.message}`));
      throw error;
    }
  }

  /**
   * Transfer all data from persistent DB to memory DB
   */
  private async transferDataToMemory(): Promise<void> {
    if (!this.memoryConnection) {
      throw new Error('Memory connection not established');
    }

    console.log(colors.blue('📋 Transferring data to memory database...'));

    // Get models for memory connection
    const MemoryCategory = this.memoryConnection.model('Category', Category.schema);
    const MemoryProduct = this.memoryConnection.model('Product', Product.schema);
    const MemoryUser = this.memoryConnection.model('User', User.schema);
    const MemoryNewsArticle = this.memoryConnection.model('NewsArticle', NewsArticle.schema);
    const MemoryNewsCategory = this.memoryConnection.model('NewsCategory', NewsCategory.schema);

    // Transfer categories
    const categories = await Category.find({}).lean();
    if (categories.length > 0) {
      await MemoryCategory.insertMany(categories);
      console.log(colors.green(`✅ Transferred ${categories.length} categories`));
    }

    // Transfer products with validation fix
    const products = await Product.find({}).lean();
    if (products.length > 0) {
      // Filter out products with missing required fields
      const validProducts = products.filter(product => 
        product.asin && product.vendorId && product.brand
      );
      
      if (validProducts.length > 0) {
        await MemoryProduct.insertMany(validProducts);
        console.log(colors.green(`✅ Transferred ${validProducts.length} valid products`));
      }
      
      if (validProducts.length < products.length) {
        console.log(colors.yellow(`⚠️  Skipped ${products.length - validProducts.length} products with missing required fields`));
      }
    }

    // Transfer users with validation fix
    const users = await User.find({}).lean();
    if (users.length > 0) {
      // Filter out users with missing required fields
      const validUsers = users.filter(user => 
        user.firstName && user.lastName && user.password && 
        (!user.preferences || typeof user.preferences.notifications !== 'boolean')
      );
      
      if (validUsers.length > 0) {
        await MemoryUser.insertMany(validUsers);
        console.log(colors.green(`✅ Transferred ${validUsers.length} valid users`));
      }
      
      if (validUsers.length < users.length) {
        console.log(colors.yellow(`⚠️  Skipped ${users.length - validUsers.length} users with missing required fields`));
      }
    }

    // Transfer news categories
    const newsCategories = await NewsCategory.find({}).lean();
    if (newsCategories.length > 0) {
      await MemoryNewsCategory.insertMany(newsCategories);
      console.log(colors.green(`✅ Transferred ${newsCategories.length} news categories`));
    }

    // Transfer news articles
    const newsArticles = await NewsArticle.find({}).lean();
    if (newsArticles.length > 0) {
      await MemoryNewsArticle.insertMany(newsArticles);
      console.log(colors.green(`✅ Transferred ${newsArticles.length} news articles`));
    }
  }

  /**
   * Switch mongoose default connection to memory database
   */
  private async switchToMemoryConnection(): Promise<void> {
    if (!this.memoryConnection) {
      throw new Error('Memory connection not established');
    }

    // Close the default connection
    await mongoose.connection.close();
    
    // Connect mongoose to memory database
    const memoryUri = this.memoryServer!.getUri();
    await mongoose.connect(memoryUri);
    
    console.log(colors.green('🔄 Switched to memory database connection'));
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<any> {
    const stats = {
      categories: await Category.countDocuments({}),
      products: await Product.countDocuments({}),
      users: await User.countDocuments({}),
      newsCategories: await NewsCategory.countDocuments({}),
      newsArticles: await NewsArticle.countDocuments({}),
      featuredCategories: await Category.countDocuments({ isFeatured: true }),
      activeProducts: await Product.countDocuments({ isActive: true })
    };
    
    return stats;
  }

  /**
   * Cleanup connections
   */
  async cleanup(): Promise<void> {
    try {
      if (this.persistentConnection) {
        await this.persistentConnection.close();
      }
      if (this.memoryConnection) {
        await this.memoryConnection.close();
      }
      if (this.memoryServer) {
        await this.memoryServer.stop();
      }
      console.log(colors.yellow('🔌 Database connections closed'));
    } catch (error: any) {
      console.error(colors.red(`❌ Cleanup Error: ${error.message}`));
    }
  }
}

export default DatabaseManager.getInstance();