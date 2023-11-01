import { APIManifest, Access, ApiDependencies, ManifestRequest } from '../../../../../types/api-manifest';
import { CollectionPermission, ResourcePath } from '../../../../../types/resources';
import { GRAPH_BETA_DESCRIPTION_URL, GRAPH_URL, GRAPH_V1_DESCRIPTION_URL } from '../../../../services/graph-constants';

export function generateAPIManifest(paths: ResourcePath[], permissions: CollectionPermission[],
  scopeType: string): APIManifest {
  return {
    publisher: {
      name: 'Microsoft Graph',
      contactEmail: 'graphsdkpub@microsoft.com'
    },
    apiDependencies: getDependenciesFromPaths(paths, permissions, scopeType)
  };
}

function getDependenciesFromPaths(paths: ResourcePath[], permissions: CollectionPermission[],
  scopeType: string): ApiDependencies {

  const dependencies: ApiDependencies = {};
  const versions: string[] = [];
  paths.forEach(path => {
    if (!versions.includes(path.version!)) {
      versions.push(path.version!);
    }
  });

  versions.forEach(version => {
    const dependencyName = `graph-${version}`
    dependencies[dependencyName] = {
      apiDescriptionUrl: version === 'beta' ? GRAPH_BETA_DESCRIPTION_URL : GRAPH_V1_DESCRIPTION_URL,
      apiDeploymentBaseUrl: GRAPH_URL,
      apiDescriptionVersion: version,
      auth: {
        clientIdentifier: '',
        access: getAccessFromPermissions(permissions, scopeType)
      },
      requests: getRequestsFromPaths(paths, version)
    }
  });

  return dependencies;
}

function getRequestsFromPaths(paths: ResourcePath[], version: string): ManifestRequest[] {
  const requests: ManifestRequest[] = [];
  paths.forEach(path => {
    const { method, url } = path;
    if (path.version === version) {
      requests.push({
        method: method!.toString().toUpperCase(),
        uriTemplate: `${url}`
      });
    }
  });
  return requests;
}

function getAccessFromPermissions(permissions: CollectionPermission[], scopeType: string): Access[] {
  if (scopeType === 'Application_DelegatedWork') {
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

