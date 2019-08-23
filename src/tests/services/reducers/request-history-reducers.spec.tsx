import { requestHistory } from '../../../app/services/reducers/request-history-reducers';
import { ADD_HISTORY_ITEM_SUCCESS } from '../../../app/services/redux-constants';


describe('Request History Reducer', () => {
  it('should return initial state', () => {
    const initialState: any = [];
    const dummyHistoryItem: any = [{ name: 'Key', value: 'Value' }];
    const newState = requestHistory(initialState, dummyHistoryItem);

    expect(newState).toEqual(initialState);
  });

  it('should handle ADD_HISTORY_ITEM_SUCCESS', () => {
    const initialState: any = [];
    const dummy = { query: 'query', createdAt: new Date().toISOString() };
    const queryAction = {
      type: ADD_HISTORY_ITEM_SUCCESS,
      response: dummy
    };

    const newState = requestHistory(initialState, queryAction);

    expect(newState).toEqual([dummy]);
  });

});
