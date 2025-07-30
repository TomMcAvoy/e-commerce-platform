import request from 'supertest';
import app from '../test-app-setup';

describe('Cart API', () => {
    it('should add an item to the cart', async () => {
        const response = await request(app)
            .post('/api/cart')
            .send({ 
                productId: '507f1f77bcf86cd799439012', // Valid MongoDB ObjectId
                quantity: 1 
            });
        
        // Cart endpoints return 200 on success, not 201
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
    });

    it('should retrieve the cart items', async () => {
        const response = await request(app)
            .get('/api/cart');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        // Check if data has items array (could be empty for new cart)
        expect(response.body.data).toHaveProperty('items');
    });

    it('should remove an item from the cart', async () => {
        const response = await request(app)
            .delete('/api/cart/507f1f77bcf86cd799439012'); // Valid MongoDB ObjectId
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
    });
});