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
  const symbols = Object.values(delimiters);
  symbols.forEach(key => {
    key.index = url.lastIndexOf(key.symbol);
  });
  return symbols.reduce((prev, current) => (prev.index > current.index) ? prev : current);
}

export { delimiters, getLastDelimiterInUrl }