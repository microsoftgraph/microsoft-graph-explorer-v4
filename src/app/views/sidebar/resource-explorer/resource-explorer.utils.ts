import { INavLink, INavLinkGroup } from '@fluentui/react';
import { IResource, IResourceLabel } from '../../../../types/resources';

interface ITreeFilter {
  paths: string[];
  level: number;
  resourceItems: IResource[];
  version: string;
}

export function createList(source: IResource[], version: string, methods?: string[]): INavLinkGroup[] {
  let resourcesWithMethodSupport: IResource[] = [];
  if (methods) {
    const flattenedSource = flatten(source);
    resourcesWithMethodSupport = flattenedSource.filter(
      (resource) => methodsAreSupported(resource, methods!, version))
  }
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

  function createNavLink(info: IResource, parent: string | null = null, paths: string[] = []): INavLink {
    const { segment, children, labels } = info;
    const level = paths.length;
    const versionedChildren = (children) ? children.filter(child => versionExists(child, version)) : [];
    const key = `${level}-${(parent === '/' ? 'root' : parent)}-${segment}`;
    const icon = getIcon({ ...info, links: versionedChildren });
    let supportsMethods = true;
    if (resourcesWithMethodSupport.length > 0) {
      const existsInList = !!resourcesWithMethodSupport.find(k => k === info);
      supportsMethods = !existsInList;
    }
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
      supportsMethods,
      type: (icon === 'LightningBolt') ? 'function' : 'path',
      links: (children) ? versionedChildren.map(child => createNavLink(child, segment, [...paths, segment])) : []
    };
  }

  const navLink = createNavLink({
    segment: '/',
    labels: [],
    children: source
  });

  return [
    {
      links: navLink.links!
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

export function getResourcesSupportedByVersion(content: IResource, version: string, methods?: string[]): IResource {
  const resources: IResource = { ...content };
  const children: IResource[] = [];
  const listOfMethods: string[] = [];

  if (methods) {
    methods.forEach(method => {
      listOfMethods.push(toTitleCase(method));
    });
  }

  resources.children.forEach((child: IResource) => {
    if (versionExists(child, version)) {
      if (listOfMethods.length > 0) {
        if (methodsExist(child, listOfMethods, version)) {
          children.push(child);
        }
      } else {
        children.push(child);
      }
    }
  });
  resources.children = children;
  return resources;
}


function toTitleCase(word: string) {
  function capitalizeFirstLetter(text: string) {
    return text[0].toUpperCase() + text.slice(1).toLowerCase();
  }
  return word.split(' ').map((letter: string) => capitalizeFirstLetter(letter)).join(' ');
}

export function versionExists(child: IResource, version: string): boolean {
  return !!child.labels.find(k => k.name === version);
}
export function methodsExist(child: IResource, methods: string[], version: string): boolean {
  const methodsAtVersion = child.labels.filter(m => m.name === version)[0].methods;
  return methods.every(r => methodsAtVersion.includes(r));
}

export function getAvailableMethods(labels: IResourceLabel[], version: string): string[] {
  const current = labels.find((label: IResourceLabel) => label.name === version);
  return (current) ? current.methods : [];
}

export function getUrlFromLink(link: INavLink) {
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

export function flatten(content: any[]): any[] {
  let result: any[] = [];
  content.forEach(function (item) {
    result.push(item);
    if (Array.isArray(item.children)) {
      result = result.concat(flatten(item.children));
    }
  });
  return result;
}

export function methodsAreSupported(resource: IResource, methods: string[], version: string) {
  const theMethods = resource.labels.find((k: IResourceLabel) => k.name === version)?.methods || null;
  return (theMethods) ? arrayIncludesAnotherArray(theMethods, methods) : false;
}

export function arrayIncludesAnotherArray(mainArray: string[], subsetArray: string[]): boolean {
  return subsetArray.some(method => mainArray.includes(toTitleCase(method)));
}