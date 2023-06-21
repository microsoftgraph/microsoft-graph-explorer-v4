export const saveToLocalStorage = (key: string, value: Object|string) => {
  let itemToStore = value;
  if (typeof value != 'string') {
    itemToStore = JSON.stringify(value)
  } 
  localStorage.setItem(key, itemToStore);
};

export const readFromLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);

  if (value && typeof value === 'object') {
    return JSON.parse(value);
  } else{
    return value;
  }
};