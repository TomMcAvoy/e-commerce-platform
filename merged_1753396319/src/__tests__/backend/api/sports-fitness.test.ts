const request = require('supertest');
const app = require('../../../app'); // Adjust the path as necessary

describe('Sports & Fitness Category API Tests', () => {
    it('GET /api/products/category/sports-fitness should filter by sport type', async () => {
        const response = await request(app)
            .get('/api/products/category/sports-fitness')
            .expect(200);

        expect(response.body.success).toBe(true);
        response.body.data.forEach((product) => {
            expect(['basketball', 'general-fitness']).toContain(product.sport);
        });
    });

    it('GET /api/products/category/sports-fitness should filter by fitness level', async () => {
        const response = await request(app)
            .get('/api/products/category/sports-fitness')
            .expect(200);

        expect(response.body.success).toBe(true);
        response.body.data.forEach((product) => {
            expect(['beginner', 'all-levels']).toContain(product.fitnessLevel);
        });
    });
});