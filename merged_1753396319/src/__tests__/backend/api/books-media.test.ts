const request = require('supertest');
const app = require('../../../app'); // Adjust the path as necessary

describe('Books & Media Category API Tests', () => {
    it('GET /api/products/category/books-media should filter by media type', async () => {
        const response = await request(app)
            .get('/api/products/category/books-media')
            .expect(200);

        expect(response.body.success).toBe(true);
        response.body.data.forEach((product) => {
            expect(product.mediaType).toBe('ebook');
        });
    });

    it('GET /api/products/category/books-media should filter by genre', async () => {
        const response = await request(app)
            .get('/api/products/category/books-media')
            .expect(200);

        expect(response.body.success).toBe(true);
        response.body.data.forEach((product) => {
            expect(product.genre).toBe('fiction');
        });
    });

    it('Digital Content Handling should handle digital product delivery', async () => {
        const response = await request(app)
            .post('/api/products/delivery')
            .send({ customerEmail: 'reader@example.com' })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.downloadLink).toBeDefined();
    });
});