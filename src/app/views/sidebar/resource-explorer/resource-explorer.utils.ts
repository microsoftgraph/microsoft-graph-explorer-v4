import { IResource } from '../../../../types/resources';

export function createList(source: IResource[]) {
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
    const { segment, children } = info;
    const name = `${segment} ${(children) ? `(${children.length})` : ''}`;
    const level = paths.length;
    return {
      key: `${level}-${parent}-${segment}`,
      name,
      isExpanded: false,
      parent,
      level,
      paths,
      icon: getIcon(info),
      links: (children) ? children.map(child => createNavLink(child, segment, [...paths, segment])) : []
    };
  }

  const navLink = createNavLink({
    segment: '/',
    label: [],
    children: source
  })

  return [
    {
      isExpanded: false,
      links: navLink.links
    }
  ];
}

export function getCurrentTree(paths: any, level: any, resourceItems: IResource[]) {
  let currentTree = createList(resourceItems)[0];
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