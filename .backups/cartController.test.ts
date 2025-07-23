import request from 'supertest';
import app from '../../index';
import User, { IUser, IUserDocument } from '../../models/User';
import Product, { IProduct, IProductDocument } from '../../models/Product';
import Cart, { ICart } from '../../models/Cart';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Helper to generate a valid JWT for a user following your JWT pattern
const generateToken = (userId: mongoose.Types.ObjectId): string => {
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

describe('Cart API', () => {
  let user: IUserDocument;
  let token: string;
  let product1: IProductDocument;
  let product2: IProductDocument;
  const guestSessionId = new mongoose.Types.ObjectId().toString();

  beforeEach(async () => {
    // Clear collections before each test following your test patterns
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});

    user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      role: 'user'
    }) as IUserDocument;

    token = generateToken(user._id);

    product1 = await Product.create({
      name: 'Product 1',
      description: 'Description 1',
      price: 10,
      category: 'Category 1',
      vendor: user._id,
      stock: 100
    }) as IProductDocument;

    product2 = await Product.create({
      name: 'Product 2',
      description: 'Description 2',
      price: 20,
      category: 'Category 2',
      vendor: user._id,
      stock: 50
    }) as IProductDocument;
  });

  describe('POST /api/cart/add', () => {
    it('should add item to cart', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product1._id.toString(), quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.items[0].quantity).toBe(2);
    });
  });

  describe('GET /api/cart', () => {
    it('should get user cart', async () => {
      await Cart.create({
        userId: user._id,
        items: [{ productId: product1._id, quantity: 1, price: 10, name: 'Product 1', sku: 'P1' }]
      });

      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
    });
  });

  describe('DELETE /api/cart/clear (clearCart)', () => {
    it('should properly clear cart using Mongoose DocumentArray splice method', async () => {
      const cart = await Cart.create({
        userId: user._id,
        items: [
          { productId: product1._id, quantity: 2, price: 10, name: 'Product 1', sku: 'P1' },
          { productId: product2._id, quantity: 3, price: 20, name: 'Product 2', sku: 'P2' }
        ]
      });

      const res = await request(app)
        .delete('/api/cart/clear')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      // Verify the DocumentArray was properly cleared
      const clearedCart = await Cart.findById(cart._id);
      expect(clearedCart?.items).toHaveLength(0);
      expect(clearedCart?.userId).toEqual(user._id);
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
      const res = await request(app)
        .delete('/api/cart/clear')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Cart is already empty');
    });
  });
});
