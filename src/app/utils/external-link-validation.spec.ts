jest.mock('../../telemetry', () => ({
  telemetry: { trackException: jest.fn() },
  errorTypes: { LINK_ERROR: 'LINK_ERROR' }
}));
jest.mock('./query-url-sanitization', () => ({
  sanitizeQueryUrl: jest.fn((url: string) => url)
}));

import { isValidHttpsUrl, validateExternalLink } from './external-link-validation';
const { telemetry } = require('../../telemetry');

describe('External link', () => {

  const links = [
    {
      url: 'data:,%20{%22sampleQueries%22:[{%22id%22:%22%22,%22category%22:%22TEST%20%22,%22method%22:%22' +
        'GET%22,%22humanName%22:%22CLICK%20HERE%20-%20%3E%22,%22requestUrl%22:%22/v1.0/me/%22,%22' +
        'docLink%20%22:%22javascript:alert(document.domain)%22,%22headers%22:null,%22tip%22:null,' +
        '%20%22postBody%22:null,%22skipTest%22:false}]}%23',
      result: false
    },
    {
      url: 'https://aka.ms/appTemplateAPISurvey',
      result: true
    }
  ];

  links.forEach(link => {
    it(`url should return ${link.result}`, () => {
      const isValid = isValidHttpsUrl(link.url);
      expect(isValid).toEqual(link.result);
    });
  });

  it('should resolve to undefined when validateExternalLink api fetch errors out', () => {
    const url = 'https://someurl';
    const componentName = 'TestComponent';
    const sampleId = '2345';
    const sampleQuery = {
      selectedVerb: 'GET',
      sampleUrl: '/v1.0/me',
      selectedVersion: 'v1.0',
      sampleBody: '',
      sampleHeaders: []
    }
    return expect(validateExternalLink(url, componentName, sampleId, sampleQuery)).resolves.toBe(undefined);
  });

  describe('isValidHttpsUrl', () => {
    it('should return false for http URL', () => {
      expect(isValidHttpsUrl('http://example.com')).toBe(false);
    });

    it('should return true for https URL', () => {
      expect(isValidHttpsUrl('https://example.com')).toBe(true);
    });

    it('should return false for invalid URL', () => {
      expect(isValidHttpsUrl('not-a-url')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidHttpsUrl('')).toBe(false);
    });

    it('should return false for ftp URL', () => {
      expect(isValidHttpsUrl('ftp://files.example.com')).toBe(false);
    });

    it('should return false for javascript: URL', () => {
      expect(isValidHttpsUrl('javascript:alert(1)')).toBe(false);
    });
  });

  describe('validateExternalLink', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should not track exception when fetch succeeds with ok response', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, statusText: 'OK' });
      await validateExternalLink('https://example.com', 'TestComponent');
      expect(telemetry.trackException).not.toHaveBeenCalled();
    });

    it('should track exception when fetch returns non-ok response', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, statusText: 'Not Found' });
      await validateExternalLink('https://example.com/broken', 'TestComponent');
      expect(telemetry.trackException).toHaveBeenCalled();
    });

    it('should track exception when fetch rejects', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      await validateExternalLink('https://example.com', 'TestComponent');
      expect(telemetry.trackException).toHaveBeenCalled();
    });

    it('should include sampleQuery signature in properties when provided', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('fail'));
      const sampleQuery = {
        selectedVerb: 'GET',
        sampleUrl: 'https://graph.microsoft.com/v1.0/me',
        selectedVersion: 'v1.0',
        sampleBody: '',
        sampleHeaders: []
      };
      await validateExternalLink('https://example.com', 'TestComponent', null, sampleQuery);
      expect(telemetry.trackException).toHaveBeenCalled();
      const props = telemetry.trackException.mock.calls[0][2];
      expect(props.QuerySignature).toBeDefined();
    });

    it('should include sampleId in properties when provided', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('fail'));
      await validateExternalLink('https://example.com', 'TestComponent', 'sample-123');
      expect(telemetry.trackException).toHaveBeenCalled();
      const props = telemetry.trackException.mock.calls[0][2];
      expect(props.SampleId).toBe('sample-123');
    });

    it('should not include SampleId when sampleId is null', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('fail'));
      await validateExternalLink('https://example.com', 'TestComponent', null);
      const props = telemetry.trackException.mock.calls[0][2];
      expect(props.SampleId).toBeUndefined();
    });
  });
});
