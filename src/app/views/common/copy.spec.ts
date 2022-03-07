import { genericCopy } from './copy';

describe('Tests copy.ts', () => {
  it('Tests generic copy which resolves to an empty object ', () => {
    document.execCommand = jest.fn();
    genericCopy('dummy text')
      .then((response: any) => {
        expect(response).toBe('copied');
      })
      .catch((e: Error) => { throw e })
  });
})
