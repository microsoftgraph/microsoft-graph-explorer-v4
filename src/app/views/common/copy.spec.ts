import { genericCopy } from './copy';

describe('Tests generic copy.ts', () => {
  it('should resolve to \'copied\' when genericCopy is called with a string', () => {
    document.execCommand = jest.fn();
    genericCopy('dummy text')
      .then((response: any) => {
        expect(response).toBe('copied');
      })
      .catch((e: Error) => { throw e })
  });
})
