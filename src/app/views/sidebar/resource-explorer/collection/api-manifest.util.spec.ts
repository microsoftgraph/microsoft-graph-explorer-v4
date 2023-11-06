import { IResource, IResourceLink } from '../../../../../types/resources';
import content from '../../../../utils/resources/resources.json';
import { createResourcesList, getResourcePaths } from '../resource-explorer.utils';
import { generateAPIManifest } from './api-manifest.util';

const resource = JSON.parse(JSON.stringify(content)) as IResource;

const permissions = {
  'v1.0-DelegatedWork': [
    {
      'value': 'Place.Read.All',
      'scopeType': 'DelegatedWork',
      'consentDisplayName': 'Read all company places',
      'consentDescription': 'Allows the app to read your company\'s places',
      'isAdmin': true,
      'isLeastPrivilege': true,
      'isHidden': false
    },
    {
      'value': 'Place.ReadWrite.All',
      'scopeType': 'DelegatedWork',
      'consentDisplayName': 'Read and write organization places',
      'consentDescription': 'Allows the app to manage organization places',
      'isAdmin': true,
      'isLeastPrivilege': true,
      'isHidden': false
    }
  ]
}

describe('API Manifest should', () => {
  it.only('have requests generated', async () => {
    const version = 'v1.0';
    const scopeType = 'DelegatedWork';
    const filtered = createResourcesList(resource.children!, version)[0];
    const item = filtered.links[0] as IResourceLink;
    const paths = getResourcePaths(item, version);
    const manifest = generateAPIManifest({ paths, permissions });
    expect(manifest.apiDependencies[`graph-${version}-${scopeType}`].requests.length).toBe(paths.length);
  });
});