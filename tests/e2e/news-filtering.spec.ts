import { test, expect } from '@playwright/test';

test.describe('News Filtering System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/news');
    await page.waitForLoadState('networkidle');
  });

  test('News page loads with country and category filters', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1:has-text("Latest News")')).toBeVisible();
    
    // Check country filter section
    await expect(page.locator('h3:has-text("Select Country")')).toBeVisible();
    
    // Check category filter section  
    await expect(page.locator('h3:has-text("Select Category")')).toBeVisible();
    
    // Verify default selections
    await expect(page.locator('button:has-text("All Countries").bg-green-600')).toBeVisible();
    await expect(page.locator('button:has-text("General").bg-blue-600')).toBeVisible();
  });

  test('Country filter buttons work correctly', async ({ page }) => {
    // Test Scotland filter
    await page.click('button:has-text("Scotland")');
    await page.waitForLoadState('networkidle');
    
    // Verify Scotland is selected
    await expect(page.locator('button:has-text("Scotland").bg-green-600')).toBeVisible();
    
    // Test Canada filter
    await page.click('button:has-text("Canada")');
    await page.waitForLoadState('networkidle');
    
    // Verify Canada is selected
    await expect(page.locator('button:has-text("Canada").bg-green-600')).toBeVisible();
  });

  test('Category filter buttons work correctly', async ({ page }) => {
    // Test Entertainment category
    await page.click('button:has-text("Entertainment")');
    await page.waitForLoadState('networkidle');
    
    // Verify Entertainment is selected
    await expect(page.locator('button:has-text("Entertainment").bg-blue-600')).toBeVisible();
    
    // Test Technology category
    await page.click('button:has-text("Technology")');
    await page.waitForLoadState('networkidle');
    
    // Verify Technology is selected
    await expect(page.locator('button:has-text("Technology").bg-blue-600')).toBeVisible();
  });

  test('Combined filtering: Scotland + Entertainment', async ({ page }) => {
    // Select Scotland
    await page.click('button:has-text("Scotland")');
    await page.waitForTimeout(500);
    
    // Select Entertainment
    await page.click('button:has-text("Entertainment")');
    await page.waitForLoadState('networkidle');
    
    // Verify both filters are active
    await expect(page.locator('button:has-text("Scotland").bg-green-600')).toBeVisible();
    await expect(page.locator('button:has-text("Entertainment").bg-blue-600')).toBeVisible();
    
    // Check if Scottish entertainment news is displayed or no results message
    const newsGrid = page.locator('.grid');
    const noResults = page.locator('text=No news articles available');
    
    await expect(newsGrid.or(noResults)).toBeVisible();
  });

  test('Combined filtering: UK + Technology', async ({ page }) => {
    // Select UK
    await page.click('button:has-text("United Kingdom")');
    await page.waitForTimeout(500);
    
    // Select Technology
    await page.click('button:has-text("Technology")');
    await page.waitForLoadState('networkidle');
    
    // Verify both filters are active
    await expect(page.locator('button:has-text("United Kingdom").bg-green-600')).toBeVisible();
    await expect(page.locator('button:has-text("Technology").bg-blue-600')).toBeVisible();
  });

  test('Reset filters to show all news', async ({ page }) => {
    // Apply some filters first
    await page.click('button:has-text("Scotland")');
    await page.click('button:has-text("Entertainment")');
    await page.waitForTimeout(500);
    
    // Reset to all countries
    await page.click('button:has-text("All Countries")');
    await page.waitForTimeout(500);
    
    // Reset to general category
    await page.click('button:has-text("General")');
    await page.waitForLoadState('networkidle');
    
    // Verify reset state
    await expect(page.locator('button:has-text("All Countries").bg-green-600')).toBeVisible();
    await expect(page.locator('button:has-text("General").bg-blue-600')).toBeVisible();
  });

  test('News articles display correct metadata', async ({ page }) => {
    // Wait for any news articles to load
    await page.waitForTimeout(2000);
    
    const newsCards = page.locator('.bg-white.rounded-lg.shadow-md');
    const cardCount = await newsCards.count();
    
    if (cardCount > 0) {
      const firstCard = newsCards.first();
      
      // Check for title
      await expect(firstCard.locator('h3')).toBeVisible();
      
      // Check for category badge
      await expect(firstCard.locator('.bg-blue-100')).toBeVisible();
      
      // Check for date
      await expect(firstCard.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}/')).toBeVisible();
      
      // Check for source
      await expect(firstCard.locator('text=/By /')).toBeVisible();
    }
  });

  test('News article links work correctly', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    const readMoreLinks = page.locator('a:has-text("Read more")');
    const linkCount = await readMoreLinks.count();
    
    if (linkCount > 0) {
      // Check that read more links have proper attributes
      const firstLink = readMoreLinks.first();
      await expect(firstLink).toHaveAttribute('target', '_blank');
      await expect(firstLink).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });
});