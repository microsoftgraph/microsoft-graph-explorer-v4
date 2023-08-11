import { APIManifest, Access, ManifestRequest } from '../../../../../types/api-manifest';
import { CollectionPermission, ResourcePath } from '../../../../../types/resources';
import { GRAPH_BETA_DESCRIPTION_URL, GRAPH_URL, GRAPH_V1_DESCRIPTION_URL } from '../../../../services/graph-constants';

export function generateAPIManifest(paths: ResourcePath[], permissions: CollectionPermission[],
  scopeType: string): APIManifest {
  return {
    publisher: {
      name: 'Microsoft Graph',
      contactEmail: ''
    },
    apiDependencies: {
      graph:
      {
        apiDescripionUrl: paths[0].version === 'beta' ? GRAPH_BETA_DESCRIPTION_URL : GRAPH_V1_DESCRIPTION_URL,
        auth: {
          clientIdentifier: '',
          access: getAccessFromPermissions(permissions, scopeType)
        },
        requests: getRequestsFromPaths(paths)
      }
    }
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

function getAccessFromPermissions(permissions: CollectionPermission[], scopeType: string): Access[] {
  if(scopeType === 'Application_DelegatedWork'){
    return [createAccessPermissions(permissions, 'Application'), createAccessPermissions(permissions, 'DelegatedWork')];
  }
  return [createAccessPermissions(permissions, scopeType)];
}

function createAccessPermissions(permissions: CollectionPermission[], scopeType: string): Access {
  const type = 'openid';
  return {
    type,
    claims: {
      roles: {
        essential: true,
        values: getScopedList(permissions, scopeType)
      }
    }
  }
}

function getScopedList(permissions: CollectionPermission[], scopeType: string): string[] {
  const list: string[] = [];
  permissions.filter(permission => permission.scopeType.toString() === scopeType).forEach(element => {
    list.push(element.value);
  });
  return list;
}

