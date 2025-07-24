const request = require('supertest');
const app = require('../app'); // Adjust the path to your app

describe('API Endpoints', () => {
    test('GET /api/products/category/fashion should return 200', async () => {
        const response = await request(app)
            .get('/api/products/category/fashion?color=black')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/products/category/fashion/trending should return 200', async () => {
        const response = await request(app)
            .get('/api/products/category/fashion/trending')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });

    test('GET /api/products/category/home-garden should return 200', async () => {
        const response = await request(app)
            .get('/api/products/category/home-garden')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('POST /api/cart/add should return 200', async () => {
        const item = { productId: 'someProductId', quantity: 1 };
        const response = await request(app)
            .post('/api/cart/add')
            .send(item)
            .expect(200);

        expect(response.body.success).toBe(true);
    });

    test('GET /api/products/search?q=wireless should return 200', async () => {
        const response = await request(app)
            .get('/api/products/search?q=wireless')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });
});