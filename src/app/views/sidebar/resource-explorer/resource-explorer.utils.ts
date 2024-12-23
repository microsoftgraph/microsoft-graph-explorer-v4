import { INavLinkGroup } from '@fluentui/react';

import {
  IResource, IResourceLabel, IResourceLink, Method, ResourceLinkType, ResourceMethod, ResourcePath
} from '../../../../types/resources';

interface ITreeFilter {
  paths: string[];
  level: number;
  resourceItems: IResource[];
  version: string;
}

export function createResourcesList(
  source: IResource[],
  version: string,
  searchText?: string
): INavLinkGroup[] {
  function getLinkType({ segment, links }: any): ResourceLinkType {
    const isGraphFunction = segment.startsWith('microsoft.graph');
    const hasChildren = links && links.length > 0;
    if (hasChildren) {
      return ResourceLinkType.NODE;
    }
    return isGraphFunction ? ResourceLinkType.FUNCTION : ResourceLinkType.PATH;
  }

  function sortResourceLinks(a: IResourceLink, b: IResourceLink): number {
    if (a.links.length === 0 && b.links.length > 0) {
      return -1;
    }
    if (b.links.length === 0 && a.links.length > 0) {
      return 1;
    }
    return 0;
  }

  function createNavLink(
    info: IResource,
    parent: string,
    paths: string[] = [],
    method?: Method,
    docLink?: string
  ): IResourceLink {
    const { segment, labels } = info;
    const level = paths.length;
    const availableMethods: Method[] = getAvailableMethods(labels, version);
    const versionedChildren = getVersionedChildLinks(
      info,
      paths,
      availableMethods
    ).sort(sortResourceLinks); // show graph functions at the top

    const type = getLinkType({ ...info, links: versionedChildren });
    const enclosedCounter =
      versionedChildren && versionedChildren.length > 0
        ? versionedChildren.length
        : null;

    // if segment name does not contain search text, then found text is in child, so expand this link
    const isExpanded =
      searchText &&
        ![...paths, segment].some((path) => path.contains(searchText))
        ? true
        : false;

    const pathItems = Array.from(new Set([...paths, segment]));
    const key = generateKey(method, pathItems, version);

    return {
      key,
      url: key,
      name: segment,
      labels,
      isExpanded,
      parent,
      level,
      paths: pathItems,
      method: method?.toUpperCase(),
      type,
      links: versionedChildren,
      docLink: docLink ? docLink : getLink(labels, version, method),
      count: enclosedCounter
    };
  }

  function getVersionedChildLinks(
    parent: IResource,
    paths: string[],
    methods: Method[]
  ): IResourceLink[] {
    const { segment, children, labels } = parent;
    const links: IResourceLink[] = [];
    const childPaths = Array.from(new Set([...paths, segment]));
    if (methods.length > 0) {
      if (
        !searchText ||
        (searchText && childPaths.some((path) => path.contains(searchText)))
      ) {
        methods.forEach((method) => {
          links.push(
            createNavLink(
              {
                segment,
                labels: [],
                children: []
              },
              segment,
              childPaths,
              method,
              getLink(labels, version, method)
            )
          );
        });
      }
    }

    // versioned children
    children &&
      children
        .forEach((versionedChild) => {
          links.push(createNavLink(versionedChild, segment, childPaths));
        });

    return links;
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

export function generateKey(method: string | undefined, paths: string[], version: string) {
  const pathItems = Array.from(new Set([...paths]));
  let pathsKeyPart = '';
  pathItems.forEach(path => {
    pathsKeyPart += `${path === '/' ? 'root' : path}-`;
  })
  const methodKeyPart = method ? `${method?.toLowerCase()}` : '';
  return `${paths.length - 1}-${pathsKeyPart}${methodKeyPart}-${version}`.replace('--', '-');
}

function getLink(labels: IResourceLabel[], version: string, method?: Method) {
  let docLink = '';
  if (labels && labels.length > 0 && !!method) {
    const label = labels.find((l) => l.name === version);
    if (label) {
      let methods = label.methods;
      if ((typeof methods[0] !== 'string')) {
        methods = methods as ResourceMethod[];
        docLink = methods.find((value: ResourceMethod) =>
          value.name?.toLowerCase() === method.toLowerCase())?.documentationUrl!;
      }
    }
  }
  return docLink;
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

export function getAvailableMethods(
  labels: IResourceLabel[],
  version: string
): Method[] {
  const methods: Method[] = [];
  const resourceLabel = labels.find(
    (label: IResourceLabel) => label.name === version
  )!;
  if (resourceLabel && resourceLabel.methods) {
    resourceLabel.methods.forEach(method => {
      methods.push(getMethod(method));
    });
  }
  return methods;
}

function getMethod(method: string | ResourceMethod): Method {
  // added to guarantee backwards compatibility with old method definitions
  if (typeof method === 'string') {
    return method as Method;
  }
  return method.name;
}

export function getUrlFromLink(paths: string[]): string {
  const items = [...paths];
  return items.join('/').replace('//', '/');
}

export function getResourcePaths(
  item: IResourceLink,
  version: string
): ResourcePath[] {
  const { links } = item;
  let content: ResourcePath[] = flatten(links);
  const { key, paths, type, url, method, name } = item;

  content.unshift({ key, paths, type, url, method, version, name });
  content = content.filter(
    (k: ResourcePath) => k.type !== ResourceLinkType.NODE
  );
  if (content.length > 0) {
    content.forEach((element: ResourcePath) => {
      element.version = version;
      element.url = `${getUrlFromLink(element.paths)}`;
      element.key = element.key?.includes(version) ? element.key : `${element.key}-${element.version}`
    });
  }
  return content;
}

function flatten(content: IResourceLink[]): ResourcePath[] {
  let result: ResourcePath[] = [];
  content.forEach(function (item: IResourceLink) {
    const { key, paths, type, url, method, name } = item;
    result.push({ key, paths, type, url, method, name });
    if (Array.isArray(item.links)) {
      result = result.concat(flatten(item.links));
    }
  });
  return result;
}


