import { parseSampleUrl } from './sample-url-generation';

describe('Sample Url Generation', () => {

  it('destructures sample url', () => {
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

  it('destructures sample url with search parameters', () => {
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

  it('destructures sample url with % sign', () => {
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

  it('returns empty properties when url is empty', () => {
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

  it('returns empty properties when url is invalid', () => {
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
