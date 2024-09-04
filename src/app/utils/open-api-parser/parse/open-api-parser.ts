import {
  IOpenApiParseContent,
  IParameterValue,
  IParameters,
  IParsedOpenApiResponse,
  IQueryParameter,
  MethodValue
} from '../../../../types/open-api';
import { generateRequestBody } from './request-body';

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
        requestBody[verb] = generateRequestBody(methodValue);
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
