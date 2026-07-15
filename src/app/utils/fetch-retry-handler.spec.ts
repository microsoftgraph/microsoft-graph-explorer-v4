import { exponentialFetchRetry } from './fetch-retry-handler';

describe('exponentialFetchRetry', () => {
  it('should return result on first successful call', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const result = await exponentialFetchRetry(fn, 3, 1);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and eventually succeed', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('success');

    const result = await exponentialFetchRetry(fn, 3, 1);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should throw after exhausting all retries', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('persistent failure'));

    await expect(exponentialFetchRetry(fn, 1, 1)).rejects.toThrow('persistent failure');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry when condition returns true', async () => {
    const fn = jest.fn().mockResolvedValue('bad result');
    const condition = jest.fn().mockResolvedValue(true);

    await expect(exponentialFetchRetry(fn, 1, 1, condition))
      .rejects.toThrow('An error occurred during the execution of the request');
  });

  it('should succeed when condition returns false', async () => {
    const fn = jest.fn().mockResolvedValue('good result');
    const condition = jest.fn().mockResolvedValue(false);

    const result = await exponentialFetchRetry(fn, 3, 1, condition);
    expect(result).toBe('good result');
  });

  it('should throw on server error (status >= 500)', async () => {
    const mockResponse = new Response('error', { status: 500 });
    const fn = jest.fn().mockResolvedValue(mockResponse);

    await expect(exponentialFetchRetry(fn, 1, 1))
      .rejects.toThrow('Encountered a server error during execution of the request');
  });

  it('should not throw on successful response (status < 500)', async () => {
    const mockResponse = new Response('ok', { status: 200 });
    const fn = jest.fn().mockResolvedValue(mockResponse);

    const result = await exponentialFetchRetry(fn, 3, 1);
    expect(result).toBe(mockResponse);
  });

  it('should retry multiple times before succeeding', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fail1'))
      .mockRejectedValueOnce(new Error('fail2'))
      .mockResolvedValueOnce('success');

    const result = await exponentialFetchRetry(fn, 3, 1);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
