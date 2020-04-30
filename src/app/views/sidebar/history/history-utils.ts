import localforage from 'localforage';
import { IHistoryItem } from '../../../../types/history';
const historyStorage = localforage.createInstance({
  storeName: 'history',
  name: 'GE_V4'
});

export async function writeHistoryData(historyItem: IHistoryItem) {
  historyStorage.setItem(historyItem.createdAt, historyItem);
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

export const removeHistoryData = async (historyItem: IHistoryItem) => {
  await historyStorage.removeItem(historyItem.createdAt);
  return true;
};

export const bulkRemoveHistoryData = async (listOfKeys: string[]) => {
  historyStorage.iterate((value, key, iterationNumber) => {
    if (listOfKeys.includes(key)) {
      historyStorage.removeItem(key);
    }
  }).then(() => {
    return true;
  });
};
