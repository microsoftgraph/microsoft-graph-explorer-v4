import { stringToHash } from './hash-string';

describe('String to hash should', () => {

  it('return 0 if string is empty', async () => {
    const result = stringToHash('');
    expect(result).toBe(0);
  });

  it('return consistent values for each hashing', async () => {
    const value = 'hello world';
    const result = stringToHash(value);
    const result2 = stringToHash(value);
    expect(result).toBe(result2);
  });
});


