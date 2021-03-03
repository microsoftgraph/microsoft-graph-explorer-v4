import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { componentNames, errorTypes, telemetry } from '../../../telemetry';
import { IAction } from '../../../types/action';
import { sanitizeQueryUrl } from '../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../utils/sample-url-generation';
import { GET_SNIPPET_ERROR, GET_SNIPPET_PENDING, GET_SNIPPET_SUCCESS } from '../redux-constants';

export function getSnippetSuccess(response: string): IAction {
  return {
    type: GET_SNIPPET_SUCCESS,
    response,
  };
}

export function getSnippetError(response: string): IAction {
  return {
    type: GET_SNIPPET_ERROR,
    response,
  };
}

export function getSnippetPending(): any {
  return {
    type: GET_SNIPPET_PENDING
  };
}

export function getSnippet(language: string): Function {
  return async (dispatch: Function, getState: Function) => {
    const { devxApi, sampleQuery } = getState();
    try {
      let snippetsUrl = `${devxApi.baseUrl}/api/graphexplorersnippets`;

      const { requestUrl, sampleUrl, queryVersion, search } = parseSampleUrl(sampleQuery.sampleUrl);
      if (!sampleUrl) {
        throw new Error('url is invalid');
      }
      if (language !== 'csharp') {
        snippetsUrl += `?lang=${language}`;
      }

      dispatch(getSnippetPending());

      // tslint:disable-next-line: max-line-length
      const body = `${sampleQuery.selectedVerb} /${queryVersion}/${requestUrl + search} HTTP/1.1\r\nHost: graph.microsoft.com\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(sampleQuery.sampleBody)}`;
      const obj: any = {};
      const response = await fetch(snippetsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/http'
        },
        body
      });
      if (response.ok) {
        const result = await response.text();
        obj[language] = result;
        return dispatch(getSnippetSuccess(obj));
      }
      throw (response);
    } catch (error) {
      const sanitizedUrl = sanitizeQueryUrl(sampleQuery.sampleUrl);
      telemetry.trackException(
        new Error(errorTypes.NETWORK_ERROR),
        SeverityLevel.Error,
        {
          ComponentName: componentNames.GET_SNIPPET_ACTION,
          QuerySignature: `${sampleQuery.selectedVerb} ${sanitizedUrl}`,
          Message: `${error}`
        }
      );
      return dispatch(getSnippetError(error));
    }
  };
}
