// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

function isVerb(word: string): boolean {
  return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].indexOf(word) !== -1;
}

function isUrl(word: string): boolean {
  return word.includes('https');
}

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
export function extractBody(payload: string): string {
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
export function extractHeaders(payload: string): object[] {
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
      while (true) {

        for (let n = positionOfSecondNewLine + 1; n < payload.length; n++) {
          const char = payload[n];
          const nextChar = payload[n + 1];
          const isDelimeter =  NEWLINE.test(char);


          word += char;
          if (isDelimeter) {
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
  }
  return headers;
}

/**
 * tokenize breaks down the snippet payload into the following tokens: verb, url, headerKey, headerValue & body.
 * @param payload 
 */
export function extractUrl(payload: string) {
  let word = '';
  const result = [];

  // tslint:disable-next-line
  for (let i = 0; i < payload.length; i++) {
    const char = payload[i];

    const SPACE = /\s/;
    const NEWLINE = /\n/;

    /**
     * The tokens [verb, url] are separated by either a space or a newline.
     * When we encounter a delimeter we check what type of token it is and push it into result.
     */
    const isDelimeter = SPACE.test(char) || NEWLINE.test(char);
    word += char;

    if (isDelimeter) {

      word = word.trim();
      if (isVerb(word)) {
        result.push({
          verb: word
        });
      }

      if (isUrl(word)) {
        result.push({
          url: word
        });
      }
      word = '';
    }
  }

  return result;
}

export function parse(payload: string) {
  const url = extractUrl(payload);
  const headers = extractHeaders(payload);
  const body = extractBody(payload);

  const tokens = [...url, ...headers, { body }];

  return tokens.reduce((obj: object, item: object) => {
    return { ...obj, ...item };
  }, {});
}
