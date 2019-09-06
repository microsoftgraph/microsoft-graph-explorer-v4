import { IAction } from '../../../types/action';
import { IQuery } from '../../../types/query-runner';
import { GET_SNIPPET_SUCCESS } from '../redux-constants';

export function getSnippetSuccess(response: string): IAction {
  return {
    type: GET_SNIPPET_SUCCESS,
    response,
  };
}

export function getSnippet(language: string, sampleQuery: IQuery, dispatch: Function) {
  const sample = { ...sampleQuery };

  if (sample.sampleUrl) {
    const pathname = new URL(sample.sampleUrl).pathname;
    sample.sampleUrl = pathname;
  }

  let url = 'https:graphexplorerapi.azurewebsites.net/api/graphexplorersnippets';

  if (language !== 'csharp') {
    url += `?lang=${language.toLocaleLowerCase()}`;
  }

  // tslint:disable-next-line: max-line-length
  const body = `${sample.selectedVerb} ${sample.sampleUrl} HTTP/1.1\r\nHost: graph.microsoft.com\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(sample.sampleBody)}`;
  const obj: any = {};
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/http'
    },
    body
  }).then(resp => resp.text())
    // tslint:disable-next-line
    .then((result) => {
      obj[language] = result;
      dispatch(getSnippetSuccess(obj));
    });
}
