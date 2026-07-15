import proxyReducer, { setGraphProxyUrl } from './proxy.slice';

describe('proxy slice', () => {
  it('should return initial state', () => {
    const state = proxyReducer(undefined, { type: 'unknown' });
    expect(typeof state).toBe('string');
    expect(state).toContain('api/proxy');
  });

  it('should set graph proxy URL', () => {
    const newUrl = 'https://custom-proxy.com/api/proxy';
    const state = proxyReducer(undefined, setGraphProxyUrl(newUrl));
    expect(state).toBe(newUrl);
  });
});
