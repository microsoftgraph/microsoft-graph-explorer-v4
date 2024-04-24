import { MethodValue, Properties } from '../../types/open-api';

export function extractProperties(methodValue: MethodValue): Properties | null | undefined {
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
