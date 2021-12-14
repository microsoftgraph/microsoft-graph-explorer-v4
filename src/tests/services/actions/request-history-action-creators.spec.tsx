import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { addHistoryItem, viewHistoryItem } from '../../../app/services/actions/request-history-action-creators';
import { ADD_HISTORY_ITEM_SUCCESS, VIEW_HISTORY_ITEM_SUCCESS } from '../../../app/services/redux-constants';
import { IHistoryItem } from '../../../types/history';

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

  it('Tests viewing history item', () => {
    // Assert
    const response: IHistoryItem = {
      index: 0,
      statusText: 'Something worked!',
      responseHeaders: [],
      result: {},
      url: 'https://graph.microsoft.com/v1.0/me',
      method: 'GET',
      headers: [],
      createdAt: Date.now().toString(),
      status: 200,
      duration: 200
    }

    const expectedAction = {
      type: VIEW_HISTORY_ITEM_SUCCESS,
      response
    }

    // Act
    const store = mockStore({ history: [] });

    // Assert
    // @ts-ignore
    store.dispatch(viewHistoryItem(response));
    expect(store.getActions()).toEqual([expectedAction]);
  })
});

//Add tests for the async functions

