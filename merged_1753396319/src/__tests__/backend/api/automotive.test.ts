const request = require('supertest');
const app = require('../../../app'); // Adjust the path as necessary

describe('Automotive Category API Tests', () => {
    it('GET /api/products/category/automotive should filter by vehicle make and model', async () => {
        const response = await request(app)
            .get('/api/products/category/automotive')
            .expect(200);

        expect(response.body.success).toBe(true);
        response.body.data.forEach((product) => {
            expect(product.compatibility).toContainEqual({
                make: 'Toyota',
                model: 'Camry',
                year: 2020
            });
        });
    });
});