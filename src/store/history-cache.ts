import localforage from 'localforage';
import { IHistoryItem } from '../types/history';

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

export async function removeHistoryData(data: IHistoryItem) {
  const historyItems: IHistoryItem[] = await readHistoryData();
  const items = historyItems.filter(history => history !== data);
  localforage.setItem(key, items);
}

export function clear() { localforage.clear(); }
