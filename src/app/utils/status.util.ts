export function replaceLinks(message: string): string {
  if (linkExists(message)) {
    const urls = extractUrl(message);
    for (let index = 0; index < urls.length; index++) {
      const url = urls[index];
      message = message.replace(url, `$${index}`);
    }
  }
  return message;
}

export function convertArrayToObject(array: any[]) {
  const initialValue = {};
  return array.reduce((obj, item, index) => {
    return {
      ...obj,
      [`$${index}`]: item,
    };
  }, initialValue);
};

export function linkExists(value: string): boolean {
  const urlRegex = "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?";
  return new RegExp(urlRegex).test(value);
}

export function extractUrl(value: string): string[] {
  const matches = value.match(/\bhttps?:\/\/\S+/gi);
  if (matches) {
    return matches;
  }
  return [];
}