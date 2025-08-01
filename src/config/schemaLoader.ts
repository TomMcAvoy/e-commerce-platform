import mongoose from 'mongoose';
import Category from '../models/Category';
import Product from '../models/Product';
import User from '../models/User';
import colors from 'colors';
import slugify from 'slugify';

const DEFAULT_TENANT_ID = new mongoose.Types.ObjectId('6884bf4702e02fe6eb401303');

// Consistent category structure with proper slugs
const CATEGORY_STRUCTURE = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    icon: 'cpu-chip',
    color: '#3B82F6',
    isFeatured: true,
    showOnHomepage: true,
    subcategories: [
      { name: 'Smartphones', slug: 'smartphones' },
      { name: 'Laptops', slug: 'laptops' },
      { name: 'Tablets', slug: 'tablets' },
      { name: 'Headphones', slug: 'headphones' }
    ]
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel for all',
    icon: 'sparkles',
    color: '#EC4899',
    isFeatured: true,
    showOnHomepage: true,
    subcategories: [
      { name: 'Men\'s Clothing', slug: 'mens-clothing' },
      { name: 'Women\'s Clothing', slug: 'womens-clothing' },
      { name: 'Shoes', slug: 'shoes' },
      { name: 'Accessories', slug: 'accessories' }
    ]
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home improvement and garden supplies',
    icon: 'home',
    color: '#10B981',
    isFeatured: true,
    showOnHomepage: true,
    subcategories: [
      { name: 'Furniture', slug: 'furniture' },
      { name: 'Kitchen', slug: 'kitchen' },
      { name: 'Garden Tools', slug: 'garden-tools' },
      { name: 'Decor', slug: 'decor' }
    ]
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment and outdoor gear',
    icon: 'trophy',
    color: '#F59E0B',
    isFeatured: false,
    showOnHomepage: true,
    subcategories: [
      { name: 'Fitness Equipment', slug: 'fitness-equipment' },
      { name: 'Outdoor Gear', slug: 'outdoor-gear' },
      { name: 'Team Sports', slug: 'team-sports' }
    ]
  },
  {
    name: 'Beauty & Health',
    slug: 'beauty-health',
    description: 'Beauty products and health supplements',
    icon: 'heart',
    color: '#EF4444',
    isFeatured: false,
    showOnHomepage: false,
    subcategories: [
      { name: 'Skincare', slug: 'skincare' },
      { name: 'Makeup', slug: 'makeup' },
      { name: 'Health Supplements', slug: 'health-supplements' }
    ]
  },
  {
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Books, movies, and digital media',
    icon: 'book-open',
    color: '#8B5CF6',
    isFeatured: false,
    showOnHomepage: false,
    subcategories: [
      { name: 'Books', slug: 'books' },
      { name: 'Movies', slug: 'movies' },
      { name: 'Music', slug: 'music' }
    ]
  }
];

// Sample products with consistent category slugs
const SAMPLE_PRODUCTS = [
  {
    name: 'iPhone 15 Pro',
    category: 'electronics',
    subcategory: 'smartphones',
    brand: 'Apple',
    price: 999.99,
    originalPrice: 1099.99,
    description: 'Latest iPhone with advanced camera system and A17 Pro chip',
    sku: 'IPHONE15PRO',
    asin: 'B0CHX1W5Y9',
    images: ['/placeholder.svg'],
    inventory: { quantity: 50, lowStock: 10, inStock: true }
  },
  {
    name: 'MacBook Air M3',
    category: 'electronics',
    subcategory: 'laptops',
    brand: 'Apple',
    price: 1299.99,
    description: 'Ultra-thin laptop with M3 chip and all-day battery life',
    sku: 'MACBOOKAIRM3',
    asin: 'B0CX23V2ZK',
    images: ['/placeholder.svg'],
    inventory: { quantity: 25, lowStock: 5, inStock: true }
  },
  {
    name: 'Sony WH-1000XM5',
    category: 'electronics',
    subcategory: 'headphones',
    brand: 'Sony',
    price: 349.99,
    originalPrice: 399.99,
    description: 'Premium noise-canceling wireless headphones',
    sku: 'SONYWH1000XM5',
    asin: 'B09XS7JWHH',
    images: ['/placeholder.svg'],
    inventory: { quantity: 75, lowStock: 15, inStock: true }
  },
  {
    name: 'Nike Air Max 270',
    category: 'clothing',
    subcategory: 'shoes',
    brand: 'Nike',
    price: 129.99,
    description: 'Comfortable running shoes with Max Air cushioning',
    sku: 'NIKEAIRMAX270',
    asin: 'B07KDQX5TR',
    images: ['/placeholder.svg'],
    inventory: { quantity: 100, lowStock: 20, inStock: true },
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'White', 'Blue']
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    category: 'clothing',
    subcategory: 'mens-clothing',
    brand: 'Levi\'s',
    price: 79.99,
    description: 'Classic straight-leg jeans with authentic fit',
    sku: 'LEVIS501ORIG',
    asin: 'B000NQZS8Q',
    images: ['/placeholder.svg'],
    inventory: { quantity: 80, lowStock: 15, inStock: true },
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Blue', 'Black', 'Dark Blue']
  },
  {
    name: 'KitchenAid Stand Mixer',
    category: 'home-garden',
    subcategory: 'kitchen',
    brand: 'KitchenAid',
    price: 379.99,
    originalPrice: 429.99,
    description: 'Professional-grade stand mixer for all your baking needs',
    sku: 'KITCHENAIDMIXER',
    asin: 'B00063ULMI',
    images: ['/placeholder.svg'],
    inventory: { quantity: 30, lowStock: 5, inStock: true },
    colors: ['Red', 'White', 'Black', 'Silver']
  }
];

