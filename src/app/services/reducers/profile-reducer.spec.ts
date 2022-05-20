import { profile } from '../../../app/services/reducers/profile-reducer';
import { LOGOUT_SUCCESS, PROFILE_REQUEST_SUCCESS } from '../../../app/services/redux-constants';

const initialState = null;

describe('Profile reducer', () => {
  it('should handle LOGOUT_SUCCESS', () => {
    const action = {
      type: LOGOUT_SUCCESS,
      response: null
    }

    const expectedState = null;

    const newState = profile(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle PROFILE_REQUEST_SUCCESS', () => {
    const action = {
      type: PROFILE_REQUEST_SUCCESS,
      response: {
        name: 'John Doe',
        email: '',
        phone: '',
        address: '',
        city: ''
      }
    }

    const expectedState = {
      name: 'John Doe',
      email: '',
      phone: '',
      address: '',
      city: ''
    };

    const newState = profile(initialState, action);
    expect(newState).toEqual(expectedState);
  })
})