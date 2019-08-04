import bcrypt from 'bcrypt';

import configs from './config';
import {
  generateToken,
  buildWebUrl,
  isTestEnvironment,
  hashPassword,
  compareHashAndPassword
} from './util';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

jest.mock('./config', () => ({
  web: {
    hostname: 'localhost',
    useTls: false,
    port: 9000
  },
  api: {
    passwords: {
      saltRounds: 10
    },
    tokens: {
      length: 24
    }
  }
}));

describe('utility methods', () => {
  afterEach(() => {
    bcrypt.hash.mockReset();
    bcrypt.compare.mockReset();
  });

  describe('generateToken', () => {
    it('can generate a 24-character long string', () => {
      expect(generateToken()).toHaveLength(24);
    });
  });

  describe('hashPassword', () => {
    it('can hash password', async () => {
      const hash = 'testing';

      bcrypt.hash.mockResolvedValue(hash);
      const result = await hashPassword('anything');

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual('testing');
    });
  });

  describe('compareHashAndPassword', () => {
    it('can compare hash and password', async () => {
      const valid = true;

      bcrypt.compare.mockResolvedValue(valid);
      const result = await compareHashAndPassword('anything', 'anything');

      expect(bcrypt.compare).toHaveBeenCalled();
      expect(result).toBe(valid);
    });
  });

  describe('buildWebUrl', () => {
    it('can construct local http url', () => {
      expect(buildWebUrl('/test')).toEqual('http://localhost:9000/test');
    });

    it('can construct https url', () => {
      Object.defineProperties(configs.web, {
        hostname: {
          get: jest.fn().mockReturnValue('localhost')
        },
        useTls: {
          get: jest.fn().mockReturnValue(true)
        },
        port: {
          get: jest.fn().mockReturnValue(443)
        }
      });

      expect(buildWebUrl('/test')).toEqual('https://localhost/test');
    });
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
});
