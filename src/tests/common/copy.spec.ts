import { genericCopy } from '../../app/views/common/copy';

describe('Tests copy.ts', () => {
  it('Tests generic copy which resolves to an empty object ', () => {
    document.execCommand = jest.fn();
    genericCopy('dummy text')
      .then((response) => {
        expect(response).toBe('copied');
      })
      .catch((e: Error) => { throw e })
  });
})
