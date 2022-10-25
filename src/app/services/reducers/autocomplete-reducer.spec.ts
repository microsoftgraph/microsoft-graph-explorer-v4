import { AppAction } from '../../../types/action';
import { autoComplete } from '../../../app/services/reducers/autocomplete-reducer';
import {
  AUTOCOMPLETE_FETCH_ERROR, AUTOCOMPLETE_FETCH_PENDING,
  AUTOCOMPLETE_FETCH_SUCCESS
} from '../../../app/services/redux-constants';

const initialState = {
  pending: false,
  data: null,
  error: null
}

describe('Autocomplete reducer', () => {
  it('should handle AUTOCOMPLETE_FETCH_PENDING', () => {
    const action = {
      type: AUTOCOMPLETE_FETCH_PENDING,
      response: null
    }
    const expectedState = {
      pending: true,
      data: null,
      error: null
    }
    expect(autoComplete(initialState, action)).toEqual(expectedState)
  });

  it('should handle AUTOCOMPLETE_FETCH_SUCCESS', () => {
    const action = {
      type: AUTOCOMPLETE_FETCH_SUCCESS,
      response: {
        data: 'test'
      }
    }
    const expectedState = {
      pending: false,
      data: {
        data: 'test'
      },
      error: null
    };
    expect(autoComplete(initialState, action)).toEqual(expectedState)

  });

  it('should handle AUTOCOMPLETE_FETCH_ERROR', () => {
    const action = {
      type: AUTOCOMPLETE_FETCH_ERROR,
      response: 'test'
    }
    const expectedState = {
      pending: false,
      data: null,
      error: 'test'
    }
    expect(autoComplete(initialState, action)).toEqual(expectedState)
  });

  it('should return unaltered state', () => {
    const action = {
      type: '',
      response: null
    }
    const expectedState = {
      pending: false,
      data: null,
      error: null
    }
    expect(autoComplete(initialState, action)).toEqual(expectedState)
  })
})