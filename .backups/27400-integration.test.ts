import request from 'supertest';
import app from '../../index';

describe('Integration Tests for Backend API', () => {
    it('should check Auth API health', async () => {
        const response = await request(app).get('/api/auth/status');
        expect(response.status).toBe(200);
    });

    it('should get all products', async () => {
        const response = await request(app).get('/api/products');
        expect(response.status).toBe(200);
    });

    it('should get user details', async () => {
        const response = await request(app).get('/api/users/1'); // Adjust user ID as necessary
        expect(response.status).toBe(200);
    });

    it('should get vendor details', async () => {
        const response = await request(app).get('/api/vendors/1'); // Adjust vendor ID as necessary
        expect(response.status).toBe(200);
    });

    it('should get all categories', async () => {
        const response = await request(app).get('/api/categories');
        expect(response.status).toBe(200);
    });

    it('should create a new order', async () => {
        const response = await request(app).post('/api/orders').send({
            // Add necessary order data
        });
        expect(response.status).toBe(201);
    });

    it('should add an item to the cart', async () => {
        const response = await request(app).post('/api/cart').send({
            // Add necessary cart item data
        });
        expect(response.status).toBe(201);
    });
});