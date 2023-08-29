module.exports = {
  // Indicates that Jest should use the jsdom environment (browser-like environment) for testing
  testEnvironment: 'jsdom',
  // Specifies the file patterns Jest should consider as test files
  testMatch: ['<rootDir>/**/*.test.js'],
  // Set up files to run before tests start
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
