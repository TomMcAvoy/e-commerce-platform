const request = require('supertest');
const app = require('../../../app'); // Adjust the path as necessary

describe('Fashion Category API Tests', () => {
    it('GET /api/products/category/fashion should filter by gender', async () => {
        const response = await request(app)
            .get('/api/products/category/fashion')
            .expect(200);

        expect(response.body.success).toBe(true);
        response.body.data.forEach((product) => {
            expect(['womens', 'unisex']).toContain(product.gender);
        });
    });

    it('GET /api/products/category/fashion should filter by size', async () => {
        const response = await request(app)
            .get('/api/products/category/fashion')
            .expect(200);

        expect(response.body.success).toBe(true);
        response.body.data.forEach((product) => {
            expect(product.sizes).toContain('M');
        });
    });

    it('GET /api/products/category/fashion should filter by color', async () => {
        const response = await request(app)
            .get('/api/products/category/fashion')
            .expect(200);

        expect(response.body.success).toBe(true);
        response.body.data.forEach((product) => {
            expect(product.colors.map((c) => c.toLowerCase())).toContain('black');
        });
    });

    it('Fashion Trend Analysis should get seasonal fashion recommendations', async () => {
        const response = await request(app)
            .get('/api/products/category/fashion/trends')
            .expect(200);

        expect(response.body.success).toBe(true);
        response.body.data.forEach((product) => {
            expect(product.seasonalTags).toContain('summer');
        });
    });
});