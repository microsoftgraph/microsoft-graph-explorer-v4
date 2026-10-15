import { parseSampleUrl } from '../../utils/sample-url-generation';
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

  describe('when the sample url is malformed', () => {
    // Use the real parser: the module-level mock above does not reproduce how it handles bad input.
    const { parseSampleUrl: realParseSampleUrl } = jest.requireActual('../../utils/sample-url-generation');

    const createShareLinkFor = (sampleUrl: string) => {
      (parseSampleUrl as jest.Mock).mockImplementationOnce(() => realParseSampleUrl(sampleUrl));
      return createShareLink({ ...baseQuery, sampleUrl } as any);
    };

    // The parser derives an origin of 'null' for an unknown scheme, which produces a url that cannot be parsed.
    it.each([
      'htps://graph.microsoft.com/v1.0/me',
      'htttps://graph.microsoft.com/v1.0/me?$select=id'
    ])('falls back to the default graph url for a mistyped scheme: %s', (sampleUrl) => {
      expect(realParseSampleUrl(sampleUrl).sampleUrl).toMatch(/^null\//);

      const link = createShareLinkFor(sampleUrl);

      expect(link).toContain('GraphUrl=https://graph.microsoft.com');
    });

    it.each([
      'https//graph.microsoft.com/v1.0/me',
      'graph.microsoft.com/v1.0/me'
    ])('returns an empty link without throwing when the parser cannot read the url: %s', (sampleUrl) => {
      expect(createShareLinkFor(sampleUrl)).toBe('');
    });
  });

  it('should not include session ID when not authenticated', () => {
    const link = createShareLink(baseQuery as any, false);
    expect(link).not.toContain('sid=');
  });
});
