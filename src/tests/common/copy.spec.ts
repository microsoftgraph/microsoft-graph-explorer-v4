import { genericCopy, copy, trackedGenericCopy } from '../../app/views/common/copy';

describe('Tests copy.ts', () => {
  it('Tests generic copy which resolves to an empty object ', () => {
    document.execCommand = jest.fn();
    genericCopy('dummy text')
      .then((response) => {
        expect(response).toBe('copied');
      })
  });

  // it('Tests copy function', () => {
  //   const textArea: any = document.getElementById('textArea');
  //   textArea.focus = jest.fn();
  //   textArea.blur = jest.fn();
  //   textArea.select = jest.fn();
  //   document.execCommand = jest.fn();
  //   copy('dummy text')
  //     .then((response) => {
  //       expect(response).toBe('copied');
  //     })
  // })
})
