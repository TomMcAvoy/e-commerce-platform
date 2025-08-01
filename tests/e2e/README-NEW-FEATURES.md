# E2E Testing for New Features

This directory contains comprehensive end-to-end tests for the newly implemented features in the e-commerce platform.

## New Features Covered

### 🏢 ERP System (`erp-system.spec.ts`)
- Dashboard functionality
- Module navigation (Finance, HR, Supply Chain, etc.)
- Metrics display
- Recent activity tracking

### 👥 Social Platform (`social-platform.spec.ts`)
- Community discussions
- Safety levels (Kids, Teens, Adults)
- Category-based conversations
- Moderation features

### 🌍 International Shopping (`international-shopping.spec.ts`)
- Multi-country support (USA, Canada, UK, Scotland)
- Currency handling
- Shipping information
- Regional compliance

### 📰 News System (`news-system.spec.ts`)
- News feed display
- Category filtering
- Article sharing
- International news sources

### 🔌 API Integration (`api-integration.spec.ts`)
- REST API endpoints
- Authentication testing
- Error handling
- Data validation

### 📱 Responsive Design (`responsive-design.spec.ts`)
- Mobile, tablet, desktop viewports
- Navigation adaptation
- Content accessibility

### ⚡ Performance (`performance.spec.ts`)
- Page load times
- Core Web Vitals
- Performance budgets

### 🔄 Integration Flow (`integration-flow.spec.ts`)
- Cross-feature navigation
- Consistent branding
- Error handling
- Accessibility standards

## Running Tests

### Quick Start
```bash
# Run all new feature tests
pnpm run test:e2e:new

# Run specific feature tests
pnpm run test:erp
pnpm run test:social
pnpm run test:international
pnpm run test:news
```

### Individual Test Suites
```bash
# ERP System tests
npx playwright test tests/e2e/erp-system.spec.ts

# Social Platform tests
npx playwright test tests/e2e/social-platform.spec.ts

# International Shopping tests
npx playwright test tests/e2e/international-shopping.spec.ts

# News System tests
npx playwright test tests/e2e/news-system.spec.ts

# API Integration tests
npx playwright test tests/e2e/api-integration.spec.ts

# Responsive Design tests
npx playwright test tests/e2e/responsive-design.spec.ts

# Performance tests
npx playwright test tests/e2e/performance.spec.ts

# Integration Flow tests
npx playwright test tests/e2e/integration-flow.spec.ts
```

### Using Custom Configuration
```bash
# Run with new features configuration
npx playwright test --config=playwright-new-features.config.ts
```

## Test Structure

### Test Files
- `erp-system.spec.ts` - ERP dashboard and modules
- `social-platform.spec.ts` - Social media features
- `international-shopping.spec.ts` - Multi-country shopping
- `news-system.spec.ts` - News feed and filtering
- `api-integration.spec.ts` - Backend API testing
- `responsive-design.spec.ts` - Cross-device compatibility
- `performance.spec.ts` - Performance monitoring
- `integration-flow.spec.ts` - Cross-feature integration

### Helper Files
- `helpers/new-features-utils.ts` - Common utilities and assertions
- `run-new-features.js` - Custom test runner script

### Configuration
- `playwright-new-features.config.ts` - Specialized configuration for new features

## Test Data Requirements

### Prerequisites
1. Backend server running on port 3000
2. Frontend server running on port 3001
3. Database seeded with test data
4. Redis server running for sessions

### Environment Setup
```bash
# Start all services
pnpm run dev:all

# Seed test data
pnpm run seed:full

# Verify services
curl http://localhost:3000/health
curl http://localhost:3001
```

## Performance Budgets

| Feature | Load Time Budget |
|---------|------------------|
| ERP Dashboard | 3000ms |
| Social Platform | 2500ms |
| International Page | 4000ms |
| News Feed | 3000ms |

## Browser Support

Tests run on:
- ✅ Chrome (Desktop)
- ✅ Firefox (Desktop)
- ✅ Safari (Desktop)
- ✅ Chrome Mobile (Pixel 5)
- ✅ Safari Mobile (iPhone 12)

## Responsive Breakpoints

| Device | Width | Height |
|--------|-------|--------|
| Mobile | 375px | 667px |
| Tablet | 768px | 1024px |
| Desktop | 1920px | 1080px |

## Reporting

### Test Reports
- HTML Report: `playwright-report-new-features/`
- JSON Report: `test-results-new-features.json`
- Custom Report: `test-report-new-features-[timestamp].json`

### Viewing Reports
```bash
# View HTML report
npx playwright show-report playwright-report-new-features

# View test results
cat test-results-new-features.json | jq
```

## Debugging

### Debug Mode
```bash
# Run tests in debug mode
npx playwright test --debug tests/e2e/erp-system.spec.ts

# Run with UI mode
npx playwright test --ui tests/e2e/social-platform.spec.ts
```

### Screenshots and Videos
- Screenshots: Captured on failure
- Videos: Retained on failure
- Traces: Available on first retry

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run New Features E2E Tests
  run: pnpm run test:e2e:new
```

### Environment Variables
- `CI=true` - Enables CI-specific settings
- `PLAYWRIGHT_BROWSERS_PATH` - Browser installation path

## Troubleshooting

### Common Issues

1. **Servers not running**
   ```bash
   pnpm run dev:all
   ```

2. **Port conflicts**
   ```bash
   lsof -ti :3000 :3001 | xargs kill -9
   ```

3. **Database not seeded**
   ```bash
   pnpm run seed:full
   ```

4. **Browser installation**
   ```bash
   npx playwright install
   ```

### Test Failures

1. Check server logs
2. Review test screenshots
3. Examine trace files
4. Verify test data

## Contributing

### Adding New Tests
1. Create test file in `tests/e2e/`
2. Use `NewFeaturesTestUtils` for common operations
3. Add test to `run-new-features.js`
4. Update package.json scripts
5. Document in this README

### Test Conventions
- Use descriptive test names
- Group related tests in describe blocks
- Use page object patterns via utils
- Assert meaningful expectations
- Handle async operations properly

## Maintenance

### Regular Tasks
- Update performance budgets
- Review and update test data
- Monitor test execution times
- Update browser versions
- Review accessibility standards

### Monitoring
- Track test execution trends
- Monitor performance regressions
- Review failure patterns
- Update test coverage

---

For questions or issues, please check the main project README or create an issue in the repository.