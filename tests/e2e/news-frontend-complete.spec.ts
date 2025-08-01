import { test, expect } from '@playwright/test';

test.describe('News Frontend - Countries & Categories', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/news');
    await page.waitForLoadState('networkidle');
  });

  test('should display news page with filters', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Latest News');
    await expect(page.locator('text=Select Country:')).toBeVisible();
    await expect(page.locator('text=Select Category:')).toBeVisible();
  });

  test('should show All Countries button', async ({ page }) => {
    await expect(page.locator('text=All Countries')).toBeVisible();
  });

  test('should display news articles', async ({ page }) => {
    await expect(page.locator('.grid').first()).toBeVisible();
  });

  test('should handle category filtering', async ({ page }) => {
    const categoryButton = page.locator('button').filter({ hasText: /Technology|Business|Sports/ }).first();
    if (await categoryButton.isVisible()) {
      await categoryButton.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should handle country filtering', async ({ page }) => {
    const countryButton = page.locator('button').filter({ hasText: /USA|Canada|UK/ }).first();
    if (await countryButton.isVisible()) {
      await countryButton.click();
      await page.waitForLoadState('networkidle');
    }
  });
});