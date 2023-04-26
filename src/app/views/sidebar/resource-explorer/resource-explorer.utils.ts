import { INavLink, INavLinkGroup } from '@fluentui/react';

import {
  IResource, IResourceLabel, IResourceLink, Method, ResourceLinkType, ResourceMethod
} from '../../../../types/resources';
import { versionExists } from '../../../utils/resources/resources-filter';

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

  function getVersionedChildLinks(
    parent: IResource,
    paths: string[],
    methods: Method[]
  ): IResourceLink[] {
    const { segment, children } = parent;
    const links: IResourceLink[] = [];
    const childPaths = [...paths, segment];
    if (methods.length > 1) {
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
              method
            )
          );
        });
      }
    }

    // versioned children
    children &&
      children
        .filter((child) => versionExists(child, version))
        .forEach((versionedChild) => {
          links.push(createNavLink(versionedChild, segment, childPaths));
        });

    return links;
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
    method?: Method
  ): IResourceLink {
    const { segment, labels } = info;
    const level = paths.length;
    const parentKeyPart = parent === '/' ? 'root' : parent;
    const methodKeyPart = method ? `-${method?.toLowerCase()}` : '';
    const key = `${level}-${parentKeyPart}-${segment}${methodKeyPart}`;
    const availableMethods: Method[] = getAvailableMethods(labels, version);
    const versionedChildren = getVersionedChildLinks(
      info,
      paths,
      availableMethods
    ).sort(sortResourceLinks); // show graph functions at the top

    // if segment has one method only and no children, do not make segment a node
    if (availableMethods.length === 1 && versionedChildren.length === 0) {
      paths = [...paths, segment];
      method = availableMethods[0];
    }
    const type = getLinkType({ ...info, links: versionedChildren });
    const enclosedCounter =
      versionedChildren && versionedChildren.length > 0
        ? ` (${versionedChildren.length})`
        : '';

    // if segment name does not contain search text, then found text is in child, so expand this link
    const isExpanded =
      searchText &&
        ![...paths, segment].some((path) => path.contains(searchText))
        ? true
        : false;

    const docLink = getLink(labels, version, method);

    return {
      key,
      url: key,
      name: `${segment}${enclosedCounter}`,
      labels,
      isExpanded,
      parent,
      level,
      paths,
      method,
      type,
      links: versionedChildren,
      docLink
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
  let content: IResourceLink[] = flatten(links);
  content.unshift(item);
  content = content.filter(
    (k: IResourceLink) => k.type !== ResourceLinkType.NODE
  );
  if (content.length > 0) {
    content.forEach((element: IResourceLink) => {
      element.version = version;
      element.url = `${getUrlFromLink(element)}`;
      element.key = element.key?.includes(version) ? element.key : `${element.key}-${element.version}`
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


