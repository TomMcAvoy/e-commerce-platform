import { test, expect } from '@playwright/test';

test.describe('Company Page - Focused Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/company');
  });

  test('should display main page elements correctly', async ({ page }) => {
    // Header logo (first occurrence)
    await expect(page.locator('nav img[alt="WhiteStart Logo"]')).toBeVisible();
    
    // Hero section
    await expect(page.locator('h1')).toContainText('WhiteStart System Security');
    await expect(page.locator('text=Custom Built IAM Solutions')).toBeVisible();
    
    // CTA buttons
    await expect(page.locator('button:has-text("Get Started")')).toBeVisible();
    await expect(page.locator('button:has-text("Learn More")')).toBeVisible();
    
    // Services section
    await expect(page.locator('text=Our Solutions')).toBeVisible();
    
    // Footer
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have all 6 service cards', async ({ page }) => {
    const services = [
      'IAM Modernization',
      'Professional Services', 
      'Managed Services',
      'Virtual CISO',
      'Staff Augmentation',
      'Advisory & Assessment'
    ];

    for (const service of services) {
      await expect(page.locator(`h3:has-text("${service}")`)).toBeVisible();
    }
  });

  test('should have working navigation', async ({ page }) => {
    // Check navigation links exist
    await expect(page.locator('nav a[href="#services"]')).toBeVisible();
    await expect(page.locator('nav a[href="#solutions"]')).toBeVisible();
    await expect(page.locator('nav a[href="#about"]')).toBeVisible();
    await expect(page.locator('nav a[href="#contact"]')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.grid.md\\:grid-cols-2.lg\\:grid-cols-3')).toBeVisible();
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have proper footer structure', async ({ page }) => {
    await expect(page.locator('footer h4:has-text("Services")')).toBeVisible();
    await expect(page.locator('footer h4:has-text("Solutions")')).toBeVisible();
    await expect(page.locator('footer h4:has-text("Company")')).toBeVisible();
    
    // Check footer logo
    await expect(page.locator('footer img[alt="WhiteStart Logo"]')).toBeVisible();
  });

  test('should load images properly', async ({ page }) => {
    // Header logo
    await expect(page.locator('nav img[alt="WhiteStart Logo"]')).toHaveAttribute('src', '/whitestart-logo.svg');
    
    // Background image
    await expect(page.locator('img[alt="Background"]')).toBeVisible();
    
    // Technology image
    await expect(page.locator('img[alt="Technology"]')).toBeVisible();
  });

  test('should have working CTA buttons', async ({ page }) => {
    const getStartedBtn = page.locator('button:has-text("Get Started")').first();
    const learnMoreBtn = page.locator('button:has-text("Learn More")').first();
    
    await expect(getStartedBtn).toBeVisible();
    await expect(learnMoreBtn).toBeVisible();
    
    // Test hover states
    await getStartedBtn.hover();
    await learnMoreBtn.hover();
  });

  test('should have proper content structure', async ({ page }) => {
    // Check heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(0);
    
    const h3Count = await page.locator('h3').count();
    expect(h3Count).toBe(6); // 6 service cards
  });

  test('should have accessibility features', async ({ page }) => {
    // Check alt text on images
    await expect(page.locator('nav img[alt="WhiteStart Logo"]')).toBeVisible();
    await expect(page.locator('img[alt="Background"]')).toBeVisible();
    await expect(page.locator('img[alt="Technology"]')).toBeVisible();
    
    // Check button labels
    await expect(page.locator('button:has-text("Get Started")')).toBeVisible();
    await expect(page.locator('button:has-text("Learn More")')).toBeVisible();
  });

  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/company');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Company Subpages - Basic Testing', () => {
  const subPages = [
    'iammodernizationservices',
    'iamprofessionalservices', 
    'iammanagedservices',
    'vciso',
    'staffaugementation',
    'iamadvisoryandassessmentservices'
  ];

  subPages.forEach(subPage => {
    test(`should load ${subPage} subpage`, async ({ page }) => {
      await page.goto(`/company/${subPage}`);
      
      // Check basic structure exists
      await expect(page.locator('h1')).toBeVisible();
      
      // Check for navigation back to company
      const homeLinks = page.locator('a[href="/company"]');
      const linkCount = await homeLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    });

    test(`should have content on ${subPage}`, async ({ page }) => {
      await page.goto(`/company/${subPage}`);
      
      // Check for main heading
      await expect(page.locator('h1')).toBeVisible();
      
      // Check for some content (either h2 or div elements)
      const contentElements = page.locator('h2, div, section');
      const contentCount = await contentElements.count();
      expect(contentCount).toBeGreaterThan(0);
    });
  });
});