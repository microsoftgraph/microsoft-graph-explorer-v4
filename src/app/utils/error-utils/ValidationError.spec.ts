import { ValidationError } from './ValidationError';

describe('ValidationError', () => {
  it('should create error with message and type', () => {
    const error = new ValidationError('Invalid URL', 'error');
    expect(error.message).toBe('Invalid URL');
    expect(error.type).toBe('error');
    expect(error.name).toBe('ValidationError');
  });

  it('should create warning type error', () => {
    const error = new ValidationError('Possible issue', 'warning');
    expect(error.message).toBe('Possible issue');
    expect(error.type).toBe('warning');
  });

  it('should accept custom name', () => {
    const error = new ValidationError('test', 'error', 'CustomError');
    expect(error.name).toBe('CustomError');
  });

  it('should extend Error', () => {
    const error = new ValidationError('test', 'error');
    expect(error).toBeInstanceOf(Error);
  });

  it('should have default name of ValidationError', () => {
    const error = new ValidationError('test', 'warning');
    expect(error.name).toBe('ValidationError');
  });
});
