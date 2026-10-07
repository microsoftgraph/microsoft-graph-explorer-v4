import { ScopesError } from './ScopesError';
import { ClientError } from './ClientError';

describe('ScopesError', () => {
  it('should create error with all properties', () => {
    const error = new ScopesError({
      url: 'https://example.com/permissions',
      message: 'Cannot get scopes',
      messageType: 1,
      status: 403
    });
    expect(error.url).toBe('https://example.com/permissions');
    expect(error.message).toBe('Cannot get scopes');
    expect(error.messageType).toBe(1);
    expect(error.status).toBe(403);
    expect(error.name).toBe('ScopesError');
  });

  it('should create error with default values', () => {
    const error = new ScopesError();
    expect(error.url).toBe('');
    expect(error.message).toBe('');
    expect(error.messageType).toBe(0);
    expect(error.status).toBe(0);
  });

  it('should extend ClientError', () => {
    const error = new ScopesError();
    expect(error).toBeInstanceOf(ClientError);
    expect(error).toBeInstanceOf(Error);
  });
});
