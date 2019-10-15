import { GRAPH_URL } from '../services/graph-constants';

export function parseSampleUrl(url: string, version?: string) {
  const urlObject: URL = new URL(url);
  const requestUrl = urlObject.pathname.substr(6).replace(/\/$/, '');
  const queryVersion = (version) ? version : urlObject.pathname.substring(1, 5);
  const search = decodeURI(urlObject.search);
  const sampleUrl = `${GRAPH_URL}/${queryVersion}/${requestUrl + search}`;
  return { queryVersion, requestUrl, sampleUrl, search };
}
