import { AllOf, AnyOf, MethodValue, Properties } from '../../../../types/open-api';

function generateRequestBody(methodValue: MethodValue): { [key: string]: any } | null {
  const properties = extractProperties(methodValue);
  if (!properties) {
    return null;
  }
  return walkProperties(properties);
}

function extractProperties(methodValue: MethodValue): Properties | null | undefined {
  if (!methodValue.requestBody) {
    return null;
  }

  if (!methodValue.requestBody.content || !methodValue.requestBody.content['application/json']) {
    return null;
  }

  const schema = methodValue.requestBody.content['application/json']?.schema;
  if (schema.properties) {
    return schema.properties;
  }
  if (schema.allOf) {
    return schema.allOf
      .filter(k => k.title !== 'entity')[0].properties;
  }
}

function walkProperties(properties: Properties): { [key: string]: any } {
  const result: { [key: string]: string | { [key: string]: string } } = {};
  const primitives = ['string', 'number', 'boolean', 'integer'];

  Object.entries(properties).forEach(([property, propertyValue]) => {
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
  });

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

export {
  generateRequestBody
}
