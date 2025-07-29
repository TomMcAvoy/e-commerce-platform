import { test, expect } from '@playwright/test';

test.describe('Product Features', () => {
  test('should display products list', async ({ page }) => {
    await page.goto('/products');
    
    // Should show products grid or list
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/products');
    
    // Click on a category filter
    await page.click('text=Security & Surveillance');
    
    // Should filter products
    await expect(page).toHaveURL(/category=security/);
  });

  test('should view product details', async ({ page }) => {
    await page.goto('/products');
    
    // Click on first product
    await page.locator('[data-testid="product-card"]').first().click();
    
    // Should show product details
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/products');
    
    // Click Add to Cart button directly on product card
    await page.locator('[data-testid="product-card"]').first().locator('button:has-text("Add to Cart")').click();
    
    // Should show success message
    await expect(page.locator('text=Added to cart')).toBeVisible();
  });
});