import { IResourceLink, ResourcePath } from '../../../../types/resources';
import { getUrlFromLink } from './resource-explorer.utils';

export const existsInCollection = (link: IResourceLink, paths: ResourcePath[], version: string): boolean => {
  if (link.method) {
    const found = paths.find(p => p.key === `${link.key}-${version}` || p.key === link.key);
    return !!found;
  }

  const pathsInCollection = paths.filter(p => p.url.startsWith(getUrlFromLink(link.paths)) &&
    p.key!.split('-').pop() === version);

  if (pathsInCollection.length === 0) {
    return false;
  }

  const noneNodeLinks: IResourceLink[] = link.links.filter((k: IResourceLink) => k.type !== 'node');
  const list: IResourceLink[] = [];
  noneNodeLinks.forEach((element: IResourceLink) => {
    if (pathsInCollection.find((k: ResourcePath) => k.key === element.key ||
      k.key === `${element.key}-${version}`)) {
      list.push(element);
    }
  });
  return list.length === noneNodeLinks.length;
};

export function setExisting(item: IResourceLink, value: boolean) {
  item.isInCollection = value;
}

export function handleShiftArrowSelection<T>({
  direction,
  focusedIndex,
  anchorIndex,
  items,
  currentSelection,
  targetIndex
}: {
  direction?: 'up' | 'down';
  focusedIndex: number | null;
  anchorIndex: number | null;
  items: T[];
  currentSelection: Set<T>;
  targetIndex?: number;
}): {
  newFocusedIndex: number;
  newAnchorIndex: number;
  newSelection: Set<T>;
} {
  if (focusedIndex === null || anchorIndex === null) {
    return {
      newFocusedIndex: targetIndex ?? focusedIndex ?? 0,
      newAnchorIndex: anchorIndex ?? targetIndex ?? focusedIndex ?? 0,
      newSelection: new Set(currentSelection)
    };
  }

  const newIndex =
    targetIndex !== undefined
      ? targetIndex
      : direction === 'down'
        ? focusedIndex + 1
        : focusedIndex - 1;

  if (newIndex < 0 || newIndex >= items.length) {
    return {
      newFocusedIndex: focusedIndex,
      newAnchorIndex: anchorIndex,
      newSelection: new Set(currentSelection)
    };
  }

  const rangeStart = Math.min(anchorIndex, newIndex);
  const rangeEnd = Math.max(anchorIndex, newIndex);

  const newSelection = new Set<T>();
  for (let i = rangeStart; i <= rangeEnd; i++) {
    newSelection.add(items[i]);
  }

  return {
    newFocusedIndex: newIndex,
    newAnchorIndex: anchorIndex,
    newSelection
  };
}