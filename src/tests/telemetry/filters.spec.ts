import { ITelemetryItem } from '@microsoft/applicationinsights-web';
import {
  filterTelemetryTypes, filterRemoteDependencyData, addCommonTelemetryItemProperties, sanitizeTelemetryItemUriProperty,
  sanitizeStackTrace
} from '../../../src/telemetry/filters';


describe('Telemetry filters should', () => {
  it('ensure telemetry types to include are correct when filterTelemetryTypes() is called', () => {
    // Arrange
    const envelope: ITelemetryItem = {
      ver: '1.0',
      name: 'test',
      time: '',
      iKey: '',
      baseType: 'EventData'
    }

    // Act
    const result = filterTelemetryTypes(envelope);

    // Assert
    expect(result).toBe(true);

  });

  it('return true by default when filterRemoteDependencyData() is called', () => {
    // Arrange
    const envelope: ITelemetryItem = {
      ver: '1.0',
      name: 'test',
      time: '',
      iKey: '',
      baseType: 'EventData'
    }

    // Act
    const result = filterRemoteDependencyData(envelope);

    // Assert
    expect(result).toBe(true);
  });

  it('add common telemetry item properties and return true when addCommonTelemetryItemProperties is called', () => {
    // Arrange
    const envelope: ITelemetryItem = {
      ver: '1.0',
      name: 'test',
      time: '',
      iKey: '',
      baseType: 'EventData'
    }

    // Act
    const result = addCommonTelemetryItemProperties(envelope);

    // Assert
    expect(result).toBe(true);
  });

  it('sanitize telemetry item uri property', () => {
    // Arrange
    const envelope: ITelemetryItem = {
      ver: '1.0',
      name: 'test',
      time: '',
      iKey: '',
      baseType: 'EventData',
      baseData: {
        uri: 'https://test.com/test?#test=test'
      }
    }

    // Act
    const result = sanitizeTelemetryItemUriProperty(envelope);

    // Assert
    expect(result).toBe(true);
  })

  it('sanitize stack trace', () => {
    // Arrange
    const envelope: ITelemetryItem = {
      ver: '1.0',
      name: 'test',
      time: '',
      iKey: '',
      baseType: 'ExceptionData',
      baseData: {
        exceptions: [
          {
            parsedStack: [
              {
                fileName: 'webpack-internal',
                assembly: 'Assembly'
              }
            ],
            stack: '\n First line of test, \n Second line of test'
          }
        ]
      }
    }

    // Act
    const result = sanitizeStackTrace(envelope);

    // Assert
    expect(result).toBe(true);
  })

})