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
      [`$${index}`]: item
    };
  }, initialValue);
}

export function extractUrl(value: string): string[] | null {
  return value.toString().match(/\bhttps?:\/\/\S+/gi);
}

export function matchIncludesLink(matches: RegExpMatchArray, part: string) {
  const includes = matches.includes(part);
  const dollarSignWithNumber = /[$]\d+/;
  const hasDollarSign = part.match(dollarSignWithNumber);
  return includes && hasDollarSign;
}

export function getMatchesAndParts(message: string) {
  message = message.toString();
  const numberPattern = /([$0-9]+)/g;
  const matches: RegExpMatchArray | null = message.match(numberPattern);
  const parts: string[] = message.split(numberPattern);
  return { matches, parts };
}

const responseStatusTextMap = new Map([
  [100, 'Continue'],
  [101, 'Switching Protocols'],
  [102, 'Processing'],
  [200, 'OK'],
  [201, 'Created'],
  [202, 'Accepted'],
  [203, 'Non Authoritative'],
  [204, 'No Content'],
  [205, 'Reset Content'],
  [206, 'Partial Content'],
  [300, 'Multiple Choices'],
  [301, 'Moved Permanently'],
  [302, 'Found'],
  [303, 'See Other'],
  [304, 'Not Modified'],
  [305, 'Use Proxy'],
  [307, 'Temporary Redirect'],
  [400, 'Bad Request'],
  [401, 'Unauthorized'],
  [403, 'Forbidden'],
  [404, 'Not Found'],
  [405, 'Method Not Allowed'],
  [406, 'Not Acceptable'],
  [407, 'Proxy Authentication Required'],
  [408, 'Request Timeout'],
  [409, 'Conflict'],
  [410, 'Gone'],
  [411, 'Length Required'],
  [412, 'Precondition Failed'],
  [413, 'Request Entity Too Large'],
  [414, 'Request-URI Too Long'],
  [415, 'Unsupported Media Type'],
  [416, 'Requested Range Not Satisfiable'],
  [417, 'Expectation Failed'],
  [422, 'Unprocessable Entity'],
  [500, 'Internal Server Error'],
  [501, 'Not Implemented'],
  [502, 'Bad Gateway'],
  [503, 'Service Unavailable'],
  [504, 'Gateway Timeout'],
  [505, 'HTTP Version Not Supported']
]);

export function setStatusMessage(status: number): string {
  const statusMessage = responseStatusTextMap.get(status);
  return statusMessage ? statusMessage : '';
}