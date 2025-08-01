import { Page, expect } from '@playwright/test';

export class NewFeaturesTestUtils {
  constructor(private page: Page) {}

  // ERP System utilities
  async navigateToERP() {
    await this.page.goto('/erp');
    await expect(this.page.locator('h1')).toContainText('ERP Dashboard');
  }

  async clickERPModule(moduleName: string) {
    await this.page.click(`text=${moduleName}`);
  }

  async verifyERPMetrics() {
    await expect(this.page.locator('text=Total Revenue')).toBeVisible();
    await expect(this.page.locator('text=Active Users')).toBeVisible();
    await expect(this.page.locator('text=Transactions')).toBeVisible();
    await expect(this.page.locator('text=Efficiency')).toBeVisible();
  }

  // Social Platform utilities
  async navigateToSocial() {
    await this.page.goto('/social');
    await expect(this.page.locator('h1')).toContainText('Community Discussions');
  }

  async verifySafetyFeatures() {
    await expect(this.page.locator('text=Protected & Moderated')).toBeVisible();
    await expect(this.page.locator('text=Community Safety Guidelines')).toBeVisible();
  }

  async joinSocialCategory(categoryName: string) {
    await this.page.click(`text=${categoryName} >> .. >> text=Join Discussion`);
  }

  // International Shopping utilities
  async navigateToInternational() {
    await this.page.goto('/international');
    await expect(this.page.locator('h1')).toContainText('International Security Solutions');
  }

  async verifyCountrySupport(countries: string[]) {
    for (const country of countries) {
      await expect(this.page.locator(`text=${country}`)).toBeVisible();
    }
  }

  async selectCountry(countryName: string) {
    await this.page.click(`text=Shop ${countryName} Products`);
  }

  // News System utilities
  async navigateToNews() {
    await this.page.goto('/news');
  }

  async filterNewsByCategory(category: string) {
    await this.page.click(`text=${category}`);
    await expect(this.page).toHaveURL(new RegExp(`category=${category.toLowerCase()}`));
  }

  async verifyNewsArticles() {
    await expect(this.page.locator('[data-testid="news-article"]').first()).toBeVisible();
  }

  // API Testing utilities
  async testAPIEndpoint(endpoint: string, expectedStatus: number = 200) {
    const response = await this.page.request.get(endpoint);
    expect(response.status()).toBe(expectedStatus);
    return response;
  }

  async testAuthenticatedEndpoint(endpoint: string, data: any) {
    const response = await this.page.request.post(endpoint, { data });
    return response;
  }

  // Performance utilities
  async measurePageLoadTime(url: string): Promise<number> {
    const startTime = Date.now();
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
    return Date.now() - startTime;
  }

  async measureCoreWebVitals() {
    return await this.page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: any = {};
        
        // Measure LCP
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Measure FID (if available)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            vitals.fid = entry.processingStart - entry.startTime;
          });
        }).observe({ entryTypes: ['first-input'] });
        
        setTimeout(() => resolve(vitals), 1000);
      });
    });
  }

  // Responsive design utilities
  async testResponsiveBreakpoints(url: string) {
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    const results = [];
    
    for (const breakpoint of breakpoints) {
      await this.page.setViewportSize({ 
        width: breakpoint.width, 
        height: breakpoint.height 
      });
      
      await this.page.goto(url);
      
      // Check if main content is visible
      const isContentVisible = await this.page.locator('main, [role="main"], h1').first().isVisible();
      
      results.push({
        breakpoint: breakpoint.name,
        width: breakpoint.width,
        contentVisible: isContentVisible
      });
    }
    
    return results;
  }

  // Common assertions
  async assertPageLoadsWithinBudget(url: string, budgetMs: number) {
    const loadTime = await this.measurePageLoadTime(url);
    expect(loadTime).toBeLessThan(budgetMs);
  }

  async assertElementsVisible(selectors: string[]) {
    for (const selector of selectors) {
      await expect(this.page.locator(selector)).toBeVisible();
    }
  }

  async assertTextsVisible(texts: string[]) {
    for (const text of texts) {
      await expect(this.page.locator(`text=${text}`)).toBeVisible();
    }
  }
}