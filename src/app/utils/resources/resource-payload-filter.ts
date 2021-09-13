import { IResource } from '../../../types/resources';

export function filterResourcePayloadByCloud(content: any, clouds?: string[]): IResource {
  const resources: IResource = { ...content };
  const children: IResource[] = [];
  if (clouds) {
    resources.children.forEach((child: IResource) => {
      const cloudSupported = clouds.some(cloud => {
        return child.label.includes(cloud);
      });
      if (cloudSupported) {
        children.push(child);
      }
    });
    resources.children = children;
  }
  return resources;
}