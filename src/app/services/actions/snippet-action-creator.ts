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
    const url = `https:graphexplorerapi.azurewebsites.net/api/graphexplorersnippets?lang=javascript`;
    // tslint:disable-next-line: max-line-length
    const body = `DELETE /beta/directory/featureRolloutPolicies/df85e4d9-e8c4-4033-a41c-73419a95c29c HTTP/1.1\r\nHost: graph.microsoft.com\r\nContent-Type: application/json\r\n\r\n`;

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/http'
        },
        body
    }).then(resp => resp.text())
        // tslint:disable-next-line
        .then((result) => console.log(result));
}