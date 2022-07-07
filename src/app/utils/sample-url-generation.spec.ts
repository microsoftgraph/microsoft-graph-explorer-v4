import { hasPlaceHolders, hasWhiteSpace, parseSampleUrl } from './sample-url-generation';

describe('Sample Url Generation', () => {

  it('should destructure sample url', () => {
    const url = 'https://graph.microsoft.com/v1.0/me/messages';

    const expectedUrl = {
      requestUrl: 'me/messages',
      queryVersion: 'v1.0',
      sampleUrl: url,
      search: ''
    };

    const parsedUrl = parseSampleUrl(url);
    expect(parsedUrl).toEqual(expectedUrl);
  });

  it('should destructure sample url with search parameters', () => {
    const search = '?$select=subject';
    const url = `https://graph.microsoft.com/v1.0/me/messages${search}`;

    const expectedUrl = {
      requestUrl: 'me/messages',
      queryVersion: 'v1.0',
      sampleUrl: url,
      search
    };

    const parsedUrl = parseSampleUrl(url);
    expect(parsedUrl).toEqual(expectedUrl);
  });

  it('should destructure sample url with % sign', () => {
    const name = 'DiegoS%40m365x214355.onmicrosoft.com';
    const search = `?$select=displayName,mail&$filter=mail eq '${name}'`;
    const parsedSearch = `?$select=displayName,mail&$filter=mail+eq+'${name}'`;

    const url = `https://graph.microsoft.com/v1.0/users${search}`;

    const expectedUrl = {
      requestUrl: 'users',
      queryVersion: 'v1.0',
      sampleUrl: `https://graph.microsoft.com/v1.0/users${parsedSearch}`,
      search: parsedSearch
    };

    const parsedUrl = parseSampleUrl(url);
    expect(parsedUrl).toEqual(expectedUrl);
  });

  it('should return empty properties when url is empty', () => {
    const url = '';

    const expectedUrl = {
      requestUrl: '',
      queryVersion: '',
      sampleUrl: url,
      search: ''
    };

    const parsedUrl = parseSampleUrl(url);
    expect(parsedUrl).toEqual(expectedUrl);
  });

  it('should return empty properties when url is invalid', () => {
    const url = 'I am an invalid url';

    const expectedUrl = {
      requestUrl: '',
      queryVersion: '',
      sampleUrl: '',
      search: ''
    };

    const parsedUrl = parseSampleUrl(url);
    expect(parsedUrl).toEqual(expectedUrl);
  });

  it('returns empty properties when url is incomplete', () => {
    const url = 'https://graph.microsoft.com/beta';

    const expectedUrl = {
      requestUrl: '',
      queryVersion: 'beta',
      sampleUrl: 'https://graph.microsoft.com/beta/',
      search: ''
    };

    const parsedUrl = parseSampleUrl(url);
    expect(parsedUrl).toEqual(expectedUrl);
  });

  it('replaces whitespace with + sign', () => {

    const search = '?filter=displayName eq \'All Company\'';
    const parsedSearch = '?filter=displayName+eq+\'All+Company\'';

    const url = `https://graph.microsoft.com/v1.0/groups${search}`;

    const expectedUrl = {
      requestUrl: 'groups',
      queryVersion: 'v1.0',
      sampleUrl: `https://graph.microsoft.com/v1.0/groups${parsedSearch}`,
      search: parsedSearch
    };

    const parsedUrl = parseSampleUrl(url);
    expect(parsedUrl).toEqual(expectedUrl);
  });

});


describe('hasWhiteSpaces should', () => {
  const invalidUrls = [
    { url: ' https://graph.microsoft.com/v1.0/me', output: false },
    { url: 'https: //graph.microsoft.com/v1.0/me', output: true },
    { url: 'https://%20graph.microsoft.com/v1.0/me', output: true },
    { url: 'https://graph.microsoft.com/ v1.0/me', output: true },
    { url: 'https://graph.microsoft.com/v1.0/ me', output: true },
    {
      url:
        'https://graph.microsoft.com/v1.0/me/contacts?$filter=emailAddresses/any(a:a/address eq \'garth@contoso.com\')',
      output: false
    },
    { url: 'https://graph.microsoft.com/v1.0/me     ', output: false }
  ];
  invalidUrls.forEach(invalidUrl => {
    it(`validate whitespaces in the url: ${invalidUrl.url}`, () => {
      expect(hasWhiteSpace(invalidUrl.url)).toBe(invalidUrl.output);
    });
  });
});

describe('hasPlaceHolders should', () => {
  const urls = [
    { url: ' https://graph.microsoft.com/v1.0/me/messages/{message-id}', output: true },
    { url: ' https://graph.microsoft.com/v1.0/me/messages/{message-id', output: false },
    {
      url: ' https://graph.microsoft.com/v1.0/sites/{site-id}/drive/items/{item-id}/versions/{version-id}/content',
      output: true
    }
  ];
  urls.forEach(invalidUrl => {
    it(`validate placeholders in the url: ${invalidUrl.url}`, () => {
      expect(hasPlaceHolders(invalidUrl.url)).toBe(invalidUrl.output);
    });
  });
});


