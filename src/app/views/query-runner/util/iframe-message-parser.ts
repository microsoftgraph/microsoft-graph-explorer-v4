// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

function isVerb(word: string): boolean {
  return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].indexOf(word) !== -1;
}

function isUrl(word: string): boolean {
  /**
   * If a url includes {} that means it is parameterized for example
   * https://graph.microsoft.com/v1.0/users/{id | userPrincipalName}/calendars
   * !word.includes('{') ignores parameterized urls.
   */
  return word.includes('https');
}

/**
 * Extracts the body from a snippet payload. The payload is preceded by a newline character
 * and between curly braces. The body is also the last part of the snippet payload.
 * 
 * @param payload 
 */
export function getBody(payload: string): string {
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

export function getHeaders(payload: string) {
  const SPACE = /\s/;
  const NEWLINE = /\n/;

  const headers: any = [];
  let header: any = {};
  let newlineCount = 0;
  let positionOfSecondNewLine = 0;
  let word = '';

  for (let i = 0; i < payload.length; i++) {
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

            header[spl[0]] = spl[1];
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
export function getUrl(payload: string) {
  let word = '';
  const result = [];

  // tslint:disable-next-line
  for (let i = 0; i < payload.length; i++) {
    const char = payload[i];

    const SPACE = /\s/;
    const NEWLINE = /\n/;

    /**
     * The tokens [verb, url, headerKey, headerValue, body] are separated by either a space or a newline.
     * When we encounter a delimeter we check what type of token it is and push it into the list of
     * tokens.
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
  const url = getUrl(payload);
  const headers = getHeaders(payload);
  const body = getBody(payload);

  const tokens = [...url, ...headers, { body }];

  return tokens.reduce((obj: object, item: object) => {
    return { ...obj, ...item };
  }, {});
}
