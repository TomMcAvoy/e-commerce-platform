import request from 'supertest';
import app from '../../index';

describe('Auth Controller', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User',
                role: 'customer'
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    it('should login an existing user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid login', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });
        expect(response.status).toBe(401);
    });
});