import { test, expect } from '@playwright/test';

test.describe('ERP System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/erp');
  });

  test('should display ERP dashboard with modules', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('ERP Dashboard');
    
    // Check key metrics are displayed
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=$2.4M')).toBeVisible();
    await expect(page.locator('text=Active Users')).toBeVisible();
    await expect(page.locator('text=4,567')).toBeVisible();
  });

  test('should display all ERP modules', async ({ page }) => {
    const expectedModules = [
      'Financial Management',
      'Human Resources', 
      'Supply Chain',
      'Manufacturing',
      'Customer Relationship',
      'Project Management',
      'Procurement',
      'Risk Management'
    ];

    for (const module of expectedModules) {
      await expect(page.locator(`text=${module}`)).toBeVisible();
    }
  });

  test('should navigate to finance module', async ({ page }) => {
    await page.click('text=Financial Management');
    await expect(page).toHaveURL('/erp/finance');
  });

  test('should navigate to HR module', async ({ page }) => {
    await page.click('text=Human Resources');
    await expect(page).toHaveURL('/erp/hr');
  });

  test('should display recent activity', async ({ page }) => {
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    await expect(page.locator('text=Invoice #INV-2024-001 processed')).toBeVisible();
    await expect(page.locator('text=New employee onboarding completed')).toBeVisible();
  });

  test('should show module statistics', async ({ page }) => {
    // Check that modules show user counts and transaction data
    await expect(page.locator('text=1,234')).toBeVisible(); // Finance users
    await expect(page.locator('text=45.2K')).toBeVisible(); // Finance transactions
  });
});