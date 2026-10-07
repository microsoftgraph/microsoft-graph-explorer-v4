import './string-operations';

describe('String Operations', () => {
  describe('toSentenceCase', () => {
    it('should capitalize first letter and lowercase rest', () => {
      expect('hello WORLD'.toSentenceCase()).toBe('Hello world');
    });

    it('should handle single character string', () => {
      expect('a'.toSentenceCase()).toBe('A');
    });

    it('should handle already sentence case string', () => {
      expect('Hello'.toSentenceCase()).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(''.toSentenceCase()).toBe('');
    });

    it('should handle all uppercase', () => {
      expect('TEST'.toSentenceCase()).toBe('Test');
    });

    it('should handle string starting with non-alpha character', () => {
      expect('123abc'.toSentenceCase()).toBe('123abc');
    });
  });

  describe('contains', () => {
    it('should return true when substring exists (case-insensitive)', () => {
      expect('Hello World'.contains('hello')).toBe(true);
    });

    it('should return true for exact match', () => {
      expect('test'.contains('test')).toBe(true);
    });

    it('should return false when substring does not exist', () => {
      expect('Hello'.contains('xyz')).toBe(false);
    });

    it('should handle empty search string', () => {
      expect('Hello'.contains('')).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect('HELLO'.contains('hello')).toBe(true);
      expect('hello'.contains('HELLO')).toBe(true);
    });
  });
});
