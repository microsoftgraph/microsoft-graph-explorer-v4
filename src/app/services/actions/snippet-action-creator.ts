import { AppAction } from '../../../types/action';
import { Header, IQuery } from '../../../types/query-runner';
import { IRequestOptions } from '../../../types/request';
import { parseSampleUrl } from '../../utils/sample-url-generation';
import {
  GET_SNIPPET_ERROR,
  GET_SNIPPET_PENDING,
  GET_SNIPPET_SUCCESS,
  SET_SNIPPET_TAB_SUCCESS
} from '../redux-constants';

export function getSnippetSuccess(response: string): AppAction {
  return {
    type: GET_SNIPPET_SUCCESS,
    response
  };
}

export function getSnippetError(response: object): AppAction {
  return {
    type: GET_SNIPPET_ERROR,
    response
  };
}

export function getSnippetPending(): AppAction {
  return {
    type: GET_SNIPPET_PENDING,
    response: null
  };
}

export function setSnippetTabSuccess(response: string): AppAction {
  return {
    type: SET_SNIPPET_TAB_SUCCESS,
    response
  }
}

export function getSnippet(language: string) {
  return async (dispatch: Function, getState: Function) => {
    const { devxApi, sampleQuery } = getState();

    try {
      let snippetsUrl = `${devxApi.baseUrl}/api/graphexplorersnippets`;

      const { requestUrl, sampleUrl, queryVersion, search } = parseSampleUrl(
        sampleQuery.sampleUrl
      );
      if (!sampleUrl) {
        throw new Error('url is invalid');
      }
      if (language !== 'csharp') {
        snippetsUrl += `?lang=${language}`;
      }
      const openApiSnippets: string[] = ['go', 'powershell'];
      if (openApiSnippets.includes(language)) {
        snippetsUrl += '&generation=openapi';
      }

      dispatch(getSnippetPending());

      const method = 'POST';
      const headers = {
        'Content-Type': 'application/http'
      };

      const requestBody =
        sampleQuery.sampleBody &&
          Object.keys(sampleQuery.sampleBody).length !== 0
          ? JSON.stringify(sampleQuery.sampleBody)
          : '';

      const httpVersion = 'HTTP/1.1';
      const host = 'Host: graph.microsoft.com';
      const sampleHeaders = constructHeaderString(sampleQuery);

      // eslint-disable-next-line max-len
      let body = `${sampleQuery.selectedVerb} /${queryVersion}/${requestUrl + search} ${httpVersion}\r\n${host}\r\n${sampleHeaders}\r\n\r\n`;
      if (sampleQuery.selectedVerb !== 'GET') {
        body += `${requestBody}`;
      }

      const options: IRequestOptions = { method, headers, body };
      const obj: any = {};

      const response = await fetch(snippetsUrl, options);
      if (response.ok) {
        const result = await response.text();
        obj[language] = result;
        return dispatch(getSnippetSuccess(obj));
      }
      throw response;
    } catch (error) {
      return dispatch(getSnippetError({ error, language }));
    }
  };
}

export function constructHeaderString(sampleQuery: IQuery): string {
  const { sampleHeaders, selectedVerb } = sampleQuery;
  let headersString = '';

  const isContentTypeInHeaders: boolean = !!(sampleHeaders.find(header =>
    header.name.toLocaleLowerCase() === 'content-type'));

  if (sampleHeaders && sampleHeaders.length > 0) {
    headersString = getHeaderStringProperties(sampleHeaders);
  }

  headersString += !isContentTypeInHeaders && selectedVerb !== 'GET' ? 'Content-Type: application/json\r\n' : '';
  return headersString;
}

function getHeaderStringProperties(sampleHeaders: Header[]): string {
  let constructedHeader = ''
  sampleHeaders.forEach((header: Header) => {
    constructedHeader += `${header.name}: ${header.value}\r\n`;
  });
  return constructedHeader;
}