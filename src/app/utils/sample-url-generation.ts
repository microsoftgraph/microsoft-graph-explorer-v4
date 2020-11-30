import { GRAPH_URL } from '../services/graph-constants';

export function parseSampleUrl(url: string, version?: string) {
  let requestUrl = '';
  let queryVersion = '';
  let sampleUrl = '';
  let search = '';

  if (url !== '') {
    try {
      const urlObject: URL = new URL(url);
      requestUrl = decodeURIComponent(urlObject.pathname.substr(6).replace(/\/$/, ''));
      queryVersion = (version) ? version : urlObject.pathname.substring(1, 5);
      search = generateSearchParameters(urlObject, search);
      sampleUrl = `${GRAPH_URL}/${queryVersion}/${requestUrl + search}`;
    } catch (error) {
      if (error.message === `Failed to construct 'URL': Invalid URL`) {
        return {
          queryVersion, requestUrl, sampleUrl, search
        };
      }
    }
  }

  return {
    queryVersion, requestUrl, sampleUrl, search
  };
}

function generateSearchParameters(urlObject: URL, search: string) {
  const searchParameters = urlObject.search;
  if (searchParameters) {
    try {
      search = decodeURI(searchParameters);
    }
    catch (error) {
      if (error.message === 'URI malformed') {
        search = searchParameters;
      }
    }
  }
  return search;
}

