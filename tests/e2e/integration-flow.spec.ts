import { test, expect } from '@playwright/test';
import { NewFeaturesTestUtils } from './helpers/new-features-utils';

test.describe('New Features Integration Flow', () => {
  let utils: NewFeaturesTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new NewFeaturesTestUtils(page);
  });

  test('should navigate between all new features seamlessly', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    
    // Navigate to ERP system
    await page.click('text=ERP');
    await utils.verifyERPMetrics();
    
    // Navigate to Social platform
    await page.click('text=Social');
    await utils.verifySafetyFeatures();
    
    // Navigate to International shopping
    await page.click('text=International');
    await utils.verifyCountrySupport(['United States', 'Canada', 'United Kingdom', 'Scotland']);
    
    // Navigate to News
    await page.click('text=News');
    await utils.verifyNewsArticles();
  });

  test('should maintain consistent branding across new features', async ({ page }) => {
    const pages = ['/erp', '/social', '/international', '/news'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Check for consistent logo/branding
      await expect(page.locator('img[alt*="WhiteStart"], img[alt*="Whitestart"]')).toBeVisible();
      
      // Check for consistent navigation
      await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
    }
  });

  test('should handle user authentication across new features', async ({ page }) => {
    // Test that protected features require authentication
    const protectedEndpoints = [
      '/api/social/posts',
      '/api/erp/dashboard',
      '/api/user/profile'
    ];
    
    for (const endpoint of protectedEndpoints) {
      const response = await page.request.post(endpoint, {
        data: { test: 'data' }
      });
      expect(response.status()).toBe(401);
    }
  });

  test('should load all new features within performance budget', async ({ page }) => {
    const performanceBudgets = {
      '/erp': 3000,
      '/social': 2500,
      '/international': 4000,
      '/news': 3000
    };
    
    for (const [url, budget] of Object.entries(performanceBudgets)) {
      await utils.assertPageLoadsWithinBudget(url, budget);
    }
  });

  test('should work responsively across all new features', async ({ page }) => {
    const newFeaturePages = ['/erp', '/social', '/international', '/news'];
    
    for (const pagePath of newFeaturePages) {
      const results = await utils.testResponsiveBreakpoints(pagePath);
      
      // Assert all breakpoints show content
      for (const result of results) {
        expect(result.contentVisible).toBe(true);
      }
    }
  });

  test('should handle errors gracefully across new features', async ({ page }) => {
    // Test 404 pages for new features
    const invalidPages = [
      '/erp/invalid-module',
      '/social/invalid-category', 
      '/international/invalid-country',
      '/news/invalid-article'
    ];
    
    for (const invalidPage of invalidPages) {
      await page.goto(invalidPage);
      // Should show error page or redirect, not crash
      await expect(page.locator('text=404, text=Not Found, text=Error')).toBeVisible();
    }
  });

  test('should maintain accessibility standards', async ({ page }) => {
    const pages = ['/erp', '/social', '/international', '/news'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Check for proper heading structure
      await expect(page.locator('h1')).toBeVisible();
      
      // Check for proper navigation landmarks
      await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
      
      // Check for proper main content
      await expect(page.locator('main, [role="main"]')).toBeVisible();
    }
  });
});