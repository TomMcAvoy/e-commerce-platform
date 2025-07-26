import request from 'supertest';
import app from '../test-app-setup';
describe('Cart API', () => {
    it('should add an item to the cart', async () => {
        const response = await request(app)
            .post('/api/cart')
            .send({ itemId: '123', quantity: 1 });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Item added to cart');
    });

    it('should retrieve the cart items', async () => {
        const response = await request(app)
            .get('/api/cart');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('items');
    });

    it('should remove an item from the cart', async () => {
        const response = await request(app)
            .delete('/api/cart/123'); // Adjust the item ID as necessary
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Item removed from cart');
    });
});