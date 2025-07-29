import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should register new user', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('[name="firstName"]', 'Test');
    await page.fill('[name="lastName"]', 'User');
    await page.fill('[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('[name="password"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    // Should redirect to account after successful registration
    await expect(page).toHaveURL(/\/account$/);
  });

  test('should login existing user', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'thomas.mcavoy@whitestartups.com');
    await page.fill('[name="password"]', 'AshenP3131m!');
    
    await page.click('button[type="submit"]');
    
    // Should redirect after successful login
    await expect(page).toHaveURL(/\/account$/);
  });

  test('should show error for invalid login', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'invalid@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});