import { SignContext } from '..';

interface Delimiter {
  symbol: string;
  context: SignContext;
  index?: number;
}

interface Delimiters {
  SLASH: Delimiter;
  QUESTION_MARK: Delimiter;
  EQUALS: Delimiter;
  COMMA: Delimiter;
  AMPERSAND: Delimiter;
  DOLLAR: Delimiter;
}

const delimiters: Delimiters = {
  SLASH: { symbol: '/', context: 'paths' },
  QUESTION_MARK: { symbol: '?', context: 'parameters' },
  EQUALS: { symbol: '=', context: 'properties' },
  COMMA: { symbol: ',', context: 'properties' },
  AMPERSAND: { symbol: '&', context: 'parameters' },
  DOLLAR: { symbol: '$', context: 'parameters' }
};

function getLastDelimiterInUrl(url: string): Delimiter {
  const symbols: Delimiter[] = Object.values(delimiters);
  for (let i = url.length - 1; i >= 0; i--) {
    const symbol = symbols.find((s) => s.symbol === url[i]);
    if (symbol) {
      symbol.index = i;
      return symbol;
    }
  }
  return delimiters.SLASH;
}


export { delimiters, getLastDelimiterInUrl }