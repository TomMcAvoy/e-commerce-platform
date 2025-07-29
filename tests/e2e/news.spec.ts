import { test, expect } from '@playwright/test';

test.describe('News Feed', () => {
  test('should display news articles', async ({ page }) => {
    await page.goto('/news');
    
    // Should show news articles
    await expect(page.locator('[data-testid="news-article"]').first()).toBeVisible();
  });

  test('should filter news by category', async ({ page }) => {
    await page.goto('/news');
    
    // Click on category filter
    await page.click('text=Technology');
    
    // Should filter articles
    await expect(page).toHaveURL(/category=technology/);
  });

  test('should read full article', async ({ page }) => {
    await page.goto('/news');
    
    // Click on article
    await page.locator('[data-testid="news-article"]').first().click();
    
    // Should show full article
    await expect(page.locator('[data-testid="article-content"]')).toBeVisible();
  });

  test('should share article', async ({ page }) => {
    await page.goto('/news');
    await page.locator('[data-testid="news-article"]').first().click();
    
    // Click share button
    await page.click('[data-testid="share-button"]');
    
    // Should show share options
    await expect(page.locator('[data-testid="share-options"]')).toBeVisible();
  });
});