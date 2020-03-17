import { IQuery } from '../../../../../types/query-runner';
import { IRequestOptions } from '../../../../../types/request';
import { parseSampleUrl } from '../../../../utils/sample-url-generation';

export function fetchScopes(sample: IQuery): Promise<any> {
  const { requestUrl, sampleUrl } = parseSampleUrl(sample.sampleUrl);
  if (!sampleUrl) {
    Promise.reject('url is invalid');
  }

  const permissionsUrl = 'https://graphexplorerapi.azurewebsites.net/api/GraphExplorerPermissions?requesturl=/' +
    requestUrl + '&method=' + sample.selectedVerb;

  const headers = {
    'Content-Type': 'application/json',
  };

  const options: IRequestOptions = { headers };

  return fetch(permissionsUrl, options)
    .then(res => res.json());
}
