import { IQuery } from '../../../types/query-runner';

export const createShareLink = (sampleQuery: IQuery): string => {
  const { sampleUrl, sampleBody, selectedVerb, selectedVersion } = sampleQuery;
  const url = new URL(sampleUrl);
  const graphUrl = url.origin;
  const appUrl = 'https://developer.microsoft.com/graph/graph-explorer/preview';
  /**
   * To ensure backward compatibility the version is removed from the pathname.
   * V3 expects the request query param to not have the version number.
   */
  const graphUrlRequest = url.pathname.substr(6) + url.search;
  const requestBody = hashEncode(JSON.stringify(sampleBody));
  return appUrl
    + '?request=' + graphUrlRequest
    + '&method=' + selectedVerb
    + '&version=' + selectedVersion
    + '&GraphUrl=' + graphUrl
    + '&requestBody=' + requestBody;
};

const hashEncode = (requestBody: string): string => {
  return btoa(requestBody);
};