import configureMockStore from 'redux-mock-store';


import { PayloadAction } from '@reduxjs/toolkit';
import { IHistoryItem } from '../../../types/history';
import {
  ADD_HISTORY_ITEM_SUCCESS,
  BULK_ADD_HISTORY_ITEMS_SUCCESS,
  REMOVE_ALL_HISTORY_ITEMS_SUCCESS,
  REMOVE_HISTORY_ITEM_SUCCESS
} from '../redux-constants';
import { addHistoryItem, bulkAddHistoryItems, removeAllHistoryItems, removeHistoryItem } from '../slices/history.slice';
import { mockThunkMiddleware } from './mockThunkMiddleware';

const middlewares = [mockThunkMiddleware];
const mockStore = configureMockStore(middlewares);

describe('Request History Action Creators', () => {
  it('should dispatch ADD_HISTORY_ITEM_SUCCESS when a history item is added with addHistoryITem()', () => {
    const historyItem = { query: 'test', createdAt: new Date().toISOString() };
    const expectedActions = [
      {
        type: ADD_HISTORY_ITEM_SUCCESS,
        payload: historyItem
      }
    ];

    const store = mockStore({ history: [] });

    // @ts-ignore
    store.dispatch(addHistoryItem(historyItem));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch REMOVE_HISTORY_ITEM_SUCCESS when a history item is removed', () => {
    // Arrange
    const historyItem: IHistoryItem = {
      index: 0,
      statusText: 'Something worked!',
      responseHeaders: {},
      result: {},
      url: 'https://graph.microsoft.com/v1.0/me',
      method: 'GET',
      headers: [],
      createdAt: Date.now().toString(),
      status: 200,
      duration: 200
    }

    const expectedAction: PayloadAction<IHistoryItem> = {
      type: REMOVE_HISTORY_ITEM_SUCCESS,
      payload: historyItem
    }

    const store = mockStore([historyItem]);

    // Act and Assert
    store.dispatch(removeHistoryItem(historyItem))
    expect(store.getActions()).toEqual([expectedAction]);

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

    const listOfKeys: string[] = [];
    historyItems.forEach(historyItem => {
      listOfKeys.push(historyItem.createdAt);
    });

    const expectedAction: PayloadAction<string[]> = {
      type: REMOVE_ALL_HISTORY_ITEMS_SUCCESS,
      payload: ['12345', '12345']
    }

    const store = mockStore(historyItems);

    // Act and Assert
    store.dispatch(removeAllHistoryItems(listOfKeys))
    expect(store.getActions()).toEqual([expectedAction]);
  });

  it('should dispatch BULK_ADD_HISTORY_ITEMS_SUCCESS when bulkAddHistoryItems() is called', () => {
    // Arrange
    const historyItems: IHistoryItem[] = [
      {
        index: 0,
        statusText: 'OK',
        responseHeaders: {},
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
        responseHeaders: {},
        result: {},
        url: 'https://graph.microsoft.com/v1.0/me/events',
        method: 'GET',
        headers: [],
        createdAt: '12345',
        status: 200,
        duration: 200
      }
    ]

    const expectedAction: PayloadAction<IHistoryItem[]> = {
      type: BULK_ADD_HISTORY_ITEMS_SUCCESS,
      payload: historyItems
    }

    const store = mockStore([]);

    // Act and Assert
    store.dispatch(bulkAddHistoryItems(historyItems));
    expect(store.getActions()).toEqual([expectedAction]);
  })
});
