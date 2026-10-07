import devxApiReducer, { setDevxApiUrl } from './devxapi.slice';

describe('devxApi slice', () => {
  it('should return initial state', () => {
    const state = devxApiReducer(undefined, { type: 'unknown' });
    expect(state).toHaveProperty('baseUrl');
    expect(state).toHaveProperty('parameters');
  });

  it('should set devx API URL', () => {
    const newState = { baseUrl: 'https://new-api.com', parameters: 'param=value' };
    const state = devxApiReducer(undefined, setDevxApiUrl(newState));
    expect(state).toEqual(newState);
  });
});
