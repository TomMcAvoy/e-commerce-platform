const request = require('supertest');
const app = require('../app'); // Adjust the path to your app

describe('Hello World Test', () => {
    test('GET /api/hello should return 200', async () => {
        const response = await request(app)
            .get('/api/hello')
            .expect(200);

        expect(response.body.message).toBe('Hello, World!');
    });
});