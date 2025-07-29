import { test, expect } from '@playwright/test';

test.describe('DevSecOps Services - Comprehensive Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/company/devsecops');
  });

  test('should display DevSecOps main page elements', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('DevSecOps Infrastructure Services');
    await expect(page.locator('text=Enterprise-Grade Security-First')).toBeVisible();
    await expect(page.locator('text=Red Hat Enterprise Linux on Google Cloud')).toBeVisible();
    
    // Check for TOGAF compliance
    await expect(page.locator('text=TOGAF-Compliant Architecture')).toBeVisible();
    
    // Check for standards sections
    await expect(page.locator('text=North American Standards')).toBeVisible();
    await expect(page.locator('text=European Standards')).toBeVisible();
    await expect(page.locator('text=British Standards')).toBeVisible();
  });

  test('should have API Gateway and Message Bus content', async ({ page }) => {
    // Check for Kong and other API gateways
    await expect(page.locator('text=Kong Gateway')).toBeVisible();
    await expect(page.locator('text=IBM API Connect')).toBeVisible();
    await expect(page.locator('text=Oracle API Gateway')).toBeVisible();
    
    // Check for message bus systems
    await expect(page.locator('text=Apache Kafka')).toBeVisible();
    await expect(page.locator('text=IBM MQ')).toBeVisible();
    await expect(page.locator('text=RabbitMQ')).toBeVisible();
  });

  test('should have working cloud architecture links', async ({ page }) => {
    // Check for cloud architecture links
    const awsLink = page.locator('a[href="/company/aws-architecture"]');
    const azureLink = page.locator('a[href="/company/azure-architecture"]');
    const gcpLink = page.locator('a[href="/company/gcp-architecture"]');
    
    await expect(awsLink).toBeVisible();
    await expect(azureLink).toBeVisible();
    await expect(gcpLink).toBeVisible();
  });

  test('should display comprehensive standards list', async ({ page }) => {
    // North American Standards
    await expect(page.locator('text=NIST Cybersecurity Framework')).toBeVisible();
    await expect(page.locator('text=FedRAMP Compliance')).toBeVisible();
    await expect(page.locator('text=SOC 2 Type II')).toBeVisible();
    
    // European Standards
    await expect(page.locator('text=ISO/IEC 27001:2022')).toBeVisible();
    await expect(page.locator('text=GDPR Compliance')).toBeVisible();
    await expect(page.locator('text=NIS2 Directive')).toBeVisible();
    
    // British Standards
    await expect(page.locator('text=Cyber Essentials Plus')).toBeVisible();
    await expect(page.locator('text=NCSC Cloud Security')).toBeVisible();
    
    // IT Process Standards
    await expect(page.locator('text=ITIL 4 Service Management')).toBeVisible();
    await expect(page.locator('text=TOGAF 9.2 Architecture')).toBeVisible();
    await expect(page.locator('text=OWASP Top 10')).toBeVisible();
  });

  test('should have implementation methodology', async ({ page }) => {
    // Check for 6-phase methodology
    await expect(page.locator('text=Architecture Vision & Requirements')).toBeVisible();
    await expect(page.locator('text=Business & Data Architecture')).toBeVisible();
    await expect(page.locator('text=Application Architecture')).toBeVisible();
    await expect(page.locator('text=Technology Architecture')).toBeVisible();
    await expect(page.locator('text=Opportunities & Solutions')).toBeVisible();
    await expect(page.locator('text=Migration & Implementation')).toBeVisible();
  });

  test('should have comprehensive technology stack', async ({ page }) => {
    // Infrastructure tools
    await expect(page.locator('text=Terraform/Ansible')).toBeVisible();
    await expect(page.locator('text=Kubernetes/OpenShift')).toBeVisible();
    
    // Security tools
    await expect(page.locator('text=Aqua Security/Twistlock')).toBeVisible();
    await expect(page.locator('text=OWASP ZAP')).toBeVisible();
    
    // CI/CD tools
    await expect(page.locator('text=Jenkins/GitLab CI')).toBeVisible();
    await expect(page.locator('text=Tekton/Argo CD')).toBeVisible();
    
    // Monitoring tools
    await expect(page.locator('text=Prometheus/Grafana')).toBeVisible();
    await expect(page.locator('text=ELK Stack')).toBeVisible();
  });

  test('should have working contact integration', async ({ page }) => {
    const contactButton = page.locator('a[href="/company/contact"]').first();
    await expect(contactButton).toBeVisible();
    await expect(contactButton).toContainText('Architecture');
  });
});

