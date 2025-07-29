import { test, expect } from '@playwright/test';

test.describe('Company Pages - Comprehensive Link Testing', () => {
  test.describe('Main Company Page Links', () => {
    test('should have all service card links working', async ({ page }) => {
      await page.goto('/company');
      
      const serviceLinks = [
        { href: '/company/iam-modernization', text: 'IAM Modernization' },
        { href: '/company/professional-services', text: 'Professional Services' },
        { href: '/company/managed-services', text: 'Managed Services' },
        { href: '/company/virtual-ciso', text: 'Virtual CISO' },
        { href: '/company/staff-augmentation', text: 'Staff Augmentation' },
        { href: '/company/advisory-assessment', text: 'Advisory & Assessment' },
        { href: '/company/devsecops', text: 'DevSecOps Infrastructure' }
      ];

      for (const service of serviceLinks) {
        const link = page.locator(`a[href="${service.href}"]`);
        await expect(link).toBeVisible();
        
        // Test navigation
        await link.click();
        await expect(page).toHaveURL(service.href);
        await expect(page.locator('h1')).toBeVisible();
        
        // Go back to main company page
        await page.goBack();
        await expect(page).toHaveURL('/company');
      }
    });

    test('should have working navigation links', async ({ page }) => {
      await page.goto('/company');
      
      const navLinks = [
        { href: '/company/about', text: 'About' },
        { href: '/company/contact', text: 'Contact' }
      ];

      for (const navLink of navLinks) {
        const link = page.locator(`nav a[href="${navLink.href}"]`);
        await expect(link).toBeVisible();
      }
    });
  });

  test.describe('DevSecOps Page Cloud Links', () => {
    test('should have all cloud architecture links working', async ({ page }) => {
      await page.goto('/company/devsecops');
      
      const cloudLinks = [
        { href: '/company/aws-architecture', text: 'AWS DevSecOps' },
        { href: '/company/azure-architecture', text: 'Azure DevSecOps' },
        { href: '/company/gcp-architecture', text: 'Google Cloud DevSecOps' },
        { href: '/company/oci-architecture', text: 'Oracle OCI DevSecOps' },
        { href: '/company/openstack-architecture', text: 'OpenStack Private Cloud' },
        { href: '/company/openshift-architecture', text: 'Red Hat OpenShift' }
      ];

      for (const cloudLink of cloudLinks) {
        const link = page.locator(`a[href="${cloudLink.href}"]`);
        await expect(link).toBeVisible();
        
        // Test navigation to cloud page
        await link.click();
        await expect(page).toHaveURL(cloudLink.href);
        await expect(page.locator('h1')).toBeVisible();
        
        // Test back link to DevSecOps
        const backLink = page.locator('a[href="/company/devsecops"]').first();
        await expect(backLink).toBeVisible();
        await backLink.click();
        await expect(page).toHaveURL('/company/devsecops');
      }
    });

    test('should have contact links working', async ({ page }) => {
      await page.goto('/company/devsecops');
      
      const contactLinks = page.locator('a[href="/company/contact"]');
      const contactCount = await contactLinks.count();
      expect(contactCount).toBeGreaterThan(0);
      
      // Test first contact link
      await contactLinks.first().click();
      await expect(page).toHaveURL('/company/contact');
      await expect(page.locator('h1')).toContainText('Contact');
    });
  });

  test.describe('Cloud Architecture Pages Return Links', () => {
    const cloudPages = [
      { slug: 'aws-architecture', name: 'AWS' },
      { slug: 'azure-architecture', name: 'Azure' },
      { slug: 'gcp-architecture', name: 'GCP' },
      { slug: 'oci-architecture', name: 'OCI' },
      { slug: 'openstack-architecture', name: 'OpenStack' },
      { slug: 'openshift-architecture', name: 'OpenShift' }
    ];

    cloudPages.forEach(cloud => {
      test(`should have working return links on ${cloud.name} page`, async ({ page }) => {
        await page.goto(`/company/${cloud.slug}`);
        
        // Test back to DevSecOps link
        const backToDevSecOps = page.locator('a[href="/company/devsecops"]').first();
        await expect(backToDevSecOps).toBeVisible();
        await backToDevSecOps.click();
        await expect(page).toHaveURL('/company/devsecops');
        
        // Go back to cloud page
        await page.goBack();
        
        // Test contact links
        const contactLinks = page.locator('a[href="/company/contact"]');
        const contactCount = await contactLinks.count();
        expect(contactCount).toBeGreaterThan(0);
        
        await contactLinks.first().click();
        await expect(page).toHaveURL('/company/contact');
        await expect(page.locator('h1')).toContainText('Contact');
      });
    });
  });

  test.describe('Service Pages Navigation', () => {
    const servicePages = [
      'iam-modernization',
      'professional-services',
      'managed-services',
      'virtual-ciso',
      'staff-augmentation',
      'advisory-assessment'
    ];

    servicePages.forEach(service => {
      test(`should have working navigation on ${service} page`, async ({ page }) => {
        await page.goto(`/company/${service}`);
        
        // Test back to company link
        const backLinks = page.locator('a[href="/company"]');
        const backCount = await backLinks.count();
        expect(backCount).toBeGreaterThan(0);
        
        await backLinks.first().click();
        await expect(page).toHaveURL('/company');
        
        // Go back to service page
        await page.goBack();
        
        // Test contact links
        const contactLinks = page.locator('a[href="/company/contact"]');
        const contactCount = await contactLinks.count();
        expect(contactCount).toBeGreaterThan(0);
        
        await contactLinks.first().click();
        await expect(page).toHaveURL('/company/contact');
      });
    });
  });

  test.describe('Contact Page Links', () => {
    test('should have working navigation from contact page', async ({ page }) => {
      await page.goto('/company/contact');
      
      // Test back to company link
      const backLink = page.locator('a[href="/company"]').first();
      await expect(backLink).toBeVisible();
      await backLink.click();
      await expect(page).toHaveURL('/company');
    });

    test('should have working form submission', async ({ page }) => {
      await page.goto('/company/contact');
      
      // Fill out form
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('textarea[name="message"]', 'Test message');
      
      // Submit form
      page.on('dialog', dialog => dialog.accept());
      await page.click('button[type="submit"]');
    });
  });

  test.describe('Cross-Page Navigation Flow', () => {
    test('should navigate through complete service flow', async ({ page }) => {
      // Start at main company page
      await page.goto('/company');
      await expect(page.locator('h1')).toContainText('WhiteStart System Security');
      
      // Go to DevSecOps
      await page.click('a[href="/company/devsecops"]');
      await expect(page).toHaveURL('/company/devsecops');
      await expect(page.locator('h1')).toContainText('DevSecOps Infrastructure');
      
      // Go to AWS architecture
      await page.click('a[href="/company/aws-architecture"]');
      await expect(page).toHaveURL('/company/aws-architecture');
      await expect(page.locator('h1')).toContainText('Amazon Web Services');
      
      // Go to contact
      await page.click('a[href="/company/contact"]');
      await expect(page).toHaveURL('/company/contact');
      await expect(page.locator('h1')).toContainText('Contact');
      
      // Return to company
      await page.click('a[href="/company"]');
      await expect(page).toHaveURL('/company');
    });

    test('should navigate through all cloud architectures', async ({ page }) => {
      await page.goto('/company/devsecops');
      
      const cloudFlow = [
        { href: '/company/aws-architecture', name: 'Amazon Web Services' },
        { href: '/company/azure-architecture', name: 'Microsoft Azure' },
        { href: '/company/gcp-architecture', name: 'Google Cloud Platform' },
        { href: '/company/oci-architecture', name: 'Oracle Cloud Infrastructure' },
        { href: '/company/openstack-architecture', name: 'OpenStack Private Cloud' },
        { href: '/company/openshift-architecture', name: 'Red Hat OpenShift' }
      ];

      for (const cloud of cloudFlow) {
        // Go to cloud page
        await page.click(`a[href="${cloud.href}"]`);
        await expect(page).toHaveURL(cloud.href);
        await expect(page.locator('h1')).toContainText(cloud.name);
        
        // Return to DevSecOps
        await page.click('a[href="/company/devsecops"]');
        await expect(page).toHaveURL('/company/devsecops');
      }
    });
  });

  test.describe('Footer Links Testing', () => {
    test('should have working footer links on company pages', async ({ page }) => {
      const companyPages = [
        '/company',
        '/company/devsecops',
        '/company/aws-architecture',
        '/company/contact'
      ];

      for (const pagePath of companyPages) {
        await page.goto(pagePath);
        
        // Check footer exists
        await expect(page.locator('footer')).toBeVisible();
        
        // Check footer has company branding
        const footerText = await page.locator('footer').textContent();
        expect(footerText).toContain('WhiteStart');
      }
    });
  });

  test.describe('Logo and Branding Links', () => {
    test('should have working logo links across all pages', async ({ page }) => {
      const pages = [
        '/company',
        '/company/devsecops',
        '/company/aws-architecture',
        '/company/iam-modernization',
        '/company/contact'
      ];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        
        // Check logo exists and is clickable
        const logo = page.locator('img[alt="WhiteStart Logo"]').first();
        await expect(logo).toBeVisible();
        
        // Check logo parent is a link (for pages that link back)
        const logoLink = page.locator('a').filter({ has: page.locator('img[alt="WhiteStart Logo"]') }).first();
        if (await logoLink.count() > 0) {
          const href = await logoLink.getAttribute('href');
          expect(href).toBeTruthy();
        }
      }
    });
  });
});