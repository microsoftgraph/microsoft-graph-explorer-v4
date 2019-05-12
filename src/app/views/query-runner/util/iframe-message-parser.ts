// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

interface IParsedSnippet {
  verb: string;
  url: string;
  headerKey?: string;
  headerValue?: string;
  body?: string;
}

function isVerb(word: string): boolean {
  return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].indexOf(word) !== -1;
}

function isUrl(word: string): boolean {
  /**
   * If a url includes {} that means it is parameterized for example
   * https://graph.microsoft.com/v1.0/users/{id | userPrincipalName}/calendars
   * !word.includes('{') ignores parameterized urls.
   */
  return word.includes('https') && !word.includes('{');
}

function isHeaderKey(word: string): boolean {
  return ['Content-type'].indexOf(word) !== -1;
}

function isHeaderValue(word: string): boolean {
  return ['application/json'].indexOf(word) !== -1;
}

/**
 * Extracts the body from a snippet payload. The payload is preceded by a newline character
 * and between curly braces. The body is also the last part of the snippet payload.
 * 
 * @param payload 
 */
function getBody(payload: string): string {
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
 * tokenize breaks down the snippet payload into the following tokens: verb, url, headerKey, headerValue & body.
 * @param payload 
 */
function tokenize(payload: string): object[] {
  let word = '';
  const tokens = [];

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
        tokens.push({
          verb: word
        });
      }

      if (isUrl(word)) {
        tokens.push({
          url: word
        });
      }

      /**
       * Header keys have a colon post-fixed ie Content-application: This removes the colon
       * so that it becomes Content-application.
       */
      const headerKeyWithoutColon = word.replace(/:/g, '');

      if (isHeaderKey(headerKeyWithoutColon)) {
        tokens.push({
          headerKey: headerKeyWithoutColon
        });
      }

      if (isHeaderValue(word)) {
        tokens.push({
          headerValue: word
        });
      }
      word = '';
    }

  }

  const body = getBody(payload);

  if (body) {
    tokens.push({
      body
    });
  }


  return tokens;
}

/**
 * This parser converts the list of tokens into a javascript object.
 */
export function parse(payload: string): IParsedSnippet | {} {
  const tokens = tokenize(payload);

  return tokens.reduce((obj: object, item: object) => {
    return { ...obj, ...item };
  }, {});
}
