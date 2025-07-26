import request from 'supertest';
import app from '../test-app-setup';
import User, { IUser, IUserDocument } from '../../models/User';
import Product, { IProduct, IProductDocument } from '../../models/Product';
import Cart, { ICart } from '../../models/Cart';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Helper to generate a valid JWT following sendTokenResponse() pattern
const generateToken = (userId: mongoose.Types.ObjectId): string => {
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

describe('Cart API - Multi-Vendor E-Commerce Platform', () => {
  let user: IUserDocument;
  let vendorUser: IUserDocument;
  let otherUser: IUserDocument;
  let token: string;
  let vendorToken: string;
  let product1: IProductDocument;
  let product2: IProductDocument;
  let productWithVariants: IProductDocument;
  const guestSessionId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    // Ensure test database connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shoppingcart_test');
    }
  });

  beforeEach(async () => {
    // Clear collections before each test following your test patterns
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});

    // Create test user
    user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      role: 'user'
    }) as IUserDocument;

    // Create vendor user
    vendorUser = await User.create({
      name: 'Vendor User',
      email: 'vendor@example.com',
      password: '123456',
      role: 'vendor'
    }) as IUserDocument;

    // Create other user for isolation tests
    otherUser = await User.create({
      name: 'Other User',
      email: 'other@example.com',
      password: '123456',
      role: 'user'
    }) as IUserDocument;

    token = generateToken(user._id);
    vendorToken = generateToken(vendorUser._id);

    // Create test products
    product1 = await Product.create({
      name: 'Product 1',
      description: 'Description 1',
      price: 10,
      category: 'Category 1',
      vendor: vendorUser._id,
      stock: 100,
      sku: 'P1'
    }) as IProductDocument;

    product2 = await Product.create({
      name: 'Product 2',
      description: 'Description 2',
      price: 20,
      category: 'Category 2',
      vendor: vendorUser._id,
      stock: 50,
      sku: 'P2'
    }) as IProductDocument;

    // Create product with variants
    productWithVariants = await Product.create({
      name: 'Product with Variants',
      description: 'Product with size variants',
      price: 30,
      category: 'Clothing',
      vendor: vendorUser._id,
      stock: 20,
      variants: [
        { value: 'Small', price: 30, sku: 'PWV-S', stock: 5 },
        { value: 'Medium', price: 32, sku: 'PWV-M', stock: 8 },
        { value: 'Large', price: 35, sku: 'PWV-L', stock: 7 }
      ]
    }) as IProductDocument;
  });

  afterAll(async () => {
    // Clean up test database
    await mongoose.connection.close();
  });

  describe('POST /api/cart/add', () => {
    it('should add item to cart for authenticated user', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product1._id.toString(), quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.items[0].quantity).toBe(2);
      expect(res.body.data.items[0].productId.toString()).toBe(product1._id.toString());
    });

    it('should add item with variant to cart', async () => {
      const variantId = productWithVariants.variants[0]._id;
      
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          productId: productWithVariants._id.toString(), 
          variantId: variantId.toString(),
          quantity: 1 
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items[0].variantId.toString()).toBe(variantId.toString());
    });

    it('should add item to guest cart using session ID', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .set('x-session-id', guestSessionId)
        .send({ productId: product1._id.toString(), quantity: 1 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.sessionId).toBe(guestSessionId);
    });

    it('should update quantity if item already exists in cart', async () => {
      // First add
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product1._id.toString(), quantity: 1 });

      // Second add (should update quantity)
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product1._id.toString(), quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.items[0].quantity).toBe(3); // 1 + 2
    });

    it('should return 401 without authentication or session', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .send({ productId: product1._id.toString(), quantity: 1 });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/cart', () => {
    beforeEach(async () => {
      // Create test cart
      await Cart.create({
        userId: user._id,
        items: [
          { productId: product1._id, quantity: 1, price: 10, name: 'Product 1', sku: 'P1' },
          { productId: product2._id, quantity: 2, price: 20, name: 'Product 2', sku: 'P2' }
        ]
      });
    });

    it('should get user cart with populated product data', async () => {
      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(2);
      expect(res.body.data.userId.toString()).toBe(user._id.toString());
    });

    it('should get guest cart using session ID', async () => {
      await Cart.create({
        sessionId: guestSessionId,
        items: [{ productId: product1._id, quantity: 1, price: 10, name: 'Product 1', sku: 'P1' }]
      });

      const res = await request(app)
        .get('/api/cart')
        .set('x-session-id', guestSessionId);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.sessionId).toBe(guestSessionId);
    });

    it('should return empty cart if no cart exists', async () => {
      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${vendorToken}`); // Different user

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(0);
    });

    it('should not return other users carts', async () => {
      // Create cart for other user
      await Cart.create({
        userId: otherUser._id,
        items: [{ productId: product1._id, quantity: 5, price: 10, name: 'Product 1', sku: 'P1' }]
      });

      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`); // Different user

      expect(res.status).toBe(200);
      expect(res.body.data.items).toHaveLength(2); // Only original user's items
    });
  });

  describe('PUT /api/cart/update', () => {
    beforeEach(async () => {
      await Cart.create({
        userId: user._id,
        items: [
          { productId: product1._id, quantity: 1, price: 10, name: 'Product 1', sku: 'P1' },
          { productId: product2._id, quantity: 2, price: 20, name: 'Product 2', sku: 'P2' }
        ]
      });
    });

    it('should update item quantity in cart', async () => {
      const res = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product1._id.toString(), quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      const updatedItem = res.body.data.items.find((item: any) => 
        item.productId.toString() === product1._id.toString()
      );
      expect(updatedItem.quantity).toBe(5);
    });

    it('should remove item when quantity is 0', async () => {
      const res = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product1._id.toString(), quantity: 0 });

      expect(res.status).toBe(200);
      expect(res.body.data.items).toHaveLength(1); // One item removed
      
      const remainingItem = res.body.data.items[0];
      expect(remainingItem.productId.toString()).toBe(product2._id.toString());
    });
  });

  describe('DELETE /api/cart/remove', () => {
    beforeEach(async () => {
      await Cart.create({
        userId: user._id,
        items: [
          { productId: product1._id, quantity: 1, price: 10, name: 'Product 1', sku: 'P1' },
          { productId: product2._id, quantity: 2, price: 20, name: 'Product 2', sku: 'P2' }
        ]
      });
    });

    it('should remove specific item from cart', async () => {
      const res = await request(app)
        .delete('/api/cart/remove')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product1._id.toString() });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
      
      const remainingItem = res.body.data.items[0];
      expect(remainingItem.productId.toString()).toBe(product2._id.toString());
    });
  });

  describe('DELETE /api/cart/clear (clearCart)', () => {
    beforeEach(async () => {
      await Cart.create({
        userId: user._id,
        items: [
          { productId: product1._id, quantity: 2, price: 10, name: 'Product 1', sku: 'P1' },
          { productId: product2._id, quantity: 3, price: 20, name: 'Product 2', sku: 'P2' }
        ]
      });
    });

    it('should properly clear cart using Mongoose DocumentArray splice method', async () => {
      const res = await request(app)
        .delete('/api/cart/clear')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      // Verify the DocumentArray was properly cleared
      const clearedCart = await Cart.findOne({ userId: user._id });
      expect(clearedCart?.items).toHaveLength(0);
      expect(clearedCart?.userId.toString()).toBe(user._id.toString());
    });

    it('should clear guest cart with session ID', async () => {
      await Cart.create({
        sessionId: guestSessionId,
        items: [
          { productId: product1._id, quantity: 1, price: 10, name: 'Product 1', sku: 'P1' }
        ]
      });

      const res = await request(app)
        .delete('/api/cart/clear')
        .set('x-session-id', guestSessionId);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(0);
      expect(res.body.message).toBe('Cart cleared');
    });

    it('should handle clearing empty cart gracefully', async () => {
      // Clear existing cart first
      await Cart.deleteOne({ userId: user._id });

      const res = await request(app)
        .delete('/api/cart/clear')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Cart is already empty');
    });

    it('should not clear other users carts', async () => {
      // Create cart for other user
      await Cart.create({
        userId: otherUser._id,
        items: [{ productId: product1._id, quantity: 5, price: 10, name: 'Product 1', sku: 'P1' }]
      });

      // Clear current user's cart
      await request(app)
        .delete('/api/cart/clear')
        .set('Authorization', `Bearer ${token}`);

      // Verify other user's cart is untouched
      const otherCart = await Cart.findOne({ userId: otherUser._id });
      expect(otherCart?.items).toHaveLength(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid product ID gracefully', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: 'invalid-id', quantity: 1 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should handle non-existent product ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: nonExistentId.toString(), quantity: 1 });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not found/i);
    });

    it('should validate quantity limits', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product1._id.toString(), quantity: 999999 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('API Endpoint Coverage', () => {
    const endpoints = [
      { method: 'post', path: '/api/cart/add' },
      { method: 'get', path: '/api/cart' },
      { method: 'put', path: '/api/cart/update' },
      { method: 'delete', path: '/api/cart/remove' },
      { method: 'delete', path: '/api/cart/clear' }
    ];

    it('should respond to all cart API endpoints', async () => {
      const results = await Promise.allSettled(
        endpoints.map(endpoint => 
          request(app)[endpoint.method as keyof typeof request](endpoint.path)
            .set('Authorization', `Bearer ${token}`)
            .send({ productId: product1._id.toString(), quantity: 1 })
        )
      );

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          expect([200, 400, 401, 404]).toContain(result.value.status);
        }
      });
    });
  });

  describe('Performance & Concurrency', () => {
    it('should handle concurrent cart operations', async () => {
      const operations = Array(5).fill(null).map((_, index) => 
        request(app)
          .post('/api/cart/add')
          .set('Authorization', `Bearer ${token}`)
          .send({ productId: product1._id.toString(), quantity: 1 })
      );

      const results = await Promise.all(operations);
      
      // All operations should succeed
      results.forEach(res => {
        expect(res.status).toBe(200);
      });

      // Final cart should have correct total quantity
      const finalCart = await Cart.findOne({ userId: user._id });
      expect(finalCart?.items[0].quantity).toBe(5);
    });
  });
});
