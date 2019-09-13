import { adaptiveCard } from '../../../app/services/reducers/adaptive-cards-reducer';
import {
  FETCH_ADAPTIVE_CARD_ERROR,
  FETCH_ADAPTIVE_CARD_PENDING,
  FETCH_ADAPTIVE_CARD_SUCCESS
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

  it('should handle FETCH_ADAPTIVE_CARD_ERROR', () => {
    const initialState = {
      pending: false,
      data: ''
    };

    const errorAction = { type: 'FETCH_ADAPTIVE_CARD_ERROR' , response: {} };
    const newState = adaptiveCard(initialState, errorAction);

    const expectedState = {
      pending: false,
      data: null
    };

    // expect null data as there is an error
    expect(expectedState).toEqual(newState);

  });

  it('should handle FETCH_ADAPTIVE_CARD_PENDING', () => {
    const initialState = {
      pending: false,
      data: ''
    };

    const errorAction = { type: 'FETCH_ADAPTIVE_CARD_PENDING' , response: {} };
    const newState = adaptiveCard(initialState, errorAction);

    const expectedState = {
      pending: true,
      data: null
    };

    // expect that pending set to true
    expect(expectedState).toEqual(newState);

  });

  it('should handle FETCH_ADAPTIVE_CARD_SUCCESS', () => {
    const initialState = {
      pending: false,
      data: ''
    };

    const errorAction = { type: 'FETCH_ADAPTIVE_CARD_SUCCESS' , response: 'Sample adaptive card data' };
    const newState = adaptiveCard(initialState, errorAction);

    const expectedState = {
      pending: false,
      data: 'Sample adaptive card data'
    };

    // expect that pending is false with data provided
    expect(expectedState).toEqual(newState);

  });

});