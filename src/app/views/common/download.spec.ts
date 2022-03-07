import { downloadToLocal } from './download';

window.URL.createObjectURL = jest.fn();

describe('Tests file downloads on resource collections', () => {
  it('Downloads file to local', () => {
    const content = {
      app: '/me'
    }
    const fileName = 'TestFile';

    downloadToLocal(content, fileName);
  })
})