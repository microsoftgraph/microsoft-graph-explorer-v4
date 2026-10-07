import historyReducer, {
  addHistoryItem,
  bulkAddHistoryItems,
  removeHistoryItem,
  removeAllHistoryItems
} from './history.slice';
import { IHistoryItem } from '../../../types/history';

describe('history slice', () => {
  const createHistoryItem = (createdAt: string): IHistoryItem => ({
    index: 0,
    url: 'https://graph.microsoft.com/v1.0/me',
    method: 'GET',
    headers: [],
    body: undefined,
    responseHeaders: {},
    createdAt,
    status: 200,
    statusText: 'OK',
    duration: 100,
    result: {}
  });

  it('should return initial state', () => {
    const state = historyReducer(undefined, { type: 'unknown' });
    expect(state).toEqual([]);
  });

  it('should add a history item', () => {
    const item = createHistoryItem('2024-01-01T00:00:00Z');
    const state = historyReducer([], addHistoryItem(item));
    expect(state).toHaveLength(1);
    expect(state[0].url).toBe('https://graph.microsoft.com/v1.0/me');
  });

  it('should bulk add history items', () => {
    const items = [
      createHistoryItem('2024-01-01T00:00:00Z'),
      createHistoryItem('2024-01-02T00:00:00Z')
    ];
    const state = historyReducer([], bulkAddHistoryItems(items));
    expect(state).toHaveLength(2);
  });

  it('should remove a history item', () => {
    const item1 = createHistoryItem('2024-01-01T00:00:00Z');
    const item2 = createHistoryItem('2024-01-02T00:00:00Z');
    const initialState = [item1, item2];
    const state = historyReducer(initialState, removeHistoryItem(item1));
    expect(state).toHaveLength(1);
    expect(state[0].createdAt).toBe('2024-01-02T00:00:00Z');
  });

  it('should remove all specified history items', () => {
    const item1 = createHistoryItem('2024-01-01T00:00:00Z');
    const item2 = createHistoryItem('2024-01-02T00:00:00Z');
    const item3 = createHistoryItem('2024-01-03T00:00:00Z');
    const initialState = [item1, item2, item3];
    const state = historyReducer(initialState, removeAllHistoryItems([
      '2024-01-01T00:00:00Z',
      '2024-01-02T00:00:00Z'
    ]));
    expect(state).toHaveLength(1);
    expect(state[0].createdAt).toBe('2024-01-03T00:00:00Z');
  });

  it('should not remove items when no match', () => {
    const item = createHistoryItem('2024-01-01T00:00:00Z');
    const state = historyReducer([item], removeAllHistoryItems(['2024-12-31T00:00:00Z']));
    expect(state).toHaveLength(1);
  });
});
