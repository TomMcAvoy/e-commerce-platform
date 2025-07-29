import { test, expect } from '@playwright/test';

test.describe('Debug Tests', () => {
  test('debug login page content', async ({ page }) => {
    await page.goto('/login');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Get page content
    const content = await page.content();
    console.log('Page title:', await page.title());
    console.log('Page URL:', page.url());
    
    // Check for various input selectors
    const emailInput1 = page.locator('input[name="email"]');
    const emailInput2 = page.locator('input[type="email"]');
    const emailInput3 = page.locator('#email');
    
    console.log('Email input by name exists:', await emailInput1.count());
    console.log('Email input by type exists:', await emailInput2.count());
    console.log('Email input by id exists:', await emailInput3.count());
    
    // Check if there's any form
    const forms = page.locator('form');
    console.log('Forms found:', await forms.count());
    
    // Check for any inputs
    const allInputs = page.locator('input');
    console.log('Total inputs found:', await allInputs.count());
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'login-debug.png' });
  });
});