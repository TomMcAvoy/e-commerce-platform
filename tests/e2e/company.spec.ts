import { test, expect } from '@playwright/test';

test.describe('Company Page', () => {
  test('should display company page with animations', async ({ page }) => {
    await page.goto('/company');
    
    await expect(page.locator('h1')).toContainText('WhiteStart System Security');
    await expect(page.locator('text=Custom Built IAM Solutions')).toBeVisible();
    
    // Check for key elements
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have working navigation to company page', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Company');
    await expect(page).toHaveURL('/company');
    await expect(page.locator('h1')).toContainText('WhiteStart System Security');
  });

  test('should display all service cards', async ({ page }) => {
    await page.goto('/company');
    
    await expect(page.locator('text=Our Solutions')).toBeVisible();
    await expect(page.locator('h3:has-text("IAM Modernization")')).toBeVisible();
    await expect(page.locator('h3:has-text("Professional Services")')).toBeVisible();
  });
});