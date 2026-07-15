const mockDispatch = jest.fn();

jest.mock('../context/popups-context', () => ({
  POPUPS: { ADD_POPUPS: 'ADD_POPUPS', DELETE_POPUPS: 'DELETE_POPUPS' },
  usePopupsDispatchContext: () => mockDispatch,
  usePopupsStateContext: () => ({ popups: [] })
}));
jest.mock('../../views/common/lazy-loader/component-registry/popups', () => ({
  popups: new Map([['test-popup', () => null]])
}));

import { renderHook, act } from '@testing-library/react';
import { usePopups } from './usePopups';

describe('usePopups', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a show function', () => {
    const { result } = renderHook(() => usePopups('test-popup' as any, 'dialog'));
    expect(typeof result.current.show).toBe('function');
  });

  it('dispatches ADD_POPUPS when show is called', () => {
    const { result } = renderHook(() => usePopups('test-popup' as any, 'dialog'));
    act(() => {
      result.current.show({ settings: { title: 'Test' } });
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'ADD_POPUPS' })
    );
  });

  it('returns status and reference', () => {
    const { result } = renderHook(() => usePopups('test-popup' as any, 'dialog', 'my-ref'));
    expect(result.current.reference).toBe('my-ref');
    expect(result.current.status).toBeUndefined();
  });
});
