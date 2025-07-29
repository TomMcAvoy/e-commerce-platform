import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test.beforeEach(async ({ page }) => {
    // Add item to cart first
    await page.goto('/products');
    await page.locator('[data-testid="product-card"]').first().locator('button:has-text("Add to Cart")').click();
  });

  test('should view cart items', async ({ page }) => {
    await page.goto('/cart');
    
    // Should show cart items
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-total"]')).toBeVisible();
  });

  test('should update cart quantity', async ({ page }) => {
    await page.goto('/cart');
    
    // Update quantity
    await page.click('[data-testid="quantity-increase"]');
    
    // Should update total
    await expect(page.locator('[data-testid="cart-total"]')).toContainText('$');
  });

  test('should proceed to checkout', async ({ page }) => {
    await page.goto('/cart');
    
    await page.click('button:has-text("Checkout")');
    
    // Should go to checkout page
    await expect(page).toHaveURL(/checkout/);
  });

  test('should complete checkout form', async ({ page }) => {
    await page.goto('/cart');
    await page.click('button:has-text("Checkout")');
    
    // Fill checkout form
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="address"]', '123 Main St');
    await page.fill('[name="city"]', 'Anytown');
    await page.fill('[name="zipCode"]', '12345');
    
    // Submit order
    await page.click('button:has-text("Place Order")');
    
    // Should show success page
    await expect(page.locator('text=Order confirmed')).toBeVisible();
  });
});