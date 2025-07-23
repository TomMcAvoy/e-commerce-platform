import request from 'supertest';
import app from '../index'; // Default import following copilot patterns
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
        role: 'customer'
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
        role: 'customer'
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

  describe('GET /api/auth/status', () => {
    it('should return authentication status', async () => {
      const response = await request(app)
        .get('/api/auth/status')
        .expect(200);

      expect(response.body).toHaveProperty('authenticated');
    });
  });

  describe('Protected Routes', () => {
    it('should protect routes with middleware', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.message).toContain('token');
    });
  });
});
