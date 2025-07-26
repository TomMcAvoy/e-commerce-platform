const request = require('supertest');
const app = require('../../../app'); // Adjust the path as necessary

describe('Dropshipping Service', () => {
    it('should create a new dropshipping order', async () => {
        const newOrder = {
            items: [{ productId: 'test-product-123', quantity: 2, price: 25.99 }],
            shippingAddress: {
                address1: '123 Main St',
                city: 'Anytown',
                state: 'CA',
                postalCode: '12345',
                country: 'US',
                firstName: 'John',
                lastName: 'Doe'
            }
        };

        const response = await request(app)
            .post('/api/dropshipping/orders')
            .send(newOrder);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('orderId');
    });

    it('should handle errors for invalid dropshipping order', async () => {
        const invalidOrder = {
            items: [],
            shippingAddress: {}
        };

        const response = await request(app)
            .post('/api/dropshipping/orders')
            .send(invalidOrder);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});