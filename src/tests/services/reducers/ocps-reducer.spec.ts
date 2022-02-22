import { policies } from '../../../app/services/reducers/ocps-reducers';
import { GET_POLICY_ERROR, GET_POLICY_PENDING, GET_POLICY_SUCCESS } from '../../../app/services/redux-constants';

const initialState = {
  pending: false,
  data: {},
  error: null
}

describe('OCPS Reducer', () => {
  it('should handle GET_POLICY_SUCCESS', () => {
    const action = {
      type: GET_POLICY_SUCCESS,
      response: {
        policies: ['policy1', 'policy2']
      }
    }
    const expectedState = {
      pending: false,
      data: {
        policies: ['policy1', 'policy2']
      },
      error: null
    }

    const newState = policies(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle GET_POLICY_ERROR', () => {
    const action = {
      type: GET_POLICY_ERROR,
      response: 'error'
    }
    const expectedState = {
      pending: false,
      data: null,
      error: 'error'
    }

    const newState = policies(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle GET_POLICY_PENDING', () => {
    const action = {
      type: GET_POLICY_PENDING,
      response: ''
    }
    const expectedState = {
      pending: true,
      data: null,
      error: null
    }

    const newState = policies(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should return default state', () => {
    const action = {
      type: '',
      response: ''
    }
    const expectedState = {
      pending: false,
      data: {},
      error: null
    }

    const newState = policies(initialState, action);
    expect(newState).toEqual(expectedState);
  })
})