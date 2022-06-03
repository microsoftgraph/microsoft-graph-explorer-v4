type SignCategory = 'paths' | 'properties' | 'parameters';

interface Delimiter {
  symbol: string;
  category: SignCategory;
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
  SLASH: { symbol: '/', category: 'paths' },
  QUESTION_MARK: { symbol: '?', category: 'parameters' },
  EQUALS: { symbol: '=', category: 'properties' },
  COMMA: { symbol: ',', category: 'properties' },
  AMPERSAND: { symbol: '&', category: 'parameters' },
  DOLLAR: { symbol: '$', category: 'parameters' }
};

function getLastDelimiterInUrl(url: string): Delimiter {
  const symbols = Object.values(delimiters);
  symbols.forEach(key => {
    key.index = url.lastIndexOf(key.symbol);
  });
  const lastUsedDelimiter = symbols.reduce((prev, current) => (prev.index > current.index) ? prev : current);
  return lastUsedDelimiter;
}

export { delimiters, getLastDelimiterInUrl }