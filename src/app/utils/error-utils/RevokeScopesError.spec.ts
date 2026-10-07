import { RevokeScopesError } from './RevokeScopesError';
import { ClientError } from './ClientError';

describe('RevokeScopesError', () => {
  it('should create error with all properties', () => {
    const error = new RevokeScopesError({
      errorText: 'Failed to revoke',
      statusText: 'Forbidden',
      messageType: 1,
      status: '403'
    });
    expect(error.errorText).toBe('Failed to revoke');
    expect(error.statusText).toBe('Forbidden');
    expect(error.messageType).toBe(1);
    expect(error.status).toBe('403');
    expect(error.name).toBe('RevokeScopesError');
  });

  it('should create error with default values', () => {
    const error = new RevokeScopesError();
    expect(error.errorText).toBe('');
    expect(error.statusText).toBe('');
    expect(error.messageType).toBe(0);
    expect(error.status).toBe('');
  });

  it('should extend ClientError', () => {
    const error = new RevokeScopesError();
    expect(error).toBeInstanceOf(ClientError);
    expect(error).toBeInstanceOf(Error);
  });
});
