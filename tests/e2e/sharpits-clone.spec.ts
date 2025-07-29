import { test, expect } from '@playwright/test';

test.describe('Sharpits Clone Page', () => {
  test('should display cloned sharpits page', async ({ page }) => {
    await page.goto('/sharpits-clone');
    
    await expect(page.locator('h1')).toContainText('Custom Built IAM Solutions');
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    await page.goto('/sharpits-clone');
    await expect(page).toHaveURL('/sharpits-clone');
  });

  test('should display services section', async ({ page }) => {
    await page.goto('/sharpits-clone');
    
    await expect(page.locator('text=Our Services')).toBeVisible();
    await expect(page.locator('h3:has-text("Identity Management")')).toBeVisible();
    await expect(page.locator('text=Access Management')).toBeVisible();
  });
});