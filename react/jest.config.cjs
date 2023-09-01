module.exports = {
  // Use the esm configuration
  // testEnvironment: 'node',
  testEnvironment: 'jsdom',
   moduleFileExtensions: ['js', 'jsx', 'json', 'mjs', 'node'],  
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '^import\\.meta\\.env$': '<rootDir>/src/mock-import-meta-env.mjs', 
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
  },
  transformIgnorePatterns: [],
};
