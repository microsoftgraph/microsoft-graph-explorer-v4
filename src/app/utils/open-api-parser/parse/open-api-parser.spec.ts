import { parseSampleUrl } from '../../sample-url-generation';
import { parseOpenApiResponse } from './open-api-parser';
import { getSample } from './open-api-sample';
import { generateRequestBody } from './request-body';

function parseResponse() {
  const sampleUrl = 'https://graph.microsoft.com/v1.0/me/calendar';
  const { requestUrl } = parseSampleUrl(sampleUrl);
  return parseOpenApiResponse({
    response: getSample(),
    url: requestUrl
  });
}

describe('Open api spec parser should', () => {

  it('generate parameters', async () => {
    const result = parseResponse();
    expect(result.parameters).toBeDefined();
    expect(result.requestBody).toBeDefined();
  });

  it('generate request body', async () => {
    const methodValue = getSample().paths['/me/calendar'].patch;
    const requestBody = generateRequestBody(methodValue);
    expect(requestBody).toBeDefined();
  });

});


