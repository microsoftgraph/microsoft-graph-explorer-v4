import sampleQueryReducer, { setSampleQuery } from './sample-query.slice';
import { IQuery } from '../../../types/query-runner';

describe('sample-query slice', () => {
  const defaultQuery: IQuery = {
    selectedVerb: 'GET',
    sampleHeaders: [],
    sampleUrl: 'https://graph.microsoft.com/v1.0/me',
    sampleBody: undefined,
    selectedVersion: 'v1.0'
  };

  it('should return initial state', () => {
    const state = sampleQueryReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(defaultQuery);
  });

  it('should set sample query', () => {
    const newQuery: IQuery = {
      selectedVerb: 'POST',
      sampleHeaders: [{ name: 'Content-Type', value: 'application/json' }],
      sampleUrl: 'https://graph.microsoft.com/v1.0/users',
      sampleBody: '{"displayName":"Test"}',
      selectedVersion: 'v1.0'
    };
    const state = sampleQueryReducer(undefined, setSampleQuery(newQuery));
    expect(state).toEqual(newQuery);
  });

  it('should replace existing query', () => {
    const query1: IQuery = { ...defaultQuery, selectedVerb: 'POST' };
    const query2: IQuery = { ...defaultQuery, selectedVerb: 'DELETE' };
    let state = sampleQueryReducer(undefined, setSampleQuery(query1));
    state = sampleQueryReducer(state, setSampleQuery(query2));
    expect(state.selectedVerb).toBe('DELETE');
  });
});
