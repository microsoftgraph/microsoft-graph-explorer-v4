import { APIManifest, ManifestRequest } from '../../../../../types/api-manifest';
import { ResourcePath } from '../../../../../types/resources';
import { GRAPH_BETA_DESCRIPTION_URL, GRAPH_URL, GRAPH_V1_DESCRIPTION_URL } from '../../../../services/graph-constants';

export function generateAPIManifest(paths: ResourcePath[]): APIManifest {
  return {
    publisher: {
      name: 'Microsoft Graph',
      contactEmail: ''
    },
    apiDependencies: [
      {
        apiDescripionUrl: paths[0].version === 'beta' ? GRAPH_BETA_DESCRIPTION_URL : GRAPH_V1_DESCRIPTION_URL,
        auth: {
          clientId: '',
          permissions: {
            delegated: [],
            application: []
          }
        },
        requests: getRequestsFromPaths(paths)
      }
    ]
  };
}

function getRequestsFromPaths(paths: ResourcePath[]): ManifestRequest[] {
  const requests: ManifestRequest[] = [];
  paths.forEach(path => {
    const { version, method, url } = path;
    requests.push({
      method: method!.toString().toUpperCase(),
      uriTemplate: `${GRAPH_URL}/${version}${url}`
    });
  });
  return requests;
}
