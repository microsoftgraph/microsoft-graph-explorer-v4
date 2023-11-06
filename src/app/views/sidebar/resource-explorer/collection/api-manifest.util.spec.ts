import { IResource } from '../../../../../types/resources';
import content from '../../../../utils/resources/resources.json';
import { createResourcesList, getResourcePaths } from '../resource-explorer.utils';
import { generateAPIManifest } from './api-manifest.util';

const resource = JSON.parse(JSON.stringify(content)) as IResource;

describe('API Manifest should', () => {
  it.only('have requests generated', async () => {
    const version = 'v1.0';
    const scopeType = 'DelegatedWork';
    const filtered = createResourcesList(resource.children!, version)[0];
    const item: any = filtered.links[0];
    const paths = getResourcePaths(item, version);
    const manifest = generateAPIManifest({ paths, permissions: undefined });
    expect(manifest.apiDependencies[`graph-${version}-${scopeType}`].requests.length).toBe(paths.length);
  });
});