// Suppress console warnings during tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && args[0].includes('Some route files may not exist')) {
    return; // Suppress route file warnings during tests
  }
  originalWarn(...args);
};
