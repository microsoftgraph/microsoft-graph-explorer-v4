import localforage from 'localforage';
import { IHistoryItem } from '../../../../types/history';

const key = 'history';

export async function writeHistoryData(data: IHistoryItem) {
  const historyItems: IHistoryItem[] = await readHistoryData();
  const items = [...historyItems, data];
  localforage.setItem(key, items);
}

export async function readHistoryData(): Promise<IHistoryItem[]> {
  const data: IHistoryItem[] = await localforage.getItem(key);
  return data || [];
}

export const removeHistoryData = async (data: IHistoryItem) => {
  const historyItems: IHistoryItem[] = await readHistoryData();
  const items = historyItems.filter((history: IHistoryItem) => history.createdAt !== data.createdAt);
  await localforage.setItem(key, items);
  return items.length;
};

export function clear() { localforage.clear(); }

export function dynamicSort(property: string) {
  const column = property;
  let sortOrder = 1;
  if (column[0] === '-') {
    sortOrder = -1;
    property = column.substr(1);
  }
  return (first: any, second: any) => {
    const result = (first[property] < second[property]) ? -1 : (first[property] > second[property]) ? 1 : 0;
    return result * sortOrder;
  };
}
