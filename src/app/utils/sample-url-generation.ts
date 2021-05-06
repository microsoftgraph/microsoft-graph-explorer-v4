export function parseSampleUrl(url: string, version?: string) {
  let requestUrl = '';
  let queryVersion = '';
  let sampleUrl = '';
  let search = '';

  if (url !== '') {
    try {
      const urlObject: URL = new URL(url);
      const { origin } = urlObject;
      queryVersion = (version) ? version : getGraphVersion(url);
      requestUrl = getRequestUrl(url, queryVersion);
      search = generateSearchParameters(urlObject, search);
      sampleUrl = `${origin}/${queryVersion}/${requestUrl + search}`;
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

export function getRequestUrl(url: string, version: string): string {
  const { pathname } = new URL(url);
  const requestContent = pathname.split(version + '/').pop();
  return decodeURIComponent(requestContent!.replace(/\/$/, ''));
}

export function getGraphVersion(url: string): string {
  const urlObject: URL = new URL(url);
  const parts = urlObject.pathname.substring(1).split('/');
  return parts[0];
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
