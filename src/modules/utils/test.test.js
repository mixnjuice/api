import { isTestEnvironment, tryCatch } from './test';
import logging from 'modules/logging';

jest.mock('modules/logging', () => {
  const error = jest.fn();

  return {
    __esModule: true,
    default: jest.fn(() => ({ error }))
  };
});

const mockLog = logging();

describe('test utilities', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isTestEnvironment', () => {
    it('works in test environment', () => {
      expect(isTestEnvironment()).toBeTruthy();
    });

    it('works outside of test environment', () => {
      process.env.NODE_ENV = 'production';
      expect(isTestEnvironment()).toBeFalsy();
      process.env.NODE_ENV = 'test';
    });
  });

  describe('tryCatch', () => {
    const done = jest.fn();

    it('works in case of success', () => {
      const successful = jest.fn().mockImplementation(done);

      tryCatch(successful)(done);
      expect(successful).toHaveBeenCalled();
      expect(done).toHaveBeenCalled();
    });

    it('works in case of error', () => {
      const error = new Error('Failure!');
      const failure = jest.fn().mockImplementation(() => {
        throw error;
      });

      tryCatch(failure)(done);
      expect(failure).toHaveBeenCalled();
      expect(done).toHaveBeenCalledWith(error);
      expect(mockLog.error).toHaveBeenCalledWith(error.message, error);
    });
  });
});
