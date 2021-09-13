import { filterResourcePayloadByCloud } from '../../app/utils/resources/resource-payload-filter';
import content from '../../app/utils/resources/resources.json';

describe('Resource payload should', () => {
  it('have content', async () => {
    const resources: any = { ...content };
    expect(resources.children.length).toBe(142);
  });

  it('return content with selected clouds', async () => {
    const clouds = ['v1.0-Prod', 'beta-Prod'];
    const resources = filterResourcePayloadByCloud(content, clouds);
    expect(resources.children.length).toBe(127);
  });
});