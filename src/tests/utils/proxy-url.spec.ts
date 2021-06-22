import { GRAPH_API_SANDBOX_ENDPOINT_URL, GRAPH_API_SANDBOX_KEY, GRAPH_API_SANDBOX_URL } from "../../app/services/graph-constants";
import fetch from "isomorphic-fetch";
import { isValidHttpsUrl } from "../../app/utils/external-link-validation";

describe('Sandbox api fetch should', () => {

  test('return valid url', async () => {
    const res = await fetch(GRAPH_API_SANDBOX_ENDPOINT_URL);
    const proxyUrl = await res.json();
    expect(isValidHttpsUrl(proxyUrl)).toBe(true);  // Success!
  });

  test('return valid url and use to make call to proxy', async () => {
    const res = await fetch(GRAPH_API_SANDBOX_ENDPOINT_URL);
    const proxyUrl = await res.json();

    const sampleUrl = 'https://graph.microsoft.com/v1.0/me';
    const escapedUrl = encodeURIComponent(sampleUrl);
    const graphUrl = `${proxyUrl}?url=${escapedUrl}`;

    const headers = {
      'Content-Type': 'application/json',
      SdkVersion: 'GraphExplorer/4.0',
      Authorization: '',
      'MS-M365DEVPORTALS-API-KEY': ''
    };

    if (proxyUrl === GRAPH_API_SANDBOX_URL) {
      const authToken = '{token:https://graph.microsoft.com/}';
      headers.Authorization = `Bearer ${authToken}`;
    } else {
      headers['MS-M365DEVPORTALS-API-KEY'] = GRAPH_API_SANDBOX_KEY;
    }

    const response = await fetch(graphUrl, { headers });
    expect(response.ok).toBe(true);
  });

});
