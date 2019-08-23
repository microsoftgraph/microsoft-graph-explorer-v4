import localforage from 'localforage';

const key = 'history';

export function writeData  (data: object) {
  localforage.setItem(key, data);
}

export async function readData  () {
  const data = await localforage.getItem(key);
  return data || [];
}

export function removeData  () { localforage.removeItem(key); }

export function clear  () { localforage.clear(); }
