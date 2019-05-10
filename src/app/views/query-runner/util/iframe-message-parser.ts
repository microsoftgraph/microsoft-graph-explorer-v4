function isVerb (word: string): boolean {
  return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].indexOf(word) !== -1;
}

function isUrl(word: string): boolean {
  return word.includes('https') && !word.includes('{');
}

function isHeaderKey(word: string): boolean {
  return ['Content-type'].indexOf(word) !== -1;
}

function isHeaderValue(word: string): boolean {
  return ['application/json'].indexOf(word) !== -1;
}

function getBody(payload: string) {
  const NEWLINE = /\n/;
  const OPEN_BRACE = /{/;
  const CLOSING_BRACE = /}/;
  let current = 1;
  let word = '';

  while (current < payload.length) {
    const char = payload[current];
    const foundNewLine = NEWLINE.test(payload[current - 1]);
    const foundOpeningBrace = OPEN_BRACE.test(char);
    const foundClosingBrace = CLOSING_BRACE.test(char);

    if (foundNewLine) {
      if (foundOpeningBrace) {
        let start = current;

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

function tokenize(payload: string) {
  let word = '';
  const tokens = [];

  // tslint:disable-next-line
  for (let i = 0; i < payload.length; i++) {
    const char = payload[i];

    const SPACE = /\s/;
    const NEWLINE = /\n/;

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

      const sanColon = word.replace(/:/g, '');

      if (isHeaderKey(sanColon)) {
        tokens.push({
          headerKey: sanColon
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

export function parse(payload: string): object {
  const tokens = tokenize(payload);

  return tokens.reduce((obj: object, item: object) => {
    return {...obj, ...item};
  }, {});
}
