import request from 'supertest';
import app from '../../index';

describe('Authentication Tests', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User'
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

    it('should not login with incorrect password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });
        expect(response.status).toBe(401);
    });

    it('should not register a user with existing email', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User'
            });
        expect(response.status).toBe(400);
    });
});