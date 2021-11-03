// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * In the request snippet the body is represented in the format below.
 * `
 *
 * { name: user}
 * `
 * Observe that it is preceded by a newline followed by curly braces. We use these properties to
 * start extracting the body from the request snippet. When a newline is followed by a curly brace
 * we know that we have encountered they body section of the request snippet.
 *
 * @param payload
 */
function extractBody(payload: string): string {
  const NEWLINE = /\n/;
  const OPEN_BRACE = /{/;
  let current = 1;
  let word = '';

  while (current < payload.length) {
    const char = payload[current];
    const previousCharIsNewLine = NEWLINE.test(payload[current - 1]);
    const currentCharIsOpeningBrace = OPEN_BRACE.test(char);

    /**
     * If the previous character is a new line and the current character is an opening brace
     * then the body part of the snippet payload has been encountered. We read the body and
     * return it.
     */
    if (previousCharIsNewLine) {
      if (currentCharIsOpeningBrace) {
        let start = current;

        /**
         * Since we know the body is the last part of the snippet payload, we start reading it from the first
         * open curly brace to the end of the payload.
         */
        while (start < payload.length) {
          word += payload[start];
          start++;
        }
      }
    }
    current++;
  }

  return word.replace(/\n/g, '');
}

/**
 * Headers in a request snippet are represented in the format below.
 * `
 * POST https://graph.microsoft.com/v1/me
 * Content-type: application/json
 *
 * `
 * We observe that headers begin after the second newline of the request snippet and end when a newline
 * is followed by a space. We use these properties to extract headers from the request snippet.
 *
 * @param payload
 */
function extractHeaders(payload: string): object[] {
  const SPACE = /\s/;
  const NEWLINE = /\n/;

  const headers: any = [];
  let header: any = {};
  let newlineCount = 0;
  let positionOfSecondNewLine = 0;
  let word = '';

  for (let i = 0; i < payload.length; i++) {

    // Gets the position of the second newline. We start reading headers from the second newline.
    if (NEWLINE.test(payload[i]) && newlineCount <= 2) {
      newlineCount++;
      positionOfSecondNewLine = i;
    }

    if (newlineCount === 2) {
      for (let n = positionOfSecondNewLine + 1; n < payload.length; n++) {
        const char = payload[n];
        const nextChar = payload[n + 1];
        const isDelimiter = NEWLINE.test(char);

        word += char;
        if (isDelimiter) {
          const spl = word.trim().split(':');

          header[spl[0]] = spl[1].trim();
          headers.push(header);
          header = {};
          word = '';
        }

        if (NEWLINE.test(char) && SPACE.test(nextChar)) {
          return headers;
        }
      }
    }
  }
  return headers;
}

/**
 * Extracts the url from a payload
 *
 * @param payload
 * Has the form \n payload \n
 */
function extractUrl(payload: string): object[] {
  const domains = ['https://graph.microsoft.com/v1.0', 'https://graph.microsoft.com/beta'];
  const result: object[] = [];

  // The payload has the form \n sampleUrl \n. After splitting it on new lines the sampleUrl will be at index 1
  // of the resulting array
  const sampleUrl = payload.split('\n')[1];

  // The sampleUrl has the format VERB URL, after splitting it on the space character the VERB will be at index 0
  // and the URL at index 1
  const urlParts = sampleUrl.split(' ');
  const verb = urlParts[0];
  let url = (urlParts.length > 2) ?
    sampleUrl.replace(`${verb} `, '') : urlParts[1];

  let sampleDomain = '';
  domains.forEach(domain => {
    if (url.includes(domain)) {
      sampleDomain = domain;
    }
  });

  // Some urls do not have a domain only the path. For such urls we append the domain.
  if (!sampleDomain) {
    url = domains[0] + url;
  }

  result.push({ verb, url });

  return result;
}

export function parse(httpRequestMessage: string) {
  /**
   * The parser expects the http request message to start and end with a new line character, however,
   * the request message it receives does not have them. Hence, we prefix and suffix the httpRequestMessage
   * with new line characters.
   */
  const payload = `\n${httpRequestMessage}\n `;

  const url = extractUrl(payload);
  const headers = extractHeaders(payload);
  const body = extractBody(payload);

  const tokens = [...url, { body }];

  const result = tokens.reduce((obj: object, item: object) => {
    return { ...obj, ...item };
  }, {});

  return { ...result, headers };
}
