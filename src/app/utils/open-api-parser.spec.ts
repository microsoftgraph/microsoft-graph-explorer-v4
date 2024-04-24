import { AllOf, AnyOf, Properties, Property } from '../../types/open-api';
import { extractProperties } from './extractProperties';
import { parseOpenApiResponse } from './open-api-parser';
import { getSample } from './open-api-sample';
import { parseSampleUrl } from './sample-url-generation';

function parseResponse() {
  const sampleUrl = 'https://graph.microsoft.com/v1.0/me/calendar';
  const { requestUrl } = parseSampleUrl(sampleUrl);
  return parseOpenApiResponse({
    response: getSample(),
    url: requestUrl
  });
}

function walkProperties(properties: Properties): { [key: string]: any } {
  const result: { [key: string]: string | { [key: string]: string } } = {};
  const primitives = ['string', 'number', 'boolean', 'integer'];

  for (const property in properties) {
    if (Object.prototype.hasOwnProperty.call(properties, property)) {
      const propertyValue: Property = properties[property];
      const type = propertyValue.type;
      if (type) {
        if (primitives.includes(type)) {
          result[property] = type;
        } else if (type === 'array') {
          if (propertyValue.items) {
            if (propertyValue.items.anyOf) {
              processAnyOfs(propertyValue.items.anyOf, property);
            }
            if (propertyValue.items.allOf) {
              processAllOfs(propertyValue.items.allOf, property);
            }
          }
        }
      } else {
        if (propertyValue.anyOf) {
          processAnyOfs(propertyValue.anyOf, property);
        }
      }
    }
  }

  function processAnyOfs(anyOfs: AnyOf[], prop: string) {
    const useableAnyOf = anyOfs[0];
    if (useableAnyOf.properties) {
      result[prop] = walkProperties(useableAnyOf.properties!);
    } else if (useableAnyOf.enum) {
      result[prop] = useableAnyOf.enum.join(' | ');
    }
  }

  function processAllOfs(allOfs: AllOf[], prop: string) {
    const useableAllOfs = allOfs.filter(k => k.title !== 'entity');

    useableAllOfs.forEach(allOf => {
      if (allOf.properties) {
        result[prop] = walkProperties(allOf.properties);
      }
      if (allOf.allOf) {
        processAllOfs(allOf.allOf, prop);
      }
    });
  }

  return result;
}

describe('Open api spec parser should', () => {

  it('generate parameters', async () => {
    const result = parseResponse();
    expect(result.parameters).toBeDefined();
  });

  it('generate request body', async () => {
    const methodValue = getSample().paths['/me/calendar'].patch;
    const properties = extractProperties(methodValue);
    if (!properties) {
      return;
    }
    const result = walkProperties(properties);
    expect(result).toBeDefined();
    expect(Object.keys(result)).toEqual(Object.keys(properties));
  });

});


