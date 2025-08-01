import { test, expect } from '@playwright/test';

test.describe('API Integration Tests', () => {
  test('should test social posts API', async ({ page }) => {
    // Test API endpoints are working
    const response = await page.request.get('/api/social/posts');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('posts');
  });

  test('should test news API endpoints', async ({ page }) => {
    const response = await page.request.get('/api/news');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('should test news categories API', async ({ page }) => {
    const response = await page.request.get('/api/news/categories');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('should test news countries API', async ({ page }) => {
    const response = await page.request.get('/api/news/countries');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    const response = await page.request.get('/api/social/posts/invalid-id');
    expect(response.status()).toBe(404);
  });

  test('should test authenticated endpoints', async ({ page }) => {
    // Test that protected endpoints require authentication
    const response = await page.request.post('/api/social/posts', {
      data: {
        content: 'Test post',
        category: 'technology'
      }
    });
    expect(response.status()).toBe(401);
  });
});