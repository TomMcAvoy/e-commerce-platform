const request = require('supertest');
const app = require('../../app'); // Adjust the path as necessary

describe('Health Endpoints - Following Copilot Debug Patterns', () => {
    it('GET /health should return healthy status', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            message: 'E-Commerce Platform API is healthy',
            timestamp: expect.any(String),
        });
    });

    it('GET /api/status should return API status with endpoint mapping', async () => {
        const response = await request(app).get('/api/status');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            endpoints: expect.any(Object),
            timestamp: expect.any(String),
        });
    });
});