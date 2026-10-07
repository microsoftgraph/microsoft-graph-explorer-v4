import { methodColors, getStyleFor, getHeaders } from './http-methods.utils';

describe('http-methods.utils', () => {
  describe('methodColors', () => {
    it('should have correct color for GET', () => {
      expect(methodColors.GET).toBe('brand');
    });

    it('should have correct color for POST', () => {
      expect(methodColors.POST).toBe('success');
    });

    it('should have correct color for PATCH', () => {
      expect(methodColors.PATCH).toBe('severe');
    });

    it('should have correct color for DELETE', () => {
      expect(methodColors.DELETE).toBe('danger');
    });

    it('should have correct color for PUT', () => {
      expect(methodColors.PUT).toBe('warning');
    });
  });

  describe('getStyleFor', () => {
    it('should return a style for GET', () => {
      const style = getStyleFor('GET');
      expect(style).toBeDefined();
      expect(typeof style).toBe('string');
    });

    it('should return a style for POST', () => {
      const style = getStyleFor('POST');
      expect(style).toBeDefined();
    });

    it('should return a style for PUT', () => {
      const style = getStyleFor('PUT');
      expect(style).toBeDefined();
    });

    it('should return a style for PATCH', () => {
      const style = getStyleFor('PATCH');
      expect(style).toBeDefined();
    });

    it('should return a style for DELETE', () => {
      const style = getStyleFor('DELETE');
      expect(style).toBeDefined();
    });

    it('should handle lowercase methods', () => {
      const style = getStyleFor('get');
      expect(style).toBeDefined();
    });

    it('should return default style for unknown method', () => {
      const style = getStyleFor('UNKNOWN');
      expect(style).toBeDefined();
    });

    it('should handle null/undefined gracefully', () => {
      const style = getStyleFor(undefined as any);
      expect(style).toBeDefined();
    });
  });

  describe('getHeaders', () => {
    it('should extract headers from a Response object', () => {
      const response = new Response('body', {
        headers: {
          'content-type': 'application/json',
          'x-custom': 'value'
        }
      });
      const headers = getHeaders(response);
      expect(headers['content-type']).toBe('application/json');
      expect(headers['x-custom']).toBe('value');
    });

    it('should return empty object for non-Response', () => {
      const headers = getHeaders({} as any);
      expect(headers).toEqual({});
    });

    it('should return empty object for null', () => {
      const headers = getHeaders(null as any);
      expect(headers).toEqual({});
    });

    it('should return empty object for undefined', () => {
      const headers = getHeaders(undefined as any);
      expect(headers).toEqual({});
    });
  });
});
