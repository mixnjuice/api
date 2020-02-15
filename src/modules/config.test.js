import { isTrue } from './config';

describe('config module', () => {
  describe('isTrue', () => {
    it('returns true when value is true', () => {
      expect(isTrue(true)).toBe(true);
      expect(isTrue('t')).toBe(true);
      expect(isTrue('true')).toBe(true);
      expect(isTrue('TRUE')).toBe(true);
    });

    it('returns false otherwise', () => {
      expect(isTrue(null)).toBe(false);
      expect(isTrue('f')).toBe(false);
      expect(isTrue('false')).toBe(false);
      expect(isTrue('FALSE')).toBe(false);
    });
  });
});