test.describe('Cloud Architecture Pages', () => {
  const cloudProviders = [
    { slug: 'aws-architecture', name: 'AWS', fullName: 'Amazon Web Services' },
    { slug: 'azure-architecture', name: 'Azure', fullName: 'Microsoft Azure' },
    { slug: 'gcp-architecture', name: 'GCP', fullName: 'Google Cloud Platform' }
  ];

  cloudProviders.forEach(cloud => {
    test(`should load ${cloud.name} architecture page`, async ({ page }) => {
      await page.goto(`/company/${cloud.slug}`);
      
      await expect(page.locator('h1')).toContainText(`${cloud.fullName} DevSecOps Architecture`);
      await expect(page.locator('text=Enterprise-Grade Security-First')).toBeVisible();
      
      // Check for service sections
      await expect(page.locator('text=Compute & Containers')).toBeVisible();
      await expect(page.locator('text=Security Services')).toBeVisible();
      await expect(page.locator('text=DevOps Tools')).toBeVisible();
      
      // Check for compliance section
      await expect(page.locator(`text=${cloud.name} Compliance & Standards`)).toBeVisible();
      
      // Check for implementation process
      await expect(page.locator('text=Assessment & Planning')).toBeVisible();
      await expect(page.locator('text=Infrastructure Setup')).toBeVisible();
      await expect(page.locator('text=Pipeline Implementation')).toBeVisible();
    });

    test(`should have working navigation on ${cloud.name} page`, async ({ page }) => {
      await page.goto(`/company/${cloud.slug}`);
      
      // Check back navigation
      const backLink = page.locator('a[href="/company/devsecops"]');
      await expect(backLink).toBeVisible();
      
      // Check contact links
      const contactLink = page.locator('a[href="/company/contact"]').first();
      await expect(contactLink).toBeVisible();
    });

    test(`should display ${cloud.name} specific services`, async ({ page }) => {
      await page.goto(`/company/${cloud.slug}`);
      
      // Each cloud should have specific services mentioned
      if (cloud.name === 'AWS') {
        await expect(page.locator('text=EC2')).toBeVisible();
        await expect(page.locator('text=EKS')).toBeVisible();
        await expect(page.locator('text=CodePipeline')).toBeVisible();
      } else if (cloud.name === 'Azure') {
        await expect(page.locator('text=AKS')).toBeVisible();
        await expect(page.locator('text=Azure DevOps')).toBeVisible();
        await expect(page.locator('text=Key Vault')).toBeVisible();
      } else if (cloud.name === 'GCP') {
        await expect(page.locator('text=GKE')).toBeVisible();
        await expect(page.locator('text=Cloud Build')).toBeVisible();
        await expect(page.locator('text=Secret Manager')).toBeVisible();
      }
    });
  });
});

test.describe('DevSecOps Integration Tests', () => {
  test('should navigate from main company page to DevSecOps', async ({ page }) => {
    await page.goto('/company');
    
    // Click DevSecOps service card
    await page.click('a[href="/company/devsecops"]');
    await expect(page).toHaveURL('/company/devsecops');
    await expect(page.locator('h1')).toContainText('DevSecOps Infrastructure');
  });

  test('should navigate from DevSecOps to cloud architecture pages', async ({ page }) => {
    await page.goto('/company/devsecops');
    
    // Test AWS link
    await page.click('a[href="/company/aws-architecture"]');
    await expect(page).toHaveURL('/company/aws-architecture');
    await expect(page.locator('h1')).toContainText('Amazon Web Services');
    
    // Go back and test Azure
    await page.goBack();
    await page.click('a[href="/company/azure-architecture"]');
    await expect(page).toHaveURL('/company/azure-architecture');
    await expect(page.locator('h1')).toContainText('Microsoft Azure');
    
    // Go back and test GCP
    await page.goBack();
    await page.click('a[href="/company/gcp-architecture"]');
    await expect(page).toHaveURL('/company/gcp-architecture');
    await expect(page.locator('h1')).toContainText('Google Cloud Platform');
  });

  test('should have consistent branding across all pages', async ({ page }) => {
    const pages = [
      '/company/devsecops',
      '/company/aws-architecture',
      '/company/azure-architecture',
      '/company/gcp-architecture'
    ];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Check for WhiteStart logo
      await expect(page.locator('img[alt="WhiteStart Logo"]')).toBeVisible();
      
      // Check for consistent navigation
      await expect(page.locator('nav')).toBeVisible();
      
      // Check for contact integration
      await expect(page.locator('a[href="/company/contact"]')).toBeVisible();
    }
  });
});