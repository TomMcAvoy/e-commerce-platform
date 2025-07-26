const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary

beforeAll(async () => {
  // Any global setup can be done here
});

afterAll(async () => {
  // Any cleanup can be done here
});

module.exports = { request, app };