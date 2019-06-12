import { removeRequestHeader } from '../../../app/services/actions/request-headers-action-creators';
import { headersAdded } from '../../../app/services/reducers/request-headers-reducers';
import { HEADER_ADD_SUCCESS, HEADER_REMOVE_SUCCESS } from '../../../app/services/redux-constants';


describe('Request Headers Reducer', () => {
  it('should return initial state', () => {
    const initialState: any = [];
    const dummyHeader: any = [{ name: 'Key', value: 'Value' }];
    const newState = headersAdded(initialState, dummyHeader);

    expect(newState).toEqual(initialState);
  });

  it('should handle HEADER_ADD_SUCCESS', () => {
    const initialState: any = [];

    const queryAction = { type: HEADER_ADD_SUCCESS, response: [{ name: 'Key', value: 'Value' }] };
    const newState = headersAdded(initialState, queryAction);

    expect(newState).toEqual([{ name: 'Key', value: 'Value' }]);
  });

});
