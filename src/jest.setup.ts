const { configure } = require('jest');

configure({
  setupFilesAfterEnv: ['./src/__tests__/setup.ts'],
  testEnvironment: 'node',
});