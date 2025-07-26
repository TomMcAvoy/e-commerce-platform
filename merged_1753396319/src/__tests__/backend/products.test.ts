import request from 'supertest';
import app from '../test-app-setup';
describe('Product API', () => {
    it('should retrieve all products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('products');
    });

    it('should create a new product', async () => {
        const newProduct = {
            name: 'Test Product',
            price: 100,
            description: 'This is a test product',
            category: 'Test Category',
        };
        const res = await request(app).post('/api/products').send(newProduct);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('product');
        expect(res.body.product.name).toEqual(newProduct.name);
    });

    it('should update an existing product', async () => {
        const updatedProduct = {
            name: 'Updated Product',
            price: 150,
        };
        const res = await request(app).put('/api/products/1').send(updatedProduct); // Adjust the ID as necessary
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('product');
        expect(res.body.product.name).toEqual(updatedProduct.name);
    });

    it('should delete a product', async () => {
        const res = await request(app).delete('/api/products/1'); // Adjust the ID as necessary
        expect(res.statusCode).toEqual(204);
    });
});