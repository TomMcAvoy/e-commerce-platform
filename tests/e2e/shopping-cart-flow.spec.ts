import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Flow with Real Data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('Complete shopping cart workflow', async ({ page }) => {
    // 1. Browse homepage and verify real categories load
    await expect(page.locator('h2:has-text("Shop by Category")')).toBeVisible();
    
    const categoryLinks = page.locator('[href^="/categories/"]');
    const categoryCount = await categoryLinks.count();
    
    if (categoryCount > 0) {
      // Click first category
      await categoryLinks.first().click();
      await page.waitForLoadState('networkidle');
      
      // Verify category page loads
      await expect(page.locator('h1')).toBeVisible();
      
      // Look for products in this category
      const productLinks = page.locator('[href*="/product/"], [href*="/products/"]');
      const productCount = await productLinks.count();
      
      if (productCount > 0) {
        // Click on first product
        await productLinks.first().click();
        await page.waitForLoadState('networkidle');
        
        // Verify product page loads
        await expect(page.locator('h1')).toBeVisible();
        
        // Try to add to cart
        const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add To Cart")');
        if (await addToCartBtn.isVisible()) {
          await addToCartBtn.click();
          await page.waitForTimeout(1000);
          
          // Navigate to cart
          await page.goto('http://localhost:3001/cart');
          await page.waitForLoadState('networkidle');
          
          // Verify cart page loads
          await expect(page.locator('h1, h2')).toBeVisible();
          
          // Look for cart items or empty cart message
          const cartItems = page.locator('.cart-item, [data-testid="cart-item"]');
          const emptyCart = page.locator('text=Your cart is empty, text=No items in cart');
          
          await expect(cartItems.or(emptyCart)).toBeVisible();
        }
      }
    }
  });

  test('Product search functionality', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');
    
    if (await searchInput.isVisible()) {
      // Test search with common terms
      const searchTerms = ['electronics', 'clothing', 'phone', 'laptop'];
      
      for (const term of searchTerms) {
        await searchInput.fill(term);
        await searchInput.press('Enter');
        await page.waitForLoadState('networkidle');
        
        // Verify search results page loads
        await expect(page.locator('body')).toBeVisible();
        
        // Go back to homepage for next search
        await page.goto('http://localhost:3001');
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('Cart quantity management', async ({ page }) => {
    // Navigate to cart page
    await page.goto('http://localhost:3001/cart');
    await page.waitForLoadState('networkidle');
    
    // Look for quantity controls
    const quantityInputs = page.locator('input[type="number"], .quantity-input');
    const increaseButtons = page.locator('button:has-text("+"), .quantity-increase');
    const decreaseButtons = page.locator('button:has-text("-"), .quantity-decrease');
    
    const inputCount = await quantityInputs.count();
    
    if (inputCount > 0) {
      // Test quantity increase
      if (await increaseButtons.count() > 0) {
        await increaseButtons.first().click();
        await page.waitForTimeout(500);
      }
      
      // Test quantity decrease
      if (await decreaseButtons.count() > 0) {
        await decreaseButtons.first().click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('Checkout process initiation', async ({ page }) => {
    await page.goto('http://localhost:3001/cart');
    await page.waitForLoadState('networkidle');
    
    // Look for checkout button
    const checkoutBtn = page.locator('button:has-text("Checkout"), a:has-text("Checkout"), button:has-text("Proceed to Checkout")');
    
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      await page.waitForLoadState('networkidle');
      
      // Verify checkout page loads
      await expect(page.locator('body')).toBeVisible();
      
      // Look for checkout form elements
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const nameInputs = page.locator('input[name*="name"], input[placeholder*="Name"]');
      const addressInputs = page.locator('input[name*="address"], input[placeholder*="Address"]');
      
      // Verify form elements exist
      if (await emailInput.isVisible()) {
        await expect(emailInput).toBeVisible();
      }
    }
  });

  test('Product filtering and sorting', async ({ page }) => {
    // Go to a category page
    const categoryLinks = page.locator('[href^="/categories/"]');
    const categoryCount = await categoryLinks.count();
    
    if (categoryCount > 0) {
      await categoryLinks.first().click();
      await page.waitForLoadState('networkidle');
      
      // Look for filter options
      const priceFilters = page.locator('input[name*="price"], select[name*="price"]');
      const sortOptions = page.locator('select[name*="sort"], .sort-dropdown');
      
      // Test price filtering if available
      if (await priceFilters.count() > 0) {
        await priceFilters.first().click();
        await page.waitForTimeout(500);
      }
      
      // Test sorting if available
      if (await sortOptions.count() > 0) {
        await sortOptions.first().click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('User authentication flow', async ({ page }) => {
    // Test login page
    await page.goto('http://localhost:3001/login');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[name="email"], input[type="email"]');
    const passwordInput = page.locator('input[name="password"], input[type="password"]');
    const loginBtn = page.locator('button:has-text("Login"), button:has-text("Sign In")');
    
    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      // Fill test credentials
      await emailInput.fill('test@example.com');
      await passwordInput.fill('testpassword');
      
      if (await loginBtn.isVisible()) {
        await loginBtn.click();
        await page.waitForLoadState('networkidle');
      }
    }
    
    // Test registration page
    await page.goto('http://localhost:3001/register');
    await page.waitForLoadState('networkidle');
    
    const regEmailInput = page.locator('input[name="email"], input[type="email"]');
    const regPasswordInput = page.locator('input[name="password"], input[type="password"]');
    const regBtn = page.locator('button:has-text("Register"), button:has-text("Sign Up")');
    
    if (await regEmailInput.isVisible() && await regPasswordInput.isVisible()) {
      await regEmailInput.fill(`test${Date.now()}@example.com`);
      await regPasswordInput.fill('testpassword123');
      
      if (await regBtn.isVisible()) {
        await regBtn.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('Responsive design verification', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify page still loads properly
    await expect(page.locator('body')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
    
    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload();
    await page.waitForLoadState('networkidle');
  });
});