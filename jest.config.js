module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: './coverage',
  coverageReporters: ['html', 'text-summary', 'lcov'],
  testMatch: ['<rootDir>/src/**/*.test.js'],
  modulePaths: ['<rootDir>/src/']
};
