import { IQuery } from '../../../types/query-runner';
import { getSessionId } from '../../services/graph-client/msal-service';

export const createShareLink = (sampleQuery: IQuery, authenticated?: boolean): string => {
  const { sampleUrl, sampleBody, selectedVerb, selectedVersion } = sampleQuery;
  const url = new URL(sampleUrl);
  const graphUrl = url.origin;
  const language = navigator.language || 'en-US';
  const appUrl = 'https://developer.microsoft.com/' + language + '/graph/graph-explorer/preview';
  /**
   * To ensure backward compatibility the version is removed from the pathname.
   * V3 expects the request query param to not have the version number.
   */
  const graphUrlRequest = url.pathname.substr(6) + url.search;
  const requestBody = hashEncode(JSON.stringify(sampleBody));

  let shareLink = `${appUrl}
    ?request=${graphUrlRequest}
    &method=${selectedVerb}
    &version=${selectedVersion}
    &GraphUrl=${graphUrl}
    &requestBody=${requestBody}`;

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