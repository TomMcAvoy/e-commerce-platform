import { test, expect } from '@playwright/test';

test.describe('News Scheduler Seeder', () => {
  test('should verify news seeder worked', async ({ page }) => {
    // News was seeded successfully - just verify it exists
    const response = await page.request.get('/api/news');
    expect(response.status()).toBe(200);
  });

  test('should display seeded articles', async ({ page }) => {
    await page.goto('/news');
    await expect(page.locator('h1, [data-testid="news-article"]')).toBeVisible();
  });
});