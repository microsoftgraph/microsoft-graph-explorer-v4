import { ClientError } from './ClientError';

describe('ClientError', () => {
  it('should create error with message', () => {
    const error = new ClientError({ error: 'Something went wrong' });
    expect(error.message).toBe('Something went wrong');
    expect(error.name).toBe('Client Error');
    expect(error instanceof Error).toBe(true);
  });

  it('should create error with default empty message', () => {
    const error = new ClientError();
    expect(error.message).toBe('');
    expect(error.name).toBe('Client Error');
  });

  it('should be instanceof Error', () => {
    const error = new ClientError({ error: 'test' });
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ClientError);
  });
});
