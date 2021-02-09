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
  let exists = false;

  if (!value) {
    return exists;
  }

  const linkParts = ['https://', 'http://', 'www.'];
  value = value.toString().toLowerCase();
  linkParts.forEach(part => {
    if (value.includes(part.toLowerCase())) {
      exists = true;
      return;
    }
  });
  return exists;
}

export function extractUrl(value: string): any {
  const matches = value.match(/\bhttps?:\/\/\S+/gi);
  if (matches) {
    return matches;
  }
  return [];
}