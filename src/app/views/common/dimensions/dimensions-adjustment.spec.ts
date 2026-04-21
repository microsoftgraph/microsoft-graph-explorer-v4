import { convertVhToPx, convertPxToVh, getResponseHeight, getResponseEditorHeight } from './dimensions-adjustment';

describe('dimensions-adjustment', () => {
  describe('convertVhToPx', () => {
    it('should convert vh to px with adjustment', () => {
      Object.defineProperty(document.documentElement, 'clientHeight', { value: 1000, configurable: true });
      const result = convertVhToPx('50vh', 10);
      expect(result).toBe('490px');
    });

    it('should handle 100vh', () => {
      Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, configurable: true });
      const result = convertVhToPx('100vh', 0);
      expect(result).toBe('800px');
    });

    it('should floor the result', () => {
      Object.defineProperty(document.documentElement, 'clientHeight', { value: 1000, configurable: true });
      const result = convertVhToPx('33vh', 0);
      expect(result).toBe('330px');
    });
  });

  describe('convertPxToVh', () => {
    it('should convert px to vh', () => {
      Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });
      const result = convertPxToVh(500);
      expect(result).toBe('50vh');
    });

    it('should handle 0px', () => {
      Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });
      const result = convertPxToVh(0);
      expect(result).toBe('0vh');
    });
  });

  describe('getResponseHeight', () => {
    it('should return 90vh when expanded', () => {
      const result = getResponseHeight('50vh', true);
      expect(result).toBe('90vh');
    });

    it('should return original height when not expanded', () => {
      const result = getResponseHeight('50vh', false);
      expect(result).toBe('50vh');
    });
  });

  describe('getResponseEditorHeight', () => {
    it('should return empty string when query-response element is not found', () => {
      const result = getResponseEditorHeight(50);
      expect(result).toBe('');
    });

    it('should return calculated height when query-response element exists', () => {
      const div = document.createElement('div');
      div.className = 'query-response';
      Object.defineProperty(div, 'clientHeight', { value: 400 });
      document.body.appendChild(div);

      const result = getResponseEditorHeight(50);
      expect(result).toBe('350px');

      document.body.removeChild(div);
    });
  });
});
