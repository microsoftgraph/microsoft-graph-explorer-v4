import dimensionsReducer, { setDimensions } from './dimensions.slice';
import { IDimensions } from '../../../types/dimensions';

describe('dimensions slice', () => {
  const defaultState: IDimensions = {
    request: { width: '100%', height: '38vh' },
    response: { width: '100%', height: '50vh' },
    sidebar: { width: '28%', height: '' },
    content: { width: '72%', height: '100%' }
  };

  it('should return initial state', () => {
    const state = dimensionsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(defaultState);
  });

  it('should set dimensions', () => {
    const newDimensions: IDimensions = {
      request: { width: '50%', height: '20vh' },
      response: { width: '50%', height: '30vh' },
      sidebar: { width: '40%', height: '' },
      content: { width: '60%', height: '100%' }
    };
    const state = dimensionsReducer(undefined, setDimensions(newDimensions));
    expect(state).toEqual(newDimensions);
  });
});
