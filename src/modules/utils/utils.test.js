import bcrypt from 'bcrypt';

import { web as webConfig } from 'modules/config';
import {
  generateToken,
  buildWebUrl,
  hashPassword,
  compareHashAndPassword
} from 'modules/utils';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

jest.mock('modules/config', () => ({
  web: {
    hostname: jest.fn(),
    port: jest.fn()
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
    jest.clearAllMocks();
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
      webConfig.hostname.mockReturnValue('localhost');
      webConfig.port.mockReturnValue(9000);

      expect(buildWebUrl('/test')).toEqual('https://localhost:9000/test');
    });

    it('can construct https url', () => {
      webConfig.hostname.mockReturnValue('localhost');
      webConfig.port.mockReturnValue(443);

      expect(buildWebUrl('/test')).toEqual('https://localhost/test');
    });
  });
});
