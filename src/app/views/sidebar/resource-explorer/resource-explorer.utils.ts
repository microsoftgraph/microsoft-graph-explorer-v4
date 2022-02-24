import { INavLink, INavLinkGroup } from '@fluentui/react';

import {
  IResource,
  IResourceLabel,
  IResourceLink,
  ResourceLinkType
} from '../../../../types/resources';

import {
  getScreenResolution,
  textOverflowWidthRange
} from '../../common/screen-resolution/screen-resolution';
interface ITreeFilter {
  paths: string[];
  level: number;
  resourceItems: IResource[];
  version: string;
}

interface IOverflowWidthRange {
  minimumOverflowWidth: number;
  maximumOverflowWidth: number;
}

interface IOverflowProps {
  currentScreenWidth: number;
  lowestDeviceWidth: number;
  highestDeviceWidth: number;
  overflowRange: IOverflowWidthRange;
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
    methods: string[]
  ): IResourceLink[] {
    const { segment, children } = parent;
    const links: IResourceLink[] = [];
    if (methods.length > 1) {
      if (!searchText || (searchText && segment.contains(searchText))) {
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
    }

    // versioned children
    children &&
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
    method?: string
  ): IResourceLink {
    const { segment, labels } = info;
    const level = paths.length;
    const parentKeyPart = parent === '/' ? 'root' : parent;
    const methodKeyPart = method ? `-${method?.toLowerCase()}` : '';
    const key = `${level}-${parentKeyPart}-${segment}${methodKeyPart}`;
    const availableMethods = getAvailableMethods(labels, version);
    const versionedChildren = getVersionedChildLinks(
      info,
      paths,
      availableMethods
    ).sort(sortResourceLinks); // show graph functions at the top

    // if segment has one method only and no children, do not make segment a node
    if (availableMethods.length === 1 && versionedChildren.length === 0) {
      paths = [...paths, segment];
      method = availableMethods[0].toUpperCase();
    }
    const type = getLinkType({ ...info, links: versionedChildren });
    const enclosedCounter =
      versionedChildren && versionedChildren.length > 0
        ? ` (${versionedChildren.length})`
        : '';

    // if segment name does not contain search text, then found text is in child, so expand this link
    const isExpanded =
      searchText && !segment.contains(searchText) ? true : false;

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
  resources: IResource[],
  version: string,
  searchText?: string
): IResource[] {
  let versionedResources: IResource[] = [];
  const resourcesList = JSON.parse(JSON.stringify(resources)); // deep copy
  resourcesList.forEach((resource: IResource) => {
    if (versionExists(resource, version)) {
      resource.children = getResourcesSupportedByVersion(
        resource.children || [],
        version
      );
      versionedResources.push(resource);
    }
  });
  return searchText
    ? searchResources(versionedResources, searchText)
    : versionedResources;
}

function searchResources(haystack: IResource[], needle: string): IResource[] {
  const foundResources: IResource[] = [];
  haystack.forEach((resource: IResource) => {
    if (resource.segment.contains(needle)) {
      foundResources.push(resource);
      return;
    }
    if (resource.children) {
      const foundChildResources = searchResources(resource.children, needle);
      if (foundChildResources.length > 0) {
        resource.children = foundChildResources;
        foundResources.push(resource);
      }
    }
  });
  return foundResources;
}

export function versionExists(resource: IResource, version: string): boolean {
  return resource.labels.some((k) => k.name === version);
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
  let content: IResourceLink[] = flatten(links);
  content.unshift(item);
  content = content.filter(
    (k: IResourceLink) => k.type !== ResourceLinkType.NODE
  );
  if (content.length > 0) {
    content.forEach((element: IResourceLink) => {
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

export function getOverflowWidthRange(resolution: string): IOverflowWidthRange {
  const overFlowRange = textOverflowWidthRange.find(
    (k) => k.key === resolution
  );
  if (!overFlowRange) {
    return {
      minimumOverflowWidth: 1000,
      maximumOverflowWidth: 2000
    };
  }
  return {
    minimumOverflowWidth: overFlowRange.range.minimumOverflowWidth || 0,
    maximumOverflowWidth: overFlowRange.range.maximumOverflowWidth || 0
  };
}

// Adjusts overflow width based on screen resolution
export function updateOverflowWidth(overflowProps: IOverflowProps) {
  const {
    currentScreenWidth,
    lowestDeviceWidth,
    highestDeviceWidth,
    overflowRange
  } = overflowProps;
  const { minimumOverflowWidth, maximumOverflowWidth } = overflowRange;

  return (
    ((currentScreenWidth - lowestDeviceWidth) *
      (maximumOverflowWidth - minimumOverflowWidth)) /
      (highestDeviceWidth - lowestDeviceWidth) +
    minimumOverflowWidth
  );
}

// adjusts overflow width for each resource link level
export function compensateForLinkIndent(
  resourceLevelOnIsolation: number,
  linkLevel: number,
  method: string
) {
  const levelCompensation = new Map([
    [1, -20],
    [2, 10],
    [3, 20],
    [4, 30],
    [5, 40],
    [6, 60],
    [7, 70],
    [8, 80],
    [9, 110],
    [10, 120],
    [11, 130],
    [12, 140],
    [13, 150],
    [14, 160]
  ]);
  const currentLevel: number =
    resourceLevelOnIsolation === -1
      ? linkLevel
      : linkLevel - resourceLevelOnIsolation;

  if (currentLevel >= 16) {
    return 170;
  }
  let compensation;
  compensation = levelCompensation.get(currentLevel);

  if (method) {
    compensation = compensation! + 50;
  }
  return compensation ? compensation : 0;
}

export function setMaximumOverflowWidth(widthProps: any): string {
  const { resourceLevelOnIsolation, level, method } = widthProps;
  const {
    device: resolution,
    width,
    currentScreenWidth
  } = getScreenResolution();
  const compensation = compensateForLinkIndent(
    resourceLevelOnIsolation,
    level,
    method
  );
  const { minimumOverflowWidth, maximumOverflowWidth } =
    getOverflowWidthRange(resolution);

  const overflowProps = {
    currentScreenWidth,
    lowestDeviceWidth: width.minimumWidth,
    highestDeviceWidth: width.maximumWidth,
    overflowRange: {
      minimumOverflowWidth,
      maximumOverflowWidth
    }
  };

  const overflow = updateOverflowWidth(overflowProps) - compensation;
  if (overflow < 0) {
    return '0px';
  }

  return `${overflow}px`;
}
