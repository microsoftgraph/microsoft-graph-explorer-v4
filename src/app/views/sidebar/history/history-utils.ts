import localforage from 'localforage';
import { IHistoryItem } from '../../../../types/history';
const historyStorage = localforage.createInstance({
  storeName: 'history',
  name: 'GE_V4'
});

export async function writeHistoryData(data: IHistoryItem) {
  historyStorage.setItem(data.createdAt, data);
}

export async function readHistoryData(): Promise<IHistoryItem[]> {
  let historyData: IHistoryItem[] = [];
  const keys = await historyStorage.keys();
  for (const element of keys) {
    const historyItem: IHistoryItem = await historyStorage.getItem(element);
    historyData = [...historyData, historyItem];
  }
  return historyData;
}

export const removeHistoryData = async (data: IHistoryItem) => {
  await historyStorage.removeItem(data.createdAt);
  return true;
};

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
