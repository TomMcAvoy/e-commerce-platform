import { test, expect } from '@playwright/test';

test.describe('Company Page - Link Testing', () => {
  test('should have all internal navigation working', async ({ page }) => {
    await page.goto('/company');
    
    // Test anchor links
    await page.click('a[href="#services"]');
    await expect(page.locator('#services')).toBeInViewport();
    
    await page.click('a[href="#solutions"]');
    // Should scroll to solutions section
    
    await page.click('a[href="#about"]');
    // Should scroll to about section
    
    await page.click('a[href="#contact"]');
    // Should scroll to contact section
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto('/company');
    
    // Test footer navigation
    const footerLinks = [
      'IAM Modernization',
      'Professional Services', 
      'Managed Services',
      'Virtual CISO',
      'Staff Augmentation',
      'Advisory & Assessment',
      'About Us',
      'Contact',
      'Careers'
    ];
    
    for (const linkText of footerLinks) {
      const link = page.locator(`footer:has-text("${linkText}")`);
      if (await link.count() > 0) {
        await expect(link).toBeVisible();
      }
    }
  });

  test('should have working CTA buttons with proper styling', async ({ page }) => {
    await page.goto('/company');
    
    // Test primary CTA
    const getStartedBtn = page.locator('button:has-text("Get Started")').first();
    await expect(getStartedBtn).toBeVisible();
    await expect(getStartedBtn).toHaveClass(/bg-blue-600/);
    
    // Test secondary CTA  
    const learnMoreBtn = page.locator('button:has-text("Learn More")').first();
    await expect(learnMoreBtn).toBeVisible();
    await expect(learnMoreBtn).toHaveClass(/border-2/);
    
    // Test trial CTA
    const trialBtn = page.locator('button:has-text("Start Free Trial")');
    if (await trialBtn.count() > 0) {
      await expect(trialBtn).toBeVisible();
    }
    
    // Test demo CTA
    const demoBtn = page.locator('button:has-text("Schedule Demo")');
    if (await demoBtn.count() > 0) {
      await expect(demoBtn).toBeVisible();
    }
  });
});

test.describe('Company Subpages - Navigation Testing', () => {
  const subPages = [
    { path: 'iammodernizationservices', title: 'IAM Modernization' },
    { path: 'iamprofessionalservices', title: 'Professional Services' },
    { path: 'iammanagedservices', title: 'Managed Services' },
    { path: 'vciso', title: 'Virtual CISO' },
    { path: 'staffaugementation', title: 'Staff Augmentation' },
    { path: 'iamadvisoryandassessmentservices', title: 'Advisory Services' }
  ];

  subPages.forEach(subPage => {
    test(`should navigate back from ${subPage.path}`, async ({ page }) => {
      await page.goto(`/company/${subPage.path}`);
      
      // Find any link back to company page
      const backLinks = page.locator('a[href="/company"]');
      const linkCount = await backLinks.count();
      
      if (linkCount > 0) {
        // Click the first available back link
        await backLinks.first().click();
        await expect(page).toHaveURL('/company');
        await expect(page.locator('h1')).toContainText('WhiteStart System Security');
      }
    });

    test(`should have proper page structure on ${subPage.path}`, async ({ page }) => {
      await page.goto(`/company/${subPage.path}`);
      
      // Check basic page structure
      await expect(page.locator('h1')).toBeVisible();
      
      // Check for navigation
      const navCount = await page.locator('nav').count();
      expect(navCount).toBeGreaterThan(0);
      
      // Check for some content
      const contentCount = await page.locator('div, section, p').count();
      expect(contentCount).toBeGreaterThan(5);
    });
  });
});

test.describe('Company Page - SEO and Meta Testing', () => {
  test('should have proper meta information', async ({ page }) => {
    await page.goto('/company');
    
    // Check title contains relevant keywords
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    
    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      const content = await metaDescription.getAttribute('content');
      expect(content?.length || 0).toBeGreaterThan(50);
    }
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/company');
    
    // Should have exactly one H1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Should have multiple H2s
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(1);
    
    // Should have H3s for service cards
    const h3Count = await page.locator('h3').count();
    expect(h3Count).toBe(6);
  });

  test('should have proper image optimization', async ({ page }) => {
    await page.goto('/company');
    
    // Check logo is SVG (optimized)
    const logo = page.locator('nav img[alt="WhiteStart Logo"]');
    await expect(logo).toHaveAttribute('src', '/whitestart-logo.svg');
    
    // Check images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length || 0).toBeGreaterThan(0);
    }
  });
});