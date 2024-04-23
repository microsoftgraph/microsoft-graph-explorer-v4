import {
  AllOf,
  IOpenApiParseContent,
  IParameterValue,
  IParameters,
  IParsedOpenApiResponse,
  IQueryParameter,
  MethodValue
} from '../../types/open-api';

export function parseOpenApiResponse(
  params: IOpenApiParseContent
): IParsedOpenApiResponse {
  const {
    response,
    url
  } = params;

  try {
    const parameters: IParameters[] = [];
    const requestUrl = `/${url}`;
    const verbs = Object.keys(response.paths[`${requestUrl}`]);
    const pathValues: any = Object.values(response.paths)[0];
    const requestBody: { [method: string]: any } = {}

    verbs.forEach((verb: string) => {
      const methodValue: MethodValue = pathValues[`${verb}`];
      if (methodValue.requestBody) {
        requestBody[verb] = extractProperties(methodValue);
      }
      parameters.push({
        verb,
        values: getVerbParameterValues(methodValue),
        links: getLinkValues(methodValue)
      });
    });

    const createdAt = new Date().toISOString();
    return { url, parameters, createdAt, requestBody };
  } catch (error: any) {
    throw new Error(error);
  }
}

function extractProperties(methodValue: MethodValue): any {
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
    return extractPropertiesFromSchema(schema.allOf
      .filter(k => k.title !== 'entity')[0]);
  }
}

function extractPropertiesFromSchema(allOf: AllOf): any {
  return allOf.properties;
}

function getVerbParameterValues(values: MethodValue): IParameterValue[] {
  const parameterValues: IParameterValue[] = [];
  const queryParameters = values.parameters;
  if (queryParameters && queryParameters.length > 0) {
    queryParameters.forEach((parameter: IQueryParameter) => {
      if (parameter.name && parameter.in === 'query') {
        parameterValues.push({
          name: parameter.name,
          items:
            parameter.schema && parameter.schema.items
              ? parameter.schema.items.enum
              : []
        });
      }
    });
  }
  return parameterValues;
}

function getLinkValues(values: MethodValue): string[] {
  const responses = values.responses;
  if (responses) {
    const responsesAtIndex200 = responses['200'];
    if (responsesAtIndex200 && responsesAtIndex200.links) {
      return Object.keys(responsesAtIndex200.links);
    }
  }
  return [];
}
