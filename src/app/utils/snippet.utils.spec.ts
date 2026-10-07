import { constructHeaderString } from './snippet.utils';
import { IQuery } from '../../types/query-runner';

describe('constructHeaderString', () => {
  it('should return empty string with content-type for non-GET without headers', () => {
    const query: IQuery = {
      selectedVerb: 'POST',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      sampleHeaders: [],
      selectedVersion: 'v1.0'
    };
    const result = constructHeaderString(query);
    expect(result).toBe('Content-Type: application/json\r\n');
  });

  it('should return empty string for GET without headers', () => {
    const query: IQuery = {
      selectedVerb: 'GET',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      sampleHeaders: [],
      selectedVersion: 'v1.0'
    };
    const result = constructHeaderString(query);
    expect(result).toBe('');
  });

  it('should include provided headers', () => {
    const query: IQuery = {
      selectedVerb: 'GET',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      sampleHeaders: [
        { name: 'Authorization', value: 'Bearer token123' }
      ],
      selectedVersion: 'v1.0'
    };
    const result = constructHeaderString(query);
    expect(result).toContain('Authorization: Bearer token123\r\n');
  });

  it('should not add content-type if already in headers for non-GET', () => {
    const query: IQuery = {
      selectedVerb: 'POST',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      sampleHeaders: [
        { name: 'Content-Type', value: 'application/xml' }
      ],
      selectedVersion: 'v1.0'
    };
    const result = constructHeaderString(query);
    expect(result).toBe('Content-Type: application/xml\r\n');
    expect(result).not.toContain('application/json');
  });

  it('should handle content-type check case-insensitively', () => {
    const query: IQuery = {
      selectedVerb: 'PATCH',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      sampleHeaders: [
        { name: 'content-type', value: 'text/plain' }
      ],
      selectedVersion: 'v1.0'
    };
    const result = constructHeaderString(query);
    expect(result).toBe('content-type: text/plain\r\n');
  });

  it('should handle multiple headers', () => {
    const query: IQuery = {
      selectedVerb: 'GET',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      sampleHeaders: [
        { name: 'Accept', value: 'application/json' },
        { name: 'X-Custom', value: 'value1' }
      ],
      selectedVersion: 'v1.0'
    };
    const result = constructHeaderString(query);
    expect(result).toContain('Accept: application/json\r\n');
    expect(result).toContain('X-Custom: value1\r\n');
  });
});
