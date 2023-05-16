import { IResourceLink, Method } from '../../../../../types/resources';
const DEVX_API_URL = 'https://graphexplorerapi-staging.azurewebsites.net/api/permissions';

async function getCollectionPermissions(paths: IResourceLink[]) {
  const requests: any[] = [];

  paths.forEach(path => {
    const { method, url } = path;
    requests.push({
      method: method as Method,
      requestUrl: url
    });
  });

  const response = await fetch(DEVX_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requests)
  });
  const perms = await response.json();
  return perms;
}

export { getCollectionPermissions };