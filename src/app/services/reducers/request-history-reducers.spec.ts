import { history } from './request-history-reducers';
import {
  ADD_HISTORY_ITEM_SUCCESS, REMOVE_ALL_HISTORY_ITEMS_SUCCESS,
  REMOVE_HISTORY_ITEM_SUCCESS
} from '../redux-constants';


describe('Request History Reducer', () => {
  it('should return initial state', () => {
    const initialState: any = [];
    const dummyHistoryItem: any = [{ name: 'Key', value: 'Value' }];
    const newState = history(initialState, dummyHistoryItem);

    expect(newState).toEqual(initialState);
  });

  it('should handle ADD_HISTORY_ITEM_SUCCESS', () => {
    const initialState: any = [];
    const dummy = { query: 'query', createdAt: new Date().toISOString() };
    const queryAction = {
      type: ADD_HISTORY_ITEM_SUCCESS,
      response: dummy
    };

    const newState = history(initialState, queryAction);

    expect(newState).toEqual([dummy]);
  });

  it('should handle REMOVE_HISTORY_ITEM_SUCCESS', () => {
    const initialState = [
      1, 2
    ]

    const expectedState = [
      1
    ]

    const action = {
      type: REMOVE_HISTORY_ITEM_SUCCESS,
      response: 2
    }

    const newState = history(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle REMOVE_ALL_HISTORY_ITEMS_SUCCESS', () => {
    const initialState = [
      {
        index: 0
      }
    ]

    const expectedState: any = [
      {
        index: 0
      }
    ]

    const action = {
      type: REMOVE_ALL_HISTORY_ITEMS_SUCCESS,
      response: initialState
    }

    const newState = history(initialState, action);
    expect(newState).toEqual(expectedState);
  })

});
