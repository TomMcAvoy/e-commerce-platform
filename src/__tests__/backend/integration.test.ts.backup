import request from 'supertest';
import app from '../../index';

describe('Integration Tests for Backend API', () => {
    test('Auth API - Health Check', async () => {
        const response = await request(app).get('/api/auth/status');
        expect(response.status).toBe(200);
    });

    test('Products API - Health Check', async () => {
        const response = await request(app).get('/api/products');
        expect(response.status).toBe(200);
    });

    test('Users API - Health Check', async () => {
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
    });

    test('Vendors API - Health Check', async () => {
        const response = await request(app).get('/api/vendors');
        expect(response.status).toBe(200);
    });

    test('Categories API - Health Check', async () => {
        const response = await request(app).get('/api/categories');
        expect(response.status).toBe(200);
    });

    test('Orders API - Health Check', async () => {
        const response = await request(app).get('/api/orders');
        expect(response.status).toBe(200);
    });

    test('Cart API - Health Check', async () => {
        const response = await request(app).get('/api/cart');
        expect(response.status).toBe(200);
    });
});