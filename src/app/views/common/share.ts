import { IQuery } from '../../../types/query-runner';

/**
 * Creates a shareable link
 * @param sampleQuery  The query you want to share ´text´.
 * @param emailAddress Optional. Informs the browser that someone is logged in.
 */
export const createShareLink = (sampleQuery: IQuery, emailAddress?: string): string => {
  const { sampleUrl, sampleBody, selectedVerb, selectedVersion } = sampleQuery;
  const url = new URL(sampleUrl);
  const graphUrl = url.origin;
  const language = navigator.language || 'en-US';
  const appUrl = 'http://localhost:3000';
  // 'https://developer.microsoft.com/' + language + '/graph/graph-explorer/preview';
  /**
   * To ensure backward compatibility the version is removed from the pathname.
   * V3 expects the request query param to not have the version number.
   */
  const graphUrlRequest = url.pathname.substr(6) + url.search;
  const requestBody = hashEncode(JSON.stringify(sampleBody));

  let shareLink = appUrl
    + '?request=' + graphUrlRequest
    + '&method=' + selectedVerb
    + '&version=' + selectedVersion
    + '&GraphUrl=' + graphUrl
    + '&requestBody=' + requestBody;

  if (emailAddress) {
    shareLink = shareLink + '&emailAddress=' + emailAddress;
  }
  return shareLink;
};

const hashEncode = (requestBody: string): string => {
  return btoa(requestBody);
};