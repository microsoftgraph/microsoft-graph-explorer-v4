import { parseOpenApiResponse } from '../../app/utils/open-api-parser';
import { parseSampleUrl } from '../../app/utils/sample-url-generation';
import { getSample } from './open-api-sample';


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


