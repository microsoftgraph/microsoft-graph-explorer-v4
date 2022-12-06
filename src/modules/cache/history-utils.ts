import localforage from 'localforage';
import { IHistoryItem } from '../../types/history';

const historyStorage = localforage.createInstance({
  storeName: 'history',
  name: 'GE_V4'
});

function historyItemHasExpired(createdAt: string): boolean {
  const ageInDays: number = 30;
  const dateToCompare = new Date();
  dateToCompare.setDate(dateToCompare.getDate() - ageInDays);
  const expiryDate = dateToCompare.getTime();
  const createdTime = new Date(createdAt).getTime();
  return (createdTime < expiryDate);
}

export const historyCache = (function () {

  const writeHistoryData = (historyItem: IHistoryItem) => {
    historyStorage.setItem(historyItem.createdAt, historyItem);
  }

  const readHistoryData = async (): Promise<IHistoryItem[]> => {
    let historyData: IHistoryItem[] = [];
    const keys = await historyStorage.keys();
    for (const creationTime of keys) {
      if (historyItemHasExpired(creationTime)) {
        historyStorage.removeItem(creationTime);
      } else {
        const historyItem = await historyStorage.getItem(creationTime)! as IHistoryItem;
        historyData = [...historyData, historyItem];
      }
    }
    return historyData;
  }

  const removeHistoryData = async (historyItem: IHistoryItem) => {
    await historyStorage.removeItem(historyItem.createdAt);
    return true;
  };

  const bulkRemoveHistoryData = async (listOfKeys: string[]) => {
    historyStorage.iterate((_value, key) => {
      if (listOfKeys.includes(key)) {
        historyStorage.removeItem(key);
      }
    }).then(() => {
      return true;
    });
  };

  return {
    writeHistoryData,
    bulkRemoveHistoryData,
    removeHistoryData,
    readHistoryData
  }
})();