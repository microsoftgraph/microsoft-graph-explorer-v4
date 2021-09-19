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
    return {
      key: segment,
      name,
      isExpanded: false,
      parent,
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