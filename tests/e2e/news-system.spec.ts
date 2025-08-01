import { test, expect } from '@playwright/test';

test.describe('News System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/news');
  });

  test('should display news feed', async ({ page }) => {
    await expect(page.locator('[data-testid="news-article"]').first()).toBeVisible();
  });

  test('should filter news by category', async ({ page }) => {
    await page.click('text=Technology');
    await expect(page).toHaveURL(/category=technology/);
  });

  test('should display news categories', async ({ page }) => {
    // Check for common news categories
    const categories = ['Technology', 'Business', 'Sports', 'Entertainment'];
    
    for (const category of categories) {
      await expect(page.locator(`text=${category}`)).toBeVisible();
    }
  });

  test('should show article previews', async ({ page }) => {
    // Check that articles have basic structure
    await expect(page.locator('[data-testid="news-article"] h2').first()).toBeVisible();
    await expect(page.locator('[data-testid="news-article"] p').first()).toBeVisible();
  });

  test('should navigate to full article', async ({ page }) => {
    await page.locator('[data-testid="news-article"]').first().click();
    await expect(page.locator('[data-testid="article-content"]')).toBeVisible();
  });

  test('should display article sharing options', async ({ page }) => {
    await page.locator('[data-testid="news-article"]').first().click();
    await page.click('[data-testid="share-button"]');
    await expect(page.locator('[data-testid="share-options"]')).toBeVisible();
  });

  test('should show news feed with pagination', async ({ page }) => {
    // Check if pagination exists for large news feeds
    const articles = page.locator('[data-testid="news-article"]');
    await expect(articles).toHaveCount(10); // Assuming 10 articles per page
  });

  test('should filter by country/region', async ({ page }) => {
    // Test international news filtering
    await page.click('text=UK News');
    await expect(page).toHaveURL(/country=uk/);
  });
});