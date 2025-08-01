import { test, expect } from '@playwright/test';

test.describe('International Shopping', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/international');
  });

  test('should display international shopping hero', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('International Security Solutions');
    await expect(page.locator('text=Shop security products from trusted vendors')).toBeVisible();
  });

  test('should show all supported countries', async ({ page }) => {
    const countries = ['United States', 'Canada', 'United Kingdom', 'Scotland'];
    
    for (const country of countries) {
      await expect(page.locator(`text=${country}`)).toBeVisible();
    }
  });

  test('should display country flags and quick navigation', async ({ page }) => {
    await expect(page.locator('text=🇺🇸')).toBeVisible();
    await expect(page.locator('text=🇨🇦')).toBeVisible();
    await expect(page.locator('text=🇬🇧')).toBeVisible();
    await expect(page.locator('text=🏴󠁧󠁢󠁳󠁣󠁴󠁿')).toBeVisible();
  });

  test('should show shipping benefits', async ({ page }) => {
    await expect(page.locator('text=International Shipping')).toBeVisible();
    await expect(page.locator('text=Local Compliance')).toBeVisible();
    await expect(page.locator('text=Multi-Currency')).toBeVisible();
  });

  test('should display country-specific information', async ({ page }) => {
    // Check USA section
    await expect(page.locator('text=1245 products from 12 vendors')).toBeVisible();
    await expect(page.locator('text=Next-day delivery in most states')).toBeVisible();
    
    // Check Canada section
    await expect(page.locator('text=876 products from 8 vendors')).toBeVisible();
    await expect(page.locator('text=Weather-resistant equipment')).toBeVisible();
  });

  test('should show currency and shipping information', async ({ page }) => {
    await expect(page.locator('text=USD')).toBeVisible();
    await expect(page.locator('text=CAD')).toBeVisible();
    await expect(page.locator('text=GBP')).toBeVisible();
    await expect(page.locator('text=1-3 business days')).toBeVisible();
  });

  test('should display shipping policies', async ({ page }) => {
    await expect(page.locator('text=International Shipping Information')).toBeVisible();
    await expect(page.locator('text=Secure packaging with tamper-evident seals')).toBeVisible();
    await expect(page.locator('text=30-day international return policy')).toBeVisible();
  });

  test('should navigate to country-specific pages', async ({ page }) => {
    await page.click('text=Shop United States Products');
    await expect(page).toHaveURL('/international/usa');
  });
});