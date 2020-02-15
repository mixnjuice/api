module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: './coverage',
  coverageReporters: ['html', 'text-summary', 'lcov'],
  modulePaths: ['<rootDir>/src/'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.js']
};
