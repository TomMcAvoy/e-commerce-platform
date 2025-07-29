import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Whitestart/i);
  });

  test('should navigate to categories', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Categories');
    await expect(page).toHaveURL(/categories/);
  });

  test('should navigate to products', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Products');
    await expect(page).toHaveURL(/products/);
  });

  test('should navigate to login', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Login');
    await expect(page).toHaveURL(/login/);
  });

  test('should navigate to cart', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="cart-button"]');
    await expect(page).toHaveURL(/cart/);
  });
});