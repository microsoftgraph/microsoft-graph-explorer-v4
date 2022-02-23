import { IGroup } from '@fluentui/react';

export function generateGroupsFromList(list: any[], property: string) {
  const map = new Map();
  const groups: IGroup[] = [];

  let isCollapsed = false;
  let previousCount = 0;
  let count = 0;

  if (!list || list.length === 0 || list.some(e => !e[property])) {
    return groups;
  }

  for (const listItem of list) {
    if (!map.has(listItem[property])) {
      map.set(listItem[property], true);
      count = list.filter(item => item[property] === listItem[property]).length;
      const collapsed: string = isCollapsed? 'collapsed': 'expanded'
      const ariaLabel: string = listItem[property] + ' has ' + count + ' results' + map.size + 'of 28' + collapsed
      if (groups.length > 0) {
        isCollapsed = true;
      }
      groups.push({
        ...listItem,
        name: listItem[property],
        key: listItem[property],
        startIndex: previousCount,
        isCollapsed,
        count,
        ariaLabel
      });
      previousCount += count;
    }
  }
  return groups;
}