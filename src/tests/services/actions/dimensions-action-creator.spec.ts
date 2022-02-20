import { setDimensions } from '../../../app/services/actions/dimensions-action-creator';
import { RESIZE_SUCCESS } from '../../../app/services/redux-constants';
import { IDimensions } from '../../../types/dimensions';

describe('Sets dimensions on GE', () => {
  it('Sets dimensions', () => {
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
      response: dimensions
    }

    // Act
    const action = setDimensions(dimensions);

    // Assert
    expect(action).toEqual(expectedActions);
  })
});