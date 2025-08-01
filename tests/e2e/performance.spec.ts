import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load ERP dashboard within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/erp');
    await expect(page.locator('h1')).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // 3 second budget
  });

  test('should load social platform efficiently', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/social');
    await expect(page.locator('h1')).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2500);
  });

  test('should load international page with images efficiently', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/international');
    await expect(page.locator('h1')).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(4000); // Higher budget due to images
  });

  test('should handle large news feeds efficiently', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/news');
    await expect(page.locator('[data-testid="news-article"]').first()).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('should measure Core Web Vitals', async ({ page }) => {
    await page.goto('/erp');
    
    // Measure Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    expect(lcp).toBeLessThan(2500); // Good LCP threshold
  });
});