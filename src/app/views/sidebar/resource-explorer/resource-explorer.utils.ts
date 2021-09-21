import { IResource } from '../../../../types/resources';

interface ITreeFilter {
  paths: string[];
  level: number;
  resourceItems: IResource[];
  version: string;
}

export function createList(source: IResource[], version: string): any {
  function getIcon({ segment, children }: IResource) {
    const graphFunction = segment.includes('microsoft.graph');
    let icon = null;
    if (graphFunction) {
      icon = 'LightningBolt';
    }
    if (!graphFunction && !children) {
      icon = 'PlugDisconnected';
    }
    return icon;
  }

  function createNavLink(info: IResource, parent: string | null = null, paths: string[] = []): any {
    const { segment, children, labels } = info;
    const level = paths.length;
    const versionedChildren = (children) ? children.filter(child => versionExists(child, version)) : [];
    return {
      key: `${level}-${parent}-${segment}`,
      name: `${segment} ${(versionedChildren && versionedChildren.length > 0) ? `(${versionedChildren.length})` : ''}`,
      labels,
      isExpanded: false,
      parent,
      level,
      paths,
      icon: getIcon(info),
      links: (children) ? versionedChildren.map(child => createNavLink(child, segment, [...paths, segment])) : []
    };
  }

  const navLink = createNavLink({
    segment: '/',
    labels: [],
    children: source
  })

  return [
    {
      isExpanded: false,
      links: navLink.links
    }
  ];
}

export function getCurrentTree({ paths, level, resourceItems, version }: ITreeFilter) {
  let currentTree = createList(resourceItems, version)[0];
  const filters = paths.slice(1, level + 1);
  filters.forEach((key: string) => {
    const linkedKey = findLinkByName(currentTree, key);
    if (linkedKey) {
      currentTree = linkedKey;
    }
  });
  return currentTree;
}

function findLinkByName(list: any, filter: string): any {
  return list.links.find((k: any) => removeCounter(k.name) === filter);
}

export function removeCounter(title: string) {
  return title.split(' (')[0].trim();
}

export function getResourcesSupportedByVersion(content: IResource, version: string): IResource {
  const resources: IResource = { ...content };
  const children: IResource[] = [];
  resources.children.forEach((child: IResource) => {
    if (versionExists(child, version)) { children.push(child); }
  });
  resources.children = children;
  return resources;
}

export function versionExists(child: IResource, version: string) {
  return !!child.labels.find(k => k.name === version);
}