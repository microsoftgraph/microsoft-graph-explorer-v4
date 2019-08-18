import { IAction } from '../../../types/action';
import { GET_SNIPPET_SUCCESS } from '../redux-constants';

export function getSnippetSuccess(response: string): IAction {
    return {
        type: GET_SNIPPET_SUCCESS,
        response,
    };
}

export function getSnippet(language: string) {
    const url = `https:graphexplorerapi.azurewebsites.net/api/graphexplorersnippets?lang=${language}`;
    // tslint:disable-next-line: max-line-length
    const body = `DELETE /beta/directory/featureRolloutPolicies/df85e4d9-e8c4-4033-a41c-73419a95c29c HTTP/1.1\r\nHost: graph.microsoft.com\r\nContent-Type: application/json`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/http'
        },
        body
        // tslint:disable-next-line
    }).then(resp => console.log(resp));
}