const request = require('supertest');
const app = require('../../app'); // Adjust the path as necessary

describe('Authentication Tests', () => {
    it('should not register a user with existing email', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'existinguser@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe'
            });
        expect(response.status).toBe(400);
    });
});