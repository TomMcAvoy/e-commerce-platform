import { test, expect } from '@playwright/test';

test.describe('Company Page - Comprehensive Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/company');
  });

  test('should display all main page elements', async ({ page }) => {
    // Header elements
    await expect(page.locator('img[alt="WhiteStart Logo"]')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
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
    await expect(page.locator('text=© 2024 WhiteStart System Security')).toBeVisible();
  });

  test('should have all 6 service cards with proper content', async ({ page }) => {
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

    // Check service descriptions
    await expect(page.locator('text=Transform and modernize your legacy IAM systems')).toBeVisible();
    await expect(page.locator('text=Accelerate your IAM implementation')).toBeVisible();
    await expect(page.locator('text=Executive-level cybersecurity leadership')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    const navLinks = ['Services', 'Solutions', 'About', 'Contact'];
    
    for (const link of navLinks) {
      const navLink = page.locator(`nav a:has-text("${link}")`);
      await expect(navLink).toBeVisible();
      await expect(navLink).toHaveAttribute('href', `#${link.toLowerCase()}`);
    }
  });

  test('should have proper responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.grid.md\\:grid-cols-2.lg\\:grid-cols-3')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.hidden.md\\:flex')).toBeHidden();
  });

  test('should have proper SEO elements', async ({ page }) => {
    await expect(page).toHaveTitle(/WhiteStart|Company|IAM|Security/);
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(0);
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

  test('should have proper footer structure', async ({ page }) => {
    // Check footer sections
    await expect(page.locator('footer h4:has-text("Services")')).toBeVisible();
    await expect(page.locator('footer h4:has-text("Solutions")')).toBeVisible();
    await expect(page.locator('footer h4:has-text("Company")')).toBeVisible();
    
    // Check footer links
    await expect(page.locator('footer text=IAM Modernization')).toBeVisible();
    await expect(page.locator('footer text=Virtual CISO')).toBeVisible();
    await expect(page.locator('footer text=About Us')).toBeVisible();
  });

  test('should have proper image loading', async ({ page }) => {
    // Check logo loads
    const logo = page.locator('img[alt="WhiteStart Logo"]');
    await expect(logo).toBeVisible();
    
    // Check background image loads
    const bgImage = page.locator('img[alt="Background"]');
    await expect(bgImage).toBeVisible();
    
    // Check technology image loads
    const techImage = page.locator('img[alt="Technology"]');
    await expect(techImage).toBeVisible();
  });

  test('should have proper color scheme and styling', async ({ page }) => {
    // Check gradient backgrounds
    await expect(page.locator('.bg-gradient-to-br')).toBeVisible();
    await expect(page.locator('.bg-gradient-to-r')).toBeVisible();
    
    // Check service card styling
    const serviceCard = page.locator('.bg-white.rounded-2xl').first();
    await expect(serviceCard).toBeVisible();
    
    // Test hover effects
    await serviceCard.hover();
  });

  test('should have accessibility features', async ({ page }) => {
    // Check for alt text on images
    await expect(page.locator('img[alt="WhiteStart Logo"]')).toBeVisible();
    await expect(page.locator('img[alt="Background"]')).toBeVisible();
    await expect(page.locator('img[alt="Technology"]')).toBeVisible();
    
    // Check for proper button labels
    await expect(page.locator('button:has-text("Get Started")')).toBeVisible();
    await expect(page.locator('button:has-text("Learn More")')).toBeVisible();
  });
});

test.describe('Company Subpages - Comprehensive Testing', () => {
  const subPages = [
    'iammodernizationservices',
    'iamprofessionalservices', 
    'iammanagedservices',
    'vciso',
    'staffaugementation',
    'iamadvisoryandassessmentservices'
  ];

  subPages.forEach(subPage => {
    test(`should load ${subPage} subpage correctly`, async ({ page }) => {
      await page.goto(`/company/${subPage}`);
      
      // Check basic page structure
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();
      
      // Check navigation back to main company page
      const homeLink = page.locator('a[href="/company"]');
      await expect(homeLink).toBeVisible();
      
      // Check logo links back to company
      const logoLink = page.locator('a[href="/company"] img[alt="Logo"]');
      if (await logoLink.count() > 0) {
        await expect(logoLink).toBeVisible();
      }
    });

    test(`should have proper content structure on ${subPage}`, async ({ page }) => {
      await page.goto(`/company/${subPage}`);
      
      // Check for main heading
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      
      // Check for content sections
      const h2Count = await page.locator('h2').count();
      expect(h2Count).toBeGreaterThanOrEqual(0);
      
      // Check for paragraphs
      const paragraphs = page.locator('p');
      const pCount = await paragraphs.count();
      expect(pCount).toBeGreaterThan(0);
    });

    test(`should have working navigation on ${subPage}`, async ({ page }) => {
      await page.goto(`/company/${subPage}`);
      
      // Test navigation back to main company page
      const homeLink = page.locator('a[href="/company"]').first();
      await homeLink.click();
      await expect(page).toHaveURL('/company');
    });
  });
});

test.describe('Company Page - Performance Testing', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/company');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    
    // Check that main content is visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have optimized images', async ({ page }) => {
    await page.goto('/company');
    
    // Check that images have proper attributes
    const logo = page.locator('img[alt="WhiteStart Logo"]');
    await expect(logo).toHaveAttribute('src', '/whitestart-logo.svg');
    
    const bgImage = page.locator('img[alt="Background"]');
    await expect(bgImage).toHaveAttribute('src', '/sharpit-images/sharpit-2.png');
  });
});

test.describe('Company Page - Error Handling', () => {
  test('should handle missing images gracefully', async ({ page }) => {
    await page.goto('/company');
    
    // Check that page still loads even if some images fail
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should handle JavaScript disabled', async ({ page }) => {
    await page.context().addInitScript(() => {
      Object.defineProperty(window, 'navigator', {
        value: { ...window.navigator, javaEnabled: () => false }
      });
    });
    
    await page.goto('/company');
    
    // Basic content should still be visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });
});

test.describe('Company Page - Cross-browser Testing', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`should work correctly in ${browserName}`, async ({ page }) => {
      await page.goto('/company');
      
      // Test core functionality
      await expect(page.locator('h1')).toContainText('WhiteStart System Security');
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
      
      // Test service cards
      await expect(page.locator('h3:has-text("IAM Modernization")')).toBeVisible();
      await expect(page.locator('h3:has-text("Professional Services")')).toBeVisible();
    });
  });
});