import { saveToLocalStorage, readFromLocalStorage } from './local-storage';

describe('local-storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveToLocalStorage', () => {
    it('should save a string value', () => {
      saveToLocalStorage('testKey', 'testValue');
      expect(localStorage.getItem('testKey')).toBe('testValue');
    });

    it('should save an object as JSON string', () => {
      const obj = { name: 'test', value: 42 };
      saveToLocalStorage('testObj', obj);
      expect(localStorage.getItem('testObj')).toBe(JSON.stringify(obj));
    });

    it('should save an array as JSON string', () => {
      const arr = [1, 2, 3];
      saveToLocalStorage('testArr', arr);
      expect(localStorage.getItem('testArr')).toBe(JSON.stringify(arr));
    });
  });

  describe('readFromLocalStorage', () => {
    it('should read a string value', () => {
      localStorage.setItem('strKey', 'strValue');
      expect(readFromLocalStorage('strKey')).toBe('strValue');
    });

    it('should return null for non-existent key', () => {
      expect(readFromLocalStorage('nonExistent')).toBeNull();
    });

    it('should read back saved string values', () => {
      saveToLocalStorage('key1', 'value1');
      expect(readFromLocalStorage('key1')).toBe('value1');
    });
  });
});
