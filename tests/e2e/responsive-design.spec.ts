import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ];

  for (const viewport of viewports) {
    test.describe(`${viewport.name} viewport`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
      });

      test('should display ERP dashboard responsively', async ({ page }) => {
        await page.goto('/erp');
        await expect(page.locator('h1')).toBeVisible();
        
        // Check that modules are displayed appropriately for viewport
        const modules = page.locator('text=Financial Management');
        await expect(modules).toBeVisible();
      });

      test('should display social platform responsively', async ({ page }) => {
        await page.goto('/social');
        await expect(page.locator('h1')).toBeVisible();
        
        // Check that categories are accessible on all devices
        await expect(page.locator('text=Progressive Politics')).toBeVisible();
      });

      test('should display international page responsively', async ({ page }) => {
        await page.goto('/international');
        await expect(page.locator('h1')).toBeVisible();
        
        // Check that country sections are readable
        await expect(page.locator('text=United States')).toBeVisible();
      });

      test('should handle navigation menu on different screens', async ({ page }) => {
        await page.goto('/');
        
        if (viewport.width < 768) {
          // Mobile: check for hamburger menu
          await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
        } else {
          // Desktop/tablet: check for full navigation
          await expect(page.locator('nav')).toBeVisible();
        }
      });
    });
  }
});