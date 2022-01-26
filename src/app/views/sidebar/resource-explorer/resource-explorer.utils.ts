import { INavLink, INavLinkGroup } from '@fluentui/react';

import {
  IResource,
  IResourceLabel,
  IResourceLink,
  IResourceMethod
} from '../../../../types/resources';

interface ITreeFilter {
  paths: string[];
  level: number;
  resourceItems: IResource[];
  version: string;
}

export function createResourcesList(
  source: IResource[],
  version: string
): INavLinkGroup[] {
  function getIcon({ segment, links }: any): string | undefined {
    const isGraphFunction = segment.startsWith('microsoft.graph');
    let icon;
    const hasChildren = links && links.length > 0;
    if (!hasChildren) {
      icon = 'PlugDisconnected';
    }
    if (isGraphFunction) {
      icon = 'LightningBolt';
    }
    return icon;
  }

  function getVersionedChildLinks(
    parent: IResource,
    paths: string[],
    version: string,
    methods: string[]
  ): IResourceLink[] {
    const { segment, children } = parent;
    const links: IResourceLink[] = [];

    if (methods.length > 1) {
      methods.forEach((method) => {
        links.push(
          createNavLink(
            {
              segment,
              labels: [],
              children: []
            },
            segment,
            [...paths, segment],
            method.toUpperCase()
          )
        );
      });
    }

    // versioned children
    if (children)
      children
        .filter((child) => versionExists(child, version))
        .forEach((versionedChild) => {
          links.push(
            createNavLink(versionedChild, segment, [...paths, segment])
          );
        });

    return links;
  }

  function sortResourceLinks(a: IResourceLink, b: IResourceLink): number {
    if (a.links.length === 0 && a.links.length < b.links.length) return -1;
    if (b.links.length === 0 && a.links.length > b.links.length) return 1;
    return 0;
  }

  function createNavLink(
    info: IResource,
    parent: string,
    paths: string[] = [],
    method?: string
  ): IResourceLink {
    const { segment, labels } = info;
    const level = paths.length;
    const key = `${level}-${parent === '/' ? 'root' : parent}-${segment}${
      method ? `-${method?.toLowerCase()}` : ''
    }`;
    const availableMethods = getAvailableMethods(labels, version);
    const versionedChildren = getVersionedChildLinks(
      info,
      paths,
      version,
      availableMethods
    ).sort(sortResourceLinks); // show functions at the top

    // if segment has one method only and no children, do not make segment a node
    if (availableMethods.length === 1 && versionedChildren.length === 0) {
      paths = [...paths, segment];
      method = availableMethods[0].toUpperCase();
    }
    const icon = getIcon({ ...info, links: versionedChildren });

    return {
      key,
      url: key,
      name: `${segment}${
        versionedChildren && versionedChildren.length > 0
          ? ` (${versionedChildren.length})`
          : ''
      }`,
      labels,
      isExpanded: false,
      parent,
      level,
      paths,
      icon,
      method,
      type: icon === 'LightningBolt' ? 'function' : 'path',
      links: versionedChildren
    };
  }

  const navLink = createNavLink(
    {
      segment: '/',
      labels: [],
      children: source
    },
    ''
  );

  return [
    {
      links: navLink.links
    }
  ];
}

export function getCurrentTree({
  paths,
  level,
  resourceItems,
  version
}: ITreeFilter): INavLinkGroup {
  let currentTree = createResourcesList(resourceItems, version)[0];
  const filters = paths.slice(1, level + 1);
  filters.forEach((key: string) => {
    const linkedKey = findLinkByName(currentTree, key);
    if (linkedKey) {
      currentTree = linkedKey;
    }
  });
  return currentTree;
}

function findLinkByName(list: any, filter: string): INavLinkGroup {
  return list.links.find((k: any) => removeCounter(k.name) === filter);
}

export function removeCounter(title: string): string {
  return title.split(' (')[0].trim();
}

export function getResourcesSupportedByVersion(
  content: IResource,
  version: string
): IResource {
  const resources: IResource = { ...content };
  const children: IResource[] = [];

  resources.children.forEach((child: IResource) => {
    if (versionExists(child, version)) {
      children.push(child);
    }
  });
  resources.children = children;
  return resources;
}

export function versionExists(child: IResource, version: string): boolean {
  return !!child.labels.find((k) => k.name === version);
}

export function getAvailableMethods(
  labels: IResourceLabel[],
  version: string
): string[] {
  const current = labels.find(
    (label: IResourceLabel) => label.name === version
  );
  return current ? current.methods : [];
}

export function getUrlFromLink(link: IResourceLink | INavLink): string {
  const { paths } = link;
  let url = '';
  if (paths.length > 1) {
    paths.slice(1).forEach((path: string) => {
      url += '/' + path;
    });
  }
  return url;
}

export function getResourcePaths(
  item: IResourceLink,
  version: string
): IResourceLink[] {
  const { links } = item;
  const content: IResourceLink[] = flatten(links).filter(
    (k: IResourceLink) => k.type === 'path'
  );
  content.unshift(item);
  if (content.length > 0) {
    content.forEach((element: IResourceLink) => {
      const methods =
        element.labels.find((k: IResourceLabel) => k.name === version)
          ?.methods || [];
      const listOfMethods: IResourceMethod[] = [];
      methods.forEach((method: string) => {
        listOfMethods.push({
          name: method.toUpperCase(),
          checked: true
        });
      });
      element.version = version;
      element.url = `${getUrlFromLink(element)}`;
      element.methods = listOfMethods;
      element.version = version;
      element.url = `${getUrlFromLink(element)}`;
    });
  }
  return content;
}

function flatten(content: IResourceLink[]): IResourceLink[] {
  let result: any[] = [];
  content.forEach(function (item: IResourceLink) {
    result.push(item);
    if (Array.isArray(item.links)) {
      result = result.concat(flatten(item.links));
    }
  });
  return result;
}
