import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { addHistoryItem } from '../../../app/services/actions/request-history-action-creators';
import { ADD_HISTORY_ITEM_SUCCESS } from '../../../app/services/redux-constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Request History Action Creators', () => {
  it('Adds an history item to the store', () => {
    const historyItem = { query: 'test', createdAt: new Date().toISOString() };
    const expectedActions = [
      {
        type: ADD_HISTORY_ITEM_SUCCESS,
        response: historyItem
      }
    ];

    const store = mockStore({ history: []});

    // @ts-ignore
    store.dispatch(addHistoryItem(historyItem));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

