import { IQuery } from '../../../../../types/query-runner';
import { IRequestOptions } from '../../../../../types/request';

export function fetchScopes(sample: IQuery): Promise<any> {
    const { sampleUrl, selectedVerb } = sample;
    const urlObject: URL = new URL(sampleUrl);
    // remove the prefix i.e. beta or v1.0 and any possible extra '/' character at the end
    const requestUrl = urlObject.pathname.substr(5).replace(/\/$/, '');
    const permissionsUrl = 'https://graphexplorerapi.azurewebsites.net/api/GraphExplorerPermissions?requesturl=' +
      requestUrl + '&method=' + selectedVerb;

    const headers = {
      'Content-Type': 'application/json',
    };

    const options: IRequestOptions = { headers };

    return fetch(permissionsUrl, options)
      .then(res => res.json());
}
