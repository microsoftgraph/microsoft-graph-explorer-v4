import fetch from 'isomorphic-fetch';

import { createAnonymousRequest } from '../app/services/actions/query-action-creator-util';
import { GRAPH_API_SANDBOX_ENDPOINT_URL } from '../app/services/graph-constants';
import { isValidHttpsUrl } from '../app/utils/external-link-validation';
import { IQuery } from '../types/query-runner';
import { IStatus } from '../types/status';

describe.skip('Sandbox api fetch should', () => {

  test('return valid url', async () => {
    const res = await fetch(GRAPH_API_SANDBOX_ENDPOINT_URL);
    const proxyUrl = await res.json();
    expect(isValidHttpsUrl(proxyUrl)).toBe(true);  // Success!
  });

  test('return valid url and use to make call to proxy', async () => {
    const res = await fetch(GRAPH_API_SANDBOX_ENDPOINT_URL);
    const proxyUrl = await res.json();

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
