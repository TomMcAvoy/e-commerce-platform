import request from 'supertest';
import app from '../test-app-setup';
describe('Health Endpoints - Following Copilot Debug Patterns', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        success: true,
        message: 'E-Commerce Platform API is healthy',
        timestamp: expect.any(String),
        environment: 'test',
        version: expect.any(String)
      })
    })
  })

  describe('GET /api/status', () => {
    it('should return API status with endpoint mapping', async () => {
      const response = await request(app).get('/api/status')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        success: true,
        authenticated: false,
        timestamp: expect.any(String),
        endpoints: expect.objectContaining({
          auth: '/api/auth',
          products: '/api/products',
          users: '/api/users',
          vendors: '/api/vendors',
          orders: '/api/orders',
          cart: '/api/cart',
          categories: '/api/categories',
          dropshipping: '/api/dropshipping',
          networking: '/api/networking'
        })
      })
    })
  })
})