export class SchemaLoader {
  private static instance: SchemaLoader;
  private isLoaded = false;

  static getInstance(): SchemaLoader {
    if (!SchemaLoader.instance) {
      SchemaLoader.instance = new SchemaLoader();
    }
    return SchemaLoader.instance;
  }

  async loadSchemas(): Promise<void> {
    if (this.isLoaded) {
      console.log(colors.yellow('📋 Schemas already loaded, skipping...'));
      return;
    }

    try {
      console.log(colors.blue('📋 Loading database schemas...'));
      
      // Clear existing data
      await this.clearAllCollections();
      
      // Create default vendor user
      const defaultVendor = await this.createDefaultVendor();
      
      // Load categories
      const categoryMap = await this.loadCategories();
      
      // Load products
      await this.loadProducts(categoryMap, defaultVendor._id);
      
      this.isLoaded = true;
      console.log(colors.green.bold('✅ All schemas loaded successfully!'));
      
    } catch (error: any) {
      console.error(colors.red(`❌ Schema loading failed: ${error.message}`));
      throw error;
    }
  }

  private async clearAllCollections(): Promise<void> {
    const collections = ['categories', 'products', 'users'];
    for (const collectionName of collections) {
      try {
        await mongoose.connection.db.collection(collectionName).deleteMany({});
      } catch (error) {
        // Collection might not exist, ignore error
      }
    }
    console.log(colors.blue('🧹 Cleared existing collections'));
  }

  private async createDefaultVendor(): Promise<any> {
    const vendorData = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Default Vendor',
      email: 'vendor@example.com',
      role: 'vendor',
      tenantId: DEFAULT_TENANT_ID,
      isActive: true
    };

    const vendor = new User(vendorData);
    await vendor.save();
    console.log(colors.green('👤 Created default vendor'));
    return vendor;
  }

  private async loadCategories(): Promise<Map<string, mongoose.Types.ObjectId>> {
    const categoryMap = new Map<string, mongoose.Types.ObjectId>();
    
    console.log(colors.blue('📁 Loading categories...'));
    
    for (const categoryData of CATEGORY_STRUCTURE) {
      // Create main category
      const mainCategory = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        icon: categoryData.icon,
        color: categoryData.color,
        level: 0,
        path: categoryData.slug,
        breadcrumbs: [],
        isActive: true,
        isFeatured: categoryData.isFeatured,
        showOnHomepage: categoryData.showOnHomepage,
        showInMenu: true,
        sortOrder: 0,
        menuOrder: 0,
        productCount: 0,
        commissionRate: 5,
        keywords: [categoryData.name.toLowerCase()],
        tenantId: DEFAULT_TENANT_ID
      });

      await mainCategory.save();
      categoryMap.set(categoryData.slug, mainCategory._id);
      
      // Create subcategories
      if (categoryData.subcategories) {
        for (const subCatData of categoryData.subcategories) {
          const subCategory = new Category({
            _id: new mongoose.Types.ObjectId(),
            name: subCatData.name,
            slug: subCatData.slug,
            parentCategory: mainCategory._id,
            level: 1,
            path: `${categoryData.slug}/${subCatData.slug}`,
            breadcrumbs: [categoryData.name],
            isActive: true,
            isFeatured: false,
            showOnHomepage: false,
            showInMenu: true,
            sortOrder: 0,
            menuOrder: 0,
            productCount: 0,
            commissionRate: 5,
            keywords: [subCatData.name.toLowerCase()],
            tenantId: DEFAULT_TENANT_ID
          });

          await subCategory.save();
          categoryMap.set(subCatData.slug, subCategory._id);
          
          // Update parent's children array
          mainCategory.children = mainCategory.children || [];
          mainCategory.children.push(subCategory._id);
        }
        
        await mainCategory.save();
      }
    }
    
    console.log(colors.green(`✅ Loaded ${categoryMap.size} categories`));
    return categoryMap;
  }

  private async loadProducts(categoryMap: Map<string, mongoose.Types.ObjectId>, vendorId: mongoose.Types.ObjectId): Promise<void> {
    console.log(colors.blue('📦 Loading products...'));
    
    for (const productData of SAMPLE_PRODUCTS) {
      const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        tenantId: DEFAULT_TENANT_ID,
        name: productData.name,
        slug: slugify(productData.name, { lower: true, strict: true }),
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice,
        category: productData.category,
        subcategory: productData.subcategory,
        brand: productData.brand,
        vendorId: vendorId,
        sku: productData.sku,
        asin: productData.asin,
        images: productData.images,
        inventory: productData.inventory,
        features: [],
        sizes: productData.sizes || [],
        colors: productData.colors || [],
        isActive: true
      });

      await product.save();
      
      // Update category product count
      const categoryId = categoryMap.get(productData.category);
      if (categoryId) {
        await Category.findByIdAndUpdate(categoryId, { $inc: { productCount: 1 } });
      }
      
      const subcategoryId = categoryMap.get(productData.subcategory || '');
      if (subcategoryId) {
        await Category.findByIdAndUpdate(subcategoryId, { $inc: { productCount: 1 } });
      }
    }
    
    console.log(colors.green(`✅ Loaded ${SAMPLE_PRODUCTS.length} products`));
  }

  async getStats(): Promise<any> {
    const stats = {
      categories: await Category.countDocuments({}),
      products: await Product.countDocuments({}),
      users: await User.countDocuments({}),
      featuredCategories: await Category.countDocuments({ isFeatured: true }),
      activeProducts: await Product.countDocuments({ isActive: true })
    };
    
    return stats;
  }

  isSchemaLoaded(): boolean {
    return this.isLoaded;
  }
}

export default SchemaLoader.getInstance();