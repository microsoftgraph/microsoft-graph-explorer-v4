interface IParsedSample {
  queryVersion: string;
  requestUrl: string;
  sampleUrl: string;
  search: string;
}

export function parseSampleUrl(url: string, version?: string): IParsedSample {
  let requestUrl = '';
  let queryVersion = '';
  let sampleUrl = '';
  let search = '';

  if (url !== '') {
    try {
      url = removeExtraSlashesFromUrl(url);
      queryVersion = version ? version : getGraphVersion(url);
      requestUrl = getRequestUrl(url, queryVersion);
      search = generateSearchParameters(url, search);
      sampleUrl = generateSampleUrl(url, queryVersion, requestUrl, search);
    } catch (error: any) {
      if (error.message === 'Failed to construct \'URL\': Invalid URL') {
        return {
          queryVersion,
          requestUrl,
          sampleUrl,
          search
        };
      }
    }
  }
  return {
    queryVersion,
    requestUrl,
    sampleUrl,
    search
  };
}

function getRequestUrl(url: string, version: string): string {
  const { pathname } = new URL(url);
  const versionToReplace = pathname.startsWith(`/${version}`)
    ? version
    : getGraphVersion(url);
  const requestContent = pathname.split(versionToReplace + '/').pop()!;
  return decodeURIComponent(requestContent?.replace(/\/$/, ''));
}

function getGraphVersion(url: string): string {
  const { pathname } = new URL(url);
  const parts = pathname.substring(1).split('/');
  return parts[0];
}

function generateSearchParameters(url: string, search: string) {
  const { search: searchParameters } = new URL(url);
  if (searchParameters) {
    try {
      search = decodeURI(searchParameters);
    } catch (error: any) {
      if (error.message === 'URI malformed') {
        search = searchParameters;
      }
    }
  }
  return search;
}

function generateSampleUrl(
  url: string,
  queryVersion: string,
  requestUrl: string,
  search: string
): string {
  const { origin } = new URL(url);
  return `${origin}/${queryVersion}/${requestUrl + search}`;
}

export function removeExtraSlashesFromUrl(url: string): string {
  return url.replace(/([^:]\/)\/+/g, '$1');
}

export function hasWhiteSpace(url: string): boolean {
  const parts = url.split('?');
  const whitespaceChars = [' ', '\t', '\n', '%20', '\r'];
  const allParts = url.split(/(%20|\s)/);
  return getWhiteSpace(parts, allParts, whitespaceChars);
}

export function getWhiteSpace(parts: string[], allParts: string[], whitespaceChars: string[]): boolean {
  const urlHasArgs = parts.length > 1;
  if (urlHasArgs) {
    const hasWhiteSpaceBeforeArgs = whitespaceChars.some((char) => parts[0].trimStart().includes(char));
    const hasWhiteSpaceAfterArgs = whitespaceChars.some((char) => allParts[allParts.length - 1] === (char));

    if (hasWhiteSpaceBeforeArgs) { return true }
    if (!hasWhiteSpaceBeforeArgs && hasWhiteSpaceAfterArgs) { return false }
  }
  else {
    const urlWithoutArgs = parts[0].split(/(%20|\s)/);

    const hasWhitespaceAtTheEnd = whitespaceChars.some((char) =>
      urlWithoutArgs[urlWithoutArgs.length - 1] === (char));

    const urlWithoutTrailingSpaces = urlWithoutArgs.join('').trim();

    const hasWhiteSpaceInBetweenUrl = whitespaceChars.some((char) =>
      urlWithoutTrailingSpaces.split(/(%20|\s)/).includes(char));

    if (hasWhiteSpaceInBetweenUrl) { return true }
    if (hasWhitespaceAtTheEnd && !hasWhiteSpaceInBetweenUrl) { return false }
  }
  return false;
}
