import { authenticationWrapper } from '../../../modules/authentication';
import { IQuery } from '../../../types/query-runner';
import { encodeHashCharacters } from '../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../utils/sample-url-generation';

/**
 * Creates a shareable link
 * @param sampleQuery  The query you want to share ´text´.
 * @param authenticated Optional. Informs the browser that someone is logged in.
 */
export const createShareLink = (sampleQuery: IQuery, authenticated?: boolean): string => {
  const { sampleBody, selectedVerb, sampleHeaders } = sampleQuery;
  const { queryVersion, requestUrl, sampleUrl, search } =
    parseSampleUrl(encodeHashCharacters(sampleQuery));

  if (!sampleUrl) {
    return '';
  }

  const url = new URL(sampleUrl);
  const graphUrl = url.origin;
  const appUrl = 'https://developer.microsoft.com/graph/graph-explorer';

  const graphUrlRequest = encodeURIComponent(requestUrl + search);
  let shareLink =
    // tslint:disable-next-line:max-line-length
    `${appUrl}?request=${graphUrlRequest}&method=${selectedVerb}&version=${queryVersion}&GraphUrl=${graphUrl}`;

  if (sampleBody && Object.keys(sampleBody).length > 0) {
    const requestBody = hashEncode(JSON.stringify(sampleBody));
    shareLink = `${shareLink}&requestBody=${requestBody}`;
  }

  if (sampleHeaders && sampleHeaders.length > 0) {
    const headers = hashEncode(JSON.stringify(sampleHeaders));
    shareLink = `${shareLink}&headers=${headers}`;
  }

  if (authenticated) {
    const sessionId = authenticationWrapper.getSessionId();
    if (sessionId) {
      shareLink = `${shareLink}&sid=${sessionId}`;
    }
  }
  return shareLink;
};

const hashEncode = (requestBody: string): string => {
  return btoa(unescape(encodeURIComponent(requestBody)));
};
