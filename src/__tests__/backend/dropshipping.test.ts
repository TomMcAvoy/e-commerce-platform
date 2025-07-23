import request from 'supertest';
import app from '../../index';

describe('Dropshipping Service', () => {
    test('should return dropshipping data', async () => {
        const response = await request(app).get('/api/dropshipping'); // Adjust the endpoint as necessary
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
    });

    test('should create a new dropshipping order', async () => {
        const newOrder = {
            productId: '12345',
            quantity: 2,
            vendorId: '67890'
        };
        const response = await request(app).post('/api/dropshipping/orders').send(newOrder); // Adjust the endpoint as necessary
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('orderId');
    });

    test('should handle errors for invalid dropshipping order', async () => {
        const invalidOrder = {
            productId: '',
            quantity: 0,
            vendorId: ''
        };
        const response = await request(app).post('/api/dropshipping/orders').send(invalidOrder); // Adjust the endpoint as necessary
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});