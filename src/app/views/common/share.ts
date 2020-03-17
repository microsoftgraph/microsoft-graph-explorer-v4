import { IQuery } from '../../../types/query-runner';
import { getSessionId } from '../../services/graph-client/msal-service';
import { parseSampleUrl } from '../../utils/sample-url-generation';

/**
 * Creates a shareable link
 * @param sampleQuery  The query you want to share ´text´.
 * @param authenticated Optional. Informs the browser that someone is logged in.
 */
export const createShareLink = (sampleQuery: IQuery, authenticated?: boolean): string => {
  const { sampleBody, selectedVerb } = sampleQuery;
  const { queryVersion, requestUrl, sampleUrl, search } = parseSampleUrl(sampleQuery.sampleUrl);

  if (!sampleUrl) {
    return '';
  }

  const url = new URL(sampleUrl);
  const graphUrl = url.origin;
  const language = navigator.language || 'en-US';
  const appUrl = 'https://developer.microsoft.com/' + language + '/graph/graph-explorer/preview';
  /**
   * To ensure backward compatibility the version is removed from the pathname.
   * V3 expects the request query param to not have the version number.
   */
  const graphUrlRequest = requestUrl + search;
  const requestBody = hashEncode(JSON.stringify(sampleBody));

  let shareLink =
  // tslint:disable-next-line:max-line-length
  `${appUrl}?request=${graphUrlRequest}&method=${selectedVerb}&version=${queryVersion}&GraphUrl=${graphUrl}&requestBody=${requestBody}`;

  if (authenticated) {
    const sessionId = getSessionId();
    if (sessionId) {
      shareLink = `${shareLink}&sid=${sessionId}`;
    }
  }

  return shareLink;
};

const hashEncode = (requestBody: string): string => {
  return btoa(requestBody);
};