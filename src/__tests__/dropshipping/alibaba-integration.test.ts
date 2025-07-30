import { AlibabaProvider } from '../../services/dropshipping/AlibabaProvider';
import { CategoryImporter } from '../../services/dropshipping/CategoryImporter';
import Category from '../../models/Category';
import Product from '../../models/Product';

describe('Alibaba Integration', () => {
  const tenantId = '6884bf4702e02fe6eb401303';
  let alibabaProvider: AlibabaProvider;
  let categoryImporter: CategoryImporter;

  beforeAll(() => {
    alibabaProvider = new AlibabaProvider({
      apiKey: 'test-key',
      appSecret: 'test-secret',
      accessToken: 'test-token'
    });
    
    categoryImporter = new CategoryImporter(tenantId);
  });

  beforeEach(async () => {
    await Category.deleteMany({ tenantId });
    await Product.deleteMany({ tenantId });
  });

  describe('AlibabaProvider', () => {
    it('should initialize with correct provider name', () => {
      expect(alibabaProvider.getProviderName()).toBe('Alibaba');
    });

    it('should handle health check', async () => {
      const health = await alibabaProvider.checkHealth();
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('details');
    });

    it('should get default categories when API fails', async () => {
      const categories = await alibabaProvider.getCategories();
      
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0]).toHaveProperty('name');
      expect(categories[0]).toHaveProperty('slug');
    });

    it('should create products with proper dropship flags', async () => {
      const productData = {
        tenantId,
        name: 'Alibaba Test Product',
        slug: 'alibaba-test-product',
        price: 29.99,
        category: 'electronics',
        isDropship: true,
        dropshipProvider: 'alibaba',
        dropshipProductId: 'ali-12345',
        inventory: { quantity: 100, inStock: true },
        tags: ['alibaba', 'dropship', 'electronics']
      };

      await Product.create(productData);
      
      const product = await Product.findOne({ dropshipProductId: 'ali-12345' });
      expect(product.isDropship).toBe(true);
      expect(product.dropshipProvider).toBe('alibaba');
      expect(product.tags).toContain('alibaba');
    });
  });
});