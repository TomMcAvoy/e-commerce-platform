import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.*/, { timeout: 10000 });
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 5000 });
  });

  test('products page loads', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });
  });
});