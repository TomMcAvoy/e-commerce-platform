import request from 'supertest';
import app from './__tests__/test-app-setup';

describe('Application Tests', () => {
    it('should return a healthy status', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
    });

    it('should return products', async () => {
        const response = await request(app).get('/api/products');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('should create a product', async () => {
        const response = await request(app)
            .post('/api/products')
            .send({ name: 'Test Product', price: 100 });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });
});