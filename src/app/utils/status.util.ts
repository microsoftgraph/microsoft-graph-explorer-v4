export function replaceLinks(message: string): string {
  if (linkExists(message)) {
    const urls = extractUrl(message);
    urls.forEach(url => {
      const link = createLinkFromUrl(url);
      message = message.replace(url, link);
    });
  }
  return message;
}

export function linkExists(value: string): boolean {
  const linkParts = ['https://', 'http://', 'www.'];
  value = value.toLowerCase();
  let exists = false;
  linkParts.forEach(part => {
    if (value.includes(part.toLowerCase())) {
      exists = true;
      return;
    }
  });
  return exists;
}

export function createLinkFromUrl(url: string): string {
  return `<a href="${url}">${url}</a>`;
}

export function extractUrl(value: string): string[] {
  const listOfLinks: string[] = [];
  value.split(' ').forEach((element: string) => {
    if (linkExists(element)) {
      listOfLinks.push(element);
    }
  });
  return listOfLinks;
}