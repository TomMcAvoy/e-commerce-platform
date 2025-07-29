import { test, expect } from '@playwright/test';

test.describe('Categories Page', () => {
  test('should display categories list', async ({ page }) => {
    await page.goto('/categories');
    
    await expect(page.locator('h1')).toContainText('All Categories');
    await expect(page.locator('[data-testid="category-card"]').first()).toBeVisible();
  });

  test('should navigate to category page', async ({ page }) => {
    await page.goto('/categories');
    
    await page.locator('[data-testid="category-card"]').first().click();
    await expect(page).toHaveURL(/\/categories\/.+/);
  });

  test('should display products in category page', async ({ page }) => {
    await page.goto('/categories/home-garden');
    
    await expect(page.locator('h1')).toContainText('Home Garden');
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  });

  test('should display product cards with add to cart', async ({ page }) => {
    await page.goto('/categories/home-garden');
    
    const productCard = page.locator('[data-testid="product-card"]').first();
    await expect(productCard).toBeVisible();
    await expect(productCard.locator('button:has-text("Add to Cart")')).toBeVisible();
  });

  test('should add product to cart from category page', async ({ page }) => {
    await page.goto('/categories/home-garden');
    
    await page.locator('[data-testid="product-card"]').first().locator('button:has-text("Add to Cart")').click();
    await expect(page.locator('[data-testid="cart-button"]')).toContainText('1');
  });
});