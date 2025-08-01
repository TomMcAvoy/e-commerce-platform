import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: [
    'news-scheduler.spec.ts',
    'api-integration.spec.ts',
    'news-system.spec.ts',
    'erp-system.spec.ts',
    'social-platform.spec.ts', 
    'international-shopping.spec.ts',
    'responsive-design.spec.ts',
    'performance.spec.ts'
  ],
  fullyParallel: false, // Run sequentially - seeder must run first
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['html', { outputFolder: 'playwright-report-new-features' }],
    ['json', { outputFile: 'test-results-new-features.json' }],
    ['line']
  ],
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: [
    {
      command: 'pnpm run dev:server',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 120000
    },
    {
      command: 'pnpm run dev:frontend',
      port: 3001,
      reuseExistingServer: !process.env.CI,
      timeout: 120000
    },
  ],
});