jest.mock('../../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn() },
  eventTypes: { LISTITEM_CLICK_EVENT: 'listitem', LINK_CLICK_EVENT: 'link' },
  componentNames: { SAMPLE_QUERY_LIST_ITEM: 'sample-query', DOCUMENTATION_LINK: 'doc-link' }
}));

jest.mock('../../../utils/query-url-sanitization', () => ({
  sanitizeQueryUrl: (url: string) => url
}));

jest.mock('../../../utils/external-link-validation', () => ({
  validateExternalLink: jest.fn()
}));

import { isJsonString, performSearch, shouldRunQuery, trackSampleQueryClickEvent, trackDocumentLinkClickedEvent } from './sample-query-utils';
import { telemetry } from '../../../../telemetry';

describe('Tests isJsonString should', () => {
  it('return true for valid JSON strings', () => {
    expect(isJsonString('{"foo": "bar"}')).toBe(true);
  });

  it('return false for invalid JSON strings', () => {
    expect(isJsonString('{"foo": "bar"')).toBe(false);
  });
});

describe('performSearch', () => {
  const queries = [
    { id: '1', humanName: 'Get my profile', category: 'Users', method: 'GET', requestUrl: '/me' },
    { id: '2', humanName: 'List messages', category: 'Mail', method: 'GET', requestUrl: '/me/messages' },
    { id: '3', humanName: 'Get user photo', category: 'Users', method: 'GET', requestUrl: '/me/photo' }
  ] as any[];

  it('should filter by humanName', () => {
    const result = performSearch(queries, 'profile');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should filter by category', () => {
    const result = performSearch(queries, 'mail');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('should be case insensitive', () => {
    const result = performSearch(queries, 'USERS');
    expect(result).toHaveLength(2);
  });

  it('should return empty for no matches', () => {
    const result = performSearch(queries, 'nonexistent');
    expect(result).toHaveLength(0);
  });
});

describe('shouldRunQuery', () => {
  beforeAll(() => {
    // Polyfill String.prototype.contains for Node
    if (!(String.prototype as any).contains) {
      (String.prototype as any).contains = String.prototype.includes;
    }
  });

  it('should return true for GET method', () => {
    expect(shouldRunQuery({ method: 'GET', url: '/me', authenticated: false })).toBe(true);
  });

  it('should return true when authenticated', () => {
    expect(shouldRunQuery({ method: 'POST', url: '/me/messages', authenticated: true })).toBe(true);
  });

  it('should return true for POST search/query exception', () => {
    expect(shouldRunQuery({ method: 'POST', url: '/search/query', authenticated: false })).toBe(true);
  });

  it('should return false for unauthenticated non-GET non-exception', () => {
    expect(shouldRunQuery({ method: 'POST', url: '/me/messages', authenticated: false })).toBe(false);
  });

  it('should return false for DELETE unauthenticated', () => {
    expect(shouldRunQuery({ method: 'DELETE', url: '/me/messages/123', authenticated: false })).toBe(false);
  });
});

describe('trackSampleQueryClickEvent', () => {
  it('should call telemetry.trackEvent', () => {
    const query = { id: '1', humanName: 'Test', category: 'Users', method: 'GET', requestUrl: '/me' } as any;
    trackSampleQueryClickEvent(query);
    expect(telemetry.trackEvent).toHaveBeenCalled();
  });
});

describe('trackDocumentLinkClickedEvent', () => {
  it('should call telemetry.trackEvent', async () => {
    const item = { id: '1', humanName: 'Test', category: 'Users', docLink: 'https://docs.microsoft.com' } as any;
    await trackDocumentLinkClickedEvent(item);
    expect(telemetry.trackEvent).toHaveBeenCalled();
  });
});