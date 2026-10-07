import { createShareLink } from './share';

jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: {
    getSessionId: jest.fn().mockReturnValue('test-session-id')
  }
}));

jest.mock('../../utils/query-url-sanitization', () => ({
  encodeHashCharacters: jest.fn((query: any) => query)
}));

jest.mock('../../utils/sample-url-generation', () => ({
  parseSampleUrl: jest.fn((query: any) => {
    if (!query || !query.sampleUrl) {
      return { queryVersion: '', requestUrl: '', sampleUrl: '', search: '' };
    }
    const url = new URL(query.sampleUrl);
    return {
      queryVersion: query.selectedVersion || 'v1.0',
      requestUrl: url.pathname.replace(/\/v1\.0|\/beta/, ''),
      sampleUrl: query.sampleUrl,
      search: url.search || ''
    };
  })
}));

describe('createShareLink', () => {
  const baseQuery = {
    selectedVerb: 'GET',
    sampleUrl: 'https://graph.microsoft.com/v1.0/me',
    sampleHeaders: [],
    selectedVersion: 'v1.0',
    sampleBody: undefined
  };

  it('should create a share link for a GET query', () => {
    const link = createShareLink(baseQuery as any);
    expect(link).toContain('request=');
    expect(link).toContain('method=GET');
    expect(link).toContain('version=v1.0');
  });

  it('should return empty string when sampleUrl is empty', () => {
    const query = { ...baseQuery, sampleUrl: '' };
    const link = createShareLink(query as any);
    expect(link).toBe('');
  });

  it('should include requestBody for queries with body', () => {
    const query = { ...baseQuery, selectedVerb: 'POST', sampleBody: { displayName: 'Test' } };
    const link = createShareLink(query as any);
    expect(link).toContain('requestBody=');
  });

  it('should include headers when present', () => {
    const query = { ...baseQuery, sampleHeaders: [{ name: 'Accept', value: 'application/json' }] };
    const link = createShareLink(query as any);
    expect(link).toContain('headers=');
  });

  it('should include session ID when authenticated', () => {
    const link = createShareLink(baseQuery as any, true);
    expect(link).toContain('sid=test-session-id');
  });

  it('should not include session ID when not authenticated', () => {
    const link = createShareLink(baseQuery as any, false);
    expect(link).not.toContain('sid=');
  });
});
