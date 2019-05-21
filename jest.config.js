module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: './coverage',
  coverageReporters: ['html', 'text-summary'],
  testMatch: ['<rootDir>/src/**/*.test.js'],
  modulePaths: ['<rootDir>/src/']
};
