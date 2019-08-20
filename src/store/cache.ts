import localforage from 'localforage';

const key = 'history';

export function writeData  (data: object) {
  localforage.setItem(key, data);
}

export function readData  () {
  return localforage.getItem(key);
}

export function removeData  () { localforage.removeItem(key); }

export function clear  () { localforage.clear(); }
