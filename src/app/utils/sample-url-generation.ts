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
  const requestContent = pathname.split(versionToReplace).pop()!;
  return removeLeadingSlash(decodeURIComponent(requestContent?.replace(/\/$/, '')));
}

function removeLeadingSlash(url: string): string {
  return (url.charAt(0) === '/') ? url.substring(1) : url;
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
  return search.replace(/\s/g, '+');
}

function generateSampleUrl(
  url: string,
  queryVersion: string,
  requestUrl: string,
  search: string
): string {
  const { origin } = new URL(url);
  return removeExtraSlashesFromUrl(`${origin}/${queryVersion}/${requestUrl + search}`);
}

export function removeExtraSlashesFromUrl(url: string): string {
  return url.replace(/([^:]\/)\/+/g, '$1');
}

export function hasWhiteSpace(url: string): boolean {
  const whitespaceChars = [' ', '\t', '\n', '%20'];
  const urlParts = url.split('?');
  if (hasAllowableWhiteSpace(urlParts[0])) {
    return false
  }
  return urlParts.length > 1 ? whitespaceChars.some((spaceChar) => urlParts[0].trimStart().includes(spaceChar)) :
    whitespaceChars.some((char) => urlParts[0].trim().includes(char));
}

export function hasPlaceHolders(url: string): boolean {
  const placeHolderChars = ['{', '}'];
  return placeHolderChars.length > 1 && placeHolderChars.every((char) => url.includes(char));
}

export function hasAllowableWhiteSpace(url: string): boolean {
  const regexList = [/(?:\/)\w+:(\w+ ?|.+)+.+/g];
  const partsSeparatedByColon = url.split(':');
  const partsToSearch = partsSeparatedByColon[0].concat(partsSeparatedByColon[1]);
  const partsSeparatedBySlash = url.split('/');
  if (hasSpaceAtEndsOfParts(partsSeparatedBySlash)) {
    return false;
  }

  if (hasSpaceInPartsBeforeColon(partsToSearch)) {
    return false;
  }
  return regexList.some(regex => regex.test(url));
}

function hasSpaceInPartsBeforeColon(partBeforeColon: string): boolean {
  return [' ', '\t', '\n', '%20'].some((char) => partBeforeColon.includes(char));
}

function hasSpaceAtEndsOfParts(partsWithSlash: string[]) {
  if(partsWithSlash && partsWithSlash.length === 0){ return false}
  const lastPart = partsWithSlash.pop();

  for (const partWithSlash of partsWithSlash) {
    const trimmedPart = partWithSlash.trim();
    if (trimmedPart !== partWithSlash) {
      return true;
    }
  }
  const trimmedLastPart = lastPart!.trimStart();
  if (trimmedLastPart !== lastPart) {
    return true;
  }
}