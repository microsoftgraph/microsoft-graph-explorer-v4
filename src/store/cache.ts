import localforage from 'localforage';
import { IHistoryItem } from '../types/history';

const key = 'history';

export async function writeData  (data: IHistoryItem) {
  const historyItems: IHistoryItem[] = await readData();
  const items = [...historyItems, data];
  localforage.setItem(key, items);
}

export async function readData(): Promise<IHistoryItem[]> {
  const data: IHistoryItem[] = await localforage.getItem(key);
  return data || [];
}

export async function removeData(data: IHistoryItem) {
  const historyItems: IHistoryItem[] = await readData();
  const items = historyItems.filter(history => history !== data);
  localforage.setItem(key, items);
}

export function clear  () { localforage.clear(); }
