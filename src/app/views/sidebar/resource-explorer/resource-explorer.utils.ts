import { INavLink, INavLinkGroup } from '@fluentui/react';

import {
  IResource, IResourceLabel,
  IResourceLink, IResourceMethod
} from '../../../../types/resources';

import { textOverflowWidthRange } from '../../common/screen-resolution/screen-resolution';
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

export function createList(source: IResource[], version: string): INavLinkGroup[] {
  function getIcon({ segment, links }: any): string | undefined {
    const graphFunction = segment.includes('microsoft.graph');
    let icon;
    const hasChidlren = links && links.length > 0;
    if (!hasChidlren) {
      icon = 'PlugDisconnected';
    }
    if (graphFunction) {
      icon = 'LightningBolt';
    }
    return icon;
  }

  function createNavLink(info: IResource, parent: string, paths: string[] = []): IResourceLink {
    const { segment, children, labels } = info;
    const level = paths.length;
    const versionedChildren = (children) ? children.filter(child => versionExists(child, version)) : [];
    const key = `${level}-${(parent === '/' ? 'root' : parent)}-${segment}`;
    const icon = getIcon({ ...info, links: versionedChildren });
    return {
      key,
      url: key,
      name: `${segment}${(versionedChildren && versionedChildren.length > 0) ? ` (${versionedChildren.length})` : ''}`,
      labels,
      isExpanded: false,
      parent,
      level,
      paths,
      icon,
      type: (icon === 'LightningBolt') ? 'function' : 'path',
      links: (children) ? versionedChildren.map(child => createNavLink(child, segment, [...paths, segment])) : []
    };
  }

  const navLink = createNavLink({
    segment: '/',
    labels: [],
    children: source
  }, '');

  return [
    {
      links: navLink.links
    }
  ];
}

export function getCurrentTree({ paths, level, resourceItems, version }: ITreeFilter): INavLinkGroup {
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

function findLinkByName(list: any, filter: string): INavLinkGroup {
  return list.links.find((k: any) => removeCounter(k.name) === filter);
}

export function removeCounter(title: string): string {
  return title.split(' (')[0].trim();
}

export function getResourcesSupportedByVersion(content: IResource, version: string): IResource {
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
  return !!child.labels.find(k => k.name === version);
}

export function getAvailableMethods(labels: IResourceLabel[], version: string): string[] {
  const current = labels.find((label: IResourceLabel) => label.name === version);
  return (current) ? current.methods : [];
}

export function getUrlFromLink(link: IResourceLink | INavLink): string {
  const { paths } = link;
  let url = '/';
  if (paths.length > 1) {
    paths.slice(1).forEach((path: string) => {
      url += path + '/';
    });
  }
  url += removeCounter(link.name);
  return url;
}

export function getResourcePaths(item: IResourceLink, version: string): IResourceLink[] {
  const { links } = item;
  const content: IResourceLink[] = flatten(links).filter((k: IResourceLink) => k.type === 'path');
  content.unshift(item);
  if (content.length > 0) {
    content.forEach((element: IResourceLink) => {
      const methods = element.labels.find((k: IResourceLabel) => k.name === version)?.methods || [];
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
  const overFlowRange = textOverflowWidthRange.find(k => k.key === resolution);
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
  const { currentScreenWidth, lowestDeviceWidth, highestDeviceWidth, overflowRange } = overflowProps;
  const { minimumOverflowWidth, maximumOverflowWidth } = overflowRange;

  return (currentScreenWidth - lowestDeviceWidth) * (maximumOverflowWidth - minimumOverflowWidth) /
    (highestDeviceWidth - lowestDeviceWidth) + minimumOverflowWidth;
}

// adjusts overflow width for each resource link level
export function compensateForLinkIndent(resourceLevelOnIsolation: number, linkLevel: number) {
  const levelCompensation = new Map([
    [1, -30],
    [2, -20],
    [3, 10],
    [4, 25],
    [5, 40],
    [6, 60],
    [7, 70],
    [8, 75],
    [9, 80],
    [10, 85]
  ])
  const currentLevel: number = resourceLevelOnIsolation === -1 ? linkLevel :
    linkLevel - resourceLevelOnIsolation;
  if (currentLevel >= 11) {
    return 120;
  }
  const compensation = levelCompensation.get(currentLevel);
  return compensation ? compensation : 0;
}