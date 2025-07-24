const { test, expect } = require('@playwright/test');

test('GET /api/products/category/fashion should return 200', async ({ request }) => {
    const response = await request.get('/api/products/category/fashion');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
});

test('GET /api/products/category/sports-fitness should return 200', async ({ request }) => {
    const response = await request.get('/api/products/category/sports-fitness');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
});