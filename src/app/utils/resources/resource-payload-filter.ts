import { IResource } from '../../../types/resources';

export function filterResourcesByLabel(content: IResource, filters: string[]): IResource {
  const resources: IResource = { ...content };
  const children: IResource[] = [];
  resources.children.forEach((child: IResource) => {
    const labelExists = filters.some(cloud => {
      return child.label.some(label => {
        return label.includes(cloud);
      });
    });
    if (labelExists) {
      children.push(child);
    }
  });
  resources.children = children;
  return resources;
}