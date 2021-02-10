export function replaceLinks(message: string): string {
  const urls = extractUrl(message);
  if (urls) {
    for (let index = 0; index < urls.length; index++) {
      const url = urls[index];
      message = message.replace(url, `$${index}`);
    }
  }
  return message;
}

export function convertArrayToObject(array: any[]): object {
  const initialValue = {};
  return array.reduce((obj, item, index) => {
    return {
      ...obj,
      [`$${index}`]: item,
    };
  }, initialValue);
};

export function extractUrl(value: string): string[] | null {
  return value.match(/\bhttps?:\/\/\S+/gi);
}