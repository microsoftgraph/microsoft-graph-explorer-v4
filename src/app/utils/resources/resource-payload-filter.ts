import { IResource } from '../../../types/resources';

export function getResourcesSupportedByVersion(content: IResource, filters: string[]): IResource {
  const resources: IResource = { ...content };
  const children: IResource[] = [];
  resources.children.forEach((child: IResource) => {
    if (labelExists(filters, child)) { children.push(child); }
  });
  resources.children = children;
  return resources;
}

function labelExists(filters: string[], child: IResource) {
  return filters.some(filter => {
    const labelFilter = child.labels.find(k => k.name === filter);
    return labelFilter;
  });
}