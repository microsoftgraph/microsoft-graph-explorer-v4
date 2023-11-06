import { APIManifest, Access, ApiDependencies, ManifestRequest } from '../../../../../types/api-manifest';
import { CollectionPermission, ResourcePath } from '../../../../../types/resources';
import { GRAPH_BETA_DESCRIPTION_URL, GRAPH_URL, GRAPH_V1_DESCRIPTION_URL } from '../../../../services/graph-constants';
import { scopeOptions } from './collection.util';

interface ManifestProps {
  paths: ResourcePath[];
  permissions?: {
    [key: string]: CollectionPermission[];
  };
}

export function generateAPIManifest({ paths, permissions }: ManifestProps): APIManifest {
  return {
    publisher: {
      name: 'Microsoft Graph',
      contactEmail: 'graphsdkpub@microsoft.com'
    },
    apiDependencies: getDependenciesFromPaths({ paths, permissions })
  };
}

function getDependenciesFromPaths({ paths, permissions }: ManifestProps): ApiDependencies {

  const dependencies: ApiDependencies = {};
  const variants = Object.keys(permissions!);

  variants.forEach(variant => {
    const dependencyName = `graph-${variant}`;
    const accessPermissions = permissions ? permissions[variant] : [];
    const version = variant.split('-')[0];
    const scopeType = variant.split('-')[1];
    dependencies[dependencyName] = {
      apiDescriptionUrl: version === 'beta' ? GRAPH_BETA_DESCRIPTION_URL : GRAPH_V1_DESCRIPTION_URL,
      apiDeploymentBaseUrl: GRAPH_URL,
      apiDescriptionVersion: version,
      auth: {
        clientIdentifier: '',
        access: getAccessFromPermissions(accessPermissions, scopeType)
      },
      requests: getRequestsFromPaths(paths, version, scopeType)
    }
  });

  return dependencies;
}

function getRequestsFromPaths(paths: ResourcePath[], version: string, scopeType: string): ManifestRequest[] {
  const requests: ManifestRequest[] = [];
  paths.forEach(path => {
    const { method, url } = path;
    path.scope = path.scope ? path.scope : scopeOptions[0].key;
    if (path.version === version && path.scope === scopeType) {
      requests.push({
        method: method!.toString().toUpperCase(),
        uriTemplate: `${url}`
      });
    }
  });
  return requests;
}

function getAccessFromPermissions(permissions: CollectionPermission[], scopeType: string): Access[] {
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

