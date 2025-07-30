import Category from '../../models/Category';
import Product from '../../models/Product';
import { AlibabaProvider } from './AlibabaProvider';
import { dropshippingService } from './DropshippingService';

export class CategoryImporter {
  private tenantId: string;
  private alibabaProvider: AlibabaProvider;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
    
    if (process.env.ALIBABA_API_KEY && process.env.ALIBABA_APP_SECRET) {
      this.alibabaProvider = new AlibabaProvider({
        apiKey: process.env.ALIBABA_API_KEY,
        appSecret: process.env.ALIBABA_APP_SECRET,
        accessToken: process.env.ALIBABA_ACCESS_TOKEN
      });
      
      dropshippingService.registerProvider('alibaba', this.alibabaProvider);
    }
  }

  async importCategoriesFromAlibaba(): Promise<void> {
    if (!this.alibabaProvider) {
      console.log('Alibaba provider not configured, using default categories');
      await this.createDefaultCategories();
      return;
    }

    try {
      console.log('🏷️ Importing categories from Alibaba...');
      const alibabaCategories = await this.alibabaProvider.getCategories();
      
      for (const alibabaCat of alibabaCategories) {
        const categoryData = {
          name: alibabaCat.name,
          slug: alibabaCat.slug,
          tenantId: this.tenantId,
          level: alibabaCat.level || 0,
          path: alibabaCat.slug,
          breadcrumbs: [],
          isActive: true,
          isFeatured: alibabaCat.level === 1,
          showInMenu: true,
          productCount: 0,
          externalMappings: {
            alibaba: alibabaCat.id
          },
          description: `${alibabaCat.name} products from Alibaba marketplace`,
          keywords: [alibabaCat.slug.replace('-', ' ')],
          commissionRate: 5
        };

        await Category.findOneAndUpdate(
          { slug: alibabaCat.slug, tenantId: this.tenantId },
          { $set: categoryData },
          { upsert: true, new: true }
        );
      }

      console.log(`✅ Imported ${alibabaCategories.length} categories from Alibaba`);
    } catch (error) {
      console.error('Error importing Alibaba categories:', error);
      await this.createDefaultCategories();
    }
  }

  async importProductsFromAlibaba(categorySlug?: string, limit: number = 50): Promise<void> {
    if (!this.alibabaProvider) {
      console.log('Alibaba provider not configured');
      return;
    }

    try {
      const categories = categorySlug 
        ? await Category.find({ slug: categorySlug, tenantId: this.tenantId })
        : await Category.find({ tenantId: this.tenantId, level: { $lte: 1 } }).limit(5);

      for (const category of categories) {
        console.log(`📦 Importing products for category: ${category.name}`);
        
        const products = await this.alibabaProvider.fetchProducts({
          category: category.slug,
          limit: Math.floor(limit / categories.length) || 10
        });

        let importedCount = 0;
        for (const product of products) {
          const productData = {
            tenantId: this.tenantId,
            name: product.name,
            slug: this.generateUniqueSlug(product.name),
            description: product.description,
            price: product.price,
            originalPrice: product.price * 1.3, // Add 30% markup
            category: category.slug,
            brand: 'Alibaba Supplier',
            sku: `ALI-${product.id}`,
            images: product.imageUrl ? [product.imageUrl] : [],
            inventory: {
              quantity: product.stock || 100,
              lowStock: 10,
              inStock: true
            },
            isActive: true,
            isDropship: true,
            dropshipProvider: 'alibaba',
            dropshipProductId: product.id,
            tags: [category.slug, 'alibaba', 'dropship'],
            features: [],
            variants: product.variants || [],
            supplierInfo: product.supplierInfo
          };

          await Product.findOneAndUpdate(
            { dropshipProductId: product.id, tenantId: this.tenantId },
            { $set: productData },
            { upsert: true, new: true }
          );
          
          importedCount++;
        }

        // Update category product count
        const productCount = await Product.countDocuments({
          category: category.slug,
          tenantId: this.tenantId,
          isActive: true
        });

        await Category.findByIdAndUpdate(category._id, { productCount });
        
        console.log(`✅ Imported ${importedCount} products for ${category.name}`);
        
        // Rate limiting - wait 2 seconds between categories
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error('Error importing Alibaba products:', error);
    }
  }

  async syncInventoryFromAlibaba(): Promise<void> {
    if (!this.alibabaProvider) return;

    try {
      console.log('🔄 Syncing inventory from Alibaba...');
      
      const dropshipProducts = await Product.find({
        tenantId: this.tenantId,
        isDropship: true,
        dropshipProvider: 'alibaba'
      });

      for (const product of dropshipProducts) {
        try {
          const alibabaProducts = await this.alibabaProvider.fetchProducts({
            keyword: product.dropshipProductId
          });

          const alibabaProduct = alibabaProducts.find(p => p.id === product.dropshipProductId);
          
          if (alibabaProduct) {
            await Product.findByIdAndUpdate(product._id, {
              'inventory.quantity': alibabaProduct.stock,
              'inventory.inStock': alibabaProduct.stock > 0,
              price: alibabaProduct.price,
              originalPrice: alibabaProduct.price * 1.3
            });
          }
        } catch (error) {
          console.error(`Error syncing product ${product.name}:`, error);
        }
      }

      console.log('✅ Inventory sync completed');
    } catch (error) {
      console.error('Error syncing inventory:', error);
    }
  }

  private async createDefaultCategories(): Promise<void> {
    const defaultCategories = [
      {
        name: 'Electronics & Technology',
        slug: 'electronics-technology',
        description: 'Electronic devices, gadgets, and technology products',
        icon: '📱',
        color: '#007bff'
      },
      {
        name: 'Fashion & Apparel',
        slug: 'fashion-apparel',
        description: 'Clothing, shoes, and fashion accessories',
        icon: '👗',
        color: '#e91e63'
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement, furniture, and garden supplies',
        icon: '🏠',
        color: '#4caf50'
      },
      {
        name: 'Health & Beauty',
        slug: 'health-beauty',
        description: 'Beauty products, skincare, and health supplements',
        icon: '💄',
        color: '#ff5722'
      },
      {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Sporting goods, fitness equipment, and outdoor gear',
        icon: '⚽',
        color: '#ff9800'
      }
    ];

    for (const cat of defaultCategories) {
      await Category.findOneAndUpdate(
        { slug: cat.slug, tenantId: this.tenantId },
        {
          $set: {
            ...cat,
            tenantId: this.tenantId,
            level: 0,
            path: cat.slug,
            breadcrumbs: [],
            isActive: true,
            isFeatured: true,
            showInMenu: true,
            productCount: 0,
            commissionRate: 8
          }
        },
        { upsert: true, new: true }
      );
    }

    console.log('✅ Created default categories');
  }

  private generateUniqueSlug(name: string): string {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    
    return `${baseSlug}-${Date.now().toString().slice(-5)}`;
  }
}