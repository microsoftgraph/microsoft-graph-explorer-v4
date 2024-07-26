import { setDimensions } from '../../../app/services/slices/dimensions.slice';
import { RESIZE_SUCCESS } from '../../../app/services/redux-constants';
import { IDimensions } from '../../../types/dimensions';

describe('Dimensions setting on GE', () => {
  it('should dispatch RESIZE_SUCCESS when setDimensions is called with new dimensions', () => {
    // Arrange
    const dimensions: IDimensions = {
      request: {
        width: '100%',
        height: '36vh'
      },
      response: {
        width: '100%',
        height: '46vh'
      },
      sidebar: {
        width: '100%',
        height: '46vh'
      },
      content: {
        width: '100%',
        height: '46vh'
      }
    }

    const expectedActions = {
      type: RESIZE_SUCCESS,
      payload: dimensions
    }

    // Act
    const action = setDimensions(dimensions);

    // Assert
    expect(action).toEqual(expectedActions);
  })
});