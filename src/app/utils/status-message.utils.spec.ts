import { extractUrl, setStatusMessage } from './status-message';

describe('status-message', () => {
  describe('extractUrl', () => {
    it('should extract URL from a string', () => {
      const result = extractUrl('Visit https://example.com for details');
      expect(result).toEqual(['https://example.com']);
    });

    it('should extract multiple URLs', () => {
      const result = extractUrl('Visit https://example.com and http://test.com');
      expect(result).toHaveLength(2);
    });

    it('should return null when no URL found', () => {
      const result = extractUrl('no url here');
      expect(result).toBeNull();
    });

    it('should handle URL with path', () => {
      const result = extractUrl('Go to https://example.com/path/to/resource');
      expect(result).toEqual(['https://example.com/path/to/resource']);
    });
  });

  describe('setStatusMessage', () => {
    it('should return OK for 200', () => {
      expect(setStatusMessage(200)).toBe('OK');
    });

    it('should return Created for 201', () => {
      expect(setStatusMessage(201)).toBe('Created');
    });

    it('should return No Content for 204', () => {
      expect(setStatusMessage(204)).toBe('No Content');
    });

    it('should return Bad Request for 400', () => {
      expect(setStatusMessage(400)).toBe('Bad Request');
    });

    it('should return Unauthorized for 401', () => {
      expect(setStatusMessage(401)).toBe('Unauthorized');
    });

    it('should return Forbidden for 403', () => {
      expect(setStatusMessage(403)).toBe('Forbidden');
    });

    it('should return Not Found for 404', () => {
      expect(setStatusMessage(404)).toBe('Not Found');
    });

    it('should return Internal Server Error for 500', () => {
      expect(setStatusMessage(500)).toBe('Internal Server Error');
    });

    it('should return empty string for unknown status', () => {
      expect(setStatusMessage(999)).toBe('');
    });

    it('should return Continue for 100', () => {
      expect(setStatusMessage(100)).toBe('Continue');
    });

    it('should return Conflict for 409', () => {
      expect(setStatusMessage(409)).toBe('Conflict');
    });

    it('should return Service Unavailable for 503', () => {
      expect(setStatusMessage(503)).toBe('Service Unavailable');
    });
  });
});
