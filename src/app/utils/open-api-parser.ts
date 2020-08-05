export function parseOpenApiResponse(params: any) {
  const { options: { paths }, url } = params;

  try {
    const parameters: any[] = [];
    const requestUrl = Object.keys(paths)[0];
    const verbs = Object.keys(paths[`${requestUrl}`]);
    const pathValues: any = Object.values(paths)[0];

    verbs.forEach((verb: string) => {
      parameters.push({
        verb,
        values: getVerbParameterValues(pathValues[`${verb}`]),
        links: getLinkValues(pathValues[`${verb}`])
      });
    });

    return { url, parameters };
  } catch (error) {
    return { error };
  }
}

function getVerbParameterValues(values: any) {
  const parameterValues: any[] = [];
  const queryParameters = values.parameters;
  if (queryParameters && queryParameters.length > 0) {
    queryParameters.forEach((parameter: any) => {
      if (parameter.name && parameter.in === 'query') {
        parameterValues.push({
          name: parameter.name,
          items: (parameter.schema && parameter.schema.items) ? parameter.schema.items.enum : []
        });
      }
    });
  }
  return parameterValues;
}

function getLinkValues(values: any) {
  const responses = values.responses;
  if (responses) {
    const responsesAtIndex200 = responses['200'];
    if (responsesAtIndex200 && responsesAtIndex200.links) {
      const links = Object.keys(responsesAtIndex200.links);
      return links;
    }
  }
  return [];
}