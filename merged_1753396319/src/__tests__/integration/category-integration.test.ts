const request = require('supertest');
const app = require('../../app'); // Adjust the path as necessary

describe('Cross-Category Integration Tests', () => {
    it('should handle products from multiple categories in cart', async () => {
        const item = { productId: 'test-product-1', quantity: 1 };
        const response = await request(app)
            .post('/api/cart/add')
            .send(item);
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('should calculate shipping costs for mixed categories', async () => {
        const item = { productId: 'test-product-2', quantity: 2, destination: { postalCode: '10001', country: 'US' } };
        const response = await request(app)
            .post('/api/cart/calculate-shipping')
            .send(item);
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.shippingOptions).toBeDefined();
    });

    it('should search across all categories', async () => {
        const response = await request(app)
            .get('/api/products/search?q=bluetooth');
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.categoryCounts).toBeDefined();
    });

    it('should provide category-specific faceted search', async () => {
        const response = await request(app)
            .get('/api/products/search/facets?q=bluetooth');
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.facets.categories).toBeDefined();
    });
});