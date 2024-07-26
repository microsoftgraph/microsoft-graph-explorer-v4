import { PayloadAction } from '@reduxjs/toolkit';

import { RESPONSE_EXPANDED } from '../../../app/services/redux-constants';
import { expandResponseArea } from '../slices/response-area-expanded.slice';

describe('Response Area Expansion', () => {
  it('should dispatch RESPONSE_EXPANDED when expandResponseArea() is called', () => {
    //Arrange
    const payload: boolean = true;

    const expectedAction: PayloadAction<boolean> = {
      type: RESPONSE_EXPANDED,
      payload
    }

    // Act
    const action = expandResponseArea(payload);

    // Assert
    expect(action).toEqual(expectedAction);
  })
})