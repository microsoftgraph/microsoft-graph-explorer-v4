import { IParsedOpenApiResponse } from '../../types/open-api';
import { storeSuggestionsInCache, getSuggestionsFromCache } from './cache-provider';

describe('Tests cache provider utils for suggestions', () => {
  it('Returns options from local storage which is null because suggestions are expired', async () => {
    const content_ = {
      url: 'https://api.github.com/search/users?q=tom',
      createdAt: '2020-04-01T00:00:00.000Z',
      options: [
        {
          name: 'Tom',
          value: 'tom'
        },
        {
          name: 'Tommy',
          value: 'tommy'
        }
      ]
    };

    const openApiContent: IParsedOpenApiResponse = {
      url: 'https://api.github.com/search/users?q=tom',
      parameters: [
        {
          verb: 'GET',
          values: [
            {
              name: 'q',
              items: ['tom', 'jerry']
            }
          ],
          links: []
        }
      ],
      createdAt: '2020-04-01T00:00:00.000Z'
    }

    const version = 'v1';
    await storeSuggestionsInCache(openApiContent, version);
    return getSuggestionsFromCache(content_.url)
      .then((data) => {
        expect(data).toBeNull();
      })
  });
})