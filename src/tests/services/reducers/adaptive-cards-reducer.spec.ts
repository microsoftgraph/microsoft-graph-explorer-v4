import { adaptiveCard } from '../../../app/services/reducers/adaptive-cards-reducer';
import {
  ADAPTIVE_FETCH_ERROR,
  ADAPTIVE_FETCH_PENDING,
  ADAPTIVE_FETCH_SUCCESS
} from '../../../app/services/redux-constants';

describe('Graph Explorer Adaptive Cards Reducer', () => {
  it('should return initial state', () => {
    const initialState = {
      pending: false,
      data: ''
    };

    const dummyAction = { type: 'Dummy', response: { dummy: 'Dummy' } };
    const newState = adaptiveCard(initialState, dummyAction);

    // expect the initial state if we have an undefined action
    expect(newState).toEqual(initialState);

  });

  it('should handle ADAPTIVE_FETCH_ERROR', () => {
    const initialState = {
      pending: false,
      data: ''
    };

    const errorAction = { type: 'ADAPTIVE_FETCH_ERROR' , response: {} };
    const newState = adaptiveCard(initialState, errorAction);

    const expectedState = {
      pending: false,
      data: null
    };

    // expect null data as there is an error
    expect(expectedState).toEqual(newState);

  });

  it('should handle ADAPTIVE_FETCH_PENDING', () => {
    const initialState = {
      pending: false,
      data: ''
    };

    const errorAction = { type: 'ADAPTIVE_FETCH_PENDING' , response: {} };
    const newState = adaptiveCard(initialState, errorAction);

    const expectedState = {
      pending: true,
      data: null
    };

    // expect that pending set to true
    expect(expectedState).toEqual(newState);

  });

  it('should handle ADAPTIVE_FETCH_SUCCESS', () => {
    const initialState = {
      pending: false,
      data: ''
    };

    const errorAction = { type: 'ADAPTIVE_FETCH_SUCCESS' , response: 'Sample adaptive card data' };
    const newState = adaptiveCard(initialState, errorAction);

    const expectedState = {
      pending: false,
      data: 'Sample adaptive card data'
    };

    // expect that pending is false with data provided
    expect(expectedState).toEqual(newState);

  });

});