import { configure } from 'jest';

configure({
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
});