import queryStatusReducer, { setQueryResponseStatus, clearQueryStatus } from './query-status.slice';
import { LOGOUT_SUCCESS, QUERY_GRAPH_RUNNING } from '../redux-constants';
import { IStatus } from '../../../types/status';

describe('query-status slice', () => {
  it('should return initial state as null', () => {
    const state = queryStatusReducer(undefined, { type: 'unknown' });
    expect(state).toBeNull();
  });

  it('should set query response status', () => {
    const status: IStatus = {
      ok: true,
      status: 200,
      statusText: 'OK',
      messageBarType: 'success'
    };
    const state = queryStatusReducer(null, setQueryResponseStatus(status));
    expect(state).toEqual(status);
  });

  it('should clear query status', () => {
    const currentStatus: IStatus = {
      ok: true,
      status: 200,
      statusText: 'OK',
      messageBarType: 'success'
    };
    const state = queryStatusReducer(currentStatus, clearQueryStatus());
    expect(state).toBeNull();
  });

  it('should reset on QUERY_GRAPH_RUNNING', () => {
    const currentStatus: IStatus = {
      ok: true,
      status: 200,
      statusText: 'OK',
      messageBarType: 'success'
    };
    const state = queryStatusReducer(currentStatus, { type: QUERY_GRAPH_RUNNING });
    expect(state).toBeNull();
  });

  it('should reset on LOGOUT_SUCCESS', () => {
    const currentStatus: IStatus = {
      ok: true,
      status: 200,
      statusText: 'OK',
      messageBarType: 'success'
    };
    const state = queryStatusReducer(currentStatus, { type: LOGOUT_SUCCESS });
    expect(state).toBeNull();
  });
});
