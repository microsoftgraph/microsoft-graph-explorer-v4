/* eslint-disable max-len */
import { setStatusMessage } from './status-message';

describe('status message should', () => {

  it('return a status message given a status code', () => {
    const statusCode: number = 200;
    const statusMessage = setStatusMessage(statusCode);
    expect(statusMessage).toBe('OK');
  })

});