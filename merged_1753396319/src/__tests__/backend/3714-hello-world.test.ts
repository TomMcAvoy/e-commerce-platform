import request from 'supertest';
import app from '../test-app-setup';
describe('Hello World', () => {
    test('should return "Hello, World!"', () => {
        expect('Hello, World!').toBe('Hello, World!');
    });
});