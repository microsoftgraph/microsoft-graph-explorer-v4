export const saveToLocalStorage = (key: string, value: Object|string) => {
  if (typeof value === 'string') {
    localStorage.setItem(key, value);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const readFromLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);

  if (value && typeof value === 'object') {
    return JSON.parse(value);
  } else{
    return value;
  }
};