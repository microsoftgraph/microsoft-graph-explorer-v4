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
  for (const creationTime of keys) {
    if (historyItemHasExpired(creationTime)) {
      historyStorage.removeItem(creationTime);
    } else {
      const historyItem: IHistoryItem = await historyStorage.getItem(creationTime);
      historyData = [...historyData, historyItem];
    }
  }
  return historyData;
}

function historyItemHasExpired(createdAt: string): boolean {
  const ageInDays: number = 30;
  const dateToCompare = new Date();
  dateToCompare.setDate(dateToCompare.getDate() - ageInDays);
  const expiryDate = dateToCompare.getTime();
  const createdTime = new Date(createdAt).getTime();
  return (createdTime < expiryDate);
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
