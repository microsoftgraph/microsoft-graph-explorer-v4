import { ClientError } from './ClientError';

describe('ClientError (utils)', () => {
  it('creates error with message', () => {
    const error = new ClientError({ error: 'test error' });
    expect(error.message).toBe('test error');
    expect(error.name).toBe('Client Error');
    expect(error).toBeInstanceOf(Error);
  });

  it('creates error with default empty message', () => {
    const error = new ClientError();
    expect(error.message).toBe('');
  });
});
