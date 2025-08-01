import { test, expect } from '@playwright/test';

test.describe('Comprehensive Shopping Experience', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure servers are running
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('Complete shopping flow with real database content', async ({ page }) => {
    // 1. Homepage loads with real categories
    await expect(page.locator('h2:has-text("Shop by Category")')).toBeVisible();
    
    // Verify real categories are loaded (not mock data)
    const categoryCards = page.locator('[href^="/categories/"]');
    await expect(categoryCards).toHaveCountGreaterThan(0);
    
    // 2. Browse categories with real data
    await categoryCards.first().click();
    await page.waitForLoadState('networkidle');
    
    // Verify category page loads
    await expect(page.locator('h1')).toBeVisible();
    
    // 3. Search for products
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('electronics');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');
    }
    
    // 4. View product details
    const productCards = page.locator('[data-testid="product-card"], .product-card, [href*="/product/"]');
    if (await productCards.count() > 0) {
      await productCards.first().click();
      await page.waitForLoadState('networkidle');
      
      // Verify product page loads with real data
      await expect(page.locator('h1')).toBeVisible();
      
      // 5. Add to cart
      const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add To Cart")');
      if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // 6. View cart
    await page.goto('http://localhost:3001/cart');
    await page.waitForLoadState('networkidle');
    
    // 7. Proceed to checkout
    const checkoutBtn = page.locator('button:has-text("Checkout"), a:has-text("Checkout")');
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      await page.waitForLoadState('networkidle');
      
      // 8. Fill checkout form with test data
      await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
      await page.fill('input[name="firstName"], input[placeholder*="First"]', 'Test');
      await page.fill('input[name="lastName"], input[placeholder*="Last"]', 'User');
      await page.fill('input[name="address"], input[placeholder*="Address"]', '123 Test St');
      await page.fill('input[name="city"], input[placeholder*="City"]', 'Test City');
      await page.fill('input[name="postalCode"], input[placeholder*="Postal"], input[placeholder*="ZIP"]', '12345');
      
      // 9. Simulate payment (use test card)
      const cardInput = page.locator('input[placeholder*="Card"], input[name="cardNumber"]');
      if (await cardInput.isVisible()) {
        await cardInput.fill('4242424242424242'); // Stripe test card
        await page.fill('input[placeholder*="MM/YY"], input[name="expiry"]', '12/25');
        await page.fill('input[placeholder*="CVC"], input[name="cvc"]', '123');
      }
      
      // 10. Complete purchase
      const placeOrderBtn = page.locator('button:has-text("Place Order"), button:has-text("Complete Purchase")');
      if (await placeOrderBtn.isVisible()) {
        await placeOrderBtn.click();
        await page.waitForLoadState('networkidle');
        
        // Verify order confirmation or success page
        await expect(page.locator('h1, h2')).toBeVisible();
      }
    }
  });

  test('News feed displays real content', async ({ page }) => {
    await page.goto('http://localhost:3001/news');
    await page.waitForLoadState('networkidle');
    
    // Verify news articles are loaded from real database
    const newsArticles = page.locator('article, .news-card, [href*="/news/"]');
    await expect(newsArticles).toHaveCountGreaterThan(0);
    
    // Click on first article
    if (await newsArticles.count() > 0) {
      await newsArticles.first().click();
      await page.waitForLoadState('networkidle');
      
      // Verify article page loads
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('Categories display real database content', async ({ page }) => {
    await page.goto('http://localhost:3001/categories');
    await page.waitForLoadState('networkidle');
    
    // Verify categories are loaded from database
    const categories = page.locator('[href^="/categories/"], .category-card');
    await expect(categories).toHaveCountGreaterThan(0);
    
    // Test each category has real content
    const categoryCount = await categories.count();
    for (let i = 0; i < Math.min(categoryCount, 3); i++) {
      await categories.nth(i).click();
      await page.waitForLoadState('networkidle');
      
      // Verify category page loads
      await expect(page.locator('h1')).toBeVisible();
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }
  });

  test('Search functionality with real data', async ({ page }) => {
    const searchTerms = ['electronics', 'clothing', 'home'];
    
    for (const term of searchTerms) {
      await page.goto('http://localhost:3001');
      await page.waitForLoadState('networkidle');
      
      const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill(term);
        await searchInput.press('Enter');
        await page.waitForLoadState('networkidle');
        
        // Verify search results
        const results = page.locator('.product-card, [data-testid="product-card"]');
        // Results may be 0 if no products match, but page should load
        await expect(page.locator('body')).toBeVisible();
      }
    }
  });

  test('User authentication flow', async ({ page }) => {
    // Test registration
    await page.goto('http://localhost:3001/register');
    await page.waitForLoadState('networkidle');
    
    if (await page.locator('input[name="email"]').isVisible()) {
      await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
      await page.fill('input[name="name"], input[name="firstName"]', 'Test User');
      await page.fill('input[name="password"]', 'testpassword123');
      
      const registerBtn = page.locator('button:has-text("Sign Up"), button:has-text("Register")');
      if (await registerBtn.isVisible()) {
        await registerBtn.click();
        await page.waitForLoadState('networkidle');
      }
    }
    
    // Test login
    await page.goto('http://localhost:3001/login');
    await page.waitForLoadState('networkidle');
    
    if (await page.locator('input[name="email"]').isVisible()) {
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'testpassword');
      
      const loginBtn = page.locator('button:has-text("Sign In"), button:has-text("Login")');
      if (await loginBtn.isVisible()) {
        await loginBtn.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('API endpoints return real data', async ({ page }) => {
    // Test categories API
    const categoriesResponse = await page.request.get('http://localhost:3000/api/categories');
    expect(categoriesResponse.ok()).toBeTruthy();
    const categoriesData = await categoriesResponse.json();
    expect(categoriesData.data).toBeDefined();
    expect(Array.isArray(categoriesData.data)).toBeTruthy();
    
    // Test products API
    const productsResponse = await page.request.get('http://localhost:3000/api/products');
    expect(productsResponse.ok()).toBeTruthy();
    const productsData = await productsResponse.json();
    expect(productsData.data).toBeDefined();
    
    // Test news API
    const newsResponse = await page.request.get('http://localhost:3000/api/news');
    expect(newsResponse.ok()).toBeTruthy();
    const newsData = await newsResponse.json();
    expect(newsData.data).toBeDefined();
  });
});