import { delimiters, getLastDelimiterInUrl } from './delimiters';

describe('delimiters', () => {
  describe('delimiters object', () => {
    it('should have SLASH delimiter', () => {
      expect(delimiters.SLASH).toEqual({ symbol: '/', context: 'paths' });
    });

    it('should have QUESTION_MARK delimiter', () => {
      expect(delimiters.QUESTION_MARK).toEqual({ symbol: '?', context: 'parameters' });
    });

    it('should have EQUALS delimiter', () => {
      expect(delimiters.EQUALS).toEqual({ symbol: '=', context: 'properties' });
    });

    it('should have COMMA delimiter', () => {
      expect(delimiters.COMMA).toEqual({ symbol: ',', context: 'properties' });
    });

    it('should have AMPERSAND delimiter', () => {
      expect(delimiters.AMPERSAND).toEqual({ symbol: '&', context: 'parameters' });
    });

    it('should have DOLLAR delimiter', () => {
      expect(delimiters.DOLLAR).toEqual({ symbol: '$', context: 'parameters' });
    });
  });

  describe('getLastDelimiterInUrl', () => {
    it('should return SLASH for empty/null URL', () => {
      expect(getLastDelimiterInUrl('')).toEqual(delimiters.SLASH);
    });

    it('should return SLASH for URL ending with /', () => {
      const result = getLastDelimiterInUrl('users/');
      expect(result.symbol).toBe('/');
      expect(result.context).toBe('paths');
    });

    it('should return QUESTION_MARK for URL with ?', () => {
      const result = getLastDelimiterInUrl('users?');
      expect(result.symbol).toBe('?');
      expect(result.context).toBe('parameters');
    });

    it('should return EQUALS for URL with =', () => {
      const result = getLastDelimiterInUrl('users?$select=');
      expect(result.symbol).toBe('=');
      expect(result.context).toBe('properties');
    });

    it('should return AMPERSAND for URL with &', () => {
      const result = getLastDelimiterInUrl('users?$select=displayName&');
      expect(result.symbol).toBe('&');
      expect(result.context).toBe('parameters');
    });

    it('should adjust index when adjacent delimiter has same context', () => {
      // =, are adjacent delimiters with same context (properties)
      const result = getLastDelimiterInUrl('users?$select=,');
      expect(result.symbol).toBe(',');
      expect(result.context).toBe('properties');
      // Index is adjusted back to the previous delimiter position
      expect(result.index).toBe('users?$select=,'.length - 2);
    });

    it('should return last delimiter in complex URL', () => {
      const result = getLastDelimiterInUrl('users?$select=displayName,');
      expect(result.symbol).toBe(',');
      expect(result.context).toBe('properties');
    });

    it('should return SLASH for URL without known delimiters', () => {
      const result = getLastDelimiterInUrl('users');
      expect(result).toEqual(delimiters.SLASH);
    });
  });
});
