
require = require('esm')(module);
module.exports = {
  // Use the esm configuration
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [],
};