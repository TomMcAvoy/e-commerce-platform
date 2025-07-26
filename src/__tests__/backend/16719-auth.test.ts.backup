import request from 'supertest';
import app from '../../index';
import User from '../../models/User'

describe('Auth Controller - Following Copilot Patterns', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with sendTokenResponse pattern', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('token')
      expect(response.body.data.user).toHaveProperty('email', userData.email)
    })

    it('should throw AppError for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      // Create first user
      await User.create(userData)

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('email')
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user following copilot User model patterns
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
      await user.save()
    })

    it('should login user with JWT token', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('token')
    })

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
})
