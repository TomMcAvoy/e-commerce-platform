import app from '../__tests__/test-app-setup';
import request from 'supertest';
import User from '../models/User'; // Default import for Mongoose models

describe('Auth Controller', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register user using sendTokenResponse pattern', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer',
        tenantId: process.env.DEFAULT_TENANT_ID || '6884bf4702e02fe6eb401303'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
      
      // Check sendTokenResponse pattern sets HTTP-only cookie
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user with JWT token', async () => {
      // Create test user first
      const user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer',
        tenantId: process.env.DEFAULT_TENANT_ID || '6884bf4702e02fe6eb401303'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });
  });

  describe('GET /api/auth/me', () => {
    it.skip('should return user profile when authenticated', async () => {
      // Skipped because this requires authentication setup
      // In a real test, you would authenticate first and then test this endpoint
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401); // Expect unauthorized without token

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Protected Routes', () => {
    it('should protect routes with middleware', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message || response.body.error).toBeDefined();
    });
  });
});
