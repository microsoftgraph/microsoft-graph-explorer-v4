import { AnyAction, PayloadAction } from '@reduxjs/toolkit';
import configureMockStore from 'redux-mock-store';
import { ISampleQuery } from '../../../types/query-runner';
import {
  SAMPLES_FETCH_PENDING,
  SAMPLES_FETCH_SUCCESS
} from '../redux-constants';
import { fetchSamples } from '../slices/samples.slice';
import { mockThunkMiddleware } from './mockThunkMiddleware';
import { queries } from '../../views/sidebar/sample-queries/queries';


const mockStore = configureMockStore([mockThunkMiddleware]);

describe('Samples action creators', () => {

  it('should dispatch SAMPLES_FETCH_PENDING when fetchSamples() is called', () => {
    // Arrange
    const expectedActions = [
      {
        type: SAMPLES_FETCH_PENDING,
        payload: undefined
      }
    ];
    const store_ = mockStore({});
    fetchMock.mockResponseOnce(JSON.stringify({ queries }));

    // Act
    store_.dispatch(fetchSamples() as unknown as AnyAction);

    // Assert
    expect(store_.getActions().map(action => {
      const { meta, ...rest } = action;
      return rest;
    })).toEqual(expectedActions);

  });
});
