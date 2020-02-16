import express from 'express';

import { isTestEnvironment, tryCatch, bootstrapApp } from './test';
import logging from 'modules/logging';
import supertest from 'supertest';

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

  describe('bootstrapApp', () => {
    it(
      'works for a valid router',
      tryCatch(async done => {
        const router = new express.Router();

        router.get('/', (req, res) => {
          res.sendStatus(204);
        });

        const app = bootstrapApp(router);

        expect(app).toBeDefined();
        const request = supertest(app);
        const response = await request.get('/');

        expect(response.status).toBe(204);
        done();
      })
    );
  });
});
