import Product from '../../models/Product';

describe('Product Model', () => {
  it('should create a product with required fields', async () => {
    const productData = {
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      category: '507f1f77bcf86cd799439011',
      vendorId: '507f1f77bcf86cd799439012',
      asin: 'B123456789',
      sku: 'TEST-SKU-001',
      brand: 'Test Brand',
      slug: 'test-product-001',
      tenantId: '507f1f77bcf86cd799439011'
    };

    const product = new Product(productData);
    await product.save();

    expect(product.name).toBe('Test Product');
    expect(product.price).toBe(99.99);
    expect(product.isActive).toBe(true);
  });

  it('should validate required fields', async () => {
    const product = new Product({});

    let error;
    try {
      await product.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect((error as any).errors.name).toBeDefined();
    expect((error as any).errors.price).toBeDefined();
  });

  it('should have default values', async () => {
    const productData = {
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      category: '507f1f77bcf86cd799439011',
      vendorId: '507f1f77bcf86cd799439012',
      asin: 'B123456789',
      sku: 'TEST-SKU-002',
      brand: 'Test Brand',
      slug: 'test-product-002',
      tenantId: '507f1f77bcf86cd799439011'
    };

    const product = new Product(productData);
    await product.save();

    expect(product.inventory.quantity).toBe(0);
    expect(product.isActive).toBe(true);
    expect(product.images).toEqual([]);
  });
});