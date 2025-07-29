import { test, expect } from '@playwright/test';

test.describe('Debug Products Page', () => {
  test('debug products page content', async ({ page }) => {
    await page.goto('/products');
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    console.log('Page title:', await page.title());
    console.log('Page URL:', page.url());
    
    // Check for error messages
    const errorMessage = page.locator('text=Failed to load products');
    console.log('Error message exists:', await errorMessage.count());
    
    // Check for "No Products Found" message
    const noProducts = page.locator('text=No Products Found');
    console.log('No products message exists:', await noProducts.count());
    
    // Check for product cards
    const productCards = page.locator('[data-testid="product-card"]');
    console.log('Product cards found:', await productCards.count());
    
    // Check for any divs that might contain products
    const productGrids = page.locator('.grid');
    console.log('Grid containers found:', await productGrids.count());
    
    // Get page content to see what's actually rendered
    const content = await page.content();
    console.log('Page contains "All Products":', content.includes('All Products'));
    console.log('Page contains "Security Camera":', content.includes('Security Camera'));
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'products-debug.png' });
  });
});