import { IResource } from '../../../../../types/resources';
import content from '../../../../utils/resources/resources.json';
import { createResourcesList, getResourcePaths } from '../resource-explorer.utils';
import { generateAPIManifest } from './api-manifest.util';

const resource = JSON.parse(JSON.stringify(content)) as IResource;

describe('API Manifest should', () => {
  it.only('have requests generated', async () => {
    const version = 'v1.0';
    const filtered = createResourcesList(resource.children, version)[0];
    const item: any = filtered.links[0];
    const paths = getResourcePaths(item, version);
    const manifest = generateAPIManifest(paths, [], 'Application_DelegatedWork');
    expect(manifest.apiDependencies.graph.requests.length).toBe(paths.length);
  });
});