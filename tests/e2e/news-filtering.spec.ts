import { test, expect } from '@playwright/test';

test.describe('News Filtering Tests', () => {
  test('should test all country filter buttons', async ({ page }) => {
    await page.goto('/news');
    
    // Test All Countries button
    await page.click('button:has-text("All Countries")');
    await page.waitForTimeout(1000);
    const allArticles = await page.locator('[data-testid="news-article"]').count();
    console.log(`All Countries: ${allArticles} articles`);
    
    // Test each country button
    const countries = ['United States', 'United Kingdom', 'Scotland', 'Canada', 'Australia'];
    
    for (const country of countries) {
      const button = page.locator(`button:has-text("${country}")`);
      if (await button.isVisible()) {
        await button.click();
        await page.waitForTimeout(1000);
        const count = await page.locator('[data-testid="news-article"]').count();
        console.log(`${country}: ${count} articles`);
        
        if (count === 0) {
          console.log(`⚠️  ${country} shows no articles`);
        }
      }
    }
  });

  test('should test all category filter buttons', async ({ page }) => {
    await page.goto('/news');
    
    // Test All Categories button
    await page.click('button:has-text("All Categories")');
    await page.waitForTimeout(1000);
    const allArticles = await page.locator('[data-testid="news-article"]').count();
    console.log(`All Categories: ${allArticles} articles`);
    
    // Test each category button
    const categories = ['Technology', 'Business', 'Politics', 'Sports', 'Health', 'Science', 'Entertainment'];
    
    for (const category of categories) {
      const button = page.locator(`button:has-text("${category}")`);
      if (await button.isVisible()) {
        await button.click();
        await page.waitForTimeout(1000);
        const count = await page.locator('[data-testid="news-article"]').count();
        console.log(`${category}: ${count} articles`);
        
        if (count === 0) {
          console.log(`⚠️  ${category} shows no articles`);
        }
      }
    }
  });

  test('should test combined country and category filtering', async ({ page }) => {
    await page.goto('/news');
    
    // Test USA + Sports combination
    await page.click('button:has-text("United States")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Sports")');
    await page.waitForTimeout(1000);
    const usaSports = await page.locator('[data-testid="news-article"]').count();
    console.log(`USA + Sports: ${usaSports} articles`);
    
    // Test UK + Technology combination
    await page.click('button:has-text("United Kingdom")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Technology")');
    await page.waitForTimeout(1000);
    const ukTech = await page.locator('[data-testid="news-article"]').count();
    console.log(`UK + Technology: ${ukTech} articles`);
  });
});