import { getTokens } from './tokens';

describe('Tests getTokens function', () => {
  it('should return an array of IToken objects', () => {
    // Arrange, Act and Assert
    const tokens = getTokens();
    expect(tokens.length).toBe(34);
  })
})