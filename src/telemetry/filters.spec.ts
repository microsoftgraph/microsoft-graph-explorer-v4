import {
  filterTelemetryTypes,
  sanitizeTelemetryItemUriProperty,
  addCommonTelemetryItemProperties,
  filterResizeObserverExceptions,
  filterRemoteDependencyData
} from './filters';
import { ITelemetryItem } from '@microsoft/applicationinsights-web';

// Mock the store module
jest.mock('../store', () => ({
  store: {
    getState: () => ({
      proxyUrl: 'https://proxy.example.com/api/proxy',
      graphExplorerMode: 'COMPLETE'
    })
  }
}));

// Set env variable for devxApiUrl used in filterRemoteDependencyData
process.env.REACT_APP_DEVX_API_URL = 'https://graphexplorerapi.azurewebsites.net';

jest.mock('../app/utils/query-url-sanitization', () => ({
  sanitizeQueryUrl: (url: string) => url,
  sanitizeGraphAPISandboxUrl: (url: string) => url
}));

describe('telemetry filters', () => {
  describe('filterTelemetryTypes', () => {
    it('should include EventData', () => {
      const envelope: ITelemetryItem = { name: 'test', baseType: 'EventData' };
      expect(filterTelemetryTypes(envelope)).toBe(true);
    });

    it('should include MetricData', () => {
      const envelope: ITelemetryItem = { name: 'test', baseType: 'MetricData' };
      expect(filterTelemetryTypes(envelope)).toBe(true);
    });

    it('should include PageviewData', () => {
      const envelope: ITelemetryItem = { name: 'test', baseType: 'PageviewData' };
      expect(filterTelemetryTypes(envelope)).toBe(true);
    });

    it('should include ExceptionData', () => {
      const envelope: ITelemetryItem = { name: 'test', baseType: 'ExceptionData' };
      expect(filterTelemetryTypes(envelope)).toBe(true);
    });

    it('should include RemoteDependencyData', () => {
      const envelope: ITelemetryItem = { name: 'test', baseType: 'RemoteDependencyData' };
      expect(filterTelemetryTypes(envelope)).toBe(true);
    });

    it('should exclude unknown types', () => {
      const envelope: ITelemetryItem = { name: 'test', baseType: 'UnknownType' };
      expect(filterTelemetryTypes(envelope)).toBe(false);
    });

    it('should exclude when baseType is undefined', () => {
      const envelope: ITelemetryItem = { name: 'test' };
      expect(filterTelemetryTypes(envelope)).toBe(false);
    });
  });

  describe('sanitizeTelemetryItemUriProperty', () => {
    it('should remove fragment from URI', () => {
      const envelope: ITelemetryItem = {
        name: 'test',
        baseData: {
          uri: 'https://example.com/path#access_token=abc123'
        }
      };
      sanitizeTelemetryItemUriProperty(envelope);
      expect(envelope.baseData!.uri).toBe('https://example.com/path');
    });

    it('should handle URI without fragment', () => {
      const envelope: ITelemetryItem = {
        name: 'test',
        baseData: {
          uri: 'https://example.com/path'
        }
      };
      const result = sanitizeTelemetryItemUriProperty(envelope);
      expect(result).toBe(true);
    });

    it('should handle missing URI', () => {
      const envelope: ITelemetryItem = {
        name: 'test',
        baseData: {}
      };
      const result = sanitizeTelemetryItemUriProperty(envelope);
      expect(result).toBe(true);
    });

    it('should return true always', () => {
      const envelope: ITelemetryItem = { name: 'test' };
      expect(sanitizeTelemetryItemUriProperty(envelope)).toBe(true);
    });
  });

  describe('addCommonTelemetryItemProperties', () => {
    it('should add ApplicationName property', () => {
      const envelope: ITelemetryItem = {
        name: 'test',
        baseData: {}
      };
      addCommonTelemetryItemProperties(envelope);
      expect(envelope.baseData!.properties.ApplicationName).toBe('Graph Explorer v4');
    });

    it('should add IsAuthenticated property', () => {
      const envelope: ITelemetryItem = {
        name: 'test',
        baseData: {}
      };
      addCommonTelemetryItemProperties(envelope);
      expect(envelope.baseData!.properties.IsAuthenticated).toBeDefined();
    });

    it('should return true', () => {
      const envelope: ITelemetryItem = { name: 'test', baseData: {} };
      expect(addCommonTelemetryItemProperties(envelope)).toBe(true);
    });
  });

  describe('filterResizeObserverExceptions', () => {
    it('should filter out ResizeObserver loop limit exceeded', () => {
      const envelope: ITelemetryItem = {
        name: 'test',
        data: { message: 'ErrorEvent: ResizeObserver loop limit exceeded' }
      };
      expect(filterResizeObserverExceptions(envelope)).toBe(false);
    });

    it('should not filter other errors', () => {
      const envelope: ITelemetryItem = {
        name: 'test',
        data: { message: 'Some other error' }
      };
      const result = filterResizeObserverExceptions(envelope);
      expect(result).toBeUndefined();
    });

    it('should not filter when no data', () => {
      const envelope: ITelemetryItem = { name: 'test' };
      const result = filterResizeObserverExceptions(envelope);
      expect(result).toBeUndefined();
    });

    it('should not filter when data.message is empty string', () => {
      const envelope: ITelemetryItem = { name: 'test', data: { message: '' } };
      const result = filterResizeObserverExceptions(envelope);
      expect(result).toBeUndefined();
    });
  });

  describe('filterRemoteDependencyData', () => {
    it('should return true for non-RemoteDependencyData types', () => {
      const envelope: ITelemetryItem = { name: 'test', baseType: 'EventData', baseData: {} };
      expect(filterRemoteDependencyData(envelope)).toBe(true);
    });

    it('should return false for RemoteDependencyData with unknown target', () => {
      const envelope: ITelemetryItem = {
        name: 'test',
        baseType: 'RemoteDependencyData',
        baseData: { target: 'https://unknown.example.com/api/data' }
      };
      expect(filterRemoteDependencyData(envelope)).toBe(false);
    });

    it('should return true for RemoteDependencyData with graph.microsoft.com target', () => {
      const envelope: ITelemetryItem = {
        name: 'test',
        baseType: 'RemoteDependencyData',
        baseData: { target: 'https://graph.microsoft.com/v1.0/me' }
      };
      expect(filterRemoteDependencyData(envelope)).toBe(true);
    });

    it('should return true for RemoteDependencyData with proxy target', () => {
      const envelope: ITelemetryItem = {
        name: 'test',
        baseType: 'RemoteDependencyData',
        baseData: { target: 'https://proxy.example.com/api/proxy/v1.0/me' }
      };
      expect(filterRemoteDependencyData(envelope)).toBe(true);
    });
  });

  describe('addCommonTelemetryItemProperties extended', () => {
    it('should add GraphExplorerMode from store', () => {
      const envelope: ITelemetryItem = { name: 'test', baseData: {} };
      addCommonTelemetryItemProperties(envelope);
      expect(envelope.baseData!.properties.GraphExplorerMode).toBe('COMPLETE');
    });

    it('should handle existing properties without overwriting them', () => {
      const envelope: ITelemetryItem = {
        name: 'test',
        baseData: { properties: { existingProp: 'keep' } }
      };
      addCommonTelemetryItemProperties(envelope);
      expect(envelope.baseData!.properties.existingProp).toBe('keep');
      expect(envelope.baseData!.properties.ApplicationName).toBe('Graph Explorer v4');
    });

    it('should handle missing baseData', () => {
      const envelope: ITelemetryItem = { name: 'test' };
      const result = addCommonTelemetryItemProperties(envelope);
      expect(result).toBe(true);
    });
  });
});
