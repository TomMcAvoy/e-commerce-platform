#!/bin/bash

# This script will create/overwrite the necessary files to fix the cart logic and tests.
# It ensures the Product model is correct and the cart controller test suite is robust.

# Ensure the directories exist
mkdir -p src/models
mkdir -p src/__tests__/backend

# --- File 2: Overwrite the Cart Controller Test Suite ---
# This replaces the broken test file with a comprehensive and correct version.
echo "Updating src/__tests__/backend/cartController.test.ts..."
cat << 'EOF' > src/__tests__/backend/cartController.test.ts
import request from 'supertest';
import app from '../../index';
import User from '../../models/User';
import Product from '../../models/Product';
import Cart from '../../models/Cart';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Helper to generate a valid JWT for a user
const generateToken = (userId: mongoose.Types.ObjectId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

describe('Cart API', () => {
  let user: any;
  let token: string;
  let product1: any;
  let product2: any;
  let category: any;
  let vendor: any;
  const guestSessionId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    // Create dummy category and vendor for product creation
    category = new mongoose.Types.ObjectId();
    vendor = new mongoose.Types.ObjectId();
  });

  beforeEach(async () => {
    // Clear collections before each test
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});

    // Create a user and token
    user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    token = generateToken(user._id);

    // Create products
    product1 = await Product.create({ name: 'Product 1', description: 'Desc 1', price: 10, sku: 'P1', category, vendor, stock: 10 });
    product2 = await Product.create({ name: 'Product 2', description: 'Desc 2', price: 20, sku: 'P2', category, vendor, stock: 5 });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Guest Cart', () => {
    it('should add an item to a guest cart', async () => {
      const res = await request(app)
        .post('/api/cart/items')
        .set('x-session-id', guestSessionId)
        .send({ productId: product1._id.toString(), quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.items[0].quantity).toBe(2);
      expect(res.body.data.sessionId).toBe(guestSessionId);
    });

    it('should remove an item from a guest cart', async () => {
      // First, add an item
      const cart = await Cart.create({
        sessionId: guestSessionId,
        items: [{ productId: product1._id, quantity: 1, price: 10, name: 'Product 1', sku: 'P1' }]
      });
      const itemId = cart.items[0]._id;

      const res = await request(app)
        .delete(`/api/cart/items/${itemId}`)
        .set('x-session-id', guestSessionId);

      expect(res.status).toBe(200);
      expect(res.body.data.items).toHaveLength(0);
    });
  });

  describe('Authenticated User Cart', () => {
    it('should add an item to a user cart', async () => {
      const res = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product2._id.toString(), quantity: 1 });

      expect(res.status).toBe(200);
      expect(res.body.data.items[0].productId).toBe(product2._id.toString());
      expect(res.body.data.userId).toBe(user._id.toString());
    });

    it('should get the user cart', async () => {
      await Cart.create({ userId: user._id, items: [{ productId: product1._id, quantity: 3, price: 10, name: 'Product 1', sku: 'P1' }] });

      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.items[0].quantity).toBe(3);
    });
  });

  describe('POST /api/cart/merge', () => {
    beforeEach(async () => {
      // Create a guest cart for merging
      await Cart.create({
        sessionId: guestSessionId,
        items: [{ productId: product1._id, quantity: 1, price: 10, name: 'Product 1', sku: 'P1' }]
      });
    });

    it('should merge a guest cart into a new user cart', async () => {
      const res = await request(app)
        .post('/api/cart/merge')
        .set('Authorization', `Bearer ${token}`)
        .send({ guestSessionId });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Cart merged successfully');
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.items[0].productId).toBe(product1._id.toString());
      const guestCart = await Cart.findOne({ sessionId: guestSessionId });
      expect(guestCart).toBeNull();
    });

    it('should merge into an existing user cart and combine items', async () => {
      await Cart.create({
        userId: user._id,
        items: [{ productId: product2._id, quantity: 2, price: 20, name: 'Product 2', sku: 'P2' }]
      });

      const res = await request(app)
        .post('/api/cart/merge')
        .set('Authorization', `Bearer ${token}`)
        .send({ guestSessionId });

      expect(res.status).toBe(200);
      expect(res.body.data.items).toHaveLength(2);
      expect(res.body.data.itemCount).toBe(3); // 1 from guest + 2 from user
    });

    it('should combine quantities for overlapping items on merge', async () => {
      await Cart.create({
        userId: user._id,
        items: [{ productId: product1._id, quantity: 2, price: 10, name: 'Product 1', sku: 'P1' }]
      });

      const res = await request(app)
        .post('/api/cart/merge')
        .set('Authorization', `Bearer ${token}`)
        .send({ guestSessionId });

      expect(res.status).toBe(200);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.items[0].quantity).toBe(3); // 1 from guest + 2 from user
    });

    it('should require authentication to merge', async () => {
      const res = await request(app)
        .post('/api/cart/merge')
        .send({ guestSessionId });

      expect(res.status).toBe(401);
    });
  });
});
EOF
echo "Script finished. Files have been updated."
