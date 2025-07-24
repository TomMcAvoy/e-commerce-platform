timeout: 30000
use: 'chrome'
reporter: [['list'], ['json', { outputFile: 'test-results.json' }]]
projects: [
  {
    name: 'chromium',
    use: { browserName: 'chromium' },
  },
  {
    name: 'firefox',
    use: { browserName: 'firefox' },
  },
  {
    name: 'webkit',
    use: { browserName: 'webkit' },
  },
]