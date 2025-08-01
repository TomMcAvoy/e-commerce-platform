import { test, expect } from '@playwright/test';

test.describe('Social Platform', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/social');
  });

  test('should display social categories with safety levels', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Community Discussions');
    
    // Check safety guidelines are visible
    await expect(page.locator('text=Community Safety Guidelines')).toBeVisible();
    await expect(page.locator('text=Age-Appropriate Content')).toBeVisible();
  });

  test('should display all social categories', async ({ page }) => {
    const expectedCategories = [
      'Progressive Politics',
      'Conservative Politics',
      'Centrist & Moderate Politics',
      'Breaking News',
      'Student Life & Education',
      'Teen Zone'
    ];

    for (const category of expectedCategories) {
      await expect(page.locator(`text=${category}`)).toBeVisible();
    }
  });

  test('should show safety badges for categories', async ({ page }) => {
    await expect(page.locator('text=Kid-Safe')).toBeVisible();
    await expect(page.locator('text=Teen-Friendly')).toBeVisible();
    await expect(page.locator('text=Adult Content')).toBeVisible();
  });

  test('should display member counts and active discussions', async ({ page }) => {
    // Check that categories show statistics
    await expect(page.locator('text=2,847 members')).toBeVisible();
    await expect(page.locator('text=156 active')).toBeVisible();
  });

  test('should navigate to specific category', async ({ page }) => {
    await page.click('text=Join Discussion >> nth=0');
    await expect(page).toHaveURL(/\/social\//);
  });

  test('should display safety features prominently', async ({ page }) => {
    await expect(page.locator('text=Protected & Moderated')).toBeVisible();
    await expect(page.locator('text=24/7 human and AI moderation')).toBeVisible();
    await expect(page.locator('text=Parental Controls')).toBeVisible();
  });
});