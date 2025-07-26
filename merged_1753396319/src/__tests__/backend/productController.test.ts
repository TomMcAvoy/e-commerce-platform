import request from 'supertest';
import app from '../test-app-setup';
describe('Product Controller', () => {
    it('should create a product', async () => {
        const response = await request(app)
            .post('/api/products')
            .send({
                name: 'Test Product',
                price: 100,
                description: 'This is a test product',
                category: 'Test Category'
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('should update a product', async () => {
        const response = await request(app)
            .put('/api/products/1') // Replace with a valid product ID
            .send({
                name: 'Updated Product',
                price: 150
            });
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Product');
    });

    it('should delete a product', async () => {
        const response = await request(app)
            .delete('/api/products/1'); // Replace with a valid product ID
        expect(response.status).toBe(204);
    });

    it('should retrieve a product', async () => {
        const response = await request(app)
            .get('/api/products/1'); // Replace with a valid product ID
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name');
    });
});