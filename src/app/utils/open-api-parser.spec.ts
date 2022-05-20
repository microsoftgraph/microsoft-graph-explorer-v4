import { parseOpenApiResponse } from './open-api-parser';
import { getSample } from './open-api-sample';
import { parseSampleUrl } from './sample-url-generation';

describe('Open api spec parser should', () => {

  it('generate parameters', async () => {
    const sampleUrl = 'https://graph.microsoft.com/v1.0/me';
    const { requestUrl } = parseSampleUrl(sampleUrl);
    const autoCompleteOptions = getSample();

    let result = null;
    const parameters = {
      response: JSON.parse(autoCompleteOptions),
      url: requestUrl,
      verb: 'GET'
    };
    result = parseOpenApiResponse(parameters);

    expect(result.parameters).toBeDefined();
  });

});


