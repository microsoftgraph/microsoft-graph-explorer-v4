import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  addHistoryItem, viewHistoryItem, removeHistoryItem,
  bulkRemoveHistoryItems,
  bulkAddHistoryItems
} from './request-history-action-creators';
import {
  ADD_HISTORY_ITEM_SUCCESS, VIEW_HISTORY_ITEM_SUCCESS,
  REMOVE_HISTORY_ITEM_SUCCESS,
  REMOVE_ALL_HISTORY_ITEMS_SUCCESS,
  BULK_ADD_HISTORY_ITEMS_SUCCESS
} from '../redux-constants';
import { IHistoryItem } from '../../../types/history';
import { AppAction } from '../../../types/action';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Request History Action Creators', () => {
  it('should dispatch ADD_HISTORY_ITEM_SUCCESS when a history item is added with addHistoryITem()', () => {
    const historyItem = { query: 'test', createdAt: new Date().toISOString() };
    const expectedActions = [
      {
        type: ADD_HISTORY_ITEM_SUCCESS,
        response: historyItem
      }
    ];

    const store = mockStore({ history: [] });

    // @ts-ignore
    store.dispatch(addHistoryItem(historyItem));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch VIEW_HISTORY_ITEM_SUCCESS when viewHistoryItem() is called with a valid history item', () => {
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

    const expectedAction: AppAction = {
      type: VIEW_HISTORY_ITEM_SUCCESS,
      response
    }

    // Act
    const store = mockStore({ history: [] });

    // Assert
    // @ts-ignore
    store.dispatch(viewHistoryItem(response));
    expect(store.getActions()).toEqual([expectedAction]);
  });

  it('should dispatch REMOVE_HISTORY_ITEM_SUCCESS when a history item is removed', () => {
    // Arrange
    const historyItem: IHistoryItem = {
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

    const expectedAction: AppAction = {
      type: REMOVE_HISTORY_ITEM_SUCCESS,
      response: historyItem
    }

    const store = mockStore([historyItem]);

    // Act and Assert
    // @ts-ignore
    store.dispatch(removeHistoryItem(historyItem))
      .then(() => {
        expect(store.getActions()).toEqual([expectedAction]);
      })

  });

  it('should dispatch REMOVE_ALL_HISTORY_ITEMS_SUCCESS when bulkRemoveHistoryItems() is called', () => {
    // Arrange
    const historyItems = [
      {
        index: 0,
        statusText: 'Something worked!',
        responseHeaders: [],
        result: {},
        url: 'https://graph.microsoft.com/v1.0/me',
        method: 'GET',
        headers: [],
        createdAt: '12345',
        status: 200,
        duration: 200
      },
      {
        index: 1,
        statusText: 'Another history item!',
        responseHeaders: [],
        result: {},
        url: 'https://graph.microsoft.com/v1.0/me/events',
        method: 'GET',
        headers: [],
        createdAt: '12345',
        status: 200,
        duration: 200
      }
    ]

    const expectedAction: AppAction = {
      type: REMOVE_ALL_HISTORY_ITEMS_SUCCESS,
      response: ['12345', '12345']
    }

    const store = mockStore(historyItems);

    // Act and Assert
    // @ts-ignore
    store.dispatch(bulkRemoveHistoryItems(historyItems))
      .then(() => {
        expect(store.getActions()).toEqual([expectedAction]);
      })
  });

  it('should dispatch BULK_ADD_HISTORY_ITEMS_SUCCESS when bulkAddHistoryItems() is called', () => {
    // Arrange
    const historyItems = [
      {
        index: 0,
        statusText: 'OK',
        responseHeaders: [],
        result: {},
        url: 'https://graph.microsoft.com/v1.0/me',
        method: 'GET',
        headers: [],
        createdAt: '12345',
        status: 200,
        duration: 200
      },
      {
        index: 1,
        statusText: 'OK',
        responseHeaders: [],
        result: {},
        url: 'https://graph.microsoft.com/v1.0/me/events',
        method: 'GET',
        headers: [],
        createdAt: '12345',
        status: 200,
        duration: 200
      }
    ]

    const expectedAction: AppAction = {
      type: BULK_ADD_HISTORY_ITEMS_SUCCESS,
      response: historyItems
    }

    const store = mockStore([]);

    // Act and Assert
    store.dispatch(bulkAddHistoryItems(historyItems));
    expect(store.getActions()).toEqual([expectedAction]);
  })
});
