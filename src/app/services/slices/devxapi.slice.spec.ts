import devxApiReducer from './devxapi.slice';
import { defaultDevxConfiguration } from '../devx-api';
import { devxAccountSynced } from '../devx-events';

describe('devxApi slice', () => {
  it('should return initial state', () => {
    const state = devxApiReducer(undefined, { type: 'unknown' });
    expect(state.baseUrl).toBe(defaultDevxConfiguration().baseUrl);
    expect(state.custom).toBe(false);
  });

  it('does not accept the old unguarded URL action', () => {
    const state = devxApiReducer(undefined, {
      type: 'devxApi/setDevxApiUrl', payload: { baseUrl: 'https://new-api.com', parameters: 'param=value' }
    });
    expect(state.baseUrl).toBe(defaultDevxConfiguration().baseUrl);
  });

  it('synchronizes account eligibility without enabling customization', () => {
    const state = devxApiReducer(undefined, devxAccountSynced({ accountKey: 'account:tenant', eligible: true }));
    expect(state.eligible).toBe(true);
    expect(state.custom).toBe(false);
  });
});
