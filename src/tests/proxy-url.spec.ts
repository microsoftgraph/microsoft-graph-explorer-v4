// MODIFIED: Updated test to validate direct proxy endpoint configuration instead of dynamic fetching
import fetch from 'isomorphic-fetch';

import { createAnonymousRequest } from '../app/services/actions/query-action-creator-util';
import { GRAPH_API_PROXY_ENDPOINT } from '../app/services/graph-constants';
import { isValidHttpsUrl } from '../app/utils/external-link-validation';
import { IQuery } from '../types/query-runner';
import { IStatus } from '../types/status';

describe.skip('Proxy endpoint should', () => {

  test('be a valid url', () => {
    expect(isValidHttpsUrl(GRAPH_API_PROXY_ENDPOINT)).toBe(true);
  });

  test('be able to make call to proxy with valid endpoint', async () => {
    const proxyUrl = GRAPH_API_PROXY_ENDPOINT;

    const query: IQuery = {
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      sampleHeaders: [],
      selectedVerb: 'GET',
      selectedVersion: 'v1.0',
      sampleBody: ''
    }

    const queryRunnerStatus: IStatus = {
      messageBarType: 'error',
      ok: false,
      status: 400,
      statusText: '',
      duration: 100,
      hint: ''
    }

    const { graphUrl, options } = createAnonymousRequest(query, proxyUrl, queryRunnerStatus);
    const response = await fetch(graphUrl, options);
    expect(response.ok).toBe(true);
  });

});
