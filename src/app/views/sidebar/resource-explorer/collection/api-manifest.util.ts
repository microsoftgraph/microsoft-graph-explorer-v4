import { APIManifest, Access, ApiDependencies, ManifestRequest } from '../../../../../types/api-manifest';
import { CollectionPermission, ResourcePath } from '../../../../../types/resources';
import { GRAPH_BETA_DESCRIPTION_URL, GRAPH_URL, GRAPH_V1_DESCRIPTION_URL } from '../../../../services/graph-constants';
import { getVersionsFromPaths } from './collection.util';

interface ManifestProps {
  paths: ResourcePath[];
  permissions?: {
    [key: string]: CollectionPermission[];
  };
  scopeType: string;
}

export function generateAPIManifest({ paths, permissions, scopeType }: ManifestProps): APIManifest {
  return {
    publisher: {
      name: 'Microsoft Graph',
      contactEmail: 'graphsdkpub@microsoft.com'
    },
    apiDependencies: getDependenciesFromPaths({ paths, permissions, scopeType })
  };
}

function getDependenciesFromPaths({ paths, permissions, scopeType }: ManifestProps): ApiDependencies {

  const dependencies: ApiDependencies = {};
  const versions: string[] = getVersionsFromPaths(paths);

  versions.forEach(version => {
    const dependencyName = `graph-${version}`;
    const accessPermissions = permissions ? permissions[version] : [];
    dependencies[dependencyName] = {
      apiDescriptionUrl: version === 'beta' ? GRAPH_BETA_DESCRIPTION_URL : GRAPH_V1_DESCRIPTION_URL,
      apiDeploymentBaseUrl: GRAPH_URL,
      apiDescriptionVersion: version,
      auth: {
        clientIdentifier: '',
        access: getAccessFromPermissions(accessPermissions, scopeType)
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
  if (scopeType === 'Application') {
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
  return {
    type,
    claims: {
      scp: {
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

