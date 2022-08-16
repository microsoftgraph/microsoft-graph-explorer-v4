import { ValidatedUrl } from './abnf';

describe('Abnf parser should', () => {
  it('return no errors', () => {
    const result = new ValidatedUrl().validate();
    expect(result).toBe(true);
  });
});